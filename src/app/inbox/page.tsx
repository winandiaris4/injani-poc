"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserPlus,
  HelpCircle,
  Paperclip,
  MessageSquare,
  History,
  ArrowRight,
  Filter,
  Check,
  ChevronDown,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { initialApprovals, ApprovalItem } from "@/data/mockData";

export default function InboxPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(initialApprovals[0] || null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "attachments" | "comments" | "history">("details");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = (id: string, actionType: "approved" | "rejected" | "delegated") => {
    const currentIndex = approvals.findIndex((a) => a.id === id);
    const updated = approvals.filter((a) => a.id !== id);
    setApprovals(updated);

    showToast(`Request ${id} ${actionType === "approved" ? "Approved ✓" : actionType === "rejected" ? "Rejected ✕" : "Delegated ↗"}`);

    // Auto-advance to next request (Batch Processing Mode)
    if (updated.length > 0) {
      const nextItem = updated[currentIndex] || updated[0];
      setSelectedApproval(nextItem);
    } else {
      setSelectedApproval(null);
      setIsDrawerOpen(false);
    }
  };

  const filteredApprovals = approvals.filter((a) => {
    if (filterPriority === "ALL") return true;
    return a.priority === filterPriority;
  });

  const overdueList = filteredApprovals.filter((a) => a.isOverdue);
  const dueTodayList = filteredApprovals.filter((a) => a.status === "due_today");
  const normalList = filteredApprovals.filter((a) => a.status === "pending");

  return (
    <div className="relative max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Inbox / Pending Approvals
            <span className="ml-1 font-bold">
              {approvals.length} pending
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid triage of multi-tier operational sign-offs without context loss.
          </p>
        </div>

        {/* Inline Filter Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {["ALL", "P1", "P2", "P3"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterPriority(lvl)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                filterPriority === lvl
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Context Preserving Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Approvals Queue List */}
        <div className="lg:col-span-7 space-y-6">
          {/* Overdue Section */}
          {overdueList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-red-700 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  Overdue SLA Breaches ({overdueList.length})
                </span>
                <span className="text-[11px] font-medium text-slate-500">Requires Immediate Escalation</span>
              </div>

              <div className="space-y-2.5">
                {overdueList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedApproval(item);
                      setIsDrawerOpen(true);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all bg-white hover:border-indigo-400 ${
                      selectedApproval?.id === item.id
                        ? "border-red-500 ring-2 ring-red-400/20 shadow-sm"
                        : "border-red-200/80 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px]">
                            {item.priority}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{item.id}</span>
                          <span className="text-[11px] font-semibold text-red-600">● {item.slaCountdown}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                          <span>Requester: <strong className="text-slate-700">{item.requester.name}</strong> ({item.requester.department})</span>
                          {item.amount && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-slate-800">{item.amount}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 text-xs gap-1 border-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApproval(item);
                          setIsDrawerOpen(true);
                        }}
                      >
                        Inspect Drawer <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due Today Section */}
          {dueTodayList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 uppercase tracking-wider">
                <span>Due Today (&lt; 24h Remaining) ({dueTodayList.length})</span>
              </div>

              <div className="space-y-2.5">
                {dueTodayList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedApproval(item);
                      setIsDrawerOpen(true);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all bg-white hover:border-indigo-400 ${
                      selectedApproval?.id === item.id
                        ? "border-amber-500 ring-2 ring-amber-400/20 shadow-sm"
                        : "border-amber-200/80 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 items-center rounded-full border border-amber-200 bg-amber-50 px-2 text-[10px] font-mono font-semibold text-amber-800">
                            {item.priority}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{item.id}</span>
                          <span className="text-[11px] font-semibold text-amber-700">● {item.slaCountdown}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                          <span>Requester: <strong className="text-slate-700">{item.requester.name}</strong> ({item.requester.department})</span>
                          {item.amount && (
                            <>
                              <span>•</span>
                              <span className="font-semibold text-slate-800">{item.amount}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 text-xs gap-1 border-slate-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApproval(item);
                          setIsDrawerOpen(true);
                        }}
                      >
                        Inspect Drawer <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Normal Priority Section */}
          {normalList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Standard Queue ({normalList.length})</span>
              </div>

              <div className="space-y-2.5">
                {normalList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedApproval(item);
                      setIsDrawerOpen(true);
                    }}
                    className={`cursor-pointer rounded-xl border p-4 transition-all bg-white hover:border-slate-300 ${
                      selectedApproval?.id === item.id
                        ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm"
                        : "border-slate-200 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px]">
                            {item.priority}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">{item.id}</span>
                          <span className="text-[11px] font-medium text-slate-500">{item.slaCountdown}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                          <span>Requester: <strong className="text-slate-700">{item.requester.name}</strong></span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 text-xs gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApproval(item);
                          setIsDrawerOpen(true);
                        }}
                      >
                        Inspect <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {approvals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
              <h3 className="text-base font-bold text-slate-900">All Approvals Completed!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No bottleneck remaining in your queue. Great job maintaining team SLA compliance.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SLIDE-OVER INSPECTION DRAWER (Context Preserving) */}
        <div className="lg:col-span-5 sticky top-24">
          {selectedApproval ? (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-lg space-y-4">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      {selectedApproval.priority}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{selectedApproval.id}</span>
                    <span className="text-xs font-semibold text-red-600">● {selectedApproval.slaCountdown}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{selectedApproval.title}</h3>
                </div>
              </div>

              {/* Tab Navigation inside Drawer */}
              <div className="flex border-b border-slate-100 text-xs">
                {(["details", "attachments", "comments", "history"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-3 py-2 font-semibold capitalize border-b-2 transition-all ${
                      activeTab === t
                        ? "border-indigo-600 text-indigo-600 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "details" && (
                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-2.5 rounded-lg bg-slate-50 p-3">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Requester</span>
                      <p className="font-bold text-slate-900">{selectedApproval.requester.name}</p>
                      <p className="text-[11px] text-slate-500">{selectedApproval.requester.department}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Submission Date</span>
                      <p className="font-bold text-slate-900">{selectedApproval.submittedAt}</p>
                      <p className="text-[11px] text-slate-500">Tier: {selectedApproval.category}</p>
                    </div>
                    {selectedApproval.amount && (
                      <div className="col-span-2 pt-2 border-t border-slate-200">
                        <span className="text-[10px] uppercase font-semibold text-slate-400">Requested Amount</span>
                        <p className="text-sm font-black text-indigo-700">{selectedApproval.amount}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1">Business Justification & Impact</h5>
                    <p className="rounded-lg border border-slate-200/80 bg-white p-3 text-slate-600 leading-relaxed text-xs">
                      {selectedApproval.justification}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-slate-900 mb-1.5">Approval Hierarchy Chain</h5>
                    <div className="space-y-1.5">
                      {selectedApproval.approvalChain.map((step) => (
                        <div
                          key={step.step}
                          className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs ${
                            step.status === "current"
                              ? "bg-indigo-50 border border-indigo-200 font-bold text-indigo-900"
                              : step.status === "completed"
                              ? "bg-emerald-50/60 text-emerald-800"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] font-mono">Step {step.step}:</span>
                            {step.role}
                          </span>
                          <span className="text-[10px] uppercase font-bold">
                            {step.status === "completed" ? "✓ Signed" : step.status === "current" ? "● Awaiting You" : "Upcoming"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons with Auto-Advance Batch Processing */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium"
                    className="w-full gap-1.5 text-xs font-bold shadow-xs"
                    onClick={() => handleAction(selectedApproval.id, "approved")}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve & Next
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full gap-1.5 text-xs font-bold shadow-xs"
                    onClick={() => handleAction(selectedApproval.id, "rejected")}
                  >
                    <XCircle className="h-4 w-4" /> Reject Sign-off
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1"
                    onClick={() => handleAction(selectedApproval.id, "delegated")}
                  >
                    <UserPlus className="h-3.5 w-3.5 text-slate-500" /> Delegate Step
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1"
                    onClick={() => showToast("Clarification requested from " + selectedApproval.requester.name)}
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-slate-500" /> Request Info
                  </Button>
                </div>

                <p className="text-[11px] text-center text-slate-400 pt-1">
                  ⚡ Batch Mode: Approving advances automatically to the next item in queue.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              Select an approval item from the list to preview details in this drawer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
