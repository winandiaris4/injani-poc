"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CHALLENGE_ANNOTATIONS, ChallengeAnnotation } from "@/data/challengeAnnotations";

interface AnnotationContextType {
  isAnnotationMode: boolean;
  toggleAnnotationMode: () => void;
  setIsAnnotationMode: (val: boolean) => void;
  activePinId: string | null;
  activeAnnotation: ChallengeAnnotation | null;
  currentStepIndex: number;
  openPin: (id: string) => void;
  closePin: () => void;
  nextStep: () => void;
  prevStep: () => void;
  isWelcomeModalOpen: boolean;
  dismissWelcomeModal: () => void;
  startGuidedTour: () => void;
  enablePinsOnly: () => void;
  executeAnnotationAction: (annotation: ChallengeAnnotation) => void;
  onActionTrigger?: (actionType: string, payload?: string) => void;
  setOnActionTrigger: (callback: (actionType: string, payload?: string) => void) => void;
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

const trackEvent = (event: string) => {
  try {
    if (typeof window !== "undefined") {
      fetch(`/api/track?event=${encodeURIComponent(event)}`, { method: "GET", keepalive: true }).catch(() => {});
    }
  } catch {}
};

export const AnnotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isAnnotationMode, setIsAnnotationMode] = useState<boolean>(false);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(false);
  const [actionCallback, setActionCallback] = useState<((actionType: string, payload?: string) => void) | undefined>(undefined);

  // Initialize and check Welcome Modal timer (~1000ms delay on first load)
  useEffect(() => {
    if (pathname === "/login") return;
    try {
      const hasDismissed = sessionStorage.getItem("injani_eval_welcome_dismissed");
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          setIsWelcomeModalOpen(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [pathname]);

  const toggleAnnotationMode = () => {
    setIsAnnotationMode((prev) => {
      const next = !prev;
      if (!next) {
        setActivePinId(null);
      }
      return next;
    });
  };

  const openPin = (id: string) => {
    setIsAnnotationMode(true);
    setActivePinId(id);
    trackEvent(`Tour Milestone: ${id}`);
    const ann = CHALLENGE_ANNOTATIONS.find((a) => a.id === id);
    if (ann?.targetPage && pathname !== ann.targetPage) {
      router.push(ann.targetPage);
    }
  };

  const closePin = () => {
    setActivePinId(null);
  };

  const currentStepIndex = CHALLENGE_ANNOTATIONS.findIndex((a) => a.id === activePinId);
  const activeAnnotation = currentStepIndex >= 0 ? CHALLENGE_ANNOTATIONS[currentStepIndex] : null;

  const nextStep = () => {
    setIsAnnotationMode(true);
    setActivePinId((prevId) => {
      const idx = CHALLENGE_ANNOTATIONS.findIndex((a) => a.id === prevId);
      const nextIdx = idx < 0 ? 0 : (idx + 1) % CHALLENGE_ANNOTATIONS.length;
      const nextAnn = CHALLENGE_ANNOTATIONS[nextIdx];
      if (nextAnn.targetPage && pathname !== nextAnn.targetPage) {
        router.push(nextAnn.targetPage);
      }
      return nextAnn.id;
    });
  };

  const prevStep = () => {
    setIsAnnotationMode(true);
    setActivePinId((prevId) => {
      const idx = CHALLENGE_ANNOTATIONS.findIndex((a) => a.id === prevId);
      const prevIdx = idx <= 0 ? CHALLENGE_ANNOTATIONS.length - 1 : idx - 1;
      const prevAnn = CHALLENGE_ANNOTATIONS[prevIdx];
      if (prevAnn.targetPage && pathname !== prevAnn.targetPage) {
        router.push(prevAnn.targetPage);
      }
      return prevAnn.id;
    });
  };

  const dismissWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
    try {
      sessionStorage.setItem("injani_eval_welcome_dismissed", "true");
    } catch {}
  };

  const startGuidedTour = () => {
    trackEvent("Started Guided Challenge Tour (Key 1)");
    dismissWelcomeModal();
    setIsAnnotationMode(true);
    openPin(CHALLENGE_ANNOTATIONS[0].id);
  };

  const enablePinsOnly = () => {
    trackEvent("Enabled Pins Only (Free Browse)");
    dismissWelcomeModal();
    setIsAnnotationMode(true);
    setActivePinId(null);
  };

  const listenersRef = React.useRef<Set<(actionType: string, payload?: string) => void>>(new Set());

  const setOnActionTrigger = React.useCallback((callback: (actionType: string, payload?: string) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const executeAnnotationAction = (annotation: ChallengeAnnotation) => {
    trackEvent(`Action Executed: ${annotation.actionLabel || annotation.id}`);
    listenersRef.current.forEach((cb) => {
      try {
        cb(annotation.actionType || "", annotation.actionPayload);
      } catch (e) {
        console.error("Annotation action error:", e);
      }
    });
    if (annotation.actionType === "navigate" && annotation.actionPayload) {
      router.push(annotation.actionPayload);
    }
  };

  return (
    <AnnotationContext.Provider
      value={{
        isAnnotationMode,
        toggleAnnotationMode,
        setIsAnnotationMode,
        activePinId,
        activeAnnotation,
        currentStepIndex,
        openPin,
        closePin,
        nextStep,
        prevStep,
        isWelcomeModalOpen,
        dismissWelcomeModal,
        startGuidedTour,
        enablePinsOnly,
        executeAnnotationAction,
        onActionTrigger: actionCallback,
        setOnActionTrigger,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};

export const useAnnotation = () => {
  const context = useContext(AnnotationContext);
  if (!context) {
    throw new Error("useAnnotation must be used within an AnnotationProvider");
  }
  return context;
};
