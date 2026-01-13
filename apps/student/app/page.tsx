import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { BookOpen, Users, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-primary-foreground">
            VocaLearn
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-foreground">
              Master New Skills with <span className="">VocaLearn</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Transform your learning journey with our comprehensive learning
              management system. Access courses, track progress, and achieve
              your goals faster than ever.
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/undraw_knowledge.svg"
              alt="Learning illustration"
              width={500}
              height={400}
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-muted px-6 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Why Choose VocaLearn?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
            Our platform combines cutting-edge technology with proven learning
            methodologies
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Interactive Courses",
                text: "Engage with dynamic content, quizzes, and hands-on exercises",
              },
              {
                icon: Users,
                title: "Expert Instructors",
                text: "Learn from industry professionals with years of experience",
              },
              {
                icon: Award,
                title: "Certified Learning",
                text: "Earn recognized certificates upon course completion",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border bg-card p-8">
                <CardContent className="space-y-4 p-0 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded bg-muted">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-accent-foreground">
            Ready to Start Learning?
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-accent-foreground/80">
            Join thousands of learners who have transformed their careers with
            VocaLearn. Start your journey today.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background px-6 py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-accent">
                  <BookOpen className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  VocaLearn
                </span>
              </div>
              <p className="text-muted-foreground">
                Empowering learners worldwide with comprehensive educational
                solutions.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/dashboard">Courses</Link>
                </li>
                <li>
                  <Link href="/dashboard/assignments">Assignments</Link>
                </li>
                <li>
                  <Link href="/dashboard/chat">Chat</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">User</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/signup">Sign Up</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 VocaLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
