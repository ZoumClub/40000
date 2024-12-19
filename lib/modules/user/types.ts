
export interface UserAuthState {
  isAuthenticated: boolean;
  name?: string;
  pin?: string;
}

export interface UserLoginData {
  name: string;
  pin: string;
}

export interface UserCar {
  id: string;
  seller_name: string;
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
  bids?: {
    id: string;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    dealer?: {
      name: string;
      phone: string;
      whatsapp?: string;
    };
  }[];
  created_at: string;
  updated_at: string;
}
