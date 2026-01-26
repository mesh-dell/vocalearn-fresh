export type CatAssessmentDto = {
  catId: number;
  title: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  questions: any[];
};

interface CatAnswer {
  questionId: number;
  answerText: string;
}

export interface CatSubmission {
  courseId: number;
  catId: number;
  answers: CatAnswer[];
}

// Models/Cat.ts

export interface CatQuestion {
  questionId: number;
  text: string;
  marks: number;
  options: string[];
  correctAnswer: string;
}

export interface CatAssessmentGet {
  title: string;
  catId: number;
  questions: CatQuestion[];
}
