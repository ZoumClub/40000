"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/sections/HeroSection';

// Lazy load sections below the fold
const BrowseSection = dynamic(() => import('@/components/sections/BrowseSection'), {
  loading: () => <div className="h-[800px] bg-gray-100 animate-pulse" />
});

const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse" />
});

const AccessoriesSection = dynamic(() => import('@/components/sections/AccessoriesSection'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse" />
});

const NewsSection = dynamic(() => import('@/components/sections/NewsSection'), {
  loading: () => <div className="h-[400px] bg-gray-100 animate-pulse" />
});

const WhyChooseUs = dynamic(() => import('@/components/sections/WhyChooseUs'), {
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse" />
});

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <BrowseSection 
        selectedBrand={selectedBrand}
        onBrandSelect={setSelectedBrand}
      />
      <ServicesSection />
      <AccessoriesSection />
      <NewsSection />
      <WhyChooseUs />
    </main>
  );
}