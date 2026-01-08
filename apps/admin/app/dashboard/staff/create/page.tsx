"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { toast } from "react-toastify";
import { addStaffAPI } from "@/Services/AdminService";
import { useState } from "react";

const staffSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(2),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().min(10),
  birthYear: z.number().min(1950).max(new Date().getFullYear()),
  admissionYear: z.number().min(2000).max(new Date().getFullYear()),
});

type StaffForm = z.infer<typeof staffSchema>;

export default function CreateStaffPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
  });

  const handleAddStaff = async (data: StaffForm) => {
    try {
      setCreating(true);
      await addStaffAPI(data);
      toast.success("Staff added successfully!");
      reset();
      router.push("/dashboard/staff");
    } catch (err) {
      console.error("Error adding staff", err);
      toast.error("Failed to add staff");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-lg bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Add New Staff Member</h1>

      <form onSubmit={handleSubmit(handleAddStaff)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              First Name
            </label>
            <Input {...register("firstName")} />
            {errors.firstName && (
              <p className="text-sm text-destructive mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Last Name
            </label>
            <Input {...register("lastName")} />
            {errors.lastName && (
              <p className="text-sm text-destructive mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email
          </label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Department & Gender */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Department
            </label>
            <Input {...register("department")} />
            {errors.department && (
              <p className="text-sm text-destructive mt-1">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Gender
            </label>
            <select
              {...register("gender")}
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Phone Number
          </label>
          <Input {...register("phoneNumber")} />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Birth Year & Admission Year */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Birth Year
            </label>
            <Input
              type="number"
              {...register("birthYear", { valueAsNumber: true })}
            />
            {errors.birthYear && (
              <p className="text-sm text-destructive mt-1">{errors.birthYear.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Admission Year
            </label>
            <Input
              type="number"
              {...register("admissionYear", { valueAsNumber: true })}
            />
            {errors.admissionYear && (
              <p className="text-sm text-destructive mt-1">{errors.admissionYear.message}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={creating} variant="default" className="w-full">
            {creating ? "Saving..." : "Add Staff"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/dashboard/staff")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

