"use client";

export interface UserCarBid {
  id: string;
  amount: number;
  created_at: string;
  dealer?: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
  };
}

export interface UserCar {
  id: string;
  seller_name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage_range: string;
  previous_owners: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  features: string[];
  user_car_bids?: UserCarBid[];
  created_at: string;
  updated_at: string;
}