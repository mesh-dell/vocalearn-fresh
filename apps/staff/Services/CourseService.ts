import { handleError } from "@/Helpers/ErrorHandle";
import { CourseGet, CoursePost } from "@/Models/Course";
import axios from "axios";

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
