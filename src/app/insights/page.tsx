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
import { PersonaContext } from "@/components/layout/AppShell";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

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

function createSplinePath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return "";
  let path = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

const weeklyVolumeTelemetry = [
  { week: "W34", onTime: 76, breached: 14, total: 90, rate: "84.4%" },
  { week: "W35", onTime: 84, breached: 11, total: 95, rate: "88.4%" },
  { week: "W36", onTime: 88, breached: 12, total: 100, rate: "88.0%" },
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
  const { persona, profile } = React.useContext(PersonaContext);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "q3">("30d");
  const [hoveredPoint, setHoveredPoint] = useState<number>(5); // default W39 (Curr)
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // SVG Area Spline Calculations
  const baselineY = 120;
  const topY = 22;
  const usableH = baselineY - topY; // 98
  const maxTotal = 135;

  const totalPoints = weeklyVolumeTelemetry.map((item, idx) => {
    const x = 32 + idx * 88;
    const y = baselineY - (item.total / maxTotal) * usableH;
    return { x, y };
  });

  const breachPoints = weeklyVolumeTelemetry.map((item, idx) => {
    const x = 32 + idx * 88;
    const y = baselineY - (item.breached / 24) * 35;
    return { x, y };
  });

  const throughputLinePath = createSplinePath(totalPoints);
  const throughputAreaPath = `${throughputLinePath} L ${totalPoints[totalPoints.length - 1].x} ${baselineY} L ${totalPoints[0].x} ${baselineY} Z`;

  const breachLinePath = createSplinePath(breachPoints);
  const breachAreaPath = `${breachLinePath} L ${breachPoints[breachPoints.length - 1].x} ${baselineY} L ${breachPoints[0].x} ${baselineY} Z`;

  const activePoint = weeklyVolumeTelemetry[hoveredPoint] || weeklyVolumeTelemetry[weeklyVolumeTelemetry.length - 1];

  return (
    <div className="relative w-full space-y-6">
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

      {/* Persona Metric Focus Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/20 px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded bg-foreground text-background font-mono text-[10px] font-bold">
            {profile?.initials || "IN"}
          </span>
          <span className="text-muted-foreground">
            Analytics Focus: <strong className="text-foreground">{profile?.name}</strong> ({profile?.roleTitle})
          </span>
          <span className="text-muted-foreground/60">•</span>
          <span className="font-medium text-foreground">
            {persona === "approver"
              ? "Executive Lens: SLA Bottlenecks, Department Rankings & Review Turnaround Times"
              : persona === "requester"
              ? "Requester Lens: End-to-End Cycle Time & Fulfillment Velocity for Initiated Requests"
              : persona === "control_owner"
              ? "GRC Lens: Continuous Controls Adherence & Zero-Touch Evidence Automation"
              : "DevOps Lens: Background Cron Reliability & High-Throughput Daemon Sweeps"}
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {persona === "approver"
            ? "Target SLA: ≥ 90.0%"
            : persona === "requester"
            ? "Avg Turnaround: 2.4d"
            : persona === "control_owner"
            ? "Audit Readiness: 98.2%"
            : "4 Active Daemons"}
        </span>
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
              <span className="text-2xl font-bold font-mono text-foreground tracking-tight flex items-baseline gap-1">
                <AnimatedCounter value={2.4} decimals={1} /> <span>Days</span>
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
                <AnimatedCounter value={91.8} decimals={1} suffix="%" />
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
              <span className="text-2xl font-bold font-mono text-foreground tracking-tight flex items-baseline gap-1">
                <AnimatedCounter value={1} /> <span>Stage</span>
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
                <AnimatedCounter value={84.6} decimals={1} suffix="%" />
              </span>
              <span className="flex items-center text-[11px] font-mono text-foreground font-medium gap-1">
                <AnimatedCounter value={1420} /> <span>runs</span>
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
        {/* CHART 1: WEEKLY SLA THROUGHPUT & BREACH DISTRIBUTION (SMOOTH AREA SPLINE CHART) */}
        <Card className="lg:col-span-6 border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-muted-foreground" />
                Throughput &amp; Breach Wave
              </CardTitle>
              <CardDescription className="text-xs text-foreground font-medium mt-0.5">
                6-week continuous throughput wave vs. breach contour
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-foreground" /> Volume
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-rose-500" /> Breached
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 border-t border-dashed border-muted-foreground" /> 90% SLA
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Interactive Telemetry Summary Pill for selected point */}
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-foreground">{activePoint.week}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Total: <strong className="text-foreground font-mono">{activePoint.total}</strong>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  On-Time: <strong className="text-foreground font-mono">{activePoint.onTime}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-rose-600 font-semibold">{activePoint.breached} breached</span>
                <span className="text-emerald-600 font-semibold">({activePoint.rate} SLA)</span>
              </div>
            </div>

            {/* Smooth SVG Area Canvas */}
            <div className="w-full relative h-36">
              <svg
                viewBox="0 0 500 135"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Gradient for Total Volume Area */}
                  <linearGradient id="throughputAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--foreground, #000)" stopOpacity="0.22" />
                    <stop offset="85%" stopColor="var(--foreground, #000)" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="var(--foreground, #000)" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Gradient for Breach Area */}
                  <linearGradient id="breachAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="20" y1="30" x2="480" y2="30" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
                <line x1="20" y1="70" x2="480" y2="70" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
                <line x1="20" y1="120" x2="480" y2="120" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />

                {/* 90% SLA Target Benchmark Line */}
                <line
                  x1="20"
                  y1="48"
                  x2="480"
                  y2="48"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeDasharray="4 3"
                  strokeWidth="1.2"
                />
                <text x="475" y="44" textAnchor="end" className="text-[9px] font-mono fill-muted-foreground select-none">
                  90% Benchmark
                </text>

                {/* Total Throughput Area & Smooth Line */}
                <path d={throughputAreaPath} fill="url(#throughputAreaGrad)" className="animate-fade-area" />
                <path
                  d={throughputLinePath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground animate-draw-spline"
                />

                {/* Breach Area & Line */}
                <path d={breachAreaPath} fill="url(#breachAreaGrad)" className="animate-fade-area" />
                <path
                  d={breachLinePath}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-draw-spline"
                />

                {/* Vertical Crosshair Line on Hovered Point */}
                {hoveredPoint !== null && totalPoints[hoveredPoint] && (
                  <line
                    x1={totalPoints[hoveredPoint].x}
                    y1="15"
                    x2={totalPoints[hoveredPoint].x}
                    y2="120"
                    stroke="currentColor"
                    strokeOpacity="0.4"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}

                {/* Interactive Data Points (Circles) */}
                {totalPoints.map((pt, idx) => {
                  const isHovered = hoveredPoint === idx;
                  const brPt = breachPoints[idx];

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onClick={() => setHoveredPoint(idx)}
                    >
                      {/* Total Volume Point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 4.5 : 3}
                        className={`${isHovered ? "fill-foreground stroke-background stroke-2" : "fill-foreground"} animate-pop-marker`}
                        style={{ animationDelay: `${200 + idx * 50}ms` }}
                      />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={8}
                          className="fill-none stroke-foreground opacity-30 stroke-1"
                        />
                      )}

                      {/* Breach Point */}
                      <circle
                        cx={brPt.x}
                        cy={brPt.y}
                        r={isHovered ? 3.5 : 2.5}
                        className="fill-rose-500"
                      />

                      {/* Invisible larger hit area for easy hover on touch/mouse */}
                      <rect
                        x={pt.x - 35}
                        y="10"
                        width="70"
                        height="115"
                        fill="transparent"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Week Labels */}
            <div className="flex items-center justify-between px-2 pt-1 border-t border-border/80">
              {weeklyVolumeTelemetry.map((item, idx) => (
                <button
                  key={item.week}
                  onClick={() => setHoveredPoint(idx)}
                  className={`text-[10px] font-mono transition-all px-1.5 py-0.5 rounded ${
                    hoveredPoint === idx
                      ? "font-semibold text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.week}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>Trailing 6 weeks operational flow</span>
              <span className="font-mono text-foreground font-medium text-[11px]">
                647 total sign-offs resolved
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
            {reviewStageBottlenecks.map((item, idx) => (
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
                    style={{
                      width: mounted ? item.barWidth : "0%",
                      transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${150 + idx * 100}ms`,
                    }}
                    className={`h-full rounded-full ${
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
