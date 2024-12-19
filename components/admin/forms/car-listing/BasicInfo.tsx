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
import { DealerCarFormData } from "@/lib/validations/dealerCar";
import { BrandSelect } from "./BrandSelect";

interface BasicInfoProps {
  form: UseFormReturn<DealerCarFormData>;
}

export function BasicInfo({ form }: BasicInfoProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BrandSelect form={form} />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Enter model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (£)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="1900"
                  max={currentYear + 1}
                  placeholder="Enter year"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}