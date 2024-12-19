"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessorySchema } from "@/lib/validations/accessory";
import type { Accessory } from "@/types/accessory";

export function useAccessoryForm(accessory?: Accessory | null) {
  return useForm({
    resolver: zodResolver(accessorySchema),
    defaultValues: accessory ? {
      name: accessory.name,
      price: accessory.price,
      description: accessory.description,
      image_url: accessory.image_url,
      provider_name: accessory.provider_name,
      contact_number: accessory.contact_number,
      whatsapp_number: accessory.whatsapp_number,
    } : {
      name: "",
      price: 0,
      description: "",
      image_url: "",
      provider_name: "",
      contact_number: "",
      whatsapp_number: "",
    },
  });
}