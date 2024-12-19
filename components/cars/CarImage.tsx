"use client";

import { cn } from "@/lib/utils";

interface CarImageProps {
  src: string;
  alt: string;
  isSold?: boolean;
  className?: string;
  priority?: boolean;
}

export function CarImage({ src, alt, isSold, className, priority = false }: CarImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
      />
      {isSold && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white font-bold text-xl transform -rotate-45">
            SOLD
          </span>
        </div>
      )}
    </div>
  );
}