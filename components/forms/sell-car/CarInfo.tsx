"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";
import { MILEAGE_RANGES } from "@/types/sellCar";
import { useBrands } from "@/lib/hooks/useBrands";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CarInfoProps {
  form: UseFormReturn<SellCarFormData>;
}

export function CarInfo({ form }: CarInfoProps) {
  const { data: brands, isLoading } = useBrands();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 50 },
    (_, i) => currentYear - i
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Car Information</h2>

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
                  <div className="p-2 flex justify-center">
                    <LoadingSpinner />
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

      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(parseInt(value))}
              value={field.value?.toString()}
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

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (£)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter price"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mileage Range</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
    </div>
  );
}