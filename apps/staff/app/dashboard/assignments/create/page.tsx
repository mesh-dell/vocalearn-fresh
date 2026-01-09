"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { assignmentsPostApi } from "@/Services/AssignmentService";
import { toast } from "react-toastify";
import { useAuth } from "@/Context/useAuth";
import { useRouter } from "next/navigation";

type QuestionType = "OPEN_ENDED" | "CLOSE_ENDED";

type Question = {
  questionText: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  marks: number;
};

type AssignmentForm = {
  title: string;
  description: string;
  dueDate: string;
  classes: string[];
  questions: Question[];
};

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { register, handleSubmit, control, watch } = useForm<AssignmentForm>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      classes: [],
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const { token } = useAuth();

  if (!token) {
    return <div className="text-center text-muted-foreground mt-10">Please log in to create assignments.</div>;
  }

  const onSubmit = async (data: AssignmentForm) => {
    const res = await assignmentsPostApi(data, token);
    if (res) {
      toast.success("Assignment created successfully!");
      router.push("/dashboard/assignments");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
        Create Assignment
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Assignment Info */}
        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Assignment Title
                </label>
                <Input {...register("title")} placeholder="Enter assignment title" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <Textarea {...register("description")} placeholder="Enter assignment description" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Due Date
                </label>
                <Input type="datetime-local" {...register("dueDate")} />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Class
                </label>
                <Input {...register("classes.0")} placeholder="e.g., CS2022" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">Questions</h2>

          {fields.map((field, index) => {
            const questionType = watch(`questions.${index}.type`);

            return (
              <Card key={field.id}>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Question Text
                      </label>
                      <Textarea
                        {...register(`questions.${index}.questionText` as const)}
                        placeholder="Enter question text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Question Type
                      </label>
                      <Controller
                        control={control}
                        name={`questions.${index}.type` as const}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Question Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN_ENDED">Open Ended</SelectItem>
                              <SelectItem value="CLOSE_ENDED">Close Ended</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    {questionType === "CLOSE_ENDED" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Options
                        </label>
                        {[0, 1, 2, 3].map((optIdx) => (
                          <Input
                            key={optIdx}
                            {...register(`questions.${index}.options.${optIdx}` as const)}
                            placeholder={`Option ${optIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Correct Answer
                      </label>
                      <Input
                        {...register(`questions.${index}.correctAnswer` as const)}
                        placeholder="Correct answer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Marks
                      </label>
                      <Input
                        type="number"
                        {...register(`questions.${index}.marks` as const, { valueAsNumber: true })}
                        placeholder="Marks"
                      />
                    </div>

                    <Button type="button" variant="destructive" className="mt-2" onClick={() => remove(index)}>
                      Remove Question
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() =>
              append({
                questionText: "",
                type: "OPEN_ENDED",
                options: [],
                correctAnswer: "",
                marks: 0,
              })
            }
          >
            + Add Question
          </Button>
        </section>

        <Button type="submit" className="bg-accent text-foreground hover:bg-accent-hover w-full sm:w-auto">
          Save Assignment
        </Button>
      </form>
    </div>
  );
}
