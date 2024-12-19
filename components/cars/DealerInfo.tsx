import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import type { Dealer } from "@/types/dealer";

interface DealerInfoProps {
  dealer?: Dealer;
}

export function DealerInfo({ dealer }: DealerInfoProps) {
  if (!dealer) return null;

  const handleCall = () => {
    window.location.href = `tel:${dealer.phone}`;
  };

  const handleWhatsApp = () => {
    if (dealer.whatsapp) {
      window.location.href = `https://wa.me/${dealer.whatsapp}`;
    }
  };

  return (
    <div className="w-full border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Listed by:</p>
        <p className="font-medium">{dealer.name}</p>
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
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
          disabled={!dealer.whatsapp}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}