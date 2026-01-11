import { handleError } from "@/Helpers/ErrorHandle";
import { CreateNotificationRequest } from "@/Models/Notification";
import axios from "axios";

const api = "http://localhost:8080/staff/create/notifications";

export const createNotificationApi = async (
  notification: CreateNotificationRequest
) => {
  try {
    const res = await axios.post(api, notification);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
