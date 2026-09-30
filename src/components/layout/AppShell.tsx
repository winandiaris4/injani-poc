"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  GitBranch,
  ShieldCheck,
  BarChart3,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Search,
  CheckCheck,
  FileSpreadsheet,
  ShieldAlert,
  Cpu,
  LogOut,
  AlertTriangle,
  Clock,
  ExternalLink,
  X,
  Check,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AnnotationProvider, useAnnotation } from "@/contexts/AnnotationContext";
import { AnnotationHeaderToggle } from "@/components/annotations/AnnotationHeaderToggle";
import { AnnotationPin } from "@/components/annotations/AnnotationPin";
import { AnnotationTourCard } from "@/components/annotations/AnnotationTourCard";
import { EvaluationWelcomeModal } from "@/components/annotations/EvaluationWelcomeModal";

interface AppShellProps {
  children: React.ReactNode;
}

export type PersonaType = "approver" | "requester" | "control_owner" | "automation_owner";

export interface PersonaProfile {
  name: string;
  email: string;
  initials: string;
  roleTitle: string;
  department: string;
  persona: PersonaType;
}

export const PERSONA_PROFILES: Record<PersonaType, PersonaProfile> = {
  approver: {
    name: "Aris Winandi",
    email: "aris@injani.internal",
    initials: "AW",
    roleTitle: "VP of Operations & Finance",
    department: "Executive Operations",
    persona: "approver",
  },
  requester: {
    name: "Sarah Jenkins",
    email: "sarah.j@injani.internal",
    initials: "SJ",
    roleTitle: "Lead Product Architect",
    department: "Product & Engineering",
    persona: "requester",
  },
  control_owner: {
    name: "Budi Santoso",
    email: "budi.s@injani.internal",
    initials: "BS",
    roleTitle: "Chief Information Security Officer",
    department: "Governance, Risk & Compliance",
    persona: "control_owner",
  },
  automation_owner: {
    name: "Alex Rivera",
    email: "alex.r@injani.internal",
    initials: "AR",
    roleTitle: "Principal Infrastructure Engineer",
    department: "Platform DevOps & SRE",
    persona: "automation_owner",
  },
};

export const PersonaContext = React.createContext<{
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
  profile: PersonaProfile;
}>({
  persona: "approver",
  setPersona: () => {},
  profile: PERSONA_PROFILES.approver,
});

function getNavItems(persona: PersonaType) {
  switch (persona) {
    case "approver":
      return [
        { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, dotColor: "" },
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: "3", dotColor: "bg-rose-500" },
        { label: "Workflows", href: "/workflows", icon: GitBranch, badge: null, dotColor: "" },
        { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: "2", dotColor: "bg-amber-500" },
        { label: "Insights", href: "/insights", icon: BarChart3, badge: null, dotColor: "" },
      ];
    case "requester":
      return [
        { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, dotColor: "" },
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: null, dotColor: "" },
        { label: "Workflows", href: "/workflows", icon: GitBranch, badge: "2", dotColor: "bg-foreground/70" },
        { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: null, dotColor: "" },
        { label: "Insights", href: "/insights", icon: BarChart3, badge: null, dotColor: "" },
      ];
    case "control_owner":
      return [
        { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, dotColor: "" },
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: "1", dotColor: "bg-amber-500" },
        { label: "Workflows", href: "/workflows", icon: GitBranch, badge: null, dotColor: "" },
        { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: "2", dotColor: "bg-rose-500" },
        { label: "Insights", href: "/insights", icon: BarChart3, badge: null, dotColor: "" },
      ];
    case "automation_owner":
      return [
        { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, dotColor: "" },
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: null, dotColor: "" },
        { label: "Workflows", href: "/workflows", icon: GitBranch, badge: "4", dotColor: "bg-emerald-500" },
        { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: "0", dotColor: "bg-emerald-500" },
        { label: "Insights", href: "/insights", icon: BarChart3, badge: null, dotColor: "" },
      ];
    default:
      return [
        { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, dotColor: "" },
        { label: "Inbox", href: "/inbox", icon: Inbox, badge: "3", dotColor: "bg-rose-500" },
        { label: "Workflows", href: "/workflows", icon: GitBranch, badge: null, dotColor: "" },
        { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: "2", dotColor: "bg-amber-500" },
        { label: "Insights", href: "/insights", icon: BarChart3, badge: null, dotColor: "" },
      ];
  }
}

