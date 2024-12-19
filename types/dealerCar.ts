import type { Dealer } from "./dealer";

export interface DealerCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  savings?: number; // Add savings field
  mileage_range: string;
  previous_owners: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  exterior_color: string;
  interior_color: string;
  features: string[];
  type: 'new' | 'used';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  dealer?: Dealer;
  images?: string[];
  video?: string;
}