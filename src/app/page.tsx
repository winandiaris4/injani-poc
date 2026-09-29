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
import { PersonaContext } from "@/components/layout/AppShell";
import { initialApprovals, mockControls, mockCronSchedules } from "@/data/mockData";

// 7-day operational throughput mock data
const slaWeeklyTelemetry = [
  { day: "Mon", total: 18, onTime: 16, breached: 2, rate: "88.9%" },
  { day: "Tue", total: 24, onTime: 22, breached: 2, rate: "91.6%" },
  { day: "Wed", total: 19, onTime: 18, breached: 1, rate: "94.7%" },
  { day: "Thu", total: 28, onTime: 23, breached: 5, rate: "82.1%" }, // Breach spike
  { day: "Fri", total: 22, onTime: 20, breached: 2, rate: "90.9%" },
  { day: "Sat", total: 8, onTime: 8, breached: 0, rate: "100%" },
  { day: "Sun", total: 6, onTime: 6, breached: 0, rate: "100%" },
];

const departmentBottlenecks = [
  { dept: "Legal Review", avgDays: 3.8, status: "warning", barWidth: "90%" },
  { dept: "Procurement / Finance", avgDays: 1.6, status: "normal", barWidth: "45%" },
  { dept: "IT Security", avgDays: 0.7, status: "good", barWidth: "20%" },
];

