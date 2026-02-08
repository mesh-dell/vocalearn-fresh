"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchQuizAssessmentAPI } from "@/Services/CourseAssessmentService";
import { submitQuizAPI } from "@/Services/AssessmentSubmissionService";
import { QuizAssessmentGet } from "@/Models/Quiz";
import { QuizSubmission } from "@/Models/Quiz";
import { useAuth } from "@/Context/useAuth";
import { toast } from "react-toastify";

import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Label } from "@repo/ui/label";

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();

  const courseId = Number(params.id);
  const quizId = Number(params.quizId);
  const moduleId = Number(searchParams.get("moduleId")); // 🔥 REQUIRED

  const [quiz, setQuiz] = useState<QuizAssessmentGet | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Load quiz
  useEffect(() => {
    if (!courseId || !quizId || !moduleId) return;

    const loadQuiz = async () => {
      try {
        setLoading(true);

        const res = await fetchQuizAssessmentAPI(
          courseId,
          moduleId,
          quizId,
        );

        // depending on how your service returns
        setQuiz(res);
      } catch (err) {
        console.error("Failed to load quiz", err);
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [courseId, moduleId, quizId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (!quiz || !token) return;

    const submission: QuizSubmission = {
      courseId,
      quizId: quiz.quizId,
      moduleId,
      answers: Object.entries(answers).map(([questionId, value]) => {
        const question = quiz.questions.find(
          (q) => q.questionId === Number(questionId)
        );

        // For questions with options
        if (question && question.options.length > 0) {
          // Check if it's a True/False question
          const isTrueFalse =
            question.options.length === 2 &&
            question.options.some((opt) => opt.toLowerCase() === "true") &&
            question.options.some((opt) => opt.toLowerCase() === "false");

          if (isTrueFalse) {
            // For True/False, submit the actual text
            return {
              questionId: Number(questionId),
              answerText: value,
            };
          } else {
            // For MCQ, submit the letter (A, B, C, D)
            const optionIndex = question.options.findIndex(
              (opt) => opt === value
            );
            const optionLetter = String.fromCharCode(65 + optionIndex); // 65 = 'A'

            return {
              questionId: Number(questionId),
              answerText: optionLetter,
            };
          }
        }

        // For open-ended questions, submit the text as-is
        return {
          questionId: Number(questionId),
          answerText: value,
        };
      }),
    };

    try {
      await submitQuizAPI(submission, token);

      toast.success("Quiz submitted successfully!");
      router.push(`/dashboard/course/${courseId}`);
    } catch (err) {
      console.error("Quiz submission failed", err);
      toast.error("Failed to submit quiz");
    }
  };

  if (loading)
    return <p className="text-muted-foreground">Loading quiz...</p>;

  if (!quiz)
    return <p className="text-muted-foreground">Quiz not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-foreground">
      {/* Header */}
      <header>
        <h1 className="mb-2 text-3xl font-bold">
          {quiz.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Questions: {quiz.questions.length}
        </p>
      </header>

      {/* Questions */}
      <section className="space-y-6">
        {quiz.questions.map((q) => (
          <Card key={q.questionId}>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {q.text}
              </h3>

              {/* OPEN ENDED */}
              {q.options.length === 0 ? (
                <Input
                  placeholder="Type your answer..."
                  value={answers[q.questionId] || ""}
                  onChange={(e) =>
                    handleAnswerChange(q.questionId, e.target.value)
                  }
                />
              ) : (
                <RadioGroup
                  value={answers[q.questionId] || ""}
                  onValueChange={(val) =>
                    handleAnswerChange(q.questionId, val)
                  }
                >
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 rounded-md border p-2"
                    >
                      <RadioGroupItem
                        value={opt}
                        id={`${q.questionId}-${i}`}
                      />
                      <Label htmlFor={`${q.questionId}-${i}`}>
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleSubmit}
        >
          Submit Quiz
        </Button>
      </div>
    </div>
  );
}
