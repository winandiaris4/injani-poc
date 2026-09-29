"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Play,
  Clock,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Plus,
  RefreshCw,
  Server,
  Layers,
  Search,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    showToast(`Immediate trigger sent: '${name}' is executing now without altering schedule!`);
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Alert */}
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
            Workflow Initiation Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover, launch, and configure workflows across 4 distinct operational triggers.
          </p>
        </div>

        <Button size="sm" className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-3.5 w-3.5" /> Create New Workflow
        </Button>
      </div>

      {/* 4 Trigger Types Segmented Switcher */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-semibold max-w-2xl">
        {[
          { id: "manual" as const, label: "📝 Manual Forms (On-Demand)", count: "12" },
          { id: "cron" as const, label: "⏰ Scheduled / Cron Sweeps", count: "4" },
          { id: "webhook" as const, label: "🔗 Webhook Triggers", count: "3" },
          { id: "one_time" as const, label: "⚡ One-Time Pipelines", count: "2" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg py-2 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: MANUAL (Form-based Requests) */}
      {activeTab === "manual" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Form-based human-in-the-loop workflows with multi-tier approval chains and strict SLA policies.</span>
            <span className="font-semibold text-slate-700">Showing 4 core templates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockWorkflowCatalog.map((wf) => (
              <Card key={wf.id} className="border-slate-200/80 hover:border-indigo-400 transition-all hover:shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="text-[10px] mb-1.5 font-bold text-slate-600">
                        {wf.department}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-slate-900">{wf.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {wf.stepsCount} Approval Steps
                    </Badge>
                  </div>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {wf.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2.5 text-center text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Policy SLA</span>
                      <p className="font-semibold text-slate-700">{wf.slaPerStep}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Avg Duration</span>
                      <p className="font-semibold text-slate-700">{wf.avgDuration}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Usage</span>
                      <p className="font-semibold text-indigo-600">{wf.monthlyUsage}× /mo</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full text-xs gap-1.5 bg-slate-900 hover:bg-slate-800"
                    onClick={() => showToast(`Initiating workflow modal: ${wf.name}`)}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Start Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULED / CRON */}
      {activeTab === "cron" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Automated recurring routines such as midnight data integrity sweeps and compliance reconciliations.</span>
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Plus className="h-3 w-3" /> New Cron Schedule
            </Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                <tr>
                  <th className="p-3.5">Job Name</th>
                  <th className="p-3.5">Cron Syntax & Frequency</th>
                  <th className="p-3.5">Next Run</th>
                  <th className="p-3.5">Last Run</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cronList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold font-mono text-slate-900">{c.name}</td>
                    <td className="p-3.5">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-indigo-700 font-bold">{c.syntax}</code>
                      <span className="block text-[11px] text-slate-500 mt-0.5">{c.frequency}</span>
                    </td>
                    <td className="p-3.5 text-slate-700">{c.nextRun}</td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        {c.lastRunStatus === "success" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                        {c.lastRunStatus === "failed" && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                        {c.lastRunStatus === "running" && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
                        {c.lastRunTime}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={c.isActive ? "default" : "secondary"}>
                        {c.isActive ? "Active" : "Paused"}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        onClick={() => handleRunNow(c.id, c.name)}
                      >
                        <Zap className="h-3 w-3 text-amber-600 fill-amber-500" /> Run Now
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[11px]"
                        onClick={() => handleToggleCron(c.id)}
                      >
                        {c.isActive ? "Pause" : "Resume"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WEBHOOK */}
      {activeTab === "webhook" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Workflows listening for external API triggers (ERP invoices, cloud security alerts, Git commits).</span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "ERP Overdue Invoice Payment Escalation",
                source: "SAP S/4HANA / Odoo Webhook",
                endpoint: "POST /api/v1/webhooks/erp/unpaid-invoices",
                lastTriggered: "42m ago",
                eventsCount: "128 events this month"
              },
              {
                name: "Cloud Security Privilege Escalation Audit",
                source: "AWS CloudTrail & GitHub Enterprise",
                endpoint: "POST /api/v1/webhooks/security/iam-audit",
                lastTriggered: "Yesterday 23:14",
                eventsCount: "14 events this month"
              }
            ].map((wh, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <h4 className="text-xs font-bold text-slate-900">{wh.name}</h4>
                    <Badge variant="outline" className="text-[10px]">{wh.source}</Badge>
                  </div>
                  <code className="text-[11px] text-slate-500 font-mono block">{wh.endpoint}</code>
                </div>
                <div className="text-right text-xs">
                  <span className="font-semibold text-slate-800">{wh.eventsCount}</span>
                  <p className="text-[11px] text-slate-400">Last: {wh.lastTriggered}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ONE-TIME PIPELINES */}
      {activeTab === "one_time" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0" />
            <span>
              <strong>Ad-Hoc Execution Warning:</strong> One-time pipelines are single-run execution routines for manual data migrations, ad-hoc audits, or bulk updates.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">Q3 Historical CapEx Audit Re-Indexing</CardTitle>
                <CardDescription className="text-xs">
                  One-time recalculation of all Q3 financial approval trees against amended audit policy guidelines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline" className="w-full text-xs gap-1.5" onClick={() => showToast("Pipeline dispatched to worker pool.")}>
                  <Play className="h-3 w-3" /> Run Ad-Hoc Pipeline
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-900">SOC2 IAM Access Matrix Bulk Export</CardTitle>
                <CardDescription className="text-xs">
                  Generate immutable cryptographically signed snapshot of all current elevated access grants for external auditors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline" className="w-full text-xs gap-1.5" onClick={() => showToast("Snapshot generation queued.")}>
                  <Play className="h-3 w-3" /> Export Audit Snapshot
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
