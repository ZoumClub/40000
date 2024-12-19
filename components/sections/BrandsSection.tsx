"use client";

import { BrandLogo } from "@/components/brands/BrandLogo";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { useBrands } from "@/lib/hooks/useBrands";
import { Button } from "@/components/ui/button";

interface BrandsSectionProps {
  selectedBrand: string | null;
  onBrandSelect: (brandName: string | null) => void;
}

export function BrandsSection({ selectedBrand, onBrandSelect }: BrandsSectionProps) {
  const { data: brands, isLoading, error } = useBrands();

  if (error) {
    return <ErrorMessage message="Failed to load brands" />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner />
      </div>
    );
  }

  // Filter only visible brands and exclude "All Brands"
  const visibleBrands = brands?.filter(brand => brand.is_visible && brand.name !== "All Brands") || [];

  return (
    <div className="space-y-6 h-60">
      {/* All Brands Button */}
      <div className="flex justify-center">
        <Button
          variant={selectedBrand === null ? "default" : "outline"}
          onClick={() => onBrandSelect(null)}
          className="px-8"
        >
          All Brands
        </Button>
      </div>

      {/* Scrolling Brands Container */}
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 px-4 min-w-max animate-scroll">
            {/* Double the brands for continuous scrolling */}
            {[...visibleBrands, ...visibleBrands].map((brand, index) => (
              <BrandLogo
                key={`${brand.id}-${index}`}
                brand={brand}
                isSelected={brand.name === selectedBrand}
                onClick={() => onBrandSelect(brand.name === selectedBrand ? null : brand.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}