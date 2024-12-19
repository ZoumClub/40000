export const FORM_TABS = [
  { id: "contact", label: "Contact" },
  { id: "car", label: "Car Info" },
  { id: "specs", label: "Specifications" },
  { id: "features", label: "Features" },
  { id: "media", label: "Media" },
] as const;

export type FormTab = typeof FORM_TABS[number]["id"];

export const DEFAULT_FORM_VALUES = {
  name: "",
  pinCode: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: "",
  previousOwners: 0,
  fuelType: undefined,
  transmission: undefined,
  bodyType: undefined,
  exteriorColor: undefined,
  interiorColor: undefined,
  features: [],
  images: [],
};