import ArticleCard from "@/components/ArticleCard";
import type { DisplayArticle } from "@/lib/types";

interface EditorsPickProps {
  items: DisplayArticle[];
}

export default function EditorsPick({ items }: EditorsPickProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="bg-gray-900 rounded-lg p-4">
        <h2 className="text-2xl font-bold text-white">Editor&apos;s Pick</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-0 items-start">
        <div>
          <ArticleCard
            article={items[0]}
            imageSizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col gap-6">
          {items.slice(1).map((article) => (
            <ArticleCard key={article.id} article={article} size="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
