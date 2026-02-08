"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";

import { useAuth } from "@/Context/useAuth";
import { fetchCourseSubmissionsAPI } from "@/Services/AssessmentSubmissionService";
import { Submission } from "@/Models/Submission";
import { useParams, useRouter } from "next/navigation";
import { GradedSubmission } from "@/Models/Grade";
import {
  fetchGradedSubmissionAPI,
  fetchGradedAssignmentSubmissionAPI,
} from "@/Services/GradeService";
import { GradedAssignmentSubmission } from "@/Models/Grade";

export default function StudentSubmissionsPage() {
  const { user, token } = useAuth();
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Quiz/CAT grade dialog
  const [quizGradeOpen, setQuizGradeOpen] = useState(false);
  const [quizGradeLoading, setQuizGradeLoading] = useState(false);
  const [selectedQuizGrade, setSelectedQuizGrade] =
    useState<GradedSubmission | null>(null);

  // Assignment grade dialog
  const [assignmentGradeOpen, setAssignmentGradeOpen] = useState(false);
  const [assignmentGradeLoading, setAssignmentGradeLoading] = useState(false);
  const [selectedAssignmentGrade, setSelectedAssignmentGrade] =
    useState<GradedAssignmentSubmission | null>(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        if (!user) return;

        const data = await fetchCourseSubmissionsAPI(
          Number(id),
          user.admissionId,
        );

        setSubmissions(data);
      } catch {
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [user, token]);

  const handleViewQuizGrade = async (submissionId: number) => {
    try {
      setQuizGradeOpen(true);
      setQuizGradeLoading(true);
      setSelectedQuizGrade(null);

      const data = await fetchGradedSubmissionAPI(submissionId);
      setSelectedQuizGrade(data);
    } catch {
      toast.error("Failed to load grade");
      setQuizGradeOpen(false);
    } finally {
      setQuizGradeLoading(false);
    }
  };

  const handleViewAssignmentGrade = async (submissionId: number) => {
    try {
      setAssignmentGradeOpen(true);
      setAssignmentGradeLoading(true);
      setSelectedAssignmentGrade(null);

      const data = await fetchGradedAssignmentSubmissionAPI(submissionId);
      setSelectedAssignmentGrade(data);
    } catch {
      toast.error("Failed to load assignment grade");
      setAssignmentGradeOpen(false);
    } finally {
      setAssignmentGradeLoading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `http://localhost:8080/${fileUrl}`;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading submissions…</p>;
  }

  if (submissions.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't made any submissions yet.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">My Submissions</h1>

      <Button
        variant="outline"
        onClick={() => router.push(`/dashboard/course/${id}`)}
      >
        ← Back to Course
      </Button>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {submissions.map((submission) => (
          <Card key={submission.submissionId}>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold">{submission.submissionName}</h3>
                <p className="text-sm text-muted-foreground">
                  {submission.submissionCourseName}
                </p>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Type:{" "}
                  <span className="font-medium">
                    {submission.submissionType}
                  </span>
                </p>
                <p>
                  Submitted:{" "}
                  {new Date(submission.submissionDate).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge
                  variant={
                    submission.submissionStatus === "GRADED"
                      ? "default"
                      : "secondary"
                  }
                >
                  {submission.submissionStatus}
                </Badge>

                {submission.submissionStatus === "GRADED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (submission.submissionType === "ASSIGNMENT") {
                        handleViewAssignmentGrade(
                          Number(submission.submissionId),
                        );
                      } else {
                        handleViewQuizGrade(Number(submission.submissionId));
                      }
                    }}
                  >
                    View Grade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz/CAT Grade Dialog */}
      <Dialog open={quizGradeOpen} onOpenChange={setQuizGradeOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedQuizGrade?.quizTitle || "Grade Review"}
            </DialogTitle>
          </DialogHeader>

          {quizGradeLoading && (
            <p className="text-muted-foreground">Loading grade…</p>
          )}

          {selectedQuizGrade && (
            <div className="space-y-6">
              {/* Score summary */}
              <div className="flex items-center justify-between">
                <Badge variant="default">
                  Score: {selectedQuizGrade.totalAwardedPoints} /{" "}
                  {selectedQuizGrade.totalMaxPoints}
                </Badge>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {selectedQuizGrade.questions.map((q, index) => (
                  <Card key={q.questionId}>
                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-semibold">
                        Q{index + 1}. {q.questionText}
                      </h4>

                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium text-red-500">
                            Your answer:
                          </span>{" "}
                          {q.studentAnswer || "—"}
                        </p>

                        <p>
                          <span className="font-medium text-green-600">
                            Correct answer:
                          </span>{" "}
                          {q.correctAnswer}
                        </p>

                        <p className="text-muted-foreground">
                          Marks: {q.awardedMarks} / {q.maxMarks}
                        </p>
                      </div>

                      {q.feedback && (
                        <div className="text-sm text-muted-foreground border-l-2 pl-3">
                          {q.feedback}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Grade Dialog */}
      <Dialog open={assignmentGradeOpen} onOpenChange={setAssignmentGradeOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssignmentGrade?.assignmentName || "Assignment Grade"}
            </DialogTitle>
          </DialogHeader>

          {assignmentGradeLoading && (
            <p className="text-muted-foreground">Loading assignment grade…</p>
          )}

          {selectedAssignmentGrade && (
            <div className="space-y-6">
              {/* Assignment description */}
              {selectedAssignmentGrade.assignmentDescription && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAssignmentGrade.assignmentDescription}
                  </p>
                </div>
              )}

              {/* Score summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold">
                        {selectedAssignmentGrade.awardedMarks} /{" "}
                        {selectedAssignmentGrade.maxMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Percentage
                      </p>
                      <p className="text-2xl font-bold">
                        {selectedAssignmentGrade.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge
                      variant={
                        selectedAssignmentGrade.percentage >= 70
                          ? "default"
                          : selectedAssignmentGrade.percentage >= 50
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {selectedAssignmentGrade.percentage >= 70
                        ? "Excellent"
                        : selectedAssignmentGrade.percentage >= 50
                          ? "Pass"
                          : "Needs Improvement"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Submitted files */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Submitted Files</h4>
                <div className="space-y-2">
                  {selectedAssignmentGrade.files.map((file) => (
                    <div
                      key={file.fileId}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          📄 {file.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.fileType}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3"
                        onClick={() =>
                          handleDownload(file.fileUrl, file.fileName)
                        }
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {selectedAssignmentGrade.feedback && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Instructor Feedback</h4>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedAssignmentGrade.feedback}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {!selectedAssignmentGrade.feedback && (
                <p className="text-sm text-muted-foreground italic">
                  No feedback provided
                </p>
              )}

              {/* Graded date */}
              <div className="text-sm text-muted-foreground">
                Graded on:{" "}
                {new Date(selectedAssignmentGrade.gradedAt).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
