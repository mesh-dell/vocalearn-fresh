"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseGet } from "@/Models/Course";
import { coursesGetAPI } from "@/Services/CourseService";
import { Button } from "@repo/ui/button";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<CourseGet | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await coursesGetAPI();
        if (response?.data) {
          const found = response.data.find(
            (c: CourseGet) => c.courseOverview.id === courseId
          );
          setCourse(found || null);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <p className="text-center text-muted-foreground sm:text-lg mt-10">
        Loading course...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Course Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
          {course.courseName}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base lg:text-lg">
          {course.description}
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:flex md:flex-wrap md:gap-6">
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

        <div className="space-y-6">
          {course.moduleDto.map((module, index) => (
            <div
              key={index}
              className="w-full rounded-lg border-l-4 border-accent bg-card p-4 shadow-sm sm:p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-foreground sm:text-lg lg:text-xl">
                {module.week}: {module.moduleName}
              </h3>
              <div
                className="prose prose-sm sm:prose-base max-w-full wrap-break-word whitespace-pre-wrap text-muted-foreground [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:text-foreground"
                dangerouslySetInnerHTML={{ __html: module.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
