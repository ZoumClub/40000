"use client";

import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

interface VisibilityToggleProps {
  isVisible: boolean;
  onToggle: (isVisible: boolean) => void;
  disabled?: boolean;
}

export function VisibilityToggle({ isVisible, onToggle, disabled }: VisibilityToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isVisible}
        onCheckedChange={onToggle}
        disabled={disabled}
      />
      {isVisible ? (
        <Eye className="h-4 w-4 text-green-500" />
      ) : (
        <EyeOff className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );
}