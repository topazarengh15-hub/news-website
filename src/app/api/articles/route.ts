import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const status = searchParams.get("status");
    const search = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const user = getCurrentUser(request);
    const isAdminOrEditor = user && (user.role === "ADMIN" || user.role === "EDITOR");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    } else if (!isAdminOrEditor) {
      where.status = "PUBLISHED";
    }

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) {
        where.categoryId = cat.id;
      }
    }

    if (subcategory) {
      const sub = await prisma.category.findUnique({ where: { slug: subcategory } });
      if (sub) {
        where.subcategoryId = sub.id;
        delete where.categoryId;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: true,
          subcategory: true,
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, imageUrl, videoUrl, source, categoryId, subcategoryId, authorName, authorId, status, featured, editorsPick, trending } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and categoryId are required" },
        { status: 400 }
      );
    }

    let resolvedAuthorId = authorId;

    if (!resolvedAuthorId && authorName) {
      let author = await prisma.user.findFirst({ where: { name: authorName } });
      if (!author) {
        author = await prisma.user.create({
          data: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, ".")}@news.com`, password: "pending", role: "EDITOR" },
        });
      }
      resolvedAuthorId = author.id;
    }

    if (!resolvedAuthorId) {
      return NextResponse.json(
        { error: "Author is required (provide authorName or authorId)" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = await prisma.article.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    let articleStatus = status || "DRAFT";
    if (user.role === "AUTHOR") {
      articleStatus = status === "PUBLISHED" ? "PENDING_REVIEW" : (status || "DRAFT");
    } else if (user.role === "EDITOR") {
      articleStatus = status === "PUBLISHED" ? "PENDING_REVIEW" : (status || "DRAFT");
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || "",
        content,
        imageUrl: imageUrl || "",
        videoUrl: videoUrl || "",
        source: source || "",
        status: articleStatus,
        categoryId,
        subcategoryId: subcategoryId || null,
        authorId: resolvedAuthorId,
        featured: user.role === "ADMIN" ? (featured || false) : false,
        editorsPick: user.role === "ADMIN" ? (editorsPick || false) : false,
        trending: user.role === "ADMIN" ? (trending || false) : false,
      },
      include: {
        category: true,
        subcategory: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
