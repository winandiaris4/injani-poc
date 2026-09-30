export interface ChallengeAnnotation {
  id: string; // "key-1" | "key-2" | "key-3" | "key-4" | "key-5"
  stepNumber: number;
  badgeSymbol: string; // "❶", "❷", "❸", "❹", "❺"
  title: string;
  category: string;
  officialPrompt: string;
  designDecision: string;
  psychologicalRationale: string;
  rejectedAlternative: string;
  defenseDocRef: string;
  targetPage: string;
  actionLabel?: string;
  actionType?:
    | "navigate"
    | "switch_persona"
    | "open_drawer"
    | "open_cert"
    | "scroll_radar"
    | "open_smart_form"
    | "open_command_palette"
    | "open_delegation"
    | "scroll_bottlenecks";
  actionPayload?: string;
}

export const CHALLENGE_ANNOTATIONS: ChallengeAnnotation[] = [
  {
    id: "key-1",
    stepNumber: 1,
    badgeSymbol: "❶",
    title: "Information Architecture (IA)",
    category: "Navigation & Mental Models",
    officialPrompt:
      '"How would you structure the top-level navigation to accommodate all 8 modules without creating a confusing, bloated menu?"',
    designDecision:
      "Condensed 8 functional modules into 5 intent-driven top-level workspaces: Dashboard, Inbox, Workflows, Compliance, and Insights.",
    psychologicalRationale:
      "Users scan for intent ('Jobs-To-Be-Done'), not arbitrary feature names. Listing 8 flat items creates immediate cognitive fatigue (violating Miller's Law 7±2). Furthermore, 'Inbox' is deliberately elevated to a top-level workspace with a persistent numerical badge [3] rather than nested inside Workflows. This provides a guaranteed visibility barrier against SLA breaches.",
    rejectedAlternative:
      "Flat 8-item sidebar menu. Rejected because it overwhelms casual users with equal visual weight for low-frequency and high-frequency tasks, leading to missed approvals.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.1",
    targetPage: "/",
    actionLabel: "Inspect Inbox Badge [3]",
    actionType: "navigate",
    actionPayload: "/inbox",
  },
  {
    id: "key-2",
    stepNumber: 2,
    badgeSymbol: "❷",
    title: "Dashboard Hierarchy & The Persistent Fire Alarm",
    category: "Urgency vs. 30-Day Horizon",
    officialPrompt:
      '"What belongs on the primary Dashboard vs. Dedicated Workspaces? How do you visually balance immediate operational urgency (approvals due in 2 hours) against longer-term compliance obligations (a control expiring in 25 days)?"',
    designDecision:
      "The Dashboard acts strictly as an orientation and signal layer (never raw data dumps). A persistent, non-removable 'Urgent Actions Bar' sits permanently at the very top.",
    psychologicalRationale:
      "Immediate operational urgency (2-hour SLA countdowns) requires high-contrast Rose/Red alerts positioned in the primary F-pattern scan path (top-left). In contrast, 30-day compliance obligations reside in the horizon radar below without generating false panic. The Urgent Actions Bar serves as the enterprise 'Fire Alarm'—it cannot be dismissed or hidden by any user customization.",
    rejectedAlternative:
      "Full data tables directly on the dashboard or an entirely customizable canvas where users could delete their urgent approval cards. Both invite catastrophic SLA breaches.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.2",
    targetPage: "/",
    actionLabel: "View 30-Day Compliance Radar",
    actionType: "scroll_radar",
    actionPayload: "compliance-radar",
  },
  {
    id: "key-3",
    stepNumber: 3,
    badgeSymbol: "❸",
    title: "3-Tier Progressive Dashboard Customization",
    category: "Personalization Without Burden",
    officialPrompt:
      '"The Custom Dashboard Mechanism: How does the user customize their dashboard? Show us a pattern that empowers power users without burdening casual users with complex configuration."',
    designDecision:
      "Implemented a 3-tier progressive disclosure model: Tier 1 (1-Click Persona Presets), Tier 2 (Canvas Layout Arrangement), and Tier 3 (Per-Widget Scoped Settings).",
    psychologicalRationale:
      "Approximately 80% of enterprise operators are casual users who will never construct a layout from scratch. Persona Presets (Approver, Requester, Control Owner, Automation Owner) allow an operator to switch operational hats and reconfigure their entire 2x2 widget cockpit in under 5 seconds with zero cognitive overhead.",
    rejectedAlternative:
      "A monolithic, complex configuration modal exposing dozens of toggle switches. Casual users abandon it, while power users find it clunky.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.3",
    targetPage: "/",
    actionLabel: "Simulate Switch to Control Owner",
    actionType: "switch_persona",
    actionPayload: "control_owner",
  },
  {
    id: "key-4",
    stepNumber: 4,
    badgeSymbol: "❹",
    title: "Approver Velocity & Context-Preserving Drawer",
    category: "Batch Processing & Triage",
    officialPrompt:
      '"Demonstrate how an approver can quickly review requests and take action (e.g., batch processing, slide-over preview drawers, inline filters) without losing the context of compliance requirements."',
    designDecision:
      "Engineered an overlay Slide-Over Preview Drawer paired with an optimistic 'Auto-Advance' sequential processing engine in the /inbox workspace.",
    psychologicalRationale:
      "Full-page navigation destroys an approver's momentum, causes disorientation, and loses list scroll position. The slide-over drawer keeps the entire queue visible on the left while rendering deep inspection tabs (summary, attachments, policy checks, audit trail) on the right. Auto-Advance immediately transitions to the next item upon approval, enabling 10 sequential approvals in under 60 seconds.",
    rejectedAlternative:
      "Full-page detail views or inline table expansions that disrupt queue scanning and trigger unnecessary DOM reflows.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.4",
    targetPage: "/inbox",
    actionLabel: "Open Slide-Over Batch Drawer",
    actionType: "open_drawer",
    actionPayload: "first",
  },
  {
    id: "key-5",
    stepNumber: 5,
    badgeSymbol: "❺",
    title: "Enterprise Governance & Cryptographic Proofs",
    category: "Policy-as-Code & ISO/SOX Auditability",
    officialPrompt:
      '"The platform functions as a Continuous Controls Registry... ensuring business processes move fast while adhering to internal and external audit standards."',
    designDecision:
      "Connected the Smart Request Initiation Form to a live Dynamic Policy Engine (SOX 404 auto-routing for budgets ≥ $5,000) and generated tamper-evident SHA-256 Cryptographic Audit Certificates.",
    psychologicalRationale:
      "True continuous controls governance means compliance is 'zero-touch'. Employees don't read static PDF policies—the workflow dynamically injects mandatory sign-offs based on financial risk and environment. When an approval occurs, it produces an exportable cryptographic audit certificate with a deterministic SHA-256 verification hash.",
    rejectedAlternative:
      "Static manual forms and post-hoc annual spreadsheet audits where evidence must be gathered retroactively.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 3.1 & 3.2",
    targetPage: "/compliance",
    actionLabel: "View Cryptographic SHA-256 Certificate",
    actionType: "open_cert",
    actionPayload: "modal",
  },
  {
    id: "key-6",
    stepNumber: 6,
    badgeSymbol: "❻",
    title: "Shift-Left Governance: Smart Form & Dynamic Policy Engine",
    category: "Initiation & Policy-as-Code",
    officialPrompt:
      '"How does the platform prevent non-compliant requests from entering the system in the first place, rather than catching violations retroactively?"',
    designDecision:
      "Embedded a reactive Policy-as-Code engine directly inside the Smart Request Initiation Form (/workflows). Adjusting the budget threshold (≥ $5,000) or selecting 'Production' instantly triggers real-time SOX §404 compliance rules and injects mandatory executive sign-offs before submission.",
    psychologicalRationale:
      "Traditional enterprise governance relies on passive PDF policies that employees rarely read, resulting in compliance violations discovered only during stressful annual audits. By shifting compliance 'left' directly into the requester's initiation experience, the system provides real-time feedback with zero friction, transforming compliance from a post-mortem bottleneck into an active guardrail.",
    rejectedAlternative:
      "A static, unconditional form where requesters manually select their own approvers from a dropdown. This invites accidental under-authorization, intentional circumventing of SOX 404 thresholds, and massive audit exposure.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 3.1 & 8.2",
    targetPage: "/workflows",
    actionLabel: "Open Smart Request Form (SOX §404)",
    actionType: "open_smart_form",
    actionPayload: "tpl-capex",
  },
  {
    id: "key-7",
    stepNumber: 7,
    badgeSymbol: "❼",
    title: "Power-User Velocity: Global Command Console (⌘K)",
    category: "Keyboard-First & Omnibox Access",
    officialPrompt:
      '"How do power users with high-volume workloads navigate between disparate operational duties without experiencing navigation fatigue?"',
    designDecision:
      "Built a universal Command Palette (accessible via ⌘K / Ctrl+K or search bar) providing immediate fuzzy-search access across pending approvals, controls, persona switching, and automated sweeps.",
    psychologicalRationale:
      "High-velocity operators and C-level approvers suffer severe context exhaustion from repetitive multi-click menu navigation. A keyboard-first Omnibox adheres to the Principle of Least Astonishment, allowing an operator to execute critical actions (e.g., 'Switch to Requester', 'Inspect P1 Overdue SLA', 'Run Scheduled Sweeps') in under 300ms without lifting their hands from the keyboard.",
    rejectedAlternative:
      "Restricting navigation strictly to hierarchical sidebar menus and breadcrumbs. Power users find mouse-dependent navigation sluggish, leading to frustration and workflow delays.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.1 & 7.1",
    targetPage: "/",
    actionLabel: "Launch ⌘K Command Console",
    actionType: "open_command_palette",
    actionPayload: "open",
  },
  {
    id: "key-8",
    stepNumber: 8,
    badgeSymbol: "❽",
    title: "Out-of-Office Resilience: Certified Approval Delegation (ISO 27001 §9.2)",
    category: "Operational Continuity & Audit Trails",
    officialPrompt:
      '"What happens when a primary executive approver is unavailable? How do you prevent SLA bottlenecks without compromising governance boundaries?"',
    designDecision:
      "Implemented a time-bound, limit-enforced Approval Delegation Protocol in /inbox with certified proxy candidates (e.g. Dewi Lestari up to $50,000, Citra Maulana up to $100,000) backed by mandatory audit justifications.",
    psychologicalRationale:
      "In high-pressure enterprise environments, executive travel or out-of-office status is the #1 cause of catastrophic 2-hour SLA breaches. Simple email forwarding or ad-hoc credential sharing violates ISO 27001 §9.2 and Sarbanes-Oxley. Certified proxy delegation preserves operational continuity while maintaining an unbroken, tamper-evident cryptographic chain of custody.",
    rejectedAlternative:
      "Allowing unconstrained delegation to any colleague or allowing approvals to stall indefinitely until the primary reviewer returns. Both lead either to critical SLA failure or severe regulatory penalties.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.4 & 4.3",
    targetPage: "/inbox",
    actionLabel: "Open Certified Delegation Modal",
    actionType: "open_delegation",
    actionPayload: "first",
  },
  {
    id: "key-9",
    stepNumber: 9,
    badgeSymbol: "❾",
    title: "Process Mining: Cycle-Time Bottleneck Diagnostics",
    category: "Continuous Improvement & Telemetry",
    officialPrompt:
      '"How does the platform transition from reactive approval processing to proactive operational optimization?"',
    designDecision:
      "Integrated telemetry and stage duration diagnostics in /insights, exposing exact cycle-time distribution across review tiers (Legal Review taking 3.8 days vs. IT Security at 0.7 days).",
    psychologicalRationale:
      "Executives and operations leaders don't just want to approve requests—they need to eliminate systemic latency. By surfacing stage-specific bottlenecks directly alongside SLA adherence distributions, the platform shifts from an operational task queue into a strategic Business Process Optimization platform.",
    rejectedAlternative:
      "Presenting only aggregate pass/fail percentages without stage breakdown. Leadership remains blind to which specific department or stage is causing systemic business delay.",
    defenseDocRef: "MASTER_DEFENSE_AND_ANALYSIS.md — Section 2.2 & 6.1",
    targetPage: "/insights",
    actionLabel: "Inspect Stage Bottlenecks",
    actionType: "scroll_bottlenecks",
    actionPayload: "stage-bottlenecks",
  },
];
