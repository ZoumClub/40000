import { Check } from "lucide-react";

interface CarFeaturesProps {
  features: string[];
}

export function CarFeatures({ features }: CarFeaturesProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Features</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}