"use client";

import React, { useContext } from "react";
import Link from "next/link";
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileText,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PersonaContext } from "@/components/layout/AppShell";
import { initialApprovals, mockControls, mockCronSchedules } from "@/data/mockData";

export default function DashboardPage() {
  const { persona } = useContext(PersonaContext);

  const overdueCount = initialApprovals.filter((a) => a.isOverdue).length;
  const dueTodayCount = initialApprovals.filter((a) => a.status === "due_today").length;
  const criticalControls = mockControls.filter((c) => c.daysRemaining <= 7);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* ZONE 1: URGENT CONTROLS & BREACH BAR (Refined Linear-style Guardrail) */}
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

      {/* ZONE 2: PRIMARY 2x2 METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Pending Approvals (Triage) */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                Pending Approvals Triage
              </CardTitle>
              <CardDescription className="text-xs text-foreground font-medium mt-0.5">
                Multi-tier sign-offs awaiting review
              </CardDescription>
            </div>
            <Link href="/inbox">
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2">
                View All <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Card 2: My Active Requests */}
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

        {/* Card 3: Expiring Controls Radar */}
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

        {/* Card 4: SLA Compliance Scorecard */}
        <Card className="border-border shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-muted-foreground" />
                SLA Compliance &amp; Cycle Times
              </CardTitle>
              <CardDescription className="text-xs text-foreground font-medium mt-0.5">
                Personal vs. Team operational throughput
              </CardDescription>
            </div>
            <Link href="/insights">
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2">
                Insights <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <div className="text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                  87.4%
                </div>
                <p className="text-xs text-muted-foreground">Personal SLA Compliance</p>
                <div className="text-[11px] font-mono text-muted-foreground pt-0.5">
                  Target: 90% (-2.6% delta)
                </div>
              </div>

              <div className="h-10 w-px bg-border" />

              <div className="space-y-0.5">
                <div className="text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                  91.8%
                </div>
                <p className="text-xs text-muted-foreground">Team Average</p>
                <div className="text-[11px] font-mono text-foreground font-medium pt-0.5">
                  ✓ Exceeds benchmark
                </div>
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
