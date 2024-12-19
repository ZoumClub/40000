import { supabase } from './client';
import { uploadCarMedia } from './media';
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
        fuel_type: data.fuelType,
        transmission: data.transmission,
        body_type: data.bodyType,
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

    // 3. Upload media
    const uploadPromises = [];

    // Upload images
    if (data.images.length > 0) {
      uploadPromises.push(
        uploadCarMedia({
          carId: carData.id,
          files: data.images,
          type: 'image'
        })
      );
    }

    // Upload video if exists
    if (data.video) {
      uploadPromises.push(
        uploadCarMedia({
          carId: carData.id,
          files: [data.video],
          type: 'video'
        })
      );
    }

    await Promise.all(uploadPromises);

    return { success: true, carId: carData.id };
  } catch (error) {
    console.error('Error submitting car listing:', error);
    
    // If there's an error, attempt to clean up any uploaded media
    if ('carId' in error) {
      try {
        await deleteCarMedia(error.carId);
      } catch (cleanupError) {
        console.error('Error cleaning up media:', cleanupError);
      }
    }
    
    return { success: false, error };
  }
}

export async function deleteCarListing(carId: string) {
  try {
    // Delete media first
    await deleteCarMedia(carId);

    // Delete car record (this will cascade delete features due to foreign key constraint)
    const { error: deleteError } = await supabase
      .from('user_cars')
      .delete()
      .eq('id', carId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error('Error deleting car listing:', error);
    return { success: false, error };
  }
}