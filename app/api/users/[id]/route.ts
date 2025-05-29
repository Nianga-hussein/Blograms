import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcrypt";
import { z } from "zod";

// Récupérer un utilisateur par ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = params.id;
    
    // Vérifier si l'utilisateur est autorisé (admin ou l'utilisateur lui-même)
    if (!session || (session.user.id !== userId && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            likes: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}

// Mettre à jour un utilisateur
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = params.id;
    
    // Vérifier si l'utilisateur est autorisé (admin ou l'utilisateur lui-même)
    if (!session || (session.user.id !== userId && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validation des données
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      bio: z.string().optional().nullable(),
      image: z.string().url().optional().nullable(),
      password: z.string().min(8).optional(),
      role: z.enum(["USER", "ADMIN"]).optional(),
      isActive: z.boolean().optional()
    });
    
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Seul un admin peut changer le rôle ou désactiver un compte
    if ((body.role || body.isActive !== undefined) && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé à modifier ces champs" },
        { status: 403 }
      );
    }
    
    // Préparer les données à mettre à jour
    const updateData: any = {};
    
    if (body.name) updateData.name = body.name;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.role) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    
    // Hacher le mot de passe si fourni
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }
    
    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}

// Supprimer un utilisateur (admin uniquement)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = params.id;
    
    // Vérifier si l'utilisateur est un admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: userId }
    });
    
    return NextResponse.json({
      message: "Utilisateur supprimé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}