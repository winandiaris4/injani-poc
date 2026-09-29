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
  ExternalLink,
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Plus,
  Zap,
  Terminal,
  Activity,
  Check,
  XCircle,
  Clock3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockControls, ControlItem, mockCronSchedules, CronScheduleItem } from "@/data/mockData";

export default function CompliancePage() {
  // Top-Level IA Switcher: Controls Registry vs Automations & Scheduled Sweeps
  const [complianceView, setComplianceView] = useState<"controls" | "automations">("controls");

  // Controls Registry State
  const [controls, setControls] = useState<ControlItem[]>(mockControls);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedFramework, setSelectedFramework] = useState<string>("ALL");
  const [controlsSearch, setControlsSearch] = useState<string>("");

  // Automations & Sweeps State
  const [cronList, setCronList] = useState<CronScheduleItem[]>(mockCronSchedules);
  const [cronFilter, setCronFilter] = useState<"all" | "active" | "paused">("all");
  const [cronSearch, setCronSearch] = useState<string>("");

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartRenewal = (controlCode: string) => {
    showToast(`Automated renewal workflow initiated for control: ${controlCode}`);
    setControls((prev) =>
      prev.map((c) =>
        c.code === controlCode ? { ...c, status: "warning", daysRemaining: c.daysRemaining + 365 } : c
      )
    );
  };

  const handleRunCronNow = (cronId: string, cronName: string) => {
    showToast(`Trigger dispatched: Automated sweep '${cronName}' executing now.`);
    setCronList((prev) =>
      prev.map((c) =>
        c.id === cronId ? { ...c, lastRunStatus: "running" as const, lastRunTime: "Just now" } : c
      )
    );
    setTimeout(() => {
      setCronList((prev) =>
        prev.map((c) =>
          c.id === cronId ? { ...c, lastRunStatus: "success" as const } : c
        )
      );
    }, 2000);
  };

  const handleToggleCron = (cronId: string) => {
    setCronList((prev) =>
      prev.map((c) => (c.id === cronId ? { ...c, isActive: !c.isActive } : c))
    );
    showToast("Automation active schedule updated.");
  };

  // Filtered Controls
  const filteredControls = controls.filter((c) => {
    const matchesFramework = selectedFramework === "ALL" || c.framework === selectedFramework;
    const matchesSearch =
      c.code.toLowerCase().includes(controlsSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(controlsSearch.toLowerCase()) ||
      c.owner.toLowerCase().includes(controlsSearch.toLowerCase());
    return matchesFramework && matchesSearch;
  });

  const criticalCount = controls.filter((c) => c.daysRemaining <= 7).length;
  const renewalCount = controls.filter((c) => c.daysRemaining > 7 && c.daysRemaining <= 30).length;
  const healthyCount = controls.filter((c) => c.daysRemaining > 30).length;

  // Filtered Cron Schedules
  const filteredCrons = cronList.filter((cron) => {
    const matchesStatus =
      cronFilter === "all" ||
      (cronFilter === "active" && cron.isActive) ||
      (cronFilter === "paused" && !cron.isActive);
    const matchesSearch =
      cron.name.toLowerCase().includes(cronSearch.toLowerCase()) ||
      cron.syntax.toLowerCase().includes(cronSearch.toLowerCase()) ||
      cron.frequency.toLowerCase().includes(cronSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCronCount = cronList.filter((c) => c.isActive).length;
  const pausedCronCount = cronList.filter((c) => !c.isActive).length;

  return (
    <div className="w-full space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-xl animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="size-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header & Primary IA Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {complianceView === "controls" ? "Continuous Controls Registry" : "Automations & Scheduled Sweeps"}
            </h1>
            <span className="font-mono text-[10px] bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded uppercase">
              {complianceView === "controls" ? "Governance Registry" : "Recurring Sweeps"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {complianceView === "controls"
              ? "Operational compliance tracking, effective dates, lifecycle renewal windows, and automated attestation."
              : "Background automated sweep schedules, recurring cron configurations, and compliance health attestations."}
          </p>
        </div>

        {/* Primary Module Switcher (IA 1:1) */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-border bg-muted/40 p-1 text-xs">
            <button
              onClick={() => setComplianceView("controls")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-2 ${
                complianceView === "controls"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="size-3.5" />
              <span>Controls Registry</span>
              <span className="font-mono text-[10px] text-muted-foreground/80">({controls.length})</span>
            </button>
            <button
              onClick={() => setComplianceView("automations")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-2 ${
                complianceView === "automations"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="size-3.5" />
              <span>Automations &amp; Sweeps</span>
              <span className="font-mono text-[10px] text-muted-foreground/80">({cronList.length})</span>
            </button>
          </div>

          {complianceView === "controls" ? (
            /* View Mode Switcher for Controls */
            <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
              <button
                onClick={() => setViewMode("table")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="size-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
                <span>Cards</span>
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="default"
              className="text-xs gap-1.5 h-8"
              onClick={() => showToast("Schedule creator wizard launched.")}
            >
              <Plus className="size-3.5" /> Add Sweep
            </Button>
          )}
        </div>
      </div>

      {/* VIEW 1: CONTROLS REGISTRY */}
      {complianceView === "controls" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Total Monitored
              </span>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{controls.length}</div>
              <span className="text-[11px] text-muted-foreground">Continuous audit coverage</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Critical (&le;7d)</span>
              </div>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                {criticalCount}
              </div>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Requires immediate renewal</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>Renewal Window (&le;30d)</span>
              </div>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{renewalCount}</div>
              <span className="text-[11px] text-muted-foreground">Scheduled recertification</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 rounded-full bg-foreground" />
                <span>Enforced &amp; Healthy</span>
              </div>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{healthyCount}</div>
              <span className="text-[11px] text-muted-foreground">Next review &gt; 30 days</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1 text-xs">
              {["ALL", "ISO27001", "SOC2", "GDPR", "SLA"].map((fw) => (
                <button
                  key={fw}
                  onClick={() => setSelectedFramework(fw)}
                  className={`rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
                    selectedFramework === fw
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>

            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search code, name, or owner..."
                value={controlsSearch}
                onChange={(e) => setControlsSearch(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Table vs Grid View */}
          {viewMode === "table" ? (
            <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 text-xs">
                    <TableHead className="font-mono text-[11px] font-medium h-9">Control Code</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Control Scope &amp; Name</TableHead>
                    <TableHead className="font-mono text-[11px] font-medium h-9">Framework</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Owner</TableHead>
                    <TableHead className="font-mono text-[11px] font-medium h-9">Expires On</TableHead>
                    <TableHead className="text-[11px] font-medium h-9">Lifecycle Status</TableHead>
                    <TableHead className="text-right text-[11px] font-medium h-9 pr-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredControls.map((ctrl) => {
                    const isCritical = ctrl.daysRemaining <= 7;
                    const isRenewal = ctrl.daysRemaining > 7 && ctrl.daysRemaining <= 30;

                    return (
                      <TableRow key={ctrl.id} className="text-xs hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono font-semibold text-foreground py-3 whitespace-nowrap">
                          {ctrl.code}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-medium text-foreground">{ctrl.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground">Effective since: {ctrl.effectiveFrom}</div>
                        </TableCell>
                        <TableCell className="font-mono text-[11px] py-3 whitespace-nowrap">
                          <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground border border-border/60">
                            {ctrl.framework}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground py-3 whitespace-nowrap">
                          {ctrl.owner}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground py-3 whitespace-nowrap">
                          {ctrl.expiresAt}
                        </TableCell>
                        <TableCell className="py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`size-1.5 rounded-full ${
                                isCritical
                                  ? "bg-rose-500 animate-pulse"
                                  : isRenewal
                                  ? "bg-amber-500"
                                  : "bg-foreground"
                              }`}
                            />
                            <span
                              className={`font-mono text-[11px] ${
                                isCritical
                                  ? "text-rose-600 dark:text-rose-400 font-semibold"
                                  : isRenewal
                                  ? "text-amber-600 dark:text-amber-400 font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {isCritical
                                ? `Critical (${ctrl.daysRemaining}d left)`
                                : isRenewal
                                ? `Renewal (${ctrl.daysRemaining}d left)`
                                : `Healthy (${ctrl.daysRemaining}d left)`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-3 pr-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant={isCritical ? "default" : "outline"}
                            className="h-7 text-xs gap-1 font-normal"
                            onClick={() => handleStartRenewal(ctrl.code)}
                          >
                            <RefreshCw className="size-3" />
                            <span>Renew</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredControls.map((ctrl) => {
                const isCritical = ctrl.daysRemaining <= 7;
                const isRenewal = ctrl.daysRemaining > 7 && ctrl.daysRemaining <= 30;

                return (
                  <Card key={ctrl.id} className="border-border shadow-2xs hover:border-foreground/30 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/60">
                          {ctrl.framework}
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span
                            className={`size-1.5 rounded-full ${
                              isCritical
                                ? "bg-rose-500 animate-pulse"
                                : isRenewal
                                ? "bg-amber-500"
                                : "bg-foreground"
                            }`}
                          />
                          <span
                            className={
                              isCritical
                                ? "text-rose-600 dark:text-rose-400 font-semibold"
                                : isRenewal
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground"
                            }
                          >
                            {ctrl.daysRemaining}d remaining
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-sm font-semibold text-foreground mt-1.5">
                        {ctrl.name}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs text-muted-foreground">
                        {ctrl.code}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2 font-mono">
                        <span>Owner: <strong className="text-foreground font-normal">{ctrl.owner}</strong></span>
                        <span>Expires: {ctrl.expiresAt}</span>
                      </div>

                      <Button
                        size="sm"
                        variant={isCritical ? "default" : "outline"}
                        className="w-full text-xs h-7 gap-1.5 font-normal"
                        onClick={() => handleStartRenewal(ctrl.code)}
                      >
                        <RefreshCw className="size-3" /> Start Recertification Workflow
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: AUTOMATIONS & SCHEDULED SWEEPS */}
      {complianceView === "automations" && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                Total Automation Jobs
              </span>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{cronList.length}</div>
              <span className="text-[11px] text-muted-foreground">Automated compliance routines</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Active &amp; Sweeping</span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeCronCount}
              </div>
              <span className="text-[11px] text-muted-foreground">Cron daemons running</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <span>Paused Daemons</span>
              </div>
              <div className="text-2xl font-bold font-mono text-foreground tabular-nums">{pausedCronCount}</div>
              <span className="text-[11px] text-muted-foreground">Manually suspended</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <Clock3 className="size-3 text-muted-foreground" />
                <span>Imminent Trigger</span>
              </div>
              <div className="text-sm font-bold font-mono text-foreground mt-1">Tonight 00:00 WIB</div>
              <span className="text-[11px] text-muted-foreground">daily-data-integrity-check</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1 text-xs">
              {[
                { id: "all" as const, label: "All Schedules", count: cronList.length },
                { id: "active" as const, label: "Active", count: activeCronCount },
                { id: "paused" as const, label: "Paused", count: pausedCronCount },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCronFilter(f.id)}
                  className={`rounded-md px-3 py-1 text-xs transition-all flex items-center gap-1.5 ${
                    cronFilter === f.id
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
                placeholder="Search job name, syntax, or timing..."
                value={cronSearch}
                onChange={(e) => setCronSearch(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Automations Table */}
          <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
            <div className="divide-y divide-border">
              {filteredCrons.map((cron) => {
                const isRunning = cron.lastRunStatus === "running";
                const isFailed = cron.lastRunStatus === "failed";
                const isSuccess = cron.lastRunStatus === "success";

                return (
                  <div
                    key={cron.id}
                    className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <Terminal className="size-4 text-muted-foreground" />
                        <span className="font-mono text-xs font-semibold text-foreground">{cron.name}</span>
                        <code className="font-mono text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground border border-border font-semibold">
                          {cron.syntax}
                        </code>
                        <span className="text-xs text-muted-foreground font-mono">({cron.frequency})</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground font-mono">
                        <span>
                          Next execution: <strong className="text-foreground font-medium">{cron.nextRun}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span>Last run: {cron.lastRunTime}</span>
                          {isRunning ? (
                            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                              <RefreshCw className="size-2.5 animate-spin" /> Running
                            </span>
                          ) : isFailed ? (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                              <XCircle className="size-2.5" /> Failed (Alert Dispatched)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="size-2.5" /> Success
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRunning}
                        className="h-7 text-xs font-mono gap-1.5"
                        onClick={() => handleRunCronNow(cron.id, cron.name)}
                      >
                        <RefreshCw className={`size-3 ${isRunning ? "animate-spin" : ""}`} />
                        <span>Run Now</span>
                      </Button>

                      <Button
                        size="sm"
                        variant={cron.isActive ? "default" : "secondary"}
                        className="h-7 text-xs font-mono"
                        onClick={() => handleToggleCron(cron.id)}
                      >
                        {cron.isActive ? "Active" : "Paused"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground"
                        onClick={() => showToast(`Displaying raw execution log for job: ${cron.name}`)}
                      >
                        Logs
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
