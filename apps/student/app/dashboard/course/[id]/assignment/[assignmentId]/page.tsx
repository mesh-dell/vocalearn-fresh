"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAssignmentAPI } from "@/Services/CourseAssessmentService";
import { submitAssignmentApi } from "@/Services/AssessmentSubmissionService";
import { toast } from "react-toastify";
import { AssignmentGet } from "@/Models/AssignmentGenerative";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/Context/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const assignmentSchema = z.object({
  file: z
    .any()
    .refine((file) => file?.[0]?.size > 0, "Assignment file is required"),
});
type AssignmentForm = z.infer<typeof assignmentSchema>;

export default function AssignmentPage() {
  const { id, assignmentId } = useParams();
  const { token } = useAuth();
  const courseId = Number(id);
  const AID = Number(assignmentId);
  const [assignment, setAssignment] = useState<AssignmentGet | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
  });

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        setLoading(true);
        const res = await fetchAssignmentAPI(courseId, AID);
        setAssignment(res);
      } catch {
        toast.error("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && AID) {
      loadAssignment();
    }
  }, [courseId, AID]);

  if (loading) {
    return <p className="text-muted-foreground">Loading assignment...</p>;
  }

  if (!assignment) {
    return <p className="text-muted-foreground">Assignment not found.</p>;
  }

  const isPastDeadline = new Date(assignment.dueDate).getTime() < Date.now();

  const handleSubmitAssignment = async (data: AssignmentForm) => {
    if (isPastDeadline) {
      toast.error("Submission deadline has passed.");
      return;
    }
    if (!token) {
      toast.error("You must be logged in to submit.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      const metadata = JSON.stringify({
        courseId,
        assignmentId: assignment.assignmentId,
      });

      const metadataBlob = new Blob([metadata], { type: "application/json" });

      // Append the blob instead of a raw string
      formData.append("metadata", metadataBlob);
      formData.append("files", data.file[0]);

      await submitAssignmentApi(formData, token);

      toast.success("Assignment submitted successfully!");
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <Link
        href={`/dashboard/course/${courseId}`}
        className="inline-flex items-center text-sm hover:underline"
      >
        Back to Course
      </Link>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          {assignment.assignmentName}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {assignment.assignmentDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span>
            <strong>Due:</strong>{" "}
            {new Date(assignment.dueDate).toLocaleString()}
          </span>
          <span>
            <strong>Total Marks:</strong> {assignment.totalMarks}
          </span>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={isPastDeadline}
            className="bg-success text-success-foreground hover:bg-success/90 disabled:opacity-50"
          >
            {isPastDeadline ? "Submission Closed" : "Submit Assignment"}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
          </DialogHeader>

          {isPastDeadline ? (
            <p className="text-sm text-destructive">
              Submission closed. Deadline was{" "}
              {new Date(assignment.dueDate).toLocaleString()}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit(handleSubmitAssignment)}
              className="space-y-6"
              encType="multipart/form-data"
            >
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Upload File
                </label>

                <input
                  type="file"
                  {...register("file")}
                  className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
                />

                {errors.file && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.file.message as string}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-success text-success-foreground"
                >
                  {submitting ? "Submitting..." : "Submit Assignment"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
