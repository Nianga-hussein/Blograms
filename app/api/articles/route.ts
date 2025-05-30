import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Récupérer tous les articles avec filtrage et pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const published = searchParams.has("published") 
      ? searchParams.get("published") === "true" 
      : undefined;
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;
    const authorId = searchParams.get("authorId");
    
    const skip = (page - 1) * limit;
    
    // Construire la requête avec les filtres
    const where: any = {};
    
    // Par défaut, ne montrer que les articles publiés aux utilisateurs non-admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";
    
    if (!isAdmin && published === undefined) {
      where.published = true;
    } else if (published !== undefined) {
      where.published = published;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } }
      ];
    }
    
    if (category) {
      where.categories = {
        some: {
          slug: category
        }
      };
    }
    
    if (tag) {
      where.tags = {
        some: {
          slug: tag
        }
      };
    }
    
    if (featured !== undefined) {
      where.featured = featured;
    }
    
    if (authorId) {
      where.authorId = authorId;
    }
    
    // Récupérer les articles avec pagination
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          published: true,
          featured: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
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
          tags: {
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
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.article.count({ where })
    ]);
    
    return NextResponse.json({
      articles,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
      { status: 500 }
    );
  }
}

// Créer un nouvel article
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier si l'utilisateur est connecté
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validation des données
    const articleSchema = z.object({
      title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
      content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional(),
      published: z.boolean().optional(),
      featured: z.boolean().optional(),
      categoryIds: z.array(z.string()).optional(),
      tagIds: z.array(z.string()).optional(),
    });
    
    const result = articleSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Générer un slug à partir du titre
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Vérifier si le slug existe déjà
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    });
    
    if (existingArticle) {
      return NextResponse.json(
        { error: "Un article avec ce titre existe déjà" },
        { status: 409 }
      );
    }
    
    // Seul un admin peut créer un article mis en avant
    if (body.featured && session.user.role !== "ADMIN") {
      body.featured = false;
    }
    
    // Créer l'article
    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt || body.content.substring(0, 150) + "...",
        coverImage: body.coverImage,
        published: body.published ?? false,
        featured: body.featured ?? false,
        author: {
          connect: { id: session.user.id }
        },
        categories: body.categoryIds?.length 
          ? { connect: body.categoryIds.map((id: any) => ({ id })) }
          : undefined,
        tags: body.tagIds?.length
          ? { connect: body.tagIds.map((id: any) => ({ id })) }
          : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        categories: true,
        tags: true
      }
    });
    
    return NextResponse.json(
      { message: "Article créé avec succès", article },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 }
    );
  }
}