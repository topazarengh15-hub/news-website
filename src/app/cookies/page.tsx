import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "NEWS Cookie Policy",
};

export default function CookiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Cookie Policy</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Cookie Policy</h1>
        <p className="mt-2 text-gray-300">Last updated: July 23, 2026</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your computer or mobile device 
            when you visit a website. They are widely used to make websites work more 
            efficiently and to provide information to website owners.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
          <p className="text-gray-600 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>To remember your preferences and settings</li>
            <li>To analyze how our website is used</li>
            <li>To personalize content and advertisements</li>
            <li>To provide social media features</li>
            <li>To improve our services</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">Essential Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are necessary for the website to function properly. They enable 
            core functionality such as security, network management, and account access.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies help us understand how visitors interact with our website by 
            collecting and reporting information anonymously.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Marketing Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are used to track visitors across websites to display relevant 
            advertisements that are engaging for the individual user.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
          <p className="text-gray-600 mb-4">
            You can control and/or delete cookies as you wish. You can delete all cookies 
            that are already on your computer and you can set most browsers to prevent 
            them from being placed.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about our Cookie Policy, please contact us at 
            privacy@news.com or visit our <Link href="/contact" className="text-red-600 hover:text-red-700">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}