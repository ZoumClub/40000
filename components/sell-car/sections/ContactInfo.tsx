"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

interface ContactInfoProps {
  form: UseFormReturn<SellCarFormData>;
}

export function ContactInfo({ form }: ContactInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">Contact Information</h2>

      <FormField
        control={form.control}
        name="seller_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
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
            <FormLabel>4-Digit PIN *</FormLabel>
            <FormControl>
              <Input 
                type="password"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <p className="text-sm text-muted-foreground mt-1">
              Remember this PIN to manage your listing later
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}