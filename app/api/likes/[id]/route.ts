import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// DELETE /api/likes/[id] - Supprimer un like
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const likeId = params.id;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Récupérer le like existant
    const like = await prisma.like.findUnique({
      where: { id: likeId },
    });

    if (!like) {
      return NextResponse.json(
        { error: "Like non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est l'auteur du like ou un administrateur
    const isAdmin = session.user.role === "ADMIN";
    if (like.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer ce like" },
        { status: 403 }
      );
    }

    // Supprimer le like
    await prisma.like.delete({
      where: { id: likeId },
    });

    return NextResponse.json(
      { message: "Like supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du like:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du like" },
      { status: 500 }
    );
  }
}