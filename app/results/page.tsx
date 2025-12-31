"use client"

import { useState, useEffect } from "react"
import { useRouter} from "next/navigation"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download } from "lucide-react"

import { ref, push, onValue } from "firebase/database"
import { database } from "@/lib/firebase"

interface Course {
  //survery_response_id:number
  id:number
  title:string
  description:string
  instructor:string
  duration:string
  level:string
  rating:number
  students:number
  price:string
  tags:string[]
  image:string
}

const courses: Course[] = [
  {
    id: 1,
    title: "Complete Full Stack Web Development with MERN",
    description: "Master React, Node.js, Express, MongoDB and build industry-ready projects with placement assistance",
    instructor: "Priya Sharma",
    duration: "120 hours",
    level: "Beginner to Advanced",
    rating: 4.8,
    students: 45000,
    price: "₹4,999",
    tags: ["Web Development", "React", "Node.js", "MongoDB", "JavaScript"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Data Science & Machine Learning with Python",
    description: "Complete data science course covering pandas, numpy, scikit-learn, and real industry projects",
    instructor: "Rajesh Kumar",
    duration: "80 hours",
    level: "Intermediate",
    rating: 4.7,
    students: 32000,
    price: "₹6,999",
    tags: ["Python", "Data Science", "Machine Learning", "Analytics", "AI"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Android App Development with Kotlin",
    description: "Build modern Android apps with Kotlin, Firebase, and publish to Google Play Store",
    instructor: "Anita Desai",
    duration: "60 hours",
    level: "Beginner to Intermediate",
    rating: 4.6,
    students: 28000,
    price: "₹3,999",
    tags: ["Android", "Kotlin", "Mobile Development", "Firebase"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Cloud Computing with AWS & DevOps",
    description: "Master AWS services, Docker, Kubernetes and become a certified cloud professional",
    instructor: "Vikram Singh",
    duration: "100 hours",
    level: "Intermediate to Advanced",
    rating: 4.9,
    students: 25000,
    price: "₹8,999",
    tags: ["AWS", "Cloud Computing", "DevOps", "Docker", "Kubernetes"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Cybersecurity & Ethical Hacking Bootcamp",
    description: "Learn penetration testing, network security, and ethical hacking with hands-on labs",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹7,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 6,
    title: "Networking & System",
    description: "Understand computer networks, system architecture, protocols, servers.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹6,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 7,
    title: "DevOps & Software Development",
    description: "Learn software development with DevOps tools like Git, CI/CD, Docker, and cloud deployment for building and delivering applications .",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 8,
    title: "Big Data, Analytics & Data Engineering",
    description: "Learn big data processing, data analytics.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },

  {
    id: 9,
    title: "Software Engineering & Architecture",
    description: "Learn software design principles, system architecture.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },
  
  {
    id: 10,
    title: "Tech + Management / Leadership",
    description: "leadership, project management, and team collaboration for real-world projects.",
    instructor: "Arjun Mehta",
    duration: "90 hours",
    level: "Intermediate",
    rating: 4.5,
    students: 18000,
    price: "₹5,499",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    image: "/placeholder.svg?height=200&width=300",
  },
]
/* =========================
   COMPONENT
========================= */
export default function ResultsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
 
  const router = useRouter()
  const surveyId = searchParams.id

  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [isExportAuthorized, setIsExportAuthorized] = useState(false)
// =========================
// RANDOM RESULT FUNCTION
// =========================
const getRandomResult = <T,>(arr: T[]): T[] => {
  const result: T[] = []
  const copy = [...arr]
  const count = Math.floor(Math.random() * arr.length) + 1

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(randomIndex, 1)[0])
  }

  return result
}

  /* =========================
     LOAD COURSES
  ========================= */
  useEffect(() => {
  const randomCourses = getRandomResult(courses)
  setRecommendedCourses(randomCourses)
  setLoading(false)
}, [])


  /* =========================
     SELECT / UNSELECT COURSE
  ========================= */
  const toggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    )
  }

  /* =========================
     SAVE SELECTED COURSES (ONCE)
  ========================= */
  const saveSelectedCourses = async () => {
    if (!surveyId) {
      alert("Survey ID missing")
      return
    }

    if (selectedCourseIds.length === 0) {
      alert("Please select at least one course")
      return
    }

    const storageKey = `courses_saved_${surveyId}`
    if (localStorage.getItem(storageKey) === "true") {
      alert("Courses already saved")
      return
    }

    try {
      setIsSubmitting(true)

      await axios.post("https://course-lbe8.onrender.com/api/recommendations", {
        survey_response_id: Number(surveyId),
        course_ids: selectedCourseIds, // ✅ ONLY IDS
      })

      localStorage.setItem(storageKey, "true")
      alert("Courses saved successfully ✅")
    } catch (error) {
      console.error(error)
      alert("Failed to save courses ❌")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* =========================
     EXPORT EXCEL
  ========================= */
  const handleExportToExcel = async () => {
    try {
      setIsExporting(true)

      const response = await axios.get(
        "https://course-lbe8.onrender.com/api/surveys/export-with-courses",
        { responseType: "blob" }
      )

      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "survey-report.xlsx"
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert("Excel export failed")
    } finally {
      setIsExporting(false)
    }
  }

  /*const handleAuthorize = () => {
    if (passwordInput === "1234") {
      setIsExportAuthorized(true)
      setPasswordInput("")
    } else {
      alert("Incorrect password")
    }
  }
*/
  /* =========================
     UI
  ========================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Personalized Course Recommendations
      </h1>

      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        <Button onClick={() => router.push("/quiz")} variant="outline">
          Retake Quiz
        </Button>

        <Button onClick={saveSelectedCourses} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Selected Courses"}
        </Button>

        {/* {!isExportAuthorized ? (
          <>
            <input
              type="password"
              placeholder="Admin password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="border px-2 py-1"
            />
            <Button onClick={handleAuthorize}>Unlock Export</Button>
          </>
        ) : (
          <Button onClick={handleExportToExcel} disabled={isExporting}>
            <Download className="w-4 h-4 mr-1" />
            Export Excel
          </Button>
        )} */}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {recommendedCourses.map((course) => {
          const selected = selectedCourseIds.includes(course.id)

          return (
            <Card
              key={course.id}
              onClick={() => toggleCourse(course.id)}
              className={`cursor-pointer border-2 transition ${
                selected
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-sm">{course.instructor}</p>
                <p className="font-bold">{course.price}</p>

                <div className="flex gap-1 mt-2 flex-wrap">
                  {course.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                {selected && (
                  <p className="text-green-700 text-sm mt-2 font-semibold">
                    ✓ Selected
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
