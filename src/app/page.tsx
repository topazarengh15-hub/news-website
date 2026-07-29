import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import LatestNewsCarousel from "@/components/LatestNewsCarousel";
import EditorsPick from "@/components/EditorsPick";
import MostRead from "@/components/MostRead";
import VideoSection from "@/components/VideoSection";
import OpinionSection from "@/components/OpinionSection";
import CategorySection from "@/components/CategorySection";
import { prisma } from "@/lib/prisma";
import type { DisplayArticle } from "@/lib/types";

export const revalidate = 300;

function toDisplayArticle(a: {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  createdAt: Date;
  category: { name: string; parent: { name: string } | null };
  author: { name: string };
}): DisplayArticle {
  return {
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category.parent?.name || a.category.name,
    subcategory: a.category.name,
    author: a.author.name,
    date: a.createdAt.toISOString().split("T")[0],
    imageUrl: a.imageUrl || "/placeholder.svg",
  };
}

const includeRelations = {
  category: { include: { parent: true } },
  author: { select: { name: true } },
};

export default async function Home() {
  const [
    featuredArticles,
    editorsPickArticles,
    trendingArticles,
    latestArticles,
    mostCommentedArticles,
    videoArticles,
    opinionArticles,
    worldArticles,
    techArticles,
    sportsArticles,
    businessArticles,
  ] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", editorsPick: true },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", trending: true },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ...includeRelations,
        _count: { select: { comments: true } },
      },
      orderBy: { comments: { _count: "desc" } },
      take: 6,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", videoUrl: { not: "" } },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: { slug: "opinion" },
      },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: { parent: { slug: "world" } },
      },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: { parent: { slug: "tech" } },
      },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: { parent: { slug: "sports" } },
      },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: { parent: { slug: "business" } },
      },
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const heroSlides = featuredArticles.length > 0
    ? featuredArticles.map(toDisplayArticle)
    : latestArticles.slice(0, 3).map(toDisplayArticle);

  const trending = trendingArticles.length > 0
    ? trendingArticles.map(toDisplayArticle)
    : latestArticles.slice(0, 4).map(toDisplayArticle);

  const latest = latestArticles.map(toDisplayArticle);

  const editorsPicks = editorsPickArticles.length > 0
    ? editorsPickArticles.map(toDisplayArticle)
    : latestArticles.slice(0, 4).map(toDisplayArticle);

  const mostRead = mostCommentedArticles.map((a) => toDisplayArticle(a as Parameters<typeof toDisplayArticle>[0]));

  const videos = videoArticles.map(toDisplayArticle);

  const opinions = opinionArticles.length > 0
    ? opinionArticles.map(toDisplayArticle)
    : latestArticles.slice(2, 5).map(toDisplayArticle);

  const world = worldArticles.map(toDisplayArticle);
  const tech = techArticles.map(toDisplayArticle);
  const sports = sportsArticles.map(toDisplayArticle);
  const business = businessArticles.map(toDisplayArticle);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2">
          <HeroSlider slides={heroSlides} />
        </div>

        <aside className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Stories</h2>
            <ul className="space-y-4">
              {trending.map((story, index) => (
                <li key={story.id} className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold text-lg">{index + 1}</span>
                  <Link
                    href={`/post/${story.id}`}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/subscribe" className="block bg-red-600 rounded-lg shadow-md p-6 text-white hover:bg-red-700 transition-colors">
            <h2 className="text-lg font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-red-100 mb-4">Get the latest news delivered to your inbox.</p>
            <div className="w-full bg-white text-red-600 px-4 py-2 rounded-md font-semibold text-center">
              Subscribe
            </div>
          </Link>
        </aside>
      </div>

      <CategorySection title="World News" slug="world" articles={world} />

      <LatestNewsCarousel items={latest} />

      <CategorySection title="Technology" slug="tech" articles={tech} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 items-start">
        <div className="lg:col-span-2">
          <EditorsPick items={editorsPicks} />
        </div>
        <div>
          <MostRead items={mostRead} />
        </div>
      </div>

      <CategorySection title="Sports" slug="sports" articles={sports} />

      <VideoSection items={videos} />

      <CategorySection title="Business" slug="business" articles={business} />

      <OpinionSection items={opinions} />
    </div>
  );
}
