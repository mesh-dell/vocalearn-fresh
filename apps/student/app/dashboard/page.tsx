"use client";

import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Progress } from "@repo/ui/progress";
import { useAuth } from "@/Context/useAuth";
import { CourseGet, EnrolledCourse } from "@/Models/Course";
import {
  coursesGetAPI,
  fetchEnrolledCoursesAPI,
} from "@/Services/CourseService";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, token, isLoggedIn } = useAuth();
  const router = useRouter();
  const isAuthenticated = isLoggedIn();

  const [courses, setCourses] = useState<CourseGet[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [coursesRes, enrolledRes] = await Promise.all([
          coursesGetAPI(),
          token ? fetchEnrolledCoursesAPI(token) : Promise.resolve([]),
        ]);

        if (coursesRes?.data) setCourses(coursesRes.data);
        if (enrolledRes) setEnrolledCourses(enrolledRes);
      } catch {
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated || !user) return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Welcome Back, {user.email}!
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your learning?
        </p>
      </div>

      {/* Enrolled Courses */}
      <section>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          Enrolled Courses
        </h2>

        {enrolledCourses.length === 0 ? (
          <p className="text-muted-foreground">
            You have not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const progress = parseInt(course.progression.replace("%", ""));

              return (
                <Card
                  key={course.courseId}
                  className="border border-border transition hover:shadow-md"
                >
                  <CardContent className="space-y-3 p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {course.courseNames}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Progress: {course.progression}
                      </p>
                      <Progress value={progress} className="mt-2 h-2" />
                    </div>

                    {progress === 100 ? (
                      <p className="mt-4 rounded-md bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground">
                        Course finished
                      </p>
                    ) : (
                      <Link
                        href={`/dashboard/course/${course.courseId}`}
                        className="block"
                      >
                        <Button className="mt-4 w-full">
                          Continue Learning
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* All Courses */}
      <section>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          All Available Courses
        </h2>

        {courses.length === 0 ? (
          <p className="text-muted-foreground">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.courseOverview.id}
                className="border border-border transition hover:shadow-md"
              >
                <CardContent className="flex h-full flex-col justify-between p-6">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {course.courseName}
                    </h3>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Level: {course.courseOverview.skillLevel}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {course.courseOverview.duration}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/course/view/${course.courseOverview.id}`}
                    className="block"
                  >
                    <Button className="mt-6 w-full">View Course</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
