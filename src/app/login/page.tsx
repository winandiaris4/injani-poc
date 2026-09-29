"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  UserCheck,
  FileText,
  ShieldAlert,
  Cpu,
  Lock,
  Sparkles,
  Building2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonaContext, PersonaType, PERSONA_PROFILES } from "@/components/layout/AppShell";

interface PersonaOption {
  type: PersonaType;
  name: string;
  role: string;
  email: string;
  initials: string;
  icon: React.ElementType;
  badge: string;
  priorityText: string;
  statusCues: { label: string; color: string }[];
  highlightColor: string;
}

const personaOptions: PersonaOption[] = [
  {
    type: "approver",
    name: "Aris Winandi",
    role: "VP of Operations & Finance",
    email: "aris@injani.internal",
    initials: "AW",
    icon: UserCheck,
    badge: "Primary Executive Persona",
    priorityText: "Prioritizes immediate SLA breach triage, overdue sign-offs & multi-tier budget approvals.",
    statusCues: [
      { label: "2 Overdue P1", color: "bg-rose-500" },
      { label: "2 Due Today", color: "bg-amber-500" },
    ],
    highlightColor: "group-hover:border-foreground/40",
  },
  {
    type: "requester",
    name: "Sarah Jenkins",
    role: "Lead Product Architect",
    email: "sarah.j@injani.internal",
    initials: "SJ",
    icon: FileText,
    badge: "Operational Requester",
    priorityText: "Prioritizes tracking initiated CapEx & software requests, review progress, and catalog templates.",
    statusCues: [
      { label: "2 Awaiting Signers", color: "bg-foreground/70" },
      { label: "5 Completed This Week", color: "bg-emerald-500" },
    ],
    highlightColor: "group-hover:border-foreground/40",
  },
  {
    type: "control_owner",
    name: "Budi Santoso",
    role: "Chief Information Security Officer",
    email: "budi.s@injani.internal",
    initials: "BS",
    icon: ShieldAlert,
    badge: "GRC & Audit Owner",
    priorityText: "Prioritizes continuous control horizon foresight, ISO27001 renewals & audit obligations.",
    statusCues: [
      { label: "1 Expiring ≤7d", color: "bg-rose-500" },
      { label: "2 Renewal Windows", color: "bg-amber-500" },
    ],
    highlightColor: "group-hover:border-foreground/40",
  },
  {
    type: "automation_owner",
    name: "Alex Rivera",
    role: "Principal Infrastructure Engineer",
    email: "alex.r@injani.internal",
    initials: "AR",
    icon: Cpu,
    badge: "DevOps & Automations",
    priorityText: "Prioritizes background cron schedule health, webhook event listeners, and pipeline uptime.",
    statusCues: [
      { label: "4 Automated Sweeps", color: "bg-emerald-500" },
      { label: "0 Silent Failures", color: "bg-foreground/70" },
    ],
    highlightColor: "group-hover:border-foreground/40",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { setPersona } = useContext(PersonaContext);
  const [ssoEmail, setSsoEmail] = useState("aris@injani.internal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPersona = (type: PersonaType) => {
    setIsSubmitting(true);
    setPersona(type);
    setTimeout(() => {
      router.push("/");
    }, 150);
  };

  const handleSsoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Find matching persona or fallback to approver
    const matched = personaOptions.find(
      (p) => p.email.toLowerCase() === ssoEmail.trim().toLowerCase()
    );
    if (matched) {
      setPersona(matched.type);
    } else {
      setPersona("approver");
    }
    setTimeout(() => {
      router.push("/");
    }, 200);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-foreground selection:text-background">
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-sm shadow-2xs">
            ⬡
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground tracking-tight flex items-center gap-2">
              <span>Injani Systems</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                Phase 2 Prototype
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">BPA &amp; Continuous Controls Governance</p>
          </div>
        </div>

        {/* Instant Prototype Tour Bypass Button */}
        <Button
          onClick={() => handleSelectPersona("approver")}
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-border shadow-2xs font-medium hover:bg-background"
        >
          <span>Instant Prototype Tour</span>
          <ArrowRight className="size-3 text-muted-foreground" />
        </Button>
      </div>

      {/* Main Gateway Content Area */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8 space-y-8">
        {/* Hero Title & Subtext */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground font-mono">
            <Lock className="size-3 text-emerald-600" />
            <span>Enterprise Identity Gateway • SAML 2.0 / SSO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sign in to Injani Governance Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Choose a persona below to experience how dashboard telemetry, urgency queues, and navigation adapt dynamically to each corporate role.
          </p>
        </div>

        {/* SECTION 1: 1-CLICK DEMO PERSONA PROFILES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3.5" />
              <span>Select Persona Quick-Login (1-Click Demo)</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              4 distinct operational roles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {personaOptions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.type}
                  onClick={() => handleSelectPersona(item.type)}
                  className={`group relative rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:shadow-md cursor-pointer hover:border-foreground/30 ${item.highlightColor}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-muted text-foreground border border-border font-mono text-xs font-semibold group-hover:bg-foreground group-hover:text-background transition-colors">
                        {item.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground group-hover:underline">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">{item.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/80 shrink-0">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
                    {item.priorityText}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {item.statusCues.map((cue, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground"
                        >
                          <span className={`size-1.5 rounded-full ${cue.color}`} />
                          {cue.label}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground group-hover:translate-x-0.5 transition-transform">
                      Enter as {item.name.split(" ")[0]} <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: ENTERPRISE SSO SIMULATOR */}
        <Card className="border-border shadow-2xs bg-card/80 backdrop-blur-xs">
          <CardHeader className="pb-3 pt-4 px-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              Corporate Single Sign-On (Okta / Azure AD / SAML)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Simulate enterprise authentication via corporate email domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-4 pt-0">
            <form onSubmit={handleSsoSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  value={ssoEmail}
                  onChange={(e) => setSsoEmail(e.target.value)}
                  placeholder="e.g. aris@injani.internal"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 w-full sm:w-auto text-xs gap-1.5 px-4 font-medium"
              >
                <span>Continue with SSO</span>
                <ArrowRight className="size-3" />
              </Button>
            </form>

            {/* Quick Email Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] text-muted-foreground font-mono">
              <span className="text-[10px]">Autofill:</span>
              {personaOptions.map((opt) => (
                <button
                  key={opt.email}
                  type="button"
                  onClick={() => setSsoEmail(opt.email)}
                  className={`px-1.5 py-0.5 rounded border text-[10px] transition-colors ${
                    ssoEmail === opt.email
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.email}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Trust & Compliance Footer */}
      <div className="max-w-4xl mx-auto w-full pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-600" />
            <span>SOC2 Type II Certified</span>
          </span>
          <span className="text-border">•</span>
          <span>ISO/IEC 27001 Enforced</span>
          <span className="text-border">•</span>
          <span>Audit Stream Active</span>
        </div>
        <div>
          <span>PT Injani Systems • Jakarta, Indonesia</span>
        </div>
      </div>
    </div>
  );
}
