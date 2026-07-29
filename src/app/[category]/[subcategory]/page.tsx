import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatName, navigationItems } from "@/lib/constants";
import InfiniteScroll from "@/components/InfiniteScroll";
import type { DisplayArticle } from "@/lib/types";

export const revalidate = 300;

export async function generateStaticParams() {
  return navigationItems.flatMap((item) =>
    item.submenu.map((sub) => ({
      category: item.href.replace("/", ""),
      subcategory: sub.href.split("/").pop()!,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  const catName = formatName(category);
  const subName = formatName(subcategory);
  return {
    title: `${subName} - ${catName} News`,
    description: `Latest ${subName} news and updates`,
  };
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;

  const parentCategory = await prisma.category.findUnique({ where: { slug: category } });
  if (!parentCategory) return notFound();

  const subCategory = await prisma.category.findFirst({
    where: { slug: subcategory, parentId: parentCategory.id },
  });
  if (!subCategory) return notFound();

  let initialArticles: DisplayArticle[] = [];
  const dbArticles = await prisma.article.findMany({
    where: { categoryId: subCategory.id, status: "PUBLISHED" },
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

  const catName = parentCategory.name;
  const subName = subCategory.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${category}`} className="hover:text-white">{catName}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{subName}</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">{subName}</h1>
        <p className="mt-2 text-gray-300">
          Latest {subName.toLowerCase()} news and updates
        </p>
      </div>

      {initialArticles.length > 0 ? (
        <InfiniteScroll
          initialArticles={initialArticles}
          fetchUrl={`/api/articles?subcategory=${subcategory}`}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found in this subcategory.</p>
        </div>
      )}
    </div>
  );
}
