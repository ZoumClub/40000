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
import { DealerCarFormData } from "@/lib/validations/dealerCar";
import { CAR_FEATURES } from "@/types/sellCar";

interface FeaturesProps {
  form: UseFormReturn<DealerCarFormData>;
}

export function Features({ form }: FeaturesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Features</h2>

      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Features</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CAR_FEATURES.map((feature) => (
                <FormItem
                  key={feature}
                  className="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(feature)}
                      onCheckedChange={(checked) => {
                        const currentValue = field.value || [];
                        const newValue = checked
                          ? [...currentValue, feature]
                          : currentValue.filter((value) => value !== feature);
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {feature}
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