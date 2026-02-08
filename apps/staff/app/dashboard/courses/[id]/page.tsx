"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseGet } from "@/Models/Course";
import { coursesGetAPI } from "@/Services/CourseService";
import { Button } from "@repo/ui/button";
import {
  quizCreateAPI,
  catGenerateAssessmentAPI,
  courseActivateModuleAPI,
} from "@/Services/CourseService";
import { QuizPost } from "@/Models/Quiz";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/ui/dialog";
import { toast } from "react-toastify";
import { CatPost } from "@/Models/Cat";
import { catCreateAPI } from "@/Services/CourseService";
import { AssessmentPost } from "@/Models/Assessment";
import { assessmentCreateAPI } from "@/Services/CourseService";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Label } from "@repo/ui/label";
import { quizGenerateAssessmentAPI } from "@/Services/CourseService";
import Link from "next/link";

type CatAssessmentGenerationPost = {
  moduleId: number;
  courseId: number;
  catId: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  noOfCloseEndedQuestions: number;
  noOfTrueFalseQuestions: number;
  noOfOpenEndedQuestions: number;
  noOfOptions: number;
};

type QuizAssessmentGenerationPost = {
  moduleId: number;
  courseId: number;
  quizId: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  noOfCloseEndedQuestions: number;
  noOfTrueFalseQuestions: number;
  noOfOpenEndedQuestions: number;
  noOfOptions: number;
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const [course, setCourse] = useState<CourseGet | null>(null);
  const [quizForm, setQuizForm] = useState({
    quizTitle: "",
    quizDescription: "",
    dueDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const [catForm, setCatForm] = useState({
    catTitle: "",
    catDescription: "",
    durationMinutes: "",
    startTime: "",
  });
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalMarks: "",
    allowDocuments: true,
    allowImages: true,
    allowVideos: true,
    maxFileSizeMb: "250",
  });

  // AI Generation states
  const [quizGenModalOpen, setQuizGenModalOpen] = useState(false);
  const [catGenModalOpen, setCatGenModalOpen] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [activeCatId, setActiveCatId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [genForm, setGenForm] = useState({
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced",
    noOfCloseEndedQuestions: "5",
    noOfTrueFalseQuestions: "3",
    noOfOpenEndedQuestions: "2",
    noOfOptions: "4",
  });

  const handleCreateAssignment = async () => {
    if (!course) return;

    const payload: AssessmentPost = {
      courseId: course.courseOverview.id,
      title: assignmentForm.title,
      description: assignmentForm.description,
      dueDate: assignmentForm.dueDate,
      totalMarks: Number(assignmentForm.totalMarks),
      allowDocuments: assignmentForm.allowDocuments,
      allowImages: assignmentForm.allowImages,
      allowVideos: assignmentForm.allowVideos,
      maxFileSizeMb: Number(assignmentForm.maxFileSizeMb),
    };

    try {
      setIsCreatingAssignment(true);
      await assessmentCreateAPI(payload);

      setAssignmentForm({
        title: "",
        description: "",
        dueDate: "",
        totalMarks: "",
        allowDocuments: true,
        allowImages: true,
        allowVideos: true,
        maxFileSizeMb: "250",
      });

      setAssignmentModalOpen(false);
      toast.success("Assignment created successfully!");
      await refetchCourse();
    } catch (err) {
      console.error("Failed to create assignment", err);
      toast.error("Failed to create assignment");
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  const handleCreateCat = async () => {
    if (!course) return;

    const payload: CatPost = {
      catTitle: catForm.catTitle,
      catDescription: catForm.catDescription,
      durationMinutes: Number(catForm.durationMinutes),
      courseId: course.courseOverview.id,
      startTime: catForm.startTime,
    };

    try {
      setIsCreatingCat(true);
      await catCreateAPI(payload);

      setCatForm({
        catTitle: "",
        catDescription: "",
        durationMinutes: "",
        startTime: "",
      });

      setCatModalOpen(false);
      toast.success("CAT created successfully!");
      await refetchCourse();
    } catch (err) {
      console.error("Failed to create CAT", err);
      toast.error("Failed to create CAT");
    } finally {
      setIsCreatingCat(false);
    }
  };

  const openQuizModal = (moduleId: number) => {
    setActiveModuleId(moduleId);
    setQuizModalOpen(true);
  };

  const handleCreateQuiz = async (moduleId: number) => {
    if (!course) return;
    const payload: QuizPost = {
      quizTitle: quizForm.quizTitle,
      quizDescription: quizForm.quizDescription,
      dueDate: quizForm.dueDate,
      courseId: course.courseOverview.id,
      moduleId,
    };
    try {
      setIsSubmitting(true);
      await quizCreateAPI(payload);
      setQuizForm({
        quizTitle: "",
        quizDescription: "",
        dueDate: "",
      });
      setQuizModalOpen(false);
      setActiveModuleId(null);

      toast.success("Quiz created successfully!");
      await refetchCourse();
    } catch (err) {
      console.error("Failed to create quiz", err);
      toast.error("Failed to create quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openQuizGenModal = (quizId: number, moduleId: number) => {
    setActiveQuizId(quizId);
    setActiveModuleId(moduleId);
    setQuizGenModalOpen(true);
  };

  const openCatGenModal = (catId: number) => {
    // Check if all modules are active
    const allModulesActive = course?.moduleDto.every(
      (m) => m.status === "ACTIVE",
    );
    if (!allModulesActive) {
      toast.error("All modules must be active before generating CAT questions");
      return;
    }
    setActiveCatId(catId);
    setCatGenModalOpen(true);
  };

  const handleGenerateQuiz = async () => {
    if (!course || !activeQuizId || !activeModuleId) return;

    const payload: QuizAssessmentGenerationPost = {
      moduleId: activeModuleId,
      courseId: course.courseOverview.id,
      quizId: activeQuizId,
      difficulty: genForm.difficulty,
      noOfCloseEndedQuestions: Number(genForm.noOfCloseEndedQuestions),
      noOfTrueFalseQuestions: Number(genForm.noOfTrueFalseQuestions),
      noOfOpenEndedQuestions: Number(genForm.noOfOpenEndedQuestions),
      noOfOptions: Number(genForm.noOfOptions),
    };

    try {
      setIsGenerating(true);
      await quizGenerateAssessmentAPI(payload);
      toast.success("Quiz questions generated successfully!");
      setQuizGenModalOpen(false);
      setActiveQuizId(null);
      setActiveModuleId(null);
      resetGenForm();
      await refetchCourse();
    } catch (err) {
      console.error("Failed to generate quiz", err);
      toast.error("Failed to generate quiz questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCat = async () => {
    if (!course || !activeCatId) return;

    // Use first module ID for CAT generation
    const firstModuleId = course.moduleDto[0]?.moduleId;
    if (!firstModuleId) {
      toast.error("No modules found");
      return;
    }

    const payload: CatAssessmentGenerationPost = {
      moduleId: firstModuleId,
      courseId: course.courseOverview.id,
      catId: activeCatId,
      difficulty: genForm.difficulty,
      noOfCloseEndedQuestions: Number(genForm.noOfCloseEndedQuestions),
      noOfTrueFalseQuestions: Number(genForm.noOfTrueFalseQuestions),
      noOfOpenEndedQuestions: Number(genForm.noOfOpenEndedQuestions),
      noOfOptions: Number(genForm.noOfOptions),
    };

    try {
      setIsGenerating(true);
      await catGenerateAssessmentAPI(payload);
      toast.success("CAT questions generated successfully!");
      setCatGenModalOpen(false);
      setActiveCatId(null);
      resetGenForm();
      await refetchCourse();
    } catch (err) {
      console.error("Failed to generate CAT", err);
      toast.error("Failed to generate CAT questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleActivateModule = async (moduleId: number) => {
    if (!course) return;

    try {
      await courseActivateModuleAPI({
        courseId: course.courseOverview.id,
        moduleId,
      });
      toast.success("Module activated successfully!");
      await refetchCourse();
    } catch (err) {
      console.error("Failed to activate module", err);
      toast.error("Failed to activate module");
    }
  };

  const resetGenForm = () => {
    setGenForm({
      difficulty: "intermediate",
      noOfCloseEndedQuestions: "5",
      noOfTrueFalseQuestions: "3",
      noOfOpenEndedQuestions: "2",
      noOfOptions: "4",
    });
  };

  const refetchCourse = async () => {
    try {
      const response = await coursesGetAPI();
      if (response?.data) {
        const found = response.data.find(
          (c: CourseGet) => c.courseOverview.id === courseId,
        );
        setCourse(found || null);
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };

  useEffect(() => {
    refetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <p className="text-center text-muted-foreground sm:text-lg mt-10">
        Loading course...
      </p>
    );
  }

  const allModulesActive = course.moduleDto.every((m) => m.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          ← Back to Dashboard
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              {course.courseName}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base lg:text-lg">
              {course.description}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`/dashboard/courses/${courseId}/submissions`}>
            <Button variant="outline">View Submissions</Button>
            </Link>
            <Button onClick={() => setCatModalOpen(true)}>+ Create CAT</Button>
            <Button
              variant="secondary"
              onClick={() => setAssignmentModalOpen(true)}
            >
              + Create Assignment
            </Button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2 md:flex md:flex-wrap md:gap-6">
          <span>
            <strong>Level:</strong> {course.courseOverview.skillLevel}
          </span>
          <span>
            <strong>Duration:</strong> {course.courseOverview.duration}
          </span>
        </div>
      </div>

      {/* CAT Assessments */}
      {course.catAssessmentDto.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            CAT Assessments
          </h2>
          <div className="space-y-3">
            {course.catAssessmentDto.map((cat) => (
              <div
                key={cat.catId}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Duration: {cat.durationMinutes} minutes | Questions:{" "}
                      {cat.questions.length}
                    </p>
                  </div>
                  {cat.questions.length === 0 && (
                    <Button
                      size="sm"
                      onClick={() => openCatGenModal(cat.catId)}
                      disabled={!allModulesActive}
                    >
                      ✨ Generate Questions
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          Modules
        </h2>

        <div className="space-y-6">
          {course.moduleDto.map((module, index) => (
            <div
              key={index}
              className="w-full rounded-lg border-l-4 border-accent bg-card p-4 shadow-sm sm:p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">
                    {module.week}: {module.moduleName}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${module.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {module.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {module.status === "INACTIVE" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActivateModule(module.moduleId)}
                    >
                      Activate Module
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openQuizModal(module.moduleId)}
                  >
                    + Add Quiz
                  </Button>
                </div>
              </div>

              <div
                className="prose text-foreground dark:prose-invert mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: module.content }}
              />

              {/* Quizzes for this module */}
              {module.quizAssessmentDto.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-sm">Quizzes:</h4>
                  {module.quizAssessmentDto.map((quiz) => (
                    <div
                      key={quiz.quizId}
                      className="flex items-center justify-between rounded border bg-background p-3"
                    >
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Questions: {quiz.questions.length}
                        </p>
                      </div>
                      {quiz.questions.length === 0 && (
                        <Button
                          size="sm"
                          onClick={() =>
                            openQuizGenModal(quiz.quizId, module.moduleId)
                          }
                        >
                          ✨ Generate Questions
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Creation Dialog */}
      <Dialog open={quizModalOpen} onOpenChange={setQuizModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Quiz</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Quiz title"
              value={quizForm.quizTitle}
              onChange={(e) =>
                setQuizForm({ ...quizForm, quizTitle: e.target.value })
              }
            />

            <Textarea
              placeholder="Quiz description"
              value={quizForm.quizDescription}
              onChange={(e) =>
                setQuizForm({
                  ...quizForm,
                  quizDescription: e.target.value,
                })
              }
            />

            <Input
              type="datetime-local"
              value={quizForm.dueDate}
              onChange={(e) =>
                setQuizForm({ ...quizForm, dueDate: e.target.value })
              }
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setQuizModalOpen(false)}>
              Cancel
            </Button>

            <Button
              disabled={isSubmitting || !activeModuleId}
              onClick={() => activeModuleId && handleCreateQuiz(activeModuleId)}
            >
              {isSubmitting ? "Creating..." : "Create Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Generation Dialog */}
      <Dialog open={quizGenModalOpen} onOpenChange={setQuizGenModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Quiz Questions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Difficulty Level</Label>
              <Select
                value={genForm.difficulty}
                onValueChange={(v: any) =>
                  setGenForm({ ...genForm, difficulty: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">beginner</SelectItem>
                  <SelectItem value="intermediate">intermediate</SelectItem>
                  <SelectItem value="advanced">advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Multiple Choice Questions</Label>
              <Input
                type="number"
                min="0"
                value={genForm.noOfCloseEndedQuestions}
                onChange={(e) =>
                  setGenForm({
                    ...genForm,
                    noOfCloseEndedQuestions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>True/False Questions</Label>
              <Input
                type="number"
                min="0"
                value={genForm.noOfTrueFalseQuestions}
                onChange={(e) =>
                  setGenForm({
                    ...genForm,
                    noOfTrueFalseQuestions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Open-Ended Questions</Label>
              <Input
                type="number"
                min="0"
                value={genForm.noOfOpenEndedQuestions}
                onChange={(e) =>
                  setGenForm({
                    ...genForm,
                    noOfOpenEndedQuestions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Number of Options (for MCQs)</Label>
              <Input
                type="number"
                min="2"
                max="6"
                value={genForm.noOfOptions}
                onChange={(e) =>
                  setGenForm({ ...genForm, noOfOptions: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setQuizGenModalOpen(false)}>
              Cancel
            </Button>

            <Button disabled={isGenerating} onClick={handleGenerateQuiz}>
              {isGenerating ? "Generating..." : "✨ Generate Questions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CAT Generation Dialog */}
      <Dialog open={catGenModalOpen} onOpenChange={setCatGenModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate CAT Questions</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Difficulty Level</Label>
              <Select
                value={genForm.difficulty}
                onValueChange={(v: any) =>
                  setGenForm({ ...genForm, difficulty: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">beginner</SelectItem>
                  <SelectItem value="intermediate">intermediate</SelectItem>
                  <SelectItem value="advanced">advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Multiple Choice Questions</Label>
              <Input
                type="number"
                min="0"
                value={genForm.noOfCloseEndedQuestions}
                onChange={(e) =>
                  setGenForm({
                    ...genForm,
                    noOfCloseEndedQuestions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>True/False Questions</Label>
              <Input
                type="number"
                min="0"
                value={genForm.noOfTrueFalseQuestions}
                onChange={(e) =>
                  setGenForm({
                    ...genForm,
                    noOfTrueFalseQuestions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Open-Ended Questions</Label>
              <Input
                type="number"
                min="0"
                value={genForm.noOfOpenEndedQuestions}
                onChange={(e) =>
                  setGenForm({
                    ...genForm,
                    noOfOpenEndedQuestions: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Number of Options (for MCQs)</Label>
              <Input
                type="number"
                min="2"
                max="6"
                value={genForm.noOfOptions}
                onChange={(e) =>
                  setGenForm({ ...genForm, noOfOptions: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setCatGenModalOpen(false)}>
              Cancel
            </Button>

            <Button disabled={isGenerating} onClick={handleGenerateCat}>
              {isGenerating ? "Generating..." : "✨ Generate Questions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CAT Creation Dialog */}
      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create CAT</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="CAT title"
              value={catForm.catTitle}
              onChange={(e) =>
                setCatForm({ ...catForm, catTitle: e.target.value })
              }
            />

            <Textarea
              placeholder="CAT description"
              value={catForm.catDescription}
              onChange={(e) =>
                setCatForm({ ...catForm, catDescription: e.target.value })
              }
            />

            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={catForm.durationMinutes}
              onChange={(e) =>
                setCatForm({ ...catForm, durationMinutes: e.target.value })
              }
            />

            <Input
              type="datetime-local"
              value={catForm.startTime}
              onChange={(e) =>
                setCatForm({ ...catForm, startTime: e.target.value })
              }
            />
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setCatModalOpen(false)}>
              Cancel
            </Button>

            <Button disabled={isCreatingCat} onClick={handleCreateCat}>
              {isCreatingCat ? "Creating..." : "Create CAT"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Creation Dialog */}
      <Dialog open={assignmentModalOpen} onOpenChange={setAssignmentModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Assignment title"
              value={assignmentForm.title}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  title: e.target.value,
                })
              }
            />

            <Textarea
              placeholder="Assignment description"
              value={assignmentForm.description}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  description: e.target.value,
                })
              }
            />

            <Input
              type="datetime-local"
              value={assignmentForm.dueDate}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  dueDate: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Total marks"
              value={assignmentForm.totalMarks}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  totalMarks: e.target.value,
                })
              }
            />

            <Input
              type="number"
              placeholder="Max file size (MB)"
              value={assignmentForm.maxFileSizeMb}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  maxFileSizeMb: e.target.value,
                })
              }
            />

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={assignmentForm.allowDocuments}
                  onCheckedChange={(v: boolean) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      allowDocuments: Boolean(v),
                    })
                  }
                />
                <label>Allow documents</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={assignmentForm.allowImages}
                  onCheckedChange={(v: boolean) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      allowImages: Boolean(v),
                    })
                  }
                />
                <label>Allow images</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={assignmentForm.allowVideos}
                  onCheckedChange={(v: boolean) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      allowVideos: Boolean(v),
                    })
                  }
                />
                <label>Allow videos</label>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setAssignmentModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              disabled={isCreatingAssignment}
              onClick={handleCreateAssignment}
            >
              {isCreatingAssignment ? "Creating..." : "Create Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
