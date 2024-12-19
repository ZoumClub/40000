"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealerCarsTab } from "@/components/dealer/DealerCarsTab";
import { UserCarsTab } from "@/components/dealer/UserCarsTab";
import { RecentActivity } from "@/components/dealer/RecentActivity";
import { useDealerAuth } from "@/lib/hooks/useDealerAuth";

export default function DealerDashboard() {
  const [activeTab, setActiveTab] = useState("my-cars");
  const { dealer } = useDealerAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
        {dealer && (
          <p className="text-muted-foreground mt-2">
            Welcome, {dealer.name}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-cars">My Cars</TabsTrigger>
              <TabsTrigger value="user-cars">User Cars</TabsTrigger>
            </TabsList>

            <TabsContent value="my-cars">
              <DealerCarsTab />
            </TabsContent>

            <TabsContent value="user-cars">
              <UserCarsTab />
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}