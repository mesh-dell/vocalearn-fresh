"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Assignment } from "@/Models/Assignment";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Label } from "@repo/ui/label";
import {
  assignmentsGetAPI,
  assignmentsSubmitAPI,
} from "@/Services/AssignmentService";
import { useAuth } from "@/Context/useAuth";
import { toast } from "react-toastify";
import { awardPoints } from "@/Services/GamifyService";

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const getClassFromAdmissionId = (admissionId: string) => {
    const parts = admissionId.split("/");
    return parts.length > 1 ? parts[1] : "";
  };

  useEffect(() => {
    if (!user?.admissionId || !id) return;

    const className = getClassFromAdmissionId(user.admissionId);
    const fetchAssignment = async () => {
      setLoading(true);
      const res = await assignmentsGetAPI(className!);
      if (res) {
        const found = res.find((a) => a.assignmentId === Number(id));
        setAssignment(found || null);
      }
      setLoading(false);
    };

    fetchAssignment();
  }, [user?.admissionId, id]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.admissionId || !assignment) return;

    const submission = {
      admissionId: user.admissionId,
      className: user.className,
      assignmentId: assignment.assignmentId,
      answerText: Object.entries(answers).map(([questionId, value]) => ({
        questionId: Number(questionId),
        answerText: value,
      })),
    };

    try {
      const data = await assignmentsSubmitAPI(submission);
      if (data) {
        toast.success("Assignment submitted successfully!");
        await awardPoints("SUBMIT_ASSIGNMENT", user.admissionId, user.lastName);
        router.push("/dashboard/assignments");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Failed to submit assignment.");
    }
  };

  if (loading)
    return <p className="text-muted-foreground">Loading assignment...</p>;
  if (!assignment)
    return <p className="text-muted-foreground">Assignment not found.</p>;

  return (
    <div className="space-y-8 text-foreground">
      {/* Header */}
      <header>
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {assignment.title}
        </h1>
        <p className="text-muted-foreground">{assignment.description}</p>
        <p className="text-sm text-muted-foreground">
          Due:{" "}
          <span className="font-medium text-foreground">
            {new Date(assignment.dueDate).toLocaleDateString()}
          </span>
        </p>
      </header>

      {/* Questions */}
      <section className="space-y-6">
        {assignment.questions.map((q) => (
          <Card key={q.questionId}>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {q.text}
              </h3>

              {q.type === "OPEN_ENDED" ? (
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

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleSubmit}
        >
          Submit Assignment
        </Button>
      </div>
    </div>
  );
}
