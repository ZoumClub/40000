"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/lib/validations/service";
import type { Service } from "@/types/service";

export function useServiceForm(service?: Service | null) {
  return useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: service ? {
      name: service.name,
      price: service.price,
      description: service.description,
      image_url: service.image_url,
      icon: service.icon,
      provider_name: service.provider_name,
      contact_number: service.contact_number,
      whatsapp_number: service.whatsapp_number,
    } : {
      name: "",
      price: 0,
      description: "",
      image_url: "",
      icon: "",
      provider_name: "",
      contact_number: "",
      whatsapp_number: "",
    },
  });
}