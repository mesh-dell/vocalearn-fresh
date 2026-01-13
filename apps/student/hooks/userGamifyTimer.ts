"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@/Context/useAuth";

export function useGamifyTimer() {
  const { user, token } = useAuth();

  const secondsActive = useRef(0);
  const secondsActiveHour = useRef(0);

  const lastActivity = useRef(Date.now());
  const isActive = useRef(true);

  // POINT VALUES
  const FIVE_MIN_POINTS = 3;
  const ONE_HOUR_POINTS = 20;

  // MAIN TIMER LOOP
  useEffect(() => {
    if (!user || !token) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // User idle > 2 minutes stops counting
      if (now - lastActivity.current > 2 * 60 * 1000) {
        isActive.current = false;
        return;
      }

      if (isActive.current) {
        secondsActive.current += 1;
        secondsActiveHour.current += 1;

        if (secondsActive.current >= 300) {
          awardPoints(FIVE_MIN_POINTS);
          secondsActive.current = 0;
        }

        if (secondsActiveHour.current >= 3600) {
          awardPoints(ONE_HOUR_POINTS);
          secondsActiveHour.current = 0;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, token]);

  useEffect(() => {
    const reset = () => {
      lastActivity.current = Date.now();
      isActive.current = true;
    };

    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    window.addEventListener("scroll", reset);

    // Pause when tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        isActive.current = false;
      } else {
        reset();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
      window.removeEventListener("scroll", reset);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const baseURL = "http://localhost:8080";

  const awardPoints = async (points: number) => {
    try {
      await axios.post(
        `${baseURL}/student/gamify/update/points`,
        {
          points,
          admissionId: user!.admissionId,
          studentName: `${user!.firstName} ${user!.lastName}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`🔥 You earned +${points} points for staying active!`);
    } catch (err) {
      console.error("Gamify timer failed:", err);
    }
  };
}

