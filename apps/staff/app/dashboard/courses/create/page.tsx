"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { coursesPostAPI } from "@/Services/CourseService";

type ModuleForm = {
  week: string;
  moduleName: string;
  content: string;
};

export default function CreateCoursePage() {
  const router = useRouter();

  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [modules, setModules] = useState<ModuleForm[]>([
    { week: "", moduleName: "", content: "" },
  ]);

  const updateModule = (
    index: number,
    field: keyof ModuleForm,
    value: string
  ) => {
    setModules((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const addModule = () =>
    setModules((prev) => [...prev, { week: "", moduleName: "", content: "" }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      courseName,
      description,
      courseOverview: { skillLevel, duration },
      moduleDto: modules,
    };

    try {
      await coursesPostAPI(payload);
      toast.success("Course created successfully");
      router.push("/dashboard/courses");
    } catch {
      toast.error("Failed to create course");
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Create New Course</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Info */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <Input
              placeholder="Course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />

            <textarea
              className="min-h-25 w-full rounded-md border p-2"
              placeholder="Course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Skill level (Beginner, Intermediate...)"
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              />
              <Input
                placeholder="Duration (e.g. 6 weeks)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modules */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Modules</h2>

          {modules.map((module, index) => (
            <Card key={index}>
              <CardContent className="space-y-4 p-6">
                <Input
                  placeholder="Week"
                  value={module.week}
                  onChange={(e) => updateModule(index, "week", e.target.value)}
                />

                <Input
                  placeholder="Module name"
                  value={module.moduleName}
                  onChange={(e) =>
                    updateModule(index, "moduleName", e.target.value)
                  }
                />

                <Editor
                  apiKey={process.env.NEXT_PUBLIC_API_KEY}
                  value={module.content}
                  onEditorChange={(content) =>
                    updateModule(index, "content", content)
                  }
                  init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                      "anchor",
                      "autolink",
                      "charmap",
                      "code",
                      "codesample",
                      "emoticons",
                      "link",
                      "lists",
                      "media",
                      "searchreplace",
                      "table",
                      "visualblocks",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | bold italic underline | align | bullist numlist | link media | removeformat",
                  }}
                />
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addModule}>
            + Add Module
          </Button>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Save Course
        </Button>
      </form>
    </div>
  );
}
