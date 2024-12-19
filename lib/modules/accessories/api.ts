import { supabase } from "@/lib/supabase/client";
import type { Accessory, CreateAccessoryData, UpdateAccessoryData } from "./types";

export async function getAccessories() {
  const { data, error } = await supabase
    .from("accessories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Accessory[];
}

export async function getAccessoryById(id: string) {
  const { data, error } = await supabase
    .from("accessories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Accessory;
}

export async function createAccessory(data: CreateAccessoryData) {
  const { data: accessory, error } = await supabase
    .from("accessories")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return accessory as Accessory;
}

export async function updateAccessory({ id, ...data }: UpdateAccessoryData) {
  const { data: accessory, error } = await supabase
    .from("accessories")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return accessory as Accessory;
}

export async function deleteAccessory(id: string) {
  const { error } = await supabase
    .from("accessories")
    .delete()
    .eq("id", id);

  if (error) throw error;
}