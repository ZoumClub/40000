import { supabase } from "@/lib/supabase/client";
import type { Brand } from "@/types/brand";

export async function getBrandsList(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  if (error) throw error;
  return data || [];
}

export async function getActiveBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("order_index");

  if (error) throw error;
  return data || [];
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBrand(brand: Omit<Brand, "id" | "created_at" | "updated_at">): Promise<Brand> {
  const { data, error } = await supabase
    .from("brands")
    .insert([brand])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
  const { data, error } = await supabase
    .from("brands")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBrand(id: string): Promise<void> {
  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("id", id);

  if (error) throw error;
}