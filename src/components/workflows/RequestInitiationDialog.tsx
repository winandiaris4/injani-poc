"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  FileText,
  AlertTriangle,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Clock,
  User,
  Building,
  DollarSign,
  ArrowRight,
  Layers,
  Sparkles,
  Paperclip,
  Trash2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaContext } from "@/components/layout/AppShell";
import { UserSubmittedRequest } from "@/data/mockData";

interface RequestInitiationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTemplateId?: string | null;
  onSubmitRequest: (newReq: UserSubmittedRequest) => void;
  onSaveDraft?: (newReq: UserSubmittedRequest) => void;
}

export function RequestInitiationDialog({
  open,
  onOpenChange,
  initialTemplateId,
  onSubmitRequest,
  onSaveDraft,
}: RequestInitiationDialogProps) {
  const { persona, profile } = React.useContext(PersonaContext);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("CapEx");
  const [priority, setPriority] = useState<"P1" | "P2" | "P3">("P2");
  const [currency, setCurrency] = useState<"IDR" | "USD">("IDR");
  const [amountInput, setAmountInput] = useState<string>("120000000");
  const [costCenter, setCostCenter] = useState<string>("CC-ENG-402 (Platform Infrastructure)");
  const [justification, setJustification] = useState("");
  const [attachments, setAttachments] = useState<string[]>([
    "Vendor_Quotation_PT_Maju.pdf",
  ]);

  // Synchronize initial category / template when opened
  useEffect(() => {
    if (!open) return;

    if (initialTemplateId === "WF-M01") {
      setCategory("Travel & Expense");
      setTitle("Q4 Regional Conference & Client Onsite Travel Allowance");
      setCurrency("IDR");
      setAmountInput("28500000");
      setJustification("Executive travel and lodging for 3 team members to attend Cloud Expo Jakarta 2026.");
    } else if (initialTemplateId === "WF-M02") {
      setCategory("IT Access");
      setTitle("Elevated Bastion & Production PostgreSQL Read Replica Access");
      setCurrency("USD");
      setAmountInput("0");
      setJustification("Root-cause investigation of Q3 database locking incidents under ISO27001 §9.2 policy.");
    } else if (initialTemplateId === "WF-M03") {
      setCategory("CapEx");
      setTitle("CapEx — High-Throughput Kubernetes Worker Nodes Expansion");
      setCurrency("IDR");
      setAmountInput("340000000");
      setJustification("Expanding AWS EKS cluster with 8x c6i.4xlarge nodes to absorb 40% Q4 transactional traffic surge.");
    } else if (initialTemplateId === "WF-M04") {
      setCategory("Procurement");
      setTitle("Vendor Procurement — Cloudflare Enterprise DDoS & Bot Management");
      setCurrency("USD");
      setAmountInput("48000");
      setJustification("Annual procurement agreement for web application firewall and CDN acceleration.");
    } else {
      // Default blank request
      setTitle("CapEx — Secondary AWS Cloud Infrastructure Expansion");
      setCategory("CapEx");
      setCurrency("IDR");
      setAmountInput("150000000");
      setJustification("Provisioning multi-zone standby instances for business continuity & disaster recovery.");
    }
  }, [open, initialTemplateId]);

  // Numeric parsing for rule engine
  const numericAmount = useMemo(() => {
    const cleaned = amountInput.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  }, [amountInput]);

  // Dynamic Policy Rules Computation
  const policyTriggers = useMemo(() => {
    const isHighValue =
      (currency === "IDR" && numericAmount >= 100_000_000) ||
      (currency === "USD" && numericAmount >= 10_000);

    const isITAccess = category === "IT Access";
    const isProcurement = category === "Procurement";

    return {
      isHighValue,
      isITAccess,
      isProcurement,
      requiresDualExec: isHighValue && category === "CapEx",
    };
  }, [currency, numericAmount, category]);

  // Dynamic Approval Chain Simulation
  const simulatedChain = useMemo(() => {
    const chain: { step: number; role: string; actor: string; condition: string }[] = [];

    // Step 1: Always Line Manager
    chain.push({
      step: 1,
      role: "Direct Department Head",
      actor: "Bambang Soediro (VP Engineering)",
      condition: "Standard First-Line Sign-off",
    });

    // Step 2: Conditional on Category
    if (policyTriggers.isITAccess) {
      chain.push({
        step: 2,
        role: "Principal Security Architect",
        actor: "Citra Maulana (Lead SecOps)",
        condition: "ISO27001 Access Governance Rule",
      });
    } else if (policyTriggers.isProcurement) {
      chain.push({
        step: 2,
        role: "Procurement & Legal Counsel",
        actor: "Sari Wulandari (Procurement Ops)",
        condition: "Vendor NDA & Commercial Terms",
      });
    } else {
      chain.push({
        step: 2,
        role: "Budget Custodian",
        actor: "Finance Controller Team",
        condition: "Cost Center Allocation Check",
      });
    }

    // Step 3: High value threshold trigger
    if (policyTriggers.isHighValue) {
      chain.push({
        step: 3,
        role: "VP of Operations & Finance",
        actor: "Aris Winandi (Executive Approver)",
        condition: "Rule POL-FIN-02 (> Rp 100M / $10k)",
      });
    }

    // Step 4: Executive Dual Attestation
    if (policyTriggers.requiresDualExec) {
      chain.push({
        step: 4,
        role: "Chief Info Security Officer",
        actor: "Budi Santoso (CISO)",
        condition: "Executive Risk & Architecture Attestation",
      });
    }

    return chain;
  }, [policyTriggers]);

  // Quick Justification Templates
  const QUICK_CHIPS = [
    "Production capacity threshold exceeded in Q3",
    "Mandatory vendor renewal with 12% multi-year discount",
    "Security incident root-cause remediation under ISO27001",
    "Scheduled infrastructure scalability expansion",
  ];

  const handleAddAttachment = (filename: string) => {
    if (!attachments.includes(filename)) {
      setAttachments([...attachments, filename]);
    }
  };

  const handleRemoveAttachment = (filename: string) => {
    setAttachments(attachments.filter((f) => f !== filename));
  };

  const handleFormSubmit = (asDraft = false) => {
    if (!title.trim() && !asDraft) return;

    const formattedAmount =
      numericAmount > 0
        ? currency === "IDR"
          ? `Rp ${numericAmount.toLocaleString("id-ID")}`
          : `$${numericAmount.toLocaleString("en-US")}`
        : undefined;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newRequestId = `REQ-2026-${randomSuffix}`;

    const newRequest: UserSubmittedRequest = {
      id: newRequestId,
      title: title.trim() || `Draft — ${category} Request`,
      category: category,
      submittedAt: "Just now",
      amount: formattedAmount,
      currentStage: asDraft ? "Draft" : simulatedChain[0]?.role || "Department Head",
      currentReviewer: asDraft ? "You (Draft)" : simulatedChain[0]?.actor || "Bambang Soediro",
      totalStages: simulatedChain.length,
      completedStages: 0,
      status: asDraft ? "draft" : "in_review",
      slaCountdown: priority === "P1" ? "Due in 24h" : priority === "P2" ? "Due in 48h" : "Due in 5d",
      timeline: simulatedChain.map((step, idx) => ({
        stage: step.role,
        actor: step.actor,
        status: idx === 0 && !asDraft ? "current" : "pending",
        comment: idx === 0 ? "Queued for signature" : undefined,
      })),
    };

    if (asDraft) {
      if (onSaveDraft) onSaveDraft(newRequest);
      else onSubmitRequest(newRequest);
    } else {
      onSubmitRequest(newRequest);
    }

    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Initiate Multi-Tier Request
                </h2>
                <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded border border-border text-muted-foreground uppercase font-semibold">
                  Smart Form Engine
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Standardized enterprise intake with automated cost-center routing and continuous compliance validation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 2-Column Responsive Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border max-h-[75vh] overflow-y-auto">
          {/* LEFT COLUMN: Form Inputs (7 Cols) */}
          <div className="lg:col-span-7 p-6 space-y-4">
            {/* Smart Requester Context Pill */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded bg-foreground text-background font-mono text-[10px] font-bold">
                  {profile.initials}
                </div>
                <div>
                  <span className="font-medium text-foreground">{profile.name}</span>
                  <span className="text-muted-foreground text-[11px] block">{profile.roleTitle}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-muted-foreground block">Cost Center</span>
                <span className="text-xs font-semibold text-foreground">{costCenter.split(" ")[0]}</span>
              </div>
            </div>

            {/* Request Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Request Title *</span>
                <span className="text-[10px] text-muted-foreground font-mono">Descriptive summary</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CapEx — GPU Server Rack Cluster Expansion Q4"
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Category & Priority Selector Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                >
                  <option value="CapEx">Capital Expenditure (CapEx)</option>
                  <option value="IT Access">Privileged IT Access / IAM</option>
                  <option value="Software License">Software License / SaaS</option>
                  <option value="Procurement">Vendor Procurement &amp; Contract</option>
                  <option value="Travel & Expense">Travel &amp; Expense Allowance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Urgency &amp; Target SLA</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "P1", label: "P1 (24h)", color: "text-rose-600 border-rose-300" },
                    { id: "P2", label: "P2 (48h)", color: "text-amber-600 border-amber-300" },
                    { id: "P3", label: "P3 (5d)", color: "text-muted-foreground border-border" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id as any)}
                      className={`h-8 rounded-md text-xs font-mono font-medium border transition-all ${
                        priority === p.id
                          ? "bg-accent border-foreground text-foreground font-semibold shadow-2xs"
                          : "bg-background text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Impact & Estimated Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Estimated Financial Commitment</span>
                <span className="text-[10px] text-muted-foreground">Used for threshold gating</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-24 h-8 rounded-md border border-input bg-background px-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground shrink-0"
                >
                  <option value="IDR">IDR (Rp)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <input
                  type="text"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0"
                  className="flex-1 h-8 rounded-md border border-input bg-background px-3 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              {/* Dynamic Policy Rule Banners */}
              {policyTriggers.isHighValue && (
                <div className="flex items-start gap-2 p-2.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs animate-in fade-in">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Threshold Rule POL-FIN-02 Active: </strong>
                    Amount exceeds standard operational limit. System has auto-injected VP Operations (Aris Winandi) into the approval chain.
                  </div>
                </div>
              )}

              {policyTriggers.isITAccess && (
                <div className="flex items-start gap-2 p-2.5 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs animate-in fade-in">
                  <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">ISO27001 Access Governance Rule: </strong>
                    Privileged access requests require SecOps attestation and will be restricted to a 90-day time-box.
                  </div>
                </div>
              )}
            </div>

            {/* Business Justification & Quick Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Business Justification &amp; Impact *</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {justification.length > 0 ? "✓ Provided" : "Required"}
                </span>
              </label>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setJustification(chip)}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted/40 hover:bg-accent hover:border-foreground/40 text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="State the technical necessity, business impact, and consequences of delay..."
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Supporting Document Attachments */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>Supporting Attachments ({attachments.length})</span>
                <span className="text-[10px] font-normal text-muted-foreground">PDF, XLSX, DOCX</span>
              </div>

              <div className="space-y-1.5">
                {attachments.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between px-3 py-1.5 rounded-md border border-border bg-muted/20 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono text-[11px] text-foreground truncate">{file}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file)}
                      className="text-muted-foreground hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}

                {/* Dropzone Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddAttachment("Vendor_Price_Proposal_Q4.pdf")}
                    className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 border border-dashed border-border px-2 py-1 rounded hover:bg-muted/40 transition-colors"
                  >
                    <UploadCloud className="size-3" />
                    Attach Vendor Quotation
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddAttachment("Architecture_Evaluation_Specs.docx")}
                    className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 border border-dashed border-border px-2 py-1 rounded hover:bg-muted/40 transition-colors"
                  >
                    <UploadCloud className="size-3" />
                    Attach Architecture Spec
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Approval Chain Simulation (5 Cols) */}
          <div className="lg:col-span-5 p-6 bg-muted/10 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    Live Approval Simulation
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {simulatedChain.length} Stages Generated
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Based on your selected category, financial threshold, and department cost-center, the routing engine will dispatch this sequential review chain:
              </p>

              {/* Dynamic Chain Stepper */}
              <div className="space-y-2 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {simulatedChain.map((step) => (
                  <div
                    key={step.step}
                    className="relative flex items-start gap-3 pl-1 text-xs"
                  >
                    <div className="flex size-6 items-center justify-center rounded-full bg-background border-2 border-foreground text-[10px] font-bold font-mono text-foreground z-10 shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1 rounded-md border border-border bg-card p-2.5 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-xs leading-none">
                          {step.role}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                          Stage {step.step}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground font-medium">
                        {step.actor}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        <span>•</span> {step.condition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Department Budget Health Indicator */}
              <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Q4 Department Budget</span>
                  <span className="font-mono font-semibold text-foreground">64% Consumed</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: "64%" }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Allocated: Rp 1.5B</span>
                  <span>Available: Rp 540M</span>
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center justify-between font-semibold text-foreground text-xs">
                <span>Estimated Resolution SLA:</span>
                <span className="font-mono">
                  {priority === "P1" ? "24 — 36 Hours" : priority === "P2" ? "48 — 72 Hours" : "3 — 5 Days"}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Upon submission, a unique immutable cryptographic tracking ID will be generated in the ledger.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span>Audit Trail: Immutable Log Enabled</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs border border-border/80 text-muted-foreground hover:text-foreground"
              onClick={() => handleFormSubmit(true)}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={title.trim().length === 0}
              className="h-8 text-xs gap-1.5 font-medium shadow-2xs"
              onClick={() => handleFormSubmit(false)}
            >
              <CheckCircle2 className="size-3.5" />
              Submit for Approval
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
