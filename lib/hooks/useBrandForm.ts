"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandSchema } from "@/lib/validations/brand";
import type { Brand } from "@/types/brand";

export function useBrandForm(brand?: Brand | null) {
  return useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: brand ? {
      name: brand.name,
      logo_url: brand.logo_url,
      order_index: brand.order_index,
      is_active: brand.is_active,
    } : {
      name: "",
      logo_url: "",
      order_index: 0,
      is_active: true,
    },
  });
}