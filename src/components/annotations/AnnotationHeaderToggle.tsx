"use client";

import React from "react";
import { Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnotation } from "@/contexts/AnnotationContext";

export const AnnotationHeaderToggle: React.FC = () => {
  const { isAnnotationMode, toggleAnnotationMode, startGuidedTour } = useAnnotation();

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant={isAnnotationMode ? "default" : "outline"}
        size="sm"
        onClick={toggleAnnotationMode}
        className={`h-7 px-2.5 text-[11px] font-medium gap-1.5 transition-all cursor-pointer ${
          isAnnotationMode
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs border-blue-500"
            : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
        }`}
        title="Toggle interactive design annotations on/off"
      >
        <Sparkles className={`size-3.5 ${isAnnotationMode ? "text-white" : "text-blue-500"}`} />
        <span>Annotations: {isAnnotationMode ? "ON" : "OFF"}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={startGuidedTour}
        className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground gap-1 hidden md:flex cursor-pointer"
        title="Start 9-Key Guided Tour"
      >
        <Compass className="size-3.5 text-blue-500" />
        <span>Tour</span>
      </Button>
    </div>
  );
};
