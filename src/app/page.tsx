"use client";

import React, { useContext } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Play,
  CheckCircle2,
  FileText,
  UserCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ZONE 1: URGENT ACTIONS BAR (Sticky Top, Non-Removable Compliance Fire Alarm) */}
      <div className="relative overflow-hidden rounded-xl border border-amber-300/80 bg-linear-to-r from-amber-50 via-amber-50/70 to-orange-50/60 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-900 border border-amber-500/30 font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-700 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Zone 1: Continuous Controls & Urgency Bar
                </span>
                <span className="text-[10px] rounded bg-amber-200/70 px-1.5 py-0.2 font-semibold text-amber-900">
                  Non-Removable Guardrail
                </span>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-800">
                <Link
                  href="/inbox"
                  className="flex items-center gap-1.5 hover:text-red-700 transition-colors"
                >
                  <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping" />
                  <span className="font-bold text-red-700">{overdueCount} approvals overdue (P1)</span>
                  <span className="text-slate-500">— CapEx & Cloud Security Contract</span>
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href="/compliance"
                  className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                  <span className="font-bold text-amber-800">
                    {criticalControls[0]?.code} expires in {criticalControls[0]?.daysRemaining} days
                  </span>
                  <span className="text-slate-500">(ISO27001 Access Attestation)</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/inbox">
              <Button size="sm" variant="destructive" className="h-8 gap-1.5 text-xs shadow-xs">
                Triage Urgent ({overdueCount}) <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Role Context Notification */}
      <div className="flex items-center justify-between rounded-lg bg-slate-100/80 px-4 py-2 text-xs text-slate-600 border border-slate-200/60">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>
            Active layout optimized for: <strong className="capitalize text-slate-900">{persona.replace("_", " ")}</strong>.
            Widgets rearrange dynamically based on your operational hat.
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Tier 1 One-Click Preset Active</span>
      </div>

      {/* ZONE 2: PRIMARY 2x2 METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Pending Approvals (Triage) */}
        <Card className="hover:shadow-md transition-shadow border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Pending Approvals Triage
              </CardTitle>
              <CardDescription>Multi-tier sign-offs awaiting your review</CardDescription>
            </div>
            <Link href="/inbox">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 gap-1 hover:text-indigo-800">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-red-200 bg-red-50/60 p-3.5 text-center">
                <div className="text-2xl font-black text-red-600">{overdueCount}</div>
                <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider mt-0.5">P1 Overdue</div>
                <span className="text-[10px] text-red-600">SLA Breached</span>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-center">
                <div className="text-2xl font-black text-amber-600">{dueTodayCount}</div>
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mt-0.5">P2 Due Today</div>
                <span className="text-[10px] text-amber-700">&lt; 24h Remaining</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                <div className="text-2xl font-black text-slate-700">8</div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mt-0.5">P3 Normal</div>
                <span className="text-[10px] text-slate-500">Standard SLA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: My Active Requests */}
        <Card className="hover:shadow-md transition-shadow border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Workflows Submitted (My Requests)
              </CardTitle>
              <CardDescription>Live transparency into requests you initiated</CardDescription>
            </div>
            <Link href="/workflows">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 gap-1 hover:text-indigo-800">
                Track <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-slate-800">In Review (Awaiting Reviewers)</span>
                </div>
                <span className="font-bold">2 active</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-800">Approved & Executed This Week</span>
                </div>
                <span className="inline-flex h-5 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-800">5 completed</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-xs font-semibold text-slate-800">Draft Pipelines & Templates</span>
                </div>
                <span className="font-bold">1 draft</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Expiring Controls Registry Radar */}
        <Card className="hover:shadow-md transition-shadow border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                Continuous Controls Health Radar
              </CardTitle>
              <CardDescription>Horizon foresight into expiring audits & policies</CardDescription>
            </div>
            <Link href="/compliance">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 gap-1 hover:text-indigo-800">
                Registry <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-red-200/80 bg-red-50/40 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-700 uppercase">Imminent Expiry</span>
                  <span className="text-[10px]">≤ 7 Days</span>
                </div>
                <div className="mt-2 text-2xl font-black text-red-700">1 control</div>
                <p className="mt-1 text-[11px] text-slate-600 truncate">ISO27001 Access Review (6d)</p>
              </div>

              <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">30-Day Window</span>
                  <span className="inline-flex h-5 items-center rounded-full border border-amber-200 bg-amber-50 px-2 text-[10px] font-semibold text-amber-800">Renewal Alert</span>
                </div>
                <div className="mt-2 text-2xl font-black text-amber-700">2 controls</div>
                <p className="mt-1 text-[11px] text-slate-600 truncate">SOC2 & GDPR Retentions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: SLA Compliance Scorecard */}
        <Card className="hover:shadow-md transition-shadow border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                SLA Compliance & Cycle Times
              </CardTitle>
              <CardDescription>Personal vs Team operational throughput</CardDescription>
            </div>
            <Link href="/insights">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 gap-1 hover:text-indigo-800">
                Analytics <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-3xl font-black text-slate-900">87.4%</div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Personal SLA Compliance</p>
                <span className="text-[11px] text-amber-700 font-medium">⚠️ 2.6% below target (90%)</span>
              </div>

              <div className="h-12 w-px bg-slate-200" />

              <div>
                <div className="text-3xl font-black text-slate-700">91.8%</div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Team Average</p>
                <span className="text-[11px] text-emerald-600 font-medium">✓ Exceeds benchmark</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ZONE 3: SECONDARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Quick Launch Shortcuts */}
        <Card className="border-slate-200/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Quick Workflow Initiation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/workflows">
                <Button variant="outline" size="sm" className="rounded-full text-xs hover:border-indigo-400">
                  + Travel & Expense
                </Button>
              </Link>
              <Link href="/workflows">
                <Button variant="outline" size="sm" className="rounded-full text-xs hover:border-indigo-400">
                  + Elevated IT Access Grant
                </Button>
              </Link>
              <Link href="/workflows">
                <Button variant="outline" size="sm" className="rounded-full text-xs hover:border-indigo-400">
                  + Vendor Onboarding
                </Button>
              </Link>
              <Link href="/workflows">
                <Button variant="secondary" size="sm" className="rounded-full text-xs text-indigo-700 font-semibold">
                  Browse All 4 Triggers →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Background Automations & Cron Monitor */}
        <Card className="border-slate-200/80">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-indigo-500" />
              Background Automations & Cron Sweeps
            </CardTitle>
            <span className="text-[10px]">No Noise Monitoring</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockCronSchedules.slice(0, 2).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-slate-800 font-semibold">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>{c.lastRunTime}</span>
                    <span className="inline-flex h-5 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-semibold text-emerald-800">✓ Passed</span>
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
