import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

// Récupérer un tag par ID ou slug
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const includeArticles = request.nextUrl.searchParams.get("includeArticles") === "true";
    
    // Déterminer si on cherche par ID ou par slug
    const where = id.length > 20 ? { id } : { slug: id };
    
    // Récupérer le tag
    const tag = await prisma.tag.findUnique({
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
    
    if (!tag) {
      return NextResponse.json(
        { error: "Tag non trouvé" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error("Erreur lors de la récupération du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du tag" },
      { status: 500 }
    );
  }
}

// Mettre à jour un tag (admin uniquement)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const tagId = params.id;
    
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
      name: z.string().min(2, "Le nom doit contenir au moins 2 caractères")
    });
    
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Vérifier si le tag existe
    const tag = await prisma.tag.findUnique({
      where: { id: tagId }
    });
    
    if (!tag) {
      return NextResponse.json(
        { error: "Tag non trouvé" },
        { status: 404 }
      );
    }
    
    // Générer un nouveau slug si le nom est modifié
    let slug;
    if (body.name && body.name !== tag.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Vérifier si le nouveau slug existe déjà
      const existingTag = await prisma.tag.findFirst({
        where: {
          OR: [
            { name: body.name },
            { slug }
          ],
          NOT: { id: tagId }
        }
      });
      
      if (existingTag) {
        return NextResponse.json(
          { error: "Un tag avec ce nom ou ce slug existe déjà" },
          { status: 400 }
        );
      }
    }
    
    // Mettre à jour le tag
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name: body.name,
        ...(slug && { slug })
      },
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du tag" },
      { status: 500 }
    );
  }
}

// Supprimer un tag (admin uniquement)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const tagId = params.id;
    
    // Vérifier si l'utilisateur est un admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    // Vérifier si le tag existe
    const tag = await prisma.tag.findUnique({
      where: { id: tagId }
    });
    
    if (!tag) {
      return NextResponse.json(
        { error: "Tag non trouvé" },
        { status: 404 }
      );
    }
    
    // Supprimer le tag
    await prisma.tag.delete({
      where: { id: tagId }
    });
    
    return NextResponse.json({ message: "Tag supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du tag" },
      { status: 500 }
    );
  }
}