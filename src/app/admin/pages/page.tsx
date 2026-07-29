"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  createdAt: string;
  author?: { name: string } | null;
  authorId?: number | null;
}

export default function AdminPages() {
  const { user } = useUser();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => setPages(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
    else alert("You don't have permission to delete this page.");
  };

  const handleApprove = async (id: number) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    await fetch(`/api/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: page.title, slug: page.slug, content: page.content, status: "PUBLISHED" }),
    });
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, status: "PUBLISHED" } : p)));
  };

  if (loading) return <p className="text-gray-600">Loading pages...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
        >
          New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No pages yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Title</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Slug</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Author</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-900">Status</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => {
                const isOwner = user && page.authorId === user.id;
                const isAdmin = user?.role === "ADMIN";
                const canDelete = isAdmin || isOwner;
                return (
                  <tr key={page.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                    <td className="px-6 py-4 text-gray-600">/page/{page.slug}</td>
                    <td className="px-6 py-4 text-gray-600">{page.author?.name || "System"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        page.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                        page.status === "PENDING_REVIEW" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {page.status === "PENDING_REVIEW" ? "Pending Review" : page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Edit
                      </Link>
                      {isAdmin && page.status === "PENDING_REVIEW" && (
                        <button
                          onClick={() => handleApprove(page.id)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Approve
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          className="text-gray-500 hover:text-red-600 font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
