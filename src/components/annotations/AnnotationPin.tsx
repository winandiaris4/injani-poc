"use client";

import React from "react";
import { useAnnotation } from "@/contexts/AnnotationContext";
import { CHALLENGE_ANNOTATIONS } from "@/data/challengeAnnotations";

interface AnnotationPinProps {
  pinId: string;
  className?: string;
  label?: string;
}

export const AnnotationPin: React.FC<AnnotationPinProps> = ({
  pinId,
  className = "",
  label,
}) => {
  const { isAnnotationMode, activePinId, openPin } = useAnnotation();

  if (!isAnnotationMode) return null;

  const annotation = CHALLENGE_ANNOTATIONS.find((a) => a.id === pinId);
  if (!annotation) return null;

  const isActive = activePinId === pinId;
  const isTourActive = activePinId !== null;
  const isSubdued = isTourActive && !isActive;

  return (
    <div
      className={`relative inline-flex items-center group transition-all duration-200 ${
        isActive ? "z-40" : isSubdued ? "z-10 hover:z-30" : "z-20"
      } ${className}`}
    >
      {/* Active Pulse Radar Rings - ONLY rendered for the currently active key */}
      {isActive && (
        <>
          <span className="absolute -inset-1.5 rounded-full bg-blue-500/40 animate-ping opacity-75 pointer-events-none" />
          <span className="absolute -inset-0.5 rounded-full bg-blue-500/30 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Interactive Pin Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          openPin(pinId);
        }}
        title={
          isActive
            ? `Active Key ${annotation.stepNumber}: ${annotation.title} (Currently in focus)`
            : `Key ${annotation.stepNumber}: ${annotation.title} (Click to focus on this key)`
        }
        className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs transition-all duration-200 cursor-pointer ${
          isActive
            ? "bg-blue-600 text-white font-bold ring-2 ring-blue-400 ring-offset-2 ring-offset-background shadow-lg shadow-blue-500/35 scale-105"
            : isSubdued
            ? "bg-muted/70 hover:bg-muted text-muted-foreground/75 hover:text-foreground border border-border/70 opacity-35 hover:opacity-100 hover:scale-105 shadow-none"
            : "bg-blue-600/85 hover:bg-blue-600 text-white font-semibold shadow-xs hover:shadow-md hover:scale-105"
        }`}
      >
        <span
          className={`leading-none transition-all ${
            isActive ? "text-sm font-bold" : "text-xs font-semibold"
          }`}
        >
          {annotation.badgeSymbol}
        </span>

        {/* Label: Always visible when active or in free browse mode; hidden and revealed on hover when subdued */}
        {label ? (
          <span
            className={`text-[10px] uppercase tracking-wide font-sans font-semibold transition-all ${
              isSubdued ? "hidden group-hover:inline-block" : "inline-block"
            }`}
          >
            {label}
          </span>
        ) : (
          <span
            className={`text-[10px] uppercase tracking-wide font-sans font-semibold transition-all ${
              isSubdued
                ? "hidden group-hover:inline-block"
                : "hidden sm:inline-block"
            }`}
          >
            Key {annotation.stepNumber}
          </span>
        )}
      </button>
    </div>
  );
};
