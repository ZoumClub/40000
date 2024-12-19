"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends NextImageProps {
  fallback?: string;
}

export function Image({ 
  className,
  fallback = "/images/placeholder.jpg",
  alt,
  ...props 
}: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <NextImage
      className={cn(
        "transition-opacity duration-300",
        error ? "opacity-50" : "opacity-100",
        className
      )}
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallback : props.src}
      {...props}
    />
  );
}