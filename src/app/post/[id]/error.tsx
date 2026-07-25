"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
      <p className="text-gray-600 mb-6">{error.message || "The article you&apos;re looking for could not be loaded."}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
