"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { DisplayArticle } from "@/lib/types";

interface LatestNewsCarouselProps {
  items: DisplayArticle[];
}

export default function LatestNewsCarousel({ items }: LatestNewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="mt-12 bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.latest-news-scroll::-webkit-scrollbar { display: none; }`}</style>
        {items.map((article) => (
          <Link
            key={article.id}
            href={`/post/${article.id}`}
            className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
          >
            <div className="relative h-40">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            <div className="p-4">
              <span className="text-red-600 text-xs font-semibold uppercase">
                {article.category}
              </span>
              <h3 className="mt-1 text-lg font-bold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
                {article.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
              <div className="mt-3 flex items-center text-xs text-gray-500">
                <span>By {article.author}</span>
                <span className="mx-2">&middot;</span>
                <time>{article.date}</time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
