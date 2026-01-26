export type QuizAssessmentDto = {
  quizId: number;
  title: string;
  questions: any[];
};

interface QuizAnswer {
  questionId: number;
  answerText: string;
}

export interface QuizSubmission {
  courseId: number;
  moduleId: number;
  quizId: number;
  answers: QuizAnswer[];
}

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
