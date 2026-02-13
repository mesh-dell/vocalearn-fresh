"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { Submission } from "@/Models/Submission";
import { GradedSubmission, GradedAssignmentSubmission, } from "@/Models/Grade";
import { UngradedAssignmentSubmission } from "@/Models/Submission";
import {
  fetchCourseSubmissionsAPI,
  fetchAllStudentsAPI,
  gradeAssignmentSubmissionAPI,
} from "@/Services/StaffService";
import { fetchUngradedAssignmentSubmissionsAPI } from "@/Services/SubmissionService";
import {
  fetchGradedSubmissionAPI,
  fetchGradedAssignmentSubmissionAPI,
} from "@/Services/GradeService";

interface Student {
  email: string;
  admissionId: string;
  admissionYear: number;
  gender: string;
  className: string;
  firstName: string;
  lastName: string;
}

export default function StaffCourseSubmissionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const courseId = Number(id);

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  // Grade dialog for Quiz/CAT
  const [quizGradeOpen, setQuizGradeOpen] = useState(false);
  const [quizGradeLoading, setQuizGradeLoading] = useState(false);
  const [selectedQuizGrade, setSelectedQuizGrade] =
    useState<GradedSubmission | null>(null);

  // Grade dialog for Assignment (view)
  const [assignmentGradeViewOpen, setAssignmentGradeViewOpen] = useState(false);
  const [assignmentGradeViewLoading, setAssignmentGradeViewLoading] =
    useState(false);
  const [selectedAssignmentGradeView, setSelectedAssignmentGradeView] =
    useState<GradedAssignmentSubmission | null>(null);

  // Grade dialog for Assignment (grading ungraded)
  const [assignmentGradeOpen, setAssignmentGradeOpen] = useState(false);
  const [selectedAssignmentSubmission, setSelectedAssignmentSubmission] =
    useState<Submission | null>(null);
  const [awardedMarks, setAwardedMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  // Files dialog for ungraded assignments
  const [ungradedFilesOpen, setUngradedFilesOpen] = useState(false);
  const [ungradedFilesLoading, setUngradedFilesLoading] = useState(false);
  const [selectedUngradedFiles, setSelectedUngradedFiles] =
    useState<UngradedAssignmentSubmission | null>(null);

  // Fetch all students on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchAllStudentsAPI();
        setStudents(data);
      } catch (error) {
        toast.error("Failed to load students");
        console.error(error);
      }
    };

    loadStudents();
  }, []);

  // Fetch submissions when a student is selected
  useEffect(() => {
    if (!selectedStudentId) {
      setSubmissions([]);
      return;
    }

    const loadSubmissions = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseSubmissionsAPI(
          courseId,
          selectedStudentId,
        );
        setSubmissions(data);
      } catch (error) {
        toast.error("Failed to load submissions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [selectedStudentId, courseId]);

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
      setAssignmentGradeViewOpen(true);
      setAssignmentGradeViewLoading(true);
      setSelectedAssignmentGradeView(null);

      const data = await fetchGradedAssignmentSubmissionAPI(submissionId);
      setSelectedAssignmentGradeView(data);
    } catch {
      toast.error("Failed to load assignment grade");
      setAssignmentGradeViewOpen(false);
    } finally {
      setAssignmentGradeViewLoading(false);
    }
  };

  const handleViewUngradedFiles = async (submission: Submission) => {
    try {
      setUngradedFilesOpen(true);
      setUngradedFilesLoading(true);
      setSelectedUngradedFiles(null);

      // Fetch all ungraded submissions for this assignment using targetId
      const allSubmissions = await fetchUngradedAssignmentSubmissionsAPI(
        submission.targetId,
      );
      
      // Find the specific submission for this student
      const studentSubmission = allSubmissions.find(
        (sub) => sub.submissionId === Number(submission.submissionId)
      );

      if (studentSubmission) {
        setSelectedUngradedFiles(studentSubmission);
      } else {
        toast.error("Submission not found");
        setUngradedFilesOpen(false);
      }
    } catch {
      toast.error("Failed to load submitted files");
      setUngradedFilesOpen(false);
    } finally {
      setUngradedFilesLoading(false);
    }
  };

  const openGradeAssignmentDialog = (submission: Submission) => {
    setSelectedAssignmentSubmission(submission);
    setAwardedMarks("");
    setFeedback("");
    setAssignmentGradeOpen(true);
  };

  const closeGradeAssignmentDialog = () => {
    setAssignmentGradeOpen(false);
    setSelectedAssignmentSubmission(null);
    setAwardedMarks("");
    setFeedback("");
  };

  const handleGradeAssignmentSubmit = async () => {
    if (!selectedAssignmentSubmission) return;

    // Validation
    if (!awardedMarks || isNaN(Number(awardedMarks))) {
      toast.error("Please enter a valid marks value");
      return;
    }

    if (Number(awardedMarks) < 0) {
      toast.error("Marks cannot be negative");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    setIsSubmittingGrade(true);
    try {
      await gradeAssignmentSubmissionAPI({
        submissionId: Number(selectedAssignmentSubmission.submissionId),
        awardedMarks: Number(awardedMarks),
        feedback: feedback.trim(),
      });

      toast.success("Assignment graded successfully!");

      // Update the submission status in the list
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.submissionId === selectedAssignmentSubmission.submissionId
            ? { ...sub, submissionStatus: "GRADED" }
            : sub,
        ),
      );

      closeGradeAssignmentDialog();
    } catch (error) {
      toast.error("Failed to grade assignment");
      console.error(error);
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    // Check if fileUrl already contains the full URL, if not prepend the base URL
    link.href = fileUrl.startsWith("http") 
      ? fileUrl 
      : `http://localhost:8080/${fileUrl}`;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSelectedStudent = () => {
    return students.find((s) => s.admissionId === selectedStudentId);
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Course Submissions - Staff View</h1>

        <Button variant="outline" onClick={() => router.back()}>
          ← Back to Course
        </Button>

        {/* Student Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="student-select">Select Student</Label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger id="student-select" className="w-full">
                  <SelectValue placeholder="Choose a student to view their submissions" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.admissionId} value={student.admissionId}>
                      {student.firstName} {student.lastName} ({student.admissionId}) - {student.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Display */}
        {selectedStudentId && (
          <>
            {loading ? (
              <p className="text-muted-foreground">Loading submissions…</p>
            ) : submissions.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">
                    {getSelectedStudent()?.firstName} {getSelectedStudent()?.lastName} has not made any submissions for this course yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Submissions by {getSelectedStudent()?.firstName}{" "}
                  {getSelectedStudent()?.lastName}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {submissions.map((submission) => (
                    <Card key={submission.submissionId}>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold">
                            {submission.submissionName}
                          </h3>
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

                          {/* Action Buttons */}
                          <div className="flex gap-2">
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
                                    handleViewQuizGrade(
                                      Number(submission.submissionId),
                                    );
                                  }
                                }}
                              >
                                View Grade
                              </Button>
                            )}

                            {submission.submissionStatus === "UNGRADED" &&
                              submission.submissionType === "ASSIGNMENT" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleViewUngradedFiles(submission)
                                    }
                                  >
                                    Download
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      openGradeAssignmentDialog(submission)
                                    }
                                  >
                                    Grade
                                  </Button>
                                </>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quiz/CAT Grade View Dialog */}
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
                <p className="text-sm text-muted-foreground">
                  Student: {selectedQuizGrade.studentAdmissionId}
                </p>
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
                            Student answer:
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

      {/* Assignment Grade View Dialog */}
      <Dialog
        open={assignmentGradeViewOpen}
        onOpenChange={setAssignmentGradeViewOpen}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAssignmentGradeView?.assignmentName ||
                "Assignment Grade"}
            </DialogTitle>
          </DialogHeader>

          {assignmentGradeViewLoading && (
            <p className="text-muted-foreground">Loading assignment grade…</p>
          )}

          {selectedAssignmentGradeView && (
            <div className="space-y-6">
              {/* Student info */}
              <p className="text-sm text-muted-foreground">
                Student: {selectedAssignmentGradeView.studentAdmissionId}
              </p>

              {/* Assignment description */}
              {selectedAssignmentGradeView.assignmentDescription && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAssignmentGradeView.assignmentDescription}
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
                        {selectedAssignmentGradeView.awardedMarks} /{" "}
                        {selectedAssignmentGradeView.maxMarks}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Percentage
                      </p>
                      <p className="text-2xl font-bold">
                        {selectedAssignmentGradeView.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge
                      variant={
                        selectedAssignmentGradeView.percentage >= 70
                          ? "default"
                          : selectedAssignmentGradeView.percentage >= 50
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {selectedAssignmentGradeView.percentage >= 70
                        ? "Excellent"
                        : selectedAssignmentGradeView.percentage >= 50
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
                  {selectedAssignmentGradeView.files.map((file) => (
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
              {selectedAssignmentGradeView.feedback && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Instructor Feedback</h4>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedAssignmentGradeView.feedback}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {!selectedAssignmentGradeView.feedback && (
                <p className="text-sm text-muted-foreground italic">
                  No feedback provided
                </p>
              )}

              {/* Graded date */}
              <div className="text-sm text-muted-foreground">
                Graded on:{" "}
                {new Date(
                  selectedAssignmentGradeView.gradedAt,
                ).toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ungraded Assignment Files Dialog */}
      <Dialog open={ungradedFilesOpen} onOpenChange={setUngradedFilesOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submitted Files</DialogTitle>
            <DialogDescription>
              Student: {selectedUngradedFiles?.studentAdmissionId}
            </DialogDescription>
          </DialogHeader>

          {ungradedFilesLoading && (
            <p className="text-muted-foreground">Loading files…</p>
          )}

          {selectedUngradedFiles && (
            <div className="space-y-4">
              {selectedUngradedFiles.files && selectedUngradedFiles.files.length > 0 ? (
                <div className="space-y-2">
                  {selectedUngradedFiles.files.map((file) => (
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
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No files submitted
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Grade Assignment Dialog (for ungraded assignments) */}
      <Dialog open={assignmentGradeOpen} onOpenChange={setAssignmentGradeOpen}>
        <DialogContent className="sm:max-w-131.25">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignmentSubmission && (
                <>
                  {selectedAssignmentSubmission.submissionName}
                  <br />
                  Student: {selectedStudentId}
                  <br />
                  Submitted:{" "}
                  {new Date(
                    selectedAssignmentSubmission.submissionDate,
                  ).toLocaleString()}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Marks input */}
            <div className="space-y-2">
              <Label htmlFor="marks">Awarded Marks *</Label>
              <Input
                id="marks"
                type="number"
                min="0"
                step="0.5"
                placeholder="Enter marks (e.g., 85)"
                value={awardedMarks}
                onChange={(e) => setAwardedMarks(e.target.value)}
                disabled={isSubmittingGrade}
              />
            </div>

            {/* Feedback textarea */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback *</Label>
              <Textarea
                id="feedback"
                placeholder="Provide constructive feedback for the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={isSubmittingGrade}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeGradeAssignmentDialog}
              disabled={isSubmittingGrade}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGradeAssignmentSubmit}
              disabled={isSubmittingGrade}
            >
              {isSubmittingGrade ? "Submitting..." : "Submit Grade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
