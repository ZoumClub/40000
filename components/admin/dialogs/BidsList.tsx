"use client";

import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Bid {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  dealer?: {
    name: string;
    phone: string;
    whatsapp?: string;
  };
}

interface BidsListProps {
  bids: Bid[];
}

export function BidsList({ bids }: BidsListProps) {
  if (!bids?.length) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No bids yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div 
          key={bid.id}
          className="border rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{bid.dealer?.name || "Unknown Dealer"}</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(bid.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(bid.created_at)}
              </p>
            </div>
            <Badge
              variant={
                bid.status === "accepted" ? "success" :
                bid.status === "rejected" ? "destructive" :
                "secondary"
              }
            >
              {bid.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}