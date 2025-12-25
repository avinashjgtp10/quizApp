"use client"

import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        Welcome to the Course Finder
      </h1>

      <p className="text-gray-600 mb-6">
        Discover personalized course recommendations based on your interests and goals.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          href="/quiz"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>

        <button
          className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition"
          onClick={() => alert("Export Unlocked")}
        >
          Unlock Export
        </button>
      </div>
    </div>
  )
}
