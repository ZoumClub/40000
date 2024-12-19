import { supabase } from './client';
import { CarFormData } from '@/types/sellCar';

export async function submitCarListing(data: CarFormData) {
  try {
    // 1. Insert car data
    const { data: carData, error: carError } = await supabase
      .from('user_cars')
      .insert({
        seller_name: data.name,
        pin_code: data.pinCode,
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage_range: data.mileage,
        previous_owners: data.previousOwners,
        fuel_type: data.fuelType as any,
        transmission: data.transmission as any,
        body_type: data.bodyType as any,
        exterior_color: data.exteriorColor,
        interior_color: data.interiorColor,
      })
      .select()
      .single();

    if (carError) throw carError;

    // 2. Insert features
    if (data.features.length > 0) {
      const { error: featuresError } = await supabase
        .from('car_features')
        .insert(
          data.features.map(feature => ({
            car_id: carData.id,
            feature,
          }))
        );

      if (featuresError) throw featuresError;
    }

    // 3. Upload and insert media
    const mediaPromises = [];

    // Upload images
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${carData.id}-image-${i}.${fileExt}`;
      const filePath = `car-images/${fileName}`;

      mediaPromises.push(
        supabase.storage
          .from('car-media')
          .upload(filePath, file)
          .then(async ({ data: uploadData, error: uploadError }) => {
            if (uploadError) throw uploadError;

            const { error: mediaError } = await supabase
              .from('car_media')
              .insert({
                car_id: carData.id,
                media_type: 'image',
                url: filePath,
                position: i,
              });

            if (mediaError) throw mediaError;
          })
      );
    }

    // Upload video if exists
    if (data.video) {
      const fileExt = data.video.name.split('.').pop();
      const fileName = `${carData.id}-video.${fileExt}`;
      const filePath = `car-videos/${fileName}`;

      mediaPromises.push(
        supabase.storage
          .from('car-media')
          .upload(filePath, data.video)
          .then(async ({ data: uploadData, error: uploadError }) => {
            if (uploadError) throw uploadError;

            const { error: mediaError } = await supabase
              .from('car_media')
              .insert({
                car_id: carData.id,
                media_type: 'video',
                url: filePath,
                position: 0,
              });

            if (mediaError) throw mediaError;
          })
      );
    }

    await Promise.all(mediaPromises);

    return { success: true, carId: carData.id };
  } catch (error) {
    console.error('Error submitting car listing:', error);
    return { success: false, error };
  }
}

export async function fetchCarListings() {
  const { data, error } = await supabase
    .from('user_cars')
    .select(`
      *,
      car_features (feature),
      car_media (*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchCarsByBrand(brand: string) {
  const { data, error } = await supabase
    .from('user_cars')
    .select(`
      *,
      car_features (feature),
      car_media (*)
    `)
    .eq('status', 'approved')
    .eq('brand', brand)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}