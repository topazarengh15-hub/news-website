import Link from "next/link";
import Image from "next/image";
import type { DisplayArticle } from "@/lib/types";

interface VideoSectionProps {
  items: DisplayArticle[];
}

export default function VideoSection({ items }: VideoSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Latest Videos</h2>
        <Link href="/entertainment" className="text-gray-300 hover:text-white text-sm font-medium">
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-0">
        {items.map((article) => (
          <Link
            key={article.id}
            href={`/post/${article.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
          >
            <div className="relative h-36">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-3">
              <span className="text-red-600 text-xs font-semibold uppercase">
                {article.category}
              </span>
              <h3 className="mt-1 text-sm font-bold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
