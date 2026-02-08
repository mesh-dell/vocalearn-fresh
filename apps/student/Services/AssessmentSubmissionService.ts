import axios from "axios";
import { QuizSubmission } from "../Models/Quiz";
import { CatSubmission } from "../Models/Cat";
import { handleError } from "@/Helpers/ErrorHandle";
import { Submission } from "@/Models/Submission";

const apiSubmitQuiz = "http://localhost:8080/student/submit/quiz";
const apiSubmitCat = "http://localhost:8080/student/submit/cat";
const apiSubmitAssignment = "http://localhost:8080/student/submit/assignment";

export const submitQuizAPI = async (
  quizSubmission: QuizSubmission,
  token: string,
) => {
  try {
    const data = await axios.post(apiSubmitQuiz, quizSubmission, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const submitCatAPI = async (
  catSubmission: CatSubmission,
  token: string,
) => {
  try {
    const data = await axios.post(apiSubmitCat, catSubmission, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const submitAssignmentApi = async (data: FormData, token: string) => {
  const res = await axios.post(apiSubmitAssignment, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const fetchCourseSubmissionsAPI = async (
  courseId: number,
  studentAdmissionId: string,
): Promise<Submission[]> => {
  const res = await axios.get(
    `http://localhost:8080/staff/filter/submissions`,
    {
      params: { courseId, studentAdmissionId },
    },
  );

  return res.data;
};
