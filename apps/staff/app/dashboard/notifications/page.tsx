"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { Button } from "@repo/ui/button";
import { toast } from "react-toastify";
import { createNotificationApi } from "@/Services/NotificationService";
import { CreateNotificationRequest } from "@/Models/Notification";

export default function CreateNotificationPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateNotificationRequest>({
    defaultValues: {
      courseName: "",
      className: "",
      message: "",
    },
  });

  const onSubmit = async (data: CreateNotificationRequest) => {
    const res = await createNotificationApi(data);

    if (res) {
      toast.success("Notification created successfully");
      router.push("/dashboard");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Create Notification
        </h1>
        <p className="text-muted-foreground">
          Send a notification to a class for a specific course
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-6 p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Course Name
              </label>
              <Input
                {...register("courseName", { required: true })}
                placeholder="e.g. Software Engineering"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Class Name
              </label>
              <Input
                {...register("className", { required: true })}
                placeholder="e.g. CS202"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">
                Message
              </label>
              <Textarea
                {...register("message", { required: true })}
                placeholder="e.g. CAT 2 created"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Notification"}
          </Button>
        </div>
      </form>
    </div>
  );
}
