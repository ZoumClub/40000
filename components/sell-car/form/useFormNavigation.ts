"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { SellCarFormData } from "@/lib/validations/sellCar";
import { FORM_TABS, FormTab } from "./constants";

// Validation fields for each tab
const TAB_FIELDS: Record<FormTab, (keyof SellCarFormData)[]> = {
  contact: ["name", "pinCode"],
  car: ["brand", "model", "year", "price", "mileage"],
  specs: ["fuelType", "transmission", "bodyType", "exteriorColor", "interiorColor"],
  features: ["features"],
  media: ["images"],
};

export function useFormNavigation(form: UseFormReturn<SellCarFormData>) {
  const [currentTab, setCurrentTab] = useState<FormTab>("contact");

  const currentTabIndex = FORM_TABS.findIndex(tab => tab.id === currentTab);
  const isLastTab = currentTabIndex === FORM_TABS.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const validateTabFields = async (tabId: FormTab) => {
    const fields = TAB_FIELDS[tabId];
    const result = await form.trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateTabFields(currentTab);
    if (isValid && !isLastTab) {
      setCurrentTab(FORM_TABS[currentTabIndex + 1].id);
      return true;
    }
    return false;
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      setCurrentTab(FORM_TABS[currentTabIndex - 1].id);
      return true;
    }
    return false;
  };

  const handleTabChange = async (tab: FormTab) => {
    // Only validate when moving forward
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