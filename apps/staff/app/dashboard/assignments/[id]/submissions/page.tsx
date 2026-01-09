"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { assignmentsSubmissionsGetAPI } from "@/Services/AssignmentService";
import { Submission } from "@/Models/Assignment";

export default function ViewSubmissionsPage() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        if (!id) return;
        const data = await assignmentsSubmissionsGetAPI(Number(id));
        if (data) setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading submissions...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Assignment {id} Submissions
        </h1>
        <Link href="/dashboard/assignments">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      {submissions.length === 0 ? (
        <p className="text-muted-foreground">
          No submissions found for this assignment.
        </p>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission.submissionId}>
              <CardContent className="space-y-6 p-6">
                {/* Submission Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Admission ID
                    </p>
                    <p className="font-medium text-foreground">
                      {submission.studentAdmissionId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-medium text-foreground">
                      {submission.className}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Submission Status
                    </p>
                    <p
                      className={`font-medium ${
                        submission.submissionStatus === "UNGRADED"
                          ? "text-destructive"
                          : "text-success"
                      }`}
                    >
                      {submission.submissionStatus}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Submitted On
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(submission.submissionDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Answers */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Answers
                  </h2>
                  <div className="space-y-3">
                    {submission.answers.map((answer) => (
                      <div
                        key={answer.questionId}
                        className="rounded-lg border p-3 bg-card"
                      >
                        <p className="text-sm text-muted-foreground">
                          Question {answer.questionId}
                        </p>
                        <p className="font-medium text-foreground">
                          {answer.answerText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <Button className="bg-accent text-foreground hover:bg-accent-hover">
                    Grade Submission
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
