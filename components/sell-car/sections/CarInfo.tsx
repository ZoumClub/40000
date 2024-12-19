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
import { Input } from "@/components/ui/input";
import { MILEAGE_RANGES } from "@/lib/modules/cars/constants";
import { useBrands } from "@/lib/hooks/useBrands";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { UseFormReturn } from "react-hook-form";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

interface CarInfoProps {
  form: UseFormReturn<SellCarFormData>;
}

export function CarInfo({ form }: CarInfoProps) {
  const { data: brands, isLoading } = useBrands();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold border-b pb-2">Car Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand */}
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <div className="p-2 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : brands?.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground">
                      No brands available
                    </div>
                  ) : (
                    brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model *</FormLabel>
              <FormControl>
                <Input placeholder="Enter model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year *</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asking Price (£) *</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mileage Range */}
        <FormField
          control={form.control}
          name="mileage_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage Range *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mileage range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MILEAGE_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Previous Owners */}
        <FormField
          control={form.control}
          name="previous_owners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Owners *</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  min="0"
                  placeholder="Number of previous owners"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  value={field.value || ''}
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