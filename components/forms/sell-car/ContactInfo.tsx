"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CarFormData } from "@/types/sellCar";

interface ContactInfoProps {
  form: UseFormReturn<CarFormData>;
}

export function ContactInfo({ form }: ContactInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Contact Information</h2>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pinCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last 4 Digits of Phone Number</FormLabel>
            <FormControl>
              <Input 
                type="password"
                maxLength={4}
                placeholder="Enter PIN"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}