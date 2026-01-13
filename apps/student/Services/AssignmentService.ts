import { handleError } from "@/Helpers/ErrorHandle";
import { Assignment } from "@/Models/Assignment";
import axios from "axios";

const api = "http://localhost:8080/staff/view/assignments";
const apiSubmit = "http://localhost:8080/student/add/submission";

export type AssignmentSubmission = {
  admissionId: string;
  className: string;
  assignmentId: number;
  answerText: {
    questionId: number;
    answerText: string;
  }[];
};

export const assignmentsGetAPI = async (className: string) => {
  try {
    const res = await axios.get<Assignment[]>(api, {
      params: { className },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const assignmentsSubmitAPI = async (submission: AssignmentSubmission) => {
  try {
    const res = await axios.post(apiSubmit, submission);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
