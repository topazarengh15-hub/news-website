"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalUsers: number;
  recentArticles: {
    id: number;
    title: string;
    status: string;
    createdAt: string;
    author: { name: string };
    category: { name: string };
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch("/api/articles?limit=100"),
          fetch("/api/categories"),
        ]);
        const articlesData = await articlesRes.json();
        const categoriesData = await categoriesRes.json();

        const allArticles = articlesData.articles || [];
        const allCategories = categoriesData || [];

        setStats({
          totalArticles: articlesData.total || 0,
          publishedArticles: allArticles.filter((a: { status: string }) => a.status === "PUBLISHED").length,
          draftArticles: allArticles.filter((a: { status: string }) => a.status === "DRAFT").length,
          totalCategories: allCategories.length,
          totalUsers: 1,
          recentArticles: allArticles.slice(0, 5),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return <p className="text-gray-500">Failed to load dashboard.</p>;

  const statCards = [
    { label: "Total Articles", value: stats.totalArticles, color: "text-blue-600" },
    { label: "Published", value: stats.publishedArticles, color: "text-green-600" },
    { label: "Drafts", value: stats.draftArticles, color: "text-yellow-600" },
    { label: "Categories", value: stats.totalCategories, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Recent Articles</h2>
          <Link
            href="/admin/articles"
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-gray-900 hover:text-red-600">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.author.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      article.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
