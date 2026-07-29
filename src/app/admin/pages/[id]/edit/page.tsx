"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pages/${params.id}`)
      .then((res) => res.json())
      .then((page) => {
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content);
        setStatus(page.status);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/pages/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, status }),
    });
    router.push("/admin/pages");
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/pages" className="text-sm text-red-600 hover:text-red-700">&larr; Back to Pages</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Page</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Public URL: /page/{slug}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">HTML supported</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Page"}
        </button>
      </form>
    </div>
  );
}
