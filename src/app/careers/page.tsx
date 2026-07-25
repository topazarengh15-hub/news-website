import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the NEWS team",
};

const jobListings = [
  {
    title: "Senior Political Correspondent",
    location: "Washington, D.C.",
    type: "Full-time",
    description: "Cover breaking political news and policy developments for our growing audience.",
  },
  {
    title: "Technology Reporter",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Report on the latest in tech, AI, and digital innovation.",
  },
  {
    title: "Sports Editor",
    location: "New York, NY",
    type: "Full-time",
    description: "Lead our sports coverage and manage a team of writers.",
  },
  {
    title: "Video Producer",
    location: "Remote",
    type: "Full-time",
    description: "Create compelling video content for our digital platforms.",
  },
  {
    title: "Social Media Manager",
    location: "Remote",
    type: "Full-time",
    description: "Manage our social media presence and audience engagement.",
  },
];

export default function CareersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 bg-gray-900 rounded-lg p-6">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Careers</span>
        </nav>
        <h1 className="text-3xl font-bold text-white">Careers</h1>
        <p className="mt-2 text-gray-300">Join our team of journalists and media professionals</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Work at NEWS?</h2>
          <p className="text-gray-600 mb-6">
            At NEWS, we believe in the power of journalism to inform and inspire. 
            Join a team that values integrity, creativity, and impact. We offer 
            competitive salaries, comprehensive benefits, and the opportunity to 
            be part of something meaningful.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">50+</p>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">10M+</p>
              <p className="text-sm text-gray-600">Monthly Readers</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">24/7</p>
              <p className="text-sm text-gray-600">News Coverage</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
        <div className="space-y-4">
          {jobListings.map((job, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{job.location} &middot; {job.type}</p>
                </div>
                <Link
                  href="/contact"
                  className="mt-4 sm:mt-0 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors text-center inline-block"
                >
                  Apply Now
                </Link>
              </div>
              <p className="mt-3 text-gray-600 text-sm">{job.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
