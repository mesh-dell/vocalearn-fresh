"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@repo/ui/button";
import { useAuth } from "@/Context/useAuth";
import { awardPoints } from "@/Services/GamifyService";
import {
  coursesGetAPI,
  coursesEnrollAPI,
  coursesModuleCompleteAPI,
  fetchCourseModulesAPI,
} from "@/Services/CourseService";
import { fetchCourseSubmissionsAPI } from "@/Services/AssessmentSubmissionService";
import { CourseGet } from "@/Models/Course";
import { Submission } from "@/Models/Submission";
import Link from "next/link";

type QuizType = {
  title: string;
  quizId: number;
  questions: any[];
};

type ModuleType = {
  moduleId: number;
  week: string;
  moduleName: string;
  content: string;
  duration?: string;
  completed?: boolean;
  quizAssessmentDto?: QuizType[];
};

type CATType = {
  title: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  catId: number;
  questions: any[];
};

type AssignmentType = {
  assignmentId: number;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  allowDocuments: boolean;
  allowImages: boolean;
  allowVideos: boolean;
  maxFileSizeMb: number;
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const courseId = Number(id);

  const { user, token } = useAuth();

  const [course, setCourse] = useState<CourseGet | null>(null);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [cats, setCATs] = useState<CATType[]>([]);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Fetch course and modules
  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        const response = await coursesGetAPI();
        if (response?.data) {
          const found = response.data.find(
            (c: CourseGet) => c.courseOverview.id === courseId,
          );
          setCourse(found || null);

          // Extract CATs and Assignments from course data
          if (found) {
            setCATs(found.catAssessmentDto || []);
            setAssignments(found.assignments || []);
          }
        }

        const moduleData = await fetchCourseModulesAPI(courseId);
        if (Array.isArray(moduleData)) setModules(moduleData);

        // Fetch submissions if user is available
        if (user?.admissionId) {
          const submissionsData = await fetchCourseSubmissionsAPI(
            courseId,
            user.admissionId,
          );
          setSubmissions(submissionsData || []);
        }
      } catch {
        toast.error("Failed to load course details.");
      }
    };

    fetchCourseAndModules();
  }, [courseId, user?.admissionId]);

  // Helper function to check if an item is already submitted
  const isSubmitted = (
    type: "CAT" | "QUIZ" | "ASSIGNMENT",
    targetId: number,
  ): boolean => {
    return submissions.some(
      (sub) => sub.submissionType === type && sub.targetId === String(targetId),
    );
  };

  // Enroll in course
  const handleEnroll = async () => {
    if (!course || !user) return;

    const payload = {
      courseId: String(course.courseOverview.id),
      progression: "0%",
      courseName: course.courseName,
      admissionId: user.admissionId,
    };

    setLoading(true);
    try {
      const res = await coursesEnrollAPI(payload);
      if (res?.status === 200) {
        toast.success(`Successfully enrolled in ${course.courseName}!`);
        router.push("/dashboard");
      }
    } catch {
      toast.error("Enrollment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mark module as complete
  const handleModuleComplete = async (moduleId: number) => {
    if (!token || !course) return;

    try {
      const res = await coursesModuleCompleteAPI(
        { moduleId, courseId: course.courseOverview.id },
        token,
      );
      if (res) {
        setCompletedModules((prev) => [...prev, moduleId]);
        toast.success("Module marked as complete!");
        await awardPoints("COMPLETE_MODULE", user!.admissionId, user!.lastName);
      }
    } catch {
      toast.error("Failed to mark module complete.");
    }
  };

  if (!course) {
    return (
      <p className="text-center text-muted-foreground sm:text-lg">
        Loading course...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      {/* Header Buttons */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          ← Back to All Courses
        </Button>

        <Link href={`/dashboard/course/${courseId}/submissions`}>
          <Button variant="outline">View Submissions</Button>
        </Link>
      </div>

      {/* Course Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
          {course.courseName}
        </h1>
        <p className="text-muted-foreground sm:text-base lg:text-lg">
          {course.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span>
            <strong>Level:</strong> {course.courseOverview.skillLevel}
          </span>
          <span>
            <strong>Duration:</strong> {course.courseOverview.duration}
          </span>
        </div>
      </div>

      {/* CATs Section */}
      {cats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Continuous Assessment Tests (CATs)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => {
              const submitted = isSubmitted("CAT", cat.catId);

              return (
                <div
                  key={cat.catId}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {cat.title}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <p>Duration: {cat.durationMinutes} minutes</p>
                    <p>Questions: {cat.questions.length}</p>
                    {submitted && (
                      <p className="text-success font-medium">✓ Submitted</p>
                    )}
                  </div>
                  {cat.questions.length > 0 && (
                    <Link
                      href={`/dashboard/course/${courseId}/cat/${cat.catId}`}
                      className={submitted ? "pointer-events-none" : ""}
                    >
                      <Button
                        className="w-full"
                        disabled={submitted}
                        variant={submitted ? "outline" : "default"}
                      >
                        {submitted ? "Already Submitted" : "View CAT"}
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignments Section */}
      {assignments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Assignments
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => {
              const submitted = isSubmitted(
                "ASSIGNMENT",
                assignment.assignmentId,
              );

              return (
                <div
                  key={assignment.assignmentId}
                  className="rounded-lg border bg-card p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {assignment.title}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <p>Total Marks: {assignment.totalMarks}</p>
                    <p>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    {submitted && (
                      <p className="text-success font-medium">✓ Submitted</p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/course/${courseId}/assignment/${assignment.assignmentId}`}
                    className={submitted ? "pointer-events-none" : ""}
                  >
                    <Button
                      className="w-full"
                      disabled={submitted}
                      variant={submitted ? "outline" : "default"}
                    >
                      {submitted ? "Already Submitted" : "View Assignment"}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          Modules
        </h2>

        {modules.length === 0 ? (
          <p className="text-muted-foreground">
            No modules found for this course.
          </p>
        ) : (
          <div className="space-y-6">
            {modules.map((module) => {
              const isCompleted = completedModules.includes(module.moduleId);
              const hasQuizzes =
                module.quizAssessmentDto && module.quizAssessmentDto.length > 0;

              return (
                <div
                  key={module.moduleId}
                  className="w-full rounded-lg border-l-4 border-accent/70 bg-card p-4 shadow-sm sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">
                      {module.week}: {module.moduleName}
                    </h3>

                    <Button
                      variant={isCompleted ? "outline" : "default"}
                      className={
                        isCompleted
                          ? "border-success/70 text-success-foreground"
                          : "bg-success text-success-foreground hover:bg-success/90"
                      }
                      onClick={() => handleModuleComplete(module.moduleId)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? "Completed ✓" : "Mark Complete"}
                    </Button>
                  </div>

                  <div
                    className="prose text-foreground dark:prose-invert mt-4 max-w-none"
                    dangerouslySetInnerHTML={{ __html: module.content }}
                  />

                  {/* Module Quizzes */}
                  {hasQuizzes && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-foreground mb-3">
                        Quizzes for this module:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.quizAssessmentDto!.map((quiz) => {
                          if (!quiz.questions || quiz.questions.length === 0)
                            return null;

                          const quizSubmitted = isSubmitted(
                            "QUIZ",
                            quiz.quizId,
                          );

                          return (
                            <Link
                              key={quiz.quizId}
                              href={`/dashboard/course/${courseId}/quiz/${quiz.quizId}?moduleId=${module.moduleId}`}
                              className={quizSubmitted ? "pointer-events-none" : ""}
                            >
                              <Button
                                variant={quizSubmitted ? "outline" : "outline"}
                                disabled={quizSubmitted}
                              >
                                {quizSubmitted ? "✓ " : ""}
                                {quiz.title} ({quiz.questions.length} questions)
                                {quizSubmitted ? " - Submitted" : ""}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
