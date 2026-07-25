"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";

interface Article {
  id: number;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author: { name: string };
  category: { name: string };
  subcategory?: { name: string } | null;
}

export default function ArticlesPage() {
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [approving, setApproving] = useState<number | null>(null);

  const fetchArticles = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (search) params.set("search", search);
      params.set("limit", "50");

      const res = await fetch(`/api/articles?${params}`, { signal });
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      if (signal?.aborted) return;
      console.error("Failed to fetch articles:", error);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void fetchArticles(controller.signal); // eslint-disable-line react-hooks/set-state-in-effect
    return () => controller.abort();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert("Failed to delete article");
      }
    } catch {
      alert("Failed to delete article");
    } finally {
      setDeleting(null);
    }
  };

  const handleApprove = async (id: number) => {
    setApproving(id);
    try {
      const res = await fetch(`/api/articles/${id}/publish`, { method: "POST" });
      if (res.ok) {
        setArticles(articles.map((a) => a.id === id ? { ...a, status: "PUBLISHED" } : a));
      } else {
        alert("Failed to approve article");
      }
    } catch {
      alert("Failed to approve article");
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </form>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-500">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No articles found.</p>
          <Link href="/admin/articles/new" className="mt-4 inline-block text-red-600 hover:text-red-700 font-medium">
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/articles/${article.id}/edit`} className="text-sm font-medium text-gray-900 hover:text-red-600">
                        {article.title}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">/{article.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{article.category.name}</span>
                      {article.subcategory && (
                        <span className="text-xs text-gray-400 block">/ {article.subcategory.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{article.author.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : article.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-700"
                          : article.status === "PENDING_REVIEW"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {article.status === "PENDING_REVIEW" ? "pending review" : article.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        {user?.role === "ADMIN" && article.status === "PENDING_REVIEW" && (
                          <button
                            onClick={() => handleApprove(article.id)}
                            disabled={approving === article.id}
                            className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 font-medium"
                          >
                            {approving === article.id ? "..." : "Approve"}
                          </button>
                        )}
                        {user?.role === "ADMIN" && (
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            disabled={deleting === article.id}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === article.id ? "..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
