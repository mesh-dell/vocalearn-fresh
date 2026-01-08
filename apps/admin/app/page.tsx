"use client";

import { useEffect } from "react";
import { useAuth } from "@/Context/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function HomePage() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center text-foreground space-y-6">
      <h1 className="text-4xl font-bold">Welcome to Vocalearn Admin</h1>

      <p className="max-w-md text-muted-foreground">
        Manage staff, classes, and system-wide configurations from your admin
        dashboard.
      </p>

      <div className="flex gap-4">
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>

        <Link href="/dashboard">
          <Button variant="outline">Go to Dashboard</Button>
        </Link>
      </div>

      <footer className="mt-10 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Vocalearn Admin Console
      </footer>
    </div>
  );
}
