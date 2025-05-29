import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

// Récupérer une catégorie par ID ou slug
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const includeArticles = request.nextUrl.searchParams.get("includeArticles") === "true";
    
    // Déterminer si on cherche par ID ou par slug
    const where = id.length > 20 ? { id } : { slug: id };
    
    // Récupérer la catégorie
    const category = await prisma.category.findUnique({
      where,
      include: {
        articles: includeArticles ? {
          where: { published: true },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            createdAt: true,
            viewCount: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            _count: {
              select: {
                comments: true,
                likes: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        } : false,
        _count: {
          select: {
            articles: true
          }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la catégorie" },
      { status: 500 }
    );
  }
}

// Mettre à jour une catégorie (admin uniquement)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const categoryId = params.id;
    
    // Vérifier si l'utilisateur est un admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validation des données
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().optional()
    });
    
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }
    
    // Générer un nouveau slug si le nom est modifié
    let slug;
    if (body.name && body.name !== category.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Vérifier si le nouveau slug existe déjà
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { name: body.name },
            { slug }
          ],
          NOT: { id: categoryId }
        }
      });
      
      if (existingCategory) {
        return NextResponse.json(
          { error: "Une catégorie avec ce nom existe déjà" },
          { status: 409 }
        );
      }
    }
    
    // Mettre à jour la catégorie
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: body.name,
        slug,
        description: body.description
      }
    });
    
    return NextResponse.json({
      message: "Catégorie mise à jour avec succès",
      category: updatedCategory
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie" },
      { status: 500 }
    );
  }
}

// Supprimer une catégorie (admin uniquement)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const categoryId = params.id;
    
    // Vérifier si l'utilisateur est un admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    // Vérifier si la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }
    
    // Avertir si la catégorie est utilisée par des articles
    if (category._count.articles > 0) {
      return NextResponse.json(
        { error: `Cette catégorie est utilisée par ${category._count.articles} article(s). Veuillez d'abord modifier ces articles.` },
        { status: 400 }
      );
    }
    
    // Supprimer la catégorie
    await prisma.category.delete({
      where: { id: categoryId }
    });
    
    return NextResponse.json({
      message: "Catégorie supprimée avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}