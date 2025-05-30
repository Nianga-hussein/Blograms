import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";

// Schéma de validation pour la mise à jour d'un commentaire
const CommentUpdateSchema = z.object({
  content: z.string().min(1, { message: "Le contenu est requis" }),
});

// GET /api/comments/[id] - Récupérer un commentaire par son ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const commentId = params.id;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
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

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Erreur lors de la récupération du commentaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du commentaire" },
      { status: 500 }
    );
  }
}

// PATCH /api/comments/[id] - Mettre à jour un commentaire
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const commentId = params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Récupérer le commentaire existant
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire ou un administrateur
    const isAdmin = session.user.role === "ADMIN";
    if (comment.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à modifier ce commentaire" },
        { status: 403 }
      );
    }

    // Valider les données
    const body = await request.json();
    const validation = CommentUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { content } = validation.data;

    // Mettre à jour le commentaire
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
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

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du commentaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du commentaire" },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Supprimer un commentaire
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const commentId = params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Récupérer le commentaire existant
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire ou un administrateur
    const isAdmin = session.user.role === "ADMIN";
    if (comment.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer ce commentaire" },
        { status: 403 }
      );
    }

    // Supprimer le commentaire
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(
      { message: "Commentaire supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du commentaire" },
      { status: 500 }
    );
  }
}