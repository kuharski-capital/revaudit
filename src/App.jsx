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

/* Diagnostic questions */
.question-list{display:flex;flex-direction:column;gap:16px;margin-top:16px;padding-top:16px;border-top:1px solid #F0F4FB}
.question-text{font-size:13px;font-weight:700;color:#0D0D0D;margin-bottom:10px;line-height:1.5;letter-spacing:-0.01em}
.option-list{display:flex;flex-direction:column;gap:6px}
.option-btn{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-radius:10px;border:1.5px solid #E4EAF4;background:#fff;cursor:pointer;text-align:left;font-family:inherit;transition:all .15s;width:100%;-webkit-tap-highlight-color:transparent}
.option-btn:hover{border-color:#CDD5E8;background:#FAFCFF}
.option-btn.selected{border-color:#0066FF;background:#EEF4FF}
.option-radio{width:16px;height:16px;min-width:16px;border-radius:50%;border:2px solid #C0CAD8;display:flex;align-items:center;justify-content:center;transition:all .15s;margin-top:1px}
.option-btn.selected .option-radio{border-color:#0066FF;background:#0066FF}
.option-radio-dot{width:6px;height:6px;border-radius:50%;background:#fff}
.option-label{font-size:13px;color:#4A5568;font-weight:500;flex:1;line-height:1.45;text-align:left}
.option-btn.selected .option-label{color:#0066FF;font-weight:600}
.option-score{font-size:10px;font-weight:700;font-family:'DM Mono',monospace;color:#C0CAD8;flex-shrink:0;padding-top:2px}
.option-btn.selected .option-score{color:#0066FF}
.q-progress{font-size:11px;font-weight:700;padding:6px 0 10px;letter-spacing:.02em}
.q-progress.complete{color:#22A05A}
.q-progress.partial{color:#0066FF}
.q-progress.none{color:#A0ADC0}
.area-est-badge{display:inline-block;font-size:9px;font-weight:700;color:#D97706;background:#FEF9EC;padding:2px 7px;border-radius:20px;margin-left:8px;vertical-align:middle;text-transform:uppercase;letter-spacing:.06em}
.override-row{margin-top:14px;padding-top:12px;border-top:1px solid #F0F4FB;display:flex;gap:24px;flex-wrap:wrap}
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
    { id: "lead_capture", label: "Missed Lead & Response Capture", category: "Demand",        clientScore: 42, benchmarkScore: 78, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "When a customer calls and reaches voicemail, what happens next?", answer: null, options: [{ label: "Auto-text fires <60 sec + personal callback within 5 min", score: 100 }, { label: "Someone calls back within the hour", score: 70 }, { label: "We call back same day when we get a chance", score: 35 }, { label: "Calls fall through — no real system", score: 10 }] },
      { text: "After sending a quote with no response, how many follow-up attempts happen?", answer: null, options: [{ label: "5+ structured touches over 14 days — call, text, email", score: 100 }, { label: "3–4 attempts", score: 68 }, { label: "1–2 callbacks", score: 30 }, { label: "One attempt, then we move on", score: 8 }] },
      { text: "After-hours and weekend service requests — what's your coverage?", answer: null, options: [{ label: "Dedicated on-call line, always answered", score: 100 }, { label: "Voicemail checked and returned next morning", score: 65 }, { label: "Owner's cell — depends if they see it", score: 30 }, { label: "We miss most after-hours requests", score: 8 }] },
    ] },
    { id: "conversion",   label: "Quote Conversion & Follow-Up",   category: "Sales",         clientScore: 50, benchmarkScore: 74, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "When you send a quote, how is it delivered to the customer?", answer: null, options: [{ label: "Live walkthrough — call or in-person every time", score: 100 }, { label: "Phone call to review the numbers", score: 68 }, { label: "Email the quote, follow up by phone", score: 35 }, { label: "Text or email the number and wait", score: 10 }] },
      { text: "What's your honest quote-to-booked-job close rate?", answer: null, options: [{ label: "Over 65%", score: 100 }, { label: "45–65%", score: 72 }, { label: "25–45%", score: 40 }, { label: "Under 25%", score: 12 }] },
      { text: "How do you handle a prospect who's gone quiet 5 days after receiving your quote?", answer: null, options: [{ label: "5-touch sequence — call, text, email over 3 weeks", score: 100 }, { label: "3–4 follow-up attempts", score: 68 }, { label: "1–2 follow-up calls", score: 30 }, { label: "One follow-up, then let it go", score: 8 }] },
    ] },
    { id: "billing",      label: "Invoicing & Collections Speed",   category: "Billing",       clientScore: 58, benchmarkScore: 80, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "When is a job invoiced relative to when it's completed?", answer: null, options: [{ label: "Same day — on-site or auto-sent by end of day", score: 100 }, { label: "Within 1–2 days", score: 72 }, { label: "Within the week", score: 40 }, { label: "Whenever someone gets to it", score: 12 }] },
      { text: "What's your process when an invoice hits 14 days past due?", answer: null, options: [{ label: "Auto-reminders at 7, 14, 30 days + personal call at day 14", score: 100 }, { label: "One follow-up email or call", score: 58 }, { label: "Wait and hope it comes in", score: 25 }, { label: "Chronic AR issues — we often write balances off", score: 8 }] },
      { text: "What's your average time from job completion to payment received?", answer: null, options: [{ label: "Under 14 days", score: 100 }, { label: "14–30 days", score: 72 }, { label: "30–60 days", score: 40 }, { label: "Over 60 days or significant bad debt", score: 12 }] },
    ] },
    { id: "pricing",      label: "Pricing Confidence & Margin",     category: "Margin",        clientScore: 40, benchmarkScore: 72, leakagePct: 0.10, isEstimated: true, questions: [
      { text: "How do you set your labor and job pricing?", answer: null, options: [{ label: "Value-based + quarterly market review — we're not the cheapest", score: 100 }, { label: "Cost-plus with a target margin", score: 68 }, { label: "We match what we think the market charges", score: 38 }, { label: "We price low to win — we compete on price", score: 10 }] },
      { text: "When a customer says your price is too high, what happens?", answer: null, options: [{ label: "Stand firm, explain the value, win or walk", score: 100 }, { label: "Occasionally offer a small concession", score: 65 }, { label: "Usually find room to negotiate", score: 35 }, { label: "Discount to close — we hate losing jobs", score: 10 }] },
      { text: "What's your gross margin on labor (revenue minus direct field cost)?", answer: null, options: [{ label: "Over 55%", score: 100 }, { label: "40–55%", score: 72 }, { label: "25–40%", score: 40 }, { label: "Under 25% — or we don't track this", score: 12 }] },
    ] },
    { id: "referrals",    label: "Referral & Review Engine",        category: "Retention",     clientScore: 32, benchmarkScore: 70, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "After every completed job, what systematic follow-up does the customer receive?", answer: null, options: [{ label: "24-hr check-in + review ask day 3 + referral ask day 7", score: 100 }, { label: "We call if there was an issue", score: 55 }, { label: "Invoice sent, nothing else", score: 25 }, { label: "Nothing after the job is done", score: 8 }] },
      { text: "Do you have a formal referral program with a defined ask and incentive?", answer: null, options: [{ label: "Yes — tracked, every customer gets the ask + clear incentive", score: 100 }, { label: "We ask informally sometimes", score: 50 }, { label: "We get referrals but don't ask systematically", score: 25 }, { label: "No referral process", score: 8 }] },
      { text: "How many Google reviews do you receive per month on average?", answer: null, options: [{ label: "10+ per month — actively generated", score: 100 }, { label: "4–9 per month", score: 68 }, { label: "1–3 per month", score: 35 }, { label: "Less than 1 — reviews happen by chance", score: 10 }] },
    ] },
    { id: "recurring",    label: "Recurring Revenue Base",          category: "Revenue Model", clientScore: 24, benchmarkScore: 64, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "Do you have a service agreement or maintenance plan program?", answer: null, options: [{ label: "Yes — tiered, actively sold on every job, 50+ active agreements", score: 100 }, { label: "Exists but rarely sold — under 20 active", score: 50 }, { label: "Considered it but haven't built it", score: 18 }, { label: "No program", score: 5 }] },
      { text: "What % of your annual revenue is contracted or recurring?", answer: null, options: [{ label: "Over 20%", score: 100 }, { label: "10–20%", score: 68 }, { label: "2–10%", score: 35 }, { label: "Under 2% — almost all project-by-project", score: 10 }] },
      { text: "Are your top commercial clients on any kind of ongoing maintenance contract?", answer: null, options: [{ label: "Yes — majority on recurring contracts", score: 100 }, { label: "A few have informal ongoing arrangements", score: 58 }, { label: "All project-by-project, no recurring", score: 25 }, { label: "We don't have significant commercial work", score: 10 }] },
    ] },
  ],
  hvac: [
    { id: "lead_capture", label: "Missed Lead & Response Capture", category: "Demand",        clientScore: 48, benchmarkScore: 78, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "When a service call comes in and no one answers, what's the automatic response?", answer: null, options: [{ label: "Auto-text fires immediately + dispatcher calls back within 10 min", score: 100 }, { label: "Office calls back within the hour", score: 70 }, { label: "We return calls same day", score: 35 }, { label: "No system — depends who sees the missed call", score: 10 }] },
      { text: "During peak season, what happens to calls you can't get to?", answer: null, options: [{ label: "Overflow routing to backup dispatcher — nothing missed", score: 100 }, { label: "Voicemail, called back same day usually", score: 65 }, { label: "We do our best but some get missed", score: 30 }, { label: "Peak season is when we lose the most calls", score: 8 }] },
      { text: "For an estimate request, how many contact attempts before stopping?", answer: null, options: [{ label: "5+ touches over 2 weeks (call, text, email)", score: 100 }, { label: "3–4 attempts", score: 68 }, { label: "1–2 calls", score: 30 }, { label: "One attempt, if no answer we move on", score: 8 }] },
    ] },
    { id: "conversion",   label: "On-Site Conversion & Upsell",    category: "Sales",         clientScore: 42, benchmarkScore: 74, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "When quoting a replacement or new install, how is it presented?", answer: null, options: [{ label: "In-home or video call — good/better/best options every time", score: 100 }, { label: "Phone call walking through the main option", score: 68 }, { label: "Email the quote, follow up by phone", score: 35 }, { label: "Text or email the price and wait", score: 10 }] },
      { text: "How consistently do techs present maintenance agreements on service calls?", answer: null, options: [{ label: "Every call — trained, scripted, and tracked by tech", score: 100 }, { label: "Depends on the tech — inconsistent", score: 55 }, { label: "Only if the customer asks", score: 25 }, { label: "We don't upsell agreements on service calls", score: 8 }] },
      { text: "What's your close rate on equipment replacement quotes?", answer: null, options: [{ label: "Over 60%", score: 100 }, { label: "40–60%", score: 72 }, { label: "20–40%", score: 40 }, { label: "Under 20%", score: 12 }] },
    ] },
    { id: "billing",      label: "Invoicing & Collections Speed",   category: "Billing",       clientScore: 62, benchmarkScore: 82, leakagePct: 0.06, isEstimated: true, questions: [
      { text: "For service and maintenance calls, when is payment collected?", answer: null, options: [{ label: "On-site at completion — card, cash, or digital", score: 100 }, { label: "Invoiced same day, paid within a few days", score: 72 }, { label: "Invoiced and followed up manually", score: 40 }, { label: "Net-30 terms, collection is inconsistent", score: 12 }] },
      { text: "For install jobs, what's your payment milestone structure?", answer: null, options: [{ label: "Deposit + progress draws + final at completion, all in contract", score: 100 }, { label: "Deposit + final invoice within 2 days", score: 68 }, { label: "Final invoice after job, net-30", score: 35 }, { label: "We invoice when we remember", score: 12 }] },
      { text: "What's your outstanding AR older than 30 days as a % of monthly revenue?", answer: null, options: [{ label: "Under 5% — very tight collections", score: 100 }, { label: "5–15%", score: 70 }, { label: "15–30%", score: 40 }, { label: "Over 30% — AR is a persistent cash flow problem", score: 12 }] },
    ] },
    { id: "pricing",      label: "Pricing Confidence & Margin",     category: "Margin",        clientScore: 38, benchmarkScore: 72, leakagePct: 0.10, isEstimated: true, questions: [
      { text: "When presenting equipment replacements, do you offer good/better/best options?", answer: null, options: [{ label: "Always — three-tier, value-differentiated, close rate tracked per tier", score: 100 }, { label: "Sometimes, depending on the tech", score: 60 }, { label: "We usually present one option", score: 30 }, { label: "We lead with the lowest price to win the job", score: 8 }] },
      { text: "When a customer says your price is too high, what happens?", answer: null, options: [{ label: "Stand firm, explain value differentiators, win or walk", score: 100 }, { label: "Occasionally adjust scope to hit budget", score: 65 }, { label: "Usually find a way to match their number", score: 32 }, { label: "We discount to close", score: 8 }] },
      { text: "What's your average gross margin on installed equipment jobs?", answer: null, options: [{ label: "Over 45%", score: 100 }, { label: "30–45%", score: 72 }, { label: "15–30%", score: 40 }, { label: "Under 15% — or we don't track this", score: 12 }] },
    ] },
    { id: "referrals",    label: "Referral & Review Engine",        category: "Retention",     clientScore: 30, benchmarkScore: 70, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "After every service call, what follow-up does the customer receive?", answer: null, options: [{ label: "Auto-text 2 hrs + review ask day 3 + seasonal touchback every 6 months", score: 100 }, { label: "Call or text if there was a problem", score: 55 }, { label: "Invoice sent, nothing else", score: 25 }, { label: "No post-job follow-up", score: 8 }] },
      { text: "How do you systematically ask for referrals?", answer: null, options: [{ label: "Every tech asks on every call, tracked by name", score: 100 }, { label: "We mention it occasionally", score: 50 }, { label: "We don't ask — referrals just happen", score: 22 }, { label: "No referral program", score: 8 }] },
      { text: "What's your current Google rating and monthly review velocity?", answer: null, options: [{ label: "4.7+ stars, 10+ new reviews/month", score: 100 }, { label: "4.5+ stars, 4–9 reviews/month", score: 68 }, { label: "4.0–4.5 stars, 1–3/month", score: 38 }, { label: "Under 4.0 or under 1 review/month", score: 10 }] },
    ] },
    { id: "recurring",    label: "Maintenance Agreement Revenue",   category: "Revenue Model", clientScore: 22, benchmarkScore: 68, leakagePct: 0.12, isEstimated: true, questions: [
      { text: "How many active maintenance agreements do you currently have?", answer: null, options: [{ label: "200+", score: 100 }, { label: "75–200", score: 72 }, { label: "10–75", score: 38 }, { label: "Under 10 or none", score: 10 }] },
      { text: "What's included in your standard maintenance agreement?", answer: null, options: [{ label: "2 seasonal visits + priority dispatch + parts discount + multi-tier", score: 100 }, { label: "1–2 visits, basic package", score: 60 }, { label: "It varies — no standardized product", score: 25 }, { label: "We don't have a maintenance agreement product", score: 8 }] },
      { text: "What % of service calls come from agreement customers vs. new calls?", answer: null, options: [{ label: "Over 40% from agreements", score: 100 }, { label: "20–40%", score: 72 }, { label: "Under 20%", score: 38 }, { label: "We have no agreement customers", score: 10 }] },
    ] },
  ],
  plumbing: [
    { id: "lead_capture", label: "Missed Lead & Response Capture", category: "Demand",        clientScore: 46, benchmarkScore: 78, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "For emergency calls after hours, what's the actual response system?", answer: null, options: [{ label: "24/7 live answering + on-call tech dispatch within 30 min", score: 100 }, { label: "Voicemail with emergency callback number", score: 65 }, { label: "Owner's cell — if they happen to see it", score: 35 }, { label: "We miss most after-hours emergency calls", score: 10 }] },
      { text: "When you're on a job and miss 3 calls, what happens to those leads?", answer: null, options: [{ label: "Auto-text fires to each + office follows up within the hour", score: 100 }, { label: "We call back when the job wraps up", score: 65 }, { label: "We get to them when we can", score: 30 }, { label: "Most of those leads are gone — we know it", score: 8 }] },
      { text: "For a service request that didn't book, how many follow-up attempts before stopping?", answer: null, options: [{ label: "5+ structured touches over 10 days", score: 100 }, { label: "3–4 attempts", score: 68 }, { label: "1–2 calls", score: 30 }, { label: "One attempt, then assume they found someone else", score: 8 }] },
    ] },
    { id: "conversion",   label: "On-Site Upsell & Close Rate",    category: "Sales",         clientScore: 38, benchmarkScore: 70, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "When a tech sees an aging water heater or corroded pipe on-site, what happens?", answer: null, options: [{ label: "Always flagged, photographed, and presented with a clear offer", score: 100 }, { label: "Usually mentioned verbally", score: 58 }, { label: "Depends on the tech", score: 28 }, { label: "We just fix what they called for", score: 10 }] },
      { text: "Do you offer financing on larger jobs ($1,500+)?", answer: null, options: [{ label: "Yes — presented proactively on every large job", score: 100 }, { label: "Can do it but don't offer it proactively", score: 50 }, { label: "Mention it sometimes if customer hesitates", score: 28 }, { label: "No financing option", score: 10 }] },
      { text: "What's your estimate-to-booked-job conversion rate?", answer: null, options: [{ label: "Over 60%", score: 100 }, { label: "40–60%", score: 72 }, { label: "20–40%", score: 40 }, { label: "Under 20%", score: 12 }] },
    ] },
    { id: "billing",      label: "Invoicing & Collections Speed",   category: "Billing",       clientScore: 54, benchmarkScore: 78, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "For residential service calls, how is payment collected?", answer: null, options: [{ label: "Paid on-site at completion — card always available", score: 100 }, { label: "Invoiced same day, paid within a few days", score: 72 }, { label: "Net-15 or net-30, collected manually", score: 40 }, { label: "Collection is inconsistent, open balances are common", score: 12 }] },
      { text: "What's your process when an invoice hits 14 days past due?", answer: null, options: [{ label: "Auto-reminder day 7 + personal call day 14 + late fee day 30", score: 100 }, { label: "We send a follow-up when we notice it", score: 58 }, { label: "We send a second invoice eventually", score: 25 }, { label: "We let it ride and hope they pay", score: 8 }] },
      { text: "What % of invoices get paid within 30 days?", answer: null, options: [{ label: "Over 90%", score: 100 }, { label: "75–90%", score: 72 }, { label: "50–75%", score: 40 }, { label: "Under 50%", score: 12 }] },
    ] },
    { id: "pricing",      label: "Pricing Confidence & Margin",     category: "Margin",        clientScore: 36, benchmarkScore: 72, leakagePct: 0.10, isEstimated: true, questions: [
      { text: "How is your pricing structured across technicians?", answer: null, options: [{ label: "Flat-rate pricing book, updated annually, consistent across all techs", score: 100 }, { label: "Time + materials with standard rates", score: 65 }, { label: "Varies by tech or job — not fully standardized", score: 30 }, { label: "We estimate on the fly — prices vary significantly", score: 8 }] },
      { text: "When a customer says your price is too high, what typically happens?", answer: null, options: [{ label: "Stand firm, explain value and warranty, win or walk", score: 100 }, { label: "Occasionally adjust scope to hit a budget", score: 65 }, { label: "Usually find a way to match the price", score: 32 }, { label: "We drop price — hate losing on price", score: 8 }] },
      { text: "What's your gross margin on service calls?", answer: null, options: [{ label: "Over 55%", score: 100 }, { label: "40–55%", score: 72 }, { label: "25–40%", score: 40 }, { label: "Under 25% — or we don't track this", score: 12 }] },
    ] },
    { id: "referrals",    label: "Referral & Review Engine",        category: "Retention",     clientScore: 35, benchmarkScore: 70, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "After completing a job, what's your systematic customer follow-up?", answer: null, options: [{ label: "Auto check-in + review ask 48 hrs + referral ask day 7", score: 100 }, { label: "Call or text if there's an issue", score: 50 }, { label: "Invoice sent, nothing else", score: 25 }, { label: "No post-job follow-up", score: 8 }] },
      { text: "Is there a formal, trackable referral ask with a defined incentive?", answer: null, options: [{ label: "Yes — documented, every customer, tracked monthly", score: 100 }, { label: "We ask sometimes", score: 50 }, { label: "We get referrals organically but don't ask", score: 22 }, { label: "Nothing formal", score: 8 }] },
      { text: "What % of new customers come from referrals from past customers?", answer: null, options: [{ label: "Over 40%", score: 100 }, { label: "20–40%", score: 68 }, { label: "5–20%", score: 35 }, { label: "Under 5%", score: 10 }] },
    ] },
    { id: "recurring",    label: "Recurring Revenue Base",          category: "Revenue Model", clientScore: 18, benchmarkScore: 60, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "Do you offer a service plan or membership (annual inspections, water heater checks)?", answer: null, options: [{ label: "Yes — actively sold, clear benefits, 30+ members", score: 100 }, { label: "Exists but rarely sold", score: 42 }, { label: "We've considered it", score: 18 }, { label: "No", score: 5 }] },
      { text: "Do you have commercial clients on monthly maintenance contracts?", answer: null, options: [{ label: "Yes — multiple commercial accounts on recurring contracts", score: 100 }, { label: "1–2 informal arrangements", score: 50 }, { label: "All commercial is project-by-project", score: 20 }, { label: "No commercial clients", score: 8 }] },
      { text: "What % of monthly revenue is contracted or predictable 30 days in advance?", answer: null, options: [{ label: "Over 20%", score: 100 }, { label: "10–20%", score: 68 }, { label: "2–10%", score: 35 }, { label: "Under 2% — almost entirely reactive", score: 10 }] },
    ] },
  ],
  agency: [
    { id: "lead_capture", label: "Missed Lead & Response Capture", category: "Demand",        clientScore: 38, benchmarkScore: 76, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "When a new business inquiry comes in, how fast do you respond?", answer: null, options: [{ label: "Within 15 minutes, every time — automated + personal", score: 100 }, { label: "Within 1–2 hours", score: 70 }, { label: "Same business day", score: 35 }, { label: "Within 24–48 hours or longer", score: 10 }] },
      { text: "After a prospect fills a form but doesn't engage further, what fires?", answer: null, options: [{ label: "Automated nurture sequence — 5+ touches over 3 weeks", score: 100 }, { label: "Someone follows up manually within 48 hours", score: 65 }, { label: "Added to a list we occasionally email", score: 28 }, { label: "Nothing — we wait for them to come back", score: 8 }] },
      { text: "How many outbound touches before dropping a warm prospect who's gone quiet?", answer: null, options: [{ label: "7+ touches over 3 weeks — email, phone, LinkedIn", score: 100 }, { label: "4–6 touches", score: 68 }, { label: "2–3 attempts", score: 30 }, { label: "1–2 emails, then we move on", score: 8 }] },
    ] },
    { id: "conversion",   label: "Proposal Conversion & Follow-Up", category: "Sales",        clientScore: 46, benchmarkScore: 72, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "How do you present proposals to new prospects?", answer: null, options: [{ label: "Live presentation — ROI case + success stories every time", score: 100 }, { label: "Video call reviewing the deck together", score: 68 }, { label: "Send the deck, follow up by phone", score: 35 }, { label: "Email it and wait", score: 10 }] },
      { text: "After a proposal goes out with no response for 5 days, what happens?", answer: null, options: [{ label: "7-touch sequence over 3 weeks — email, call, LinkedIn", score: 100 }, { label: "4–5 follow-up attempts", score: 68 }, { label: "2–3 attempts", score: 30 }, { label: "One follow-up email, then let it go", score: 8 }] },
      { text: "What's your close rate on qualified proposals in the last 6 months?", answer: null, options: [{ label: "Over 55%", score: 100 }, { label: "35–55%", score: 72 }, { label: "20–35%", score: 40 }, { label: "Under 20%", score: 12 }] },
    ] },
    { id: "billing",      label: "Invoicing & Scope Discipline",   category: "Billing",       clientScore: 44, benchmarkScore: 78, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "For retainer clients, when do invoices go out and what are the terms?", answer: null, options: [{ label: "First of month, auto-billed, work pauses if payment is late", score: 100 }, { label: "First of month, net-15", score: 72 }, { label: "Whenever we get to billing, net-30", score: 38 }, { label: "Billing is inconsistent — we sometimes float clients", score: 12 }] },
      { text: "For project work, when do you invoice relative to delivery?", answer: null, options: [{ label: "On delivery — payment required before next phase begins", score: 100 }, { label: "Within 3–5 days of delivery", score: 68 }, { label: "Within 2 weeks", score: 38 }, { label: "Whenever billing gets done", score: 12 }] },
      { text: "What's your average time from invoice sent to payment received?", answer: null, options: [{ label: "Under 15 days", score: 100 }, { label: "15–30 days", score: 72 }, { label: "30–60 days", score: 40 }, { label: "Over 60 days — AR is a chronic issue", score: 12 }] },
    ] },
    { id: "pricing",      label: "Pricing Confidence & Margin",     category: "Margin",        clientScore: 42, benchmarkScore: 74, leakagePct: 0.10, isEstimated: true, questions: [
      { text: "How would you describe your core pricing model?", answer: null, options: [{ label: "Value-based — priced to the outcome, not the hours", score: 100 }, { label: "Mix of value-based and hourly/day rate", score: 65 }, { label: "Primarily hourly or day rates", score: 32 }, { label: "We negotiate on almost every deal — pricing is inconsistent", score: 8 }] },
      { text: "When a prospect says your fees are too high, what happens?", answer: null, options: [{ label: "Stand firm, redirect to ROI, walk if needed", score: 100 }, { label: "Occasionally adjust scope to hit a budget", score: 65 }, { label: "Usually find a way to match their budget", score: 32 }, { label: "We discount to get in the door", score: 8 }] },
      { text: "What's your gross margin on client engagements (revenue minus direct staff cost)?", answer: null, options: [{ label: "Over 60%", score: 100 }, { label: "45–60%", score: 72 }, { label: "30–45%", score: 40 }, { label: "Under 30% — or we don't track this", score: 12 }] },
    ] },
    { id: "referrals",    label: "Referral & Case Study Engine",    category: "Retention",     clientScore: 44, benchmarkScore: 72, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "How do you proactively request case studies and testimonials from successful clients?", answer: null, options: [{ label: "Systematic ask at milestones + dedicated case study process", score: 100 }, { label: "We ask when it feels right", score: 55 }, { label: "We wait for clients to offer", score: 22 }, { label: "No formal ask process", score: 8 }] },
      { text: "Do satisfied clients regularly refer new business to you?", answer: null, options: [{ label: "Yes — tracked program with explicit ask and thank-you system", score: 100 }, { label: "Sometimes — we get referrals but don't drive them", score: 55 }, { label: "Rarely", score: 25 }, { label: "Almost never", score: 8 }] },
      { text: "What % of new client pipeline comes from existing client referrals?", answer: null, options: [{ label: "Over 40%", score: 100 }, { label: "20–40%", score: 68 }, { label: "5–20%", score: 35 }, { label: "Under 5%", score: 10 }] },
    ] },
    { id: "recurring",    label: "Retainer & Recurring Revenue",   category: "Revenue Model", clientScore: 38, benchmarkScore: 72, leakagePct: 0.12, isEstimated: true, questions: [
      { text: "What % of your revenue is from retainer vs. project billing?", answer: null, options: [{ label: "Over 70% retainer", score: 100 }, { label: "45–70% retainer", score: 72 }, { label: "20–45% retainer", score: 40 }, { label: "Under 20% — mostly project-to-project", score: 12 }] },
      { text: "What's the average tenure of your current client relationships?", answer: null, options: [{ label: "Over 2 years", score: 100 }, { label: "12–24 months", score: 72 }, { label: "6–12 months", score: 40 }, { label: "Under 6 months average", score: 15 }] },
      { text: "Do you have productized service tiers clients can clearly choose from?", answer: null, options: [{ label: "Yes — clear packages, defined deliverables, actively pitched", score: 100 }, { label: "Some packages but mostly custom scoping", score: 58 }, { label: "Fully custom every time — no defined products", score: 25 }, { label: "No defined offerings", score: 8 }] },
    ] },
  ],
  retail: [
    { id: "lead_capture", label: "Traffic Capture & Re-Engagement", category: "Demand",       clientScore: 40, benchmarkScore: 74, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "When someone visits and doesn't buy, how do you re-engage them?", answer: null, options: [{ label: "Email capture at POS + automated welcome sequence + follow-up offer", score: 100 }, { label: "We collect emails sometimes — no real sequence", score: 55 }, { label: "We rely on them coming back on their own", score: 25 }, { label: "We don't capture contact info from non-buyers", score: 8 }] },
      { text: "Do you have an abandoned cart or browse-abandonment re-engagement system?", answer: null, options: [{ label: "Automated 3-email sequence within 72 hours of abandonment", score: 100 }, { label: "One abandoned cart email", score: 65 }, { label: "No automation — rely on them coming back", score: 28 }, { label: "No online re-engagement system", score: 8 }] },
      { text: "When a customer asks about an out-of-stock product, what's the system?", answer: null, options: [{ label: "Contact captured + auto-notified when available + followed up", score: 100 }, { label: "We take their info and call when it comes in", score: 65 }, { label: "We tell them to check back", score: 28 }, { label: "We lose that sale with no follow-up", score: 8 }] },
    ] },
    { id: "conversion",   label: "In-Store Conversion & Upsell",   category: "Sales",         clientScore: 48, benchmarkScore: 74, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "Do your staff actively suggest add-ons or complementary items at checkout?", answer: null, options: [{ label: "Every transaction — trained, scripted, and measured", score: 100 }, { label: "It happens when staff feel like it", score: 55 }, { label: "Rarely — they ring items and move on", score: 25 }, { label: "Never", score: 8 }] },
      { text: "Do you have a clear good/better/best tier on your core products?", answer: null, options: [{ label: "Yes — clearly presented, staff trained on the upsell", score: 100 }, { label: "Some premium items but not consistently presented", score: 58 }, { label: "No real product tiering", score: 25 }, { label: "None", score: 8 }] },
      { text: "What's your conversion rate — visitors who make a purchase?", answer: null, options: [{ label: "Over 40%", score: 100 }, { label: "25–40%", score: 72 }, { label: "10–25%", score: 40 }, { label: "Under 10%", score: 12 }] },
    ] },
    { id: "billing",      label: "Margin Tracking & Collections",  category: "Billing",       clientScore: 55, benchmarkScore: 76, leakagePct: 0.06, isEstimated: true, questions: [
      { text: "Do you track margin by SKU and promote your highest-margin products?", answer: null, options: [{ label: "Yes — reviewed monthly, drives merchandising and promotions", score: 100 }, { label: "Roughly — know the good ones but don't analyze systematically", score: 60 }, { label: "We track total margin but not by product", score: 28 }, { label: "We don't track margin at this level", score: 10 }] },
      { text: "How do you handle B2B or wholesale accounts receivable?", answer: null, options: [{ label: "Auto-reminders + personal call process, under 20 days average", score: 100 }, { label: "Manual follow-up when we notice an overdue balance", score: 58 }, { label: "Statements sent, we hope for the best", score: 25 }, { label: "B2B AR is a persistent problem", score: 8 }] },
      { text: "How often do you review and adjust pricing vs. competitors?", answer: null, options: [{ label: "Quarterly review with systematic adjustments", score: 100 }, { label: "Annually or when we notice something", score: 65 }, { label: "Rarely — prices are set and left", score: 30 }, { label: "We don't track competitor pricing", score: 8 }] },
    ] },
    { id: "pricing",      label: "Pricing Confidence & Margin",     category: "Margin",        clientScore: 46, benchmarkScore: 72, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "When a customer asks for a discount or says your price is too high, what happens?", answer: null, options: [{ label: "We hold price and explain the value — rarely discount", score: 100 }, { label: "We offer a small concession or bundle instead", score: 65 }, { label: "We usually match competitor prices when pushed", score: 32 }, { label: "We discount to close — it's expected in our market", score: 8 }] },
      { text: "Do you have a clear bundle or upsell structure presented at checkout?", answer: null, options: [{ label: "Trained staff + suggested bundles + clear signage — systematic", score: 100 }, { label: "Some bundles but inconsistently presented", score: 58 }, { label: "No real bundle strategy", score: 25 }, { label: "None", score: 8 }] },
      { text: "What's your average gross margin across all products?", answer: null, options: [{ label: "Over 50%", score: 100 }, { label: "35–50%", score: 72 }, { label: "20–35%", score: 40 }, { label: "Under 20% — or we don't track this", score: 12 }] },
    ] },
    { id: "referrals",    label: "Loyalty & Referral Engine",       category: "Retention",     clientScore: 36, benchmarkScore: 70, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "After a purchase, what follow-up does a customer receive?", answer: null, options: [{ label: "Automated thank-you + review ask + personalized offer within 7 days", score: 100 }, { label: "Thank-you email with receipt", score: 55 }, { label: "Transactional receipt only", score: 22 }, { label: "Nothing", score: 8 }] },
      { text: "Do you have a structured 'refer a friend' program with a clear incentive?", answer: null, options: [{ label: "Yes — active, tracked, with clear incentive", score: 100 }, { label: "We mention it occasionally or have a sign", score: 50 }, { label: "Thought about it but don't have one", score: 20 }, { label: "No referral program", score: 8 }] },
      { text: "What's your ratio of returning vs. first-time customers per month?", answer: null, options: [{ label: "Over 50% returning", score: 100 }, { label: "30–50% returning", score: 68 }, { label: "10–30% returning", score: 35 }, { label: "Under 10% — mostly first-time buyers", score: 10 }] },
    ] },
    { id: "recurring",    label: "Recurring Revenue Base",          category: "Revenue Model", clientScore: 14, benchmarkScore: 55, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "Do you have a subscription, membership, or auto-replenishment program?", answer: null, options: [{ label: "Yes — 50+ active subscribers, meaningful revenue", score: 100 }, { label: "Launched but low adoption", score: 45 }, { label: "Planning to launch", score: 15 }, { label: "No", score: 5 }] },
      { text: "What % of revenue is recurring or predictably repeat month-to-month?", answer: null, options: [{ label: "Over 25%", score: 100 }, { label: "10–25%", score: 68 }, { label: "2–10%", score: 35 }, { label: "Under 2%", score: 10 }] },
      { text: "Do you sell gift cards in meaningful volume (promoted, not just available)?", answer: null, options: [{ label: "Active gift card program — promoted regularly, 5%+ of revenue", score: 100 }, { label: "Available but rarely promoted", score: 50 }, { label: "Rarely sold", score: 22 }, { label: "Not at all", score: 8 }] },
    ] },
  ],
  healthcare: [
    { id: "lead_capture", label: "Missed Lead & Booking Capture",  category: "Demand",        clientScore: 44, benchmarkScore: 78, leakagePct: 0.10, isEstimated: true, questions: [
      { text: "When a patient cancels within 24 hours, what's the immediate re-booking process?", answer: null, options: [{ label: "Auto-text fires within 15 min + staff calls same day to reschedule", score: 100 }, { label: "Staff calls when they see the cancellation", score: 65 }, { label: "We send a recall reminder at their next due date", score: 30 }, { label: "Slot goes empty — no immediate outreach", score: 8 }] },
      { text: "For new patient inquiries that don't book on first contact, how many follow-ups occur?", answer: null, options: [{ label: "4+ touches over 2 weeks — call, email, text", score: 100 }, { label: "2–3 follow-ups", score: 65 }, { label: "One callback attempt", score: 30 }, { label: "If they don't book on first contact, we move on", score: 8 }] },
      { text: "How quickly can a new patient self-schedule online?", answer: null, options: [{ label: "Instant booking, 24/7, confirmed automatically", score: 100 }, { label: "Online booking available, staff confirms within hours", score: 70 }, { label: "Phone only during business hours", score: 35 }, { label: "Long hold times or callback required", score: 10 }] },
    ] },
    { id: "conversion",   label: "Treatment Plan Conversion",      category: "Sales",         clientScore: 52, benchmarkScore: 76, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "How do you present treatment plans or elective services to patients?", answer: null, options: [{ label: "Dedicated consultation + printed options + financing presented every time", score: 100 }, { label: "Verbal discussion during appointment", score: 65 }, { label: "Mentioned if the patient asks", score: 30 }, { label: "No structured presentation", score: 8 }] },
      { text: "When a patient is interested but doesn't schedule, how many follow-up touches happen?", answer: null, options: [{ label: "4+ touches over 2 weeks — call, text, email", score: 100 }, { label: "2–3 attempts", score: 65 }, { label: "One follow-up call", score: 30 }, { label: "We wait for them to call back", score: 8 }] },
      { text: "What % of patients who inquire about a specific treatment actually book it?", answer: null, options: [{ label: "Over 65%", score: 100 }, { label: "45–65%", score: 72 }, { label: "25–45%", score: 40 }, { label: "Under 25%", score: 12 }] },
    ] },
    { id: "billing",      label: "Billing Accuracy & Collections", category: "Billing",       clientScore: 50, benchmarkScore: 80, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "What's your clean claims rate (paid without rework on first submission)?", answer: null, options: [{ label: "Over 95%", score: 100 }, { label: "85–95%", score: 70 }, { label: "70–85%", score: 40 }, { label: "Under 70% — denials are frequent", score: 12 }] },
      { text: "How quickly are claims submitted after patient visits?", answer: null, options: [{ label: "Same day, automated", score: 100 }, { label: "Within 24–48 hours", score: 72 }, { label: "Within the week", score: 40 }, { label: "We have a billing backlog", score: 12 }] },
      { text: "What's your average days in AR (insurance + patient combined)?", answer: null, options: [{ label: "Under 30 days", score: 100 }, { label: "30–45 days", score: 72 }, { label: "45–60 days", score: 40 }, { label: "Over 60 days — AR is a significant issue", score: 12 }] },
    ] },
    { id: "pricing",      label: "Fee Optimization & Margin",      category: "Margin",        clientScore: 40, benchmarkScore: 72, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "Do you regularly benchmark your fee schedule against what the market supports?", answer: null, options: [{ label: "Annual review — fees adjusted to market and payer mix", score: 100 }, { label: "Every few years when prompted", score: 60 }, { label: "Fees mostly set by insurance — don't review out-of-pocket rates", score: 28 }, { label: "Haven't reviewed fees in a long time", score: 8 }] },
      { text: "For cash-pay or elective services, how is pricing communicated to patients?", answer: null, options: [{ label: "Clear menu with transparent pricing — proactively presented", score: 100 }, { label: "Available on request", score: 60 }, { label: "Handled case-by-case by staff", score: 28 }, { label: "Patients often don't know pricing until the bill", score: 8 }] },
      { text: "What's your net collection rate (what you actually collect vs. what you bill)?", answer: null, options: [{ label: "Over 95%", score: 100 }, { label: "85–95%", score: 72 }, { label: "70–85%", score: 40 }, { label: "Under 70%", score: 12 }] },
    ] },
    { id: "referrals",    label: "Patient Referral & Review Engine", category: "Retention",   clientScore: 40, benchmarkScore: 70, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "What's the follow-up protocol after every patient's first visit?", answer: null, options: [{ label: "Automated satisfaction check + review ask 48 hrs + recall at 6 months", score: 100 }, { label: "We call if there was an issue", score: 55 }, { label: "Visit summary sent, no other outreach", score: 22 }, { label: "Nothing systematic", score: 8 }] },
      { text: "Do you have a patient referral program with a clear ask?", answer: null, options: [{ label: "Yes — every patient asked, tracked, with thank-you system", score: 100 }, { label: "Mentioned informally sometimes", score: 50 }, { label: "We get referrals but don't ask systematically", score: 22 }, { label: "No referral process", score: 8 }] },
      { text: "What's your Google/Healthgrades rating and monthly review velocity?", answer: null, options: [{ label: "4.7+ stars, 10+ new reviews/month", score: 100 }, { label: "4.5–4.7 stars, 4–9/month", score: 68 }, { label: "4.0–4.5 stars, 1–3/month", score: 38 }, { label: "Under 4.0 or under 1/month", score: 10 }] },
    ] },
    { id: "recurring",    label: "Recurring Revenue Base",          category: "Revenue Model", clientScore: 22, benchmarkScore: 60, leakagePct: 0.07, isEstimated: true, questions: [
      { text: "Do you offer wellness packages, memberships, or prepaid care plans?", answer: null, options: [{ label: "Yes — active program, 50+ enrolled, significant revenue", score: 100 }, { label: "Some packages, minimal uptake", score: 45 }, { label: "Being developed", score: 15 }, { label: "No", score: 5 }] },
      { text: "What % of practice revenue comes from ancillary or elective services?", answer: null, options: [{ label: "Over 20%", score: 100 }, { label: "10–20%", score: 68 }, { label: "2–10%", score: 35 }, { label: "Under 2%", score: 10 }] },
      { text: "Do patients have their next appointment booked before they leave?", answer: null, options: [{ label: "Yes — every patient, every visit, no exceptions", score: 100 }, { label: "We offer it — some do, some don't", score: 65 }, { label: "Rarely", score: 28 }, { label: "No recall scheduling system", score: 8 }] },
    ] },
  ],
  remodel: [
    { id: "lead_capture", label: "Missed Lead & Response Capture", category: "Demand",        clientScore: 44, benchmarkScore: 76, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "When a prospect submits an inquiry form, what's the response system?", answer: null, options: [{ label: "Auto-text + email in <5 min + personal call within 30 min", score: 100 }, { label: "Someone calls back within 1–2 hours", score: 70 }, { label: "Same business day callback", score: 35 }, { label: "Next day when someone gets to it", score: 10 }] },
      { text: "After delivering an estimate and not hearing back for a week, what happens?", answer: null, options: [{ label: "5+ structured follow-ups over 3 weeks", score: 100 }, { label: "3–4 attempts", score: 68 }, { label: "1–2 follow-ups", score: 30 }, { label: "One call, then assume they went elsewhere", score: 8 }] },
      { text: "During busy season when stretched, how are new inquiry calls handled?", answer: null, options: [{ label: "Dedicated office/VA handles all inquiries — nothing missed", score: 100 }, { label: "We answer what we can, return the rest same day", score: 65 }, { label: "New leads have to wait — jobs take priority", score: 30 }, { label: "We lose leads during our busiest periods", score: 8 }] },
    ] },
    { id: "conversion",   label: "Proposal Conversion & Follow-Up", category: "Sales",        clientScore: 44, benchmarkScore: 72, leakagePct: 0.09, isEstimated: true, questions: [
      { text: "How do you present estimates to prospects?", answer: null, options: [{ label: "In-person walkthrough — scope, materials, timeline, ROI every time", score: 100 }, { label: "Video call reviewing the estimate together", score: 68 }, { label: "Email the PDF and follow up by phone", score: 35 }, { label: "Email the number and wait", score: 10 }] },
      { text: "When you win a job, do you typically win at your initial price?", answer: null, options: [{ label: "Yes — we rarely discount and don't need to", score: 100 }, { label: "Occasionally trim something to close", score: 68 }, { label: "We usually expect some negotiation", score: 38 }, { label: "We routinely come down to win jobs", score: 12 }] },
      { text: "What's your estimate-to-signed-contract close rate?", answer: null, options: [{ label: "Over 55%", score: 100 }, { label: "35–55%", score: 72 }, { label: "20–35%", score: 40 }, { label: "Under 20%", score: 12 }] },
    ] },
    { id: "billing",      label: "Change Order & Collections",     category: "Billing",       clientScore: 42, benchmarkScore: 76, leakagePct: 0.11, isEstimated: true, questions: [
      { text: "How do you handle scope changes and additions during a project?", answer: null, options: [{ label: "Written change order signed before any extra work proceeds", score: 100 }, { label: "We document after but get verbal ok first", score: 65 }, { label: "We do the work and settle it at end of project", score: 28 }, { label: "Scope creep is a significant margin issue for us", score: 8 }] },
      { text: "What's your draw/payment schedule on projects over $10K?", answer: null, options: [{ label: "Clearly defined milestone draws in the contract from day one", score: 100 }, { label: "Deposit plus final payment", score: 68 }, { label: "We invoice when we need cash — flexible", score: 35 }, { label: "Payment timing is ad hoc and a cash flow stress", score: 12 }] },
      { text: "What % of revenue on a typical job ends up as unbilled extras?", answer: null, options: [{ label: "Under 2% — very tight change order management", score: 100 }, { label: "2–5% occasionally slips through", score: 68 }, { label: "5–10% regularly", score: 35 }, { label: "Over 10% — we're giving away margin", score: 10 }] },
    ] },
    { id: "pricing",      label: "Pricing Confidence & Margin",     category: "Margin",        clientScore: 38, benchmarkScore: 72, leakagePct: 0.10, isEstimated: true, questions: [
      { text: "How do you position your pricing relative to your local market?", answer: null, options: [{ label: "Premium — we're not the cheapest and can clearly explain why", score: 100 }, { label: "Market rate with a small buffer", score: 65 }, { label: "We price to win — often lower to beat competitors", score: 30 }, { label: "We adjust based on what the customer seems willing to pay", score: 8 }] },
      { text: "When a prospect says your estimate is higher than another bid, what happens?", answer: null, options: [{ label: "We walk through our process and guarantee — hold our price", score: 100 }, { label: "We adjust scope slightly to hit their budget", score: 62 }, { label: "We usually get closer to the competing bid", score: 30 }, { label: "We drop price — we hate losing on price", score: 8 }] },
      { text: "What's your average gross margin on completed projects?", answer: null, options: [{ label: "Over 40%", score: 100 }, { label: "25–40%", score: 72 }, { label: "12–25%", score: 40 }, { label: "Under 12% — or we don't track this", score: 12 }] },
    ] },
    { id: "referrals",    label: "Referral & Review Engine",        category: "Retention",     clientScore: 42, benchmarkScore: 72, leakagePct: 0.08, isEstimated: true, questions: [
      { text: "After project completion, what's your systematic follow-up?", answer: null, options: [{ label: "Day 1 check-in + day 3 review ask + day 14 referral ask with incentive", score: 100 }, { label: "We call to make sure they're happy", score: 55 }, { label: "Final invoice sent and that's it", score: 22 }, { label: "Nothing structured after handoff", score: 8 }] },
      { text: "Do you have a formal referral program with a defined ask and incentive?", answer: null, options: [{ label: "Every client gets a formal ask + gift card for referrals sent", score: 100 }, { label: "We mention it informally at the end", score: 50 }, { label: "We hope they tell people — don't formally ask", score: 22 }, { label: "No referral strategy", score: 8 }] },
      { text: "What % of annual project revenue comes from past client referrals?", answer: null, options: [{ label: "Over 40%", score: 100 }, { label: "20–40%", score: 68 }, { label: "5–20%", score: 35 }, { label: "Under 5% — mostly cold new leads", score: 10 }] },
    ] },
    { id: "recurring",    label: "Recurring Revenue Base",          category: "Revenue Model", clientScore: 16, benchmarkScore: 56, leakagePct: 0.06, isEstimated: true, questions: [
      { text: "Do you have annual home maintenance or seasonal care programs for past clients?", answer: null, options: [{ label: "Yes — multiple clients on annual maintenance contracts", score: 100 }, { label: "1–2 informal arrangements", score: 42 }, { label: "We've considered it", score: 15 }, { label: "No", score: 5 }] },
      { text: "What % of your annual revenue comes from repeat work with past clients?", answer: null, options: [{ label: "Over 35%", score: 100 }, { label: "15–35%", score: 68 }, { label: "5–15%", score: 35 }, { label: "Under 5% — almost entirely new projects", score: 10 }] },
      { text: "Do any past project clients have you on ongoing commercial maintenance contracts?", answer: null, options: [{ label: "Yes — multiple commercial relationships on contract", score: 100 }, { label: "1–2 are", score: 55 }, { label: "No commercial recurring", score: 20 }, { label: "No commercial client base", score: 8 }] },
    ] },
  ],
};

