export interface Feature {
  id: string;
  name: string;
  category?: string;
  created_at: string;
}

export interface CarFeature {
  id: string;
  car_type: 'dealer_car' | 'user_car';
  car_id: string;
  feature: string;
  category?: string;
  created_at: string;
}

export interface AddFeatureParams {
  carId: string;
  carType: 'dealer_car' | 'user_car';
  featureId: string;
}