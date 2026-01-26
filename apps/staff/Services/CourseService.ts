import { handleError } from "@/Helpers/ErrorHandle";
import { CourseGet, CoursePost } from "@/Models/Course";
import axios from "axios";
import { QuizPost } from "@/Models/Quiz";
import { CatPost } from "@/Models/Cat";
import { AssessmentPost } from "@/Models/Assessment";

const api = "http://localhost:8080/course/get/all";
const apiPost = "http://localhost:8080/course/add";
const apiGenerateQuiz = "http://localhost:8080/course/add/quiz/assessment";
const apiGenerateCat = "http://localhost:8080/course/add/cat/assessment";

type CatAssessmentGenerationPost = {
  moduleId: number;
  courseId: number;
  catId: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  noOfCloseEndedQuestions: number;
  noOfTrueFalseQuestions: number;
  noOfOpenEndedQuestions: number;
  noOfOptions: number;
};

type QuizAssessmentGenerationPost = {
  moduleId: number;
  courseId: number;
  quizId: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  noOfCloseEndedQuestions: number;
  noOfTrueFalseQuestions: number;
  noOfOpenEndedQuestions: number;
  noOfOptions: number;
};

export const coursesGetAPI = async () => {
  try {
    const data = await axios.get<CourseGet[]>(api);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const coursesPostAPI = async (course: CoursePost) => {
  try {
    const data = await axios.post(apiPost, course);
    return data;
  } catch (error) {
    handleError(error);
  }
};

const apiCreateQuiz = "http://localhost:8080/course/create/quiz";
export const quizCreateAPI = async (quiz: QuizPost) => {
  try {
    const response = await axios.post(apiCreateQuiz, quiz);
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const catCreateAPI = async (cat: CatPost) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/course/create/cat",
      cat,
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const assessmentCreateAPI = async (assignment: AssessmentPost) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/course/create/assignment",
      assignment
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};

export const quizGenerateAssessmentAPI = async (
  payload: QuizAssessmentGenerationPost,
) => {
  try {
    const response = await axios.post(apiGenerateQuiz, payload);
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const catGenerateAssessmentAPI = async (
  payload: CatAssessmentGenerationPost,
) => {
  try {
    const response = await axios.post(apiGenerateCat, payload);
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const courseActivateModuleAPI = async (payload: {
  courseId: number;
  moduleId: number;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/course/mark/module/active",
      payload,
    );
    return response;
  } catch (error) {
    handleError(error);
  }
};
