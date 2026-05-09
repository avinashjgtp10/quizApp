"use client"

import Link from "next/link"
import { Download } from "lucide-react"
import axios from "axios"
import { useState } from "react"

export default function HomePage() {
  const [isExporting, setIsExporting] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)

  /* =========================
     AUTHORIZE EXPORT
  ========================= */
  const handleAuthorize = () => {
    if (passwordInput === "dnyanu@2021") {
      setIsAuthorized(true)
      setPasswordInput("")
      alert("Export unlocked ✅")
    } else {
      alert("Incorrect password ❌")
    }
  }

  /* =========================
     EXPORT EXCEL (ONE TIME)
  ========================= */
  const handleExportToExcel = async () => {

    // 🔐 Safety check
    if (!isAuthorized) {
      alert("Please enter password to download Excel ❌")
      return
    }

    try {
      setIsExporting(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/surveys/export-with-courses`,
        { responseType: "blob" }
      )

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "survey-report.xlsx"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      // 🔒 LOCK again after ONE download
      setIsAuthorized(false)
      alert("Download completed ✅ Password required again")

    } catch (error) {
      alert("Excel export failed ❌")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center">

      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        Welcome to the Course Finder
      </h1>

      <p className="text-gray-600 mb-6">
        Discover personalized course recommendations based on your interests and goals.
      </p>

      <div className="flex gap-4 items-center">

        {/* Start Quiz */}
        <Link
          href="/quiz"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>

        {/* 🔐 Password / Export */}
        {!isAuthorized ? (
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="border px-3 py-2 rounded-md"
            />
            <button
              onClick={handleAuthorize}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
            >
              Unlock
            </button>
          </div>
        ) : (
          <button
            onClick={handleExportToExcel}
            disabled={isExporting}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "Export Excel"}
          </button>
        )}
      </div>
    </div>
  )
}
