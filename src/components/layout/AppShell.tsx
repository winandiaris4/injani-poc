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

interface AppShellProps {
  children: React.ReactNode;
}

export type PersonaType = "approver" | "requester" | "control_owner" | "automation_owner";

export const PersonaContext = React.createContext<{
  persona: PersonaType;
  setPersona: (p: PersonaType) => void;
}>({
  persona: "approver",
  setPersona: () => {},
});

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, dotColor: "" },
  { label: "Inbox", href: "/inbox", icon: Inbox, badge: "3", dotColor: "bg-rose-500" },
  { label: "Workflows", href: "/workflows", icon: GitBranch, badge: null, dotColor: "" },
  { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: "2", dotColor: "bg-amber-500" },
  { label: "Insights", href: "/insights", icon: BarChart3, badge: null, dotColor: "" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [persona, setPersona] = useState<PersonaType>("approver");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
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
              <SidebarGroupLabel className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                Modules
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Aris Winandi" className="hover:bg-accent/60">
                  <div className="flex aspect-square size-7 items-center justify-center rounded-md bg-muted text-[11px] font-mono text-foreground border border-border">
                    AW
                  </div>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-medium text-foreground">Aris Winandi</span>
                    <span className="truncate text-[10px] text-muted-foreground font-mono">aris@injani.internal</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset>
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background/90 backdrop-blur-md px-4 gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 size-7 text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="h-4" />
              <div className="relative hidden md:flex items-center w-72">
                <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search approvals, controls, workflows... (⌘K)"
                  readOnly
                  className="h-7 w-full rounded-md border border-input bg-muted/30 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCustomizeOpen(true)}
                className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="size-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Customize Cockpit</span>
              </Button>

              <Button variant="ghost" size="icon" className="relative size-7 text-muted-foreground hover:text-foreground">
                <Bell className="size-3.5" />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="text-[11px]">Role:</span>
                <span className="font-medium text-foreground capitalize text-xs">
                  {persona.replace("_", " ")}
                </span>
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
      </SidebarProvider>
    </PersonaContext.Provider>
  );
}