export interface AppNotification {
  id: string;
  persona: PersonaType;
  title: string;
  description: string;
  time: string;
  category: string;
  priority: "urgent" | "warning" | "info" | "success";
  actionHref: string;
  actionLabel: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  // Approver
  {
    id: "notif-app-1",
    persona: "approver",
    title: "P1 SLA Breached: REQ-2026-081",
    description: "AWS Direct Connect 10Gbps ($42,000) exceeded 2h SLA threshold. Immediate review required.",
    time: "8m ago",
    category: "P1 SLA Breach",
    priority: "urgent",
    actionHref: "/inbox",
    actionLabel: "Triage in Inbox",
  },
  {
    id: "notif-app-2",
    persona: "approver",
    title: "Delegation Request from Dewi Lestari",
    description: "Dewi Lestari requested approval delegation authority for 5 CapEx batches during financial closeout.",
    time: "42m ago",
    category: "Delegation",
    priority: "warning",
    actionHref: "/inbox",
    actionLabel: "Review Delegation",
  },
  {
    id: "notif-app-3",
    persona: "approver",
    title: "Quarterly ISO27001 Access Audit Due",
    description: "Executive attestation required for 14 privileged IAM access grants within 7 days.",
    time: "2h ago",
    category: "Audit Milestone",
    priority: "info",
    actionHref: "/compliance",
    actionLabel: "View Controls",
  },

  // Requester
  {
    id: "notif-req-1",
    persona: "requester",
    title: "Stage 1 Cleared: CapEx REQ-2026-881",
    description: "Department Head has signed off on $128,000 GPU Cluster Expansion. Now awaiting VP Ops signature.",
    time: "15m ago",
    category: "Workflow Stage",
    priority: "success",
    actionHref: "/workflows",
    actionLabel: "Track Chain",
  },
  {
    id: "notif-req-2",
    persona: "requester",
    title: "Datadog License Provisioned",
    description: "IT Infrastructure auto-assigned 12 Enterprise APM seats requested under REQ-2026-077.",
    time: "3h ago",
    category: "Provisioning",
    priority: "success",
    actionHref: "/workflows",
    actionLabel: "View Details",
  },
  {
    id: "notif-req-3",
    persona: "requester",
    title: "Unsubmitted Draft Saved",
    description: "Draft for Snowflake Data Warehouse expansion was auto-saved yesterday at 18:40.",
    time: "Yesterday",
    category: "Draft",
    priority: "info",
    actionHref: "/workflows",
    actionLabel: "Resume Draft",
  },

  // Control Owner
  {
    id: "notif-ctrl-1",
    persona: "control_owner",
    title: "ISO27001 Access Review Expiry Window",
    description: "Continuous control ISO-A.9.2 expires in 6 days. Risk index elevated to 8.4 until re-attested.",
    time: "1h ago",
    category: "Policy Renewal",
    priority: "urgent",
    actionHref: "/compliance",
    actionLabel: "Start Renewal",
  },
  {
    id: "notif-ctrl-2",
    persona: "control_owner",
    title: "SOC2 Automated Telemetry Sweep",
    description: "24 of 24 zero-touch telemetry probes passed continuous verification. 0 drift detected.",
    time: "4h ago",
    category: "Evidence Verification",
    priority: "success",
    actionHref: "/compliance",
    actionLabel: "Inspect Evidence",
  },
  {
    id: "notif-ctrl-3",
    persona: "control_owner",
    title: "IAM Policy Drift Detected",
    description: "Staging cluster added unmapped service account outside Terraform drift baseline.",
    time: "6h ago",
    category: "GRC Radar",
    priority: "warning",
    actionHref: "/compliance",
    actionLabel: "Review Drift",
  },

