export interface ApprovalItem {
  id: string;
  title: string;
  category: string;
  priority: "P1" | "P2" | "P3";
  requester: {
    name: string;
    department: string;
    avatar: string;
  };
  amount?: string;
  status: "overdue" | "due_today" | "pending" | "approved" | "rejected";
  slaCountdown: string;
  isOverdue: boolean;
  submittedAt: string;
  justification: string;
  attachmentsCount: number;
  commentsCount: number;
  approvalChain: { step: string; role: string; status: "completed" | "current" | "upcoming" }[];
}

export interface ControlItem {
  id: string;
  code: string;
  name: string;
  framework: "ISO27001" | "SOC2" | "GDPR" | "SLA";
  owner: string;
  effectiveFrom: string;
  expiresAt: string;
  daysRemaining: number;
  status: "critical" | "warning" | "healthy";
}

export interface CronScheduleItem {
  id: string;
  name: string;
  syntax: string;
  frequency: string;
  nextRun: string;
  lastRunStatus: "success" | "failed" | "running";
  lastRunTime: string;
  isActive: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  type: "manual" | "cron" | "webhook" | "one_time";
  department: string;
  stepsCount: number;
  slaPerStep: string;
  avgDuration: string;
  monthlyUsage: number;
  description: string;
}

export const initialApprovals: ApprovalItem[] = [
  {
    id: "REQ-2026-081",
    title: "Capital Expenditure (CapEx) — Server Rack Q4 Infrastructure",
    category: "CapEx",
    priority: "P1",
    requester: { name: "Budi Santoso", department: "Engineering Infrastructure", avatar: "BS" },
    amount: "Rp 450,000,000",
    status: "overdue",
    slaCountdown: "Overdue by 3h 15m",
    isOverdue: true,
    submittedAt: "27 Sep 2026, 09:14",
    justification: "Urgent purchase of 3x enterprise virtualization nodes to support forecasted workload surge ahead of Q4 compliance audits and peak SLA throughput.",
    attachmentsCount: 3,
    commentsCount: 2,
    approvalChain: [
      { step: "1", role: "Engineering Lead", status: "completed" },
      { step: "2", role: "IT Security Lead", status: "completed" },
      { step: "3", role: "VP / Approver (You)", status: "current" },
      { step: "4", role: "CFO Final Sign-off", status: "upcoming" }
    ]
  },
  {
    id: "REQ-2026-082",
    title: "Vendor Procurement — PT Maju Sejahtera Cloud Security Contract",
    category: "Procurement",
    priority: "P1",
    requester: { name: "Sari Wulandari", department: "Procurement & Vendor Ops", avatar: "SW" },
    amount: "Rp 180,000,000",
    status: "overdue",
    slaCountdown: "Overdue by 1h 05m",
    isOverdue: true,
    submittedAt: "27 Sep 2026, 11:30",
    justification: "Annual renewal for continuous SOC2 endpoint penetration testing & SIEM license. Critical vendor with high SLA impact.",
    attachmentsCount: 4,
    commentsCount: 1,
    approvalChain: [
      { step: "1", role: "Procurement Specialist", status: "completed" },
      { step: "2", role: "Legal & Compliance", status: "completed" },
      { step: "3", role: "Department Head (You)", status: "current" }
    ]
  },
  {
    id: "REQ-2026-089",
    title: "Elevated IT Access Grant — Production Database Read Replica",
    category: "IT Access",
    priority: "P2",
    requester: { name: "Citra Maulana", department: "Data Platform", avatar: "CM" },
    status: "due_today",
    slaCountdown: "Due in 2h 15m",
    isOverdue: false,
    submittedAt: "28 Sep 2026, 08:00",
    justification: "Temporary 48-hour access to read replica DB for root cause investigation of Q3 reconciliation anomalies under ISO27001 policy AC-4.",
    attachmentsCount: 1,
    commentsCount: 0,
    approvalChain: [
      { step: "1", role: "Direct Supervisor", status: "completed" },
      { step: "2", role: "SecOps / Approver (You)", status: "current" }
    ]
  },
  {
    id: "REQ-2026-094",
    title: "Software License Entitlement — Datadog Enterprise APM",
    category: "Software License",
    priority: "P2",
    requester: { name: "Ahmad Rizky", department: "DevOps Core", avatar: "AR" },
    amount: "Rp 65,000,000",
    status: "due_today",
    slaCountdown: "Due in 4h 30m",
    isOverdue: false,
    submittedAt: "28 Sep 2026, 10:15",
    justification: "Scale up APM agent host licenses to monitor 20 new Kubernetes nodes for BPA event orchestrators.",
    attachmentsCount: 2,
    commentsCount: 3,
    approvalChain: [
      { step: "1", role: "DevOps Lead", status: "completed" },
      { step: "2", role: "Budget Custodian (You)", status: "current" }
    ]
  },
  {
    id: "REQ-2026-102",
    title: "Employee Onboarding Workflow — Senior Backend Engineer Access Pack",
    category: "HR & IT",
    priority: "P3",
    requester: { name: "Dewi Lestari", department: "People Operations", avatar: "DL" },
    status: "pending",
    slaCountdown: "Due in 18h",
    isOverdue: false,
    submittedAt: "28 Sep 2026, 13:00",
    justification: "Standard Day-1 developer onboarding credentials and GitHub enterprise seat assignment.",
    attachmentsCount: 2,
    commentsCount: 0,
    approvalChain: [
      { step: "1", role: "HR Ops", status: "completed" },
      { step: "2", role: "Team Lead (You)", status: "current" }
    ]
  }
];

