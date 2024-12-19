"use client";

import { useState } from "react";
import { CarListingForm } from "@/components/admin/forms/car-listing/CarListingForm";
import { toast } from "sonner";

export function ListCarTab() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    toast.success("Car listed successfully");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">List a New Car</h2>
        <CarListingForm 
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </div>
    </div>
  );
}