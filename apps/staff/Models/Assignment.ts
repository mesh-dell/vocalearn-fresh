export type Question = {
  questionId: number;
  text: string;
  type: "OPEN_ENDED" | "CLOSE_ENDED";
  options: string[];
};

export type Assignment = {
  assignmentId: number;
  title: string;
  creationDate: string; // ISO date string
  description: string;
  dueDate: string; // ISO date string
  classNames: string[];
  questions: Question[];
};


export type QuestionType = "OPEN_ENDED" | "CLOSE_ENDED";

export interface QuestionPost {
  questionText: string;
  type: QuestionType;
  options: string[];       // Empty for OPEN_ENDED
  correctAnswer: string;
  marks: number;
}

export interface AssignmentPost{
  title: string;
  description: string;
  dueDate: string;         // ISO date string
  classes: string[];       // List of class IDs or names
  questions: QuestionPost[];
}

type Answer = {
  questionId: number;
  answerText: string;
};

export type Submission = {
  submissionId: number;
  studentAdmissionId: string;
  assignmentId: number;
  className: string;
  submissionDate: string;
  submissionStatus: "GRADED" | "UNGRADED";
  submitted: boolean;
  answers: Answer[];
};