"use client";

import React from "react";
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  X,
  Zap,
  CheckCircle2,
  AlertOctagon,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnotation } from "@/contexts/AnnotationContext";
import { CHALLENGE_ANNOTATIONS } from "@/data/challengeAnnotations";

export const AnnotationTourCard: React.FC = () => {
  const {
    activeAnnotation,
    closePin,
    nextStep,
    prevStep,
    openPin,
    executeAnnotationAction,
  } = useAnnotation();

  if (!activeAnnotation) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-[520px] rounded-2xl border border-blue-500/30 bg-background/95 p-5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 space-y-4 text-foreground">
      {/* Top Bar: Stepper Badge & Close */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-full bg-blue-600 text-white font-mono text-xs font-bold shadow-xs">
            {activeAnnotation.badgeSymbol}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                Key {activeAnnotation.stepNumber} of 5
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs font-semibold text-foreground">
                {activeAnnotation.category}
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground leading-tight">
              {activeAnnotation.title}
            </h3>
          </div>
        </div>

        <button
          onClick={closePin}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          title="Close Tour Card"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Official Prompt Quote Box */}
      <div className="rounded-lg border border-border/50 bg-muted/40 p-2.5 space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-wide text-muted-foreground font-semibold flex items-center gap-1">
          <Compass className="size-3 text-blue-500" />
          Official Challenge Prompt:
        </span>
        <p className="text-[11px] italic text-foreground/90 leading-snug">
          {activeAnnotation.officialPrompt}
        </p>
      </div>

      {/* Rationale Content Sections */}
      <div className="space-y-2.5 text-xs max-h-[260px] overflow-y-auto pr-1">
        {/* Decision */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
            <CheckCircle2 className="size-3 text-emerald-500" />
            <span>Design Decision:</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
            {activeAnnotation.designDecision}
          </p>
        </div>

        {/* Psychological Rationale */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
            <Sparkles className="size-3 text-blue-500" />
            <span>Psychological & Architectural Rationale:</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
            {activeAnnotation.psychologicalRationale}
          </p>
        </div>

        {/* Rejected Alternative */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
            <AlertOctagon className="size-3 text-rose-500" />
            <span>Rejected Alternative:</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed pl-4.5">
            {activeAnnotation.rejectedAlternative}
          </p>
        </div>
      </div>

      {/* Interactive Live Action Button (if available) */}
      {activeAnnotation.actionLabel && (
        <div className="pt-1">
          <Button
            size="sm"
            onClick={() => executeAnnotationAction(activeAnnotation)}
            className="w-full h-8 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs cursor-pointer"
          >
            <Zap className="size-3.5 fill-white text-white" />
            <span>{activeAnnotation.actionLabel}</span>
          </Button>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
        {/* Stepper Dots */}
        <div className="flex items-center gap-1">
          {CHALLENGE_ANNOTATIONS.map((ann) => (
            <button
              key={ann.id}
              onClick={() => openPin(ann.id)}
              className={`size-2 rounded-full transition-all cursor-pointer ${
                ann.id === activeAnnotation.id
                  ? "bg-blue-600 w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              title={`Jump to Key ${ann.stepNumber}`}
            />
          ))}
        </div>

        {/* Reference & Prev/Next Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline mr-1">
            {activeAnnotation.defenseDocRef}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            className="h-7 px-2 text-xs border-border cursor-pointer"
            title="Previous Key"
          >
            <ArrowLeft className="size-3" />
          </Button>

          <Button
            size="sm"
            onClick={nextStep}
            className="h-7 px-2.5 text-xs bg-foreground text-background hover:bg-foreground/90 gap-1 cursor-pointer font-medium"
            title="Next Key"
          >
            <span>Next</span>
            <ArrowRight className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
