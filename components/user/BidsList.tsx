"use client";

import { formatPrice, formatDate } from "@/lib/utils";
import type { UserCarBid } from "@/lib/modules/user-cars/types";

interface BidsListProps {
  bids: UserCarBid[];
}

export function BidsList({ bids }: BidsListProps) {
  if (!bids.length) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No bids yet</p>
      </div>
    );
  }

  // Sort bids by amount in descending order
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-4">
      {sortedBids.map((bid) => (
        <div 
          key={bid.id}
          className="border rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{bid.dealer?.name}</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(bid.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(bid.created_at)}
              </p>
            </div>
            <div className="space-y-2">
              {bid.dealer?.phone && (
                <p className="text-sm text-muted-foreground">
                  {bid.dealer.phone}
                </p>
              )}
              {bid.dealer?.whatsapp && (
                <p className="text-sm text-muted-foreground">
                  WhatsApp: {bid.dealer.whatsapp}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}