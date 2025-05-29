import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Récupérer les articles mis en avant
export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "3");
    
    const featuredArticles = await prisma.article.findMany({
      where: {
        published: true,
        featured: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        viewCount: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });
    
    return NextResponse.json(featuredArticles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles mis en avant:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles mis en avant" },
      { status: 500 }
    );
  }
}