const ACTION_DEFAULTS = {
  lead_capture: ["Set up missed-call text-back (Hatch, Podium) to auto-respond in <60 sec", "Enforce a 5-minute first-response SLA on every new inbound lead", "Build a 5-touch follow-up sequence for unconverted leads over 14 days"],
  conversion:   ["Call every prospect within 24 hours of sending a proposal or estimate", "Create a standard 3-step follow-up after each estimate — call, text, email", "Track close rate weekly and assign a single owner to improve it"],
  billing:      ["Invoice same-day or on-site for all completed work", "Require documented client sign-off before starting any out-of-scope work", "Automate payment reminders at 7, 14, and 30 days past due"],
  pricing:      ["Audit your last 20 jobs for scope creep you absorbed without billing", "Present three-tier pricing (good / better / best) on every proposal", "Review your rates quarterly against local market comps and adjust"],
  referrals:    ["Launch a structured referral program with a clear client incentive", "Automate a 24-hour post-job follow-up asking for a review and referral", "Create a re-engagement sequence for clients 90+ days since last contact"],
  recurring:    ["Build a tiered service agreement with 2–3 pricing options", "Pitch your top-30 existing clients on a recurring engagement", "Model the revenue impact of converting just 10% of work to retainer"],
};

const CAT_COLORS = { Demand: "#0066FF", Sales: "#7C3AED", Billing: "#D97706", Margin: "#DC2626", Retention: "#22A05A", "Revenue Model": "#0891B2" };

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
  // Deep-copy areas so questions[].answer is independent per client
  const areas = (AREA_DEFAULTS[industry] || AREA_DEFAULTS.electrical).map(a => ({
    ...a,
    questions: a.questions ? a.questions.map(q => ({ ...q, answer: null })) : [],
  }));
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
// localStorage — versioned to handle schema changes
// ─────────────────────────────────────────────
const DATA_VERSION = 2; // bump when AREA_DEFAULTS shape changes

