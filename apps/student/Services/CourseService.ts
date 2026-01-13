import { handleError } from "@/Helpers/ErrorHandle";
import { CourseGet, CourseEnroll } from "@/Models/Course";
import axios from "axios";
const api = "http://localhost:8080/course/get/all";
const apiEnrolled = "http://localhost:8080/student/get/enrolled/courses";
const baseUrl = "http://localhost:8080/student";

export const coursesGetAPI = async () => {
  try {
    const data = await axios.get<CourseGet[]>(api);
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const coursesEnrollAPI = async (courseEnroll: CourseEnroll) => {
  try {
    const data = await axios.post(
      "http://localhost:8080/student/enroll/course",
      courseEnroll,
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const coursesModuleCompleteAPI = async (
  payload: { moduleId: number; courseId: number },
  token: string,
) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/student/set/module/complete",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchEnrolledCoursesAPI = async (token: string) => {
  try {
    const res = await axios.get(apiEnrolled, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchCourseModulesAPI = async (courseId: number) => {
  try {
    const res = await axios.get(`${baseUrl}/courses/${courseId}/modules`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
