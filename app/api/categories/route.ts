import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const withCount = request.nextUrl.searchParams.get("withCount") === "true";
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: withCount ? {
          select: {
            articles: true
          }
        } : undefined
      },
      orderBy: { name: "asc" }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

// Créer une nouvelle catégorie (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier si l'utilisateur est un admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validation des données
    const categorySchema = z.object({
      name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
      description: z.string().optional()
    });
    
    const result = categorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Générer un slug à partir du nom
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: body.name },
          { slug }
        ]
      }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "Une catégorie avec ce nom existe déjà" },
        { status: 409 }
      );
    }
    
    // Créer la catégorie
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description
      }
    });
    
    return NextResponse.json(
      { message: "Catégorie créée avec succès", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}