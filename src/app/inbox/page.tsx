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
  ArrowUpRight,
  Table as TableIcon,
  LayoutGrid,
  Search,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { initialApprovals, ApprovalItem } from "@/data/mockData";
import { PersonaContext } from "@/components/layout/AppShell";
import Link from "next/link";

export default function InboxPage() {
  const { persona, profile } = React.useContext(PersonaContext);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(
    initialApprovals[0] || null
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "split">("table");
  const [activeTab, setActiveTab] = useState<
    "details" | "attachments" | "comments" | "history"
  >("details");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = (
    id: string,
    actionType: "approved" | "rejected" | "delegated"
  ) => {
    const currentIndex = approvals.findIndex((a) => a.id === id);
    const updated = approvals.filter((a) => a.id !== id);
    setApprovals(updated);
    setSelectedIds((prev) => prev.filter((item) => item !== id));

    const label =
      actionType === "approved"
        ? "Approved"
        : actionType === "rejected"
        ? "Rejected"
        : "Delegated";
    showToast(`Request ${id} ${label}`);

    // Auto-advance to next request (Batch Processing Mode)
    if (updated.length > 0) {
      const nextItem = updated[currentIndex] || updated[0];
      setSelectedApproval(nextItem);
    } else {
      setSelectedApproval(null);
    }
  };

  const handleBatchAction = (actionType: "approved" | "rejected") => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    const updated = approvals.filter((a) => !selectedIds.includes(a.id));
    setApprovals(updated);
    setSelectedIds([]);

    showToast(
      `Batch ${actionType === "approved" ? "Approved" : "Rejected"} ${count} requests successfully`
    );

    if (updated.length > 0) {
      setSelectedApproval(updated[0]);
    } else {
      setSelectedApproval(null);
    }
  };

  const toggleSelectAll = (filteredItems: ApprovalItem[]) => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredApprovals = approvals.filter((a) => {
    const matchesPriority =
      filterPriority === "ALL" ? true : a.priority === filterPriority;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.requester.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const overdueList = filteredApprovals.filter((a) => a.isOverdue);
  const dueTodayList = filteredApprovals.filter((a) => a.status === "due_today");
  const normalList = filteredApprovals.filter((a) => a.status === "pending");

  const isAllSelected =
    filteredApprovals.length > 0 &&
    selectedIds.length === filteredApprovals.length;

  return (
    <div className="relative w-full space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 rounded-md border border-border bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-lg animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="size-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Pending Approvals Queue
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded-xs bg-muted text-foreground font-medium">
              {approvals.length} pending
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rapid triage of multi-tier operational sign-offs with batch selection and audit preservation.
          </p>
        </div>

        {/* View Switcher: Table View vs Split Cards */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="size-3.5" />
              <span>Table View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "split"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Split Drawer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Role Context Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/20 px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded bg-foreground text-background font-mono text-[10px] font-bold">
            {profile?.initials || "IN"}
          </span>
          <span className="text-muted-foreground">
            Smart Context: <strong className="text-foreground">{profile?.name}</strong> ({profile?.roleTitle})
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="font-medium text-foreground">
            {persona === "approver"
              ? "3 pending sign-offs waiting on your signature (2 P1 overdue breach risks)"
              : persona === "requester"
              ? "You have 0 pending approvals requiring your sign-off"
              : persona === "control_owner"
              ? "GRC Oversight: Viewing sign-offs with compliance implications"
              : "DevOps & Automations View: System approvals and exceptions queue"}
          </span>
        </div>
        {persona === "requester" && (
          <Link
            href="/workflows"
            className="text-[11px] font-mono text-foreground font-semibold hover:underline flex items-center gap-1"
          >
            Track My Requests in Workflows →
          </Link>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Priority Tabs */}
        <div className="flex items-center gap-1 border-b sm:border-b-0 border-border pb-2 sm:pb-0">
          {[
            { id: "ALL", label: "All Items", count: approvals.length },
            {
              id: "P1",
              label: "P1 Overdue",
              count: approvals.filter((a) => a.priority === "P1").length,
              dot: "bg-rose-500",
            },
            {
              id: "P2",
              label: "P2 Due Today",
              count: approvals.filter((a) => a.priority === "P2").length,
              dot: "bg-amber-500",
            },
            {
              id: "P3",
              label: "P3 Normal",
              count: approvals.filter((a) => a.priority === "P3").length,
              dot: "bg-muted-foreground/40",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPriority(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterPriority === tab.id
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.dot && <span className={`size-1.5 rounded-full ${tab.dot}`} />}
              <span>{tab.label}</span>
              <span className="font-mono text-[10px] opacity-75">
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search request, owner..."
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* BATCH ACTION BAR (when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-4 py-2.5 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">
              {selectedIds.length} {selectedIds.length === 1 ? "item" : "items"} selected
            </span>
            <span className="text-muted-foreground">across current view</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleBatchAction("approved")}
              className="h-7 text-xs font-medium gap-1.5"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Approve Selected ({selectedIds.length})</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBatchAction("rejected")}
              className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-border gap-1.5"
            >
              <XCircle className="size-3.5" />
              <span>Reject Selected ({selectedIds.length})</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-7 text-xs text-muted-foreground"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: HIGH-DENSITY TABLE VIEW */}
      {viewMode === "table" ? (
        <div className="rounded-lg border border-border bg-card shadow-2xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 text-xs">
                <TableHead className="w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => toggleSelectAll(filteredApprovals)}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-32 font-mono font-medium">Request ID</TableHead>
                <TableHead className="font-medium">Title &amp; Requester</TableHead>
                <TableHead className="w-24 font-medium">Priority</TableHead>
                <TableHead className="w-36 font-medium">SLA Countdown</TableHead>
                <TableHead className="w-32 font-mono text-right font-medium">Amount</TableHead>
                <TableHead className="w-36 text-right font-medium">Quick Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprovals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No approval requests matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApprovals.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <TableRow
                      key={item.id}
                      className={`text-xs transition-colors hover:bg-muted/30 ${
                        isChecked ? "bg-muted/20" : ""
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelectOne(item.id)}
                          aria-label={`Select ${item.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-1.5 rounded-full ${
                              item.priority === "P1"
                                ? "bg-rose-500"
                                : item.priority === "P2"
                                ? "bg-amber-500"
                                : "bg-muted-foreground/40"
                            }`}
                          />
                          <span>{item.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md py-2.5">
                        <div className="font-medium text-foreground leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>{item.requester.name}</span>
                          <span>•</span>
                          <span>{item.requester.department}</span>
                          <span>•</span>
                          <span className="font-mono">{item.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded-xs border ${
                            item.priority === "P1"
                              ? "border-rose-300 bg-rose-50 text-rose-700 font-semibold"
                              : item.priority === "P2"
                              ? "border-amber-300 bg-amber-50 text-amber-700 font-semibold"
                              : "border-border bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-mono text-[11px] font-medium ${
                            item.isOverdue
                              ? "text-rose-600 font-semibold"
                              : item.status === "due_today"
                              ? "text-amber-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.slaCountdown}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-right text-xs text-foreground font-medium">
                        {item.amount || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedApproval(item);
                              setViewMode("split");
                            }}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Inspect
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAction(item.id, "approved")}
                            className="h-7 px-2 text-xs font-medium"
                          >
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* VIEW MODE 2: SPLIT DRAWER / TWO-COLUMN VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Approvals Queue List */}
          <div className="lg:col-span-7 space-y-4">
            {filteredApprovals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
                <CheckCircle2 className="mx-auto size-10 text-muted-foreground mb-2" />
                <h3 className="text-sm font-semibold text-foreground">
                  Queue Clean &amp; Clear
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  No pending bottlenecks remaining under this view filter.
                </p>
              </div>
            ) : (
              filteredApprovals.map((item) => {
                const isSelected = selectedApproval?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedApproval(item)}
                    className={`cursor-pointer rounded-lg border p-3.5 transition-all bg-card hover:border-foreground/40 ${
                      isSelected
                        ? "border-foreground ring-1 ring-foreground shadow-2xs"
                        : "border-border shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-1.5 rounded-full ${
                              item.priority === "P1"
                                ? "bg-rose-500"
                                : item.priority === "P2"
                                ? "bg-amber-500"
                                : "bg-muted-foreground/40"
                            }`}
                          />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {item.priority}
                          </span>
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {item.id}
                          </span>
                          <span
                            className={`font-mono text-[11px] ${
                              item.isOverdue
                                ? "text-rose-600 font-semibold"
                                : item.status === "due_today"
                                ? "text-amber-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            ● {item.slaCountdown}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-foreground leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-0.5">
                          <span>
                            Requester:{" "}
                            <strong className="text-foreground font-medium">
                              {item.requester.name}
                            </strong>{" "}
                            ({item.requester.department})
                          </span>
                          {item.amount && (
                            <>
                              <span>•</span>
                              <span className="font-mono font-medium text-foreground">
                                {item.amount}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(item.id, "approved");
                          }}
                          className="h-7 text-xs font-medium"
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: CONTEXTUAL INSPECTION DRAWER */}
          <div className="lg:col-span-5 sticky top-20">
            {selectedApproval ? (
              <div className="rounded-lg border border-border bg-card p-5 shadow-2xs space-y-4">
                {/* Drawer Header */}
                <div className="pb-3 border-b border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-1.5 rounded-full ${
                          selectedApproval.priority === "P1"
                            ? "bg-rose-500"
                            : selectedApproval.priority === "P2"
                            ? "bg-amber-500"
                            : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {selectedApproval.id}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Tier: {selectedApproval.category}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-xs ${
                        selectedApproval.isOverdue
                          ? "text-rose-600 font-semibold"
                          : "text-amber-600"
                      }`}
                    >
                      {selectedApproval.slaCountdown}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-snug pt-1">
                    {selectedApproval.title}
                  </h3>
                </div>

                {/* Tab Navigation inside Drawer */}
                <div className="flex border-b border-border text-xs">
                  {(["details", "attachments", "comments", "history"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-3 py-1.5 text-xs font-medium capitalize border-b-2 transition-all ${
                          activeTab === t
                            ? "border-foreground text-foreground font-semibold"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>

                {/* Tab Content */}
                {activeTab === "details" && (
                  <div className="space-y-3.5 text-xs text-foreground">
                    <div className="grid grid-cols-2 gap-2.5 rounded-md border border-border bg-muted/20 p-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">
                          Requester
                        </span>
                        <p className="font-medium text-foreground">
                          {selectedApproval.requester.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {selectedApproval.requester.department}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-muted-foreground">
                          Submission Date
                        </span>
                        <p className="font-medium text-foreground">
                          {selectedApproval.submittedAt}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Priority {selectedApproval.priority}
                        </p>
                      </div>
                      {selectedApproval.amount && (
                        <div className="col-span-2 pt-2 border-t border-border">
                          <span className="text-[10px] font-mono uppercase text-muted-foreground">
                            Requested Amount
                          </span>
                          <p className="text-sm font-bold font-mono text-foreground">
                            {selectedApproval.amount}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium text-foreground mb-1 text-xs">
                        Business Justification &amp; Impact
                      </h5>
                      <p className="rounded-md border border-border bg-background p-3 text-muted-foreground leading-relaxed text-xs">
                        {selectedApproval.justification}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-foreground mb-1.5 text-xs">
                        Approval Hierarchy Chain
                      </h5>
                      <div className="space-y-1.5">
                        {selectedApproval.approvalChain.map((step) => (
                          <div
                            key={step.step}
                            className={`flex items-center justify-between rounded-md px-3 py-1.5 text-xs border ${
                              step.status === "current"
                                ? "bg-muted/40 border-foreground/40 font-medium text-foreground"
                                : step.status === "completed"
                                ? "bg-muted/20 border-border text-muted-foreground"
                                : "bg-transparent border-transparent text-muted-foreground/60"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-[10px] font-mono">
                                Step {step.step}:
                              </span>
                              <span>{step.role}</span>
                            </span>
                            <span className="text-[10px] font-mono font-medium">
                              {step.status === "completed"
                                ? "✓ Signed"
                                : step.status === "current"
                                ? "● Awaiting You"
                                : "Upcoming"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "attachments" && (
                  <div className="space-y-2 text-xs py-2">
                    <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">CapEx_Business_Case_2026.pdf</p>
                          <p className="text-[10px] text-muted-foreground font-mono">1.4 MB • Uploaded by {selectedApproval.requester.name}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">View</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Vendor_Quotations_Comparative.xlsx</p>
                          <p className="text-[10px] text-muted-foreground font-mono">420 KB • IT Architecture Sign-off</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">View</Button>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="space-y-2 text-xs py-2">
                    <div className="rounded-md border border-border p-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground">Budi Santoso</span>
                        <span className="font-mono text-[10px]">Yesterday at 16:30</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Requested expedited review as server lead times have extended to 4 weeks.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-2 text-xs py-2">
                    <div className="border-l-2 border-border pl-3 space-y-2.5">
                      <div>
                        <div className="text-[10px] font-mono text-muted-foreground">28 Sep 2026 14:15</div>
                        <div className="font-medium text-foreground">Submitted by {selectedApproval.requester.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-muted-foreground">28 Sep 2026 17:00</div>
                        <div className="font-medium text-foreground">Signed by Department Head (Step 1)</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons with Auto-Advance Batch Processing */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      className="w-full gap-1.5 text-xs font-medium"
                      onClick={() => handleAction(selectedApproval.id, "approved")}
                    >
                      <CheckCircle2 className="size-3.5" /> Approve &amp; Next
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-border"
                      onClick={() => handleAction(selectedApproval.id, "rejected")}
                    >
                      <XCircle className="size-3.5" /> Reject Sign-off
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs gap-1 border border-border/80"
                      onClick={() => handleAction(selectedApproval.id, "delegated")}
                    >
                      <UserPlus className="size-3 text-muted-foreground" /> Delegate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs gap-1 border border-border/80"
                      onClick={() =>
                        showToast(
                          "Clarification requested from " +
                            selectedApproval.requester.name
                        )
                      }
                    >
                      <HelpCircle className="size-3 text-muted-foreground" /> Request Info
                    </Button>
                  </div>

                  <p className="text-[10px] text-center text-muted-foreground pt-0.5">
                    ⚡ Batch Mode: Approving advances automatically to the next item in queue.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
                Select an approval item from the list to preview details in this drawer.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
