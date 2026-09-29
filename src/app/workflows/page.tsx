"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  Radio,
  Zap,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  ArrowRight,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock3,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { mockWorkflowCatalog, mockCronSchedules, mockUserRequests, UserSubmittedRequest } from "@/data/mockData";

export default function WorkflowsPage() {
  // Top-Level IA Switcher: Initiation Catalog vs My Requests Tracker
  const [moduleView, setModuleView] = useState<"catalog" | "tracker">("catalog");

  // Catalog Tab State
  const [catalogTrigger, setCatalogTrigger] = useState<"manual" | "cron" | "webhook" | "one_time">("manual");
  const [cronList, setCronList] = useState(mockCronSchedules);

  // Tracker State
  const [trackerFilter, setTrackerFilter] = useState<"all" | "in_review" | "approved" | "draft">("all");
  const [trackerSearch, setTrackerSearch] = useState("");
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>("REQ-2026-881");
  const [myRequests, setMyRequests] = useState<UserSubmittedRequest[]>(mockUserRequests);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunNow = (cronId: string, name: string) => {
    showToast(`Immediate trigger sent: '${name}' is executing now.`);
    setCronList((prev) =>
      prev.map((c) => (c.id === cronId ? { ...c, lastRunStatus: "running" as const, lastRunTime: "Just now" } : c))
    );
  };

  const handleToggleCron = (cronId: string) => {
    setCronList((prev) =>
      prev.map((c) => (c.id === cronId ? { ...c, isActive: !c.isActive } : c))
    );
    showToast("Schedule state updated.");
  };

  const handleWithdrawRequest = (reqId: string) => {
    setMyRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast(`Request ${reqId} has been withdrawn.`);
  };

  // Filtered requests
  const filteredRequests = myRequests.filter((r) => {
    const matchesFilter = trackerFilter === "all" || r.status === trackerFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(trackerSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(trackerSearch.toLowerCase()) ||
      r.category.toLowerCase().includes(trackerSearch.toLowerCase()) ||
      r.currentReviewer.toLowerCase().includes(trackerSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCount = myRequests.length;
  const inReviewCount = myRequests.filter((r) => r.status === "in_review").length;
  const approvedCount = myRequests.filter((r) => r.status === "approved").length;
  const draftCount = myRequests.filter((r) => r.status === "draft").length;

  return (
    <div className="w-full space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-xl animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="size-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Header & IA Primary Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {moduleView === "catalog" ? "Workflow Initiation Catalog" : "My Requests Tracker"}
            </h1>
            <span className="font-mono text-[10px] bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase">
              {moduleView === "catalog" ? "Catalog Mode" : "Personal Submissions"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {moduleView === "catalog"
              ? "Discover, trigger, and configure standardized enterprise workflows across 4 trigger archetypes."
              : "Track end-to-end multi-tier approval progress, active reviewers, and SLA deadlines for requests you initiated."}
          </p>
        </div>

        {/* Primary Module Switcher (IA 1:1) */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              onClick={() => setModuleView("catalog")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-2 ${
                moduleView === "catalog"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="size-3.5" />
              <span>Initiation Catalog</span>
              <span className="font-mono text-[10px] text-muted-foreground/80">(4)</span>
            </button>
            <button
              onClick={() => setModuleView("tracker")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-2 ${
                moduleView === "tracker"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-3.5" />
              <span>My Requests Tracker</span>
              <span className="font-mono text-[10px] text-muted-foreground/80">({myRequests.length})</span>
            </button>
          </div>

          {moduleView === "catalog" && (
            <Button size="sm" variant="default" className="text-xs gap-1.5 h-8">
              <Plus className="size-3.5" /> New Template
            </Button>
          )}
        </div>
      </div>

      {/* VIEW 1: INITIATION CATALOG */}
      {moduleView === "catalog" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* 4 Trigger Types Segmented Switcher */}
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
            {[
              { id: "manual" as const, label: "Manual Forms", icon: FileText, count: "4" },
              { id: "cron" as const, label: "Scheduled Sweeps", icon: Clock, count: "4" },
              { id: "webhook" as const, label: "Webhook Triggers", icon: Radio, count: "3" },
              { id: "one_time" as const, label: "One-Time Pipelines", icon: Zap, count: "2" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = catalogTrigger === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCatalogTrigger(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{tab.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground/80">({tab.count})</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: MANUAL (Form-based Requests) */}
          {catalogTrigger === "manual" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Human-in-the-loop workflows with multi-tier approval chains and strict SLA policies.</span>
                <span className="font-mono text-[11px]">Showing 4 core templates</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockWorkflowCatalog.map((wf) => (
                  <Card key={wf.id} className="border-border shadow-2xs hover:border-foreground/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50">
                          {wf.department}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {wf.stepsCount} Approval Steps
                        </span>
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground mt-2">
                        {wf.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                        {wf.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 rounded-md border border-border/60 bg-muted/20 p-2.5 text-center text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-mono text-muted-foreground block">Policy SLA</span>
                          <span className="font-mono font-semibold text-foreground text-xs mt-0.5 block">{wf.slaPerStep}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-muted-foreground block">Avg Duration</span>
                          <span className="font-mono font-semibold text-foreground text-xs mt-0.5 block">{wf.avgDuration}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-muted-foreground block">Usage</span>
                          <span className="font-mono font-semibold text-foreground text-xs mt-0.5 block">{wf.monthlyUsage}/mo</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs h-8 gap-1.5 font-medium hover:bg-accent text-foreground"
                        onClick={() => showToast(`Initiation form loaded for: ${wf.name}`)}
                      >
                        <Play className="size-3 fill-current" /> Start Request
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CRON SCHEDULES */}
          {catalogTrigger === "cron" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Automated sweeps running on background recurring cron expressions without human initiation.</span>
                <span className="font-mono text-[11px]">{cronList.length} scheduled jobs</span>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
                {cronList.map((cron) => (
                  <div key={cron.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">{cron.name}</span>
                        <span className="font-mono text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground border border-border">
                          {cron.syntax}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">({cron.frequency})</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono pt-1">
                        <span>Next execution: <strong className="text-foreground">{cron.nextRun}</strong></span>
                        <span>•</span>
                        <span>Last run: {cron.lastRunTime} ({cron.lastRunStatus})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-mono gap-1.5"
                        onClick={() => handleRunNow(cron.id, cron.name)}
                      >
                        <RefreshCw className="size-3" /> Run Now
                      </Button>
                      <Button
                        size="sm"
                        variant={cron.isActive ? "default" : "secondary"}
                        className="h-7 text-xs font-mono"
                        onClick={() => handleToggleCron(cron.id)}
                      >
                        {cron.isActive ? "Active" : "Paused"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WEBHOOKS */}
          {catalogTrigger === "webhook" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Inbound HTTP event receivers from external systems (GitHub, Jira, AWS GuardDuty).</span>
                <span className="font-mono text-[11px]">3 Active Endpoints</span>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
                {[
                  {
                    id: "WH-01",
                    name: "AWS GuardDuty High Severity Event",
                    url: "https://bpa.injani.internal/api/v1/hooks/aws-guardduty-p1",
                    events24h: 14,
                    auth: "HMAC-SHA256 Signature"
                  },
                  {
                    id: "WH-02",
                    name: "GitHub SOC2 Branch Protection Drift",
                    url: "https://bpa.injani.internal/api/v1/hooks/github-soc2-branch",
                    events24h: 3,
                    auth: "Bearer Token"
                  },
                  {
                    id: "WH-03",
                    name: "Okta User Offboarding Event",
                    url: "https://bpa.injani.internal/api/v1/hooks/okta-offboard-sweep",
                    events24h: 8,
                    auth: "Mutual TLS (mTLS)"
                  }
                ].map((wh) => (
                  <div key={wh.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">{wh.name}</span>
                        <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                          {wh.auth}
                        </span>
                      </div>
                      <code className="block text-[11px] font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded border border-border/40">
                        {wh.url}
                      </code>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        <strong className="text-foreground">{wh.events24h}</strong> events (24h)
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-mono"
                        onClick={() => showToast(`Test payload dispatched to ${wh.id}`)}
                      >
                        Test Payload
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ONE-TIME PIPELINES */}
          {catalogTrigger === "one_time" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Special ad-hoc execution jobs with step-by-step state tracking and non-reusable tokens.</span>
                <span className="font-mono text-[11px]">2 available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Annual ISO27001 Access Recertification Blast",
                    desc: "Dispatches individual recertification attestation tasks to all 120 department heads simultaneously.",
                    steps: 5,
                    impact: "Broad Organizational Scope"
                  },
                  {
                    title: "Q4 Disaster Recovery & Backup Failover Drill",
                    desc: "Initiates secondary region failover health checks with mandatory sign-off from VP Engineering and CISO.",
                    steps: 7,
                    impact: "Infrastructure Critical"
                  }
                ].map((pipeline, i) => (
                  <Card key={i} className="border-border shadow-2xs">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>{pipeline.steps} Phases</span>
                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">{pipeline.impact}</span>
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground mt-2">
                        {pipeline.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                        {pipeline.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full text-xs h-8 gap-1.5 font-medium"
                        onClick={() => showToast(`Dry-run simulation initialized for: ${pipeline.title}`)}
                      >
                        <Play className="size-3 fill-current" /> Initialize Pipeline
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY REQUESTS TRACKER */}
      {moduleView === "tracker" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Tracker KPI Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Total Submitted
              </span>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{totalCount}</div>
              <span className="text-[11px] text-muted-foreground">Requests initiated by you</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>In Active Review</span>
              </div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                {inReviewCount}
              </div>
              <span className="text-[11px] text-muted-foreground">Awaiting approver sign-off</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Approved &amp; Executed</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {approvedCount}
              </div>
              <span className="text-[11px] text-muted-foreground">Full chain cleared</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <span>Draft Workflows</span>
              </div>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{draftCount}</div>
              <span className="text-[11px] text-muted-foreground">Unsubmitted forms</span>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1 text-xs">
              {[
                { id: "all" as const, label: "All Requests", count: totalCount },
                { id: "in_review" as const, label: "In Review", count: inReviewCount },
                { id: "approved" as const, label: "Approved", count: approvedCount },
                { id: "draft" as const, label: "Drafts", count: draftCount },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTrackerFilter(f.id)}
                  className={`rounded-md px-3 py-1 text-xs transition-all flex items-center gap-1.5 ${
                    trackerFilter === f.id
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground font-medium"
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">({f.count})</span>
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search request ID, title, reviewer..."
                value={trackerSearch}
                onChange={(e) => setTrackerSearch(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const isExpanded = expandedRequestId === req.id;
              const isWarning = req.slaCountdown.includes("Warning") || req.slaCountdown.includes("<");
              const isApproved = req.status === "approved";
              const isDraft = req.status === "draft";

              return (
                <div
                  key={req.id}
                  className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden transition-all hover:border-foreground/30"
                >
                  {/* Summary Bar */}
                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-foreground">{req.id}</span>
                          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border">
                            {req.category}
                          </span>
                          {req.amount && (
                            <span className="font-mono text-xs font-semibold text-foreground bg-accent/30 px-2 py-0.5 rounded">
                              {req.amount}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-foreground tracking-tight">{req.title}</h3>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          Submitted on {req.submittedAt}
                        </p>
                      </div>

                      {/* Status & SLA Pill */}
                      <div className="flex items-center gap-2">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="size-3" /> Executed &amp; Active
                          </span>
                        ) : isDraft ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground border border-border">
                            <Clock3 className="size-3" /> Draft
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold border ${
                              isWarning
                                ? "bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            }`}
                          >
                            <Clock className="size-3" /> {req.slaCountdown}
                          </span>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                        >
                          <span>{isExpanded ? "Hide Trace" : "View Stages"}</span>
                          {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                        </Button>
                      </div>
                    </div>

                    {/* Visual 3-Stage Progress Stepper */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                        <span className="text-muted-foreground">
                          Stage Progress:{" "}
                          <strong className="text-foreground">
                            {req.completedStages} / {req.totalStages} Cleared
                          </strong>
                        </span>
                        <span className="text-muted-foreground">
                          Current Reviewer:{" "}
                          <strong className="text-foreground">{req.currentReviewer}</strong>
                        </span>
                      </div>

                      {/* Stepper Dots Bar */}
                      <div className="grid grid-cols-3 gap-2">
                        {req.timeline.map((step, idx) => {
                          const isDone = step.status === "completed";
                          const isCurrent = step.status === "current";

                          return (
                            <div
                              key={idx}
                              className={`h-2 rounded-full transition-all ${
                                isDone
                                  ? "bg-foreground"
                                  : isCurrent
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-muted border border-border"
                              }`}
                              title={`${step.stage} (${step.status})`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Audit Timeline / Comment Trace */}
                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 p-4 space-y-3 animate-in fade-in duration-100">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                        Multi-Tier Stage Audit Trail
                      </span>

                      <div className="space-y-2.5">
                        {req.timeline.map((t, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-xs rounded-lg border border-border/60 bg-card p-2.5"
                          >
                            <div className="mt-0.5">
                              {t.status === "completed" ? (
                                <div className="size-4 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                                  <Check className="size-2.5 stroke-[3]" />
                                </div>
                              ) : t.status === "current" ? (
                                <div className="size-4 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center animate-pulse">
                                  <Clock3 className="size-2.5" />
                                </div>
                              ) : (
                                <div className="size-4 rounded-full border border-border text-muted-foreground flex items-center justify-center">
                                  <span className="size-1 rounded-full bg-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground text-xs">{t.stage}</span>
                                {t.timestamp && (
                                  <span className="font-mono text-[10px] text-muted-foreground">{t.timestamp}</span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                Actor: <span className="font-medium text-foreground">{t.actor}</span>
                              </div>
                              {t.comment && (
                                <p className="text-[11px] text-foreground bg-muted/40 p-1.5 rounded border border-border/40 font-mono mt-1">
                                  &ldquo;{t.comment}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                        {isDraft ? (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs gap-1"
                            onClick={() => showToast(`Resuming editor for draft ${req.id}`)}
                          >
                            Resume Draft <ArrowRight className="size-3" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/30"
                              onClick={() => handleWithdrawRequest(req.id)}
                            >
                              Withdraw Request
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs gap-1"
                              onClick={() => showToast(`Full audit report exported for ${req.id}`)}
                            >
                              Export PDF Audit Package <ArrowUpRight className="size-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
