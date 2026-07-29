import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const user = getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, slug, content, status } = await request.json();
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }
  const pageStatus = user.role === "ADMIN" ? (status || "PUBLISHED") : "PENDING_REVIEW";
  const page = await prisma.page.create({
    data: {
      title,
      slug,
      content: content || "",
      status: pageStatus,
      authorId: user.id,
    },
  });
  return NextResponse.json(page, { status: 201 });
}
