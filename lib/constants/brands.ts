import type { Brand } from "@/types/brand";

export const ALL_BRANDS: Brand = {
  id: "all",
  name: "All Brands",
  logo_url: "/brands/all-brands.png",
  order_index: 0,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const BRAND_LIST: Brand[] = [
  {
    id: "bmw",
    name: "BMW",
    logo_url: "https://www.car-logos.org/wp-content/uploads/2011/09/bmw.png",
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mercedes",
    name: "Mercedes",
    logo_url: "https://www.car-logos.org/wp-content/uploads/2011/09/mercedes.png",
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Add other brands following the same pattern...
];

export const BRANDS: Brand[] = [ALL_BRANDS, ...BRAND_LIST];