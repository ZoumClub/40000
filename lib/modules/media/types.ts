"use client";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadResult {
  url: string;
  error?: Error;
}

export interface MediaRecord {
  car_id: string;
  media_type: "image" | "video";
  url: string;
  position: number;
}