export const mockControls: ControlItem[] = [
  {
    id: "CTRL-01",
    code: "ISO27001-ACCESS-REV-2026",
    name: "Bi-Annual Privileged IT Access Audit & User Attestation",
    framework: "ISO27001",
    owner: "Aris Winandi",
    effectiveFrom: "04 Oct 2025",
    expiresAt: "04 Oct 2026",
    daysRemaining: 6,
    status: "critical"
  },
  {
    id: "CTRL-02",
    code: "SOC2-VENDOR-SLA-REVIEW",
    name: "Tier-1 Cloud Provider SLA & Security Compliance Assessment",
    framework: "SOC2",
    owner: "Aris Winandi",
    effectiveFrom: "18 Oct 2025",
    expiresAt: "18 Oct 2026",
    daysRemaining: 20,
    status: "warning"
  },
  {
    id: "CTRL-03",
    code: "GDPR-DPIA-RETENTION-SWEEP",
    name: "Data Privacy Impact Assessment & 90-Day PII Purge Routine",
    framework: "GDPR",
    owner: "Aris Winandi",
    effectiveFrom: "28 Oct 2025",
    expiresAt: "28 Oct 2026",
    daysRemaining: 30,
    status: "warning"
  },
  {
    id: "CTRL-04",
    code: "DATA-INTEGRITY-RECONCILIATION",
    name: "Core Ledger & ERP Automated Integrity Check",
    framework: "SLA",
    owner: "Aris Winandi",
    effectiveFrom: "15 Jan 2026",
    expiresAt: "15 Jan 2027",
    daysRemaining: 109,
    status: "healthy"
  }
];

export const mockCronSchedules: CronScheduleItem[] = [
  {
    id: "CRON-01",
    name: "daily-data-integrity-check",
    syntax: "0 0 * * *",
    frequency: "Daily at midnight (00:00 WIB)",
    nextRun: "Tonight 00:00",
    lastRunStatus: "success",
    lastRunTime: "3h ago",
    isActive: true
  },
  {
    id: "CRON-02",
    name: "weekly-soc2-access-sweep",
    syntax: "0 9 * * MON",
    frequency: "Weekly Mondays at 09:00 WIB",
    nextRun: "Mon 09:00",
    lastRunStatus: "success",
    lastRunTime: "6d ago",
    isActive: true
  },
  {
    id: "CRON-03",
    name: "monthly-vendor-sla-audit",
    syntax: "0 0 1 * *",
    frequency: "1st of every month",
    nextRun: "01 Oct 00:00",
    lastRunStatus: "success",
    lastRunTime: "1 Sep",
    isActive: true
  },
  {
    id: "CRON-04",
    name: "ad-hoc-audit-db-cleanup",
    syntax: "0 2 * * SUN",
    frequency: "Sundays at 02:00 WIB",
    nextRun: "Sun 02:00",
    lastRunStatus: "failed",
    lastRunTime: "Yesterday",
    isActive: false
  }
];

export const mockWorkflowCatalog: WorkflowTemplate[] = [
  {
    id: "WF-M01",
    name: "Travel & Business Expense Request",
    type: "manual",
    department: "Finance · HR",
    stepsCount: 2,
    slaPerStep: "24h per step",
    avgDuration: "1.5 days",
    monthlyUsage: 142,
    description: "Standard domestic and international travel allowance approval with automated flight receipt reconciliation."
  },
  {
    id: "WF-M02",
    name: "Elevated IT Access & IAM Grant",
    type: "manual",
    department: "IT Security",
    stepsCount: 3,
    slaPerStep: "48h per step",
    avgDuration: "3.2 days",
    monthlyUsage: 68,
    description: "Multi-tier approval for production bastion host and database replica permissions under ISO27001 rules."
  },
  {
    id: "WF-M03",
    name: "Capital Expenditure (CapEx) Sign-off",
    type: "manual",
    department: "Finance · Engineering",
    stepsCount: 4,
    slaPerStep: "72h per step",
    avgDuration: "6.8 days",
    monthlyUsage: 25,
    description: "Heavy investment threshold approvals exceeding Rp 100M with automated budget code validation."
  },
  {
    id: "WF-M04",
    name: "Vendor Procurement & SLA Agreement",
    type: "manual",
    department: "Procurement",
    stepsCount: 5,
    slaPerStep: "48h per step",
    avgDuration: "5.4 days",
    monthlyUsage: 34,
    description: "New supplier onboarding, legal compliance check, NDA verification, and finance payment term binding."
  }
];
