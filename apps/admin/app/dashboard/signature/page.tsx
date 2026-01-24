"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import { addSignatureApi } from "@/Services/AdminService";

// Zod schema
const signatureSchema = z.object({
  signatureFile: z
    .any()
    .refine((file) => file?.[0]?.size > 0, "Signature file is required"),
});

type SignatureForm = z.infer<typeof signatureSchema>;

export default function UploadSignaturePage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignatureForm>({
    resolver: zodResolver(signatureSchema),
  });

  const handleUpload = async (data: SignatureForm) => {
    try {
      setUploading(true);

      const formData = new FormData();
      if (data.signatureFile?.[0]) {
        formData.append("signatureFile", data.signatureFile[0]);
      }

      await addSignatureApi(formData); // must accept multipart/form-data
      toast.success("Signature uploaded successfully!");
      reset();
      router.push("/dashboard");
    } catch (err) {
      console.error("Error uploading signature", err);
      toast.error("Failed to upload signature");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-lg bg-background text-foreground">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Upload Signature</h1>
      </header>

      <form
        onSubmit={handleSubmit(handleUpload)}
        className="space-y-6"
        encType="multipart/form-data"
      >
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
          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Signature"}
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
