import { handleError } from "@/Helpers/ErrorHandle";
import { Assignment, Submission } from "@/Models/Assignment";
import { AssignmentPost } from "@/Models/Assignment";
import axios from "axios";

const api = "http://localhost:8080/staff/get/assignments/staffId";
const apiPost = "http://localhost:8080/staff/create/assignment";
const apiSubmissions =
  "http://localhost:8080/staff/get/submissions/assignmentId";

export const assignmentsGetAPI = async (staffId: number) => {
  try {
    const res = await axios.get<Assignment[]>(api, {
      params: { staffId },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const assignmentsPostApi = async (
  assignmentPost: AssignmentPost,
  token: string
) => {
  try {
    const res = await axios.post(apiPost, assignmentPost, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const assignmentsSubmissionsGetAPI = async (assignmentId: number) => {
  try {
    const res = await axios.get<Submission[]>(apiSubmissions, {
      params: { assignmentId },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
