"use client";

import type { DealerCar } from "@/types/dealerCar";

interface RawDealerCar {
  id: string;
  dealer_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  savings?: number;
  mileage_range: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  features: Array<{ feature: { name: string } }>;
  type: 'new' | 'used';
  status: string;
  dealer: {
    name: string;
    phone: string;
    whatsapp?: string;
  } | null;
  media: Array<{
    media_type: 'image' | 'video';
    url: string;
    position: number;
  }>;
  created_at: string;
  updated_at: string;
}

export function transformCarData(rawCar: RawDealerCar): DealerCar {
  // Extract features
  const features = rawCar.features?.map(f => f.feature.name) || [];

  // Sort and extract media
  const media = rawCar.media || [];
  const images = media
    .filter(m => m.media_type === 'image')
    .sort((a, b) => a.position - b.position)
    .map(m => m.url);
  const video = media.find(m => m.media_type === 'video')?.url;

  return {
    ...rawCar,
    features,
    images,
    video,
    dealer: rawCar.dealer || undefined
  };
}

export function validateCarData(car: Partial<DealerCar>): string[] {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    'brand',
    'model',
    'year',
    'price',
    'mileage_range',
    'fuel_type',
    'transmission',
    'body_type',
    'exterior_color',
    'interior_color',
    'type'
  ];

  requiredFields.forEach(field => {
    if (!car[field as keyof DealerCar]) {
      errors.push(`${field} is required`);
    }
  });

  // Validate year
  const currentYear = new Date().getFullYear();
  if (car.year && (car.year < 1900 || car.year > currentYear + 1)) {
    errors.push('Invalid year');
  }

  // Validate price
  if (car.price && car.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  // Validate savings
  if (car.savings && car.savings < 0) {
    errors.push('Savings cannot be negative');
  }

  // Validate features
  if (!car.features || car.features.length === 0) {
    errors.push('At least one feature is required');
  }

  return errors;
}