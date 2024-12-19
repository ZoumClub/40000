"use client";

export interface Feature {
  id: string;
  name: string;
  category?: string;
  created_at: string;
}

export interface CreateFeatureData {
  name: string;
  category?: string;
}

export interface UpdateFeatureData extends Partial<CreateFeatureData> {
  id: string;
}