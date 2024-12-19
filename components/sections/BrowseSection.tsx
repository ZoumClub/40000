"use client";

import { Button } from "@/components/ui/button";
import { CarList } from "@/components/cars/CarList";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { useCarFilters, FilterType } from "@/lib/hooks/useCarFilters";
import { useDealerCars } from "@/lib/hooks/useDealerCars";
import { ErrorMessage } from "@/components/ui/error-message";

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Cars' },
  { value: 'new', label: 'New Cars' },
  { value: 'used', label: 'Used Cars' },
];

interface BrowseSectionProps {
  selectedBrand: string | null;
  onBrandSelect: (brand: string | null) => void;
}

export default function BrowseSection({ selectedBrand, onBrandSelect }: BrowseSectionProps) {
  const { cars, isLoading, error } = useDealerCars();
  const { typeFilter, setTypeFilter, filteredCars } = useCarFilters(cars);

  // Filter cars by selected brand and type
  const displayedCars = selectedBrand
    ? filteredCars.filter(car => car.brand === selectedBrand)
    : filteredCars;

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto">
          <ErrorMessage message="Failed to load cars. Please try again later." />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">Browse Our Collection</h2>
        
        <BrandsSection
          selectedBrand={selectedBrand}
          onBrandSelect={onBrandSelect}
        />

        <div className="flex flex-col items-center gap-6 mb-12">
          {selectedBrand && (
            <p className="text-lg text-muted-foreground">
              Showing {selectedBrand} vehicles
            </p>
          )}

          <div className="flex justify-center gap-4">
            {FILTER_OPTIONS.map(option => (
              <Button 
                key={option.value}
                variant={typeFilter === option.value ? "default" : "outline"}
                onClick={() => setTypeFilter(option.value)}
                className={
                  typeFilter === option.value 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : ""
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <CarList cars={displayedCars} isLoading={isLoading} />
      </div>
    </section>
  );
}