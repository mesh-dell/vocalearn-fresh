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
