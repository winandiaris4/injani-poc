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
  { label: "Dashboard", href: "/", icon: LayoutDashboard, badge: null, badgeColor: "" },
  { label: "Inbox", href: "/inbox", icon: Inbox, badge: "3", badgeColor: "bg-red-500 text-white" },
  { label: "Workflows", href: "/workflows", icon: GitBranch, badge: null, badgeColor: "" },
  { label: "Compliance", href: "/compliance", icon: ShieldCheck, badge: "2", badgeColor: "bg-amber-500 text-white" },
  { label: "Insights", href: "/insights", icon: BarChart3, badge: null, badgeColor: "" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [persona, setPersona] = useState<PersonaType>("approver");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="icon">
          {/* Brand / Workspace Header */}
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-xs">
                    ⬡
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sidebar-foreground">Injani Systems</span>
                    <span className="truncate text-[11px] text-muted-foreground">Continuous Controls</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navigation Menu */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge className={item.badgeColor}>
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
              <SidebarGroupLabel>Active Cockpit Role</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="mx-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3 space-y-2 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold capitalize text-sidebar-foreground">
                        {persona.replace("_", " ")}
                      </span>
                    </div>
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {persona === "approver" && "Prioritizes SLA breach triage & pending sign-offs."}
                    {persona === "requester" && "Tracks submitted requests and active reviewer stages."}
                    {persona === "control_owner" && "Monitors policy expiry windows & audit attestation."}
                    {persona === "automation_owner" && "Supervises cron jobs and scheduled sweeps."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-[11px] gap-1.5 bg-background shadow-xs hover:bg-accent"
                    onClick={() => setIsCustomizeOpen(true)}
                  >
                    <SlidersHorizontal className="size-3" />
                    Switch Role (Tier 1)
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* User Profile Footer */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Aris Winandi (Approver)">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted font-semibold text-xs border border-sidebar-border">
                    AW
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-sidebar-foreground">Aris Winandi</span>
                    <span className="truncate text-[11px] text-muted-foreground">aris@injani.internal</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset>
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur px-4 gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <div className="relative hidden md:flex items-center w-64">
                <Search className="absolute left-2.5 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search approvals, controls, workflows... (⌘K)"
                  readOnly
                  className="h-8 w-full rounded-md border border-input bg-muted/40 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomizeOpen(true)}
                className="h-8 gap-1.5 text-xs font-medium"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span className="hidden sm:inline">Customize Cockpit</span>
              </Button>

              <Button variant="ghost" size="icon" className="relative size-8">
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
              </Button>

              <Separator orientation="vertical" className="h-4" />

              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <span>Role:</span>
                <span className="font-semibold text-foreground capitalize">
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

        {/* Persona Customization Dialog Modal */}
        {isCustomizeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-xl rounded-xl border bg-background p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-primary" />
                    Customize Cockpit — Persona Presets (Tier 1)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select your operational role to instantly personalize your dashboard widget arrangement.
                  </p>
                </div>
                <button
                  onClick={() => setIsCustomizeOpen(false)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: "approver" as PersonaType,
                    title: "Approver",
                    desc: "P1 triage, SLA countdown countdowns, slide-over review drawer.",
                    icon: "🎯",
                    tag: "Urgency Focused",
                  },
                  {
                    id: "requester" as PersonaType,
                    title: "Requester",
                    desc: "My Requests tracker, live reviewer stage timeline, initiation quick links.",
                    icon: "📝",
                    tag: "Execution Focused",
                  },
                  {
                    id: "control_owner" as PersonaType,
                    title: "Control Owner",
                    desc: "Continuous controls radar, ≤7d / ≤30d renewal triggers, compliance logs.",
                    icon: "🛡️",
                    tag: "Governance Focused",
                  },
                  {
                    id: "automation_owner" as PersonaType,
                    title: "Automation Owner",
                    desc: "Cron schedules health, Run Now triggers, webhook sync monitor.",
                    icon: "⚙️",
                    tag: "Operations Focused",
                  },
                ].map((item) => {
                  const isSelected = persona === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setPersona(item.id);
                        setIsCustomizeOpen(false);
                      }}
                      className={`cursor-pointer rounded-lg border p-3.5 transition-all space-y-1.5 ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                          : "border-border hover:border-muted-foreground/40 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {item.tag}
                        </span>
                      </div>
                      <div className="font-semibold text-sm flex items-center justify-between">
                        <span>{item.title}</span>
                        {isSelected && <CheckCircle2 className="size-4 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-[11px] text-muted-foreground">
                  Tier 2 (drag-and-drop) & Tier 3 (custom filters) also available in full release.
                </span>
                <Button size="sm" onClick={() => setIsCustomizeOpen(false)}>
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
