"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (files: FileList | null) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onFileSelect, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(event);
      if (onFileSelect) onFileSelect(event.target.files);
    };

    return (
      <input
        type="file"
        className={cn(
          "file:bg-transparent file:border-0 file:bg-gray-100 file:mr-4 file:py-2 file:px-4",
          "file:rounded-full file:font-semibold file:text-sm file:text-gray-700",
          "hover:file:bg-gray-200 cursor-pointer",
          className
        )}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };