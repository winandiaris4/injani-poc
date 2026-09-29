"use client";

import React from "react";
import { BarChart3, TrendingUp, AlertTriangle, Users, Award, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          SLA Reports & Bottleneck Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Read-only governance intelligence: cycle times, departmental bottlenecks, and audit history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Cycle Time</span>
            <CardTitle className="text-2xl font-bold text-slate-900">2.4 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 font-semibold">↓ 18% faster than last month</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall SLA Compliance</span>
            <CardTitle className="text-2xl font-bold text-slate-900">91.8%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500">Benchmark target: 90.0%</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Identified Bottlenecks</span>
            <CardTitle className="text-2xl font-bold text-amber-700">IT Sec Step 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-800 font-medium">Avg wait time: 41.2 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottlenecks Breakdown */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-900">Departmental SLA Adherence Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { dept: "People Operations (HR)", score: 98.2, status: "excellent" },
              { dept: "Finance & Accounts Payable", score: 94.5, status: "good" },
              { dept: "Legal & Corporate Compliance", score: 89.1, status: "warning" },
              { dept: "IT Security & Architecture", score: 82.4, status: "critical" }
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                <span className="font-semibold text-slate-800">{d.dept}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">{d.score}%</span>
                  <Badge variant={d.status === "critical" ? "destructive" : "secondary"}>
                    {d.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
