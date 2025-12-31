"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { QuizQuestion } from "@/components/quiz-question"
export const questions = [
  // === Section A: Student Profile ===
  {
    id: 1,
    name:"name",
    section: "Student Profile",
    question: "What is your name?",
    type: "text" as const,
    placeholder: "Enter your full name",
  },
  {
    id: 2,
    name:"age",
    section: "Student Profile",
    question: "What is your age?",
    type: "number" as const,
    placeholder: "Enter your age",
  },
  {
    id: 3,
    name:"gender",
    section: "Student Profile",
    question: "What is your gender?",
    type: "radio" as const,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "transgender", label: "Transgender" },
    ],
  },
  {
    id: 4,
    name:"institution",
    section: "Student Profile",
    question: "What is your institution name?",
    type: "text" as const,
    placeholder: "Enter your college/university name",
  },
  {
    id: 5,
    name:"degree",
    section: "Student Profile",
    question: "What is your degree program?",
    type: "radio" as const,
    options: [
      { value: "bsc-cs", label: "B.Sc (C.S)" },
      { value: "bsc-ca", label: "B.Sc (C.A)" },
      { value: "bca", label: "BCA" },
      { value: "bba-ca", label: "BBA (C.A)" },
    ],
  },
  {
    id: 6,
    name:"year_of_study",
    section: "Student Profile",
    question: "What is your current year of study?",
    type: "radio" as const,
    options: [
      { value: "1st", label: "1st Year" },
      { value: "2nd", label: "2nd Year" },
      { value: "3rd", label: "3rd Year" },
    ],
  },

  {
    id:7,
    name:"semester",
    section: "Learning Preferences",
    question: "Your current semester ",
    type: "radio" as const,
    options: [
      { value: "Sem-I", label: "Sem-I" },
      { value: "Sem-II", label: "Sem-II" },
      { value: "Sem-III", label: "Sem-III" },
      { value: "Sem-IV", label: "Sem-IV" },
      { value: "Sem-v", label: "Sem-v" },
      { value: "Sem-vI", label: "Sem-vI" }
    ],
  },

  {
    id:8,
    name:"percentage",
    section: "Learning Preferences",
    question: "Percentage",
    type: "radio" as const,
    options: [
      { value: "Below 50%", label: "Below 50%" },
      { value: "50% to 59%", label: "50% to 59%" },
      { value: "60% to 69%", label: "60% to 69%" },
      { value: "70% to 79%", label: "70% to 79%" },
      { value: "Above", label: "80% to Above" },

    ],
  },

  // === Section B: Background Knowledge ===
  {
    id:9,
    name:"core_subjects",
    section: "Background Knowledge",
    question: "Which of the following core subjects have you completed?",
    type: "checkbox" as const,
    options: [
      { value: "programming", label: "Programming in C/C++/Java" },
      { value: "dsa", label: "Data Structures and Algorithms" },
      { value: "dbms", label: "Database Management Systems" },
      { value: "os", label: "Operating Systems" },
      { value: "networks", label: "Computer Networks" },
      { value: "oop", label: "Object-Oriented Programming" },
      { value: "web-tech", label: "Web Technologies" },
      { value: "software-engineering", label: "Software Engineering" },
    ],
  },
  {
    id: 10,
    name:"programming_languages",
    section: "Background Knowledge",
    question: "Which programming languages do you know?",
    type: "checkbox" as const,
    options: [
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "cpp", label: "C/C++" },
      { value: "javascript", label: "JavaScript" },
      { value: "sql", label: "SQL" },
      { value: "mobile", label: "Kotlin / Swift" },
      { value: "dot-net", label: ".NET" },
      { value: "php", label: "PHP" },
    ],
  },
  {
    id:11,
    name:"worked_on_projects",
    section: "Background Knowledge",
    question: "Have you worked on any Software Development Projects?",
    type: "radio" as const,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: 12,
    name:"technical_level",
    section: "Background Knowledge",
    question: "How would you rate your technical proficiency overall?",
    type: "radio" as const,
    options: [
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },

  // === Section C: Interests and Goals ===
  {
    id: 13,
    name:"interests",
    section: "Interests and Goals",
    question: "What are your top areas of interest in technology? (Select up to 3)",
    type: "checkbox" as const,
    maxSelections: 3,
    options: [
      { value: "web-dev", label: "Web Development" },
      { value: "mobile-dev", label: "Mobile App Development" },
      { value: "ai-ml", label: "Artificial Intelligence / Machine Learning" },
      { value: "data-science", label: "Data Science" },
      { value: "cloud", label: "Cloud Computing" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "game-dev", label: "Game Development" },
      { value: "iot", label: "IoT" },
      { value: "ui-ux", label: "UI/UX Design" },
      { value: "blockchain", label: "Blockchain" },
    ],
  },
  {
    id: 14,
    name:"career_goal",
    section: "Interests and Goals",
    question: "What is your career goal after graduation?",
    type: "radio" as const,
    options: [
      { value: "web-dev", label: "Website Development" },
      { value: "software-dev", label: "Software Developer" },
      { value: "data-scientist", label: "Data Scientist" },
      { value: "cybersecurity", label: "Cybersecurity Analyst" },
      { value: "ai-engineer", label: "AI/ML Engineer" },
      { value: "cloud-engineer", label: "Cloud/DevOps Engineer" },
      { value: "designer", label: "UI/UX Designer" },
      { value: "startup", label: "Startup Founder" },
      { value: "undecided", label: "Not yet decided" },
    ],
  },
  {
    id: 15,
    name:"motivation",
    section: "Interests and Goals",
    question: "What motivates you to take an add-on course?",
    type: "checkbox" as const,
    options: [
      { value: "job-prospects", label: "Improve job prospects" },
      { value: "higher-studies", label: "Prepare for higher studies" },
      { value: "trending-skill", label: "Learn a trending skill" },
    ],
  },

  // === Section D: Learning Preferences ===
  {
    id:16,
    name:"weekly_hours",
    section: "Learning Preferences",
    question: "How many hours per week can you dedicate to an add-on course?",
    type: "radio" as const,
    options: [
      { value: "1-2", label: "1–2 Hours" },
      { value: "2-3", label: "2–3 Hours" },
      { value: "3-4", label: "3–4 Hours" },
      { value: "4-5", label: "4–5 Hours" },
    ],
  },
  {
    id:17,
    name:"course_format",
    section: "Learning Preferences",
    question: "Preferred course format:",
    type: "radio" as const,
    options: [
      { value: "self-paced", label: "Self-paced (MOOC style)" },
      { value: "instructor-led", label: "Instructor-led online" },
      { value: "offline", label: "Offline classroom/workshop" },
      { value: "hybrid", label: "Hybrid (online + in-person)" },
      { value: "in-same-institute", label: "In Same Institute" },
      { value: "outside-institute", label: "Outside Institute" },
    ],
  },
  {
    id:18,
    name:"course_length",
    section: "Learning Preferences",
    question: "Preferred course length:",
    type: "radio" as const,
    options: [
      { value: "1-2-weeks", label: "1–2 weeks" },
      { value: "1-month", label: "1 month" },
      { value: "1-2-months", label: "1–2 months" },
      { value: "2-3-months", label: "2–3 months" },
      { value: "flexible", label: "Flexible duration" },
    ],
  },
  {
    id:19,
    name:"willing_to_pay",
    section: "Learning Preferences",
    question: "Are you willing to pay for a course if it offers certification or internships?",
    type: "radio" as const,
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "maybe", label: "Maybe, depends on value" },
    ],
  },
  {
    id:20,
    name:"learning_challenges",
    section: "Learning Preferences",
    question: "Any challenges you face while learning online?",
    type: "checkbox" as const,
    options: [
      { value: "internet", label: "Internet issues" },
      { value: "time", label: "Lack of time" },
      { value: "language", label: "Difficulty understanding English content" },
    ],
  },
  {
    id:21,
    name:"learning_style",
    section: "Learning Preferences",
    question: "Preferred learning style",
    type: "checkbox" as const,
    options: [
      { value: "MCQ", label: "MCQ" },
      { value: "Theoretical", label: "Theoretical" },
      { value: "Practical", label: "Practical" },
    ],
  },

  {
    id:22,
    name:"tools_used",
    section: "Learning Preferences",
    question: "Tool/Platforms you have use ",
    type: "checkbox" as const,
    options: [
      { value: "Git/GitHub", label: "Git/GitHub" },
      { value: "AWS/Azure", label: "AWS/Azure" },
      { value: "Jupyter", label: "Jupyter Notebook" },
      { value: "Android", label: "Android Studio" },
      { value: "VS Code", label: "VS Code" },
    ],
  },

  {
    id:23,
    name:"courses_completed",
    section: "Learning Preferences",
    question: "Addon / Online courses already completed  ",
    type: "checkbox" as const,
    options: [
      { value: "Python", label: "Python Programming" },
      { value: "Data Science", label: "Data Science" },
      { value: "Machine Learning", label: "Machine Learning" },
      { value: "Web Development", label: "Web Development" },
      { value: "Cloud Computing", label: "Cloud Computing" },
      { value: "Cyber Security", label: "Cyber Security" },
      { value: "None", label: "None" },
    ],
  },

  {
    id:24,
    name:"learning_mode",
    section: "learning_mode",
    question: "Preferred learning mode ",
    type: "checkbox" as const,
    options: [
      { value: "Video Based", label: "Video Based" },
      { value: "Hands on/Practical", label: "Hands on/Practical" },
      { value: "Reading/ Documentation", label: "Reading/ Documentation" },
      { value: "Mixed", label: "Mixed" },
    ],
  },

  {
    id:25,
    name:"certifications",
    section: "Learning Preferences",
    question: "Certification obtained ",
    type: "checkbox" as const,
    options: [
      { value: "NPTEL", label: "NPTEL" },
      { value: "Coursera", label: "Coursera" },
      { value: "Udemy", label: "Udemy" },
      { value: "AWS/Google", label: "AWS/Google" },
      { value: "None", label: "None" },
    ],
  },

]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [error, setError] = useState("")
  const router = useRouter()

  const handleNext = async () => {
    const currentQ = questions[currentQuestion]
    const currentAnswer = answers[currentQ.name]

    const hasAnswer =
      currentAnswer &&
      ((typeof currentAnswer === "string" && currentAnswer.trim() !== "") ||
        (Array.isArray(currentAnswer) && currentAnswer.length > 0))

    if (!hasAnswer) {
      setError("⚠️ Please answer this question before continuing.")
      return
    }

    if (currentQ.name === "age") {
      const age = Number(currentAnswer)
      if (isNaN(age) || age <= 0 || age >= 21) {
        setError("⚠️ Age must be below 21.")
        return
      }
    }

    setError("")

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      try {
        const response = await axios.post(
          "https://course-lbe8.onrender.com/api/surveys",
          answers
        )

        const surveyId = response.data.id

        if (surveyId) {
          router.push(`/results?id=${surveyId}`)
        } else {
          alert("Survey ID not received from server")
        }
      } catch (err: any) {
        console.error(err.response?.data || err.message)
        alert("Failed to submit survey")
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleAnswerChange = (value: string | string[]) => {
    const currentQ = questions[currentQuestion]
    setAnswers((prev) => ({
      ...prev,
      [currentQ.name]: value,
    }))
    setError("")
  }

 const progress = ((currentQuestion + 1) / questions.length) * 100

const currentAnswer = answers[questions[currentQuestion].name]

const hasAnswer =
  currentAnswer &&
  ((typeof currentAnswer === "string" && currentAnswer.trim() !== "") ||
    (Array.isArray(currentAnswer) && currentAnswer.length > 0))

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 transition-all">
    <div className="max-w-3xl mx-auto pt-8">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-indigo-800">
          Course Recommendation Questionnaire
        </h1>

        <Progress value={progress} className="w-full" />

        <p className="mt-2 text-sm text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>
            Please provide accurate information for better course recommendations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <QuizQuestion
            question={questions[currentQuestion]}
            value={
              currentAnswer ||
              (questions[currentQuestion].type === "checkbox" ? [] : "")
            }
            onChange={handleAnswerChange}
          />

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {error}
            </p>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <Button onClick={handleNext}>
              {currentQuestion === questions.length - 1
                ? "Get Recommendations"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)
}