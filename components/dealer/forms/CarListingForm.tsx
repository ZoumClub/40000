"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInfo } from "./sections/BasicInfo";
import { TechnicalSpecs } from "./sections/TechnicalSpecs";
import { Features } from "./sections/Features";
import { MediaUpload } from "./sections/MediaUpload";
import { dealerCarSchema } from "@/lib/validations/dealerCar";
import { useCarSubmit } from "@/lib/hooks/useCarSubmit";
import type { DealerCar } from "@/types/car";

interface CarListingFormProps {
  car?: DealerCar | null;
  onSuccess: () => void;
  dealerId: string;
}

export function CarListingForm({ car, onSuccess, dealerId }: CarListingFormProps) {
  const { submitCar, isSubmitting } = useCarSubmit();

  const form = useForm({
    resolver: zodResolver(dealerCarSchema),
    defaultValues: car || {
      dealer_id: dealerId,
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      savings: 0,
      mileage_range: "",
      fuel_type: "",
      transmission: "",
      body_type: "",
      exterior_color: "",
      interior_color: "",
      features: [],
      type: "new",
    },
  });

  const onSubmit = async (data: any) => {
    // Ensure dealer_id is set
    data.dealer_id = dealerId;
    
    const success = await submitCar(data, car?.id);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <BasicInfo form={form} />
        <TechnicalSpecs form={form} />
        <Features form={form} />
        <MediaUpload form={form} />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}