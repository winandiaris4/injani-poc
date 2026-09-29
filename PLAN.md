# 🎯 Prototype Implementation Plan & Guardrails Checklist
## BPA & Continuous Controls Governance Platform (Next.js Prototype)
**Candidate:** Aris Winandi | **Target:** Injani Systems Phase 2 Submission

---

## 🛡️ Guardrails & Core Principles

1. **Design System:** Modern Enterprise B2B SaaS (Linear / Stripe inspired).
   - Light mode with neutral slate/zinc foundation.
   - Clean 1px borders, subtle soft shadows, Inter font hierarchy.
   - Strict semantic status colors:
     - 🔴 **Red**: Critical / SLA breach / Overdue / P1.
     - 🟡 **Amber**: Warning / Expiring ≤30d / P2.
     - 🟢 **Emerald**: Compliant / Healthy / Active.
2. **Speed & Reliability:** Client-side mock state (React state / localStorage) — no backend setup overhead.
3. **Core Scope Target:** Selesaikan 3 Core Views yang menjawab 100% pertanyaan brief + 100% Information Architecture Diagram:
   - Dashboard (Hierarki urgensi & 3-Tier Customization live)
   - Inbox (Triage & Slide-Over Drawer batch review)
   - Workflow Catalog & My Requests Tracker (4 Trigger mental models & Run Now + live request stage progress)
   - Compliance Controls & Automations (Controls registry + background cron sweeps)
   - Insights & Audits (SLA Reports, Breaches, and approval history)
   - Enterprise Auth Gateway (`/login`) with 1-click persona quick-logins

---

## 📋 Task Checklist

### Phase 1: Project Setup & Shell Foundation
- [x] **Task 1.1: Initialize Next.js Project**
  - Scaffold Next.js 14/15 App Router + Tailwind CSS + Lucide Icons di `prototype-injani`.
  - *Verification:* `npm run dev` running, zero build errors.
- [x] **Task 1.2: Global Navigation Shell & Layout**
  - Collapsible dark/slate sidebar navigation (5 Top-Level: Dashboard, Inbox with badge `[3]`, Workflows, Compliance, Insights).
  - Global Top Header dengan user greeting, search bar mock, persona switcher, dan notifications bell.
  - *Verification:* Navigasi antar rute aktif dan badge counter terlihat jelas.
- [x] **Task 1.3: Enterprise SSO & Persona Launchpad Gateway (`/login`)**
  - 1-click Demo Persona profiles (Aris Winandi, Sarah Jenkins, Budi Santoso, Alex Rivera).
  - Corporate email SSO simulator and instant prototype tour bypass.

---

### Phase 2: Core Views Implementation
- [x] **Task 2.1: Primary Dashboard Cockpit (`/dashboard` & `/`)**
  - **Zone 1:** Sticky non-removable *Urgent Actions Bar* (🔴 Overdue P1 & 🟡 Expiring Control).
  - **Zone 2:** 2x2 Primary Metrics Grid (Pending Approvals, My Requests, Expiring Controls, SLA Compliance).
  - **Zone 3:** Secondary Cards (Quick Launch chips & Automations monitor).
  - **Live Customization Mechanism:** Modal / drawer untuk memilih 4 Persona Presets (Approver, Requester, Control Owner, Automation Owner) yang otomatis mengubah susunan widget secara instan.
  - *Verification:* Mengganti preset langsung mengubah urutan/tampilan widget di layar.

- [x] **Task 2.2: Inbox Workspace & Slide-Over Drawer (`/inbox`)**
  - Triage list dengan kelompok `OVERDUE (P1)`, `DUE TODAY (P2)`, dan inline filters (Priority, Department, SLA).
  - **Interactive Slide-Over Drawer:**
    - Terbuka dari kanan saat baris approval diklik tanpa meninggalkan halaman list.
    - Menampilkan detail permohonan, lampiran, komentar, dan riwayat.
    - Tombol aksi: **Approve**, **Reject**, **Delegate**, **Request Info**.
    - Fitur **Auto-Advance (Batch Mode):** Setelah klik Approve/Reject, drawer otomatis berpindah ke item berikutnya.
  - *Verification:* Klik baris membuka drawer, klik Approve memperbarui status/berpindah item dengan mulus.

- [x] **Task 2.3: Workflows Module — Catalog & Tracker (`/workflows`)**
  - Top-level IA dual switcher: `[ 🚀 Initiation Catalog (4) | 📋 My Requests Tracker (4) ]`.
  - **Initiation Catalog:** Segmented Tab switcher untuk 4 tipe trigger: `Manual Forms`, `Scheduled Sweeps (Cron)`, `Webhook Triggers`, `One-Time Pipelines`.
  - **My Requests Tracker:** Live tracking of user-submitted requests (`REQ-2026-881`, `REQ-2026-874`, etc.), visual 3-stage progress steppers, active reviewer badge, SLA warnings, and expandable multi-tier audit trails.

- [x] **Task 2.4: Compliance Module — Controls & Automations (`/compliance`)**
  - Top-level IA dual switcher: `[ 🛡️ Controls Registry (4) | ⚡ Automations & Scheduled Sweeps (4) ]`.
  - **Controls Registry:** Table & Grid views, framework filter (`ALL`, `ISO27001`, `SOC2`, `GDPR`, `SLA`), lifecycle renewal actions (`Start Renewal`), semantic dots (🔴 ≤7d, 🟡 ≤30d, 🟢 healthy).
  - **Automations & Scheduled Sweeps:** Cron schedule manager with syntax (`0 0 * * *`), execution cadence, linked obligations, real-time `[▶ Run Now]` triggers, and Active/Paused switches.

- [x] **Task 2.5: Insights & SLA Velocity Module (`/insights`)**
  - Dynamic Throughput Wave Chart and SLA Velocity Breaches timeline.
  - Multi-tier metric KPIs, department velocity comparisons, and complete audit history logs.

---

### Phase 3: Polish, Build Verification & Delivery
- [x] **Task 3.1: Build & Quality Check**
  - Jalankan `npm run build` dan pastikan tidak ada TypeScript / lint error (Verified: 9/9 pages generated).
- [ ] **Task 3.2: Deployment Readiness**
  - Siapkan konfigurasi untuk deployment instan ke Vercel / demo server.
  - Dokumentasikan live URL di berkas submission.

---
*Updated: 2026-09-30 | 100% IA Alignment Completed for prototype-injani*
