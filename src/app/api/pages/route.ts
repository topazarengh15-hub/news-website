import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const { title, slug, content, status } = await request.json();
  if (!title || !slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }
  const page = await prisma.page.create({
    data: { title, slug, content: content || "", status: status || "PUBLISHED" },
  });
  return NextResponse.json(page, { status: 201 });
}
