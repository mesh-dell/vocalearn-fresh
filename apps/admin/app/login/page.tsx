"use client";

import { useState } from "react";
import { useAuth } from "@/Context/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

type LoginInputs = yup.InferType<typeof loginSchema>;
type ForgotInputs = yup.InferType<typeof forgotSchema>;
type ResetInputs = yup.InferType<typeof resetSchema>;

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const router = useRouter();

  /* ---------------- Login ---------------- */

  const loginForm = useForm<LoginInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setLoading(true);
    await loginUser(data.email, data.password);
    setLoading(false);
    router.push("/dashboard");
  };

  /* ---------------- Forgot Password ---------------- */

  const forgotForm = useForm<ForgotInputs>({
    resolver: yupResolver(forgotSchema),
  });

  const handleForgot = async (data: ForgotInputs) => {
    setLoading(true);
    const res = await forgotPasswordAPI(data.email);
    setLoading(false);

    if (res) {
      toast.success("Reset code sent to your email");
      setMode("reset");
    }
  };

  /* ---------------- Reset Password ---------------- */

  const resetForm = useForm<ResetInputs>({
    resolver: yupResolver(resetSchema),
  });

  const handleReset = async (data: ResetInputs) => {
    setLoading(true);
    const res = await resetPasswordAPI(data.token, data.newPassword);
    setLoading(false);

    if (res) {
      toast.success("Password reset successful. Please log in.");
      setMode("login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Vocalearn Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* ---------------- LOGIN FORM ---------------- */}
          {mode === "login" && (
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="********"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center transition"
                variant="default"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                    in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          )}

          {/* ---------------- FORGOT PASSWORD FORM ---------------- */}
          {mode === "forgot" && (
            <form
              onSubmit={forgotForm.handleSubmit(handleForgot)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...forgotForm.register("email")}
                />
                {forgotForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {forgotForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
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

          {/* ---------------- RESET PASSWORD FORM ---------------- */}
          {mode === "reset" && (
            <form
              onSubmit={resetForm.handleSubmit(handleReset)}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Reset Code
                </label>
                <Input
                  placeholder="Enter code from email"
                  {...resetForm.register("token")}
                />
                {resetForm.formState.errors.token && (
                  <p className="text-sm text-destructive mt-1">
                    {resetForm.formState.errors.token.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="New password"
                  {...resetForm.register("newPassword")}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
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

          <p className="text-center text-sm text-muted-foreground mt-6">
            &copy; {new Date().getFullYear()} Vocalearn LMS
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
