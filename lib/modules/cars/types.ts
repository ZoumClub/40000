"use client";

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AvailabilityStatus = 'available' | 'sold';
export type CarType = 'new' | 'used';

export interface CarMedia {
  url: string;
  media_type: 'image' | 'video';
  position: number;
}

export interface CarDealer {
  name: string;
  phone: string;
  whatsapp?: string;
}

export interface BaseCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage_range: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  features: string[];
  approval_status: ApprovalStatus;
  availability_status: AvailabilityStatus;
  created_at: string;
  updated_at: string;
}

export interface DealerCar extends BaseCar {
  dealer_id: string;
  savings?: number;
  type: CarType;
  dealer?: CarDealer;
  images?: string[];
  video?: string;
}

export interface UserCar extends BaseCar {
  seller_name: string;
  previous_owners: number;
  bids?: {
    id: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
  }[];
}