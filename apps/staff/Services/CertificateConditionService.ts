import axios from "axios";

export const addCertificateCondition = async (
  courseId: number,
  averagePassMark: number,
) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/staff/create/certificate/conditions",
      {
        courseId,
        averagePassMark,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error adding certificate condition:", error);
    throw error;
  }
};
