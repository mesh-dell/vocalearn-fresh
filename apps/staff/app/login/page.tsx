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
  password: yup.string().required("Password is required"),
});

type LoginFormInputs = yup.InferType<typeof schema>;

export default function LoginPage() {
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const handleLogin = (form: LoginFormInputs) => {
    loginUser(form.email, form.password);
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

          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to continue your teaching journey
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full mt-4">
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
