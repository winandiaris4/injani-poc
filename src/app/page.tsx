"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  Zap,
  Activity,
  AlertCircle,
  Table as TableIcon,
  LayoutGrid,
  ChevronRight,
  SlidersHorizontal,
  BarChart2,
  CheckCircle2,
  RefreshCw,
  Play,
  Check,
  UserCheck,
  Terminal,
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
import { PersonaContext, PersonaType } from "@/components/layout/AppShell";
import { initialApprovals, mockControls, mockCronSchedules, mockUserRequests } from "@/data/mockData";
import { SlaVelocityChart } from "@/components/charts/SlaVelocityChart";

export default function DashboardPage() {
  const { persona } = useContext(PersonaContext);
  const [triageView, setTriageView] = useState<"summary" | "table">("summary");
  const [cronState, setCronState] = useState(mockCronSchedules);
  const [controlsState, setControlsState] = useState(mockControls);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunCron = (cronId: string, name: string) => {
    showToast(`Trigger dispatched: Automated sweep '${name}' executing now.`);
    setCronState((prev) =>
      prev.map((c) => (c.id === cronId ? { ...c, lastRunStatus: "running" as const, lastRunTime: "Just now" } : c))
    );
    setTimeout(() => {
      setCronState((prev) =>
        prev.map((c) => (c.id === cronId ? { ...c, lastRunStatus: "success" as const } : c))
      );
    }, 2000);
  };

  const handleRenewControl = (code: string) => {
    showToast(`Recertification workflow spawned for control ${code}`);
    setControlsState((prev) =>
      prev.map((c) => (c.code === code ? { ...c, daysRemaining: c.daysRemaining + 365, status: "warning" as const } : c))
    );
  };

  const overdueCount = initialApprovals.filter((a) => a.isOverdue).length;
  const dueTodayCount = initialApprovals.filter((a) => a.status === "due_today").length;
  const criticalControls = controlsState.filter((c) => c.daysRemaining <= 7);
  const urgentApprovals = initialApprovals.filter((a) => a.isOverdue || a.status === "due_today");

  /* =========================================================================
     MODULAR WIDGET DEFINITIONS
     ========================================================================= */

  // WIDGET 1: PENDING APPROVALS TRIAGE
  const renderApprovalsWidget = (badgeLabel?: string) => (
    <Card key="approvals" className="border-border shadow-2xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground" />
              Pending Approvals Triage
            </CardTitle>
            {badgeLabel && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent text-foreground font-semibold border border-border">
                {badgeLabel}
              </span>
            )}
          </div>
          <CardDescription className="text-xs text-foreground font-medium mt-0.5">
            {triageView === "summary"
              ? "Multi-tier sign-offs awaiting review"
              : `Actionable Queue (${urgentApprovals.length} urgent items)`}
          </CardDescription>
        </div>

        {/* View Switcher: Summary Tiles vs Data Table */}
        <div className="flex items-center gap-1.5">
          <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs">
            <button
              onClick={() => setTriageView("summary")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all flex items-center gap-1 ${
                triageView === "summary"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Summary KPI Grid"
            >
              <LayoutGrid className="size-3" />
              <span>Tiles</span>
            </button>
            <button
              onClick={() => setTriageView("table")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all flex items-center gap-1 ${
                triageView === "table"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Detailed Table View"
            >
              <TableIcon className="size-3" />
              <span>Table</span>
            </button>
          </div>

          <Link href="/inbox">
            <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-1.5">
              Inbox <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {triageView === "summary" ? (
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-border bg-card p-3 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <span className="size-1.5 rounded-full bg-rose-500" />
                <span>P1 Overdue</span>
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                {overdueCount}
              </div>
              <div className="text-[10px] text-rose-600 font-medium">SLA Breached</div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>P2 Due Today</span>
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                {dueTodayCount}
              </div>
              <div className="text-[10px] text-muted-foreground">&lt; 24h Remaining</div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                <span>P3 Normal</span>
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                8
              </div>
              <div className="text-[10px] text-muted-foreground">Standard SLA</div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 text-[11px]">
                  <TableHead className="h-7 font-mono font-medium">ID</TableHead>
                  <TableHead className="h-7 font-medium">Request</TableHead>
                  <TableHead className="h-7 font-medium">SLA Status</TableHead>
                  <TableHead className="h-7 font-mono text-right font-medium">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urgentApprovals.slice(0, 4).map((item) => (
                  <TableRow key={item.id} className="text-xs hover:bg-muted/30">
                    <TableCell className="py-2 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${
                            item.priority === "P1" ? "bg-rose-500" : "bg-amber-500"
                          }`}
                        />
                        <span>{item.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 max-w-[180px]">
                      <div className="truncate font-medium text-foreground">{item.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{item.requester.name}</div>
                    </TableCell>
                    <TableCell className="py-2 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-mono ${
                          item.isOverdue ? "text-rose-600 font-semibold" : "text-amber-600"
                        }`}
                      >
                        {item.slaCountdown}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 font-mono text-right text-[11px] text-foreground font-medium whitespace-nowrap">
                      {item.amount || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // WIDGET 2: SLA VELOCITY & BOTTLENECK CHART
  const renderVelocityWidget = (badgeLabel?: string) => (
    <SlaVelocityChart key="velocity" badgeLabel={badgeLabel} />
  );

  // WIDGET 3: CONTINUOUS CONTROLS HEALTH RADAR
  const renderControlsWidget = (badgeLabel?: string) => (
    <Card key="controls" className="border-border shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="size-3.5 text-muted-foreground" />
              Continuous Controls Health Radar
            </CardTitle>
            {badgeLabel && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent text-foreground font-semibold border border-border">
                {badgeLabel}
              </span>
            )}
          </div>
          <CardDescription className="text-xs text-foreground font-medium mt-0.5">
            Horizon foresight into expiring audits
          </CardDescription>
        </div>
        <Link href="/compliance">
          <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2">
            Registry <ArrowRight className="size-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-medium flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-rose-500" />
                ≤ 7 Days Expiry
              </span>
              <span className="font-mono text-[10px]">Critical</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              1 control
            </div>
            <p className="text-[11px] text-muted-foreground truncate">ISO27001 Access Review (6d)</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-medium flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber-500" />
                30-Day Window
              </span>
              <span className="font-mono text-[10px]">Renewal</span>
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              2 controls
            </div>
            <p className="text-[11px] text-muted-foreground truncate">SOC2 &amp; GDPR Retention</p>
          </div>
        </div>

        {/* Quick Renewal Action for Control Owners */}
        {persona === "control_owner" && (
          <div className="rounded-lg border border-border/70 bg-muted/30 p-2.5 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-muted-foreground">
              Expiring: <strong className="text-foreground">ISO27001-ACCESS-REV-2026</strong>
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[11px] font-mono gap-1"
              onClick={() => handleRenewControl("ISO27001-ACCESS-REV-2026")}
            >
              <RefreshCw className="size-2.5" /> Start Recertification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // WIDGET 4: WORKFLOWS SUBMITTED (MY REQUESTS)
  const renderRequestsWidget = (badgeLabel?: string) => (
    <Card key="requests" className="border-border shadow-2xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-muted-foreground" />
              Workflows Submitted
            </CardTitle>
            {badgeLabel && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent text-foreground font-semibold border border-border">
                {badgeLabel}
              </span>
            )}
          </div>
          <CardDescription className="text-xs text-foreground font-medium mt-0.5">
            My initiated requests &amp; live stages
          </CardDescription>
        </div>
        <Link href="/workflows">
          <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2">
            Track <ArrowRight className="size-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {persona === "requester" ? (
            /* Detailed Stage Cards for Requesters */
            mockUserRequests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-3 py-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-semibold text-foreground">{req.id}</span>
                    <span className="font-medium text-foreground truncate max-w-[200px]">{req.title}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Current Reviewer: <strong className="text-foreground">{req.currentReviewer}</strong>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      req.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {req.status === "approved" ? "Cleared" : req.slaCountdown}
                  </span>
                </div>
              </div>
            ))
          ) : (
            /* Summary Rows for other personas */
            <>
              <div className="flex items-center justify-between rounded-md border border-border/80 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground/60" />
                  <span className="font-medium text-foreground">In Review (Awaiting Reviewers)</span>
                </div>
                <span className="font-mono text-muted-foreground text-[11px]">2 active</span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/80 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-foreground" />
                  <span className="font-medium text-foreground">Approved &amp; Executed (This Week)</span>
                </div>
                <span className="font-mono text-foreground font-semibold text-[11px]">5 completed</span>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/80 bg-muted/20 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                  <span className="font-medium text-foreground">Draft Pipelines &amp; Templates</span>
                </div>
                <span className="font-mono text-muted-foreground text-[11px]">1 draft</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // WIDGET 5: QUICK INITIATION SHORTCUTS
  const renderQuickLaunchWidget = (badgeLabel?: string) => (
    <Card key="quick_launch" className="border-border shadow-2xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Zap className="size-3.5 text-muted-foreground" />
            Quick Initiation Shortcuts
          </CardTitle>
          {badgeLabel && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent text-foreground font-semibold border border-border">
              {badgeLabel}
            </span>
          )}
        </div>
        <Link href="/workflows" className="text-[11px] text-muted-foreground hover:text-foreground">
          Browse Catalog →
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Link href="/workflows">
            <Button variant="outline" size="sm" className="h-7 rounded-md text-xs font-normal hover:bg-accent">
              + Travel &amp; Expense
            </Button>
          </Link>
          <Link href="/workflows">
            <Button variant="outline" size="sm" className="h-7 rounded-md text-xs font-normal hover:bg-accent">
              + IT Access Grant
            </Button>
          </Link>
          <Link href="/workflows">
            <Button variant="outline" size="sm" className="h-7 rounded-md text-xs font-normal hover:bg-accent">
              + CapEx Sign-Off
            </Button>
          </Link>
          <Link href="/workflows">
            <Button variant="secondary" size="sm" className="h-7 rounded-md text-xs font-medium">
              Browse 4 Triggers →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  // WIDGET 6: BACKGROUND AUTOMATIONS & SWEEPS
  const renderAutomationsWidget = (badgeLabel?: string) => (
    <Card key="automations" className="border-border shadow-2xs">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="size-3.5 text-muted-foreground" />
            Background Automations &amp; Sweeps
          </CardTitle>
          {badgeLabel && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent text-foreground font-semibold border border-border">
              {badgeLabel}
            </span>
          )}
        </div>
        <Link href="/compliance" className="text-[10px] font-mono text-muted-foreground hover:text-foreground">
          3 Active Daemons →
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cronState.slice(0, persona === "automation_owner" ? 4 : 2).map((c) => (
            <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <Terminal className="size-3 text-muted-foreground" />
                <span className="font-mono text-foreground font-medium">{c.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground rounded bg-muted px-1.5 py-0.2 border border-border hidden sm:inline">
                  {c.syntax}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-muted-foreground">{c.lastRunTime}</span>
                <span
                  className={`inline-flex h-5 items-center rounded border px-1.5 text-[10px] font-mono font-medium ${
                    c.lastRunStatus === "running"
                      ? "border-blue-500/30 text-blue-600 bg-blue-500/10"
                      : "border-border bg-muted/50 text-foreground"
                  }`}
                >
                  {c.lastRunStatus === "running" ? "Running..." : "Passed"}
                </span>
                {persona === "automation_owner" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] font-mono px-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRunCron(c.id, c.name)}
                  >
                    Run Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  /* =========================================================================
     PERSONA DYNAMIC REORDERING & METRICS ADAPTATION
     ========================================================================= */

  let primaryWidgets: React.ReactNode[];
  let secondaryWidgets: React.ReactNode[];
  let roleTitle = "Executive Approver";
  let roleMission = "Prioritizes immediate SLA breach triage, overdue sign-offs & multi-tier budget approvals.";
  let roleTag = "Urgency Driven";

  switch (persona) {
    case "requester":
      roleTitle = "Lead Requester (Sarah Jenkins)";
      roleMission = "Live transparency into submitted requests, reviewer milestones, and instant catalog shortcuts.";
      roleTag = "Submission Centric";
      // Priority 1: My Requests + Quick Launch in primary grid
      primaryWidgets = [
        renderRequestsWidget("Hero Priority #1"),
        renderQuickLaunchWidget("Fast Launchpad"),
        renderVelocityWidget("Turnaround Time"),
        renderApprovalsWidget("Review Items"),
      ];
      secondaryWidgets = [
        renderControlsWidget("Audit Context"),
        renderAutomationsWidget("System Sync"),
      ];
      break;

    case "control_owner":
      roleTitle = "Chief Control Owner (Budi Santoso)";
      roleMission = "Continuous radar for expiring ISO27001/SOC2 controls, 30-day renewal windows, and attestation.";
      roleTag = "Governance & Audit";
      // Priority 1: Controls Radar in top-left position
      primaryWidgets = [
        renderControlsWidget("Hero Priority #1"),
        renderVelocityWidget("Audit Adherence"),
        renderApprovalsWidget("Policy Approvals"),
        renderRequestsWidget("Related Filings"),
      ];
      secondaryWidgets = [
        renderAutomationsWidget("Sweep Automations"),
        renderQuickLaunchWidget("Quick Requests"),
      ];
      break;

    case "automation_owner":
      roleTitle = "Principal Automation Owner (Alex Rivera)";
      roleMission = "Supervises background cron sweeps, immediate execution triggers, and webhook event throughput.";
      roleTag = "Operations & DevOps";
      // Priority 1: Background Automations with Run-Now triggers in primary grid
      primaryWidgets = [
        renderAutomationsWidget("Hero Priority #1"),
        renderVelocityWidget("Throughput Wave"),
        renderControlsWidget("Integrity Checks"),
        renderApprovalsWidget("Human Overrides"),
      ];
      secondaryWidgets = [
        renderQuickLaunchWidget("Shortcuts"),
        renderRequestsWidget("Audit Pipelines"),
      ];
      break;

    case "approver":
    default:
      roleTitle = "VP Approver (Aris Winandi)";
      roleMission = "Triage pending P1 breaches, SLA countdowns, and high-velocity multi-tier sign-offs.";
      roleTag = "Triage & SLA Focus";
      // Priority 1: Approvals Triage & SLA Velocity in primary grid
      primaryWidgets = [
        renderApprovalsWidget("Hero Priority #1"),
        renderVelocityWidget("SLA Velocity"),
        renderControlsWidget("Risk Radar"),
        renderRequestsWidget("Department Requests"),
      ];
      secondaryWidgets = [
        renderQuickLaunchWidget("Quick Launch"),
        renderAutomationsWidget("Background Monitor"),
      ];
      break;
  }

  return (
    <div className="space-y-5 w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-xl animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="size-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* ZONE 1: URGENT CONTROLS & BREACH BAR (MISSION-CONTROL OBSIDIAN HIGHLIGHT) */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 p-3.5 shadow-md transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-rose-400 border border-zinc-800">
              <AlertCircle className="size-3.5 text-rose-400" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Zone 1 Guardrail
                </span>
                <span className="text-[10px] font-mono text-zinc-300 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900/80">
                  Continuous Urgency
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href="/inbox"
                  className="flex items-center gap-1.5 font-medium hover:underline text-zinc-100"
                >
                  <span className="size-1.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.9)]" />
                  <span className="font-semibold text-rose-300">{overdueCount} approvals overdue (P1)</span>
                  <span className="text-zinc-400 font-normal">— CapEx &amp; Cloud Security</span>
                </Link>
                <span className="text-zinc-600">•</span>
                <Link
                  href="/compliance"
                  className="flex items-center gap-1.5 font-medium hover:underline text-zinc-100"
                >
                  <span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  <span className="text-zinc-200">
                    {criticalControls[0]?.code} expires in <strong className="font-semibold text-amber-300">{criticalControls[0]?.daysRemaining}d</strong>
                  </span>
                  <span className="text-zinc-400 font-normal">(ISO27001 Access)</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/inbox">
              <Button
                size="sm"
                className="h-7 text-xs gap-1.5 px-3 bg-white text-zinc-950 hover:bg-zinc-100 hover:text-black font-semibold border-0 shadow-xs transition-colors"
              >
                <span>Triage Urgent ({overdueCount})</span>
                <ArrowRight className="size-3 text-zinc-950" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Persona Context Banner (Live Transformative Feedback) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-card px-4 py-2.5 text-xs border border-border shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background font-mono text-[10px] font-bold">
            {persona === "approver" && "AW"}
            {persona === "requester" && "SJ"}
            {persona === "control_owner" && "BS"}
            {persona === "automation_owner" && "AR"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{roleTitle}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                {roleTag}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{roleMission}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground hidden md:inline">
            Rearranged for {persona.replace("_", " ")}
          </span>
          <Link href="/login">
            <Button variant="outline" size="sm" className="h-6 text-[11px] font-mono gap-1">
              Switch Persona Gateway <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ZONE 2: PRIMARY 2x2 METRICS & TELEMETRY GRID (DYNAMICALLY REORDERED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
        {primaryWidgets}
      </div>

      {/* ZONE 3: SECONDARY WIDGETS (DYNAMICALLY REORDERED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
        {secondaryWidgets}
      </div>
    </div>
  );
}
