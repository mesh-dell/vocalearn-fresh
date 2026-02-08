"use client";

import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/Context/useAuth";

export function DashboardNav() {
  const { logout } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">VocaLearn</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/dashboard">My Courses</NavLink>
            <NavLink href="/dashboard/assignments">Assignments</NavLink>
            <NavLink href="/dashboard/chat">Chat</NavLink>
            <NavLink href="/dashboard/group-chat">Group Chat</NavLink>
            <NavLink href="/dashboard/notifications">Notifications</NavLink>
            <NavLink href="/dashboard/profile">Profile</NavLink>
            <NavLink href="/dashboard/certificates">Certificates</NavLink>
            <ThemeToggle />

            <Button variant="outline" onClick={logout}>
              Log out
            </Button>
          </nav>

          {/* Mobile Nav */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">My Courses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/assignments">Assignments</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/chat">Chat</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/group-chat">Group Chat</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/certificates">Certificates</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center">
                <ThemeToggle />
                <span className="ml-2">Toggle theme</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition"
    >
      {children}
    </Link>
  );
}
