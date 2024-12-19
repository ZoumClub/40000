"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DealerCarsTab } from "@/components/admin/DealerCarsTab";
import { ServicesTab } from "@/components/admin/ServicesTab";
import { AccessoriesTab } from "@/components/admin/AccessoriesTab";
import { NewsTab } from "@/components/admin/NewsTab";
import { UserListingsTab } from "@/components/admin/UserListingsTab";
import { BrandsTab } from "@/components/admin/BrandsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("cars");

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="cars">Car Listings</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="user-listings">User Listings</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="cars">
          <DealerCarsTab />
        </TabsContent>

        <TabsContent value="brands">
          <BrandsTab />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="accessories">
          <AccessoriesTab />
        </TabsContent>
        
        <TabsContent value="user-listings">
          <UserListingsTab />
        </TabsContent>

        <TabsContent value="news">
          <NewsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}