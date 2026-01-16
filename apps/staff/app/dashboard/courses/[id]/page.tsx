"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseGet } from "@/Models/Course";
import { coursesGetAPI } from "@/Services/CourseService";
import { Button } from "@repo/ui/button";
import { quizCreateAPI } from "@/Services/CourseService";
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
    } catch (err) {
      console.error("Failed to create quiz", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await coursesGetAPI();
        if (response?.data) {
          const found = response.data.find(
            (c: CourseGet) => c.courseOverview.id === courseId
          );
          setCourse(found || null);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return (
      <p className="text-center text-muted-foreground sm:text-lg mt-10">
        Loading course...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Course Header */}
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
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">
                  {module.week}: {module.moduleName}
                </h3>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openQuizModal(module.moduleId)}
                >
                  + Add Quiz
                </Button>
              </div>

              {/* Module Content */}
              <div
                className="prose text-foreground dark:prose-invert mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: module.content }}
              />
            </div>
          ))}
        </div>
      </div>
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
              <Checkbox
                checked={assignmentForm.allowDocuments}
                onCheckedChange={(v: boolean) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    allowDocuments: Boolean(v),
                  })
                }
              />
              Allow documents
              <Checkbox
                checked={assignmentForm.allowImages}
                onCheckedChange={(v: boolean) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    allowImages: Boolean(v),
                  })
                }
              />
              Allow images
              <Checkbox
                checked={assignmentForm.allowVideos}
                onCheckedChange={(v: boolean) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    allowVideos: Boolean(v),
                  })
                }
              />
              Allow videos
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
