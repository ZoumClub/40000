"use client";

import { useAccessories } from "@/lib/modules/accessories";
import { AccessoryGrid } from "@/components/accessories/AccessoryGrid";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";

export default function AccessoriesSection() {
  const { accessories, isLoading, error } = useAccessories();

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Car Accessories</h2>
          <ErrorMessage message="Failed to load accessories. Please try again later." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Car Accessories</h2>
        <AccessoryGrid
          accessories={accessories}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}