import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import { Dealer } from "@/types/car";

interface DealerContactProps {
  dealer?: Dealer; // Make dealer optional
}

export function DealerContact({ dealer }: DealerContactProps) {
  const safeDealer = dealer || { name: "Admin", phone: "+212762744970", whatsapp: "+447778483615" };

  const handleCall = () => {
    if (safeDealer.phone) {
      window.location.href = `tel:${safeDealer.phone}`;
    } else {
      alert("Phone number is not available.");
    }
  };

  const handleWhatsApp = () => {
    if (safeDealer.whatsapp) {
      window.location.href = `https://wa.me/${safeDealer.whatsapp}`;
    } else {
      alert("WhatsApp number is not available.");
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">Listed by:</p>
        <p className="font-medium">{safeDealer.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          onClick={handleCall}
          className="flex items-center gap-2"
        >
          <Phone className="h-4 w-4" />
          Call
        </Button>
        <Button 
          onClick={handleWhatsApp}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}