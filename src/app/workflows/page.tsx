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
  Server,
  Layers,
  Search,
  ExternalLink,
  ArrowRight,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { mockWorkflowCatalog, mockCronSchedules } from "@/data/mockData";

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "cron" | "webhook" | "one_time">("manual");
  const [cronList, setCronList] = useState(mockCronSchedules);
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

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-xl animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="size-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Workflow Initiation Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover, launch, and configure workflows across 4 distinct operational triggers.
          </p>
        </div>

        <Button size="sm" variant="default" className="text-xs gap-1.5 h-8">
          <Plus className="size-3.5" /> Create New Workflow
        </Button>
      </div>

      {/* 4 Trigger Types Segmented Switcher (Minimalist Tab Bar) */}
      <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
        {[
          { id: "manual" as const, label: "Manual Forms", icon: FileText, count: "4" },
          { id: "cron" as const, label: "Scheduled Sweeps", icon: Clock, count: "4" },
          { id: "webhook" as const, label: "Webhook Triggers", icon: Radio, count: "3" },
          { id: "one_time" as const, label: "One-Time Pipelines", icon: Zap, count: "2" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
      {activeTab === "manual" && (
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
      {activeTab === "cron" && (
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
      {activeTab === "webhook" && (
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
      {activeTab === "one_time" && (
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
  );
}
