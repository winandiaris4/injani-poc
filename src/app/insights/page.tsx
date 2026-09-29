"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Filter,
  BarChart2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Activity,
  FileCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface DepartmentMetric {
  dept: string;
  code: string;
  processed: number;
  adherenceRate: number;
  avgCycleDays: number;
  deltaPercent: number; // positive = faster/better
  status: "healthy" | "warning" | "critical";
}

const departmentData: DepartmentMetric[] = [
  {
    dept: "People Operations (HR)",
    code: "HR-OPS",
    processed: 142,
    adherenceRate: 98.2,
    avgCycleDays: 0.4,
    deltaPercent: 12,
    status: "healthy",
  },
  {
    dept: "Finance & Accounts Payable",
    code: "FIN-AP",
    processed: 318,
    adherenceRate: 94.5,
    avgCycleDays: 1.2,
    deltaPercent: 6,
    status: "healthy",
  },
  {
    dept: "Legal & Corporate Compliance",
    code: "LEG-COMP",
    processed: 87,
    adherenceRate: 89.1,
    avgCycleDays: 2.8,
    deltaPercent: -4,
    status: "warning",
  },
  {
    dept: "IT Security & Architecture",
    code: "IT-SEC",
    processed: 204,
    adherenceRate: 82.4,
    avgCycleDays: 3.9,
    deltaPercent: -15,
    status: "critical",
  },
];

const weeklyVolumeTelemetry = [
  { week: "W36", onTime: 88, breached: 12, total: 100, rate: "88%" },
  { week: "W37", onTime: 104, breached: 8, total: 112, rate: "92.8%" },
  { week: "W38", onTime: 96, breached: 9, total: 105, rate: "91.4%" },
  { week: "W39 (Curr)", onTime: 118, breached: 7, total: 125, rate: "94.4%" },
];

const reviewStageBottlenecks = [
  { stage: "Stage 1: Line Manager", avgDays: 0.5, barWidth: "15%", status: "healthy", delta: "-0.2d" },
  { stage: "Stage 2: IT Security & Architecture", avgDays: 3.9, barWidth: "95%", status: "critical", delta: "+1.1d" },
  { stage: "Stage 3: Procurement & Finance", avgDays: 1.4, barWidth: "35%", status: "healthy", delta: "-0.4d" },
  { stage: "Stage 4: Legal & Regulatory", avgDays: 2.8, barWidth: "70%", status: "warning", delta: "+0.3d" },
];

const auditTrailEvents = [
  {
    id: "EVT-89201",
    timestamp: "29 Sep 2026 17:42",
    request: "Vendor Procurement — PT Maju Sejahtera",
    actor: "Aris Winandi (Approver)",
    action: "Approved Step 3",
    slaStatus: "On-Time (1.4h)",
  },
  {
    id: "EVT-89198",
    timestamp: "29 Sep 2026 16:10",
    request: "Elevated IT Access Grant — DB Replica",
    actor: "Automated Rule Engine",
    action: "SLA Warning Dispatched",
    slaStatus: "Threshold &lt;3h",
  },
  {
    id: "EVT-89192",
    timestamp: "29 Sep 2026 14:05",
    request: "Bi-Annual IT Access Audit (ISO27001)",
    actor: "Scheduled Sweep Routine",
    action: "Automated Evidence Gathered",
    slaStatus: "Zero-Touch (12ms)",
  },
  {
    id: "EVT-89185",
    timestamp: "29 Sep 2026 11:30",
    request: "Software License — Datadog APM",
    actor: "Dewi Lestari (Finance)",
    action: "Budget Verification Signed",
    slaStatus: "On-Time (4.1h)",
  },
];

