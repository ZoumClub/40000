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
import { SellCarFormData } from "@/lib/validations/sellCar";
import { 
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  BODY_TYPES,
  COLORS,
} from "@/types/sellCar";

interface TechnicalSpecsProps {
  form: UseFormReturn<SellCarFormData>;
}

export function TechnicalSpecs({ form }: TechnicalSpecsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Technical Specifications</h2>

      <FormField
        control={form.control}
        name="fuelType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fuel Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {FUEL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
        name="transmission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transmission</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TRANSMISSION_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
        name="bodyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {BODY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="exteriorColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exterior Color</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
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
          name="interiorColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interior Color</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}