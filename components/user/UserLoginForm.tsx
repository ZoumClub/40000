"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { userLoginSchema } from "@/lib/modules/user/validation";
import { authenticateUser } from "@/lib/modules/user/api";
import { toast } from "sonner";

export function UserLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      name: "",
      pin: "",
    },
  });

  const onSubmit = async (data: { name: string; pin: string }) => {
    try {
      setIsLoading(true);
      const success = await authenticateUser(data.name, data.pin);

      if (!success) {
        throw new Error("Invalid credentials");
      }

      toast.success("Successfully logged in");
      router.push("/user");
      router.refresh(); // Force refresh to update auth state
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid name or PIN");
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">User Login</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to manage your car listings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name"
                    autoComplete="off"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PIN</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    maxLength={4}
                    placeholder="Enter your 4-digit PIN"
                    autoComplete="off"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}