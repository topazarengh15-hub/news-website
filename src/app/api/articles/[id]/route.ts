import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        subcategory: true,
        author: { select: { id: true, name: true, email: true } },
        comments: {
          where: { status: "APPROVED" },
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, imageUrl, videoUrl, source, categoryId, subcategoryId, authorName, status, featured, editorsPick, trending } = body;

    const existing = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    if (user.role === "EDITOR") {
      if (existing.authorId !== user.id && status === undefined) {
        return NextResponse.json({ error: "Editors can only edit their own articles" }, { status: 403 });
      }
    }

    if (user.role === "AUTHOR") {
      if (existing.authorId !== user.id) {
        return NextResponse.json({ error: "Authors can only edit their own articles" }, { status: 403 });
      }
      if (existing.status === "PUBLISHED") {
        return NextResponse.json({ error: "Authors cannot edit published articles" }, { status: 403 });
      }
    }

    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slugExists = await prisma.article.findFirst({
        where: { slug, id: { not: parseInt(id) } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    let authorId = existing.authorId;
    if (authorName) {
      let author = await prisma.user.findFirst({ where: { name: authorName } });
      if (!author) {
        author = await prisma.user.create({
          data: { name: authorName, email: `${authorName.toLowerCase().replace(/\s+/g, ".")}@news.com`, password: "pending", role: "EDITOR" },
        });
      }
      authorId = author.id;
    }

    let articleStatus = status || existing.status;
    if (user.role === "EDITOR") {
      if (status && status !== existing.status) {
        articleStatus = "PENDING_REVIEW";
      }
    } else if (user.role === "AUTHOR") {
      if (status === "PUBLISHED") {
        articleStatus = "PENDING_REVIEW";
      }
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title, slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(source !== undefined && { source }),
        ...(categoryId && { categoryId }),
        ...(subcategoryId !== undefined && { subcategoryId: subcategoryId || null }),
        ...(authorId && { authorId }),
        status: articleStatus,
        ...(user.role === "ADMIN" && featured !== undefined && { featured }),
        ...(user.role === "ADMIN" && editorsPick !== undefined && { editorsPick }),
        ...(user.role === "ADMIN" && trending !== undefined && { trending }),
      },
      include: {
        category: true,
        subcategory: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to update article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getCurrentUser(request);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
