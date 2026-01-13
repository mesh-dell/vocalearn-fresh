"use client";

import type React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useAuth } from "@/Context/useAuth";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  admissionYear: yup
    .string()
    .matches(/^\d{4}$/, "Enter a valid year (e.g. 2024)")
    .required("Admission year is required"),
  admissionId: yup.string().required("Admission ID is required"),
  courseName: yup.string().required("Course name is required"),
  gender: yup.string().required("Gender is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

type SignUpFormInputs = yup.InferType<typeof schema>;

export default function SignUpPage() {
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(schema),
  });

  const handleSignUp = (form: SignUpFormInputs) => {
    registerUser(
      form.email,
      form.admissionYear,
      form.admissionId,
      form.courseName,
      form.gender,
      form.password,
      form.confirmPassword
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold">VocaLearn</span>
          </Link>

          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="text-muted-foreground">
            Join VocaLearn and start your learning journey
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign Up</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
              {[
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  label: "Admission Year",
                  name: "admissionYear",
                  placeholder: "2024",
                },
                {
                  label: "Admission ID",
                  name: "admissionId",
                  placeholder: "TVET/CS2022/0909",
                },
                {
                  label: "Course Name",
                  name: "courseName",
                  placeholder: "Computer Science",
                },
                {
                  label: "Gender",
                  name: "gender",
                  placeholder: "Male / Female / Other",
                },
              ].map(({ label, name, type = "text", placeholder }) => (
                <div key={name} className="space-y-1">
                  <Label>{label}</Label>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    {...register(name as keyof SignUpFormInputs)}
                  />
                  {errors[name as keyof SignUpFormInputs] && (
                    <p className="text-sm text-destructive">
                      {errors[name as keyof SignUpFormInputs]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="space-y-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
