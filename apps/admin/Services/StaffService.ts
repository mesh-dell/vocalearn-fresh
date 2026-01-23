import { handleError } from "@/Helpers/ErrorHandle";
import { Staff } from "@/Models/Staff";
import axios from "axios";
const api = "http://localhost:8080/staff/all";


export const StaffGetAPI = async () => {
  try {
    const data = await axios.get<Staff[]>(api);
    return data;
  } catch (error) {
    handleError(error);
  }
};
