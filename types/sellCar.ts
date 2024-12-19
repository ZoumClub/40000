export interface CarFormData {
  // Contact Information
  name: string;
  pinCode: string;

  // Car Information
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  previousOwners: number;

  // Technical Specifications
  fuelType: string;
  transmission: string;
  bodyType: string;
  exteriorColor: string;
  interiorColor: string;

  // Features
  features: string[];

  // Media
  images: File[];
  video?: File;
}

export const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in Hybrid',
];

export const TRANSMISSION_TYPES = [
  'Automatic',
  'Manual',
  'Semi-Automatic',
  'CVT',
];

export const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Wagon',
  'Van',
  'Truck',
];

export const MILEAGE_RANGES = [
  '0-1,000',
  '1,000-5,000',
  '5,000-10,000',
  '10,000-20,000',
  '20,000-50,000',
  '50,000-100,000',
  '100,000+',
];

export const CAR_FEATURES = [
  'Speed Regulator',
  'Air Condition',
  'Reversing Camera',
  'Reversing Radar',
  'GPS Navigation',
  'Park Assist',
  'Airbag',
  'ABS',
  'Leather Seats',
  'Sunroof',
  'Bluetooth',
  'Climate Control',
  'Keyless Entry',
  'Power Windows',
  'Power Seats',
];

export const COLORS = [
  'Black',
  'White',
  'Silver',
  'Gray',
  'Red',
  'Blue',
  'Green',
  'Brown',
  'Beige',
  'Other',
];