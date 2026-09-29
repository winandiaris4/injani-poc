"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BarChart2, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Catmull-Rom cubic bezier smoothing for continuous wave curvature
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

export const slaWeeklyTelemetry = [
  { day: "Mon", total: 18, onTime: 16, breached: 2, rate: "88.9%" },
  { day: "Tue", total: 24, onTime: 22, breached: 2, rate: "91.6%" },
  { day: "Wed", total: 19, onTime: 18, breached: 1, rate: "94.7%" },
  { day: "Thu", total: 28, onTime: 23, breached: 5, rate: "82.1%" }, // Spike day
  { day: "Fri", total: 22, onTime: 20, breached: 2, rate: "90.9%" },
  { day: "Sat", total: 8, onTime: 8, breached: 0, rate: "100%" },
  { day: "Sun", total: 6, onTime: 6, breached: 0, rate: "100%" },
];

export const departmentBottlenecks = [
  { dept: "Legal Review", avgDays: 3.8, status: "warning", barWidth: "90%" },
  { dept: "Procurement / Finance", avgDays: 1.6, status: "normal", barWidth: "45%" },
  { dept: "IT Security", avgDays: 0.7, status: "good", barWidth: "20%" },
];

export interface SlaVelocityChartProps {
  badgeLabel?: string;
}

