"use client";

import { useServices } from "@/lib/hooks/useServices";
import { ServiceCard } from "@/components/services/ServiceCard";

export default function ServicesSection() {
  const { services, isLoading } = useServices();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!services.length) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}