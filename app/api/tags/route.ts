import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Récupérer tous les tags
export async function GET(request: NextRequest) {
  try {
    const withCount = request.nextUrl.searchParams.get("withCount") === "true";
    
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: withCount ? {
          select: {
            articles: true
          }
        } : undefined
      },
      orderBy: { name: "asc" }
    });
    
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tags" },
      { status: 500 }
    );
  }
}

// Créer un nouveau tag (admin uniquement)
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
    const tagSchema = z.object({
      name: z.string().min(2, "Le nom doit contenir au moins 2 caractères")
    });
    
    const result = tagSchema.safeParse(body);
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
    
    // Vérifier si le tag existe déjà
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: body.name },
          { slug }
        ]
      }
    });
    
    if (existingTag) {
      return NextResponse.json(
        { error: "Un tag avec ce nom existe déjà" },
        { status: 409 }
      );
    }
    
    // Créer le tag
    const tag = await prisma.tag.create({
      data: {
        name: body.name,
        slug
      }
    });
    
    return NextResponse.json(
      { message: "Tag créé avec succès", tag },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du tag" },
      { status: 500 }
    );
  }
}