import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Schéma de validation pour la création d'un like
const LikeCreateSchema = z.object({
  articleId: z.string().min(1, { message: "L'ID de l'article est requis" }),
});

// GET /api/likes - Récupérer les likes (avec filtrage par article ou utilisateur)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    const userId = searchParams.get("userId");

    // Construire la requête avec les filtres
    const where = {};
    if (articleId) {
      where.articleId = articleId;
    }
    if (userId) {
      where.userId = userId;
    }

    // Récupérer les likes
    const likes = await prisma.like.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Compter le nombre total de likes
    const total = await prisma.like.count({ where });

    return NextResponse.json({
      likes,
      total,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des likes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des likes" },
      { status: 500 }
    );
  }
}

// POST /api/likes - Créer un nouveau like
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour aimer un article" },
        { status: 401 }
      );
    }

    // Valider les données
    const body = await request.json();
    const validation = LikeCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { articleId } = validation.data;

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

    // Vérifier si l'utilisateur a déjà aimé cet article
    const existingLike = await prisma.like.findFirst({
      where: {
        articleId,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: "Vous avez déjà aimé cet article" },
        { status: 400 }
      );
    }

    // Créer le like
    const like = await prisma.like.create({
      data: {
        article: {
          connect: { id: articleId },
        },
        user: {
          connect: { id: session.user.id },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du like:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du like" },
      { status: 500 }
    );
  }
}