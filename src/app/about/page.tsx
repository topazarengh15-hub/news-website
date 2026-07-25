import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about NEWS and our mission",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">About Us</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">About Us</h1>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            NEWS is dedicated to delivering accurate, timely, and comprehensive news coverage from around the world. 
            Our mission is to inform and empower our readers with quality journalism that matters.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Founded in 2026, NEWS has quickly grown to become a trusted source for breaking news, in-depth analysis, 
            and human interest stories. Our team of experienced journalists and editors work around the clock to bring 
            you the news that shapes our world.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Accuracy and truth in reporting</li>
            <li>Independence and editorial integrity</li>
            <li>Transparency in our processes</li>
            <li>Respect for our readers and sources</li>
            <li>Innovation in storytelling</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-gray-600 mb-6">
            Our diverse team of journalists, editors, and media professionals brings decades of combined experience 
            in covering global events, politics, technology, business, sports, and entertainment.
          </p>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-600">
              Have questions or feedback? Visit our <Link href="/contact" className="text-red-600 hover:text-red-700">Contact page</Link> to get in touch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}