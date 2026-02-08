import { CourseCertificate } from "@/Models/Certificate";
import axios from "axios";

export const fetchCertificatesByAdmissionIdAPI = async (
  admissionId: string,
): Promise<CourseCertificate[]> => {
  const { data } = await axios.get(
    "http://localhost:8080/grade/get/certificate/admissionId",
    {
      params: { admissionId },
    },
  );
  
  // Fix the certificate file URLs to use the correct path
  return data.map((cert: CourseCertificate) => ({
    ...cert,
    certificateFileName: cert.certificateFileName.includes('/certificates/')
      ? cert.certificateFileName
      : `http://localhost:8080/certificates/${cert.certificateFileName.split('/').pop()}`
  }));
};
