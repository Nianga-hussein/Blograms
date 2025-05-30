import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { z } from "zod";

// Schéma de validation pour l'enregistrement d'une vue
const ViewCreateSchema = z.object({
  articleId: z.string().min(1, { message: "L'ID de l'article est requis" }),
  sessionId: z.string().min(1, { message: "L'ID de session est requis" }),
});

// POST /api/views - Enregistrer une nouvelle vue
export async function POST(request: NextRequest) {
  try {
    // Valider les données
    const body = await request.json();
    const validation = ViewCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { articleId, sessionId } = validation.data;

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

    // Vérifier si cette session a déjà vu cet article
    const existingView = await prisma.view.findFirst({
      where: {
        articleId,
        sessionId,
      },
    });

    // Si la vue existe déjà, renvoyer simplement un succès
    if (existingView) {
      return NextResponse.json({
        message: "Vue déjà enregistrée",
        view: existingView,
      });
    }

    // Créer la vue et incrémenter le compteur de vues de l'article
    const [view, _] = await prisma.$transaction([
      // Créer la vue
      prisma.view.create({
        data: {
          article: {
            connect: { id: articleId },
          },
          sessionId,
        },
      }),
      // Incrémenter le compteur de vues de l'article
      prisma.article.update({
        where: { id: articleId },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      message: "Vue enregistrée avec succès",
      view,
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la vue:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la vue" },
      { status: 500 }
    );
  }
}

// GET /api/views - Récupérer les statistiques de vues
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");
    
    if (!articleId) {
      return NextResponse.json(
        { error: "L'ID de l'article est requis" },
        { status: 400 }
      );
    }

    // Compter le nombre total de vues pour l'article
    const viewCount = await prisma.view.count({
      where: { articleId },
    });

    // Récupérer l'article avec son compteur de vues
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        viewCount: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      article,
      viewCount,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des vues:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des vues" },
      { status: 500 }
    );
  }
}