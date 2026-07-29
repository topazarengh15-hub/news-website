"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { useUser } from "@/lib/UserContext";

interface Category {
  id: number;
  name: string;
  slug: string;
  children: { id: number; name: string; slug: string }[];
}

interface ArticleData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  authorImage: string;
  status: string;
  featured: boolean;
  editorsPick: boolean;
  trending: boolean;
  videoUrl: string;
  source: string;
  author: { id: number; name: string };
  category: { id: number; name: string; parent: { id: number; name: string } | null };
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    authorName: "",
    authorImage: "",
    parentCategoryId: "",
    categoryId: "",
    status: "DRAFT",
    featured: false,
    editorsPick: false,
    trending: false,
    videoUrl: "",
    source: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [articleRes, catsRes] = await Promise.all([
          fetch(`/api/articles/${id}`),
          fetch("/api/categories"),
        ]);

        if (!articleRes.ok) {
          setErrors({ load: "Article not found" });
          return;
        }

        const article: ArticleData = await articleRes.json();
        const cats = await catsRes.json();

        setCategories(cats);
        setForm({
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt || "",
          imageUrl: article.imageUrl || "",
          authorName: article.author.name,
          authorImage: article.authorImage || "",
          parentCategoryId: article.category.parent ? String(article.category.parent.id) : "",
          categoryId: String(article.category.id),
          status: article.status,
          featured: article.featured,
          editorsPick: article.editorsPick,
          trending: article.trending,
          videoUrl: article.videoUrl || "",
          source: article.source || "",
        });
      } catch {
        setErrors({ load: "Failed to load article" });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const selectedCategory = categories.find((c) => c.id === Number(form.parentCategoryId));
  const subcategories = selectedCategory?.children || [];

  const statusOptions = user?.role === "ADMIN"
    ? [
        { value: "DRAFT", label: "Draft" },
        { value: "PENDING_REVIEW", label: "Pending Review" },
        { value: "PUBLISHED", label: "Published" },
        { value: "ARCHIVED", label: "Archived" },
      ]
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "parentCategoryId") updated.categoryId = "";
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
    if (!form.categoryId) errs.categoryId = "Subcategory is required";
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
        status: overrideStatus || form.status,
      };

      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error) setErrors({ submit: data.error });
        return;
      }

      if (overrideStatus === "PENDING_REVIEW") {
        setSubmitted(true);
      } else {
        router.push("/admin/articles");
      }
    } catch {
      setErrors({ submit: "Failed to update article" });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const timer = setTimeout(() => router.push("/admin/articles"), 15000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (errors.load) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-red-600 text-lg">{errors.load}</p>
        <button onClick={() => router.back()} className="mt-4 text-red-600 hover:text-red-700 font-medium">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Article</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-4 text-center">
            <p className="text-green-800 font-semibold text-lg">Article submitted for review!</p>
            <p className="text-green-700 text-sm mt-1">An admin will review and publish it shortly. Redirecting...</p>
          </div>
        )}

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.content ? "border-red-500" : "border-gray-300"}`}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-3">Classification</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category *</label>
              <select
                name="parentCategoryId"
                value={form.parentCategoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select parent category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                disabled={!form.parentCategoryId}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 ${errors.categoryId ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            {user?.role === "ADMIN" ? (
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500 py-2">{form.status === "PENDING_REVIEW" ? "Pending Review" : form.status === "PUBLISHED" ? "Published" : "Draft"}</p>
            )}
          </div>

          {user?.role === "ADMIN" && (
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
                <span className="text-sm text-gray-700">Featured (Hero Slide)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="editorsPick" checked={form.editorsPick} onChange={handleChange} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
                <span className="text-sm text-gray-700">Editor&apos;s Pick</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} className="w-4 h-4 text-red-600 rounded focus:ring-red-500" />
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
            <button type="submit" disabled={saving || submitted} className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={saving || submitted}
                onClick={(e) => handleSubmit(e, "PENDING_REVIEW")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish"}
              </button>
              <button
                type="button"
                disabled={saving || submitted}
                onClick={(e) => handleSubmit(e, "DRAFT")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save as Draft"}
              </button>
            </>
          )}
          <button type="button" onClick={() => router.back()} disabled={submitted} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
