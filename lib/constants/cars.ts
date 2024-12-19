import { Car } from "@/types/car";

export const DUMMY_CARS: Car[] = [
  {
    id: 1,
    name: "Mercedes-Benz C-Class",
    price: "45,000",
    savings: "5,000",
    type: "new",
    images: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617650728444-c1b89e64c084?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    video: "https://www.youtube.com/embed/example",
    specs: {
      mileage: 0,
      transmission: "Automatic",
      fuelType: "Petrol",
      year: 2024,
    },
    features: [
      "Air Conditioning",
      "Electric Windows",
      "Leather Seats",
      "Navigation System",
      "Parking Sensors",
      "Bluetooth",
      "Climate Control",
      "Cruise Control",
    ],
    dealer: {
      name: "Premium Motors",
      phone: "+1234567890",
      whatsapp: "1234567890"
    }
  },
  {
    id: 2,
    name: "BMW 3 Series",
    price: "35,000",
    type: "used",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    ],
    specs: {
      mileage: 45000,
      transmission: "Automatic",
      fuelType: "Diesel",
      year: 2022,
    },
    features: [
      "Air Conditioning",
      "Electric Windows",
      "Leather Seats",
      "Navigation System",
      "Parking Sensors",
      "Bluetooth",
    ],
    dealer: {
      name: "AutoMax Dealers",
      phone: "+1234567890",
      whatsapp: "1234567890"
    }
  },
];