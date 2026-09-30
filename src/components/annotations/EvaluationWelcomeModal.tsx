"use client";

import React from "react";
import { Sparkles, Compass, ShieldCheck, ArrowRight, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnotation } from "@/contexts/AnnotationContext";

export const EvaluationWelcomeModal: React.FC = () => {
  const { isWelcomeModalOpen, dismissWelcomeModal, startGuidedTour, enablePinsOnly } = useAnnotation();

  if (!isWelcomeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-background/95 p-6 shadow-2xl space-y-5 text-foreground backdrop-blur-md">
        {/* Close Icon Button */}
        <button
          onClick={dismissWelcomeModal}
          className="absolute top-4 right-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Dismiss Welcome Modal"
        >
          <X className="size-4" />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold">
            <Sparkles className="size-3" />
            <span>Injani Systems Phase 2 Submission</span>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl flex items-center gap-2">
            Welcome, Injani Systems Evaluation Team!
          </h2>

          <p className="text-xs text-muted-foreground leading-relaxed">
            This prototype was engineered specifically to answer the <strong className="text-foreground">4 Key Challenge Questions</strong> set by Carolina Tjia—resolving the tension of a single operator wearing 4 hats across immediate 2-hour SLAs vs. 30-day compliance horizons.
          </p>
        </div>

        {/* 4 Keys Summary Preview */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
          <div className="font-semibold text-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Compass className="size-3.5 text-blue-500" />
            <span>Interactive Architecture Tour Highlights:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400">❶</span>
              <span>5 Intent Groups vs. 8 Flat Modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400">❷</span>
              <span>Sticky Urgent Bar (Fire Alarm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400">❸</span>
              <span>3-Tier Persona Customization</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-600 dark:text-blue-400">❹</span>
              <span>Slide-Over Batch Approvals</span>
            </div>
          </div>
        </div>

        {/* Action Choices */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={startGuidedTour}
            className="w-full h-10 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
          >
            <Compass className="size-4" />
            <span>Start Guided Challenge Tour (Recommended)</span>
            <ArrowRight className="size-3.5 ml-auto" />
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={enablePinsOnly}
              className="h-9 gap-1.5 text-xs font-medium border-border hover:bg-accent cursor-pointer"
            >
              <Eye className="size-3.5 text-muted-foreground" />
              <span>Enable Pins & Browse Freely</span>
            </Button>

            <Button
              variant="ghost"
              onClick={dismissWelcomeModal}
              className="h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <span>Explore Clean SaaS UI</span>
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-500" />
            <span>ISO27001 & SOX Ready Architecture</span>
          </span>
          <span className="font-mono">Candidate: Aris Winandi</span>
        </div>
      </div>
    </div>
  );
};
