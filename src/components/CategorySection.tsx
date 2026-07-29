import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import type { DisplayArticle } from "@/lib/types";

interface CategorySectionProps {
  title: string;
  slug: string;
  articles: DisplayArticle[];
}

export default function CategorySection({ title, slug, articles }: CategorySectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link
          href={`/${slug}`}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
