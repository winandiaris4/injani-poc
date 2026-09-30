"use client";

import React from "react";
import { useAnnotation } from "@/contexts/AnnotationContext";
import { CHALLENGE_ANNOTATIONS } from "@/data/challengeAnnotations";

interface AnnotationPinProps {
  pinId: string; // "key-1" | "key-2" | "key-3" | "key-4" | "key-5"
  className?: string;
  label?: string;
}

export const AnnotationPin: React.FC<AnnotationPinProps> = ({ pinId, className = "", label }) => {
  const { isAnnotationMode, activePinId, openPin } = useAnnotation();

  if (!isAnnotationMode) return null;

  const annotation = CHALLENGE_ANNOTATIONS.find((a) => a.id === pinId);
  if (!annotation) return null;

  const isActive = activePinId === pinId;

  return (
    <div className={`relative inline-flex items-center group z-30 ${className}`}>
      {/* Outer Pulse Ping Effect */}
      <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping opacity-75 pointer-events-none" />

      {/* Interactive Pin Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          openPin(pinId);
        }}
        title={`Key ${annotation.stepNumber}: ${annotation.title} (Click to inspect design rationale)`}
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs font-bold transition-all shadow-md cursor-pointer ${
          isActive
            ? "bg-blue-600 text-white ring-2 ring-blue-400 scale-105"
            : "bg-blue-600/90 text-white hover:bg-blue-600 hover:scale-105"
        }`}
      >
        <span className="text-sm leading-none">{annotation.badgeSymbol}</span>
        {label ? (
          <span className="text-[10px] uppercase tracking-wide font-sans font-semibold">
            {label}
          </span>
        ) : (
          <span className="hidden sm:inline text-[10px] uppercase tracking-wide font-sans font-semibold">
            Key {annotation.stepNumber}
          </span>
        )}
      </button>
    </div>
  );
};
