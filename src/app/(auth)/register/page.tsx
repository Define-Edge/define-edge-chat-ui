"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegisterMutation } from "@/modules/auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth/types/auth.types";

export default function RegisterPage() {
  const router = useRouter();
  const mutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push(
          `/verify-email?email=${encodeURIComponent(getValues("email"))}`,
        );
      },
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Get started with FinSharpe in seconds
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="flex flex-col gap-4">
          {mutation.error && (
            <div className="rounded-md bg-error-bg px-3 py-2 text-sm text-error-fg">
              {mutation.error.message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-error-fg">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-error-fg">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Choose a strong password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-error-fg">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="brand"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </CardContent>
      </form>

      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
