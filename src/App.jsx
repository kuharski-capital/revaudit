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

/* ── Layout ── */
.root {
  min-height: 100dvh;
  background: linear-gradient(160deg, #DDE8F5 0%, #EBF0F8 50%, #E4ECF6 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 16px;
}
.wrap {
  width: 100%;
  max-width: 520px;
  padding-bottom: 80px;
}

/* ── Header ── */
.header { padding: 56px 0 36px; }
.kc-label {
  font-size: 11px; color: #B0BDD0; text-transform: uppercase;
  letter-spacing: 0.18em; font-weight: 600; margin-bottom: 10px;
}
.app-title {
  font-size: 30px; font-weight: 900; color: #0D0D0D;
  letter-spacing: -0.04em; line-height: 1;
}
.app-sub { font-size: 14px; color: #8A9AB5; margin-top: 6px; font-weight: 400; }

/* ── Progress ── */
.progress-wrap { margin-bottom: 28px; }
.progress-track {
  height: 4px; background: rgba(0,0,0,0.06); border-radius: 2px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: #0066FF;
  border-radius: 2px; transition: width 0.6s cubic-bezier(.4,0,.2,1);
}
.progress-label {
  display: flex; justify-content: space-between;
  margin-bottom: 10px; font-size: 12px; color: #A0ADC0; font-weight: 500;
}

/* ── Cards ── */
.card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04);
}
.card-sm { border-radius: 20px; padding: 22px 24px; }
.card-flat { box-shadow: none; background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.8); }
.card-hero {
  background: #0D0D0D;
  border-radius: 24px;
  padding: 32px 28px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}
