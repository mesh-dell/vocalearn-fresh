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
