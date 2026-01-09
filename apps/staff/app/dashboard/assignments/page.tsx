"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { assignmentsGetAPI } from "@/Services/AssignmentService";
import { Assignment } from "@/Models/Assignment";
import { useAuth } from "@/Context/useAuth";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.staffId) return;

    const fetchAssignments = async () => {
      try {
        const response = await assignmentsGetAPI(user?.staffId);
        if (response) {
          setAssignments(response);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      }
    };

    fetchAssignments();
  }, [user?.staffId]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Manage assignments and view student submissions.
          </p>
        </div>
        <Link href="/dashboard/assignments/create">
          <Button>+ Create New Assignment</Button>
        </Link>
      </div>

      {assignments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-muted-foreground">
              No assignments created yet.
            </p>
            <Link href="/dashboard/assignments/create">
              <Button>Create Your First Assignment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card
              key={assignment.assignmentId}
              className="transition-shadow hover:shadow-lg"
            >
              <CardContent className="flex flex-col justify-between p-6">
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    {assignment.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {assignment.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due:{" "}
                    <span className="font-medium text-foreground">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <Link
                  href={`/dashboard/assignments/${assignment.assignmentId}/submissions`}
                >
                  <Button variant="default" className="w-full">
                    View Submissions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
