import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
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
  const user = getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { title, slug, content, status } = await request.json();

  const existing = await prisma.page.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const isOwner = existing.authorId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pageStatus = isAdmin ? (status || existing.status) : "PENDING_REVIEW";

  const page = await prisma.page.update({
    where: { id: Number(id) },
    data: { title, slug, content, status: pageStatus },
  });

  if (page.status === "PUBLISHED") {
    revalidatePath(`/page/${page.slug}`);
  }

  return NextResponse.json(page);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.page.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  const isOwner = existing.authorId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.page.delete({ where: { id: Number(id) } });
  revalidatePath(`/page/${existing.slug}`);
  return NextResponse.json({ success: true });
}
