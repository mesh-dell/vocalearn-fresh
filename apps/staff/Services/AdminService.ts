import { handleError } from "@/Helpers/ErrorHandle";
import axios from "axios";

const apiGetAdmin = "http://localhost:8080/admin/get";

export const adminGetAPI = async () => {
  try {
    // resolve to promise with admin data
    const data = await axios.get(apiGetAdmin);
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
