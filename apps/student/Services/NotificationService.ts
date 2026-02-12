// src/Services/NotificationService.ts
import axios from "axios";
import { handleError } from "@/Helpers/ErrorHandle";
import { Notification } from "@/Models/Notification";

const BASE_URL = "http://localhost:8080/student/get/notifications";

export const getNotificationsAPI = async (token: string) => {
  try {
    const res = await axios.get<Notification[]>(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const markNotificationAsReadAPI = async (
  notificationId: number,
): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/notification/mark/notification/read`,
      null, // no body
      {
        params: {
          notificationId,
        },
      },
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};
