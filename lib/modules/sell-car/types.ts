"use client";

export interface SellCarFormData {
  // Contact Information
  seller_name: string;
  pin: string;

  // Car Information
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage_range: string;
  previous_owners: number;

  // Technical Specifications
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;

  // Features
  features: string[];
}

export interface SubmitCarResponse {
  success: boolean;
  carId?: string;
  error?: string;
}