export function SlaVelocityChart({ badgeLabel }: SlaVelocityChartProps = {}) {
  const [chartMode, setChartMode] = useState<"wave" | "bars">("wave");
  const [hoveredIdx, setHoveredIdx] = useState<number>(3); // Default to Thu spike

  // Geometry for 7-day SVG spline wave
  const baselineY = 92;
  const topY = 16;
  const usableH = baselineY - topY; // 76px
  const maxTotal = 32;

  // 7 evenly spaced horizontal coordinates across 480px width
  const totalPoints = slaWeeklyTelemetry.map((item, idx) => {
    const x = 30 + idx * 70; // 30, 100, 170, 240, 310, 380, 450
    const y = baselineY - (item.total / maxTotal) * usableH;
    return { x, y };
  });

  const breachPoints = slaWeeklyTelemetry.map((item, idx) => {
    const x = 30 + idx * 70;
    const y = baselineY - (item.breached / 10) * 36;
    return { x, y };
  });

  const throughputLinePath = createSplinePath(totalPoints);
  const throughputAreaPath = `${throughputLinePath} L ${totalPoints[totalPoints.length - 1].x} ${baselineY} L ${totalPoints[0].x} ${baselineY} Z`;

  const breachLinePath = createSplinePath(breachPoints);
  const breachAreaPath = `${breachLinePath} L ${breachPoints[breachPoints.length - 1].x} ${baselineY} L ${breachPoints[0].x} ${baselineY} Z`;

  const activeItem = slaWeeklyTelemetry[hoveredIdx] || slaWeeklyTelemetry[3];

  return (
    <Card className="border-border shadow-2xs flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 flex-wrap">
            {chartMode === "wave" ? (
              <TrendingUp className="size-3.5 text-muted-foreground" />
            ) : (
              <BarChart2 className="size-3.5 text-muted-foreground" />
            )}
            <span>SLA Velocity &amp; Throughput</span>
            {badgeLabel && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent text-foreground font-semibold border border-border">
                {badgeLabel}
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs text-foreground font-medium mt-0.5">
            7-day operational completion vs. breach distribution
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {/* Wave vs Bars View Switcher */}
          <div className="flex items-center rounded-md border border-border bg-muted/30 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setChartMode("wave")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all ${
                chartMode === "wave"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Wave
            </button>
            <button
              type="button"
              onClick={() => setChartMode("bars")}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all ${
                chartMode === "bars"
                  ? "bg-background text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bars
            </button>
          </div>

          <Link href="/insights">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-1.5"
            >
              Deep Dive <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {/* Sub-header Legend / Telemetry Pill */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{activeItem.day}:</span>
            <span>{activeItem.onTime} on-time</span>
            {activeItem.breached > 0 ? (
              <span className="text-rose-600 font-semibold">• {activeItem.breached} breached</span>
            ) : (
              <span className="text-emerald-600">• 0 breach</span>
            )}
            <span className="text-emerald-600 font-medium">({activeItem.rate})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-xs bg-foreground" /> Volume
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-xs bg-rose-500" /> Breached
            </span>
          </div>
        </div>

        {/* CHART RENDER: WAVE SPLINE OR STACKED BARS */}
        {chartMode === "wave" ? (
          /* WAVE SPLINE CHART VIEW */
          <div className="w-full relative h-28 border-b border-border/80">
            <svg
              viewBox="0 0 480 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="slaVelocityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--foreground, #000)" stopOpacity="0.18" />
                  <stop offset="85%" stopColor="var(--foreground, #000)" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="var(--foreground, #000)" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="slaVelocityBreachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="25" x2="460" y2="25" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              <line x1="20" y1="58" x2="460" y2="58" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
              <line x1="20" y1="92" x2="460" y2="92" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />

              {/* 90% SLA Target Reference Line */}
              <line
                x1="20"
                y1="38"
                x2="460"
                y2="38"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeDasharray="4 3"
                strokeWidth="1.1"
              />
              <text x="455" y="34" textAnchor="end" className="text-[8px] font-mono fill-muted-foreground select-none">
                90% SLA Target
              </text>

              {/* Spline Areas & Lines */}
              <path d={throughputAreaPath} fill="url(#slaVelocityAreaGrad)" />
              <path
                d={throughputLinePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
              />

              <path d={breachAreaPath} fill="url(#slaVelocityBreachGrad)" />
              <path
                d={breachLinePath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1.6"
                strokeDasharray="3 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover Crosshair */}
              {hoveredIdx !== null && totalPoints[hoveredIdx] && (
                <line
                  x1={totalPoints[hoveredIdx].x}
                  y1="10"
                  x2={totalPoints[hoveredIdx].x}
                  y2="92"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
              )}

              {/* Data Points */}
              {totalPoints.map((pt, idx) => {
                const isHovered = hoveredIdx === idx;
                const brPt = breachPoints[idx];

                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onClick={() => setHoveredIdx(idx)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 4.5 : 3}
                      className={isHovered ? "fill-foreground stroke-background stroke-2" : "fill-foreground"}
                    />
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={8}
                        className="fill-none stroke-foreground opacity-30 stroke-1"
                      />
                    )}

                    {slaWeeklyTelemetry[idx].breached > 0 && (
                      <circle
                        cx={brPt.x}
                        cy={brPt.y}
                        r={isHovered ? 3.5 : 2.5}
                        className="fill-rose-500"
                      />
                    )}

                    {/* Generous touch/mouse target */}
                    <rect
                      x={pt.x - 30}
                      y="10"
                      width="60"
                      height="85"
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Day Labels */}
            <div className="flex items-center justify-between px-2 pt-0.5">
              {slaWeeklyTelemetry.map((item, idx) => (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => setHoveredIdx(idx)}
                  className={`text-[10px] font-mono transition-all px-1 rounded ${
                    hoveredIdx === idx
                      ? "font-semibold text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.day}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* CLASSIC 7-DAY STACKED BAR CHART VIEW */
          <div className="grid grid-cols-7 gap-2 h-28 items-end pt-2 pb-1 border-b border-border/80">
            {slaWeeklyTelemetry.map((item, idx) => {
              const maxBar = 30;
              const onTimePx = Math.max(Math.round((item.onTime / maxBar) * 52), 8);
              const breachedPx = item.breached > 0 ? Math.max(Math.round((item.breached / maxBar) * 52), 6) : 0;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.day}
                  className="group relative flex flex-col items-center justify-end h-full cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap rounded-md border border-border bg-foreground px-2 py-1 text-[10px] font-mono text-background shadow-md">
                      {item.day}: {item.onTime} on-time, {item.breached} breached ({item.rate})
                    </div>
                  )}

                  {/* Stacked Bar with guaranteed pixel height & minHeight */}
                  <div className="w-full h-16 flex flex-col justify-end gap-0.5 rounded-xs overflow-hidden">
                    {item.breached > 0 && (
                      <div
                        style={{ height: `${breachedPx}px`, minHeight: "5px" }}
                        className="w-full bg-rose-500 transition-all group-hover:opacity-85"
                      />
                    )}
                    <div
                      style={{ height: `${onTimePx}px`, minHeight: "8px" }}
                      className="w-full bg-foreground transition-all group-hover:opacity-85"
                    />
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground mt-1">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}

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
  );
}
