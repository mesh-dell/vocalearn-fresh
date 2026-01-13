export type ModuleDto = {
  week: string;
  moduleName: string;
  content: string; // HTML content
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
