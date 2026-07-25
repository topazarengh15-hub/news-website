import Link from "next/link";
import Image from "next/image";
import type { DisplayArticle } from "@/lib/types";

interface ArticleCardProps {
  article: DisplayArticle;
  size?: "default" | "horizontal" | "compact";
  imageSizes?: string;
}

export default function ArticleCard({ article, size = "default", imageSizes }: ArticleCardProps) {
  if (size === "horizontal") {
    return (
      <Link
        href={`/post/${article.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all block"
      >
        <div className="flex items-start space-x-4 p-6">
          <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes={imageSizes || "128px"}
            />
          </div>
          <div className="flex-1">
            <span className="text-red-600 text-xs font-semibold uppercase">
              {article.category}
            </span>
            <h2 className="mt-1 text-xl font-bold text-gray-900 hover:text-red-600 transition-colors">
              {article.title}
            </h2>
            <p className="mt-2 text-gray-600 text-sm">{article.excerpt}</p>
            <div className="mt-3 flex items-center text-xs text-gray-500">
              <span>By {article.author}</span>
              <span className="mx-2">&middot;</span>
              <time dateTime={article.date}>{article.date}</time>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (size === "compact") {
    return (
      <Link
        href={`/post/${article.id}`}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex block"
      >
        <div className="relative w-32 h-24 flex-shrink-0">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes={imageSizes || "128px"}
          />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-center">
          <span className="text-red-600 text-xs font-semibold uppercase">
            {article.category}
          </span>
          <h3 className="mt-1 text-lg font-bold text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <time dateTime={article.date}>{article.date}</time>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/post/${article.id}`}
      className="block group h-full"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes={imageSizes || "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span className="text-red-600 text-xs font-semibold uppercase">
            {article.category}
          </span>
          <h2 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
            {article.title}
          </h2>
          <p className="mt-2 text-gray-600 text-sm line-clamp-3 flex-1">{article.excerpt}</p>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span>By {article.author}</span>
            <span className="mx-2">&middot;</span>
            <time dateTime={article.date}>{article.date}</time>
          </div>
        </div>
      </div>
    </Link>
  );
}
