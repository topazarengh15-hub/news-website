import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ShareButtons from "@/components/ShareButtons";

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true },
  });
  return articles.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id: Number(id) },
    include: {
      category: { include: { parent: true } },
      author: { select: { name: true, image: true } },
    },
  });

  if (!article) return notFound();

  const relatedArticles = await prisma.article.findMany({
    where: {
      category: { parentId: article.category.parentId },
      id: { not: article.id },
      status: "PUBLISHED",
    },
    include: {
      category: { include: { parent: true } },
      author: { select: { name: true } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const categorySlug = article.category.parent?.slug || article.category.slug;
  const categoryName = article.category.parent?.name || article.category.name;
  const authorName = article.author.name;
  const authorImage = article.authorImage || article.author.image || "";
  const dateStr = article.createdAt.toISOString().split("T")[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${categorySlug}`} className="hover:text-white">
              {categoryName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300 truncate">{article.title}</span>
          </nav>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 sm:h-96">
              <Image
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            <div className="p-6 sm:p-8">
              <span className="text-red-600 text-sm font-semibold uppercase">
                {categoryName}
              </span>

              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
                {article.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center text-sm text-gray-500 gap-1">
                <span>By {authorName}</span>
                <span className="hidden sm:inline mx-2">&middot;</span>
                <time dateTime={dateStr}>{dateStr}</time>
                {article.source && (
                  <>
                    <span className="hidden sm:inline mx-2">&middot;</span>
                    <span>Source: {article.source}</span>
                  </>
                )}
              </div>

              <div className="mt-8 prose prose-lg max-w-none text-gray-700">
                {article.excerpt && (
                  <p className="text-lg leading-relaxed">{article.excerpt}</p>
                )}
                {article.content.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {article.videoUrl && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Video</h3>
                  <a
                    href={article.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    Watch Video
                  </a>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {categoryName}
                  </span>
                  {article.category.parent && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {article.category.parent.name}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {article.category.name}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {authorImage ? (
                    <img src={authorImage} alt={authorName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {authorName.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{authorName}</p>
                  </div>
                </div>
              </div>

              <ShareButtons title={article.title} />
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-gray-900 rounded-t-lg p-4">
              <h2 className="text-lg font-bold text-white">Related Articles</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/post/${related.id}`}
                  className="block group"
                >
                  <div className="flex space-x-3">
                    <div className="relative w-20 h-16 flex-shrink-0">
                      <Image
                        src={related.imageUrl || "/placeholder.svg"}
                        alt={related.title}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {related.createdAt.toISOString().split("T")[0]}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          </div>

          <Link href="/subscribe" className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Newsletter</h2>
            <p className="text-sm text-gray-600 mb-4">Get the latest news delivered to your inbox.</p>
            <div className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-red-700 transition-colors">
              Subscribe
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
}
