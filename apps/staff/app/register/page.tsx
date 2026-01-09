"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useAuth } from "@/Context/useAuth";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
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
    registerUser(form.email, form.password, form.confirmPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold">VocaLearn</span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join VocaLearn and start your learning journey
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              Sign Up
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
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

              <Button type="submit" className="w-full mt-4">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
