import { CatAssessmentDto } from "./Cat";
import { QuizAssessmentDto } from "./Quiz";

export type ModuleDto = {
  week: string;
  moduleName: string;
  content: string; // HTML content
  moduleId: number;
  quizAssessmentDto: QuizAssessmentDto[];
  status: "ACTIVE" | "INACTIVE";
};

export type CourseOverview = {
  id: number;
  skillLevel: string;
  duration: string;
};

export type CourseGet = {
  courseName: string;
  description: string;
  courseOverview: CourseOverview;
  moduleDto: ModuleDto[];
  catAssessmentDto: CatAssessmentDto[];
};


export interface CoursePost {
  courseName: string;
  description: string;
  courseOverview: {
    skillLevel: string;
    duration: string;
  };
  moduleDto: Module[];
}

export interface Module {
  week: string;
  moduleName: string;
  content: string; // HTML content
}
