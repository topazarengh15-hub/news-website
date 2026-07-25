import Link from "next/link";
import type { DisplayArticle } from "@/lib/types";

interface MostReadProps {
  items: DisplayArticle[];
}

export default function MostRead({ items }: MostReadProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Read</h2>
        <div className="space-y-4">
          {items.map((article, index) => (
            <Link
              key={article.id}
              href={`/post/${article.id}`}
              className="flex items-start space-x-4 group"
            >
              <span className="text-lg font-bold text-red-600 w-6 text-center flex-shrink-0 leading-none pt-1">
                {index + 1}
              </span>
              <div className="flex-1">
                <span className="text-red-600 text-xs font-semibold uppercase">
                  {article.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{article.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
