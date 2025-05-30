import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Schéma de validation pour la création d'un commentaire
const CommentCreateSchema = z.object({
  content: z.string().min(1, { message: "Le contenu est requis" }),
  articleId: z.string().min(1, { message: "L'ID de l'article est requis" }),
});

// GET /api/comments - Récupérer tous les commentaires (avec pagination et filtrage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construire la requête avec les filtres
    
    const where = {};
    if (articleId) {
      where.articleId = articleId;
    }

    // Récupérer les commentaires avec pagination
    const comments = await prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Compter le nombre total de commentaires pour la pagination
    const total = await prisma.comment.count({ where });

    return NextResponse.json({
      comments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commentaires" },
      { status: 500 }
    );
  }
}

// POST /api/comments - Créer un nouveau commentaire
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour commenter" },
        { status: 401 }
      );
    }

    // Valider les données
    const body = await request.json();
    const validation = CommentCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { content, articleId } = validation.data;

    // Vérifier si l'article existe
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json(
        { error: "L'article n'existe pas" },
        { status: 404 }
      );
    }

    // Créer le commentaire
    const comment = await prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: articleId },
        },
        author: {
          connect: { id: session.user.id },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du commentaire" },
      { status: 500 }
    );
  }
}