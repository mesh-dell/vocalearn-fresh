export interface CreateCourseModuleRequest {
  week: string;
  courseId: number;
  moduleName: string;
  content: string; // HTML string
}