"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SellCarHeader } from "./SellCarHeader";
import { SellCarContent } from "./SellCarContent";
import { SellCarActions } from "./SellCarActions";
import { SellCarForm } from "./SellCarForm";

export function SellCarCard() {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <>
      <Card className="max-w-lg w-full mx-auto p-6 relative">
        <SellCarHeader onClose={handleClose} />
        <SellCarContent />
        <SellCarActions onSellCar={() => setShowForm(true)} />
      </Card>

      <SellCarForm 
        open={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </>
  );
}