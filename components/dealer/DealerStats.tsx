"use client";

import { Card } from "@/components/ui/card";
import { useDealerStats } from "@/lib/hooks/useDealerStats";
import { formatPrice } from "@/lib/utils";
import { Car, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export function DealerStats() {
  const { stats, isLoading } = useDealerStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: <Car className="h-8 w-8 text-blue-500" />,
      trend: stats.listingsTrend,
    },
    {
      title: "Cars Sold",
      value: stats.carsSold,
      icon: <ShoppingBag className="h-8 w-8 text-green-500" />,
      trend: stats.salesTrend,
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      trend: stats.revenueTrend,
    },
    {
      title: "Active Bids",
      value: stats.activeBids,
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      trend: stats.bidsTrend,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-start justify-between">
            {stat.icon}
            <span className={`text-sm ${stat.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stat.trend > 0 ? '+' : ''}{stat.trend}%
            </span>
          </div>
          <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
          <p className="text-sm text-muted-foreground">{stat.title}</p>
        </Card>
      ))}
    </div>
  );
}