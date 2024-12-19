"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const handleSellCar = () => {
    router.push("/sell");
  };

  return (
    <section className="relative h-[80vh] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find Your Perfect Car
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover the best deals on new and used cars. Your dream car is just a click away.
          </p>
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white border-2 border-green-400 shadow-lg"
            onClick={handleSellCar}
          >
            <Car className="mr-2 h-5 w-5" />
            Sell Your Car
          </Button>
        </div>
      </div>
    </section>
  );
}