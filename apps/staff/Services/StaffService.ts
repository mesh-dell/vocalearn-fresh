import axios from "axios";
import { Submission } from "@/Models/Submission";

const BASE_URL = "http://localhost:8080";

export interface Student {
  email: string;
  admissionId: string;
  admissionYear: number;
  gender: string;
  className: string;
  firstName: string;
  lastName: string;
}

export interface GradeAssignmentPayload {
  submissionId: number;
  awardedMarks: number;
  feedback: string;
}

/**
 * Fetch all students
 */
export const fetchAllStudentsAPI = async (): Promise<Student[]> => {
  const res = await axios.get(`${BASE_URL}/student/all`);
  return res.data;
};

/**
 * Fetch submissions for a specific course and student
 */
export const fetchCourseSubmissionsAPI = async (
  courseId: number,
  studentAdmissionId: string,
): Promise<Submission[]> => {
  const res = await axios.get(`${BASE_URL}/staff/filter/submissions`, {
    params: { courseId, studentAdmissionId },
  });
  return res.data;
};

/**
 * Grade an assignment submission
 */
export const gradeAssignmentSubmissionAPI = async (
  payload: GradeAssignmentPayload,
): Promise<void> => {
  await axios.post(`${BASE_URL}/staff/submission/grade/assignments`, payload);
};
