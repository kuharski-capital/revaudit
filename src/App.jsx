import { useState, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #EBF0F8;
  color: #0D0D0D;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.root {
  min-height: 100dvh;
  background: linear-gradient(160deg, #DDE8F5 0%, #EBF0F8 50%, #E4ECF6 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 16px;
}
.wrap { width: 100%; max-width: 520px; padding-bottom: 80px; }

/* ── Header ── */
.header { padding: 56px 0 36px; }
.kc-label { font-size: 11px; color: #B0BDD0; text-transform: uppercase; letter-spacing: 0.18em; font-weight: 600; margin-bottom: 10px; }
.app-title { font-size: 30px; font-weight: 900; color: #0D0D0D; letter-spacing: -0.04em; line-height: 1; }
.app-sub { font-size: 14px; color: #8A9AB5; margin-top: 6px; font-weight: 400; }

/* ── Progress ── */
.progress-wrap { margin-bottom: 28px; }
.progress-track { height: 4px; background: rgba(0,0,0,0.06); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: #0066FF; border-radius: 2px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
.progress-label { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 12px; color: #A0ADC0; font-weight: 500; }

/* ── Cards ── */
.card { background: #FFF; border-radius: 24px; padding: 28px; margin-bottom: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04); }
.card-sm { border-radius: 20px; padding: 22px 24px; }
.card-hero { background: #0D0D0D; border-radius: 24px; padding: 32px 28px; margin-bottom: 12px; position: relative; overflow: hidden; }
.card-hero::after { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0,102,255,0.18) 0%, transparent 70%); pointer-events: none; }

/* ── Hero ── */
.hero-eyebrow { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 10px; }
.hero-company { font-size: 13px; color: #444; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.hero-number { font-size: 68px; font-weight: 900; letter-spacing: -0.05em; line-height: 0.95; font-family: 'DM Mono', monospace; color: #0066FF; }
.hero-sub { font-size: 14px; color: #666; margin-top: 12px; font-weight: 400; }
.stat-row { display: flex; margin-top: 24px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.08); }
.stat-item { flex: 1; padding: 0 4px; }
.stat-item + .stat-item { border-left: 1px solid rgba(255,255,255,0.08); padding-left: 20px; }
.stat-val { font-size: 22px; font-weight: 800; font-family: 'DM Mono', monospace; letter-spacing: -0.03em; color: #FFF; }
.stat-label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; font-weight: 600; }

/* ── Inputs ── */
.field-label { font-size: 12px; font-weight: 700; color: #8A9AB5; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; display: block; }
.input-wrap { position: relative; }
.input-prefix { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; color: #A0ADC0; pointer-events: none; font-family: 'DM Mono', monospace; }
.ra-input { width: 100%; background: #F4F7FB; border: 1.5px solid #E4EAF4; border-radius: 14px; padding: 15px 18px; color: #0D0D0D; font-size: 16px; font-family: 'DM Mono', monospace; outline: none; transition: border-color 0.2s, background 0.2s; font-weight: 500; }
.ra-input:focus { border-color: #0066FF; background: #FFF; }
.ra-input.has-prefix { padding-left: 28px; }
.ra-input.text-input { font-family: 'DM Sans', sans-serif; font-weight: 500; }
.ra-input::placeholder { color: #B0BDD0; }
.rev-hint { font-size: 13px; color: #0066FF; margin-top: 8px; font-family: 'DM Mono', monospace; font-weight: 600; }

/* ── Industry grid ── */
.industry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.ind-btn { background: #F4F7FB; border: 1.5px solid #E4EAF4; border-radius: 16px; padding: 18px 8px 14px; text-align: center; cursor: pointer; transition: all 0.18s; font-family: inherit; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ind-btn:hover { background: #EEF2FA; border-color: #CDD5E8; }
.ind-btn.sel { background: #EEF4FF; border-color: #0066FF; }
.ind-icon-wrap { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.ind-icon-wrap svg { width: 22px; height: 22px; stroke: #A0ADC0; stroke-width: 1.75; fill: none; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.18s; }
.ind-btn.sel .ind-icon-wrap svg { stroke: #0066FF; }
.ind-label { font-size: 9px; font-weight: 700; color: #A0ADC0; display: block; line-height: 1.2; text-transform: uppercase; letter-spacing: 0.05em; }
.ind-btn.sel .ind-label { color: #0066FF; }

/* ── Question ── */
.q-step-badge { display: inline-flex; align-items: center; gap: 8px; background: #0D0D0D; color: #FFF; border-radius: 20px; padding: 6px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
.q-category-dot { width: 6px; height: 6px; border-radius: 50%; background: #0066FF; flex-shrink: 0; }
.q-text { font-size: 22px; font-weight: 800; color: #0D0D0D; line-height: 1.25; letter-spacing: -0.03em; margin-bottom: 28px; }
.choices { display: flex; flex-direction: column; gap: 10px; }
.choice { background: #F4F7FB; border: 1.5px solid #E4EAF4; border-radius: 16px; padding: 18px; cursor: pointer; transition: all 0.18s; text-align: left; font-family: inherit; display: flex; align-items: center; gap: 14px; }
.choice:hover { background: #EEF2FA; border-color: #CDD5E8; }
.choice.sel { background: #EEF4FF; border-color: #0066FF; }
.choice-dot { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #D0D9E8; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.18s; background: #FFF; }
.choice.sel .choice-dot { background: #0066FF; border-color: #0066FF; box-shadow: 0 0 0 3px rgba(0,102,255,0.15); }
.choice-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: white; opacity: 0; transition: opacity 0.18s; }
.choice.sel .choice-dot-inner { opacity: 1; }
.choice-text { flex: 1; }
.choice-label { font-size: 15px; font-weight: 700; color: #4A5568; display: block; margin-bottom: 3px; letter-spacing: -0.01em; }
.choice.sel .choice-label { color: #0D0D0D; }
.choice-desc { font-size: 13px; color: #A0ADC0; line-height: 1.4; font-weight: 400; }
.choice.sel .choice-desc { color: #5068A0; }

/* ── Buttons ── */
.btn-primary { width: 100%; padding: 18px; background: #0D0D0D; border: none; border-radius: 16px; color: #FFF; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; letter-spacing: -0.01em; transition: opacity 0.15s, transform 0.1s; }
.btn-primary:hover { opacity: 0.85; }
.btn-primary:active { transform: scale(0.99); }
.btn-primary:disabled { background: #E4EAF4; color: #A0ADC0; cursor: not-allowed; }
.btn-blue { background: #0066FF; }
.btn-blue:hover { opacity: 0.88; }
.btn-ghost { padding: 16px 20px; background: #FFF; border: 1.5px solid #E4EAF4; border-radius: 16px; color: #8A9AB5; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.btn-ghost:hover { border-color: #CDD5E8; color: #4A5568; }
.btn-row { display: flex; gap: 10px; margin-top: 16px; }

/* ── Intro card ── */
.intro-card { background: #0D0D0D; border-radius: 24px; padding: 32px 28px; margin-bottom: 14px; position: relative; overflow: hidden; }
.intro-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 65%); pointer-events: none; }
.intro-eyebrow { font-size: 11px; color: #0066FF; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700; margin-bottom: 12px; }
.intro-headline { font-size: 28px; font-weight: 900; color: #FFF; line-height: 1.15; letter-spacing: -0.04em; margin-bottom: 14px; }
.intro-body { font-size: 14px; color: #555; line-height: 1.7; font-weight: 400; }

/* ── Loading ── */
.loading-screen { text-align: center; padding: 80px 0; }
.loading-icon { font-size: 40px; margin-bottom: 24px; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.loading-title { font-size: 24px; font-weight: 900; color: #0D0D0D; margin-bottom: 8px; letter-spacing: -0.03em; }
.loading-sub { font-size: 14px; color: #A0ADC0; margin-bottom: 40px; }
.loading-steps { display: flex; flex-direction: column; gap: 14px; max-width: 260px; margin: 0 auto; }
.loading-step { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #C0CAD8; font-weight: 500; }
.loading-step.done { color: #22A05A; }
.step-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

/* ── Gap cards ── */
.gap-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.gap-category-pill { font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.08em; }
.gap-amount { font-size: 26px; font-weight: 900; font-family: 'DM Mono', monospace; text-align: right; letter-spacing: -0.04em; }
.gap-amount-label { font-size: 10px; color: #A0ADC0; text-align: right; margin-top: 2px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.gap-answer { font-size: 13px; color: #A0ADC0; margin-bottom: 14px; font-weight: 400; }
.gap-answer strong { color: #4A5568; font-weight: 600; }
.fix-row { display: flex; gap: 10px; margin-bottom: 8px; }
.fix-check { color: #22A05A; font-size: 13px; flex-shrink: 0; font-weight: 700; }
.fix-text { font-size: 13px; color: #8A9AB5; line-height: 1.5; font-weight: 400; }

/* ── Insight cards ── */
.insight-stat { font-size: 16px; font-weight: 700; color: #0D0D0D; line-height: 1.4; margin-bottom: 6px; letter-spacing: -0.01em; }
.insight-source { font-size: 11px; color: #0066FF; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
.insight-context { font-size: 13px; color: #8A9AB5; line-height: 1.6; }

/* ── Opportunity banner ── */
.opp-banner { background: #0D0D0D; border-radius: 20px; padding: 24px; margin-bottom: 12px; position: relative; overflow: hidden; }
.opp-banner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,102,255,0.6), transparent); }
.opp-label { font-size: 11px; color: #0066FF; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; margin-bottom: 8px; }
.opp-text { font-size: 15px; color: #CCC; line-height: 1.6; font-weight: 400; }

/* ── CTA card ── */
.cta-card { background: #FFF; border-radius: 24px; padding: 36px 28px; text-align: center; margin-bottom: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04); }
.cta-price { font-size: 52px; font-weight: 900; font-family: 'DM Mono', monospace; color: #0D0D0D; letter-spacing: -0.05em; line-height: 1; }
.cta-price-sub { font-size: 13px; color: #A0ADC0; margin-top: 6px; font-weight: 400; }
.cta-features { display: flex; flex-direction: column; gap: 12px; margin: 28px 0 32px; text-align: left; }
.cta-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #4A5568; font-weight: 400; }
.cta-check { width: 22px; height: 22px; border-radius: 50%; background: #EDFBF2; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; font-weight: 700; color: #22A05A; }
.cta-contact { font-size: 12px; color: #C0CAD8; margin-top: 14px; font-weight: 400; }

/* ── Section label ── */
.section-label { font-size: 11px; font-weight: 700; color: #A0ADC0; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px; padding-left: 2px; }
.divider { height: 1px; background: rgba(0,0,0,0.06); margin: 36px 0; }
.setup-field { margin-bottom: 26px; }

/* ── Desktop ── */
@media (min-width: 768px) {
  .root { padding: 0 32px; }
  .wrap { max-width: 540px; }
  .header { padding: 72px 0 48px; }
  .card { padding: 36px; }
  .card-sm { padding: 28px; }
  .card-hero { padding: 40px 36px; }
  .intro-card { padding: 40px 36px; }
  .cta-card { padding: 44px 40px; }
  .hero-number { font-size: 80px; }
  .q-text { font-size: 24px; }
  .choice { padding: 20px 22px; }
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .hero-number { font-size: 56px; }
  .q-text { font-size: 20px; }
  .wrap { padding-bottom: 60px; }
  .card { padding: 22px; }
  .card-sm { padding: 18px; }
  .industry-grid { gap: 6px; }
  .ind-btn { padding: 14px 6px 12px; }
  .stat-val { font-size: 18px; }
}

@media print {
  body { background: white !important; }
  .no-print { display: none !important; }
}
`;

/* ── Industry SVG icons ── */
const IND_ICONS = {
  electrical: (
    <svg viewBox="0 0 24 24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
  hvac: (
    <svg viewBox="0 0 24 24"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  plumbing: (
    <svg viewBox="0 0 24 24"><path d="M12 2C8 7 5 11 5 14a7 7 0 0014 0c0-3-3-7-7-12z" /></svg>
  ),
  agency: (
    <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  ),
  retail: (
    <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14h18V6l-3-4H6z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
  ),
  healthcare: (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
  ),
  remodel: (
    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  ),
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

/* ── Industry-specific question sets ── */
const INDUSTRY_QUESTIONS = {
  electrical: [
    { id: "lead_response", category: "Demand",
      question: "When a new electrical lead contacts you, how quickly does your team respond?",
      choices: [
        { label: "Within minutes", desc: "Always answered or called back immediately", weight: 0.01 },
        { label: "Same day", desc: "Typically respond within a few hours", weight: 0.03 },
        { label: "Next day or longer", desc: "Sometimes leads fall through the cracks", weight: 0.06 },
        { label: "No real system", desc: "Honestly, some inquiries never get followed up", weight: 0.10 },
      ]},
    { id: "quote_win_rate", category: "Sales",
      question: "When you send an electrical quote, how often do you win the job?",
      choices: [
        { label: "More than 7 in 10", desc: "Strong close rate — prospects convert well", weight: 0.01 },
        { label: "About half", desc: "Win roughly 50% of quotes sent out", weight: 0.04 },
        { label: "Less than half", desc: "Win maybe 3–4 out of every 10", weight: 0.07 },
        { label: "Don't track it", desc: "No visibility into win/loss rates at all", weight: 0.09 },
      ]},
    { id: "change_orders", category: "Billing",
      question: "How consistently do you document and bill for change orders and scope additions?",
      choices: [
        { label: "Every time, no exceptions", desc: "Signed change order before any additional work", weight: 0.01 },
        { label: "Most of the time", desc: "Occasional verbal approvals that don't get billed", weight: 0.04 },
        { label: "Inconsistently", desc: "Often just absorb extra scope to keep the peace", weight: 0.08 },
        { label: "Rarely formalize it", desc: "Change orders are not part of our process", weight: 0.12 },
      ]},
    { id: "tech_utilization", category: "Labor",
      question: "How efficiently are your electricians scheduled and utilized each day?",
      choices: [
        { label: "Highly efficient", desc: "Tight scheduling, minimal drive time and idle gaps", weight: 0.02 },
        { label: "Pretty good", desc: "Some inefficiency but generally productive", weight: 0.05 },
        { label: "Noticeable gaps", desc: "Visible idle time, travel inefficiency, or rework", weight: 0.09 },
        { label: "Significant waste", desc: "Scheduling issues and rework are common problems", weight: 0.14 },
      ]},
    { id: "service_agreements", category: "Revenue Model",
      question: "Do you offer electrical service agreements or maintenance contracts?",
      choices: [
        { label: "Yes — active program", desc: "Structured agreements generating recurring revenue", weight: 0.00 },
        { label: "Informal only", desc: "A few regulars, no structured offering", weight: 0.04 },
        { label: "Barely any", desc: "Almost entirely project-by-project work", weight: 0.07 },
        { label: "None at all", desc: "No recurring revenue component whatsoever", weight: 0.10 },
      ]},
    { id: "customer_retention", category: "Retention",
      question: "How well do past customers come back and refer new work to you?",
      choices: [
        { label: "Strong — we're their electrician", desc: "High repeat rate, referrals are a major source", weight: 0.01 },
        { label: "Decent repeat business", desc: "Good relationships but no formal follow-up", weight: 0.04 },
        { label: "Mostly one-and-done", desc: "Most customers don't return or refer others", weight: 0.08 },
        { label: "No strategy for it", desc: "Never focused on retention or referrals", weight: 0.12 },
      ]},
    { id: "pipeline_visibility", category: "Forecasting",
      question: "How clearly can you see your job pipeline and forecast revenue 30–60 days out?",
      choices: [
        { label: "Very clear", desc: "Know what's coming and can plan around it", weight: 0.01 },
        { label: "Roughly", desc: "Have a sense — some gaps in visibility", weight: 0.03 },
        { label: "Murky", desc: "Hard to predict what next month brings", weight: 0.06 },
        { label: "Flying blind", desc: "No real pipeline visibility at all", weight: 0.09 },
      ]},
  ],

  hvac: [
    { id: "lead_response", category: "Demand",
      question: "How quickly does your team respond to new HVAC service calls and web inquiries?",
      choices: [
        { label: "Within minutes", desc: "Calls answered or texted back immediately", weight: 0.01 },
        { label: "Within a few hours", desc: "Respond same day, typically promptly", weight: 0.03 },
        { label: "Next day or longer", desc: "Sometimes slower, especially in off-peak periods", weight: 0.07 },
        { label: "No reliable process", desc: "Response time is inconsistent and untracked", weight: 0.10 },
      ]},
    { id: "maintenance_agreements", category: "Revenue Model",
      question: "What portion of your residential customers are on a maintenance agreement?",
      choices: [
        { label: "30%+ — strong program", desc: "Maintenance agreements are a core revenue driver", weight: 0.00 },
        { label: "10–30%", desc: "Growing program, not yet maximized", weight: 0.04 },
        { label: "Under 10%", desc: "Few agreements, mostly reactive service", weight: 0.08 },
        { label: "None offered", desc: "No maintenance agreement program in place", weight: 0.12 },
      ]},
    { id: "tech_upsell", category: "Sales",
      question: "How often do your technicians present and close premium equipment or add-on solutions on site?",
      choices: [
        { label: "Consistently — it's trained", desc: "Techs always present options at every visit", weight: 0.01 },
        { label: "Sometimes", desc: "It happens but isn't systematic", weight: 0.05 },
        { label: "Rarely", desc: "Techs focus on the repair, not the sale", weight: 0.08 },
        { label: "Never", desc: "No upsell or premium option presentations", weight: 0.11 },
      ]},
    { id: "seasonal_demand", category: "Labor",
      question: "How well do you manage technician scheduling and demand during peak seasons?",
      choices: [
        { label: "Very well", desc: "Pre-season campaigns, optimized scheduling", weight: 0.02 },
        { label: "Mostly okay", desc: "Some strain at peaks but generally manageable", weight: 0.05 },
        { label: "Struggle at peaks", desc: "Missed calls and delays during busy periods", weight: 0.09 },
        { label: "Significant problems", desc: "Demand spikes regularly cause lost revenue", weight: 0.13 },
      ]},
    { id: "billing_speed", category: "Billing",
      question: "How quickly do you invoice after completing an HVAC service visit?",
      choices: [
        { label: "Same day — always", desc: "Invoiced at the job site or within hours", weight: 0.01 },
        { label: "Within a few days", desc: "Typically invoiced by end of week", weight: 0.04 },
        { label: "Inconsistent", desc: "Sometimes lags a week or more", weight: 0.07 },
        { label: "Major delays", desc: "Invoice lag is a real cash flow problem", weight: 0.11 },
      ]},
    { id: "customer_retention", category: "Retention",
      question: "How well do you retain residential HVAC customers for future service and referrals?",
      choices: [
        { label: "Very well", desc: "High repeat rate with structured follow-up", weight: 0.01 },
        { label: "Decent", desc: "Some repeat customers, informal follow-up", weight: 0.04 },
        { label: "Low retention", desc: "Most customers shop around each time", weight: 0.08 },
        { label: "No strategy", desc: "No system for follow-up or referrals", weight: 0.12 },
      ]},
    { id: "pipeline_visibility", category: "Forecasting",
      question: "How clearly can you forecast revenue through seasonal demand swings?",
      choices: [
        { label: "Very clear", desc: "Can plan staffing and cash around demand cycles", weight: 0.01 },
        { label: "Roughly", desc: "General sense, some gaps", weight: 0.03 },
        { label: "Difficult to predict", desc: "Revenue variance is hard to plan around", weight: 0.07 },
        { label: "Flying blind", desc: "No reliable forecasting in place", weight: 0.09 },
      ]},
  ],

  plumbing: [
    { id: "lead_response", category: "Demand",
      question: "When a new plumbing call comes in, how quickly does your team respond?",
      choices: [
        { label: "Immediately — always", desc: "Live answer or instant text/callback", weight: 0.01 },
        { label: "Within a few hours", desc: "Same-day response almost always", weight: 0.03 },
        { label: "Next day or slower", desc: "Occasional missed calls and delayed follow-ups", weight: 0.07 },
        { label: "No consistent process", desc: "Response time is unpredictable and untracked", weight: 0.10 },
      ]},
    { id: "premium_pricing", category: "Sales",
      question: "How often do you price premium or offer add-on services (water quality, drain protection, etc.)?",
      choices: [
        { label: "Consistently", desc: "Structured options presented at every visit", weight: 0.01 },
        { label: "Sometimes", desc: "Mentioned when it comes up naturally", weight: 0.04 },
        { label: "Rarely", desc: "Focus is on fixing the problem, not upselling", weight: 0.08 },
        { label: "Never", desc: "No add-on or premium pricing approach", weight: 0.11 },
      ]},
    { id: "billing_speed", category: "Billing",
      question: "How quickly do you invoice after completing a plumbing job?",
      choices: [
        { label: "At the job site", desc: "Invoiced and collected before leaving", weight: 0.01 },
        { label: "Same or next day", desc: "Invoice goes out within 24 hours", weight: 0.04 },
        { label: "Within the week", desc: "Usually a few days, sometimes longer", weight: 0.07 },
        { label: "Inconsistent / delayed", desc: "Invoice lag creates real cash flow gaps", weight: 0.11 },
      ]},
    { id: "tech_utilization", category: "Labor",
      question: "How efficiently are your plumbers dispatched and scheduled each day?",
      choices: [
        { label: "Highly efficient", desc: "Optimized routes, minimal windshield time", weight: 0.02 },
        { label: "Mostly efficient", desc: "Some inefficiency but solid utilization", weight: 0.05 },
        { label: "Noticeable gaps", desc: "Visible idle time or poor routing", weight: 0.09 },
        { label: "Significant waste", desc: "Dispatch and scheduling are ongoing problems", weight: 0.14 },
      ]},
    { id: "repeat_customers", category: "Retention",
      question: "How many of your customers call back or actively refer others to your business?",
      choices: [
        { label: "Most of them", desc: "We're their go-to plumber — strong loyalty", weight: 0.01 },
        { label: "A decent number", desc: "Regular repeat customers, informal referrals", weight: 0.04 },
        { label: "Very few", desc: "Most customers only use us once", weight: 0.08 },
        { label: "Essentially none", desc: "No focus on retention or referral generation", weight: 0.12 },
      ]},
    { id: "service_agreements", category: "Revenue Model",
      question: "Do you have recurring service agreements or maintenance plans in place?",
      choices: [
        { label: "Yes — active program", desc: "Meaningful recurring revenue from agreements", weight: 0.00 },
        { label: "A few informal ones", desc: "Some regulars but no structured program", weight: 0.04 },
        { label: "Barely any", desc: "Almost entirely project-by-project", weight: 0.07 },
        { label: "None at all", desc: "100% transactional — no recurring revenue", weight: 0.10 },
      ]},
    { id: "pipeline_visibility", category: "Forecasting",
      question: "How clearly can you see upcoming work and forecast next month's revenue?",
      choices: [
        { label: "Very clear", desc: "Solid pipeline visibility and revenue projections", weight: 0.01 },
        { label: "Roughly", desc: "General sense, some blind spots", weight: 0.03 },
        { label: "Hard to predict", desc: "Revenue is reactive and hard to forecast", weight: 0.06 },
        { label: "No visibility at all", desc: "Live job to job with no forward view", weight: 0.09 },
      ]},
  ],

  agency: [
    { id: "revenue_model", category: "Revenue Model",
      question: "What portion of your agency revenue comes from ongoing retainers vs. one-off projects?",
      choices: [
        { label: "Mostly retainers (60%+)", desc: "Predictable recurring revenue base", weight: 0.01 },
        { label: "Mixed (30–60%)", desc: "Healthy balance but room to shift to retainers", weight: 0.04 },
        { label: "Mostly project work", desc: "Revenue is inconsistent, feast-or-famine cycles", weight: 0.09 },
        { label: "Almost all project work", desc: "No real recurring base — high revenue volatility", weight: 0.13 },
      ]},
    { id: "scope_creep", category: "Billing",
      question: "How well do you identify, document, and bill for scope creep and out-of-scope requests?",
      choices: [
        { label: "Tight — always documented", desc: "Change orders or addendums used consistently", weight: 0.01 },
        { label: "Mostly", desc: "Usually caught, occasionally absorbed", weight: 0.04 },
        { label: "Often absorbed", desc: "Scope creep frequently goes unbilled", weight: 0.08 },
        { label: "No real process", desc: "Clients routinely get extra work for free", weight: 0.12 },
      ]},
    { id: "close_rate", category: "Sales",
      question: "What is your close rate on new business proposals and pitches?",
      choices: [
        { label: "Above 60%", desc: "Strong conversion — proposals land well", weight: 0.01 },
        { label: "40–60%", desc: "Solid close rate with room to improve", weight: 0.04 },
        { label: "Below 40%", desc: "Too many proposals that don't convert", weight: 0.08 },
        { label: "Not tracked", desc: "No visibility into proposal win/loss data", weight: 0.10 },
      ]},
    { id: "utilization_rate", category: "Labor",
      question: "What is your team's average billable utilization rate?",
      choices: [
        { label: "Above 75% billable", desc: "Strong utilization — minimal non-billable drag", weight: 0.02 },
        { label: "60–75% billable", desc: "Acceptable but meaningful non-billable hours", weight: 0.05 },
        { label: "Below 60% billable", desc: "Significant non-billable time eating into margins", weight: 0.09 },
        { label: "Not tracked", desc: "No visibility into billable vs. non-billable hours", weight: 0.13 },
      ]},
    { id: "client_retention", category: "Retention",
      question: "What is your annual client retention rate?",
      choices: [
        { label: "Above 85%", desc: "Strong loyalty — clients stay and grow with you", weight: 0.01 },
        { label: "70–85%", desc: "Decent retention with some preventable churn", weight: 0.04 },
        { label: "Below 70%", desc: "High churn is creating revenue volatility", weight: 0.09 },
        { label: "Not measured", desc: "No formal tracking of client retention", weight: 0.11 },
      ]},
    { id: "lead_pipeline", category: "Demand",
      question: "How strong and consistent is your inbound pipeline of new business opportunities?",
      choices: [
        { label: "Strong and consistent", desc: "Reliable inbound flow from referrals and marketing", weight: 0.01 },
        { label: "Intermittent", desc: "Good periods and slow periods with no real system", weight: 0.05 },
        { label: "Mostly referral dependent", desc: "Pipeline is unpredictable and hard to influence", weight: 0.08 },
        { label: "Very weak", desc: "New business is largely reactive — no pipeline", weight: 0.12 },
      ]},
    { id: "revenue_forecast", category: "Forecasting",
      question: "How accurately can you forecast agency revenue 60–90 days out?",
      choices: [
        { label: "Very accurately", desc: "Reliable forecasting tied to retainers and pipeline", weight: 0.01 },
        { label: "Roughly", desc: "General sense, meaningful variability", weight: 0.03 },
        { label: "Difficult", desc: "Revenue is hard to predict more than a few weeks out", weight: 0.07 },
        { label: "Not really possible", desc: "No system for revenue forecasting", weight: 0.09 },
      ]},
  ],

  retail: [
    { id: "traffic_conversion", category: "Demand",
      question: "How effective is your approach to driving consistent foot traffic or online visitors?",
      choices: [
        { label: "Very effective", desc: "Multi-channel strategy with predictable traffic", weight: 0.01 },
        { label: "Decent", desc: "Some channels working, others underutilized", weight: 0.04 },
        { label: "Inconsistent", desc: "Traffic is variable and hard to influence", weight: 0.08 },
        { label: "Mostly passive", desc: "No real strategy — relying on walk-ins", weight: 0.12 },
      ]},
    { id: "conversion_rate", category: "Sales",
      question: "What is your typical visitor-to-purchase conversion rate?",
      choices: [
        { label: "Above 40%", desc: "Strong conversion — most visitors buy", weight: 0.01 },
        { label: "25–40%", desc: "Solid rate, some optimization opportunity", weight: 0.04 },
        { label: "Below 25%", desc: "Many visitors leave without purchasing", weight: 0.08 },
        { label: "Not tracked", desc: "Conversion rate is not measured", weight: 0.10 },
      ]},
    { id: "avg_transaction", category: "Billing",
      question: "How actively do you increase average transaction value through upsells and bundles?",
      choices: [
        { label: "Systematically", desc: "Trained staff, strategic product placement, bundles", weight: 0.01 },
        { label: "Somewhat", desc: "Some upselling happens but inconsistently", weight: 0.05 },
        { label: "Rarely", desc: "Staff don't regularly suggest additions", weight: 0.09 },
        { label: "Not at all", desc: "No focus on increasing basket size", weight: 0.12 },
      ]},
    { id: "staff_scheduling", category: "Labor",
      question: "How well are your staff scheduled to match peak traffic periods?",
      choices: [
        { label: "Very well aligned", desc: "Data-driven scheduling, minimal overstaffing", weight: 0.02 },
        { label: "Mostly aligned", desc: "Some gaps but generally appropriate coverage", weight: 0.05 },
        { label: "Often misaligned", desc: "Visibly over or understaffed at key times", weight: 0.09 },
        { label: "No real system", desc: "Scheduling is not tied to traffic data", weight: 0.13 },
      ]},
    { id: "customer_loyalty", category: "Retention",
      question: "How strong is your customer loyalty and repeat purchase rate?",
      choices: [
        { label: "Very strong", desc: "Loyalty program, high repeat rate, strong LTV", weight: 0.01 },
        { label: "Decent", desc: "Some repeat customers but no formal program", weight: 0.04 },
        { label: "Low repeat rate", desc: "Most customers are one-time purchasers", weight: 0.08 },
        { label: "No focus on it", desc: "No strategy for driving repeat business", weight: 0.12 },
      ]},
    { id: "recurring_revenue", category: "Revenue Model",
      question: "Do you have any subscription, membership, or recurring revenue programs?",
      choices: [
        { label: "Yes — meaningful program", desc: "Subscriptions or memberships generating regular revenue", weight: 0.00 },
        { label: "Small / early stage", desc: "Something in place but not yet impactful", weight: 0.04 },
        { label: "Not yet", desc: "Considering it but nothing launched", weight: 0.07 },
        { label: "None at all", desc: "100% transactional, no recurring component", weight: 0.10 },
      ]},
    { id: "inventory_forecasting", category: "Forecasting",
      question: "How accurately do you forecast inventory needs and monthly sales?",
      choices: [
        { label: "Very accurately", desc: "Data-driven forecasting, minimal overstock/stockouts", weight: 0.01 },
        { label: "Roughly", desc: "Decent feel for demand, some surprises", weight: 0.03 },
        { label: "Often off", desc: "Frequent overstock or missed sales from stockouts", weight: 0.07 },
        { label: "Not really forecasted", desc: "Inventory and sales are reactive, not planned", weight: 0.10 },
      ]},
  ],

  healthcare: [
    { id: "no_show_rate", category: "Demand",
      question: "What is your typical no-show and late cancellation rate?",
      choices: [
        { label: "Under 5%", desc: "Strong confirmation process, rare no-shows", weight: 0.01 },
        { label: "5–10%", desc: "Manageable but some revenue lost to no-shows", weight: 0.04 },
        { label: "10–20%", desc: "Significant revenue regularly lost to no-shows", weight: 0.08 },
        { label: "Above 20%", desc: "No-shows are a major and unaddressed problem", weight: 0.13 },
      ]},
    { id: "new_patient_conversion", category: "Sales",
      question: "How effectively does your front desk convert new patient inquiries into scheduled appointments?",
      choices: [
        { label: "Very effectively", desc: "High conversion, scripted intake, minimal leakage", weight: 0.01 },
        { label: "Decent", desc: "Good conversion but some calls/leads are lost", weight: 0.04 },
        { label: "Room to improve", desc: "Noticeable drop-off between inquiry and booking", weight: 0.08 },
        { label: "No real process", desc: "Conversion is not tracked or systematized", weight: 0.11 },
      ]},
    { id: "billing_accuracy", category: "Billing",
      question: "How would you describe your billing, coding accuracy, and insurance denial rate?",
      choices: [
        { label: "Clean — low denial rate", desc: "Well-managed RCM, denials under 5%", weight: 0.01 },
        { label: "Acceptable", desc: "Some denials, manageable with current process", weight: 0.05 },
        { label: "Higher than it should be", desc: "Denials and write-offs are impacting collections", weight: 0.09 },
        { label: "Significant problem", desc: "Billing issues are materially reducing revenue", weight: 0.13 },
      ]},
    { id: "provider_utilization", category: "Labor",
      question: "How fully booked is your provider schedule on a typical day?",
      choices: [
        { label: "90%+ utilization", desc: "Providers are fully productive with minimal gaps", weight: 0.02 },
        { label: "75–90%", desc: "Good utilization with some open slots", weight: 0.05 },
        { label: "Below 75%", desc: "Meaningful provider capacity going unbilled", weight: 0.09 },
        { label: "Under 60%", desc: "Significant capacity wasted — major revenue gap", weight: 0.14 },
      ]},
    { id: "patient_retention", category: "Retention",
      question: "How well do you retain patients for follow-up visits and ongoing care?",
      choices: [
        { label: "Very well", desc: "High follow-up rate, proactive recall system", weight: 0.01 },
        { label: "Decent", desc: "Most patients return but no formal recall system", weight: 0.04 },
        { label: "Low retention", desc: "Many patients don't return after initial visit", weight: 0.08 },
        { label: "No system for it", desc: "No patient recall or retention process in place", weight: 0.12 },
      ]},
    { id: "ancillary_revenue", category: "Revenue Model",
      question: "Do you offer any ancillary, elective, or wellness services beyond core visits?",
      choices: [
        { label: "Yes — meaningful revenue", desc: "Ancillary services contributing 10%+ of revenue", weight: 0.00 },
        { label: "Some, not maximized", desc: "A few offerings but not promoted or tracked", weight: 0.04 },
        { label: "Minimal", desc: "Core visits only, minimal ancillary capture", weight: 0.07 },
        { label: "None", desc: "No ancillary or elective revenue streams at all", weight: 0.10 },
      ]},
    { id: "revenue_forecast", category: "Forecasting",
      question: "How accurately can you forecast monthly patient revenue?",
      choices: [
        { label: "Very accurately", desc: "Solid forward-looking view from schedule and pipeline", weight: 0.01 },
        { label: "Roughly", desc: "Decent estimate, some variability", weight: 0.03 },
        { label: "Difficult", desc: "Revenue varies significantly and is hard to predict", weight: 0.07 },
        { label: "Not really tracked", desc: "No proactive revenue forecasting in place", weight: 0.09 },
      ]},
  ],

  remodel: [
    { id: "lead_response", category: "Demand",
      question: "When a new remodel or custom home inquiry comes in, how quickly do you respond?",
      choices: [
        { label: "Within hours — always", desc: "Same-day response is a firm standard", weight: 0.01 },
        { label: "Within 24 hours", desc: "Typically respond next business day", weight: 0.04 },
        { label: "A few days", desc: "Response time slips during busy periods", weight: 0.08 },
        { label: "No real standard", desc: "Inconsistent follow-up on new inquiries", weight: 0.11 },
      ]},
    { id: "proposal_close_rate", category: "Sales",
      question: "What is your close rate on design consultations or project proposals?",
      choices: [
        { label: "Above 60%", desc: "Strong conversion — proposals land consistently", weight: 0.01 },
        { label: "40–60%", desc: "Solid rate with room to improve", weight: 0.04 },
        { label: "Below 40%", desc: "Too many proposals that don't convert", weight: 0.08 },
        { label: "Not tracked", desc: "No visibility into proposal win/loss data", weight: 0.10 },
      ]},
    { id: "change_orders", category: "Billing",
      question: "How consistently do you document and bill for change orders and scope additions?",
      choices: [
        { label: "Every time — no exceptions", desc: "Signed change orders before any additional work", weight: 0.01 },
        { label: "Mostly", desc: "Occasional verbal approvals that go unbilled", weight: 0.05 },
        { label: "Often absorbed", desc: "Scope additions frequently aren't billed", weight: 0.09 },
        { label: "Rarely formalized", desc: "Change orders are not a defined part of our process", weight: 0.13 },
      ]},
    { id: "subcontractor_mgmt", category: "Labor",
      question: "How well do you manage subcontractors, timelines, and project cost control?",
      choices: [
        { label: "Very tightly managed", desc: "Budget tracking, milestone check-ins, on-time delivery", weight: 0.02 },
        { label: "Mostly on track", desc: "Some overruns but generally controlled", weight: 0.05 },
        { label: "Frequent overruns", desc: "Timeline and cost overruns are common", weight: 0.10 },
        { label: "Significant problems", desc: "Project overruns regularly impact profitability", weight: 0.14 },
      ]},
    { id: "referral_rate", category: "Retention",
      question: "How consistently do past clients refer new projects to you?",
      choices: [
        { label: "Referrals are our #1 source", desc: "Systematic referral process with strong results", weight: 0.01 },
        { label: "Some referrals", desc: "Happy clients refer occasionally but informally", weight: 0.04 },
        { label: "Rarely", desc: "Few referrals despite delivering good work", weight: 0.08 },
        { label: "Almost never", desc: "No focus on generating referrals from past clients", weight: 0.12 },
      ]},
    { id: "recurring_clients", category: "Revenue Model",
      question: "Do you have a structured program for past clients (referral incentives, VIP maintenance, etc.)?",
      choices: [
        { label: "Yes — active program", desc: "Structured follow-up and referral system in place", weight: 0.00 },
        { label: "Informal outreach", desc: "Touch base occasionally but no system", weight: 0.04 },
        { label: "Rarely stay in touch", desc: "Projects end and clients go quiet", weight: 0.07 },
        { label: "Nothing in place", desc: "No post-project engagement at all", weight: 0.10 },
      ]},
    { id: "pipeline_visibility", category: "Forecasting",
      question: "How clearly can you see your project pipeline and forecast revenue 60–90 days ahead?",
      choices: [
        { label: "Very clear", desc: "Solid visibility into signed, proposed, and potential work", weight: 0.01 },
        { label: "Roughly", desc: "Know what's likely but some uncertainty", weight: 0.03 },
        { label: "Hard to forecast", desc: "Pipeline is too variable to plan around confidently", weight: 0.07 },
        { label: "No real visibility", desc: "Revenue planning is largely reactive", weight: 0.09 },
      ]},
  ],
};

const CATEGORY_FIXES = {
  Demand: ["Set up a missed-call text-back system (Hatch, Podium, or Keap)", "Enforce a response SLA — first contact within 5 minutes", "Build a 5-touch follow-up sequence for every unconverted inquiry"],
  Sales: ["Review pricing quarterly vs. local market — most SMBs are undercharging", "Track your close rate weekly — what gets measured improves", "Call every prospect within 24 hours of sending a proposal"],
  Billing: ["Invoice or collect on-site or within the same day of job completion", "Require documented approval before performing any out-of-scope work", "Automate payment reminders at 7, 14, and 30 days past due"],
  Labor: ["Use scheduling software to maximize utilization and cut idle time", "Track hours per job against estimate and flag overruns in real time", "Run a weekly inefficiency review to eliminate recurring issues"],
  Retention: ["Launch a structured referral program with a small client incentive", "Automate a post-job or post-visit follow-up within 24 hours", "Build a touch cadence for your top 20% of clients"],
  "Revenue Model": ["Develop a tiered service agreement or membership program", "Identify your top 30 clients and pitch an ongoing engagement", "Model the impact of moving 10% of project revenue to retainer"],
  Forecasting: ["Hold a 30-minute weekly pipeline review — closing, stalled, at-risk", "Use a CRM or shared spreadsheet to track all active opportunities", "Set monthly revenue targets and review actuals vs. forecast each month"],
};

function calcLeakage(revenue, answers) {
  const questions = Object.values(INDUSTRY_QUESTIONS).flat();
  let gaps = [];
  Object.entries(answers).forEach(([id, chosen]) => {
    const q = questions.find(q => q.id === id);
    if (!q) return;
    const choice = q.choices.find(c => c.label === chosen.label);
    if (!choice) return;
    const leakage = revenue * choice.weight;
    if (choice.weight > 0.02) gaps.push({ category: q.category, question: q.question, answer: chosen.label, leakage, weight: choice.weight });
  });
  gaps.sort((a, b) => b.leakage - a.leakage);
  const topGaps = gaps.slice(0, 4);
  const totalLeakage = topGaps.reduce((s, g) => s + g.leakage, 0);
  const avgWeight = gaps.reduce((s, g) => s + g.weight, 0) / Math.max(gaps.length, 1);
  const healthScore = Math.max(12, Math.round(100 - avgWeight * 600));
  return { totalLeakage, topGaps, healthScore };
}

const fmt = n => n >= 1000000 ? "$" + (n / 1000000).toFixed(2) + "M" : "$" + Math.round(n / 1000).toLocaleString() + "K";

function sevColor(weight) {
  if (weight >= 0.09) return { color: "#DC2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.2)", label: "Critical" };
  if (weight >= 0.06) return { color: "#0066FF", bg: "rgba(0,102,255,0.08)", border: "rgba(0,102,255,0.2)", label: "High" };
  if (weight >= 0.03) return { color: "#D97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.2)", label: "Moderate" };
  return { color: "#22A05A", bg: "rgba(34,160,90,0.08)", border: "rgba(34,160,90,0.2)", label: "Low" };
}

function scoreColor(s) {
  if (s >= 70) return "#22A05A";
  if (s >= 50) return "#D97706";
  return "#DC2626";
}

export default function RevAudit() {
  const [step, setStep] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [revenue, setRevenue] = useState("");
  const [industry, setIndustry] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [insights, setInsights] = useState(null);

  const questions = industry ? INDUSTRY_QUESTIONS[industry] : [];
  const currentQ = questions[qIndex];
  const selectedChoice = answers[currentQ?.id];
  const revenueNum = parseFloat(revenue.replace(/[^0-9.]/g, "")) || 0;
  const setupValid = companyName.trim() && revenueNum > 0 && industry;
  const industryObj = INDUSTRIES.find(i => i.key === industry);

  const reset = () => { setStep(0); setQIndex(0); setAnswers({}); setResults(null); setInsights(null); };

  const generateReport = useCallback(async () => {
    setStep(2);
    const calc = calcLeakage(revenueNum, answers);
    const answerList = Object.entries(answers).map(([id, choice]) => {
      const allQ = Object.values(INDUSTRY_QUESTIONS).flat();
      const q = allQ.find(q => q.id === id);
      return { question: q?.question || id, answer: choice.label };
    });
    let insightData = null;
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, revenue: revenueNum, answers: answerList }),
      });
      if (res.ok) insightData = await res.json();
    } catch (e) {}
    setResults(calc);
    setInsights(insightData);
    setStep(3);
  }, [answers, revenueNum, industry]);

  const progressPct = step === 0 ? 0 : step === 1 ? ((qIndex + 1) / questions.length) * 85 : step === 2 ? 93 : 100;

  return (
    <div className="root">
      <style>{CSS}</style>
      <div className="wrap">

        {/* Header */}
        <div className="header">
          <div className="kc-label">Kuharski Capital</div>
          <div className="app-title" style={{ cursor: step > 0 ? "pointer" : "default" }} onClick={step > 0 ? reset : undefined}>
            RevAudit™
          </div>
          <div className="app-sub">Revenue Leakage Intelligence</div>
        </div>

        {/* Progress */}
        {step > 0 && step < 3 && (
          <div className="progress-wrap no-print">
            <div className="progress-label">
              <span>{step === 1 ? `Question ${qIndex + 1} of ${questions.length}` : "Generating report…"}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: progressPct + "%" }} /></div>
          </div>
        )}

        {/* ══ SETUP ══ */}
        {step === 0 && (
          <div>
            <div className="intro-card">
              <div className="intro-eyebrow">Revenue Diagnostic</div>
              <div className="intro-headline">Find where revenue is leaking.</div>
              <div className="intro-body">7 questions tailored to your industry. Under 3 minutes. Get a dollar-quantified gap report backed by live market intelligence.</div>
            </div>

            <div className="card">
              <div className="setup-field">
                <label className="field-label">Company Name</label>
                <input className="ra-input text-input" placeholder="e.g. Precision Electric Co." value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="setup-field">
                <label className="field-label">Annual Revenue</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input className="ra-input has-prefix" placeholder="1,200,000" value={revenue}
                    onChange={e => setRevenue(e.target.value)}
                    onBlur={e => { const n = parseFloat(e.target.value.replace(/[^0-9.]/g, "")); if (n) setRevenue(n.toLocaleString()); }} />
                </div>
                {revenueNum > 0 && <div className="rev-hint">{fmt(revenueNum)} annual revenue</div>}
              </div>
              <div>
                <label className="field-label">Industry</label>
                <div className="industry-grid">
                  {INDUSTRIES.map(ind => (
                    <button key={ind.key} className={"ind-btn" + (industry === ind.key ? " sel" : "")} onClick={() => { setIndustry(ind.key); setAnswers({}); setQIndex(0); }}>
                      <div className="ind-icon-wrap">{IND_ICONS[ind.key]}</div>
                      <span className="ind-label">{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="btn-primary btn-blue" disabled={!setupValid} onClick={() => setStep(1)}>
                Start Diagnostic →
              </button>
            </div>
          </div>
        )}

        {/* ══ QUESTIONS ══ */}
        {step === 1 && currentQ && (
          <div>
            <div className="card">
              <div className="q-step-badge">
                <span className="q-category-dot" />
                {currentQ.category}
              </div>
              <div className="q-text">{currentQ.question}</div>
              <div className="choices">
                {currentQ.choices.map(choice => (
                  <button key={choice.label} className={"choice" + (selectedChoice?.label === choice.label ? " sel" : "")}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: choice }))}>
                    <div className="choice-dot"><div className="choice-dot-inner" /></div>
                    <div className="choice-text">
                      <span className="choice-label">{choice.label}</span>
                      <span className="choice-desc">{choice.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-ghost" onClick={() => qIndex > 0 ? setQIndex(i => i - 1) : setStep(0)}>← Back</button>
              <button className="btn-primary btn-blue" style={{ flex: 1 }} disabled={!selectedChoice}
                onClick={() => qIndex < questions.length - 1 ? setQIndex(i => i + 1) : generateReport()}>
                {qIndex < questions.length - 1 ? "Next →" : "Generate Report →"}
              </button>
            </div>
          </div>
        )}

        {/* ══ LOADING ══ */}
        {step === 2 && (
          <div className="loading-screen">
            <div className="loading-icon">◎</div>
            <div className="loading-title">Building your report…</div>
            <div className="loading-sub">Searching for live {industryObj?.label} market data.</div>
            <div className="loading-steps">
              <div className="loading-step done"><div className="step-dot" />Diagnostic complete</div>
              <div className="loading-step done"><div className="step-dot" />Leakage estimates calculated</div>
              <div className="loading-step"><div className="step-dot" />Fetching market intelligence…</div>
            </div>
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {step === 3 && results && (
          <div>
            <div className="card-hero">
              <div className="hero-company">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{IND_ICONS[industry]?.props?.children}</svg>
                <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>{companyName} · {industryObj?.label}</span>
              </div>
              <div className="hero-eyebrow">Estimated Annual Leakage</div>
              <div className="hero-number">{fmt(results.totalLeakage)}</div>
              <div className="hero-sub">≈ {Math.round((results.totalLeakage / revenueNum) * 100)}% of revenue &nbsp;·&nbsp; {fmt(results.totalLeakage / 12)}/mo</div>
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-val" style={{ color: scoreColor(results.healthScore) }}>{results.healthScore}</div>
                  <div className="stat-label">Health Score</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val">{results.topGaps.length}</div>
                  <div className="stat-label">Gaps Found</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val" style={{ fontSize: 16 }}>{fmt(revenueNum)}</div>
                  <div className="stat-label">Revenue</div>
                </div>
              </div>
            </div>

            <div className="section-label" style={{ marginTop: 28 }}>Revenue Gaps Identified</div>
            {results.topGaps.map((gap, i) => {
              const sev = sevColor(gap.weight);
              const fixes = CATEGORY_FIXES[gap.category] || [];
              return (
                <div key={i} className="card card-sm">
                  <div className="gap-header">
                    <div style={{ flex: 1 }}>
                      <span className="gap-category-pill" style={{ background: sev.bg, color: sev.color, border: "1px solid " + sev.border }}>{gap.category} · {sev.label}</span>
                      <div className="gap-answer" style={{ marginTop: 8 }}>You said: <strong>"{gap.answer}"</strong></div>
                    </div>
                    <div style={{ marginLeft: 14 }}>
                      <div className="gap-amount" style={{ color: sev.color }}>{fmt(gap.leakage)}</div>
                      <div className="gap-amount-label">per year</div>
                    </div>
                  </div>
                  {fixes.slice(0, 2).map((fix, j) => (
                    <div key={j} className="fix-row"><span className="fix-check">✓</span><span className="fix-text">{fix}</span></div>
                  ))}
                </div>
              );
            })}

            {insights && (
              <div>
                <div className="divider" />
                <div className="section-label">What the {industryObj?.label} Market Is Saying</div>
                {insights.industryContext && (
                  <div className="card card-sm">
                    <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.75 }}>{insights.industryContext}</div>
                  </div>
                )}
                {insights.marketInsights?.map((mi, i) => (
                  <div key={i} className="card card-sm">
                    <div className="insight-stat">"{mi.stat}"</div>
                    <div className="insight-source">— {mi.source}</div>
                    <div className="insight-context">{mi.relevance}</div>
                  </div>
                ))}
                {insights.topOpportunity && (
                  <div className="opp-banner">
                    <div className="opp-label">Top Opportunity</div>
                    <div className="opp-text">{insights.topOpportunity}</div>
                  </div>
                )}
              </div>
            )}

            <div className="divider" />
            <div className="cta-card">
              <div style={{ fontSize: 11, color: "#0066FF", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 10 }}>Next Step</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#0D0D0D", letterSpacing: "-0.04em", marginBottom: 8 }}>Full Revenue Diagnostic</div>
              <div style={{ fontSize: 14, color: "#8A9AB5", lineHeight: 1.7, marginBottom: 24 }}>
                This scan found <strong style={{ color: "#0D0D0D" }}>{fmt(results.totalLeakage)}</strong> in estimated leakage. A full audit goes deeper across every revenue category and delivers a 90-day action roadmap with dollar precision.
              </div>
              <div className="cta-features">
                {["Full diagnostic across all revenue categories", "Dollar impact quantified for each gap", "Prioritized 90-day action roadmap", "Benchmark vs. industry top performers"].map(f => (
                  <div key={f} className="cta-feature"><div className="cta-check">✓</div>{f}</div>
                ))}
              </div>
              <div className="cta-price">$1,500</div>
              <div className="cta-price-sub">Flat fee · Delivered in 5 business days</div>
              <a href={`mailto:forrest@kuharskicapital.com?subject=Full Revenue Audit — ${companyName}`}
                style={{ display: "block", marginTop: 24, padding: "18px", background: "#0066FF", borderRadius: 16, color: "#FFF", fontSize: 15, fontWeight: 800, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 8px 28px rgba(0,102,255,0.28)" }}>
                Get the Full Audit →
              </a>
              <div className="cta-contact">forrest@kuharskicapital.com · kuharskicapital.com</div>
            </div>

            <div className="btn-row no-print" style={{ marginTop: 8 }}>
              <button className="btn-ghost" onClick={reset}>← New Report</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => window.print()}>Save PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
