import { supabase } from './client';

interface UploadResult {
  url: string;
  path: string;
}

export async function uploadMedia(
  file: File, 
  folder: string, 
  fileName: string
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from('car-media')
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('car-media')
      .getPublicUrl(`${folder}/${fileName}`);

    return { 
      url: publicUrl, 
      path: `${folder}/${fileName}` 
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteMedia(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('car-media')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}