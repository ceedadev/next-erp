"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import { signIn, signUp } from "@/lib/auth-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(data: AuthFormData) {
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { data: result, error } = await signUp.email({
          email: data.email,
          password: data.password,
          name: data.name || "",
        });

        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Account created successfully",
          description: "You can now sign in with your credentials",
        });
        setIsSignUp(false);
        form.reset();
      } else {
        const { data: result, error } = await signIn.email({
          email: data.email,
          password: data.password,
        });

        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center space-y-2">
        <Button
          variant="link"
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            form.reset();
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
        
        {!isSignUp && (
          <div>
            <p className="text-xs text-muted-foreground">
              Need to register your company?{" "}
              <Link
                href="/register-company"
                className="underline underline-offset-4 hover:text-primary"
              >
                Register Company
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
