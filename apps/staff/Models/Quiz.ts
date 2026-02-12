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

export interface QuizQuestion {
  questionId: number;
  text: string;
  marks: number;
  options: string[];
  correctAnswer: string;
}

export interface QuizAssessmentGet {
  title: string;
  quizId: number;
  questions: QuizQuestion[];
}