export interface RecommendationRequest {
  courseId: number;
  moduleId: number;
  studentAdmissionId: string;
}

export interface RecommendationResponse {
  criticalGaps: string;
  recommendations: string;
}
