import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatName } from "@/lib/constants";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

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

  const dbArticles = await prisma.article.findMany({
    where: { subcategoryId: subCategory.id, status: "PUBLISHED" },
    include: {
      category: true,
      subcategory: true,
      author: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  }) as {
    id: number;
    title: string;
    excerpt: string;
    imageUrl: string;
    createdAt: Date;
    category: { name: string };
    subcategory: { name: string } | null;
    author: { name: string };
  }[];

  const displayArticles = dbArticles.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category.name,
    subcategory: a.subcategory?.name || "",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {displayArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found in this subcategory.</p>
        </div>
      )}
    </div>
  );
}