  // Automation Owner
  {
    id: "notif-auto-1",
    persona: "automation_owner",
    title: "GRC Sweep Completed (142ms)",
    description: "Daily midnight continuous integrity sweep completed in 142ms. 24 controls verified green.",
    time: "25m ago",
    category: "Cron Telemetry",
    priority: "success",
    actionHref: "/compliance",
    actionLabel: "View Sweep Log",
  },
  {
    id: "notif-auto-2",
    persona: "automation_owner",
    title: "Weekly SOC2 Sweep Scheduled Tonight",
    description: "Next scheduled engine run at 00:00 UTC tonight (Cron: 0 0 * * 0).",
    time: "2h ago",
    category: "Scheduled Job",
    priority: "info",
    actionHref: "/compliance",
    actionLabel: "Trigger Run Now",
  },
  {
    id: "notif-auto-3",
    persona: "automation_owner",
    title: "Daemon Health All Green",
    description: "4 of 4 background sync workers healthy. Memory pressure nominal at 38%.",
    time: "5h ago",
    category: "Daemon Monitor",
    priority: "success",
    actionHref: "/insights",
    actionLabel: "Check Telemetry",
  },
];

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const [persona, setPersonaState] = useState<PersonaType>("approver");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const { setOnActionTrigger } = useAnnotation();

  const showGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4000);
  };

  const personaRef = React.useRef<PersonaType>(persona);
  React.useEffect(() => {
    personaRef.current = persona;
  }, [persona]);

  // Wire up annotation action triggers
  React.useEffect(() => {
    return setOnActionTrigger((actionType: string, payload?: string) => {
      if (actionType === "switch_persona") {
        const current = personaRef.current;
        const target: PersonaType =
          payload && payload !== current
            ? (payload as PersonaType)
            : current === "control_owner"
            ? "approver"
            : "control_owner";

        setPersona(target);

        const targetProfile = PERSONA_PROFILES[target];
        showGlobalToast(
          `Perspective switched to ${targetProfile.roleTitle} (${targetProfile.name}) — 2x2 cockpit rearranged!`
        );

        setTimeout(() => {
          const banner = document.getElementById("persona-context-banner");
          if (banner) {
            banner.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 50);
      }
      if (actionType === "scroll_radar") {
        const el = document.getElementById(payload || "compliance-radar");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
      if (actionType === "open_command_palette") {
        setIsCommandPaletteOpen(true);
      }
    });
  }, [setOnActionTrigger]);

  const navItems = getNavItems(persona);

  // Close notifications on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Sync with localStorage on client mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("injani_persona") as PersonaType;
      if (saved && PERSONA_PROFILES[saved]) {
        setPersonaState(saved);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const setPersona = (p: PersonaType) => {
    setPersonaState(p);
    try {
      localStorage.setItem("injani_persona", p);
    } catch (e) {
      // Ignore
    }
  };

  const profile = PERSONA_PROFILES[persona] || PERSONA_PROFILES.approver;

  const currentNotifications = INITIAL_NOTIFICATIONS.filter((n) => n.persona === persona);
  const unreadNotifications = currentNotifications.filter((n) => !readNotificationIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  const markAllAsRead = () => {
    setReadNotificationIds((prev) => Array.from(new Set([...prev, ...currentNotifications.map((n) => n.id)])));
  };

  const markOneAsRead = (id: string) => {
    setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Dedicated standalone view for login / identity gateway
  if (pathname === "/login") {
    return (
      <PersonaContext.Provider value={{ persona, setPersona, profile }}>
        {children}
      </PersonaContext.Provider>
    );
  }

  return (
    <PersonaContext.Provider value={{ persona, setPersona, profile }}>
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="icon" className="border-r border-border">
          {/* Brand / Workspace Header */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="hover:bg-accent/60">
                  <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-foreground text-background font-semibold text-xs">
                    ⬡
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-semibold text-foreground">Injani Systems</span>
                    <span className="truncate text-[10px] text-muted-foreground font-mono">BPA &amp; Controls</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navigation Menu */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground flex items-center justify-between pr-2">
                <span>Modules</span>
                <AnnotationPin pinId="key-1" label="IA" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.label}
                          render={<Link href={item.href} />}
                          className={`text-xs ${
                            isActive
                              ? "font-semibold text-foreground bg-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          }`}
                        >
                          <Icon className={`size-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge className="flex items-center gap-1 bg-muted text-foreground border border-border/80 text-[10px] font-mono px-1.5 py-0.5 rounded">
                            {item.dotColor && <span className={`size-1.5 rounded-full ${item.dotColor}`} />}
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Persona Preset Card */}
            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                Active Perspective
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="mx-2 rounded-lg border border-border bg-card/60 p-3 space-y-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold capitalize text-foreground">
                        {persona.replace("_", " ")}
                      </span>
                    </div>
                    <span className="size-1.5 rounded-full bg-foreground/60" />
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {persona === "approver" && "Prioritizes SLA breach triage & pending sign-offs."}
                    {persona === "requester" && "Tracks submitted requests & active reviewer stages."}
                    {persona === "control_owner" && "Monitors policy expiry windows & audit attestation."}
                    {persona === "automation_owner" && "Supervises cron jobs and scheduled sweeps."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-[11px] font-normal gap-1.5 hover:bg-accent text-muted-foreground hover:text-foreground"
                    onClick={() => setIsCustomizeOpen(true)}
                  >
                    <SlidersHorizontal className="size-3" />
                    Switch Perspective
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* User Profile Footer */}
          <SidebarFooter>
            <div className="flex items-center justify-between p-1.5 rounded-lg border border-border bg-card/60">
              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-muted text-[11px] font-mono text-foreground border border-border shrink-0">
                  {profile.initials}
                </div>
                <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                  <span className="truncate font-medium text-foreground">{profile.name}</span>
                  <span className="truncate text-[10px] text-muted-foreground font-mono">{profile.email}</span>
                </div>
              </div>
              <Link href="/login" title="Sign Out / Switch Identity via Gateway">
                <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground shrink-0">
                  <LogOut className="size-3.5" />
                </Button>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset>
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/90 backdrop-blur-md px-6 gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 size-7 text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-4" />
              <div
                onClick={() => setIsCommandPaletteOpen(true)}
                className="relative hidden md:flex items-center w-72 cursor-pointer group"
                title="Open Command Console (⌘K)"
              >
                <Search className="absolute left-2.5 size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <input
                  type="text"
                  placeholder="Search approvals, controls, workflows... (⌘K)"
                  readOnly
                  className="h-7 w-full rounded-md border border-input bg-muted/30 pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none cursor-pointer group-hover:border-foreground/40 group-hover:bg-accent/40 transition-colors"
                />
                <kbd className="absolute right-2 font-mono text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                  ⌘K
                </kbd>
              </div>
              <AnnotationPin pinId="key-7" label="Key 7: ⌘K" className="hidden md:inline-flex" />
            </div>

            <div className="flex items-center gap-2">
              <AnnotationHeaderToggle />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCustomizeOpen(true)}
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Customize Cockpit</span>
              </Button>

              {/* Notification Center Dropdown */}
              <div className="relative" ref={notificationRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  className={`relative size-7 transition-colors ${
                    isNotificationOpen
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Activity & Notifications"
                  title="Activity & Notifications"
                >
                  <Bell className="size-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-3 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                      <span className="relative flex size-2 rounded-full bg-rose-500" />
                    </span>
                  )}
                </Button>

                {isNotificationOpen && (
                  <div className="absolute right-0 top-9 mt-1.5 w-80 sm:w-96 rounded-xl border border-border bg-background shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-muted/40">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <Bell className="size-3.5 text-foreground" />
                          Activity Stream
                        </span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            unreadCount > 0
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {unreadCount > 0 ? `${unreadCount} unread` : "All read"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="text-[11px] text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors"
                          >
                            <Check className="size-3" />
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Active Perspective Context Strip */}
                    <div className="flex items-center justify-between px-3.5 py-1.5 bg-muted/20 border-b border-border/60 text-[10px] text-muted-foreground font-mono">
                      <span className="truncate max-w-[220px]">Role: {profile.roleTitle}</span>
                      <span className="uppercase text-[9px] font-semibold text-foreground/80 tracking-wider">
                        {persona.replace("_", " ")}
                      </span>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-border/50">
                      {currentNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">
                          No notifications available.
                        </div>
                      ) : (
                        currentNotifications.map((notif) => {
                          const isUnread = !readNotificationIds.includes(notif.id);
                          return (
                            <div
                              key={notif.id}
                              className={`p-3 transition-colors ${
                                isUnread
                                  ? "bg-accent/40 hover:bg-accent/70"
                                  : "bg-background hover:bg-muted/30 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 shrink-0">
                                  {notif.priority === "urgent" && (
                                    <div className="size-6 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600">
                                      <AlertTriangle className="size-3.5" />
                                    </div>
                                  )}
                                  {notif.priority === "warning" && (
                                    <div className="size-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                                      <Clock className="size-3.5" />
                                    </div>
                                  )}
                                  {notif.priority === "success" && (
                                    <div className="size-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                                      <CheckCircle2 className="size-3.5" />
                                    </div>
                                  )}
                                  {notif.priority === "info" && (
                                    <div className="size-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                                      <ShieldAlert className="size-3.5" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <span
                                        className={`text-xs leading-snug truncate ${
                                          isUnread
                                            ? "font-semibold text-foreground"
                                            : "font-medium text-foreground/80"
                                        }`}
                                      >
                                        {notif.title}
                                      </span>
                                      {isUnread && (
                                        <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
                                      )}
                                    </div>
                                    <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                                      {notif.time}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    {notif.description}
                                  </p>

                                  <div className="flex items-center justify-between pt-1">
                                    <span className="font-mono text-[9px] text-muted-foreground/90 uppercase tracking-wide">
                                      {notif.category}
                                    </span>
                                    <Link
                                      href={notif.actionHref}
                                      onClick={() => {
                                        markOneAsRead(notif.id);
                                        setIsNotificationOpen(false);
                                      }}
                                      className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-foreground hover:underline"
                                    >
                                      {notif.actionLabel}
                                      <ExternalLink className="size-2.5" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-3.5 py-2 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Real-time Event Stream</span>
                      <Link
                        href="/compliance"
                        onClick={() => setIsNotificationOpen(false)}
                        className="hover:text-foreground underline underline-offset-2"
                      >
                        Audit Logs →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Separator orientation="vertical" className="h-4" />

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-[11px]">Role:</span>
                <span className="font-medium text-foreground capitalize text-xs">
                  {persona.replace("_", " ")}
                </span>
                <Link
                  href="/login"
                  title="Switch Persona via Gateway"
                  className="ml-1 text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  (Switch)
                </Link>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>

        {/* Persona Customization Dialog Modal (Minimalist Monochrome) */}
        {isCustomizeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                    <SlidersHorizontal className="size-4 text-muted-foreground" />
                    Customize Perspective — Persona Presets
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select your operational hat to auto-arrange dashboard widgets and priority queues.
                  </p>
                </div>
                <button
                  onClick={() => setIsCustomizeOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: "approver" as PersonaType,
                    title: "Approver",
                    desc: "P1 triage, SLA countdown timers, and batch review actions.",
                    icon: CheckCheck,
                    tag: "Urgency Driven",
                  },
                  {
                    id: "requester" as PersonaType,
                    title: "Requester",
                    desc: "Live approval chain visibility and rapid initiation shortcuts.",
                    icon: FileSpreadsheet,
                    tag: "Submission",
                  },
                  {
                    id: "control_owner" as PersonaType,
                    title: "Control Owner",
                    desc: "Continuous controls radar, renewal triggers, and policy drift logs.",
                    icon: ShieldAlert,
                    tag: "Governance",
                  },
                  {
                    id: "automation_owner" as PersonaType,
                    title: "Automation Owner",
                    desc: "Cron sweep health, Run Now triggers, and webhook sync telemetry.",
                    icon: Cpu,
                    tag: "Operations",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = persona === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setPersona(item.id);
                        setIsCustomizeOpen(false);
                      }}
                      className={`cursor-pointer rounded-lg border p-3.5 transition-all space-y-2 ${
                        isSelected
                          ? "border-foreground/80 bg-accent text-foreground shadow-2xs"
                          : "border-border bg-card/50 hover:border-foreground/30 hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground">
                          <Icon className="size-4 text-foreground" />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50">
                          {item.tag}
                        </span>
                      </div>
                      <div className="font-semibold text-xs flex items-center justify-between text-foreground">
                        <span>{item.title}</span>
                        {isSelected && <CheckCircle2 className="size-3.5 text-foreground" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[11px] text-muted-foreground">
                  Tier 1 One-Click Preset Active
                </span>
                <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => setIsCustomizeOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Global Toast Notification */}
        {globalToast && (
          <div className="fixed top-16 right-6 z-50 flex items-center gap-2 rounded-lg border border-border bg-foreground text-background px-4 py-2.5 text-xs shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{globalToast}</span>
          </div>
        )}

        {/* Floating Interactive Architecture Tour Card */}
        <AnnotationTourCard />

        {/* Evaluation Welcome Modal */}
        <EvaluationWelcomeModal />

        {/* Global Command Console (⌘K / Ctrl+K) */}
        <CommandPalette
          open={isCommandPaletteOpen}
          onOpenChange={setIsCommandPaletteOpen}
        />
      </SidebarProvider>
    </PersonaContext.Provider>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <AnnotationProvider>
      <AppShellInner>{children}</AppShellInner>
    </AnnotationProvider>
  );
}
