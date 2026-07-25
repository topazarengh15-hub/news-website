import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NEWS Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Privacy Policy</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-gray-300">Last updated: July 23, 2026</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            subscribe to our newsletter, or contact us. This may include your name, email address, 
            and any other information you choose to provide.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information we collect to provide, maintain, and improve our services, 
            to send you news and updates, and to communicate with you about our services.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We do not sell or rent your personal information to third parties. We may share 
            your information only in the following circumstances: with your consent, to comply 
            with legal obligations, or to protect our rights.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your 
            personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            You have the right to access, correct, or delete your personal information. 
            You may also opt out of receiving promotional communications from us at any time.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at 
            privacy@news.com or visit our <Link href="/contact" className="text-red-600 hover:text-red-700">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}