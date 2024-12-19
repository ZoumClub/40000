"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useFeatures } from "@/lib/modules/sell-car/hooks/useFeatures";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { UseFormReturn } from "react-hook-form";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

interface FeaturesProps {
  form: UseFormReturn<SellCarFormData>;
}

export function Features({ form }: FeaturesProps) {
  const { features, isLoading, error } = useFeatures();

  if (error) {
    return (
      <div className="text-red-500">
        Failed to load features. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">Features & Equipment</h2>

      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Features *</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <FormItem
                  key={feature.id}
                  className="flex items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(feature.name)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || [];
                        const newValue = checked
                          ? [...currentValue, feature.name]
                          : currentValue.filter(name => name !== feature.name);
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