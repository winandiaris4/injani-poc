"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

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

export const weeklyVolumeTelemetry = [
  { week: "W34", onTime: 76, breached: 14, total: 90, rate: "84.4%" },
  { week: "W35", onTime: 84, breached: 11, total: 95, rate: "88.4%" },
  { week: "W36", onTime: 88, breached: 12, total: 100, rate: "88.0%" },
  { week: "W37", onTime: 104, breached: 8, total: 112, rate: "92.8%" },
  { week: "W38", onTime: 96, breached: 9, total: 105, rate: "91.4%" },
  { week: "W39 (Curr)", onTime: 118, breached: 7, total: 125, rate: "94.4%" },
];

export function ThroughputWaveChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number>(5); // default W39 (Curr)

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
            <path d={throughputAreaPath} fill="url(#throughputAreaGrad)" />
            <path
              d={throughputLinePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            />

            {/* Breach Area & Line */}
            <path d={breachAreaPath} fill="url(#breachAreaGrad)" />
            <path
              d={breachLinePath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.8"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
  );
}
