import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Advertise with NEWS",
};

export default function AdvertisePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Advertise</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Advertise With Us</h1>
        <p className="mt-2 text-gray-300">Reach millions of engaged readers</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Advertise With NEWS?</h2>
          <p className="text-gray-600 mb-6">
            NEWS reaches millions of engaged readers daily. Our audience trusts us for 
            accurate, timely news, making your brand message more impactful. We offer 
            various advertising solutions to meet your marketing goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Display Advertising</h3>
              <p className="text-gray-600 text-sm">
                Banner ads, native ads, and rich media placements across our website and apps.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sponsored Content</h3>
              <p className="text-gray-600 text-sm">
                Native advertising that blends seamlessly with our editorial content.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Newsletter Sponsorship</h3>
              <p className="text-gray-600 text-sm">
                Reach our email subscribers with targeted newsletter placements.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Video Advertising</h3>
              <p className="text-gray-600 text-sm">
                Pre-roll, mid-roll, and companion banner ads on our video content.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Audience</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">10M+</p>
              <p className="text-sm text-gray-600">Monthly Visitors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">5M+</p>
              <p className="text-sm text-gray-600">Newsletter Subscribers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">3M+</p>
              <p className="text-sm text-gray-600">Social Followers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">25-54</p>
              <p className="text-sm text-gray-600">Core Age Group</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            Ready to advertise with us? Contact our advertising team to discuss your needs 
            and get a custom proposal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:advertise@news.com"
              className="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors text-center"
            >
              Email Us
            </a>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}