// Models/GradedQuestion.ts
export interface GradedQuestion {
  questionId: number;
  questionText: string;
  options: string[];
  studentAnswer: string;
  correctAnswer: string;
  awardedMarks: number;
  maxMarks: number;
  feedback: string;
}

export interface GradedSubmission {
  submissionId: number;
  studentAdmissionId: string;
  targetId: number;
  quizTitle: string;
  totalAwardedPoints: number;
  totalMaxPoints: number;
  questions: GradedQuestion[];
}


export interface GradedSubmissionFile {
  fileId: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
}

export interface GradedAssignmentSubmission {
  submissionId: number;
  studentAdmissionId: string;
  assignmentName: string;
  assignmentDescription: string;
  files: GradedSubmissionFile[];
  awardedMarks: number;
  maxMarks: number;
  percentage: number;
  feedback: string | null;
  gradedAt: string;
}
