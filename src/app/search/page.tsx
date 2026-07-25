"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { DisplayArticle } from "@/lib/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryFromUrl = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(queryFromUrl);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const res = await fetch("/api/articles?limit=100");
        const data = await res.json();
        const all = (data.articles || []).map((a: {
          id: number;
          title: string;
          excerpt: string;
          imageUrl: string;
          createdAt: string;
          category: { name: string };
          subcategory?: { name: string } | null;
          author: { name: string };
        }) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          category: a.category.name,
          subcategory: a.subcategory?.name || "",
          author: a.author.name,
          date: a.createdAt.split("T")[0],
          imageUrl: a.imageUrl || "/placeholder.svg",
        }));
        setArticles(all);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const categories = ["All", ...new Set(articles.map((a) => a.category))];

  const filteredArticles = articles.filter((article) => {
    const query = queryFromUrl.toLowerCase();
    const matchesQuery =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(inputValue)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 max-w-2xl">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search news..."
            className="bg-transparent border-none outline-none ml-3 flex-1 text-gray-900 placeholder-gray-500"
            autoFocus
          />
          <button
            type="submit"
            className="ml-3 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          {loading ? "Loading..." : (
            <>
              {filteredArticles.length} result{filteredArticles.length !== 1 ? "s" : ""} found
              {queryFromUrl && (
                <> for <span className="font-semibold">&quot;{queryFromUrl}&quot;</span></>
              )}
            </>
          )}
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} size="horizontal" />
          ))
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-gray-600">Try different keywords or browse categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
