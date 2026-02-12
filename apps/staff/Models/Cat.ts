export interface CatPost {
  catTitle: string;
  catDescription: string;
  durationMinutes: number;
  courseId: number;
  startTime: string; // ISO string
}

export type CatAssessmentDto = {
  catId: number;
  title: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  questions: any[];
};

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
