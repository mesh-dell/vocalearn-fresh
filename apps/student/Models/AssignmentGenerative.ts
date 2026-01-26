// for course detail list cards
export type AssignmentSummary = {
  assignmentId: number;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  allowDocuments: boolean;
  allowImages: boolean;
  allowVideos: boolean;
  maxFileSizeMb: number;
};

// for single assignment GET
export type AssignmentGet = {
  assignmentId: number;
  assignmentName: string;
  assignmentDescription: string;
  dueDate: string;
  totalMarks: number;
};
