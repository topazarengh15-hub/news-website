"use client";

import { useEffect, useRef, useState } from "react";
import ArticleCard from "./ArticleCard";
import type { DisplayArticle } from "@/lib/types";

interface Props {
  initialArticles: DisplayArticle[];
  fetchUrl: string;
}

export default function InfiniteScroll({ initialArticles, fetchUrl }: Props) {
  const [articles, setArticles] = useState<DisplayArticle[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setArticles(initialArticles);
    setPage(1);
    setHasMore(true);
  }, [fetchUrl, initialArticles]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          try {
            const nextPage = page + 1;
            const separator = fetchUrl.includes("?") ? "&" : "?";
            const res = await fetch(`${fetchUrl}${separator}page=${nextPage}&limit=12`);
            const data = await res.json();
            const items = (data.articles || []).map((a: {
              id: number;
              title: string;
              excerpt: string;
              imageUrl: string;
              createdAt: string;
              category: { name: string; parent: { name: string } | null };
              author: { name: string };
            }) => ({
              id: a.id,
              title: a.title,
              excerpt: a.excerpt,
              category: a.category.parent?.name || a.category.name,
              subcategory: a.category.name,
              author: a.author.name,
              date: a.createdAt.split("T")[0],
              imageUrl: a.imageUrl || "/placeholder.svg",
            }));
            setArticles((prev) => [...prev, ...items]);
            setPage(nextPage);
            if (items.length < 12) setHasMore(false);
          } catch {
            setHasMore(false);
          } finally {
            setLoading(false);
          }
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, hasMore, loading, fetchUrl]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto" />
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No more articles to load.
        </div>
      )}

      <div ref={sentinelRef} className="h-4" />
    </>
  );
}
