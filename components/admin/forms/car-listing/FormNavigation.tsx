"use client";

import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  isFirstTab: boolean;
  isLastTab: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function FormNavigation({
  isFirstTab,
  isLastTab,
  isSubmitting,
  onPrevious,
  onNext,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstTab || isSubmitting}
      >
        Previous
      </Button>

      {isLastTab ? (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
        >
          Next
        </Button>
      )}
    </div>
  );
}