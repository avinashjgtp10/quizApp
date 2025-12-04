"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, Award, Loader2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { questions } from "../quiz/page"
import axios from "axios"
import { ref, push, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { exportToExcel } from "@/lib/excelExport"

interface Course {
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
]

export default function ResultsPage() {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()

  // Fetch submissions from Firebase
  useEffect(() => {
    try {
      const submissionsRef = ref(database, "quizSubmissions")
      const unsubscribe = onValue(submissionsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const submissionsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }))
          setSubmissions(submissionsArray)
        }
      })
      return () => unsubscribe()
    } catch (error) {
      console.error("Error fetching submissions from Firebase:", error)
    }
  }, [])

  useEffect(() => {
    const quizAnswers = localStorage.getItem("quizAnswers")
    const userSelectedResponse: any[] = []

    if (quizAnswers) {
      const answers = JSON.parse(quizAnswers)
      
      // Submit answers to Firebase
      const submitToFirebase = async () => {
        try {
          const submissionsRef = ref(database, "quizSubmissions")
          await push(submissionsRef, {
            ...answers,
            timestamp: new Date().toISOString(),
          })
        } catch (error) {
          console.error("Error submitting to Firebase:", error)
        }
      }
      submitToFirebase()

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i].question
        const answer = answers[i + 1]
        userSelectedResponse.push({ question, answer })
      }

      const apiData = JSON.stringify(userSelectedResponse, null, 2)

      async function fetchRecommendations() {
        try {
          const response = await axios.post("https://cource.onrender.com/recommendations", apiData)
          const data = response.data.recommendations
          setRecommendedCourses(data)
        } catch (error) {
          console.error("Error fetching recommendations:", error)
          // fallback to default
          setRecommendedCourses(courses)
        } finally {
          setLoading(false)
        }
      }

      fetchRecommendations()
    } else {
      // No quiz answers? Just show all courses
      setRecommendedCourses(courses)
      setLoading(false)
    }
  }, [])

  const handleRetakeQuiz = () => {
    localStorage.removeItem("quizAnswers")
    router.push("/quiz")
  }

  const handleExportToExcel = async () => {
    setIsExporting(true)
    try {
      exportToExcel(submissions)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Error exporting data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-600 text-lg font-medium">Fetching your data, please wait...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Personalized Course Recommendations</h1>
          <p className="text-lg text-gray-600 mb-4">
            {localStorage.getItem("quizAnswers")
              ? "Based on your quiz responses, here are your best-fit courses."
              : "Here are some popular courses to get you started!"}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button onClick={handleRetakeQuiz} variant="outline">
              Retake Quiz
            </Button>
            <Button 
              onClick={handleExportToExcel} 
              disabled={isExporting || submissions.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : `Export to Excel (${submissions.length})`}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{course.instructor}</span>
                    <span className="text-2xl font-bold text-green-600">{course.price}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <Award className="w-4 h-4" />
                    <span>{course.level}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Why These Courses?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our recommendation algorithm analyzes your quiz responses to match the best learning paths for your
                goals. If you haven’t taken the quiz yet, these are some of our most popular and beginner-friendly
                courses.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}