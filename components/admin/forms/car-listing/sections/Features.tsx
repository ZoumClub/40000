"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useFeatures } from "@/lib/hooks/useFeatures";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";

interface FeaturesProps {
  form: UseFormReturn<DealerCarFormData>;
}

export function Features({ form }: FeaturesProps) {
  const { features, isLoading } = useFeatures();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Features & Equipment</h2>

      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Features</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features?.map((feature) => (
                <FormItem
                  key={feature.id}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(feature.name)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || [];
                        const newValue = checked
                          ? [...currentValue, feature.name]
                          : currentValue.filter((value) => value !== feature.name);
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {feature.name}
                  </FormLabel>
                </FormItem>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}