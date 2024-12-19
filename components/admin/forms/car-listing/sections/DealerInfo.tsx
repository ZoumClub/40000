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
import { useDealers } from "@/lib/hooks/useDealers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";

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
                {isLoading ? (
                  <div className="p-2 flex justify-center">
                    <LoadingSpinner />
                  </div>
                ) : dealers?.length === 0 ? (
                  <div className="p-2 text-center text-muted-foreground">
                    No dealers available
                  </div>
                ) : (
                  dealers?.map((dealer) => (
                    <SelectItem key={dealer.id} value={dealer.id}>
                      {dealer.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}