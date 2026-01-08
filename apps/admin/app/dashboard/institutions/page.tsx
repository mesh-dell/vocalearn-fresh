"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import { addInstitutionApi } from "@/Services/AdminService"; // your API service

const institutionSchema = z.object({
  name: z.string().min(2, "Institution name is required"),
  county: z.string().min(2, "County is required"),
  signatureFile: z
    .any()
    .refine((file) => file?.[0]?.size > 0, "Signature file is required"),
});

type InstitutionForm = z.infer<typeof institutionSchema>;

export default function CreateInstitutionPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InstitutionForm>({
    resolver: zodResolver(institutionSchema),
  });

  const handleAddInstitution = async (data: InstitutionForm) => {
    try {
      setCreating(true);
      const formData = new FormData();
      formData.append("institutionName", data.name);
      formData.append("county", data.county);
      if (data.signatureFile?.[0]) {
        formData.append("signatureFile", data.signatureFile[0]);
      }

      await addInstitutionApi(formData); // your API should handle multipart
      toast.success("Institution added successfully!");
      reset();
      router.push("/dashboard");
    } catch (err) {
      console.error("Error adding institution", err);
      toast.error("Failed to add institution");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-lg bg-background text-foreground">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Institution</h1>
      </header>

      <form
        onSubmit={handleSubmit(handleAddInstitution)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Institution Name */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Institution Name
          </label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* County */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            County
          </label>
          <Input {...register("county")} />
          {errors.county && (
            <p className="text-sm text-destructive mt-1">
              {errors.county.message}
            </p>
          )}
        </div>

        {/* Signature File */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Signature File
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("signatureFile")}
            className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
          />
          {errors.signatureFile && (
            <p className="text-sm text-destructive mt-1">
              {errors.signatureFile.message as string}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={creating}
            variant="default"
            className="w-full"
          >
            {creating ? "Saving..." : "Add Institution"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
