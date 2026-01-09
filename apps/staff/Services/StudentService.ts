import { handleError } from "@/Helpers/ErrorHandle";
import { Student } from "@/Models/Student";
import axios from "axios";
const api = "http://localhost:8080/student/all";

export const StudentGetAPI = async () => {
  try {
    const data = await axios.get<Student[]>(api);
    return data;
  } catch (error) {
    handleError(error);
  }
};
