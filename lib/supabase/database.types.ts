export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_cars: {
        Row: {
          id: string
          seller_name: string
          pin_code: string
          brand: string
          model: string
          year: number
          price: number
          mileage_range: string
          previous_owners: number
          fuel_type: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid'
          transmission: 'Automatic' | 'Manual' | 'Semi-Automatic' | 'CVT'
          body_type: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon' | 'Van' | 'Truck'
          exterior_color: string
          interior_color: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_name: string
          pin_code: string
          brand: string
          model: string
          year: number
          price: number
          mileage_range: string
          previous_owners?: number
          fuel_type: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid'
          transmission: 'Automatic' | 'Manual' | 'Semi-Automatic' | 'CVT'
          body_type: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon' | 'Van' | 'Truck'
          exterior_color: string
          interior_color: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_name?: string
          pin_code?: string
          brand?: string
          model?: string
          year?: number
          price?: number
          mileage_range?: string
          previous_owners?: number
          fuel_type?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid'
          transmission?: 'Automatic' | 'Manual' | 'Semi-Automatic' | 'CVT'
          body_type?: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon' | 'Van' | 'Truck'
          exterior_color?: string
          interior_color?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      car_features: {
        Row: {
          car_id: string
          feature: string
        }
        Insert: {
          car_id: string
          feature: string
        }
        Update: {
          car_id?: string
          feature?: string
        }
      }
      car_media: {
        Row: {
          id: string
          car_id: string
          media_type: 'image' | 'video'
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          car_id: string
          media_type: 'image' | 'video'
          url: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          media_type?: 'image' | 'video'
          url?: string
          position?: number
          created_at?: string
        }
      }
    }
  }
}