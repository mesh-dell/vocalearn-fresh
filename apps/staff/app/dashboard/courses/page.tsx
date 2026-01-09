"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { coursesGetAPI } from "@/Services/CourseService";
import { CourseGet } from "@/Models/Course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseGet[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesGetAPI();
        if (response?.data) {
          setCourses(response.data);
        } else if (Array.isArray(response)) {
          setCourses(response);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="container mx-auto space-y-8 px-6 py-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">
          Browse available courses or create a new one.
        </p>
      </div>

      {/* Empty State */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No courses available yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.courseOverview.id}
              className="transition hover:shadow-md"
            >
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{course.courseName}</h3>

                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="pt-2 text-sm text-muted-foreground space-y-1">
                    <p>
                      Duration:{" "}
                      <span className="font-medium text-foreground">
                        {course.courseOverview.duration}
                      </span>
                    </p>
                    <p>
                      Skill Level:{" "}
                      <span className="font-medium text-foreground">
                        {course.courseOverview.skillLevel}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/courses/${course.courseOverview.id}`}
                  className="mt-6"
                >
                  <Button className="w-full">View Course</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA */}
      <div>
        <Link href="/dashboard/courses/create">
          <Button variant="outline">+ Create New Course</Button>
        </Link>
      </div>
    </main>
  );
}
