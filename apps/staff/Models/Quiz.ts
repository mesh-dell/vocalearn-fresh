export interface QuizPost {
  quizTitle: string;
  quizDescription: string;
  dueDate: string; // ISO string
  courseId: number;
  moduleId: number;
}

export type QuizAssessmentDto = {
  quizId: number;
  title: string;
  questions: any[];
};
