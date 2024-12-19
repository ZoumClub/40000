"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { CarImage } from "./CarImage";
import { cn } from "@/lib/utils";

interface CarGalleryProps {
  images: string[];
  video?: string;
  isSold?: boolean;
}

export function CarGallery({ images, video, isSold }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setShowVideo(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setShowVideo(false);
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
        {showVideo && video ? (
          <iframe
            src={video}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <CarImage
            src={images[currentIndex]}
            alt={`Car image ${currentIndex + 1}`}
            isSold={isSold}
            priority={currentIndex === 0}
            className="w-full h-full"
          />
        )}
        
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            onClick={prevImage}
            className="rounded-full bg-white/90 hover:bg-white/100 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextImage}
            className="rounded-full bg-white/90 hover:bg-white/100 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {video && !showVideo && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowVideo(true)}
            className="absolute bottom-4 right-4 rounded-full bg-white/90 hover:bg-white/100 backdrop-blur-sm"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setShowVideo(false);
            }}
            className={cn(
              "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden snap-start transition-all duration-200",
              currentIndex === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            )}
          >
            <CarImage
              src={image}
              alt={`Thumbnail ${index + 1}`}
              isSold={isSold}
              className="w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}