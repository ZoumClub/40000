"use client";

import { 
  Wrench, 
  Car, 
  Shield, 
  PaintBucket,
  Gauge,
  Battery,
  Settings,
  Sparkles
} from "lucide-react";

// Define available service names
export const SERVICE_NAMES = [
  "Oil Change",
  "Car Inspection",
  "Paint Service",
  "Brake Service",
  "Battery Service",
  "Engine Tune-up",
  "Car Detailing",
  "Insurance",
] as const;

// Map service names to Lucide icons
export const SERVICE_ICONS = {
  "Oil Change": Settings,
  "Car Inspection": Car,
  "Paint Service": PaintBucket,
  "Brake Service": Gauge,
  "Battery Service": Battery,
  "Engine Tune-up": Wrench,
  "Car Detailing": Sparkles,
  "Insurance": Shield,
} as const;

export type ServiceName = typeof SERVICE_NAMES[number];

// Function to get icon component for a service
export function getServiceIcon(name: string) {
  return SERVICE_ICONS[name as ServiceName] || Car;
}