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
3. **Core Scope Target:** Selesaikan 3 Core Views yang menjawab 100% pertanyaan brief:
   - Dashboard (Hierarki urgensi & 3-Tier Customization live)
   - Inbox (Triage & Slide-Over Drawer batch review)
   - Workflow Catalog (4 Trigger mental models & Run Now)

---

## 📋 Task Checklist

### Phase 1: Project Setup & Shell Foundation
- [ ] **Task 1.1: Initialize Next.js Project**
  - Scaffold Next.js 14/15 App Router + Tailwind CSS + Lucide Icons di `prototype-injani`.
  - *Verification:* `npm run dev` running, zero build errors.
- [ ] **Task 1.2: Global Navigation Shell & Layout**
  - Buat collapsible dark/slate sidebar navigation (5 Top-Level: Dashboard, Inbox with badge `[3]`, Workflows, Compliance, Insights).
  - Global Top Header dengan user greeting, search bar mock, and notifications bell.
  - *Verification:* Navigasi antar rute aktif dan badge counter terlihat jelas.

---

### Phase 2: Core Views Implementation
- [ ] **Task 2.1: Primary Dashboard Cockpit (`/dashboard` & `/`)**
  - **Zone 1:** Sticky non-removable *Urgent Actions Bar* (🔴 Overdue P1 & 🟡 Expiring Control).
  - **Zone 2:** 2x2 Primary Metrics Grid (Pending Approvals, My Requests, Expiring Controls, SLA Compliance).
  - **Zone 3:** Secondary Cards (Quick Launch chips & Automations monitor).
  - **Live Customization Mechanism:** Modal / drawer untuk memilih 4 Persona Presets (Approver, Requester, Control Owner, Automation Owner) yang otomatis mengubah susunan widget secara instan.
  - *Verification:* Mengganti preset langsung mengubah urutan/tampilan widget di layar.

- [ ] **Task 2.2: Inbox Workspace & Slide-Over Drawer (`/inbox`)**
  - Triage list dengan kelompok `OVERDUE (P1)`, `DUE TODAY (P2)`, dan inline filters (Priority, Department, SLA).
  - **Interactive Slide-Over Drawer:**
    - Terbuka dari kanan saat baris approval diklik tanpa meninggalkan halaman list.
    - Menampilkan detail permohonan, lampiran, komentar, dan riwayat.
    - Tombol aksi: **Approve**, **Reject**, **Delegate**, **Request Info**.
    - Fitur **Auto-Advance (Batch Mode):** Setelah klik Approve/Reject, drawer otomatis berpindah ke item berikutnya.
  - *Verification:* Klik baris membuka drawer, klik Approve memperbarui status/berpindah item dengan mulus.

- [ ] **Task 2.3: Workflow Initiation Catalog (`/workflows/catalog`)**
  - Segmented Tab switcher untuk 4 tipe trigger: `Manual`, `Scheduled (Cron)`, `Webhook`, `One-Time`.
  - Tab Manual: Card grid dengan metadata (SLA per step, avg duration, usage count) + tombol `[Start Request]`.
  - Tab Cron: Tabel jadwal padat data + tombol aksi langsung `[▶ Run Now]`.
  - Tab One-Time: Amber warning banner ("Actions are irreversible").
  - *Verification:* Tab berpindah mulus dan trigger button interaktif.

- [ ] **Task 2.4: Controls Registry Quick View (`/compliance/controls`)**
  - Daftar kontrol compliance dengan border kiri semantik (Merah ≤7d, Kuning ≤30d, Hijau >30d).
  - Tombol aksi `[Start Renewal Workflow →]`.
  - *Verification:* Daftar ter-render dengan pemisahan Expiring Soon vs Healthy.

---

### Phase 3: Polish, Build Verification & Delivery
- [ ] **Task 3.1: Build & Quality Check**
  - Jalankan `npm run build` dan pastikan tidak ada TypeScript / lint error.
- [ ] **Task 3.2: Deployment Readiness**
  - Siapkan konfigurasi untuk deployment instan ke Vercel.
  - Dokumentasikan live URL di berkas submission.

---
*Created: 2026-09-29 | Plan active for prototype-injani*
