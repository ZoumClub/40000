import { supabase } from "@/lib/supabase/client";
import type { DealerCar } from "@/types/dealerCar";

export async function fetchDealerCars() {
  const { data, error } = await supabase
    .from("dealer_cars")
    .select(`
      *,
      dealer:dealers(name, phone, whatsapp),
      features:dealer_car_features(
        feature:features(
          name,
          category
        )
      ),
      media:dealer_car_media(*)
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function transformDealerCar(car: any): Promise<DealerCar> {
  return {
    ...car,
    features: car.features?.map((f: any) => f.feature.name) || [],
    images: car.media
      ?.filter((m: any) => m.media_type === 'image')
      ?.sort((a: any, b: any) => a.position - b.position)
      ?.map((m: any) => m.url) || [],
    video: car.media?.find((m: any) => m.media_type === 'video')?.url,
    dealer: car.dealer
  };
}