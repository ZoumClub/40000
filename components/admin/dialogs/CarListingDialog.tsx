"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dealerCarSchema } from "@/lib/validations/dealerCar";
import { DealerCar } from "@/types/dealerCar";
import { MediaSection } from "../forms/car-listing/MediaSection";
import { BasicInfo } from "../forms/car-listing/BasicInfo";
import { TechnicalSpecs } from "../forms/car-listing/TechnicalSpecs";
import { Features } from "../forms/car-listing/Features";
import { DealerInfo } from "../forms/car-listing/DealerInfo";
import { useCarForm } from "@/lib/hooks/useCarForm";
import { useCarFormSubmit } from "@/lib/hooks/useCarFormSubmit";
import { useCarFormNavigation } from "@/lib/hooks/useCarFormNavigation";
import { FormNavigation } from "../forms/car-listing/FormNavigation";

interface CarListingDialogProps {
  open: boolean;
  onClose: () => void;
  car?: DealerCar | null;
}

export function CarListingDialog({ open, onClose, car }: CarListingDialogProps) {
  const form = useCarForm(car);
  const { isSubmitting, handleSubmit } = useCarFormSubmit({ car, onSuccess: onClose });
  const {
    currentTab,
    isLastTab,
    isFirstTab,
    handleNext,
    handlePrevious,
    handleTabChange,
  } = useCarFormNavigation(form);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {car ? "Edit Car Listing" : "Add New Car Listing"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="dealer">Dealer</TabsTrigger>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="specs">Specs</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="dealer">
                  <DealerInfo form={form} />
                </TabsContent>

                <TabsContent value="basic">
                  <BasicInfo form={form} />
                </TabsContent>

                <TabsContent value="specs">
                  <TechnicalSpecs form={form} />
                </TabsContent>

                <TabsContent value="features">
                  <Features form={form} />
                </TabsContent>

                <TabsContent value="media">
                  <MediaSection form={form} />
                </TabsContent>
              </div>
            </Tabs>

            <FormNavigation
              isFirstTab={isFirstTab}
              isLastTab={isLastTab}
              isSubmitting={isSubmitting}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}