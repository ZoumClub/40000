"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function DeleteButton({ onClick, disabled }: DeleteButtonProps) {
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onClick}
      disabled={disabled}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}