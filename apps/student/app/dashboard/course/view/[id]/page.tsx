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
import { CourseGet } from "@/Models/Course";

type ModuleType = {
  moduleId: number;
  week: string;
  moduleName: string;
  content: string;
  duration?: string;
  completed?: boolean;
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const courseId = Number(id);

  const { user, token } = useAuth();

  const [course, setCourse] = useState<CourseGet | null>(null);
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  // Fetch course and modules
  useEffect(() => {
    const fetchCourseAndModules = async () => {
      try {
        const response = await coursesGetAPI();
        if (response?.data) {
          const found = response.data.find(
            (c: CourseGet) => c.courseOverview.id === courseId
          );
          setCourse(found || null);
        }

        const moduleData = await fetchCourseModulesAPI(courseId);
        if (Array.isArray(moduleData)) setModules(moduleData);
      } catch {
        toast.error("Failed to load course details.");
      }
    };

    fetchCourseAndModules();
  }, [courseId]);

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

        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleEnroll}
          disabled={loading}
        >
          {loading ? "Enrolling..." : "Enroll in Course"}
        </Button>
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

              return (
                <div
                  key={module.moduleId}
                  className="w-full rounded-lg border-l-4 border-accent/70 bg-card p-4 shadow-sm sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">
                      {module.week}: {module.moduleName}
                    </h3>
                  </div>

                  <div
                    className="prose text-foreground dark:prose-invert mt-4 max-w-none"
                    dangerouslySetInnerHTML={{ __html: module.content }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
