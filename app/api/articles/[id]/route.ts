import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

// Récupérer un article par ID ou slug
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";
    
    // Déterminer si on cherche par ID ou par slug
    const where = id.length > 20 ? { id } : { slug: id };
    
    // Récupérer l'article
    const article = await prisma.article.findUnique({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true
          }
        },
        categories: true,
        tags: true,
        comments: {
          where: {},
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    
    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }
    
    // Vérifier si l'article est publié ou si l'utilisateur est autorisé à le voir
    if (!article.published && !isAdmin && session?.user?.id !== article.author.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    // Incrémenter le compteur de vues si ce n'est pas l'auteur qui consulte
    if (session?.user?.id !== article.author.id) {
      // Utiliser un identifiant de session pour éviter les comptages multiples
      const sessionId = request.cookies.get("sessionId")?.value || "anonymous";
      
      // Vérifier si cette vue existe déjà
      const existingView = await prisma.view.findUnique({
        where: {
          articleId_sessionId: {
            articleId: article.id,
            sessionId
          }
        }
      });
      
      if (!existingView) {
        // Créer une nouvelle vue
        await Promise.all([
          prisma.view.create({
            data: {
              article: { connect: { id: article.id } },
              sessionId
            }
          }),
          prisma.article.update({
            where: { id: article.id },
            data: { viewCount: { increment: 1 } }
          })
        ]);
      }
    }
    
    // Vérifier si l'utilisateur a aimé cet article
    let userLiked = false;
    if (session?.user?.id) {
      const like = await prisma.like.findUnique({
        where: {
          articleId_userId: {
            articleId: article.id,
            userId: session.user.id
          }
        }
      });
      userLiked = !!like;
    }
    
    return NextResponse.json({
      ...article,
      userLiked
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 }
    );
  }
}

// Mettre à jour un article
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const articleId = params.id;
    
    // Vérifier si l'utilisateur est connecté
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    // Récupérer l'article existant
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        authorId: true,
        title: true
      }
    });
    
    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }
    
    // Vérifier si l'utilisateur est autorisé (auteur ou admin)
    const isAdmin = session.user.role === "ADMIN";
    if (article.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validation des données
    const updateSchema = z.object({
      title: z.string().min(3).optional(),
      content: z.string().min(10).optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional(),
      published: z.boolean().optional(),
      featured: z.boolean().optional(),
      categoryIds: z.array(z.string()).optional(),
      tagIds: z.array(z.string()).optional(),
    });
    
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Seul un admin peut mettre en avant un article
    if (body.featured !== undefined && !isAdmin) {
      delete body.featured;
    }
    
    // Générer un nouveau slug si le titre est modifié
    let slug;
    if (body.title && body.title !== article.title) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Vérifier si le nouveau slug existe déjà
      const existingArticle = await prisma.article.findUnique({
        where: { slug }
      });
      
      if (existingArticle && existingArticle.id !== articleId) {
        return NextResponse.json(
          { error: "Un article avec ce titre existe déjà" },
          { status: 409 }
        );
      }
    }
    
    // Préparer les données à mettre à jour
    const updateData: any = {};
    
    if (body.title) updateData.title = body.title;
    if (slug) updateData.slug = slug;
    if (body.content) updateData.content = body.content;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.published !== undefined) updateData.published = body.published;
    if (body.featured !== undefined) updateData.featured = body.featured;
    
    // Mettre à jour les catégories si spécifiées
    if (body.categoryIds) {
      updateData.categories = {
        set: [],
        connect: body.categoryIds.map((id: any) => ({ id }))
      };
    }
    
    // Mettre à jour les tags si spécifiés
    if (body.tagIds) {
      updateData.tags = {
        set: [],
        connect: body.tagIds.map((id: any) => ({ id }))
      };
    }
    
    // Mettre à jour l'article
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        categories: true,
        tags: true
      }
    });
    
    return NextResponse.json({
      message: "Article mis à jour avec succès",
      article: updatedArticle
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
      { status: 500 }
    );
  }
}

// Supprimer un article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const articleId = params.id;
    
    // Vérifier si l'utilisateur est connecté
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    // Récupérer l'article existant
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        authorId: true
      }
    });
    
    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }
    
    // Vérifier si l'utilisateur est autorisé (auteur ou admin)
    const isAdmin = session.user.role === "ADMIN";
    if (article.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    // Supprimer l'article
    await prisma.article.delete({
      where: { id: articleId }
    });
    
    return NextResponse.json({
      message: "Article supprimé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 }
    );
  }
}