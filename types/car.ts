// Base interface for shared car properties
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
  approval_status: 'pending' | 'approved' | 'rejected';
  availability_status: 'available' | 'sold';
  images?: string[];
  video?: string;
  created_at: string;
  updated_at: string;
}

// Dealer car extends base with dealer-specific fields
export interface DealerCar extends BaseCar {
  dealer_id: string;
  savings?: number;
  type: 'new' | 'used';
  dealer?: {
    name: string;
    phone: string;
    whatsapp?: string;
  };
}

// User car extends base with user-specific fields
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