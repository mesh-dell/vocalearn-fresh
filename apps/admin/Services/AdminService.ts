import axios from "axios";
import { StaffPost, StaffList } from "@/Models/Staff";

const api = "http://localhost:8080/admin/add/staff";
const apiGetStaff = "http://localhost:8080/staff/all";

export const fetchStaffAPI = async (): Promise<StaffList> => {
  const res = await axios.get(apiGetStaff);
  return res.data;
};

export const addStaffAPI = async (data: StaffPost) => {
  const res = await axios.post(api, data);
  return res.data;
};

export const addInstitutionApi = async (data: FormData) => {
  const res = await axios.post(
    "http://localhost:8080/admin/add/institution",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const addSignatureApi = async (data: FormData) => {
  const res = await axios.post(
    "http://localhost:8080/admin/add/signature",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
}