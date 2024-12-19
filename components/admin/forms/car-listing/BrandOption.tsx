"use client";

import { SelectItem } from "@/components/ui/select";
import type { Brand } from "@/types/brand";
import Image from "next/image";

interface BrandOptionProps {
  brand: Brand;
}

export function BrandOption({ brand }: BrandOptionProps) {
  return (
    <SelectItem 
      value={brand.name}
      className="flex items-center gap-2 py-3"
    >
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-6 h-6 flex-shrink-0">
          <Image
            src={brand.logo_url}
            alt={brand.name}
            fill
            className="object-contain"
          />
        </div>
        <span>{brand.name}</span>
      </div>
    </SelectItem>
  );
}