"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { useUser } from "@/lib/UserContext";

interface Category {
  id: number;
  name: string;
  slug: string;
  children: { id: number; name: string; slug: string }[];
}

export default function NewArticlePage() {
  const router = useRouter();
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = user?.role === "ADMIN"
    ? [
        { value: "DRAFT", label: "Draft" },
        { value: "PUBLISHED", label: "Published" },
        { value: "ARCHIVED", label: "Archived" },
      ]
    : [];

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    authorName: "News Desk",
    authorImage: "",
    categoryId: "",
    subcategoryId: "",
    status: "DRAFT",
    featured: false,
    editorsPick: false,
    trending: false,
    videoUrl: "",
    source: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const selectedCategory = categories.find((c) => c.id === Number(form.categoryId));
  const subcategories = selectedCategory?.children || [];

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "title" && !prev.slug) {
        updated.slug = autoSlug(value);
      }
      if (name === "categoryId") {
        updated.subcategoryId = "";
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";
    if (!form.content.trim()) errs.content = "Content is required";
    if (!form.categoryId) errs.categoryId = "Category is required";
    if (!form.authorName.trim()) errs.authorName = "Author is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: string) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    try {
      const body = {
        ...form,
        categoryId: Number(form.categoryId),
        subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
        status: overrideStatus || form.status,
      };

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error) {
          setErrors({ submit: data.error });
        }
        return;
      }

      router.push("/admin/articles");
    } catch {
      setErrors({ submit: "Failed to create article" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Article</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{errors.submit}</div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Content</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.title ? "border-red-500" : "border-gray-300"}`}
              placeholder="Article title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm ${errors.slug ? "border-red-500" : "border-gray-300"}`}
              placeholder="article-slug"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief summary..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.content ? "border-red-500" : "border-gray-300"}`}
              placeholder="Write your article content here..."
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Media</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <ImageUploader
              value={form.imageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (optional)</label>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="YouTube or video URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g. AFP, Reuters"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Classification</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.categoryId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleChange}
                disabled={!form.categoryId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">None</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {user?.role === "ADMIN" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {user?.role === "ADMIN" && (
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Featured (Hero Slide)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="editorsPick"
                  checked={form.editorsPick}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Editor&apos;s Pick</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="trending"
                  checked={form.trending}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Trending</span>
              </label>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Author</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name *</label>
            <input
              name="authorName"
              value={form.authorName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.authorName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.authorName && <p className="text-red-500 text-xs mt-1">{errors.authorName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author Photo</label>
            <ImageUploader
              value={form.authorImage}
              onChange={(url) => setForm((prev) => ({ ...prev, authorImage: url }))}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "ADMIN" ? (
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Article"}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "PENDING_REVIEW")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "DRAFT")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save as Draft"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
