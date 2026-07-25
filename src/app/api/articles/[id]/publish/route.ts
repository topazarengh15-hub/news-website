import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
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
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { status: "PUBLISHED" },
      include: {
        category: true,
        subcategory: true,
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to publish article:", error);
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 });
  }
}
