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

import { UngradedAssignmentSubmission } from "@/Models/Submission";
import {
  fetchAllUngradedAssignmentSubmissionsAPI,
  gradeAssignmentSubmissionAPI,
} from "@/Services/SubmissionService";

export default function StaffCourseSubmissionsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<UngradedAssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<UngradedAssignmentSubmission | null>(null);
  const [awardedMarks, setAwardedMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await fetchAllUngradedAssignmentSubmissionsAPI(Number(id));
        setSubmissions(data);
      } catch (error) {
        toast.error("Failed to load submissions");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, [id]);

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openGradeDialog = (submission: UngradedAssignmentSubmission) => {
    setSelectedSubmission(submission);
    setAwardedMarks("");
    setFeedback("");
    setIsGradeDialogOpen(true);
  };

  const closeGradeDialog = () => {
    setIsGradeDialogOpen(false);
    setSelectedSubmission(null);
    setAwardedMarks("");
    setFeedback("");
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;

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

    setIsSubmitting(true);
    try {
      await gradeAssignmentSubmissionAPI({
        submissionId: selectedSubmission.submissionId,
        awardedMarks: Number(awardedMarks),
        feedback: feedback.trim(),
      });

      toast.success("Assignment graded successfully!");
      
      // Remove the graded submission from the list
      setSubmissions((prev) =>
        prev.filter((sub) => sub.submissionId !== selectedSubmission.submissionId)
      );
      
      closeGradeDialog();
    } catch (error) {
      toast.error("Failed to grade assignment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading submissions…</p>;
  }

  if (submissions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No ungraded assignment submissions for this course yet.
      </p>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Ungraded Assignment Submissions</h1>
        <Button variant="outline" onClick={() => router.back()}>
          ← Back to Course
        </Button>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <Card key={submission.submissionId}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold">
                    Student: {submission.studentAdmissionId}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {submission.className}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Submitted:{" "}
                    {new Date(submission.submissionDate).toLocaleString()}
                  </p>
                  <p>
                    Files: <span className="font-medium">{submission.files.length}</span>
                  </p>
                </div>

                {/* Files section with download links */}
                <div className="space-y-2">
                  {submission.files.map((file) => (
                    <div
                      key={file.fileId}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          📄 {file.fileName}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 h-7 px-2"
                        onClick={() => handleDownload(file.fileUrl, file.fileName)}
                      >
                        ⬇️ Download
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary">{submission.submissionStatus}</Badge>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => openGradeDialog(submission)}
                    >
                      Grade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Grading Dialog */}
      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  Student: {selectedSubmission.studentAdmissionId}
                  <br />
                  Submitted: {new Date(selectedSubmission.submissionDate).toLocaleString()}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Display files */}
            {selectedSubmission && selectedSubmission.files.length > 0 && (
              <div className="space-y-2">
                <Label>Submitted Files</Label>
                {selectedSubmission.files.map((file) => (
                  <div
                    key={file.fileId}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <p className="text-sm truncate flex-1">📄 {file.fileName}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => handleDownload(file.fileUrl, file.fileName)}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                rows={5}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeGradeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGradeSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Grade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
