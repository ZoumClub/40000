import { supabase } from "@/lib/supabase/client";

interface AddFeatureParams {
  carId: string;
  carType: 'user_car' | 'dealer_car';
  feature: string;
}

export async function addCarFeature({ carId, carType, feature }: AddFeatureParams) {
  const { data, error } = await supabase
    .from('car_features')
    .insert({
      car_id: carId,
      car_type: carType,
      feature
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeCarFeature(featureId: string) {
  const { error } = await supabase
    .from('car_features')
    .delete()
    .eq('id', featureId);

  if (error) throw error;
}

export async function getCarFeatures(carId: string, carType: 'user_car' | 'dealer_car') {
  const { data, error } = await supabase
    .from('car_features')
    .select('feature')
    .eq('car_id', carId)
    .eq('car_type', carType);

  if (error) throw error;
  return data.map(f => f.feature);
}