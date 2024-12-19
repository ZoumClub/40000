"use client";

import { useRecentActivity } from "@/lib/hooks/useRecentActivity";
import { Card } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/utils";
import { Car, DollarSign, MessageSquare } from "lucide-react";

export function RecentActivity() {
  const { activities, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case "bid":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Car className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-sm">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {activity.amount && (
                  <span className="text-sm font-medium text-green-600">
                    {formatPrice(activity.amount)}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDate(activity.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}