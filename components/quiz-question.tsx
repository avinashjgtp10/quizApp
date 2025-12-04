"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface QuestionOption {
  value: string
  label: string
}

interface Question {
  id: number
  section: string
  question: string
  type: "radio" | "checkbox" | "text" | "number"
  options?: QuestionOption[]
  maxSelections?: number
  placeholder?: string
}

interface QuizQuestionProps {
  question: Question
  value: string | string[]
  onChange: (value: string | string[]) => void
}

export function QuizQuestion({ question, value, onChange }: QuizQuestionProps) {
  const [selectedCount, setSelectedCount] = useState(Array.isArray(value) ? value.length : 0)

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : []

    if (checked) {
      if (question.maxSelections && currentValues.length >= question.maxSelections) {
        return // Don't allow more selections than max
      }
      const newValues = [...currentValues, optionValue]
      onChange(newValues)
      setSelectedCount(newValues.length)
    } else {
      const newValues = currentValues.filter((v) => v !== optionValue)
      onChange(newValues)
      setSelectedCount(newValues.length)
    }
  }

  const renderQuestion = () => {
    switch (question.type) {
      case "text":
      case "number":
        return (
          <Input
            type={question.type}
            placeholder={question.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="mt-4"
          />
        )

      case "radio":
        return (
          <RadioGroup value={typeof value === "string" ? value : ""} onValueChange={onChange} className="mt-4">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        const currentValues = Array.isArray(value) ? value : []
        return (
          <div className="mt-4 space-y-3">
            {question.maxSelections && (
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  {selectedCount}/{question.maxSelections} selected
                </Badge>
                {selectedCount >= question.maxSelections && (
                  <span className="text-sm text-amber-600">Maximum selections reached</span>
                )}
              </div>
            )}
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={option.value}
                  checked={currentValues.includes(option.value)}
                  onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                  disabled={
                    question.maxSelections &&
                    selectedCount >= question.maxSelections &&
                    !currentValues.includes(option.value)
                  }
                />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-2">
        <Badge variant="secondary" className="mb-2">
          {question.section}
        </Badge>
        <h3 className="text-xl font-semibold">{question.question}</h3>
      </div>
      {renderQuestion()}
    </div>
  )
}
