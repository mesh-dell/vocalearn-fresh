"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Label } from "@repo/ui/label";
import { fetchCatAssessmentAPI } from "@/Services/CourseAssessmentService";
import { CatAssessmentGet, CatSubmission } from "@/Models/Cat";
import { useAuth } from "@/Context/useAuth";
import { submitCatAPI } from "@/Services/AssessmentSubmissionService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CatDetailPage() {
  const { id, catId } = useParams();
  const { token } = useAuth();

  const [cat, setCat] = useState<CatAssessmentGet | null>(null);
  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const router = useRouter();

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!cat || !token) return;

    const submission: CatSubmission = {
      courseId: Number(id),
      catId: cat.catId,
      answers: Object.entries(answers).map(([questionId, value]) => {
        const question = cat.questions.find(
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
      await submitCatAPI(submission, token);

      toast.success("CAT submitted successfully!");
      router.push(`/dashboard/course/${id}`);
    } catch (err) {
      console.error("CAT submission failed", err);
      toast.error("Failed to submit CAT");
    }
  };

  useEffect(() => {
    if (!id || !catId) return;

    const fetchCat = async () => {
      try {
        setLoading(true);

        const res = await fetchCatAssessmentAPI(Number(id), Number(catId));

        setCat(res);
      } catch (err) {
        console.error("Failed to load CAT", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [id, catId]);

  if (loading) return <p className="text-muted-foreground">Loading CAT...</p>;

  if (!cat) return <p className="text-muted-foreground">CAT not found.</p>;

  return (
    <div className="space-y-8 text-foreground">
      {/* Header */}
      <header>
        <h1 className="mb-2 text-3xl font-bold text-foreground">{cat.title}</h1>
        <p className="text-sm text-muted-foreground">
          Total Questions: {cat.questions.length}
        </p>
      </header>

      {/* Questions */}
      <section className="space-y-6">
        {cat.questions.map((q) => (
          <Card key={q.questionId}>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">{q.text}</h3>

              {/* OPEN ENDED (no options) */}
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
                  onValueChange={(val) => handleAnswerChange(q.questionId, val)}
                >
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 rounded-md border p-2"
                    >
                      <RadioGroupItem value={opt} id={`${q.questionId}-${i}`} />
                      <Label htmlFor={`${q.questionId}-${i}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex justify-end mt-6">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleSubmit}
        >
          Submit CAT
        </Button>
      </div>
    </div>
  );
}