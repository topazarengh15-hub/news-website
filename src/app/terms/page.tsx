import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NEWS Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Terms of Service</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-gray-300">Last updated: July 23, 2026</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using NEWS, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Use of Services</h2>
          <p className="text-gray-600 mb-4">
            You may use our services for lawful purposes only. You agree not to use our 
            services in any way that violates any applicable law or regulation.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Content</h2>
          <p className="text-gray-600 mb-4">
            All content published on NEWS is protected by intellectual property laws. 
            You may not reproduce, distribute, or create derivative works without our 
            express written permission.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">4. User Accounts</h2>
          <p className="text-gray-600 mb-4">
            You are responsible for maintaining the confidentiality of your account 
            credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            NEWS shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of our services.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these terms at any time. We will notify you 
            of any changes by posting the new terms on this page.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at 
            terms@news.com or visit our <Link href="/contact" className="text-red-600 hover:text-red-700">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}