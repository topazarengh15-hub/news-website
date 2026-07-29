import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id: Number(id) },
  });
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }
  return NextResponse.json(page);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, slug, content, status } = await request.json();
  const page = await prisma.page.update({
    where: { id: Number(id) },
    data: { title, slug, content, status },
  });
  revalidatePath(`/page/${page.slug}`);
  return NextResponse.json(page);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.page.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
