"use client";

import Link from "next/link";
import { articles } from "@/data/articles";

const breakingNews = articles.slice(0, 5).map((a) => ({
  id: a.id,
  title: a.title,
  href: `/post/${a.id}`,
}));

export default function BreakingNewsTicker() {
  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center">
        <span className="bg-white text-red-600 px-3 py-1 text-xs font-bold rounded ml-4 flex-shrink-0 z-10">
          BREAKING
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {breakingNews.map((news) => (
              <Link
                key={news.id}
                href={news.href}
                className="inline-flex items-center mx-8 text-sm font-medium hover:underline"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 flex-shrink-0" />
                {news.title}
              </Link>
            ))}
            {breakingNews.map((news) => (
              <Link
                key={`dup-${news.id}`}
                href={news.href}
                className="inline-flex items-center mx-8 text-sm font-medium hover:underline"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 flex-shrink-0" />
                {news.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
