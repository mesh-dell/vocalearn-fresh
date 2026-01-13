import { handleError } from "@/Helpers/ErrorHandle";
import { LeaderboardEntry } from "@/Models/Leaderboard";
import axios from "axios";

const api = "http://localhost:8080/student/get/gamify/profiles";

export const leaderboardGetAPI = async () => {
  try {
    const res = await axios.get<LeaderboardEntry[]>(api);
    return res.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};
