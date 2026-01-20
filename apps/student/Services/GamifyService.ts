import axios from "axios";

const baseURL = "http://localhost:8080";

export const GamifyActions = {
  LOGIN: 5,
  COMPLETE_MODULE: 30,
  SUBMIT_ASSIGNMENT: 20,
  PERFECT_SCORE: 50,
  ACTIVE_ONE_HOUR: 12,
} as const;

type GamifyActionKey = keyof typeof GamifyActions;

export async function awardPoints(
  action: GamifyActionKey,
  admissionId: string,
  studentName: string,
) {
  try {
    const points = GamifyActions[action];

    if (!points) return;

    await axios.post(`${baseURL}/student/gamify/update/points`, {
      points,
      admissionId,
      studentName,
    });
  } catch (err) {
    console.error("Gamify award failed:", err);
  }
}

export async function getActiveWeek(token: string) {
  try {
    const res = await axios.get(`${baseURL}/student/gamify/get/active/week`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Could not load weekly gamify data:", err);
    return null;
  }
}

export async function getGamifyProfile(token: string) {
  try {
    const res = await axios.get(
      `${baseURL}/student/gamify/get/gamify/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (err) {
    console.error("Could not load gamify profile:", err);
    return null;
  }
}
