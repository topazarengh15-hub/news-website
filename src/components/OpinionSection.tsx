import Link from "next/link";
import type { DisplayArticle } from "@/lib/types";

interface OpinionSectionProps {
  items: DisplayArticle[];
}

export default function OpinionSection({ items }: OpinionSectionProps) {
  const columnists = [
    {
      name: "Sarah Johnson",
      role: "Political Analyst",
      article: items[0]?.title || "The Future of Global Democracy",
      href: `/post/${items[0]?.id || 1}`,
    },
    {
      name: "Michael Chen",
      role: "Tech Correspondent",
      article: items[1]?.title || "AI Revolution: What Comes Next",
      href: `/post/${items[1]?.id || 2}`,
    },
    {
      name: "Emily Davis",
      role: "Business Editor",
      article: items[2]?.title || "Markets in 2026: An Outlook",
      href: `/post/${items[2]?.id || 3}`,
    },
  ];

  return (
    <section className="mt-12">
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Opinion &amp; Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columnists.map((columnist, index) => (
            <Link
              key={index}
              href={columnist.href}
              className="bg-gray-800 rounded-lg p-5 hover:bg-gray-700 transition-colors block"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {columnist.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="ml-3">
                  <p className="text-white font-semibold">{columnist.name}</p>
                  <p className="text-gray-400 text-sm">{columnist.role}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white hover:text-red-400 transition-colors">
                {columnist.article}
              </h3>
              <p className="mt-2 text-gray-400 text-sm">Read analysis &rarr;</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
