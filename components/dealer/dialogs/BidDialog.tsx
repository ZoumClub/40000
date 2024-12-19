"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { bidSchema } from "@/lib/validations/bid";
import { useBids } from "@/lib/hooks/useBids";
import { formatPrice } from "@/lib/utils";
import type { UserCar } from "@/types/userCar";

interface BidDialogProps {
  car: UserCar | null;
  open: boolean;
  onClose: () => void;
}

export function BidDialog({ car, open, onClose }: BidDialogProps) {
  const { submitBid, isSubmitting } = useBids();

  const form = useForm({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: car?.price || 0,
    },
  });

  const onSubmit = async (data: { amount: number }) => {
    if (!car) return;

    const success = await submitBid(car, data.amount);
    if (success) {
      onClose();
    }
  };

  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Bid</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium">Car Details</h3>
            <p className="text-sm text-muted-foreground">
              {car.brand} {car.model}
            </p>
            <p className="text-sm text-muted-foreground">
              Asking Price: {formatPrice(car.price)}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Bid Amount (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Placing Bid..." : "Place Bid"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}