"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useAuth } from "@/Context/useAuth";
import { forgotPasswordAPI, resetPasswordAPI } from "@/Services/AuthService";

/* ---------------- Schemas ---------------- */

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const forgotSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const resetSchema = yup.object({
  token: yup.string().required("Reset code is required"),
  newPassword: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("New password is required"),
});

type LoginFormInputs = yup.InferType<typeof loginSchema>;
type ForgotFormInputs = yup.InferType<typeof forgotSchema>;
type ResetFormInputs = yup.InferType<typeof resetSchema>;

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");

  /* ---------------- Login Form ---------------- */

  const loginForm = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = (form: LoginFormInputs) => {
    loginUser(form.email, form.password);
  };

  /* ---------------- Forgot Password Form ---------------- */

  const forgotForm = useForm<ForgotFormInputs>({
    resolver: yupResolver(forgotSchema),
  });

  const handleForgot = async (form: ForgotFormInputs) => {
    const res = await forgotPasswordAPI(form.email);

    if (res) {
      toast.success("Reset code sent to your email");
      setMode("reset");
    }
  };

  /* ---------------- Reset Password Form ---------------- */

  const resetForm = useForm<ResetFormInputs>({
    resolver: yupResolver(resetSchema),
  });

  const handleReset = async (form: ResetFormInputs) => {
    const res = await resetPasswordAPI(form.token, form.newPassword);

    if (res) {
      toast.success("Password reset successful. Please sign in.");
      setMode("login");
    }
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
            {mode === "login" && "Welcome Back"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Reset Password"}
          </h1>

          <p className="text-muted-foreground">
            {mode === "login" && "Sign in to continue your teaching journey"}
            {mode === "forgot" && "Enter your email to receive a reset code"}
            {mode === "reset" && "Enter the code and your new password"}
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              {mode === "login" && "Sign In"}
              {mode === "forgot" && "Forgot Password"}
              {mode === "reset" && "Reset Password"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* ---------------- LOGIN ---------------- */}
            {mode === "login" && (
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full mt-4">
                  Sign In
                </Button>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </form>
            )}

            {/* ---------------- FORGOT PASSWORD ---------------- */}
            {mode === "forgot" && (
              <form
                onSubmit={forgotForm.handleSubmit(handleForgot)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    {...forgotForm.register("email")}
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Send Reset Code
                </Button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-sm text-muted-foreground hover:underline"
                >
                  Back to login
                </button>
              </form>
            )}

            {/* ---------------- RESET PASSWORD ---------------- */}
            {mode === "reset" && (
              <form
                onSubmit={resetForm.handleSubmit(handleReset)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Label htmlFor="token">Reset Code</Label>
                  <Input
                    id="token"
                    placeholder="Enter code from email"
                    {...resetForm.register("token")}
                  />
                  {resetForm.formState.errors.token && (
                    <p className="text-sm text-destructive">
                      {resetForm.formState.errors.token.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="New password"
                    {...resetForm.register("newPassword")}
                  />
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Reset Password
                </Button>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-full text-sm text-muted-foreground hover:underline"
                >
                  Back to login
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
