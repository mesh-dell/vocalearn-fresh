import { CatAssessmentGet } from "@/Models/Cat";
import { QuizAssessmentGet } from "@/Models/Quiz";
import axios from "axios";

const baseUrl = "http://localhost:8080";

export const fetchCatAssessmentAPI = async (
  courseId: number,
  catId: number,
) => {
  const res = await axios.get<CatAssessmentGet>(
    `${baseUrl}/course/get/catAssessment`,
    {
      params: {
        courseId,
        catId,
      },
    },
  );
  return res.data;
};

export const fetchQuizAssessmentAPI = async (
  courseId: number,
  moduleId: number,
  quizId: number,
) => {
  const res = await axios.get<QuizAssessmentGet>(
    `${baseUrl}/course/get/quizAssessment`,
    {
      params: {
        courseId,
        moduleId,
        quizId,
      },
    },
  );
  return res.data;
};
