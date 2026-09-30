"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Inbox,
  GitBranch,
  ShieldCheck,
  BarChart3,
  UserCheck,
  Plus,
  Play,
  ArrowRight,
  FileText,
  ShieldAlert,
  Terminal,
  LogOut,
  X,
  Command,
} from "lucide-react";
import { PersonaContext, PersonaType } from "@/components/layout/AppShell";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  category: "Navigation" | "Actions" | "Perspectives" | "Records";
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { persona, setPersona } = React.useContext(PersonaContext);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Global Keyboard Listener (⌘K / Ctrl+K & Escape)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Define All Command Palette Items
  const allItems: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: "nav-dashboard",
      category: "Navigation",
      title: "Dashboard",
      subtitle: "Executive Cockpit & Triage Overview",
      icon: LayoutDashboard,
      badge: "G D",
      action: () => {
        router.push("/");
        onOpenChange(false);
      },
    },
    {
      id: "nav-inbox",
      category: "Navigation",
      title: "Inbox",
      subtitle: "Pending Multi-Tier Approvals & Delegations",
      icon: Inbox,
      badge: "G I",
      action: () => {
        router.push("/inbox");
        onOpenChange(false);
      },
    },
    {
      id: "nav-workflows",
      category: "Navigation",
      title: "Workflows",
      subtitle: "Initiation Catalog & My Requests Tracker",
      icon: GitBranch,
      badge: "G W",
      action: () => {
        router.push("/workflows");
        onOpenChange(false);
      },
    },
    {
      id: "nav-compliance",
      category: "Navigation",
      title: "Compliance Radar",
      subtitle: "Continuous ISO27001 & SOC2 Controls Matrix",
      icon: ShieldCheck,
      badge: "G C",
      action: () => {
        router.push("/compliance");
        onOpenChange(false);
      },
    },
    {
      id: "nav-insights",
      category: "Navigation",
      title: "Insights & SLA Telemetry",
      subtitle: "Bottleneck Analysis & Department Throughput",
      icon: BarChart3,
      badge: "G S",
      action: () => {
        router.push("/insights");
        onOpenChange(false);
      },
    },

    // Actions
    {
      id: "act-new-req",
      category: "Actions",
      title: "Initiate New Approval Request",
      subtitle: "Launch Smart Request Intake Form with Policy Simulation",
      icon: Plus,
      badge: "Action",
      badgeColor: "bg-foreground text-background",
      action: () => {
        router.push("/workflows");
        onOpenChange(false);
      },
    },
    {
      id: "act-run-sweep",
      category: "Actions",
      title: "Trigger Continuous Integrity Sweep",
      subtitle: "Execute zero-touch evidence collection across 24 controls",
      icon: Play,
      badge: "GRC Run",
      action: () => {
        router.push("/compliance");
        onOpenChange(false);
      },
    },
    {
      id: "act-gateway",
      category: "Actions",
      title: "Identity Gateway Switcher",
      subtitle: "Switch operator credentials or re-authenticate session",
      icon: LogOut,
      action: () => {
        router.push("/login");
        onOpenChange(false);
      },
    },

    // Perspectives
    {
      id: "per-approver",
      category: "Perspectives",
      title: "Switch Role: Approver (Aris Winandi)",
      subtitle: "VP of Operations & Finance • Triage & P1 Overdue SLA focus",
      icon: UserCheck,
      badge: persona === "approver" ? "Active" : undefined,
      badgeColor: persona === "approver" ? "bg-foreground text-background" : undefined,
      action: () => {
        setPersona("approver");
        onOpenChange(false);
      },
    },
    {
      id: "per-requester",
      category: "Perspectives",
      title: "Switch Role: Requester (Sarah Jenkins)",
      subtitle: "Lead Product Architect • Track submissions & approval progression",
      icon: UserCheck,
      badge: persona === "requester" ? "Active" : undefined,
      badgeColor: persona === "requester" ? "bg-foreground text-background" : undefined,
      action: () => {
        setPersona("requester");
        onOpenChange(false);
      },
    },
    {
      id: "per-control-owner",
      category: "Perspectives",
      title: "Switch Role: Control Owner (Budi Santoso)",
      subtitle: "Chief Information Security Officer • ISO27001 & SOC2 Governance",
      icon: UserCheck,
      badge: persona === "control_owner" ? "Active" : undefined,
      badgeColor: persona === "control_owner" ? "bg-foreground text-background" : undefined,
      action: () => {
        setPersona("control_owner");
        onOpenChange(false);
      },
    },
    {
      id: "per-automation-owner",
      category: "Perspectives",
      title: "Switch Role: Automation Owner (Alex Rivera)",
      subtitle: "Principal Infrastructure Engineer • Background Cron sweeps & Webhooks",
      icon: UserCheck,
      badge: persona === "automation_owner" ? "Active" : undefined,
      badgeColor: persona === "automation_owner" ? "bg-foreground text-background" : undefined,
      action: () => {
        setPersona("automation_owner");
        onOpenChange(false);
      },
    },

    // Records & Tickets
    {
      id: "rec-req-081",
      category: "Records",
      title: "REQ-2026-081: Server Rack Q4 Infrastructure",
      subtitle: "CapEx • Rp 450,000,000 • P1 SLA Breach Overdue",
      icon: FileText,
      badge: "P1 Overdue",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-300",
      action: () => {
        router.push("/inbox");
        onOpenChange(false);
      },
    },
    {
      id: "rec-req-082",
      category: "Records",
      title: "REQ-2026-082: PT Maju Sejahtera Cloud Security",
      subtitle: "Procurement • Rp 180,000,000 • Legal & SOC2 Binding",
      icon: FileText,
      badge: "P1 Overdue",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-300",
      action: () => {
        router.push("/inbox");
        onOpenChange(false);
      },
    },
    {
      id: "rec-iso-92",
      category: "Records",
      title: "ISO-A.9.2: Privileged Access Review",
      subtitle: "Continuous Control • High Risk 8.4 • Expires in 6 Days",
      icon: ShieldAlert,
      badge: "Expiring",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-300",
      action: () => {
        router.push("/compliance");
        onOpenChange(false);
      },
    },
    {
      id: "rec-soc2-cc6",
      category: "Records",
      title: "SOC2-CC6.1: Logical Access Controls & MFA",
      subtitle: "Continuous Control • 24/24 Probes Healthy • Low Risk 1.8",
      icon: ShieldCheck,
      badge: "Healthy",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
      action: () => {
        router.push("/compliance");
        onOpenChange(false);
      },
    },
  ], [router, onOpenChange, persona, setPersona]);

  // Filter items based on user query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const lower = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.subtitle?.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [allItems, query]);

  // Group filtered items by category
  const categories = useMemo(() => {
    const cats: { [cat: string]: CommandItem[] } = {};
    filteredItems.forEach((item) => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, [filteredItems]);

  // Keyboard navigation within filtered list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const activeElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-background">
          <Search className="size-4 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search records, or switch roles... (↑↓ to navigate)"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground p-1 text-xs"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
              ESC
            </kbd>
          )}
        </div>

        {/* Scrollable Results List */}
        <div ref={listRef} className="max-h-96 overflow-y-auto p-2 divide-y divide-border/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
              <Command className="size-6 mx-auto text-muted-foreground/60 mb-2" />
              <p className="font-medium text-foreground">No matching commands or records</p>
              <p className="text-[11px] text-muted-foreground">
                Try searching for &quot;CapEx&quot;, &quot;Approver&quot;, &quot;ISO&quot;, or &quot;Workflows&quot;
              </p>
            </div>
          ) : (
            Object.entries(categories).map(([categoryName, items]) => (
              <div key={categoryName} className="py-1.5 first:pt-0 last:pb-0">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  {categoryName}
                </div>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const currentIndex = flatIndex++;
                    const isSelected = selectedIndex === currentIndex;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        data-index={currentIndex}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        onClick={item.action}
                        className={`group flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all text-xs ${
                          isSelected
                            ? "bg-accent text-foreground shadow-2xs font-medium"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex size-6 items-center justify-center rounded-md border shrink-0 transition-colors ${
                              isSelected
                                ? "bg-foreground text-background border-foreground"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            <Icon className="size-3.5" />
                          </div>
                          <div className="min-w-0 truncate">
                            <div className="text-xs text-foreground font-medium truncate flex items-center gap-1.5">
                              <span>{item.title}</span>
                            </div>
                            {item.subtitle && (
                              <div className="text-[11px] text-muted-foreground truncate">
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {item.badge && (
                            <span
                              className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                                item.badgeColor
                                  ? item.badgeColor
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          {isSelected && (
                            <ArrowRight className="size-3 text-foreground animate-in slide-in-from-left-1 duration-150" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-background px-1 py-0.5 rounded border border-border">↑</kbd>
              <kbd className="bg-background px-1 py-0.5 rounded border border-border">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-background px-1.5 py-0.5 rounded border border-border">↵</kbd>
              <span>Execute</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-background px-1.5 py-0.5 rounded border border-border">ESC</kbd>
              <span>Close</span>
            </span>
          </div>
          <span className="hidden sm:inline">Injani Command Console v2.4</span>
        </div>
      </div>
    </div>
  );
}
