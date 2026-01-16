export interface AssessmentPost {
  courseId: number;
  title: string;
  description: string;
  dueDate: string; // ISO string
  totalMarks: number;
  allowDocuments: boolean;
  allowImages: boolean;
  allowVideos: boolean;
  maxFileSizeMb: number;
}