.card-hero::after {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Hero number ── */
.hero-eyebrow { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 10px; }
.hero-company { font-size: 13px; color: #444; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.hero-number {
  font-size: 68px;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.95;
  font-family: 'DM Mono', monospace;
  color: #0066FF;
}
.hero-sub {
  font-size: 14px; color: #666; margin-top: 12px; font-weight: 400;
}

/* ── Stat row ── */
.stat-row {
  display: flex; margin-top: 24px; padding-top: 22px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.stat-item { flex: 1; padding: 0 4px; }
.stat-item + .stat-item { border-left: 1px solid rgba(255,255,255,0.08); padding-left: 20px; }
.stat-val {
  font-size: 22px; font-weight: 800; font-family: 'DM Mono', monospace;
  letter-spacing: -0.03em; color: #FFF;
}
.stat-label {
  font-size: 10px; color: #555; text-transform: uppercase;
  letter-spacing: 0.1em; margin-top: 4px; font-weight: 600;
}

/* ── Inputs ── */
.field-label {
  font-size: 12px; font-weight: 700; color: #8A9AB5;
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; display: block;
}
.input-wrap { position: relative; }
.input-prefix {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  font-size: 16px; color: #A0ADC0; pointer-events: none; font-family: 'DM Mono', monospace;
}
.ra-input {
  width: 100%;
  background: #F4F7FB;
  border: 1.5px solid #E4EAF4;
  border-radius: 14px;
  padding: 15px 18px;
  color: #0D0D0D;
  font-size: 16px;
  font-family: 'DM Mono', monospace;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  font-weight: 500;
}
.ra-input:focus { border-color: #0066FF; background: #FFF; }
.ra-input.has-prefix { padding-left: 28px; }
.ra-input.text-input { font-family: 'DM Sans', sans-serif; font-weight: 500; }
.ra-input::placeholder { color: #B0BDD0; }
.rev-hint { font-size: 13px; color: #0066FF; margin-top: 8px; font-family: 'DM Mono', monospace; font-weight: 600; }

/* ── Industry grid ── */
.industry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.ind-btn {
  background: #F4F7FB;
  border: 1.5px solid #E4EAF4;
  border-radius: 16px;
  padding: 16px 6px 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}
.ind-btn:hover { background: #EEF2FA; border-color: #CDD5E8; }
.ind-btn.sel { background: #EEF4FF; border-color: #0066FF; }
.ind-icon { font-size: 22px; display: block; margin-bottom: 7px; }
.ind-label {
  font-size: 9px; font-weight: 700; color: #A0ADC0; display: block;
  line-height: 1.2; text-transform: uppercase; letter-spacing: 0.04em;
}
.ind-btn.sel .ind-label { color: #0066FF; }

/* ── Question ── */
.q-step-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: #0D0D0D; color: #FFF; border-radius: 20px;
  padding: 6px 14px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px;
}
.q-category-dot { width: 6px; height: 6px; border-radius: 50%; background: #0066FF; flex-shrink: 0; }
.q-text {
  font-size: 22px; font-weight: 800; color: #0D0D0D;
  line-height: 1.25; letter-spacing: -0.03em; margin-bottom: 28px;
}
.choices { display: flex; flex-direction: column; gap: 10px; }
.choice {
  background: #F4F7FB;
  border: 1.5px solid #E4EAF4;
  border-radius: 16px;
  padding: 18px 18px;
  cursor: pointer;
  transition: all 0.18s;
  text-align: left;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 14px;
}
.choice:hover { background: #EEF2FA; border-color: #CDD5E8; }
.choice.sel { background: #EEF4FF; border-color: #0066FF; }
.choice-dot {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid #D0D9E8; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s; background: #FFF;
}
.choice.sel .choice-dot {
  background: #0066FF; border-color: #0066FF;
  box-shadow: 0 0 0 3px rgba(0,102,255,0.15);
}
.choice-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: white; opacity: 0; transition: opacity 0.18s; }
.choice.sel .choice-dot-inner { opacity: 1; }
.choice-text { flex: 1; }
.choice-label { font-size: 15px; font-weight: 700; color: #4A5568; display: block; margin-bottom: 3px; letter-spacing: -0.01em; }
.choice.sel .choice-label { color: #0D0D0D; }
.choice-desc { font-size: 13px; color: #A0ADC0; line-height: 1.4; font-weight: 400; }
.choice.sel .choice-desc { color: #5068A0; }

/* ── Buttons ── */
.btn-primary {
  width: 100%;
  padding: 18px;
  background: #0D0D0D;
  border: none;
  border-radius: 16px;
  color: #FFF;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: opacity 0.15s, transform 0.1s;
}
.btn-primary:hover { opacity: 0.85; }
.btn-primary:active { transform: scale(0.99); }
.btn-primary:disabled { background: #E4EAF4; color: #A0ADC0; cursor: not-allowed; }
.btn-orange {
  background: #0066FF;
  color: #FFF;
}
.btn-orange:hover { opacity: 0.88; }
.btn-ghost {
  padding: 16px 20px;
  background: #FFF;
  border: 1.5px solid #E4EAF4;
  border-radius: 16px;
  color: #8A9AB5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.btn-ghost:hover { border-color: #CDD5E8; color: #4A5568; }
.btn-row { display: flex; gap: 10px; margin-top: 16px; }

/* ── Intro card ── */
.intro-card {
  background: #0D0D0D;
  border-radius: 24px;
  padding: 32px 28px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.intro-card::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 65%);
  pointer-events: none;
}
.intro-eyebrow {
  font-size: 11px; color: #0066FF; text-transform: uppercase;
  letter-spacing: 0.14em; font-weight: 700; margin-bottom: 12px;
}
.intro-headline {
  font-size: 28px; font-weight: 900; color: #FFF;
  line-height: 1.15; letter-spacing: -0.04em; margin-bottom: 14px;
}
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
.gap-category-pill {
  font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.gap-amount { font-size: 26px; font-weight: 900; font-family: 'DM Mono', monospace; text-align: right; letter-spacing: -0.04em; }
.gap-amount-label {
  font-size: 10px; color: #A0ADC0; text-align: right; margin-top: 2px;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
}
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
.opp-banner {
  background: #0D0D0D;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}
.opp-banner::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,102,255,0.6), transparent);
}
.opp-label { font-size: 11px; color: #0066FF; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700; margin-bottom: 8px; }
.opp-text { font-size: 15px; color: #CCC; line-height: 1.6; font-weight: 400; }

/* ── CTA card ── */
.cta-card {
  background: #FFF;
  border-radius: 24px;
  padding: 36px 28px;
  text-align: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
}
.cta-price {
  font-size: 52px; font-weight: 900; font-family: 'DM Mono', monospace;
  color: #0D0D0D; letter-spacing: -0.05em; line-height: 1;
}
.cta-price-sub { font-size: 13px; color: #A0ADC0; margin-top: 6px; font-weight: 400; }
.cta-features { display: flex; flex-direction: column; gap: 12px; margin: 28px 0 32px; text-align: left; }
.cta-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #4A5568; font-weight: 400; }
.cta-check {
  width: 22px; height: 22px; border-radius: 50%; background: #EDFBF2;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 11px; font-weight: 700; color: #22A05A;
}
.cta-contact { font-size: 12px; color: #C0CAD8; margin-top: 14px; font-weight: 400; }

/* ── Section label ── */
.section-label {
  font-size: 11px; font-weight: 700; color: #A0ADC0;
  text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 14px; padding-left: 2px;
}

/* ── Divider ── */
.divider { height: 1px; background: rgba(0,0,0,0.06); margin: 36px 0; }

/* ── Setup ── */
.setup-field { margin-bottom: 26px; }

/* ── Desktop layout ── */
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
  .choice-label { font-size: 16px; }
  .choice-desc { font-size: 14px; }
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .hero-number { font-size: 56px; }
  .q-text { font-size: 20px; }
  .wrap { padding-bottom: 60px; }
  .industry-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .ind-btn { padding: 12px 4px 10px; }
  .ind-icon { font-size: 18px; margin-bottom: 5px; }
  .stat-val { font-size: 18px; }
}

@media print {
  body { background: white !important; }
  .no-print { display: none !important; }
}
`;

const INDUSTRIES = [
  { key: "electrical", label: "Electrical", icon: "⚡" },
  { key: "hvac", label: "HVAC", icon: "❄️" },
  { key: "plumbing", label: "Plumbing", icon: "🔧" },
  { key: "agency", label: "Ad Agency", icon: "📣" },
  { key: "retail", label: "Retail", icon: "🛒" },
  { key: "healthcare", label: "Healthcare", icon: "🏥" },
  { key: "remodel", label: "Custom Home", icon: "🏠" },
];

const QUESTIONS = [
  {
    id: "lead_response", question: "When a new lead contacts you, how quickly do you typically respond?", category: "Demand",
    choices: [
      { label: "Within minutes", desc: "Always answered — someone picks up or responds fast", weight: 0.01 },
      { label: "Same day", desc: "Usually get back within a few hours", weight: 0.03 },
      { label: "Next day or longer", desc: "Sometimes fall through the cracks", weight: 0.06 },
      { label: "No real system", desc: "Honestly, some leads never get followed up", weight: 0.10 },
    ],
  },
  {
    id: "quote_win_rate", question: "When you send a quote or proposal, how often do you win the work?", category: "Sales",
    choices: [
      { label: "More than 7 in 10", desc: "Strong close rate — prospects convert well", weight: 0.01 },
      { label: "About half", desc: "Win roughly 50% of quotes sent out", weight: 0.04 },
      { label: "Less than half", desc: "Win maybe 3–4 out of every 10", weight: 0.07 },
      { label: "Don't really track it", desc: "No visibility into win/loss rates", weight: 0.09 },
    ],
  },
  {
    id: "billing_process", question: "How would you describe your billing and collections process?", category: "Billing",
    choices: [
      { label: "Tight — invoiced fast", desc: "Invoice same or next day, collect reliably", weight: 0.01 },
      { label: "Some delays", desc: "Invoice within a week, occasional slow payments", weight: 0.04 },
      { label: "Inconsistent", desc: "Billing lags, discounts given without much approval", weight: 0.07 },
      { label: "A real problem", desc: "Write-offs, delayed invoices, unclear what's owed", weight: 0.11 },
    ],
  },
  {
    id: "team_efficiency", question: "How efficiently is your team utilized day-to-day?", category: "Labor",
    choices: [
      { label: "Very efficient", desc: "Tight schedule, little idle time or rework", weight: 0.02 },
      { label: "Pretty good", desc: "Minor inefficiencies but generally on track", weight: 0.05 },
      { label: "Some visible waste", desc: "Noticeable idle time, rework, or scheduling gaps", weight: 0.09 },
      { label: "Significant waste", desc: "Overruns, rework, and scheduling issues are common", weight: 0.14 },
    ],
  },
  {
    id: "customer_retention", question: "How well do you retain customers and generate referrals?", category: "Retention",
    choices: [
      { label: "Strong — they come back", desc: "High repeat rate, referrals are a major source", weight: 0.01 },
      { label: "Decent — some repeat", desc: "Good relationships but referral system is informal", weight: 0.04 },
      { label: "Mostly one-and-done", desc: "Most customers don't return or refer others", weight: 0.08 },
      { label: "No strategy for it", desc: "Never really focused on retention or referrals", weight: 0.12 },
    ],
  },
  {
    id: "recurring_revenue", question: "Do you have recurring revenue or service agreements in place?", category: "Retention",
    choices: [
      { label: "Yes — strong program", desc: "Meaningful recurring revenue already built", weight: 0.00 },
      { label: "Some — but informal", desc: "A few regulars but no structured program", weight: 0.03 },
      { label: "Barely any", desc: "Almost entirely project-by-project revenue", weight: 0.06 },
      { label: "None at all", desc: "100% dependent on new work each month", weight: 0.09 },
    ],
  },
  {
    id: "pipeline_visibility", question: "How clearly can you see your pipeline and forecast revenue?", category: "Forecasting",
    choices: [
      { label: "Very clear", desc: "Know what's coming 60–90 days out", weight: 0.01 },
      { label: "Roughly", desc: "Have a sense of it — some gaps in visibility", weight: 0.03 },
      { label: "Murky", desc: "Hard to predict what next month will bring", weight: 0.06 },
      { label: "Flying blind", desc: "No real visibility into the pipeline at all", weight: 0.09 },
    ],
  },
];

const CATEGORY_FIXES = {
  Demand: ["Set up a missed-call text-back system (Hatch, Podium, or Keap)", "Enforce a 5-minute lead response SLA for all incoming inquiries", "Build a 5-touch follow-up sequence for every unconverted lead"],
  Sales: ["Review pricing quarterly vs. local market rates — most SMBs are undercharging", "Track your win rate weekly — what gets measured consistently improves", "Call every prospect the day after sending a proposal"],
  Billing: ["Invoice the same day work is complete using mobile invoicing tools", "Require manager sign-off on any discount greater than 5%", "Automate payment reminders at 7, 14, and 30 days past due"],
  Labor: ["Use scheduling software to maximize utilization and cut idle time", "Track hours per job against estimate and flag overruns in real time", "Run a weekly rework review to eliminate recurring mistakes"],
  Retention: ["Launch a structured referral program with a small customer incentive ($25–$100)", "Automate a post-job text: thank + review request within 24 hours", "Create a maintenance or service agreement for your top 20% of customers"],
  Forecasting: ["Hold a 30-minute weekly pipeline review — closing, stalled, and at-risk", "Use a simple CRM or even a shared spreadsheet to track all active deals", "Set monthly revenue targets and review actuals vs. forecast every 30 days"],
};

function calcLeakage(revenue, answers) {
  let gaps = [];
  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    const choice = q.choices.find(c => c.label === ans.label);
    if (!choice) return;
    const leakage = revenue * choice.weight;
    if (choice.weight > 0.02) gaps.push({ category: q.category, question: q.question, answer: ans.label, leakage, weight: choice.weight });
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

  const currentQ = QUESTIONS[qIndex];
  const selectedChoice = answers[currentQ?.id];
  const revenueNum = parseFloat(revenue.replace(/[^0-9.]/g, "")) || 0;
  const setupValid = companyName.trim() && revenueNum > 0 && industry;
  const industryObj = INDUSTRIES.find(i => i.key === industry);

  const reset = () => { setStep(0); setQIndex(0); setAnswers({}); setResults(null); setInsights(null); };

  const generateReport = useCallback(async () => {
    setStep(2);
    const calc = calcLeakage(revenueNum, answers);
    const answerList = Object.entries(answers).map(([id, choice]) => {
      const q = QUESTIONS.find(q => q.id === id);
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

  const progressPct = step === 0 ? 0 : step === 1 ? ((qIndex + 1) / QUESTIONS.length) * 85 : step === 2 ? 93 : 100;

  return (
    <div className="root">
      <style>{CSS}</style>
      <div className="wrap">

        {/* ── Header ── */}
        <div className="header">
          <div className="kc-label">Kuharski Capital</div>
          <div
            className="app-title"
            style={{ cursor: step > 0 ? "pointer" : "default" }}
            onClick={step > 0 ? reset : undefined}
          >
            RevAudit™
          </div>
          <div className="app-sub">Revenue Leakage Intelligence</div>
        </div>

        {/* ── Progress bar ── */}
        {step > 0 && step < 3 && (
          <div className="progress-wrap no-print">
            <div className="progress-label">
              <span>{step === 1 ? `Question ${qIndex + 1} of ${QUESTIONS.length}` : "Generating report…"}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: progressPct + "%" }} />
            </div>
          </div>
        )}

        {/* ══ STEP 0 — SETUP ══ */}
        {step === 0 && (
          <div>
            <div className="intro-card">
              <div className="intro-eyebrow">Revenue Diagnostic</div>
              <div className="intro-headline">Find where revenue is leaking.</div>
              <div className="intro-body">7 questions. Under 3 minutes. Get a dollar-quantified gap report backed by live market intelligence.</div>
            </div>

            <div className="card">
              <div className="setup-field">
                <label className="field-label">Company Name</label>
                <input
                  className="ra-input text-input"
                  placeholder="e.g. Precision Electric Co."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>
              <div className="setup-field">
                <label className="field-label">Annual Revenue</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    className="ra-input has-prefix"
                    placeholder="1,200,000"
                    value={revenue}
                    onChange={e => setRevenue(e.target.value)}
                    onBlur={e => {
                      const n = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
                      if (n) setRevenue(n.toLocaleString());
                    }}
                  />
                </div>
                {revenueNum > 0 && <div className="rev-hint">{fmt(revenueNum)} annual revenue</div>}
              </div>
              <div>
                <label className="field-label">Industry</label>
                <div className="industry-grid">
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind.key}
                      className={"ind-btn" + (industry === ind.key ? " sel" : "")}
                      onClick={() => setIndustry(ind.key)}
                    >
                      <span className="ind-icon">{ind.icon}</span>
                      <span className="ind-label">{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="btn-primary btn-orange" disabled={!setupValid} onClick={() => setStep(1)}>
                Start Diagnostic →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 1 — QUESTIONS ══ */}
        {step === 1 && (
          <div>
            <div className="card">
              <div className="q-step-badge">
                <span className="q-category-dot" />
                {currentQ.category}
              </div>
              <div className="q-text">{currentQ.question}</div>
              <div className="choices">
                {currentQ.choices.map(choice => (
                  <button
                    key={choice.label}
                    className={"choice" + (selectedChoice?.label === choice.label ? " sel" : "")}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: choice }))}
                  >
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
              <button
                className="btn-primary btn-orange"
                style={{ flex: 1 }}
                disabled={!selectedChoice}
                onClick={() => qIndex < QUESTIONS.length - 1 ? setQIndex(i => i + 1) : generateReport()}
              >
                {qIndex < QUESTIONS.length - 1 ? "Next →" : "Generate Report →"}
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2 — LOADING ══ */}
        {step === 2 && (
          <div className="loading-screen">
            <div className="loading-icon">⚡</div>
            <div className="loading-title">Building your report…</div>
            <div className="loading-sub">Searching for live {industryObj?.label} market data.</div>
            <div className="loading-steps">
              <div className="loading-step done"><div className="step-dot" />Diagnostic complete</div>
              <div className="loading-step done"><div className="step-dot" />Leakage estimates calculated</div>
              <div className="loading-step"><div className="step-dot" />Fetching market intelligence…</div>
            </div>
          </div>
        )}

        {/* ══ STEP 3 — RESULTS ══ */}
        {step === 3 && results && (
          <div>

            {/* Hero */}
            <div className="card-hero">
              <div className="hero-company">
                <span style={{ fontSize: 18 }}>{industryObj?.icon}</span>
                <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>{companyName}</span>
              </div>
              <div className="hero-eyebrow">Estimated Annual Leakage</div>
              <div className="hero-number">{fmt(results.totalLeakage)}</div>
              <div className="hero-sub">
                ≈ {Math.round((results.totalLeakage / revenueNum) * 100)}% of revenue &nbsp;·&nbsp; {fmt(results.totalLeakage / 12)}/mo
              </div>
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

            {/* Gap cards */}
            <div className="section-label" style={{ marginTop: 28 }}>Revenue Gaps Identified</div>
            {results.topGaps.map((gap, i) => {
              const sev = sevColor(gap.weight);
              const fixes = CATEGORY_FIXES[gap.category] || [];
              return (
                <div key={i} className="card card-sm">
                  <div className="gap-header">
                    <div style={{ flex: 1 }}>
                      <span className="gap-category-pill" style={{ background: sev.bg, color: sev.color, border: "1px solid " + sev.border }}>
                        {gap.category} · {sev.label}
                      </span>
                      <div className="gap-answer" style={{ marginTop: 8 }}>
                        You said: <strong>"{gap.answer}"</strong>
                      </div>
                    </div>
                    <div style={{ marginLeft: 14 }}>
                      <div className="gap-amount" style={{ color: sev.color }}>{fmt(gap.leakage)}</div>
                      <div className="gap-amount-label">per year</div>
                    </div>
                  </div>
                  {fixes.slice(0, 2).map((fix, j) => (
                    <div key={j} className="fix-row">
                      <span className="fix-check">✓</span>
                      <span className="fix-text">{fix}</span>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Market Intelligence */}
            {insights && (
              <div>
                <div className="divider" />
                <div className="section-label">What the {industryObj?.label} Market Is Saying</div>
                {insights.industryContext && (
                  <div className="card card-sm">
                    <div style={{ fontSize: 14, color: "#4A5568", lineHeight: 1.75, fontWeight: 400 }}>{insights.industryContext}</div>
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

            {/* CTA */}
            <div className="divider" />
            <div className="cta-card">
              <div style={{ fontSize: 11, color: "#0066FF", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 10 }}>Next Step</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#0D0D0D", letterSpacing: "-0.04em", marginBottom: 8 }}>Full Revenue Diagnostic</div>
              <div style={{ fontSize: 14, color: "#8A9AB5", lineHeight: 1.7, marginBottom: 24 }}>
                This scan found <strong style={{ color: "#0D0D0D" }}>{fmt(results.totalLeakage)}</strong> in estimated leakage. A full audit goes deeper across every revenue category and delivers a 90-day action roadmap with dollar precision.
              </div>
              <div className="cta-features">
                {[
                  "Full diagnostic across all revenue categories",
                  "Dollar impact quantified for each gap",
                  "Prioritized 90-day action roadmap",
                  "Benchmark vs. industry top performers",
                ].map(f => (
                  <div key={f} className="cta-feature">
                    <div className="cta-check">✓</div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="cta-price">$1,500</div>
              <div className="cta-price-sub">Flat fee · Delivered in 5 business days</div>
              <a
                href={`mailto:forrest@kuharskicapital.com?subject=Full Revenue Audit — ${companyName}`}
                style={{
                  display: "block", marginTop: 24, padding: "18px",
                  background: "#0066FF", borderRadius: 16,
                  color: "#FFF", fontSize: 15, fontWeight: 800,
                  textDecoration: "none", letterSpacing: "-0.01em",
                  boxShadow: "0 8px 28px rgba(0,102,255,0.28)",
                }}
              >
                Get the Full Audit →
              </a>
              <div className="cta-contact">forrest@kuharskicapital.com · kuharskicapital.com</div>
            </div>

            <div className="btn-row no-print" style={{ marginTop: 8 }}>
              <button className="btn-ghost" onClick={reset}>← New Report</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => window.print()}>🖨 Save PDF</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
