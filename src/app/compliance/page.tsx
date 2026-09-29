"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  AlertTriangle,
  Play,
  CheckCircle2,
  FileCheck2,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { mockControls, ControlItem } from "@/data/mockData";

export default function CompliancePage() {
  const [controls, setControls] = useState<ControlItem[]>(mockControls);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartRenewal = (controlCode: string) => {
    showToast(`Triggering automated renewal workflow for control: ${controlCode}`);
  };

  const expiringSoon = controls.filter((c) => c.daysRemaining <= 30);
  const healthyControls = controls.filter((c) => c.daysRemaining > 30);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Continuous Controls Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational compliance tracking, effective dates, lifecycle windows, and automated recertification.
          </p>
        </div>
      </div>

      {/* SECTION 1: EXPIRING CONTROLS RADAR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-red-700 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Expiring Within 30-Day Renewal Window ({expiringSoon.length})
          </span>
          <span className="text-[11px] font-medium text-slate-500">Requires Recertification Sign-off</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {expiringSoon.map((ctrl) => {
            const isCritical = ctrl.daysRemaining <= 7;
            return (
              <div
                key={ctrl.id}
                className={`rounded-xl border p-4.5 bg-white shadow-xs transition-all flex flex-wrap items-center justify-between gap-4 ${
                  isCritical
                    ? "border-l-4 border-l-red-500 border-red-200"
                    : "border-l-4 border-l-amber-500 border-amber-200"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px]">
                      {ctrl.framework}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">{ctrl.code}</span>
                    <span className={`text-xs font-semibold ${isCritical ? "text-red-700" : "text-amber-700"}`}>
                      ● Expires in {ctrl.daysRemaining} days ({ctrl.expiresAt})
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{ctrl.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Owner: <strong>{ctrl.owner}</strong></span>
                    <span>•</span>
                    <span>Effective Since: {ctrl.effectiveFrom}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  className={`text-xs gap-1.5 ${
                    isCritical
                      ? "bg-red-600 hover:bg-red-700 text-white font-bold"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                  onClick={() => handleStartRenewal(ctrl.code)}
                >
                  <Play className="h-3 w-3 fill-current" /> Start Renewal Workflow
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: HEALTHY COMPLIANCE CONTROLS */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Healthy & Enforceable Controls ({healthyControls.length})
          </span>
          <span className="text-[11px] font-medium text-slate-400">Next review &gt; 30 days</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {healthyControls.map((ctrl) => (
            <div
              key={ctrl.id}
              className="rounded-xl border border-l-4 border-l-emerald-500 border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-mono font-semibold text-emerald-800">
                    {ctrl.framework}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">{ctrl.code}</span>
                  <span className="text-xs text-emerald-700 font-semibold">● Healthy ({ctrl.daysRemaining} days left)</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-700">{ctrl.name}</h4>
              </div>
              <span className="text-[11px] text-slate-500">
                Audited & Enforced
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
