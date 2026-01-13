"use client";

import { useGamifyTimer } from "@/hooks/userGamifyTimer";

export default function GamifyTimerRunner() {
  useGamifyTimer();
  return null; // invisible component that only runs the hook
}
