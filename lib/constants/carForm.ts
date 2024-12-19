export const FORM_TABS = [
  { id: "dealer", label: "Dealer Info" },
  { id: "basic", label: "Basic Info" },
  { id: "specs", label: "Specifications" },
  { id: "features", label: "Features" },
  { id: "media", label: "Media" },
] as const;

export type FormTab = typeof FORM_TABS[number]["id"];

export const MILEAGE_RANGES = [
  "0-1,000",
  "1,000-5,000",
  "5,000-10,000",
  "10,000-20,000",
  "20,000-50,000",
  "50,000-100,000",
  "100,000+"
];

export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid"
];

export const TRANSMISSION_TYPES = [
  "Automatic",
  "Manual",
  "Semi-Automatic",
  "CVT"
];

export const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Wagon",
  "Van",
  "Truck"
];

export const COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Brown",
  "Beige",
  "Other"
];