import { supabase } from "@/lib/supabase/client";
import type { Feature, CarFeature, AddFeatureParams } from "./types";

export async function getFeaturesList(): Promise<Feature[]> {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function getDealerCarFeatures(carId: string): Promise<CarFeature[]> {
  const { data, error } = await supabase
    .from('dealer_car_features')
    .select(`
      id,
      car_id,
      feature:features(
        name,
        category
      )
    `)
    .eq('car_id', carId);

  if (error) throw error;
  return data.map(item => ({
    id: item.id,
    car_type: 'dealer_car',
    car_id: item.car_id,
    feature: item.feature.name,
    category: item.feature.category,
    created_at: item.created_at
  }));
}

export async function getUserCarFeatures(carId: string): Promise<CarFeature[]> {
  const { data, error } = await supabase
    .from('user_car_features')
    .select(`
      id,
      car_id,
      feature:features(
        name,
        category
      )
    `)
    .eq('car_id', carId);

  if (error) throw error;
  return data.map(item => ({
    id: item.id,
    car_type: 'user_car',
    car_id: item.car_id,
    feature: item.feature.name,
    category: item.feature.category,
    created_at: item.created_at
  }));
}

export async function addDealerCarFeature(carId: string, featureId: string) {
  const { data, error } = await supabase
    .from('dealer_car_features')
    .insert({ car_id: carId, feature_id: featureId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addUserCarFeature(carId: string, featureId: string) {
  const { data, error } = await supabase
    .from('user_car_features')
    .insert({ car_id: carId, feature_id: featureId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeDealerCarFeature(id: string) {
  const { error } = await supabase
    .from('dealer_car_features')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function removeUserCarFeature(id: string) {
  const { error } = await supabase
    .from('user_car_features')
    .delete()
    .eq('id', id);

  if (error) throw error;
}