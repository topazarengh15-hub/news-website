"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("monthly");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$9.99",
      period: "/month",
      features: ["Unlimited articles", "Ad-free experience", "Daily newsletter", "Mobile app access"],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$99.99",
      period: "/year",
      features: ["Everything in Monthly", "Save 17%", "Exclusive content", "Priority support"],
      popular: true,
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: "$299.99",
      period: "one-time",
      features: ["Everything in Yearly", "Lifetime access", "Early access to features", "VIP support"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Subscribe</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Subscribe to NEWS</h1>
        <p className="mt-2 text-gray-300">Get unlimited access to quality journalism</p>
      </div>

      {submitted ? (
        <div className="max-w-2xl mx-auto text-center py-12">
          <svg className="mx-auto w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Thank You for Subscribing!</h2>
          <p className="mt-2 text-gray-600">Check your email for confirmation and next steps.</p>
          <Link href="/" className="mt-6 inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md p-6 relative ${
                  item.popular ? "ring-2 ring-red-600" : ""
                }`}
              >
                {item.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{item.price}</span>
                  <span className="text-gray-500">{item.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setPlan(item.id);
                    formRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`mt-6 w-full py-2 rounded-md font-medium transition-colors ${
                    item.popular
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Select {item.name}
                </button>
              </div>
            ))}
          </div>

          <div ref={formRef} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Subscription</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="subscribe-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    id="subscribe-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-sm text-gray-600">
                    Selected plan: <span className="font-semibold text-gray-900">{plans.find((p) => p.id === plan)?.name}</span>
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
                >
                  Subscribe Now
                </button>
                <p className="text-xs text-gray-500 text-center">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
