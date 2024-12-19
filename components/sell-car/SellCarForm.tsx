"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ContactInfo } from "./sections/ContactInfo";
import { CarInfo } from "./sections/CarInfo";
import { TechnicalSpecs } from "./sections/TechnicalSpecs";
import { Features } from "./sections/Features";
import { sellCarSchema } from "@/lib/modules/sell-car/validation";
import { submitCarListing } from "@/lib/modules/sell-car/api";
import type { SellCarFormData } from "@/lib/modules/sell-car/types";

const defaultValues: SellCarFormData = {
  seller_name: "",
  pin: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage_range: "",
  previous_owners: 0,
  fuel_type: "",
  transmission: "",
  body_type: "",
  exterior_color: "",
  interior_color: "",
  features: [],
};

export function SellCarForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<SellCarFormData>({
    resolver: zodResolver(sellCarSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: SellCarFormData) => {
    try {
      setIsSubmitting(true);
      const result = await submitCarListing(data);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to submit car listing");
      }

      toast.success("Your car listing has been submitted successfully!");
      router.push("/user");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit car listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sell Your Car</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to list your car for sale. All fields marked with * are required.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ContactInfo form={form} />
          <CarInfo form={form} />
          <TechnicalSpecs form={form} />
          <Features form={form} />

          <div className="pt-6 border-t">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Car Listing"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}