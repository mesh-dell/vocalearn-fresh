import { CatAssessmentDto } from "./Cat";
import { QuizAssessmentDto } from "./Quiz";

type AssignmentType = {
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
export type ModuleDto = {
  week: string;
  moduleName: string;
  content: string; // HTML content
  quizAssessmentDto: QuizAssessmentDto[];
  status: "ACTIVE" | "INACTIVE";
};

export type CourseOverview = {
  id: number;
  skillLevel: string;
  duration: string;
};

export type CourseEnroll = {
  courseId: string;
  progression: string;
  courseName: string;
  admissionId: string;
};

export type CourseGet = {
  courseName: string;
  description: string;
  courseOverview: CourseOverview;
  moduleDto: ModuleDto[];
  catAssessmentDto: CatAssessmentDto[];
  assignments: AssignmentType[];
};

export type EnrolledCourse = {
  courseNames: string;
  progression: string;
  isCompleted: string;
  courseId: number;
  enrollModuleDto: {
    id: number;
    moduleName: string;
    duration: string;
    moduleId: number;
    completed: boolean;
  }[];
};
