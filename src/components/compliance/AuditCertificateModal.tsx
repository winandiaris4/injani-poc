"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Printer,
  Download,
  FileText,
  Lock,
  ExternalLink,
  QrCode,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request?: {
    id: string;
    title: string;
    category?: string;
    amount?: string;
    requester?: string;
    department?: string;
    submittedAt?: string;
  } | null;
}

export function AuditCertificateModal({
  open,
  onOpenChange,
  request,
}: AuditCertificateModalProps) {
  const [copied, setCopied] = useState(false);

  const certId = `CERT-2026-${request?.id?.replace("REQ-", "") || "881"}-BPA`;
  const sha256Hash = "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069";

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-w-full">
        {/* Certificate Modal Top Header (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-muted/40 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Cryptographic Audit Package &amp; Compliance Certificate</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Certificate Document Canvas (Printable Area) */}
        <div className="p-8 space-y-6 bg-card text-foreground print:bg-white print:text-black">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-foreground/80">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded bg-foreground text-background font-mono text-xs font-bold print:border print:border-black">
                  ⬡
                </div>
                <span className="font-bold text-base tracking-tight text-foreground uppercase">
                  Injani Continuous Controls &amp; BPA
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono print:text-gray-600">
                Independent Digital Ledger • Continuous Attestation Platform
              </p>
              <p className="text-[10px] text-muted-foreground/80 font-mono">
                Jurisdiction: Statutory SOX §404 / ISO/IEC 27001:2022 Clause §9.2
              </p>
            </div>

            {/* Verification Stamp Badge & QR Code */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Mock SVG QR Code */}
              <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-border bg-background shadow-2xs">
                <svg className="size-14 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-2v-2h-2v-2zm2 2h2v2h-2v-2zm-6-2h2v4h-2v-4zm0-2h2v2h-2v-2z" />
                </svg>
                <span className="text-[8px] font-mono text-muted-foreground mt-0.5">SCAN TO VERIFY</span>
              </div>

              <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-emerald-600 dark:text-emerald-400">
                <span className="block font-mono text-[9px] uppercase tracking-wider font-bold">Status</span>
                <span className="font-semibold text-xs flex items-center justify-center gap-1 mt-0.5">
                  <CheckCircle2 className="size-3.5" /> VERIFIED
                </span>
                <span className="block font-mono text-[8px] opacity-80 mt-0.5">TAMPER-PROOF</span>
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center py-2 space-y-1">
            <h1 className="text-lg font-bold tracking-tight text-foreground uppercase">
              Formal Certificate of Multi-Tier Audit Attestation
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Certificate UUID: <strong className="text-foreground">{certId}</strong>
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg border border-border bg-muted/20 text-xs">
            <div>
              <span className="text-[10px] font-mono text-muted-foreground block uppercase">Request ID</span>
              <span className="font-mono font-bold text-foreground text-xs">{request?.id || "REQ-2026-881"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground block uppercase">Category</span>
              <span className="font-medium text-foreground text-xs">{request?.category || "Capital Expenditure"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground block uppercase">Authorized Amount</span>
              <span className="font-mono font-bold text-foreground text-xs">{request?.amount || "Rp 320,000,000"}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted-foreground block uppercase">Attestation Date</span>
              <span className="font-mono text-foreground text-xs">{request?.submittedAt || "28 Sep 2026"}</span>
            </div>
          </div>

          {/* Request Narrative */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block font-semibold">
              Authorized Operational Initiative
            </span>
            <div className="p-3 rounded-md border border-border/80 bg-background text-xs text-foreground font-medium">
              {request?.title || "CapEx — Secondary AWS Kubernetes Cluster Expansion Q4"}
            </div>
          </div>

          {/* Multi-Tier Chain of Custody & Digital Signatures */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block font-semibold">
              Multi-Tier Digital Signature Ledger (Chain of Custody)
            </span>

            <div className="divide-y divide-border rounded-lg border border-border bg-background overflow-hidden text-xs">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-xs">Stage 1: Department Head Endorsement</span>
                    <span className="text-[11px] text-muted-foreground">Bambang Soediro • VP of Engineering</span>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-muted-foreground">
                  <span>Ed25519-Signed: 28 Sep 2026, 14:45 WIB</span>
                  <span className="block text-emerald-600 font-medium">✓ Cryptographically Valid</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-xs">Stage 2: Cost Center Budget Custodian</span>
                    <span className="text-[11px] text-muted-foreground">Citra Maulana • Finance &amp; Procurement Controller</span>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-muted-foreground">
                  <span>Ed25519-Signed: 28 Sep 2026, 17:12 WIB</span>
                  <span className="block text-emerald-600 font-medium">✓ Budget Allocation Reserved</span>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between bg-accent/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 items-center justify-center rounded-full bg-foreground text-background font-mono text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-xs">Stage 3: Executive Co-Signatory Attestation</span>
                    <span className="text-[11px] text-muted-foreground">Aris Winandi • VP of Operations &amp; Finance</span>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-muted-foreground">
                  <span>RSA-4096 Signed: 29 Sep 2026, 09:30 WIB</span>
                  <span className="block text-foreground font-semibold">✓ Executive Authority Bound</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Ledger Fingerprint */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Lock className="size-3 text-muted-foreground" />
                Immutable SHA-256 Proof of Ledger
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground hover:underline transition-colors print:hidden"
              >
                {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy Hash"}
              </button>
            </div>
            <code className="block break-all bg-background p-2 rounded border border-border text-[10px] text-muted-foreground font-mono select-all">
              {sha256Hash}
            </code>
          </div>
        </div>

        {/* Modal Action Footer (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-muted/30 print:hidden">
          <span className="text-[11px] text-muted-foreground font-mono">
            Signed under ISO/IEC 27001:2022 &amp; SOX §404
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleCopyHash}
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              {copied ? "Hash Copied!" : "Copy SHA-256"}
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-8 text-xs gap-1.5 font-medium shadow-2xs"
              onClick={handlePrint}
            >
              <Printer className="size-3.5" />
              Print / Save PDF Package
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
