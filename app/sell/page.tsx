"use client";

import { SellCarForm } from "@/components/sell-car/SellCarForm";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Sell Your Car</h1>
          <p className="text-center text-muted-foreground mb-12">
            Fill out the form below to list your car for sale. All fields marked with * are required.
          </p>
          <SellCarForm />
        </div>
      </div>
    </div>
  );
}