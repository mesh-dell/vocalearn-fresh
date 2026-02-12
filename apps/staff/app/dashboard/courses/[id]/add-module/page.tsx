"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";

import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { createCourseModuleAPI } from "@/Services/CourseService";

export default function AddModulePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number(params.id);

  const [week, setWeek] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!week || !moduleName || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = {
      week,
      courseId,
      moduleName,
      content,
    };

    try {
      setIsSubmitting(true);
      await createCourseModuleAPI(payload);
      toast.success("Module created successfully");
      router.push(`/dashboard/courses/${courseId}`);
    } catch {
      toast.error("Failed to create module");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-6 py-10 space-y-8">
      <div>
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.push(`/dashboard/courses/${courseId}`)}
        >
          ← Back to Course
        </Button>
      </div>

      <h1 className="text-3xl font-bold">Add New Module</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <label className="block text-sm font-medium mb-2">Week</label>
              <Input
                placeholder="e.g., Week 1, Week 2"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Module Name
              </label>
              <Input
                placeholder="Enter module name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Module Content
              </label>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_API_KEY}
                value={content}
                onEditorChange={(content) => setContent(content)}
                init={{
                  height: 400,
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
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/courses/${courseId}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Module"}
          </Button>
        </div>
      </form>
    </div>
  );
}
