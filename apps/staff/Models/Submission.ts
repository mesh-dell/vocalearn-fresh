export type SubmissionStatus = "GRADED" | "UNGRADED";
export type SubmissionType = "CAT" | "QUIZ" | "ASSIGNMENT";

export interface Submission {
  submissionId: string;
  submissionName: string;
  submissionCourseName: string;
  submissionDate: string; // ISO string
  submissionStatus: SubmissionStatus;
  submissionType: SubmissionType;
  targetId: string; // CAT / QUIZ / ASSIGNMENT ID
}

export interface AssignmentSubmissionFile {
  fileId: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
}

export interface UngradedAssignmentSubmission {
  submissionId: number;
  studentAdmissionId: string;
  className: string;
  courseId: number;
  moduleId: number;
  targetId: number;
  submissionStatus: "UNGRADED" | "GRADED";
  submissionDate: string;
  files: AssignmentSubmissionFile[];
}

export interface GradeAssignmentPayload {
  submissionId: number;
  awardedMarks: number;
  feedback: string;
}