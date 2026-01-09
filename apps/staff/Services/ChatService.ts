import { handleError } from "@/Helpers/ErrorHandle";
import axios from "axios";
import { ChatMessage } from "@/Models/ChatMessage";

const api = "http://localhost:8080/chat/messages/conversation";

export const ChatGetConversationAPI = async (
  sender: string,
  receiver: string,
) => {
  try {
    const res = await axios.get<ChatMessage[]>(api, {
      params: { sender, receiver },
    });
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const ChatMarkAsReadAPI = async (id: number) => {
  try {
    const res = await axios.post(
      `http://localhost:8080/chat/messages/read/${id}`,
    );
    return res;
  } catch (error) {
    handleError(error);
  }
};