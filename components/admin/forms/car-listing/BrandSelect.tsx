"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DealerCarFormData } from "@/lib/validations/dealerCar";
import { useBrands } from "@/lib/hooks/useBrands";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BrandOption } from "./BrandOption";

interface BrandSelectProps {
  form: UseFormReturn<DealerCarFormData>;
}

export function BrandSelect({ form }: BrandSelectProps) {
  const { data: brands, isLoading } = useBrands();

  // Filter only active brands
  const activeBrands = brands?.filter(brand => brand.is_active) || [];

  return (
    <FormField
      control={form.control}
      name="brand"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Brand</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <div className="p-4 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : activeBrands.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No brands available
                </div>
              ) : (
                activeBrands.map((brand) => (
                  <BrandOption key={brand.id} brand={brand} />
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}