export default function DashboardPage() {
  const { persona } = useContext(PersonaContext);
  const [triageView, setTriageView] = useState<"summary" | "table">("summary");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const overdueCount = initialApprovals.filter((a) => a.isOverdue).length;
  const dueTodayCount = initialApprovals.filter((a) => a.status === "due_today").length;
  const criticalControls = mockControls.filter((c) => c.daysRemaining <= 7);

  // Urgent subset for the table view
  const urgentApprovals = initialApprovals.filter((a) => a.isOverdue || a.status === "due_today");

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ZONE 1: URGENT CONTROLS & BREACH BAR */}
      <div className="rounded-xl border border-border bg-card p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground border border-border">
              <AlertCircle className="size-3.5 text-foreground" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Zone 1 Guardrail
                </span>
                <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.2 rounded bg-muted/50">
                  Continuous Urgency
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-foreground">
                <Link
                  href="/inbox"
                  className="flex items-center gap-1.5 font-medium hover:underline text-foreground"
                >
                  <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-semibold">{overdueCount} approvals overdue (P1)</span>
                  <span className="text-muted-foreground font-normal">— CapEx &amp; Cloud Security</span>
                </Link>
                <span className="text-muted-foreground/40">•</span>
                <Link
                  href="/compliance"
                  className="flex items-center gap-1.5 font-medium hover:underline text-foreground"
                >
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span>
                    {criticalControls[0]?.code} expires in <strong className="font-semibold">{criticalControls[0]?.daysRemaining}d</strong>
                  </span>
                  <span className="text-muted-foreground font-normal">(ISO27001 Access)</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/inbox">
              <Button size="sm" variant="default" className="h-7 text-xs gap-1.5 px-3">
                Triage Urgent ({overdueCount}) <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Perspective Info Pill */}
      <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground border border-border/60">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3 text-muted-foreground" />
          <span>
            Active layout optimized for: <strong className="font-medium text-foreground capitalize">{persona.replace("_", " ")}</strong>.
          </span>
        </div>
        <span className="text-[11px] font-mono">Tier 1 Preset</span>
      </div>

      {/* ZONE 2: PRIMARY 2x2 METRICS & TELEMETRY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: PENDING APPROVALS TRIAGE (WITH SUMMARY & TABLE VIEW TOGGLE) */}
        <Card className="border-border shadow-2xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                Pending Approvals Triage
              </CardTitle>
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
              /* VIEW A: SUMMARY TILES */
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
              /* VIEW B: HIGH-DENSITY TABLE VIEW */
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

        {/* CARD 2: SLA VELOCITY & BOTTLENECK TELEMETRY (CHART VIEW) */}
        <Card className="border-border shadow-2xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart2 className="size-3.5 text-muted-foreground" />
                SLA Velocity &amp; Throughput
              </CardTitle>
              <CardDescription className="text-xs text-foreground font-medium mt-0.5">
                7-day operational completion vs. breach distribution
              </CardDescription>
            </div>
            <Link href="/insights">
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-1.5">
                Deep Dive <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-3 flex-1">
            {/* 7-DAY MINI BAR CHART */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Daily Approvals Completed</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-xs bg-foreground" /> On-Time
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="size-2 rounded-xs bg-rose-500" /> Breached
                  </span>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="grid grid-cols-7 gap-2 h-20 items-end pt-2 pb-1 border-b border-border/80">
                {slaWeeklyTelemetry.map((item, idx) => {
                  const maxTotal = 30;
                  const onTimeHeight = (item.onTime / maxTotal) * 100;
                  const breachedHeight = (item.breached / maxTotal) * 100;
                  const isHovered = hoveredBar === idx;

                  return (
                    <div
                      key={item.day}
                      className="group relative flex flex-col items-center justify-end h-full cursor-pointer"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-md border border-border bg-foreground px-2 py-1 text-[10px] font-mono text-background shadow-md">
                          {item.day}: {item.onTime} on-time, {item.breached} breached ({item.rate})
                        </div>
                      )}

                      {/* Stacked Bar */}
                      <div className="w-full h-12 flex flex-col justify-end gap-0.5 rounded-xs overflow-hidden">
                        {item.breached > 0 && (
                          <div
                            style={{ height: `${Math.max(breachedHeight, 8)}%` }}
                            className="w-full bg-rose-500 transition-all group-hover:opacity-80"
                          />
                        )}
                        <div
                          style={{ height: `${Math.max(onTimeHeight, 10)}%` }}
                          className="w-full bg-foreground transition-all group-hover:opacity-80"
                        />
                      </div>

                      <span className="text-[10px] font-mono text-muted-foreground mt-1">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Bottleneck Mini Telemetry */}
            <div className="pt-1 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">Cycle Time Bottleneck by Review Stage</span>
                <span className="font-mono text-[10px]">Avg Days</span>
              </div>
              <div className="space-y-1">
                {departmentBottlenecks.map((d) => (
                  <div key={d.dept} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px] truncate w-40">{d.dept}</span>
                    <div className="flex-1 mx-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        style={{ width: d.barWidth }}
                        className={`h-full rounded-full ${
                          d.status === "warning"
                            ? "bg-amber-500"
                            : d.status === "good"
                            ? "bg-emerald-500"
                            : "bg-foreground/70"
                        }`}
                      />
                    </div>
                    <span className="font-mono text-[11px] font-medium text-foreground whitespace-nowrap">
                      {d.avgDays}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: CONTINUOUS CONTROLS HEALTH RADAR */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldAlert className="size-3.5 text-muted-foreground" />
                Continuous Controls Health Radar
              </CardTitle>
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
          <CardContent>
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
          </CardContent>
        </Card>

        {/* CARD 4: MY ACTIVE REQUESTS SUMMARY */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-muted-foreground" />
                Workflows Submitted
              </CardTitle>
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ZONE 3: SECONDARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Launch Shortcuts */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="size-3.5 text-muted-foreground" />
              Quick Initiation Shortcuts
            </CardTitle>
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
                  + Vendor Onboarding
                </Button>
              </Link>
              <Link href="/workflows">
                <Button variant="secondary" size="sm" className="h-7 rounded-md text-xs font-medium">
                  Browse All 4 Triggers →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Background Automations & Cron Monitor */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="size-3.5 text-muted-foreground" />
              Background Automations &amp; Sweeps
            </CardTitle>
            <span className="text-[10px] font-mono text-muted-foreground">No Noise Active</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockCronSchedules.slice(0, 2).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    <span className="font-mono text-foreground font-medium">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="font-mono text-[11px]">{c.lastRunTime}</span>
                    <span className="inline-flex h-5 items-center rounded border border-border bg-muted/50 px-1.5 text-[10px] font-mono font-medium text-foreground">
                      Passed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
