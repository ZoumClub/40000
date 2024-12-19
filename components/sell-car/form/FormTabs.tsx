"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarInfo } from "@/components/forms/sell-car/CarInfo";
import { TechnicalSpecs } from "@/components/forms/sell-car/TechnicalSpecs";
import { FeaturesSection } from "@/components/forms/sell-car/FeaturesSection";
import { MediaUpload } from "@/components/forms/sell-car/MediaUpload";
import { ContactInfo } from "@/components/forms/sell-car/ContactInfo";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";
import { FORM_TABS, FormTab } from "./constants";

interface FormTabsProps {
  currentTab: FormTab;
  form: UseFormReturn<SellCarFormData>;
  onTabChange: (value: FormTab) => Promise<boolean>;
}

export function FormTabs({ currentTab, form, onTabChange }: FormTabsProps) {
  const handleTabChange = async (value: string) => {
    const success = await onTabChange(value as FormTab);
    if (!success) {
      // If validation fails, prevent tab change
      return;
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-5">
        {FORM_TABS.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="contact">
          <ContactInfo form={form} />
        </TabsContent>

        <TabsContent value="car">
          <CarInfo form={form} />
        </TabsContent>

        <TabsContent value="specs">
          <TechnicalSpecs form={form} />
        </TabsContent>

        <TabsContent value="features">
          <FeaturesSection form={form} />
        </TabsContent>

        <TabsContent value="media">
          <MediaUpload form={form} />
        </TabsContent>
      </div>
    </Tabs>
  );
}