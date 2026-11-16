# ARCHER Financial Platform — Design System Documentation (Phase 4)

## 1. Visual Identity & Design Philosophy
- **Aesthetic**: Modern + Clean + Information-Dense + Professional + Subtle Sporty.
- **Core UX Principle**: **High Information Density, Low Cognitive Load** via progressive disclosure, tabular alignment, and contextual controls.
- **Geometry (Sharp Corporate)**:
  - Card & container radius: `2px`–`4px` (`rounded-sm`).
  - Thin structured `1px` borders (`var(--border-subtle)` and `var(--border-default)`).
  - Minimal elevation shadows (`var(--shadow-xs)`).
  - Subtle sporty accents: `2px` kinetic top accent strips (`.sporty-accent-top`) and `3px` active left indicators (`.sporty-accent-left`).

## 2. Color Tokens

| Token | Light Mode (Default) | Dark Mode | Functional Role |
|---|---|---|---|
| `--bg-page` | `#F8FAFC` | `#070D19` | Primary workspace canvas |
| `--bg-card` | `#FFFFFF` | `#0D1627` | Cards, tables, widgets |
| `--bg-sidebar` | `#0F2342` | `#050A14` | Global navigation rail |
| `--fg-primary` | `#0F172A` | `#F1F5F9` | Primary text & financial figures |
| `--fg-secondary` | `#334155` | `#CBD5E1` | Secondary labels & table cells |
| `--fg-muted` | `#64748B` | `#94A3B8` | Metadata, timestamps, captions |
| `--color-primary` | `#0F294A` (Navy Blue) | `#2563EB` | Brand authority & primary actions |
| `--color-secondary` | `#059669` (Emerald Green) | `#10B981` | Positive cashflow, asset growth |
| `--color-accent` | `#1D4ED8` (Royal Blue) | `#3B82F6` | Active focus, sporty highlight, links |
| `--color-success` | `#059669` | `#10B981` | Inflow, verified reconciliation, surplus |
| `--color-warning` | `#D97706` | `#F59E0B` | Budget threshold >80%, pending batch |
| `--color-danger` | `#DC2626` | `#EF4444` | Outflowspike, over-budget, error |
| `--color-info` | `#2563EB` | `#3B82F6` | System status, AI recommendation |

## 3. Typography & Financial Numerals
- **Primary Font**: `Inter` (`400`, `500`, `600`, `700`).
- **Monospace / IDs**: `JetBrains Mono` for transaction IDs (`TRX-1`, `ETP-1`, `ACC-3`, `MCAT-2`).
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` enforced across all currency amounts, percentages, and table cells so vertical decimal/thousand alignment is preserved.

## 4. Navigation Architecture (Hybrid Contextual Navigation)
1. **Global Navigation (Sidebar / Mobile Drawer)**:
   - Environment Switcher: **Individu (Personal)** vs **Organisasi (Enterprise/SME)**.
   - 7 Core Modules: Ikhtisar (Dashboard), Transaksi & Buku Besar (Ledger), Akun & Rekonsiliasi, Anggaran & AI, Analitik & MTM, Portofolio & Aset, Organisasi, Pengaturan.
2. **Contextual Navigation**:
   - Module-specific sub-tabs (e.g., *Jurnal Double-Entry*, *Rekonsiliasi MTM Bulanan*, *Katalog Lookup*).
3. **Contextual Discovery**:
   - **Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant navigation, transaction entry, environment toggle, theme & language switch.
   - **Breadcrumb & Period Indicator**: Explicit calendar month boundary (`01 Nov 2026 00:00 – 30 Nov 2026 23:59`).

## 5. Assisted Adaptive Dashboard Architecture
- **Layer 1 — Core Information**: Net Worth, Total Assets, Total Liabilities, Cash Flow, Monthly Income/Expense, Budget Utilization, Financial Health Score.
- **Layer 2 — Adaptive Recommendations**: Context-aware suggestions (e.g., high FX exposure or idle cash ratio) that require explicit user approval before modifying widget layout.
- **Layer 3 — User Customization**: Show/hide widgets, reorder priority, reset to default layout, and jump to Advanced Analytics.

## 6. Internationalization (i18n) & Localization Separation
- **Default Interface Language**: Bahasa Indonesia (`id-ID`), with instant toggle to English (`en-US`).
- **Strict Independence**: Changing UI language only translates labels, tooltips, and date formatting; it **never** alters underlying transaction currencies (`IDR` / `USD`), exchange rates, or ledger calculations.
