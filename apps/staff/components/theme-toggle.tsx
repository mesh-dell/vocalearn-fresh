"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@repo/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
    >
      {currentTheme === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}
