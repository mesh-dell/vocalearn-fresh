import { GradedAssignmentSubmission, GradedSubmission } from "@/Models/Grade";
import axios from "axios";

export const fetchGradedSubmissionAPI = async (
  submissionId: number,
): Promise<GradedSubmission> => {
  const res = await axios.get(
    `http://localhost:8080/staff/get/graded/submissions`,
    {
      params: { submissionId },
    },
  );

  return res.data;
};

export const fetchGradedAssignmentSubmissionAPI = async (
  submissionId: number,
): Promise<GradedAssignmentSubmission> => {
  const { data } = await axios.get(
    "http://localhost:8080/staff/get/graded/submissions/assignments",
    {
      params: { submissionId },
    },
  );

  return data;
};
