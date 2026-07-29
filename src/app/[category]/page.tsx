import { notFound } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import InfiniteScroll from "@/components/InfiniteScroll";
import type { DisplayArticle } from "@/lib/types";

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const found = categories.find((c) => c.slug === category);
  return {
    title: `${found?.name || category} News`,
    description: `Latest ${found?.name || category} news and updates`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const found = categories.find((c) => c.slug === category);
  if (!found) return notFound();

  const dbCategory = await prisma.category.findUnique({ where: { slug: category } });

  let initialArticles: DisplayArticle[] = [];
  if (dbCategory) {
    const dbArticles = await prisma.article.findMany({
      where: {
        category: { parentId: dbCategory.id },
        status: "PUBLISHED",
      },
      include: {
        category: { include: { parent: true } },
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    initialArticles = dbArticles.map((a) => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category.parent?.name || a.category.name,
      subcategory: a.category.name,
      author: a.author.name,
      date: a.createdAt.toISOString().split("T")[0],
      imageUrl: a.imageUrl || "/placeholder.svg",
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{found.name}</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">{found.name} News</h1>
        <p className="mt-2 text-gray-300">
          Latest {found.name.toLowerCase()} news and updates
        </p>
      </div>

      {initialArticles.length > 0 ? (
        <InfiniteScroll
          initialArticles={initialArticles}
          fetchUrl={`/api/articles?category=${category}`}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found in this category.</p>
        </div>
      )}
    </div>
  );
}
