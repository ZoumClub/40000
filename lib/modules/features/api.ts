import { supabase } from "@/lib/supabase/client";
import type { Feature, CreateFeatureData, UpdateFeatureData } from "./types";

export async function getFeatures() {
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as Feature[];
}

export async function getFeatureById(id: string) {
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Feature;
}

export async function createFeature(data: CreateFeatureData) {
  const { data: feature, error } = await supabase
    .from("features")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return feature as Feature;
}

export async function updateFeature({ id, ...data }: UpdateFeatureData) {
  const { data: feature, error } = await supabase
    .from("features")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return feature as Feature;
}

export async function deleteFeature(id: string) {
  const { error } = await supabase
    .from("features")
    .delete()
    .eq("id", id);

  if (error) throw error;
}