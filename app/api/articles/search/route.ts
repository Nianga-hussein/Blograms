import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// Rechercher des articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true
          }
        },
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Erreur lors de la recherche d'articles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche d'articles" },
      { status: 500 }
    );
  }
}