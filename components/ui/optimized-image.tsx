"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn(
      "overflow-hidden",
      isLoading && "animate-pulse bg-gray-200",
      className
    )}>
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={cn(
          "duration-700 ease-in-out",
          isLoading ? "scale-110 blur-2xl" : "scale-100 blur-0"
        )}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
      />
    </div>
  );
}