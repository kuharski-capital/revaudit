import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:'DM Sans',-apple-system,sans-serif;background:#F0F4FB;color:#0D0D0D;-webkit-font-smoothing:antialiased}

/* Layout */
.app{display:flex;height:100dvh;overflow:hidden}
.sidebar{width:220px;min-width:220px;background:#fff;border-right:1px solid #E8EDF5;display:flex;flex-direction:column;height:100%;overflow-y:auto;z-index:10}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.content{flex:1;overflow-y:auto;padding:28px 32px;background:#F0F4FB}

/* Sidebar */
.sb-header{padding:24px 20px 16px;border-bottom:1px solid #F0F4FB}
.sb-logo{font-size:15px;font-weight:900;color:#0D0D0D;letter-spacing:-0.03em}
.sb-logo span{color:#0066FF}
.sb-nav{padding:12px 10px;flex:1}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:all .15s;margin-bottom:2px;font-size:13px;font-weight:600;color:#8A9AB5;border:none;background:none;width:100%;text-align:left;font-family:inherit}
.sb-item:hover{background:#F4F7FB;color:#4A5568}
.sb-item.active{background:#EEF4FF;color:#0066FF}
.sb-item svg{width:18px;height:18px;flex-shrink:0;stroke:currentColor;fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.sb-section{font-size:10px;font-weight:700;color:#C0CAD8;text-transform:uppercase;letter-spacing:.12em;padding:16px 12px 6px}
.sb-footer{padding:12px 10px;border-top:1px solid #F0F4FB}

/* Header */
.topbar{background:#fff;border-bottom:1px solid #E8EDF5;padding:0 32px;height:64px;display:flex;align-items:center;gap:16px;flex-shrink:0}
.topbar-title{font-size:16px;font-weight:800;color:#0D0D0D;letter-spacing:-0.02em;flex:1}
.topbar-title span{color:#8A9AB5;font-weight:400}
.client-select{background:#F4F7FB;border:1.5px solid #E4EAF4;border-radius:12px;padding:8px 14px;font-size:13px;font-weight:600;color:#0D0D0D;cursor:pointer;font-family:inherit;outline:none;transition:border-color .2s;min-width:200px}
.client-select:focus{border-color:#0066FF}
.topbar-btn{padding:9px 18px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;border:none}
.btn-primary{background:#0066FF;color:#fff}
.btn-primary:hover{opacity:.88}
.btn-ghost{background:#F4F7FB;color:#4A5568;border:1.5px solid #E4EAF4}
.btn-ghost:hover{border-color:#CDD5E8}
.btn-sm{padding:7px 14px;font-size:12px;border-radius:10px}

/* Cards */
.card{background:#fff;border-radius:20px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.04),0 1px 3px rgba(0,0,0,0.03)}
.card-dark{background:#0D0D0D;border-radius:20px;padding:24px;position:relative;overflow:hidden}
.card-dark::after{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(0,102,255,.2) 0%,transparent 70%);pointer-events:none}

/* Grid */
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}

/* Metric cards */
.metric-label{font-size:11px;font-weight:700;color:#A0ADC0;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
.metric-value{font-size:32px;font-weight:900;font-family:'DM Mono',monospace;letter-spacing:-0.04em;line-height:1;color:#0D0D0D}
.metric-sub{font-size:12px;color:#A0ADC0;margin-top:6px;font-weight:400}
.metric-delta{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;margin-top:8px}
.delta-up{background:#EDFBF2;color:#22A05A}
.delta-down{background:#FEF2F2;color:#DC2626}
.delta-neutral{background:#F4F7FB;color:#8A9AB5}

/* Editable field */
.editable{cursor:pointer;padding:2px 6px;margin:-2px -6px;border-radius:8px;transition:background .15s;display:inline-block}
.editable:hover{background:#F4F7FB}
.edit-input{background:#F4F7FB;border:1.5px solid #0066FF;border-radius:8px;padding:4px 10px;font-size:inherit;font-weight:inherit;font-family:'DM Mono',monospace;color:#0D0D0D;outline:none;width:140px}

/* Score bar */
.score-row{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.score-row-header{display:flex;justify-content:space-between;align-items:center;font-size:12px}
.score-name{font-weight:600;color:#4A5568}
.score-nums{font-family:'DM Mono',monospace;font-size:11px;color:#A0ADC0;display:flex;gap:8px;align-items:center}
.score-track{height:8px;background:#F0F4FB;border-radius:4px;position:relative;overflow:visible}
.score-bar-client{height:100%;border-radius:4px;transition:width .4s}
.score-marker{position:absolute;top:-3px;width:2px;height:14px;background:#0066FF;border-radius:1px;transform:translateX(-1px)}
.score-marker-label{position:absolute;top:-18px;font-size:9px;font-weight:700;color:#0066FF;transform:translateX(-50%);white-space:nowrap}

/* Area cards */
.area-card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 1px 6px rgba(0,0,0,0.04);border:1.5px solid transparent;transition:border-color .2s;cursor:pointer}
.area-card:hover{border-color:#E4EAF4}
.area-card.selected{border-color:#0066FF;background:#FAFCFF}
.area-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px}
.area-name{font-size:14px;font-weight:800;color:#0D0D0D;letter-spacing:-0.01em}
.area-leakage{font-size:18px;font-weight:900;font-family:'DM Mono',monospace;letter-spacing:-0.03em;text-align:right}
.area-leakage-label{font-size:10px;color:#A0ADC0;text-align:right;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.cat-pill{display:inline-block;font-size:9px;font-weight:800;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px}

/* Action items */
.action-item{background:#fff;border-radius:14px;padding:16px 18px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,0.04);display:flex;align-items:flex-start;gap:14px;border:1.5px solid transparent;transition:border-color .15s}
.action-item.done{opacity:.65}
.action-item:hover{border-color:#E4EAF4}
.action-left{flex:1;min-width:0}
.action-title{font-size:14px;font-weight:700;color:#0D0D0D;margin-bottom:3px;letter-spacing:-0.01em}
.action-item.done .action-title{text-decoration:line-through;color:#A0ADC0}
.action-desc{font-size:12px;color:#A0ADC0;line-height:1.5}
.action-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.action-impact{font-size:13px;font-weight:800;font-family:'DM Mono',monospace;letter-spacing:-0.02em}
.action-recovered{font-size:11px;font-weight:700;color:#22A05A;font-family:'DM Mono',monospace}
.status-badge{font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.06em;cursor:pointer;border:none;font-family:inherit;transition:all .15s}
.status-open{background:#F4F7FB;color:#8A9AB5}
.status-open:hover{background:#EEF4FF;color:#0066FF}
.status-progress{background:#EEF4FF;color:#0066FF}
.status-progress:hover{background:#DBEAFE;color:#0044CC}
.status-done{background:#EDFBF2;color:#22A05A}
.status-done:hover{background:#DCFCE7;color:#166534}
.priority-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}
.p-critical{background:#DC2626}
.p-high{background:#0066FF}
.p-moderate{background:#D97706}

/* Intel */
.intel-card{background:#fff;border-radius:16px;padding:20px;margin-bottom:10px;box-shadow:0 1px 6px rgba(0,0,0,0.04)}
.intel-stat{font-size:15px;font-weight:700;color:#0D0D0D;line-height:1.4;margin-bottom:5px}
.intel-source{font-size:10px;color:#0066FF;text-transform:uppercase;letter-spacing:.08em;font-weight:700;margin-bottom:8px}
.intel-context{font-size:13px;color:#8A9AB5;line-height:1.6}
.opp-banner{background:#0D0D0D;border-radius:16px;padding:20px 22px;margin-bottom:10px;position:relative;overflow:hidden}
.opp-banner::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,102,255,.6),transparent)}
.opp-label{font-size:10px;color:#0066FF;text-transform:uppercase;letter-spacing:.1em;font-weight:700;margin-bottom:6px}
.opp-text{font-size:14px;color:#CCC;line-height:1.6}

/* Progress */
.progress-row{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid #F0F4FB}
.progress-row:last-child{border-bottom:none}

/* Modals */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.modal{background:#fff;border-radius:24px;padding:32px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.15)}
.modal-title{font-size:20px;font-weight:900;letter-spacing:-0.03em;margin-bottom:6px}
.modal-sub{font-size:13px;color:#8A9AB5;margin-bottom:24px}
.form-field{margin-bottom:18px}
.form-label{font-size:11px;font-weight:700;color:#8A9AB5;text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px;display:block}
.form-input{width:100%;background:#F4F7FB;border:1.5px solid #E4EAF4;border-radius:12px;padding:13px 16px;font-size:15px;font-family:inherit;color:#0D0D0D;outline:none;transition:border-color .2s}
.form-input:focus{border-color:#0066FF;background:#fff}
.ind-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.ind-opt{background:#F4F7FB;border:1.5px solid #E4EAF4;border-radius:12px;padding:14px 6px;text-align:center;cursor:pointer;transition:all .15s;font-family:inherit}
.ind-opt:hover{background:#EEF2FA;border-color:#CDD5E8}
.ind-opt.sel{background:#EEF4FF;border-color:#0066FF}
.ind-opt svg{width:20px;height:20px;stroke:#A0ADC0;fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;display:block;margin:0 auto 6px}
.ind-opt.sel svg{stroke:#0066FF}
.ind-opt-label{font-size:9px;font-weight:700;color:#A0ADC0;text-transform:uppercase;letter-spacing:.04em}
.ind-opt.sel .ind-opt-label{color:#0066FF}
.modal-actions{display:flex;gap:10px;margin-top:24px}

/* Section title */
.section-title{font-size:18px;font-weight:900;color:#0D0D0D;letter-spacing:-0.03em;margin-bottom:4px}
.section-sub{font-size:13px;color:#8A9AB5;margin-bottom:22px}
.section-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px}

/* Divider */
.divider{height:1px;background:#F0F4FB;margin:24px 0}

/* Filter tabs */
.filter-tabs{display:flex;gap:6px;background:#F4F7FB;padding:5px;border-radius:12px;margin-bottom:20px;width:fit-content}
.filter-tab{padding:7px 16px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;border:none;font-family:inherit;color:#8A9AB5;background:transparent}
.filter-tab.active{background:#fff;color:#0D0D0D;box-shadow:0 1px 4px rgba(0,0,0,.07)}

/* Chip */
.chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px}

/* Empty state */
.empty{text-align:center;padding:60px 20px;color:#A0ADC0}
.empty-icon{font-size:32px;margin-bottom:12px;opacity:.5}
.empty-title{font-size:15px;font-weight:700;color:#4A5568;margin-bottom:6px}
.empty-sub{font-size:13px}

/* Health ring */
.health-ring{position:relative;display:inline-flex;align-items:center;justify-content:center}
.health-ring-text{position:absolute;text-align:center}
.health-num{font-size:28px;font-weight:900;font-family:'DM Mono',monospace;letter-spacing:-0.04em;color:#fff;line-height:1}
.health-denom{font-size:11px;color:#555;font-weight:600}

/* Scrollbar */
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:#E4EAF4;border-radius:2px}

/* Mobile bottom nav */
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1.5px solid #E8EDF5;padding:6px 4px calc(6px + env(safe-area-inset-bottom));z-index:30;flex-direction:row;box-shadow:0 -4px 20px rgba(0,0,0,.06)}
.mobile-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;cursor:pointer;border:none;background:none;font-family:inherit;font-size:8px;font-weight:700;color:#A0ADC0;text-transform:uppercase;letter-spacing:.05em;transition:color .15s;-webkit-tap-highlight-color:transparent}
.mobile-nav-item.active{color:#0066FF}
.mobile-nav-item svg{stroke:currentColor;fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}

/* Responsive — tablet */
@media(max-width:900px){
  .sidebar{display:none}
  .mobile-nav{display:flex}
  .content{padding:20px 16px 80px}
  .topbar{padding:0 14px;height:56px;gap:10px}
  .topbar-title{font-size:13px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .client-select{min-width:0;flex:1;max-width:160px;font-size:12px;padding:6px 10px}
  .topbar-new-btn{display:none}
  .grid-4{grid-template-columns:1fr 1fr}
  .grid-3{grid-template-columns:1fr 1fr}
  .section-header{flex-direction:column;align-items:flex-start;gap:8px}
}
/* Responsive — mobile */
@media(max-width:600px){
  .content{padding:16px 12px 84px}
  .grid-4,.grid-3,.grid-2{grid-template-columns:1fr}
  .metric-value{font-size:24px}
  .card{padding:18px}
  .topbar-title{display:none}
  .client-select{max-width:none}
  .filter-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%;display:flex;scrollbar-width:none}
  .filter-tabs::-webkit-scrollbar{display:none}
  .edit-grid{grid-template-columns:1fr !important}
  .action-item{flex-wrap:wrap}
  .action-right{flex-direction:row;flex-wrap:wrap;justify-content:flex-end;width:100%;gap:8px}
  .ind-grid{grid-template-columns:repeat(4,1fr)}
  .modal{padding:24px 20px}
}
@media print{body{background:#fff}.sidebar,.topbar-btn,.mobile-nav{display:none!important}.content{padding:0}}
`;

// ─────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────
const Icon = ({ d, children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const IND_ICONS = {
  electrical: <><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
  hvac: <><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /><circle cx="12" cy="12" r="3" /></>,
  plumbing: <><path d="M12 2C8 7 5 11 5 14a7 7 0 0014 0c0-3-3-7-7-12z" /></>,
  agency: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  retail: <><path d="M6 2L3 6v14h18V6l-3-4H6z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></>,
  healthcare: <><rect x="3" y="3" width="18" height="18" rx="3" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>,
  remodel: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
};

const INDUSTRIES = [
  { key: "electrical", label: "Electrical" },
  { key: "hvac",       label: "HVAC"       },
  { key: "plumbing",   label: "Plumbing"   },
  { key: "agency",     label: "Ad Agency"  },
  { key: "retail",     label: "Retail"     },
  { key: "healthcare", label: "Healthcare" },
  { key: "remodel",    label: "Remodel"    },
];

// ─────────────────────────────────────────────
// Industry defaults
// ─────────────────────────────────────────────
const AREA_DEFAULTS = {
  electrical: [
    { id: "demand",    label: "Lead Response & Demand Capture", category: "Demand",        clientScore: 44, benchmarkScore: 78, leakagePct: 0.09 },
    { id: "sales",     label: "Quote Conversion & Pricing",     category: "Sales",         clientScore: 52, benchmarkScore: 74, leakagePct: 0.07 },
    { id: "billing",   label: "Change Orders & Collections",    category: "Billing",       clientScore: 58, benchmarkScore: 80, leakagePct: 0.08 },
    { id: "labor",     label: "Technician Utilization",         category: "Labor",         clientScore: 47, benchmarkScore: 77, leakagePct: 0.10 },
    { id: "retention", label: "Customer Retention & Referrals", category: "Retention",     clientScore: 38, benchmarkScore: 71, leakagePct: 0.09 },
    { id: "recurring", label: "Service Agreements",             category: "Revenue Model", clientScore: 26, benchmarkScore: 64, leakagePct: 0.08 },
  ],
  hvac: [
    { id: "demand",    label: "Service Call Response",          category: "Demand",        clientScore: 50, benchmarkScore: 80, leakagePct: 0.08 },
    { id: "recurring", label: "Maintenance Agreement Rate",     category: "Revenue Model", clientScore: 18, benchmarkScore: 68, leakagePct: 0.12 },
    { id: "sales",     label: "On-Site Upsell & Premium Sales", category: "Sales",         clientScore: 40, benchmarkScore: 72, leakagePct: 0.09 },
    { id: "labor",     label: "Seasonal Demand Management",     category: "Labor",         clientScore: 44, benchmarkScore: 75, leakagePct: 0.08 },
    { id: "billing",   label: "Invoicing Speed",                category: "Billing",       clientScore: 60, benchmarkScore: 82, leakagePct: 0.06 },
    { id: "retention", label: "Customer Retention",             category: "Retention",     clientScore: 35, benchmarkScore: 70, leakagePct: 0.09 },
  ],
  plumbing: [
    { id: "demand",    label: "Lead Response",                  category: "Demand",        clientScore: 48, benchmarkScore: 79, leakagePct: 0.09 },
    { id: "sales",     label: "Premium Pricing & Add-Ons",      category: "Sales",         clientScore: 35, benchmarkScore: 68, leakagePct: 0.08 },
    { id: "billing",   label: "Invoicing & Collections",        category: "Billing",       clientScore: 55, benchmarkScore: 78, leakagePct: 0.07 },
    { id: "labor",     label: "Dispatch Efficiency",            category: "Labor",         clientScore: 50, benchmarkScore: 76, leakagePct: 0.09 },
    { id: "retention", label: "Repeat Customer Rate",           category: "Retention",     clientScore: 40, benchmarkScore: 72, leakagePct: 0.08 },
    { id: "recurring", label: "Service Agreements",             category: "Revenue Model", clientScore: 15, benchmarkScore: 55, leakagePct: 0.07 },
  ],
  agency: [
    { id: "recurring", label: "Retainer vs. Project Mix",       category: "Revenue Model", clientScore: 30, benchmarkScore: 72, leakagePct: 0.12 },
    { id: "billing",   label: "Scope Creep & Billing",          category: "Billing",       clientScore: 42, benchmarkScore: 76, leakagePct: 0.10 },
    { id: "sales",     label: "New Business Close Rate",        category: "Sales",         clientScore: 48, benchmarkScore: 70, leakagePct: 0.07 },
    { id: "labor",     label: "Billable Utilization",           category: "Labor",         clientScore: 55, benchmarkScore: 78, leakagePct: 0.09 },
    { id: "retention", label: "Client Retention Rate",          category: "Retention",     clientScore: 60, benchmarkScore: 82, leakagePct: 0.08 },
    { id: "demand",    label: "Pipeline & New Business",        category: "Demand",        clientScore: 38, benchmarkScore: 68, leakagePct: 0.07 },
  ],
  retail: [
    { id: "demand",    label: "Traffic & Visitor Conversion",   category: "Demand",        clientScore: 42, benchmarkScore: 72, leakagePct: 0.09 },
    { id: "sales",     label: "Average Transaction Value",      category: "Sales",         clientScore: 50, benchmarkScore: 74, leakagePct: 0.08 },
    { id: "billing",   label: "Upsell & Bundle Capture",        category: "Billing",       clientScore: 35, benchmarkScore: 68, leakagePct: 0.07 },
    { id: "labor",     label: "Staff Scheduling vs. Traffic",   category: "Labor",         clientScore: 45, benchmarkScore: 73, leakagePct: 0.06 },
    { id: "retention", label: "Customer Loyalty & Repeat Rate", category: "Retention",     clientScore: 38, benchmarkScore: 70, leakagePct: 0.09 },
    { id: "recurring", label: "Subscription / Membership",      category: "Revenue Model", clientScore: 12, benchmarkScore: 48, leakagePct: 0.08 },
  ],
  healthcare: [
    { id: "demand",    label: "No-Show & Cancellation Rate",    category: "Demand",        clientScore: 40, benchmarkScore: 76, leakagePct: 0.10 },
    { id: "sales",     label: "New Patient Conversion",         category: "Sales",         clientScore: 52, benchmarkScore: 74, leakagePct: 0.07 },
    { id: "billing",   label: "Claims Accuracy & Denials",      category: "Billing",       clientScore: 48, benchmarkScore: 78, leakagePct: 0.09 },
    { id: "labor",     label: "Provider Schedule Utilization",  category: "Labor",         clientScore: 62, benchmarkScore: 85, leakagePct: 0.10 },
    { id: "retention", label: "Patient Retention & Recall",     category: "Retention",     clientScore: 44, benchmarkScore: 72, leakagePct: 0.08 },
    { id: "recurring", label: "Ancillary & Elective Revenue",   category: "Revenue Model", clientScore: 20, benchmarkScore: 58, leakagePct: 0.07 },
  ],
  remodel: [
    { id: "demand",    label: "Lead Response & Qualification",  category: "Demand",        clientScore: 46, benchmarkScore: 76, leakagePct: 0.08 },
    { id: "sales",     label: "Proposal Close Rate",            category: "Sales",         clientScore: 44, benchmarkScore: 70, leakagePct: 0.09 },
    { id: "billing",   label: "Change Order Capture",           category: "Billing",       clientScore: 36, benchmarkScore: 74, leakagePct: 0.11 },
    { id: "labor",     label: "Subcontractor & Timeline Mgmt",  category: "Labor",         clientScore: 42, benchmarkScore: 72, leakagePct: 0.10 },
    { id: "retention", label: "Referral Rate",                  category: "Retention",     clientScore: 45, benchmarkScore: 74, leakagePct: 0.08 },
    { id: "recurring", label: "Past Client Re-Engagement",      category: "Revenue Model", clientScore: 18, benchmarkScore: 56, leakagePct: 0.06 },
  ],
};

const ACTION_DEFAULTS = {
  demand:    ["Set up missed-call text-back system (Hatch, Podium)", "Enforce 5-minute first-response SLA on all new inquiries", "Build a 5-touch follow-up sequence for unconverted leads"],
  sales:     ["Call every prospect within 24 hours of sending a proposal", "Review pricing quarterly vs. local market comps", "Track close rate weekly — designate an owner"],
  billing:   ["Invoice same-day or on-site for all completed work", "Require documented sign-off before any out-of-scope work", "Automate payment reminders at 7, 14, and 30 days past due"],
  labor:     ["Implement dispatch software to optimize routing and scheduling", "Track hours per job vs. estimate — flag overruns in real time", "Run a weekly rework/inefficiency review with field leads"],
  retention: ["Launch a structured referral program with a client incentive", "Automate a 24-hour post-job follow-up and review request", "Create a re-engagement sequence for clients 90+ days inactive"],
  recurring: ["Build a tiered service agreement with 2–3 pricing options", "Pitch existing top-30 clients on an ongoing engagement", "Model the revenue impact of moving 10% of work to retainer"],
};

const CAT_COLORS = { Demand: "#0066FF", Sales: "#7C3AED", Billing: "#D97706", Labor: "#DC2626", Retention: "#22A05A", "Revenue Model": "#0891B2" };

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = n => n >= 1000000 ? "$" + (n / 1000000).toFixed(2) + "M" : n >= 1000 ? "$" + Math.round(n / 1000).toLocaleString() + "K" : "$" + Math.round(n).toLocaleString();
const fmtNum = n => n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : n >= 1000 ? Math.round(n / 1000) + "K" : String(Math.round(n));
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

function calcHealth(areas) {
  const avg = areas.reduce((s, a) => s + a.clientScore, 0) / areas.length;
  return Math.round(avg);
}

function calcLeakage(revenue, areas) {
  return areas.reduce((s, a) => s + revenue * a.leakagePct * Math.max(0, (a.benchmarkScore - a.clientScore) / a.benchmarkScore), 0);
}

function makeClient(name, industry, revenue, contact = "") {
  const areas = (AREA_DEFAULTS[industry] || AREA_DEFAULTS.electrical).map(a => ({ ...a }));
  const actions = [];
  areas.forEach(area => {
    const defs = ACTION_DEFAULTS[area.id] || [];
    defs.forEach((title, i) => {
      actions.push({
        id: uid(), areaId: area.id, title,
        status: "open",
        priority: i === 0 ? "critical" : i === 1 ? "high" : "moderate",
        expectedRevenue: Math.round(revenue * area.leakagePct * 0.35),
        recoveredRevenue: 0, notes: "", completedAt: null,
      });
    });
  });
  return {
    id: uid(), name, contact, industry, revenue,
    createdAt: today(), lastContact: today(),
    areas, actions,
    snapshots: [{ date: today(), healthScore: calcHealth(areas), totalLeakage: calcLeakage(revenue, areas), recoveredRevenue: 0 }],
    intelligence: null,
  };
}

const DEMO_CLIENTS = [
  makeClient("Precision Electric Co.", "electrical", 1400000, "Ryan Mitchell"),
  makeClient("Summit HVAC", "hvac", 2100000, "Dana Torres"),
];

// ─────────────────────────────────────────────
// localStorage
// ─────────────────────────────────────────────
function loadClients() {
  try { const s = localStorage.getItem("ra_clients"); return s ? JSON.parse(s) : DEMO_CLIENTS; } catch { return DEMO_CLIENTS; }
}
function saveClients(clients) {
  try { localStorage.setItem("ra_clients", JSON.stringify(clients)); } catch {}
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function EditableValue({ value, onChange, prefix = "", suffix = "", mono = true, className = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const commit = () => { const n = parseFloat(draft.replace(/[^0-9.]/g, "")); if (!isNaN(n)) onChange(n); setEditing(false); };
  if (editing) return <input className="edit-input" value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }} autoFocus />;
  return <span className={`editable ${className}`} title="Click to edit" onClick={() => { setDraft(String(value)); setEditing(true); }}>{prefix}{typeof value === "number" && value > 999 ? value.toLocaleString() : value}{suffix}</span>;
}

function ScoreBar({ clientScore, benchmarkScore, color }) {
  return (
    <div className="score-track">
      <div className="score-bar-client" style={{ width: clientScore + "%", background: color || "#0066FF", height: 8, borderRadius: 4 }} />
      <div className="score-marker" style={{ left: benchmarkScore + "%" }}>
        <div className="score-marker-label">Benchmark</div>
      </div>
    </div>
  );
}

function CatPill({ category }) {
  const c = CAT_COLORS[category] || "#8A9AB5";
  return <span className="cat-pill" style={{ background: c + "18", color: c }}>{category}</span>;
}

function StatusBtn({ status, onClick }) {
  const map = { open: ["status-open", "Open"], in_progress: ["status-progress", "In Progress"], done: ["status-done", "Done"] };
  const [cls, label] = map[status] || map.open;
  return <button className={`status-badge ${cls}`} onClick={onClick}>{label}</button>;
}

function HealthRing({ score, size = 100 }) {
  const r = 38; const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const color = score >= 65 ? "#22A05A" : score >= 45 ? "#D97706" : "#DC2626";
  return (
    <div className="health-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset .5s" }} />
      </svg>
      <div className="health-ring-text">
        <div className="health-num" style={{ color }}>{score}</div>
        <div className="health-denom">/100</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────

function OverviewSection({ client, onUpdateArea }) {
  const health = calcHealth(client.areas);
  const leakage = calcLeakage(client.revenue, client.areas);
  const recovered = client.actions.filter(a => a.status === "done").reduce((s, a) => s + (a.recoveredRevenue || 0), 0);
  const openActions = client.actions.filter(a => a.status !== "done").length;

  const chartData = client.areas.map(a => ({
    name: a.label.split(" ")[0],
    client: a.clientScore,
    benchmark: a.benchmarkScore,
  }));

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Revenue Dashboard</div>
          <div className="section-sub">{client.name} · {INDUSTRIES.find(i => i.key === client.industry)?.label} · {fmt(client.revenue)} annual revenue</div>
        </div>
        <div style={{ fontSize: 12, color: "#A0ADC0" }}>Last updated {client.lastContact}</div>
      </div>

      {/* Hero row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card-dark" style={{ gridColumn: "span 1" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>Health Score</div>
          </div>
          <HealthRing score={health} size={88} />
        </div>
        <div className="card">
          <div className="metric-label">Est. Leakage / Year</div>
          <div className="metric-value" style={{ color: "#DC2626", fontSize: 26 }}>{fmt(leakage)}</div>
          <div className="metric-sub">{fmt(leakage / 12)} per month</div>
          <div className="metric-delta delta-down">↓ Revenue at risk</div>
        </div>
        <div className="card">
          <div className="metric-label">Revenue Recovered</div>
          <div className="metric-value" style={{ color: "#22A05A", fontSize: 26 }}>{fmt(recovered)}</div>
          <div className="metric-sub">{client.actions.filter(a => a.status === "done").length} actions closed</div>
          {recovered > 0 && <div className="metric-delta delta-up">↑ Captured this engagement</div>}
        </div>
        <div className="card">
          <div className="metric-label">Open Action Items</div>
          <div className="metric-value" style={{ fontSize: 26 }}>{openActions}</div>
          <div className="metric-sub">{client.actions.filter(a => a.status === "in_progress").length} in progress</div>
          <div className="metric-delta delta-neutral">{client.areas.length} areas assessed</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", letterSpacing: "-0.01em" }}>Performance vs. Industry Benchmark</div>
            <div style={{ fontSize: 12, color: "#A0ADC0", marginTop: 3 }}>Blue = your score · Gray = top-performer benchmark</div>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#A0ADC0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#0066FF", display: "inline-block" }} /> Your Score</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#E4EAF4", display: "inline-block" }} /> Benchmark</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#A0ADC0", fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#C0CAD8" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v, n) => [v + "/100", n === "client" ? "Your Score" : "Benchmark"]} contentStyle={{ borderRadius: 12, border: "1px solid #E4EAF4", fontSize: 12 }} />
            <Bar dataKey="client" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill="#0066FF" />)}
            </Bar>
            <Bar dataKey="benchmark" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill="#E4EAF4" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gap summary */}
      <div className="grid-3">
        {client.areas.map(area => {
          const gap = area.benchmarkScore - area.clientScore;
          const leakAmt = client.revenue * area.leakagePct * Math.max(0, gap / area.benchmarkScore);
          const color = CAT_COLORS[area.category] || "#0066FF";
          return (
            <div key={area.id} className="card" style={{ padding: "18px 20px" }}>
              <CatPill category={area.category} />
              <div style={{ fontSize: 13, fontWeight: 800, color: "#0D0D0D", marginBottom: 10, lineHeight: 1.3 }}>{area.label}</div>
              <ScoreBar clientScore={area.clientScore} benchmarkScore={area.benchmarkScore} color={color} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#A0ADC0" }}>
                <span>Score: <strong style={{ color: "#0D0D0D" }}>{area.clientScore}</strong></span>
                <span style={{ color: "#DC2626", fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>−{fmt(leakAmt)}/yr</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RevenueGapsSection({ client, onUpdateArea }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Revenue Gap Analysis</div>
          <div className="section-sub">Click any area to edit scores. Blue bar = current · Benchmark line = top performers in your market.</div>
        </div>
        <div style={{ fontSize: 11, color: "#A0ADC0", textAlign: "right" }}>All scores editable<br /><span style={{ color: "#0066FF", fontWeight: 600 }}>Click to update</span></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {client.areas.map(area => {
          const gap = area.benchmarkScore - area.clientScore;
          const leakAmt = client.revenue * area.leakagePct * Math.max(0, gap / area.benchmarkScore);
          const color = CAT_COLORS[area.category] || "#0066FF";
          const isOpen = selected === area.id;

          return (
            <div key={area.id} className={`area-card ${isOpen ? "selected" : ""}`} onClick={() => setSelected(isOpen ? null : area.id)}>
              <div className="area-header">
                <div>
                  <CatPill category={area.category} />
                  <div className="area-name">{area.label}</div>
                </div>
                <div>
                  <div className="area-leakage" style={{ color }}>{fmt(leakAmt)}</div>
                  <div className="area-leakage-label">est. / year</div>
                </div>
              </div>

              <div className="score-row">
                <div className="score-row-header">
                  <span className="score-name">Performance Score</span>
                  <span className="score-nums">
                    <span style={{ color }}>Your score: {area.clientScore}</span>
                    <span>·</span>
                    <span>Benchmark: {area.benchmarkScore}</span>
                  </span>
                </div>
                <ScoreBar clientScore={area.clientScore} benchmarkScore={area.benchmarkScore} color={color} />
              </div>

              {isOpen && (
                <div className="edit-grid" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #F0F4FB", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} onClick={e => e.stopPropagation()}>
                  {[
                    { label: "Client Score (0–100)", key: "clientScore", suffix: "" },
                    { label: "Benchmark Score (0–100)", key: "benchmarkScore", suffix: "" },
                    { label: "Leakage % of Revenue", key: "leakagePct", suffix: "%" },
                  ].map(({ label, key, suffix }) => (
                    <div key={key}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#A0ADC0", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>{label}</div>
                      <EditableValue
                        value={key === "leakagePct" ? Math.round(area[key] * 100) : area[key]}
                        onChange={v => onUpdateArea(area.id, key, key === "leakagePct" ? v / 100 : v)}
                        suffix={suffix}
                        className=""
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketIntelSection({ client, onUpdateIntel }) {
  const [loading, setLoading] = useState(false);

  const fetchIntel = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: client.industry,
          revenue: client.revenue,
          answers: client.areas.map(a => ({ question: a.label, answer: `Current score: ${a.clientScore}/100 vs. benchmark ${a.benchmarkScore}/100` })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateIntel({ ...data, lastFetched: today() });
      }
    } catch (e) {}
    setLoading(false);
  }, [client, onUpdateIntel]);

  const intel = client.intelligence;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">What the Market Is Telling Us</div>
          <div className="section-sub">Live intelligence for the {INDUSTRIES.find(i => i.key === client.industry)?.label} industry. Refresh weekly to stay ahead.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          {intel?.lastFetched && <div style={{ fontSize: 11, color: "#A0ADC0" }}>Last fetched: {intel.lastFetched}</div>}
          <button className="topbar-btn btn-primary btn-sm" onClick={fetchIntel} disabled={loading}>
            {loading ? "Fetching…" : "↻ Refresh Intelligence"}
          </button>
        </div>
      </div>

      {!intel && (
        <div className="card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <div style={{ fontSize: 32, marginBottom: 14 }}>◎</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0D0D0D", marginBottom: 6 }}>No intelligence loaded yet</div>
          <div style={{ fontSize: 13, color: "#8A9AB5", marginBottom: 20 }}>Fetch live market data to see what's driving growth in the {INDUSTRIES.find(i => i.key === client.industry)?.label} sector right now.</div>
          <button className="topbar-btn btn-primary" onClick={fetchIntel} disabled={loading}>{loading ? "Fetching…" : "Fetch Market Intelligence"}</button>
        </div>
      )}

      {intel && (
        <div>
          {intel.industryContext && (
            <div className="intel-card" style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#0066FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Industry Context</div>
              <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.75 }}>{intel.industryContext}</div>
            </div>
          )}
          <div className="grid-3">
            {intel.marketInsights?.map((mi, i) => (
              <div key={i} className="intel-card" style={{ margin: 0 }}>
                <div className="intel-stat">"{mi.stat}"</div>
                <div className="intel-source">— {mi.source}</div>
                <div className="intel-context">{mi.relevance}</div>
              </div>
            ))}
          </div>
          {intel.topOpportunity && (
            <div className="opp-banner" style={{ marginTop: 10 }}>
              <div className="opp-label">Top Opportunity Right Now</div>
              <div className="opp-text">{intel.topOpportunity}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActionPlanSection({ client, onUpdateAction }) {
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [recoveryDraft, setRecoveryDraft] = useState("");

  const filtered = client.actions.filter(a => filter === "all" || a.status === filter);
  const totalExpected = client.actions.reduce((s, a) => s + (a.expectedRevenue || 0), 0);
  const totalRecovered = client.actions.filter(a => a.status === "done").reduce((s, a) => s + (a.recoveredRevenue || 0), 0);

  const cycleStatus = (action) => {
    const next = { open: "in_progress", in_progress: "done", done: "open" };
    onUpdateAction(action.id, { status: next[action.status], completedAt: next[action.status] === "done" ? today() : null });
  };

  const areaLabel = (areaId) => client.areas.find(a => a.id === areaId)?.label || areaId;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Action Plan</div>
          <div className="section-sub">Track priorities, status, and revenue recovered per action item.</div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, color: "#0066FF", fontFamily: "'DM Mono',monospace" }}>{fmt(totalExpected)}</div>
            <div style={{ fontSize: 11, color: "#A0ADC0", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Expected Recovery</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, color: "#22A05A", fontFamily: "'DM Mono',monospace" }}>{fmt(totalRecovered)}</div>
            <div style={{ fontSize: 11, color: "#A0ADC0", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Recovered</div>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {[["all", "All"], ["open", "Open"], ["in_progress", "In Progress"], ["done", "Done"]].map(([val, label]) => (
          <button key={val} className={`filter-tab ${filter === val ? "active" : ""}`} onClick={() => setFilter(val)}>
            {label} {val !== "all" && <span style={{ marginLeft: 4, opacity: .6 }}>{client.actions.filter(a => a.status === val).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty"><div className="empty-icon">✓</div><div className="empty-title">All clear in this category</div></div>
      )}

      {filtered.map(action => (
        <div key={action.id} className={`action-item ${action.status === "done" ? "done" : ""}`}>
          <div className={`priority-dot p-${action.priority}`} />
          <div className="action-left">
            <div className="action-title">{action.title}</div>
            <div className="action-desc">{areaLabel(action.areaId)}</div>
            {editingId === action.id && (
              <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  className="edit-input" style={{ width: 140 }}
                  placeholder="Recovered $"
                  value={recoveryDraft}
                  onChange={e => setRecoveryDraft(e.target.value)}
                />
                <button className="topbar-btn btn-primary btn-sm" onClick={() => {
                  const v = parseFloat(recoveryDraft.replace(/[^0-9.]/g, ""));
                  if (!isNaN(v)) onUpdateAction(action.id, { recoveredRevenue: v });
                  setEditingId(null); setRecoveryDraft("");
                }}>Save</button>
                <button className="topbar-btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            )}
          </div>
          <div className="action-right">
            <StatusBtn status={action.status} onClick={() => cycleStatus(action)} />
            <div>
              <div className="action-impact" style={{ color: CAT_COLORS[client.areas.find(a => a.id === action.areaId)?.category] || "#0066FF" }}>
                {fmt(action.expectedRevenue)}
              </div>
              <div style={{ fontSize: 9, color: "#A0ADC0", textAlign: "right", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em" }}>Expected</div>
            </div>
            {action.status === "done" && (
              <div style={{ textAlign: "right" }}>
                <div className="action-recovered"
                  onClick={() => { setEditingId(action.id); setRecoveryDraft(String(action.recoveredRevenue || "")); }}
                  style={{ cursor: "pointer" }} title="Click to edit recovered amount">
                  {action.recoveredRevenue > 0 ? `+${fmt(action.recoveredRevenue)} recovered` : "Log recovery →"}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProgressSection({ client }) {
  const recovered = client.actions.filter(a => a.status === "done").reduce((s, a) => s + (a.recoveredRevenue || 0), 0);
  const doneActions = client.actions.filter(a => a.status === "done");
  const health = calcHealth(client.areas);
  const leakage = calcLeakage(client.revenue, client.areas);
  const expectedTotal = client.actions.reduce((s, a) => s + (a.expectedRevenue || 0), 0);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Progress Report</div>
          <div className="section-sub">Engagement summary for {client.name}. Print or share this view with your client.</div>
        </div>
        <button className="topbar-btn btn-ghost" onClick={() => window.print()}>Print Report</button>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Current Health Score", value: health + "/100", color: health >= 65 ? "#22A05A" : health >= 45 ? "#D97706" : "#DC2626" },
          { label: "Total Est. Leakage", value: fmt(leakage), color: "#DC2626" },
          { label: "Revenue Recovered", value: fmt(recovered), color: "#22A05A" },
          { label: "Actions Completed", value: doneActions.length + " / " + client.actions.length, color: "#0066FF" },
        ].map(m => (
          <div key={m.label} className="card" style={{ padding: "20px 22px" }}>
            <div className="metric-label">{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: m.color, letterSpacing: "-0.04em", marginTop: 6 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {doneActions.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0D0D0D", marginBottom: 16 }}>Completed Actions</div>
          {doneActions.map(action => (
            <div key={action.id} className="progress-row">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0D0D0D" }}>{action.title}</div>
                <div style={{ fontSize: 11, color: "#A0ADC0" }}>{client.areas.find(a => a.id === action.areaId)?.label} · Completed {action.completedAt || "—"}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                {action.recoveredRevenue > 0
                  ? <div style={{ fontSize: 14, fontWeight: 800, color: "#22A05A", fontFamily: "'DM Mono',monospace" }}>+{fmt(action.recoveredRevenue)}</div>
                  : <div style={{ fontSize: 12, color: "#A0ADC0" }}>Recovery not logged</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {recovered > 0 && expectedTotal > 0 && (
        <div className="card-dark" style={{ padding: "28px 32px" }}>
          <div style={{ fontSize: 11, color: "#0066FF", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 10 }}>Engagement ROI</div>
          <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: "#22A05A", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 6 }}>{fmt(recovered)}</div>
          <div style={{ fontSize: 14, color: "#666" }}>recovered so far — {Math.round((recovered / expectedTotal) * 100)}% of the total {fmt(expectedTotal)} identified opportunity</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// New Client Modal
// ─────────────────────────────────────────────
function NewClientModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", contact: "", industry: "electrical", revenue: "" });
  const valid = form.name.trim() && parseFloat(form.revenue.replace(/[^0-9.]/g, "")) > 0;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">New Client</div>
        <div className="modal-sub">Pre-populated with industry benchmarks — edit any field live during your meeting.</div>
        <div className="form-field">
          <label className="form-label">Company Name</label>
          <input className="form-input" placeholder="e.g. Apex Plumbing Co." value={form.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Contact Name</label>
          <input className="form-input" placeholder="e.g. Mike Johnson" value={form.contact} onChange={e => set("contact", e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Annual Revenue</label>
          <input className="form-input" placeholder="e.g. 1,400,000" value={form.revenue} onChange={e => set("revenue", e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label">Industry</label>
          <div className="ind-grid">
            {INDUSTRIES.map(ind => (
              <button key={ind.key} className={`ind-opt ${form.industry === ind.key ? "sel" : ""}`} onClick={() => set("industry", ind.key)}>
                <svg viewBox="0 0 24 24">{IND_ICONS[ind.key]}</svg>
                <div className="ind-opt-label">{ind.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="topbar-btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="topbar-btn btn-primary" style={{ flex: 2 }} disabled={!valid}
            onClick={() => { const rev = parseFloat(form.revenue.replace(/[^0-9.]/g, "")); onSave(makeClient(form.name, form.industry, rev, form.contact)); }}>
            Create Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></> },
  { id: "gaps",     label: "Revenue Gaps", icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
  { id: "intel",    label: "Market Intel", icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" /></> },
  { id: "actions",  label: "Action Plan", icon: <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></> },
  { id: "progress", label: "Progress",    icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></> },
];

export default function App() {
  const [clients, setClients] = useState(loadClients);
  const [activeClientId, setActiveClientId] = useState(() => loadClients()[0]?.id);
  const [activeSection, setActiveSection] = useState("overview");
  const [showNewClient, setShowNewClient] = useState(false);

  const client = clients.find(c => c.id === activeClientId) || clients[0];

  useEffect(() => { saveClients(clients); }, [clients]);

  const updateClient = useCallback((id, patch) => {
    setClients(cs => cs.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const updateArea = useCallback((areaId, key, value) => {
    setClients(cs => cs.map(c => c.id === activeClientId
      ? { ...c, areas: c.areas.map(a => a.id === areaId ? { ...a, [key]: value } : a) }
      : c));
  }, [activeClientId]);

  const updateAction = useCallback((actionId, patch) => {
    setClients(cs => cs.map(c => c.id === activeClientId
      ? { ...c, actions: c.actions.map(a => a.id === actionId ? { ...a, ...patch } : a) }
      : c));
  }, [activeClientId]);

  const updateIntel = useCallback((intel) => {
    setClients(cs => cs.map(c => c.id === activeClientId ? { ...c, intelligence: intel } : c));
  }, [activeClientId]);

  const addClient = useCallback((newClient) => {
    setClients(cs => [...cs, newClient]);
    setActiveClientId(newClient.id);
    setShowNewClient(false);
    setActiveSection("overview");
  }, []);

  if (!client) return null;

  return (
    <div className="app">
      <style>{CSS}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sb-header">
          <div className="sb-logo">Rev<span>Audit</span>™</div>
          <div style={{ fontSize: 11, color: "#B0BDD0", marginTop: 2 }}>Kuharski Capital</div>
        </div>
        <div className="sb-nav">
          <div className="sb-section">Navigation</div>
          {NAV.map(n => (
            <button key={n.id} className={`sb-item ${activeSection === n.id ? "active" : ""}`} onClick={() => setActiveSection(n.id)}>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">{n.icon}</svg>
              {n.label}
            </button>
          ))}
        </div>
        <div className="sb-footer">
          <button className="sb-item" style={{ color: "#0066FF", background: "#EEF4FF", width: "100%", justifyContent: "center", fontWeight: 700 }} onClick={() => setShowNewClient(true)}>
            + New Client
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-title">
            Welcome to <span>{client.name}'s</span> Dashboard
          </div>
          <select className="client-select" value={activeClientId} onChange={e => { setActiveClientId(e.target.value); setActiveSection("overview"); }}>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="topbar-btn btn-ghost topbar-new-btn" onClick={() => setShowNewClient(true)}>+ New Client</button>
        </div>

        {/* Content */}
        <div className="content">
          {activeSection === "overview"  && <OverviewSection     client={client} onUpdateArea={updateArea} />}
          {activeSection === "gaps"      && <RevenueGapsSection  client={client} onUpdateArea={updateArea} />}
          {activeSection === "intel"     && <MarketIntelSection  client={client} onUpdateIntel={updateIntel} />}
          {activeSection === "actions"   && <ActionPlanSection   client={client} onUpdateAction={updateAction} />}
          {activeSection === "progress"  && <ProgressSection     client={client} />}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        {NAV.map(n => (
          <button key={n.id} className={`mobile-nav-item ${activeSection === n.id ? "active" : ""}`} onClick={() => setActiveSection(n.id)}>
            <svg viewBox="0 0 24 24" width={20} height={20}>{n.icon}</svg>
            {n.label.split(" ")[0]}
          </button>
        ))}
        <button className="mobile-nav-item" onClick={() => setShowNewClient(true)}>
          <svg viewBox="0 0 24 24" width={20} height={20}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          Add
        </button>
      </div>

      {showNewClient && <NewClientModal onSave={addClient} onClose={() => setShowNewClient(false)} />}
    </div>
  );
}
