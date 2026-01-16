import { handleError } from "@/Helpers/ErrorHandle";
import { CourseGet, CoursePost } from "@/Models/Course";
import axios from "axios";
import { QuizPost } from "@/Models/Quiz";
import { CatPost } from "@/Models/Cat";
import { AssessmentPost } from "@/Models/Assessment";

const api = "http://localhost:8080/course/get/all";
const apiPost = "http://localhost:8080/course/add";

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
      cat
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
