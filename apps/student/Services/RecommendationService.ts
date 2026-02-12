import {
  RecommendationRequest,
  RecommendationResponse,
} from "@/Models/Recommendation";
import axios from "axios";


export const generateRecommendationAPI = async (
  payload: RecommendationRequest,
): Promise<RecommendationResponse> => {
  const { courseId, moduleId, studentAdmissionId } = payload;

  const { data } = await axios.post(
    "http://localhost:8080/staff/get/reccomendation",
    null,
    {
      params: {
        courseId,
        moduleId,
        studentAdmissionId,
      },
    },
  );

  return data;
};