export default function InsightsPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "q3">("30d");

  return (
    <div className="relative max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Governance &amp; SLA Bottleneck Telemetry
            </h1>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-xs bg-muted text-muted-foreground font-medium">
              Read-Only Telemetry
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Continuous operational telemetry: review stage turnaround times, SLA adherence rankings, and audit logs.
          </p>
        </div>

        {/* Timeframe Selector & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5 text-xs">
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "q3", label: "Q3 Trailing" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeframe(t.id as any)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-all ${
                  timeframe === t.id
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 border-border">
            <Download className="size-3 text-muted-foreground" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* TOP ROW: EXECUTIVE KPI METRIC SCORECARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Cycle Time */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Average Cycle Time
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-foreground tracking-tight">
                2.4 Days
              </span>
              <span className="flex items-center text-[11px] font-mono text-emerald-600 font-medium">
                <ArrowDownRight className="size-3 mr-0.5" /> 18% MoM
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <p className="text-[11px] text-muted-foreground">Benchmark: &le; 3.0 days target</p>
          </CardContent>
        </Card>

        {/* Metric 2: SLA Compliance */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              SLA Adherence Rate
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-foreground tracking-tight">
                91.8%
              </span>
              <span className="flex items-center text-[11px] font-mono text-emerald-600 font-medium">
                +1.8% delta
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <p className="text-[11px] text-muted-foreground">Threshold requirement: &ge; 90.0%</p>
          </CardContent>
        </Card>

        {/* Metric 3: Active Bottlenecks */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Active Bottlenecks
              </span>
              <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-foreground tracking-tight">
                1 Stage
              </span>
              <span className="text-[11px] font-mono text-rose-600 font-medium">
                IT Sec (3.9d)
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <p className="text-[11px] text-muted-foreground">3.9d avg vs 1.5d threshold</p>
          </CardContent>
        </Card>

        {/* Metric 4: Automated Zero-Touch Sweeps */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="pb-1 pt-4 px-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Zero-Touch Automation
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-foreground tracking-tight">
                84.6%
              </span>
              <span className="flex items-center text-[11px] font-mono text-foreground font-medium">
                1,420 runs
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <p className="text-[11px] text-muted-foreground">Automated sweeps without manual triage</p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS GRID (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CHART 1: WEEKLY SLA THROUGHPUT & BREACH DISTRIBUTION */}
        <Card className="lg:col-span-6 border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BarChart2 className="size-3.5 text-muted-foreground" />
                Throughput &amp; Breach Distribution
              </CardTitle>
              <CardDescription className="text-xs text-foreground font-medium mt-0.5">
                Weekly signed approvals vs. SLA breach volume
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-xs bg-foreground" /> On-Time
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-xs bg-rose-500" /> Breached
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4 h-36 items-end pt-3 pb-1 border-b border-border">
              {weeklyVolumeTelemetry.map((item) => {
                const maxVol = 130;
                const onTimePx = Math.max(Math.round((item.onTime / maxVol) * 80), 12);
                const breachedPx = item.breached > 0 ? Math.max(Math.round((item.breached / maxVol) * 80), 8) : 0;

                return (
                  <div key={item.week} className="flex flex-col items-center justify-end h-full group">
                    <div className="w-full h-24 flex flex-col justify-end gap-0.5 rounded-xs overflow-hidden">
                      {item.breached > 0 && (
                        <div
                          style={{ height: `${breachedPx}px`, minHeight: "6px" }}
                          className="w-full bg-rose-500 transition-all group-hover:opacity-85"
                        />
                      )}
                      <div
                        style={{ height: `${onTimePx}px`, minHeight: "10px" }}
                        className="w-full bg-foreground transition-all group-hover:opacity-85"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-[10px] font-mono text-foreground font-medium block">
                        {item.week}
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground">
                        {item.rate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Past 4 weeks throughput volume</span>
              <span className="font-mono text-foreground font-medium text-[11px]">
                442 total approvals resolved
              </span>
            </div>
          </CardContent>
        </Card>

        {/* CHART 2: REVIEW STAGE TURNAROUND BOTTLENECK RADAR */}
        <Card className="lg:col-span-6 border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                Review Stage Cycle Times &amp; Bottlenecks
              </CardTitle>
              <CardDescription className="text-xs text-foreground font-medium mt-0.5">
                Average duration spent at each sign-off tier
              </CardDescription>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              Target: &le;1.5d / stage
            </span>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {reviewStageBottlenecks.map((item) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-1.5 rounded-full ${
                        item.status === "critical"
                          ? "bg-rose-500"
                          : item.status === "warning"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span className="font-medium text-foreground text-xs">{item.stage}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-muted-foreground">{item.delta}</span>
                    <span className="font-semibold text-foreground">{item.avgDays}d</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    style={{ width: item.barWidth }}
                    className={`h-full rounded-full transition-all ${
                      item.status === "critical"
                        ? "bg-rose-500"
                        : item.status === "warning"
                        ? "bg-amber-500"
                        : "bg-foreground/75"
                    }`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* DEPARTMENTAL SLA ADHERENCE TABLE */}
      <Card className="border-border shadow-2xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Departmental SLA Adherence Ranking
            </CardTitle>
            <CardDescription className="text-xs text-foreground font-medium mt-0.5">
              Comparative efficiency, processed volume, and month-over-month trajectory
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 text-xs">
                <TableHead className="font-medium">Department</TableHead>
                <TableHead className="font-mono text-right font-medium">Processed</TableHead>
                <TableHead className="font-mono text-right font-medium">Avg Cycle</TableHead>
                <TableHead className="font-mono text-right font-medium">SLA Adherence</TableHead>
                <TableHead className="font-mono text-right font-medium">MoM Trajectory</TableHead>
                <TableHead className="text-right font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentData.map((d) => (
                <TableRow key={d.code} className="text-xs hover:bg-muted/20">
                  <TableCell className="py-2.5">
                    <div className="font-medium text-foreground">{d.dept}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{d.code}</div>
                  </TableCell>
                  <TableCell className="py-2.5 font-mono text-right text-foreground font-medium">
                    {d.processed}
                  </TableCell>
                  <TableCell className="py-2.5 font-mono text-right text-foreground font-medium">
                    {d.avgCycleDays} days
                  </TableCell>
                  <TableCell className="py-2.5 font-mono text-right font-semibold text-foreground">
                    {d.adherenceRate}%
                  </TableCell>
                  <TableCell className="py-2.5 font-mono text-right text-[11px]">
                    <span
                      className={
                        d.deltaPercent > 0
                          ? "text-emerald-600 font-medium"
                          : "text-rose-600 font-medium"
                      }
                    >
                      {d.deltaPercent > 0 ? `+${d.deltaPercent}%` : `${d.deltaPercent}%`}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded-xs border ${
                        d.status === "healthy"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : d.status === "warning"
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-rose-300 bg-rose-50 text-rose-700 font-semibold"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          d.status === "healthy"
                            ? "bg-emerald-500"
                            : d.status === "warning"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="capitalize">{d.status}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* REAL-TIME AUDIT EVENT STREAM */}
      <Card className="border-border shadow-2xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="size-3.5 text-muted-foreground" />
              Real-Time Audit &amp; Decision Stream
            </CardTitle>
            <CardDescription className="text-xs text-foreground font-medium mt-0.5">
              Immutable log of recent automated sweeps and multi-tier sign-off decisions
            </CardDescription>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Live Stream Active
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 text-xs">
                <TableHead className="font-mono font-medium">Event ID</TableHead>
                <TableHead className="font-mono font-medium">Timestamp</TableHead>
                <TableHead className="font-medium">Request Title</TableHead>
                <TableHead className="font-medium">Signer / Actor</TableHead>
                <TableHead className="font-medium">Action Taken</TableHead>
                <TableHead className="font-mono text-right font-medium">SLA Turnaround</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditTrailEvents.map((evt) => (
                <TableRow key={evt.id} className="text-xs hover:bg-muted/20">
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {evt.id}
                  </TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {evt.timestamp}
                  </TableCell>
                  <TableCell className="font-medium text-foreground max-w-[220px] truncate">
                    {evt.request}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {evt.actor}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-[11px] text-foreground font-medium">
                      {evt.action}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-right text-[11px] text-muted-foreground whitespace-nowrap">
                    {evt.slaStatus}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
