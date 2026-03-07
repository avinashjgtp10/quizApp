"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download } from "lucide-react"
import moment from "moment";

import { ref, push, onValue } from "firebase/database"
import { database } from "@/lib/firebase"

interface Course {
  //survery_response_id:number
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  rating: number
  students: number
  price: string
  tags: string[]
  image: string
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

  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /* =========================
     RANDOM COURSES
  ========================= */
  useEffect(() => {
    const shuffled = [...courses].sort(() => 0.5 - Math.random())
    setRecommendedCourses(shuffled.slice(0, 3))
    setLoading(false)
  }, [])

  /* =========================
     SELECT / UNSELECT
  ========================= */
  const toggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    )
  }

  /* =========================
     SAVE (FINAL STORE)
  ========================= */
  const saveSelectedCourses = async () => {
    const surveyData = localStorage.getItem("survey_answers")

    if (!surveyData) {
      alert("Survey data missing. Please fill quiz again.")
      router.push("/quiz")
      return
    }

    if (selectedCourseIds.length === 0) {
      alert("Please select at least one course")
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        ...JSON.parse(surveyData), // ✅ all 25 fields at the root level
        course_ids: selectedCourseIds,          // ✅ selected courses
        createdAt: new Date().toISOString(),
      }

      await axios.post(
        "https://course-qf7m.onrender.com/api/surveys",
        payload
      )

      alert("✅ Complete data saved successfully")

      localStorage.removeItem("survey_answers")
    } catch (error: any) {
      console.error(error)
      alert(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save data"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* =========================
     LOADER
  ========================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Personalized Course Recommendations
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.push("/quiz")}>
          Retake Quiz
        </Button>

        <Button onClick={saveSelectedCourses} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Selected Courses"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {recommendedCourses.map((course) => {
          const selected = selectedCourseIds.includes(course.id)

          return (
            <Card
              key={course.id}
              onClick={() => toggleCourse(course.id)}
              className={`cursor-pointer border-2 transition ${selected ? "border-green-600 bg-green-50" : "border-gray-200"
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