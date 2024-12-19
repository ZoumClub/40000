"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FORM_TABS, FormTab } from "@/lib/constants/carForm";
import type { DealerCarFormData } from "@/lib/validations/dealerCar";

// Validation fields for each tab
const TAB_FIELDS: Record<FormTab, (keyof DealerCarFormData)[]> = {
  dealer: ["dealer_id"],
  basic: ["brand", "model", "year", "price", "type"],
  specs: [
    "mileage_range",
    "fuel_type",
    "transmission",
    "body_type",
    "exterior_color",
    "interior_color"
  ],
  features: ["features"],
  media: ["images"]
};

export function useCarFormNavigation(form: UseFormReturn<DealerCarFormData>) {
  const [currentTab, setCurrentTab] = useState<FormTab>("dealer");

  const currentTabIndex = FORM_TABS.findIndex(tab => tab.id === currentTab);
  const isLastTab = currentTabIndex === FORM_TABS.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const validateTabFields = async (tabId: FormTab) => {
    const fields = TAB_FIELDS[tabId];
    return await form.trigger(fields);
  };

  const handleNext = async () => {
    const isValid = await validateTabFields(currentTab);
    if (isValid && !isLastTab) {
      setCurrentTab(FORM_TABS[currentTabIndex + 1].id as FormTab);
      return true;
    }
    return false;
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      setCurrentTab(FORM_TABS[currentTabIndex - 1].id as FormTab);
      return true;
    }
    return false;
  };

  const handleTabChange = async (tab: FormTab) => {
    const newTabIndex = FORM_TABS.findIndex(t => t.id === tab);
    if (newTabIndex > currentTabIndex) {
      const isValid = await validateTabFields(currentTab);
      if (!isValid) return false;
    }
    setCurrentTab(tab);
    return true;
  };

  return {
    currentTab,
    isLastTab,
    isFirstTab,
    handleNext,
    handlePrevious,
    handleTabChange,
  };
}