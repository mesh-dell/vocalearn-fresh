"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchCatAssessmentAPI } from "@/Services/CourseAssessmentService";
import { CatAssessmentGet } from "@/Models/Cat";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";

export default function StaffCatPreviewPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = Number(params.id);
  const catId = Number(params.catId);

  const [cat, setCat] = useState<CatAssessmentGet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !catId) return;

    const loadCat = async () => {
      try {
        setLoading(true);
        const res = await fetchCatAssessmentAPI(courseId, catId);
        setCat(res);
      } catch (err) {
        console.error("Failed to load CAT", err);
        toast.error("Failed to load CAT");
      } finally {
        setLoading(false);
      }
    };

    loadCat();
  }, [courseId, catId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-muted-foreground">Loading CAT...</p>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center text-muted-foreground">CAT not found.</p>
      </div>
    );
  }

  const totalMarks = cat.questions.reduce((sum, q) => sum + q.marks, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {cat.title}
          </h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Questions: {cat.questions.length}</span>
            <span>Total Marks: {totalMarks}</span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/courses/${courseId}`)}
        >
          ← Back to Course
        </Button>
      </div>

      <Badge variant="secondary" className="text-sm">
        Staff Preview Mode - Showing Correct Answers
      </Badge>

      {/* Questions */}
      <section className="space-y-6">
        {cat.questions.map((q, index) => {
          const isOpenEnded = q.options.length === 0;
          const isTrueFalse =
            q.options.length === 2 &&
            q.options.some((opt) => opt.toLowerCase() === "true") &&
            q.options.some((opt) => opt.toLowerCase() === "false");

          return (
            <Card key={q.questionId}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start justify-between">
                  <span>
                    Question {index + 1}: {q.text}
                  </span>
                  <Badge variant="outline">{q.marks} marks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isOpenEnded ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Open-ended question (manual grading required)
                    </p>
                    <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-950 p-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Expected Answer:
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {q.correctAnswer}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Options:</p>
                    {q.options.map((opt, i) => {
                      const isCorrect = isTrueFalse
                        ? opt.toLowerCase() === q.correctAnswer.toLowerCase()
                        : String.fromCharCode(65 + i) === q.correctAnswer;

                      return (
                        <div
                          key={i}
                          className={`flex items-center space-x-2 rounded-md border p-3 ${
                            isCorrect
                              ? "border-green-500 bg-green-50 dark:bg-green-950"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {!isTrueFalse && (
                              <span className="font-semibold text-sm">
                                {String.fromCharCode(65 + i)}.
                              </span>
                            )}
                            <span>{opt}</span>
                          </div>
                          {isCorrect && (
                            <Badge variant="default" className="bg-green-600">
                              Correct Answer
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
