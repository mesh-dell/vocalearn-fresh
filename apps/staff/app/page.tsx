"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import { BookOpen, Users, ClipboardCheck } from "lucide-react";

export default function StaffLandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">VocaLearn</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Register
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Empower Your Teaching with VocaLearn
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Build engaging courses, manage assignments, and collaborate with
            your students — all in one platform designed for instructors.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Join as Instructor</Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline">
                Instructor Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Everything You Need as an Instructor
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={BookOpen}
            title="Create Courses"
            description="Build structured modules with rich content using our integrated editor and multimedia support."
          />
          <FeatureCard
            icon={ClipboardCheck}
            title="Manage Assignments"
            description="Post assignments, review student submissions, and provide timely feedback effortlessly."
          />
          <FeatureCard
            icon={Users}
            title="Connect with Students"
            description="Engage with learners directly via chat and collaboration tools to boost student success."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Teaching?</h2>
          <p className="mb-8 text-muted-foreground">
            Sign up today and get access to all the tools you need to inspire
            and guide your students.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

/* ---------------------------------- */
/* Feature Card Component              */
/* ---------------------------------- */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm transition hover:shadow-md">
      <Icon className="h-12 w-12 mb-4 text-primary" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
