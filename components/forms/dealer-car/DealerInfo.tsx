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
import { useDealers } from "@/lib/hooks/useDealers";

interface DealerInfoProps {
  form: UseFormReturn<DealerCarFormData>;
}

export function DealerInfo({ form }: DealerInfoProps) {
  const { dealers, isLoading } = useDealers();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dealer Information</h2>

      <FormField
        control={form.control}
        name="dealer_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Dealer</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a dealer" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dealers.map((dealer) => (
                  <SelectItem key={dealer.id} value={dealer.id}>
                    {dealer.name}
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