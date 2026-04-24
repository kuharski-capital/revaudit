import { useState, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  font-family: 'DM Sans', -apple-system, sans-serif;
  background: #080B14;
  color: #F0F0F0;
  -webkit-font-smoothing: antialiased;
}
.root {
  min-height: 100dvh;
  background: linear-gradient(160deg, #0C0E1A 0%, #080B14 50%, #0A0A0F 100%);
  display: flex;
  justify-content: center;
}
.wrap {
  width: 100%;
  max-width: 480px;
  padding: 0 20px 100px;
  position: relative;
}
/* Header */
.header { padding: 52px 0 40px; }
.kc-label { font-size: 10px; color: #2A2E45; text-transform: uppercase; letter-spacing: 0.16em; font-weight: 500; margin-bottom: 8px; }
.app-title { font-size: 26px; font-weight: 800; color: #F0F0F0; letter-spacing: -0.03em; }
.app-sub { font-size: 13px; color: #3A3F55; margin-top: 4px; }
/* Progress */
.progress-wrap { margin-bottom: 32px; }
.progress-track { height: 2px; background: #12162A; border-radius: 1px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #F97316, #FB923C); border-radius: 1px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
.progress-label { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; color: #3A3F55; }
/* Cards */
.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 10px;
  backdrop-filter: blur(8px);
}
.card-sm { border-radius: 18px; padding: 18px 20px; }
.card-accent {
  background: linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 100%);
  border-color: rgba(249,115,22,0.2);
}
/* Hero number */
.hero-number {
  font-size: 60px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  font-family: 'DM Mono', monospace;
  background: linear-gradient(135deg, #F97316 0%, #FBBF24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub { font-size: 13px; color: #5A607A; margin-top: 8px; }
/* Stat row */
.stat-row { display: flex; gap: 0; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
.stat-item { flex: 1; text-align: center; }
.stat-item + .stat-item { border-left: 1px solid rgba(255,255,255,0.05); }
.stat-val { font-size: 18px; font-weight: 700; font-family: 'DM Mono', monospace; }
.stat-label { font-size: 10px; color: #3A3F55; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
/* Inputs */
.field-label { font-size: 11px; font-weight: 500; color: #4A5070; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; display: block; }
.input-wrap { position: relative; }
.input-prefix { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #3A3F55; pointer-events: none; font-family: 'DM Mono', monospace; }
.ra-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 14px 16px;
  color: #F0F0F0;
  font-size: 16px;
  font-family: 'DM Mono', monospace;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.ra-input:focus { border-color: rgba(249,115,22,0.5); background: rgba(249,115,22,0.04); }
.ra-input.has-prefix { padding-left: 26px; }
.ra-input.text-input { font-family: 'DM Sans', sans-serif; }
.rev-hint { font-size: 12px; color: #F97316; margin-top: 6px; font-family: 'DM Mono', monospace; }
/* Industry grid */
.industry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px; }
.ind-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px 8px 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
}
.ind-btn:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
.ind-btn.sel { background: rgba(249,115,22,0.12); border-color: rgba(249,115,22,0.35); }
.ind-icon { font-size: 22px; display: block; margin-bottom: 6px; }
.ind-label { font-size: 10px; font-weight: 600; color: #A0A8C0; display: block; line-height: 1.2; }
.ind-btn.sel .ind-label { color: #F97316; }
/* Question */
.q-category { font-size: 10px; font-weight: 600; color: #F97316; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.q-category::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #F97316; }
.q-text { font-size: 20px; font-weight: 700; color: #F0F0F0; line-height: 1.3; letter-spacing: -0.02em; margin-bottom: 28px; }
.choices { display: flex; flex-direction: column; gap: 8px; }
.choice {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.18s;
  text-align: left;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 14px;
}
.choice:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
.choice.sel { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.4); }
.choice-dot {
  width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.15); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s;
}
.choice.sel .choice-dot { background: #F97316; border-color: #F97316; }
.choice-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: white; opacity: 0; transition: opacity 0.18s; }
.choice.sel .choice-dot-inner { opacity: 1; }
.choice-text { flex: 1; }
.choice-label { font-size: 14px; font-weight: 600; color: #D0D5E8; display: block; margin-bottom: 2px; }
.choice.sel .choice-label { color: #F0F0F0; }
.choice-desc { font-size: 12px; color: #4A5070; line-height: 1.4; }
.choice.sel .choice-desc { color: #8A95B0; }
/* Buttons */
.btn-primary {
  width: 100%;
  padding: 17px;
  background: linear-gradient(135deg, #F97316 0%, #EA6A00 100%);
  border: none;
  border-radius: 16px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: -0.01em;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 8px 24px rgba(249,115,22,0.25);
}
.btn-primary:hover { opacity: 0.92; }
.btn-primary:active { transform: scale(0.99); }
.btn-primary:disabled { background: #1A1E30; color: #3A3F55; cursor: not-allowed; box-shadow: none; }
.btn-ghost {
  padding: 13px 20px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  color: #4A5070;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.14); color: #8A95B0; }
.btn-row { display: flex; gap: 10px; margin-top: 16px; }
/* Loading */
.loading-screen { text-align: center; padding: 80px 0; }
.loading-icon { font-size: 36px; margin-bottom: 20px; animation: pulse 1.8s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
.loading-title { font-size: 20px; font-weight: 700; color: #F0F0F0; margin-bottom: 8px; letter-spacing: -0.02em; }
.loading-sub { font-size: 13px; color: #3A3F55; margin-bottom: 32px; }
.loading-steps { display: flex; flex-direction: column; gap: 10px; max-width: 260px; margin: 0 auto; }
.loading-step { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #3A3F55; }
.loading-step.done { color: #22C55E; }
.step-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
/* Gap cards */
.gap-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.gap-category-pill {
  font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.gap-amount { font-size: 22px; font-weight: 800; font-family: 'DM Mono', monospace; text-align: right; }
.gap-amount-label { font-size: 10px; color: #3A3F55; text-align: right; margin-top: 1px; }
.gap-answer { font-size: 12px; color: #4A5070; margin-bottom: 12px; }
.gap-answer strong { color: #8A95B0; font-weight: 500; }
.fix-row { display: flex; gap: 8px; margin-bottom: 6px; }
.fix-check { color: #22C55E; font-size: 11px; flex-shrink: 0; margin-top: 1px; }
.fix-text { font-size: 12px; color: #5A6080; line-height: 1.5; }
/* Insight cards */
.insight-stat { font-size: 15px; font-weight: 700; color: #F0F0F0; line-height: 1.4; margin-bottom: 5px; }
.insight-source { font-size: 10px; color: #F97316; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
.insight-context { font-size: 12px; color: #4A5070; line-height: 1.6; }
/* Opportunity banner */
.opp-banner {
  background: linear-gradient(135deg, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0.06) 100%);
  border: 1px solid rgba(249,115,22,0.25);
  border-radius: 18px;
  padding: 20px 22px;
  margin-bottom: 10px;
}
.opp-label { font-size: 10px; color: #F97316; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; margin-bottom: 6px; }
.opp-text { font-size: 14px; color: #D0D5E8; line-height: 1.6; }
/* CTA card */
.cta-card {
  background: linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0.03) 100%);
  border: 1px solid rgba(249,115,22,0.18);
  border-radius: 24px;
  padding: 32px 28px;
  text-align: center;
  margin-bottom: 10px;
}
.cta-price { font-size: 36px; font-weight: 800; font-family: 'DM Mono', monospace; color: #F0F0F0; letter-spacing: -0.03em; }
.cta-price-sub { font-size: 13px; color: #4A5070; margin-top: 4px; }
.cta-features { display: flex; flex-direction: column; gap: 8px; margin: 20px 0 24px; text-align: left; }
.cta-feature { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #5A6080; }
.cta-feature::before { content: '✓'; color: #22C55E; font-weight: 700; flex-shrink: 0; }
.cta-contact { font-size: 11px; color: #2A2E45; margin-top: 12px; }
/* Section title */
.section-label { font-size: 11px; font-weight: 600; color: #3A3F55; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; padding-left: 2px; }
/* Divider */
.divider { height: 1px; background: rgba(255,255,255,0.04); margin: 32px 0; }
/* Setup layout */
.setup-field { margin-bottom: 22px; }
/* Responsive */
@media (max-width: 480px) {
  .hero-number { font-size: 48px; }
  .industry-grid { grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .ind-btn { padding: 12px 4px 10px; border-radius: 12px; }
  .ind-icon { font-size: 18px; margin-bottom: 4px; }
  .wrap { padding: 0 16px 80px; }
}
@media print {
  body { background: white; color: black; }
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
  if (weight >= 0.09) return { color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", label: "Critical" };
  if (weight >= 0.06) return { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", label: "High" };
  if (weight >= 0.03) return { color: "#EAB308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)", label: "Moderate" };
  return { color: "#22C55E", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", label: "Low" };
}

function scoreColor(s) {
  if (s >= 70) return "#22C55E";
  if (s >= 50) return "#EAB308";
  return "#EF4444";
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

        {/* Header */}
        <div className="header">
          <div className="kc-label">Kuharski Capital</div>
          <div className="app-title" style={{ cursor: step > 0 ? "pointer" : "default" }} onClick={step > 0 ? () => { setStep(0); setQIndex(0); setAnswers({}); setResults(null); setInsights(null); } : undefined}>
            RevAudit™
          </div>
          <div className="app-sub">Revenue Leakage Intelligence</div>
        </div>

        {/* Progress */}
        {step > 0 && step < 3 && (
          <div className="progress-wrap no-print">
            <div className="progress-label">
              <span>{step === 1 ? `Question ${qIndex + 1} of ${QUESTIONS.length}` : "Generating report…"}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: progressPct + "%" }} /></div>
          </div>
        )}

        {/* SETUP */}
        {step === 0 && (
          <div>
            <div className="card" style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#F0F0F0", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 10 }}>Find where revenue is leaking.</div>
              <div style={{ fontSize: 13, color: "#3A3F55", lineHeight: 1.7 }}>7 questions. 3 minutes. Get a dollar-quantified revenue gap report — with live market data on what to do about it.</div>
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
                    <button key={ind.key} className={"ind-btn" + (industry === ind.key ? " sel" : "")} onClick={() => setIndustry(ind.key)}>
                      <span className="ind-icon">{ind.icon}</span>
                      <span className="ind-label">{ind.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button className="btn-primary" disabled={!setupValid} onClick={() => setStep(1)}>
                Start Diagnostic →
              </button>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {step === 1 && (
          <div>
            <div className="card">
              <div className="q-category">{currentQ.category}</div>
              <div className="q-text">{currentQ.question}</div>
              <div className="choices">
                {currentQ.choices.map(choice => (
                  <button key={choice.label} className={"choice" + (selectedChoice?.label === choice.label ? " sel" : "")} onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: choice }))}>
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
              <button className="btn-primary" style={{ flex: 1 }} disabled={!selectedChoice}
                onClick={() => qIndex < QUESTIONS.length - 1 ? setQIndex(i => i + 1) : generateReport()}>
                {qIndex < QUESTIONS.length - 1 ? "Next →" : "Generate Report →"}
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === 2 && (
          <div className="loading-screen">
            <div className="loading-icon">⚡</div>
            <div className="loading-title">Building your report…</div>
            <div className="loading-sub">Calculating leakage and searching for current {industryObj?.label} market trends.</div>
            <div className="loading-steps">
              <div className="loading-step done"><div className="step-dot" />Diagnostic complete</div>
              <div className="loading-step done"><div className="step-dot" />Leakage estimates calculated</div>
              <div className="loading-step"><div className="step-dot" />Fetching market intelligence…</div>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === 3 && results && (
          <div>
            {/* Hero card */}
            <div className="card card-accent" style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: "#4A5070", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                {companyName} · {industryObj?.icon} {industryObj?.label}
              </div>
              <div style={{ fontSize: 13, color: "#4A5070", marginBottom: 6 }}>Estimated Annual Revenue Leakage</div>
              <div className="hero-number">{fmt(results.totalLeakage)}</div>
              <div className="hero-sub">
                ≈ {Math.round((results.totalLeakage / revenueNum) * 100)}% of revenue &nbsp;·&nbsp; {fmt(results.totalLeakage / 12)}/month
              </div>
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-val" style={{ color: scoreColor(results.healthScore) }}>{results.healthScore}</div>
                  <div className="stat-label">Health Score</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val" style={{ color: "#F0F0F0" }}>{results.topGaps.length}</div>
                  <div className="stat-label">Gaps Found</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val" style={{ color: "#F0F0F0", fontFamily: "'DM Mono', monospace", fontSize: 16 }}>{fmt(revenueNum)}</div>
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
                <div key={i} className="card card-sm" style={{ marginBottom: 10 }}>
                  <div className="gap-header">
                    <div style={{ flex: 1 }}>
                      <span className="gap-category-pill" style={{ background: sev.bg, color: sev.color, border: "1px solid " + sev.border }}>{gap.category} · {sev.label}</span>
                      <div className="gap-answer" style={{ marginTop: 8 }}>You said: <strong>"{gap.answer}"</strong></div>
                    </div>
                    <div style={{ marginLeft: 12 }}>
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

            {/* Market Intelligence */}
            {insights && (
              <div>
                <div className="divider" />
                <div className="section-label">What the {industryObj?.label} Market Is Saying</div>
                {insights.industryContext && (
                  <div className="card card-sm" style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 13, color: "#8A95B0", lineHeight: 1.7 }}>{insights.industryContext}</div>
                  </div>
                )}
                {insights.marketInsights?.map((mi, i) => (
                  <div key={i} className="card card-sm" style={{ marginBottom: 10 }}>
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
              <div style={{ fontSize: 11, color: "#F97316", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 12 }}>Next Step</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#F0F0F0", letterSpacing: "-0.02em", marginBottom: 8 }}>Full Revenue Diagnostic</div>
              <div style={{ fontSize: 13, color: "#4A5070", lineHeight: 1.7, marginBottom: 20 }}>
                This scan identified <strong style={{ color: "#F0F0F0" }}>{fmt(results.totalLeakage)}</strong> in estimated annual leakage. A full audit goes deeper across every revenue category and delivers a 90-day action roadmap with dollar precision.
              </div>
              <div className="cta-features">
                {["Full diagnostic across all revenue categories", "Dollar impact quantified for each gap", "Prioritized 90-day action roadmap", "Benchmark comparison vs. industry top performers"].map(f => (
                  <div key={f} className="cta-feature">{f}</div>
                ))}
              </div>
              <div className="cta-price">$1,500</div>
              <div className="cta-price-sub">Flat fee · Delivered in 5 business days</div>
              <a href={`mailto:forrest@kuharskicapital.com?subject=Full Revenue Audit — ${companyName}`}
                style={{ display: "block", marginTop: 20, padding: "17px", background: "linear-gradient(135deg, #F97316, #EA6A00)", borderRadius: 16, color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", letterSpacing: "-0.01em", boxShadow: "0 8px 24px rgba(249,115,22,0.3)" }}>
                Get the Full Audit →
              </a>
              <div className="cta-contact">forrest@kuharskicapital.com · kuharskicapital.com</div>
            </div>

            <div className="btn-row no-print" style={{ marginTop: 8 }}>
              <button className="btn-ghost" onClick={() => { setStep(0); setQIndex(0); setAnswers({}); setResults(null); setInsights(null); }}>← New Report</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => window.print()}>🖨 Save PDF</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