function loadClients() {
  try {
    const version = parseInt(localStorage.getItem("ra_version") || "0", 10);
    if (version < DATA_VERSION) {
      // Old data uses different area IDs / structure — discard and use fresh demos
      return DEMO_CLIENTS;
    }
    const s = localStorage.getItem("ra_clients");
    return s ? JSON.parse(s) : DEMO_CLIENTS;
  } catch { return DEMO_CLIENTS; }
}
function saveClients(clients) {
  try {
    localStorage.setItem("ra_version", String(DATA_VERSION));
    localStorage.setItem("ra_clients", JSON.stringify(clients));
  } catch {}
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

function RevenueGapsSection({ client, onUpdateArea, onAnswerQuestion }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Revenue Gap Diagnostic</div>
          <div className="section-sub">Walk through each area live with the client. Answer the questions to calculate a precise score — no guessing.</div>
        </div>
        <div style={{ fontSize: 11, color: "#A0ADC0", textAlign: "right" }}>
          {client.areas.filter(a => a.isEstimated).length > 0
            ? <><span style={{ color: "#D97706", fontWeight: 700 }}>{client.areas.filter(a => a.isEstimated).length} areas estimated</span><br />Click to diagnose</>
            : <span style={{ color: "#22A05A", fontWeight: 700 }}>All areas diagnosed ✓</span>
          }
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {client.areas.map(area => {
          const gap = area.benchmarkScore - area.clientScore;
          const leakAmt = client.revenue * area.leakagePct * Math.max(0, gap / area.benchmarkScore);
          const color = CAT_COLORS[area.category] || "#0066FF";
          const isOpen = selected === area.id;
          const qs = area.questions || [];
          const answeredCount = qs.filter(q => q.answer !== null).length;
          const totalCount = qs.length;
          const progressClass = answeredCount === 0 ? "none" : answeredCount === totalCount ? "complete" : "partial";
          const progressLabel = answeredCount === 0
            ? `${totalCount} questions — not started`
            : answeredCount === totalCount
              ? `Fully diagnosed (${totalCount}/${totalCount})`
              : `In progress (${answeredCount}/${totalCount} answered)`;

          return (
            <div key={area.id} className={`area-card ${isOpen ? "selected" : ""}`} onClick={() => setSelected(isOpen ? null : area.id)}>
              <div className="area-header">
                <div>
                  <CatPill category={area.category} />
                  <div className="area-name">
                    {area.label}
                    {area.isEstimated && <span className="area-est-badge">Estimated</span>}
                  </div>
                </div>
                <div>
                  <div className="area-leakage" style={{ color }}>{fmt(leakAmt)}</div>
                  <div className="area-leakage-label">est. leakage / yr</div>
                </div>
              </div>

              <div className="score-row">
                <div className="score-row-header">
                  <span className="score-name">Performance Score</span>
                  <span className="score-nums">
                    <span style={{ color }}>Score: {area.clientScore}</span>
                    <span>·</span>
                    <span>Benchmark: {area.benchmarkScore}</span>
                  </span>
                </div>
                <ScoreBar clientScore={area.clientScore} benchmarkScore={area.benchmarkScore} color={color} />
              </div>

              {/* Progress indicator */}
              <div className={`q-progress ${progressClass}`}>{progressLabel}</div>

              {/* Expanded: questions + override */}
              {isOpen && (
                <div onClick={e => e.stopPropagation()}>
                  {/* Diagnostic questions */}
                  {qs.length > 0 && (
                    <div className="question-list">
                      {qs.map((q, qi) => (
                        <div key={qi}>
                          <div className="question-text">Q{qi + 1}. {q.text}</div>
                          <div className="option-list">
                            {q.options.map((opt, oi) => (
                              <button
                                key={oi}
                                className={`option-btn${q.answer === oi ? " selected" : ""}`}
                                onClick={() => onAnswerQuestion(area.id, qi, oi)}
                              >
                                <span className="option-radio">
                                  {q.answer === oi && <span className="option-radio-dot" />}
                                </span>
                                <span className="option-label">{opt.label}</span>
                                <span className="option-score">{opt.score}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual override row */}
                  <div className="override-row">
                    {[
                      { label: "Override Score", key: "clientScore", suffix: "" },
                      { label: "Benchmark Score", key: "benchmarkScore", suffix: "" },
                      { label: "Leakage % of Revenue", key: "leakagePct", suffix: "%" },
                    ].map(({ label, key, suffix }) => (
                      <div key={key}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#A0ADC0", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>{label}</div>
                        <EditableValue
                          value={key === "leakagePct" ? Math.round(area[key] * 100) : area[key]}
                          onChange={v => onUpdateArea(area.id, key, key === "leakagePct" ? v / 100 : v)}
                          suffix={suffix}
                          className=""
                        />
                      </div>
                    ))}
                  </div>
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

  // Record a diagnostic answer for a question inside an area
  // Re-computes clientScore as the average of all answered questions, marks isEstimated=false once all answered
  const answerQuestion = useCallback((areaId, questionIndex, optionIndex) => {
    setClients(cs => cs.map(c => {
      if (c.id !== activeClientId) return c;
      const areas = c.areas.map(a => {
        if (a.id !== areaId) return a;
        const questions = a.questions.map((q, qi) =>
          qi === questionIndex ? { ...q, answer: optionIndex } : q
        );
        const answered = questions.filter(q => q.answer !== null);
        const newScore = answered.length > 0
          ? Math.round(answered.reduce((s, q) => s + q.options[q.answer].score, 0) / answered.length)
          : a.clientScore;
        const allAnswered = answered.length === questions.length;
        return { ...a, questions, clientScore: newScore, isEstimated: !allAnswered };
      });
      return { ...c, areas };
    }));
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
          {activeSection === "gaps"      && <RevenueGapsSection  client={client} onUpdateArea={updateArea} onAnswerQuestion={answerQuestion} />}
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
