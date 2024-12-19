import { supabase } from './client';
import { uploadMedia } from './storage';

interface MediaUploadParams {
  carId: string;
  files: File[];
  type: 'image' | 'video';
}

export async function uploadCarMedia({ carId, files, type }: MediaUploadParams) {
  try {
    const mediaPromises = files.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${carId}-${type}-${index}.${fileExt}`;
      const folder = type === 'image' ? 'car-images' : 'car-videos';

      const { url, path } = await uploadMedia(file, folder, fileName);

      const { error: mediaError } = await supabase
        .from('car_media')
        .insert({
          car_id: carId,
          media_type: type,
          url,
          path,
          position: index,
        });

      if (mediaError) throw mediaError;

      return { url, path };
    });

    return await Promise.all(mediaPromises);
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    throw error;
  }
}

export async function deleteCarMedia(carId: string) {
  try {
    // First get all media records for the car
    const { data: mediaRecords, error: fetchError } = await supabase
      .from('car_media')
      .select('path')
      .eq('car_id', carId);

    if (fetchError) throw fetchError;

    // Delete files from storage
    if (mediaRecords && mediaRecords.length > 0) {
      const paths = mediaRecords.map(record => record.path);
      await Promise.all(paths.map(path => deleteMedia(path)));
    }

    // Delete media records from database
    const { error: deleteError } = await supabase
      .from('car_media')
      .delete()
      .eq('car_id', carId);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Error deleting car media:', error);
    throw error;
  }
}