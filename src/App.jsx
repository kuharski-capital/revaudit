
import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────

const PRESETS = {
  electrical: {
    company: { name: "Precision Electric Co.", industry: "Electrical Contractor", annualRevenue: 2400000, grossMargin: 38, employees: 14, fieldTechs: 10, officeStaff: 4, avgJobSize: 2200, jobsPerMonth: 90, salesCycleDays: 3, primaryChannel: "Referrals / Phone", serviceArea: "Metro Area" },
    demand: { leadsPerMonth: 140, missedCallRate: 18, leadResponseMinutes: 47, bookingRate: 62, noFollowUpRate: 22, capacityDeclineRate: 8, avgJobValue: 2200 },
    sales: { estimatesPerMonth: 75, quoteCloseRate: 58, avgQuotedJobValue: 2800, underpricingRate: 22, avgUnderpricingPct: 12, missedChangeOrders: 18, avgMissedChangeOrderValue: 380, scopeCreepFreq: 28, scopeCreepImpact: 9 },
    materials: { monthlyMaterialSpend: 95000, wasteRate: 7, reBuyRate: 4, shrinkageRate: 2, overstockRate: 5, returnLossPerMonth: 1800, shortageJobsPerMonth: 9, avgShortageImpact: 220 },
    labor: { totalLaborHours: 1600, loadedLaborCostPerHour: 68, laborOverrunPct: 12, reworkRatePct: 8, avgReworkHours: 3.5, idleWaitHours: 85, travelInefficHours: 110, delayedJobs: 12, avgHoursLostPerDelay: 2.2 },
    execution: { jobsPerMonth: 90, returnVisitRate: 11, avgReturnVisitCost: 280, lateJobPct: 14, avgDelayedJobCost: 180, incompleteJobRate: 4, incompleteJobCost: 420, callbacksPerMonth: 8, avgCallbackCost: 310, undocumentedRate: 15, revenueLeakagePerUndocumented: 190, safetyComplianceCosts: 1200 },
    billing: { jobsCompletedPerMonth: 88, unbilledWorkPct: 6, avgInvoiceValue: 2100, invoiceLagDays: 18, underbillingPct: 4, unapprovedDiscountsPerMonth: 2800, unbilledChangeOrders: 7, avgUnbilledChangeOrderValue: 340, writeOffsPerMonth: 1400 },
    retention: { activeCustomers: 420, repeatRate: 44, churnRate: 22, maintenanceAttachRate: 18, eligibleForAgreements: 180, avgAgreementValue: 1200, postJobFollowUpRate: 38, reviewRequestRate: 42, upsellConversionRate: 12, missedUpsellRate: 28, avgUpsellValue: 680, avgCLTV: 8400, referralCaptureRate: 24, missingReferralRate: 46, avgReferralJobValue: 2100, referralConversionFactor: 0.35 },
    forecasting: { forecastAccuracy: 58, scheduleUtilization: 71, revenueVolatility: 3, rescheduledJobs: 14, avgRescheduleCost: 180, capacityPlanningAccuracy: 52, technicianUtilization: 68, coordinationScore: 5, jobsLostToSchedulingGaps: 6, avgLostScheduledJobValue: 2200, availableTechHours: 1600, revenuePerTechHour: 95 }
  },
  hvac: {
    company: { name: "Arctic Air HVAC", industry: "HVAC Company", annualRevenue: 3800000, grossMargin: 42, employees: 22, fieldTechs: 16, officeStaff: 6, avgJobSize: 3400, jobsPerMonth: 110, salesCycleDays: 5, primaryChannel: "Digital / Referrals", serviceArea: "Tri-County" },
    demand: { leadsPerMonth: 190, missedCallRate: 14, leadResponseMinutes: 38, bookingRate: 68, noFollowUpRate: 18, capacityDeclineRate: 12, avgJobValue: 3400 },
    sales: { estimatesPerMonth: 95, quoteCloseRate: 62, avgQuotedJobValue: 4200, underpricingRate: 18, avgUnderpricingPct: 10, missedChangeOrders: 22, avgMissedChangeOrderValue: 520, scopeCreepFreq: 24, scopeCreepImpact: 8 },
    materials: { monthlyMaterialSpend: 145000, wasteRate: 6, reBuyRate: 3, shrinkageRate: 1.5, overstockRate: 6, returnLossPerMonth: 2400, shortageJobsPerMonth: 7, avgShortageImpact: 310 },
    labor: { totalLaborHours: 2400, loadedLaborCostPerHour: 72, laborOverrunPct: 10, reworkRatePct: 6, avgReworkHours: 4.0, idleWaitHours: 110, travelInefficHours: 140, delayedJobs: 14, avgHoursLostPerDelay: 2.5 },
    execution: { jobsPerMonth: 110, returnVisitRate: 9, avgReturnVisitCost: 320, lateJobPct: 12, avgDelayedJobCost: 210, incompleteJobRate: 3, incompleteJobCost: 580, callbacksPerMonth: 10, avgCallbackCost: 380, undocumentedRate: 12, revenueLeakagePerUndocumented: 240, safetyComplianceCosts: 1800 },
    billing: { jobsCompletedPerMonth: 108, unbilledWorkPct: 5, avgInvoiceValue: 3200, invoiceLagDays: 22, underbillingPct: 3, unapprovedDiscountsPerMonth: 3400, unbilledChangeOrders: 9, avgUnbilledChangeOrderValue: 480, writeOffsPerMonth: 2100 },
    retention: { activeCustomers: 680, repeatRate: 52, churnRate: 18, maintenanceAttachRate: 28, eligibleForAgreements: 280, avgAgreementValue: 1800, postJobFollowUpRate: 44, reviewRequestRate: 48, upsellConversionRate: 15, missedUpsellRate: 24, avgUpsellValue: 920, avgCLTV: 12000, referralCaptureRate: 28, missingReferralRate: 42, avgReferralJobValue: 3200, referralConversionFactor: 0.4 },
    forecasting: { forecastAccuracy: 62, scheduleUtilization: 74, revenueVolatility: 3, rescheduledJobs: 18, avgRescheduleCost: 220, capacityPlanningAccuracy: 58, technicianUtilization: 72, coordinationScore: 6, jobsLostToSchedulingGaps: 8, avgLostScheduledJobValue: 3400, availableTechHours: 2400, revenuePerTechHour: 110 }
  },
  plumbing: {
    company: { name: "BlueFlow Plumbing", industry: "Plumbing Business", annualRevenue: 1800000, grossMargin: 36, employees: 11, fieldTechs: 8, officeStaff: 3, avgJobSize: 1650, jobsPerMonth: 95, salesCycleDays: 2, primaryChannel: "Google / Phone", serviceArea: "City + Suburbs" },
    demand: { leadsPerMonth: 160, missedCallRate: 22, leadResponseMinutes: 55, bookingRate: 58, noFollowUpRate: 26, capacityDeclineRate: 10, avgJobValue: 1650 },
    sales: { estimatesPerMonth: 65, quoteCloseRate: 54, avgQuotedJobValue: 2100, underpricingRate: 26, avgUnderpricingPct: 14, missedChangeOrders: 20, avgMissedChangeOrderValue: 290, scopeCreepFreq: 32, scopeCreepImpact: 11 },
    materials: { monthlyMaterialSpend: 72000, wasteRate: 9, reBuyRate: 5, shrinkageRate: 3, overstockRate: 6, returnLossPerMonth: 1400, shortageJobsPerMonth: 11, avgShortageImpact: 190 },
    labor: { totalLaborHours: 1280, loadedLaborCostPerHour: 62, laborOverrunPct: 14, reworkRatePct: 10, avgReworkHours: 3.0, idleWaitHours: 95, travelInefficHours: 120, delayedJobs: 15, avgHoursLostPerDelay: 2.0 },
    execution: { jobsPerMonth: 95, returnVisitRate: 13, avgReturnVisitCost: 240, lateJobPct: 16, avgDelayedJobCost: 150, incompleteJobRate: 5, incompleteJobCost: 360, callbacksPerMonth: 10, avgCallbackCost: 270, undocumentedRate: 18, revenueLeakagePerUndocumented: 160, safetyComplianceCosts: 900 },
    billing: { jobsCompletedPerMonth: 93, unbilledWorkPct: 7, avgInvoiceValue: 1580, invoiceLagDays: 24, underbillingPct: 5, unapprovedDiscountsPerMonth: 2200, unbilledChangeOrders: 8, avgUnbilledChangeOrderValue: 260, writeOffsPerMonth: 1200 },
    retention: { activeCustomers: 360, repeatRate: 38, churnRate: 28, maintenanceAttachRate: 12, eligibleForAgreements: 140, avgAgreementValue: 980, postJobFollowUpRate: 32, reviewRequestRate: 36, upsellConversionRate: 9, missedUpsellRate: 32, avgUpsellValue: 540, avgCLTV: 6200, referralCaptureRate: 20, missingReferralRate: 52, avgReferralJobValue: 1600, referralConversionFactor: 0.3 },
    forecasting: { forecastAccuracy: 52, scheduleUtilization: 68, revenueVolatility: 4, rescheduledJobs: 16, avgRescheduleCost: 150, capacityPlanningAccuracy: 48, technicianUtilization: 64, coordinationScore: 4, jobsLostToSchedulingGaps: 7, avgLostScheduledJobValue: 1650, availableTechHours: 1280, revenuePerTechHour: 82 }
  }
};

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────

function calcDemand(d) {
  const missed = d.leadsPerMonth * (d.missedCallRate / 100);
  const unworked = d.leadsPerMonth * (d.noFollowUpRate / 100);
  const declined = d.leadsPerMonth * (d.capacityDeclineRate / 100);
  const recoverable = missed + unworked + declined;
  const recoverableBookedJobs = recoverable * (d.bookingRate / 100);
  const leakage = recoverableBookedJobs * d.avgJobValue;
  const score = Math.max(0, 100 - (d.missedCallRate * 2 + d.noFollowUpRate * 1.5 + d.capacityDeclineRate));
  return { leakage, score, missed, unworked, declined, recoverableBookedJobs, drivers: ["Missed calls: " + fmt(missed * d.bookingRate / 100 * d.avgJobValue), "Unworked leads: " + fmt(unworked * d.bookingRate / 100 * d.avgJobValue), "Capacity declines: " + fmt(declined * d.bookingRate / 100 * d.avgJobValue)] };
}

function calcSales(s) {
  const closedJobs = s.estimatesPerMonth * (s.quoteCloseRate / 100);
  const underpricingLoss = closedJobs * s.avgQuotedJobValue * (s.underpricingRate / 100) * (s.avgUnderpricingPct / 100);
  const changeOrderLoss = s.missedChangeOrders * s.avgMissedChangeOrderValue;
  const scopeCreepLoss = closedJobs * s.avgQuotedJobValue * (s.scopeCreepFreq / 100) * (s.scopeCreepImpact / 100);
  const leakage = underpricingLoss + changeOrderLoss + scopeCreepLoss;
  const score = Math.max(0, 100 - (s.underpricingRate * 1.5 + (100 - s.quoteCloseRate) * 0.5 + s.scopeCreepFreq * 0.5));
  return { leakage, score, underpricingLoss, changeOrderLoss, scopeCreepLoss, drivers: ["Underpricing: " + fmt(underpricingLoss), "Missed change orders: " + fmt(changeOrderLoss), "Scope creep: " + fmt(scopeCreepLoss)] };
}

function calcMaterials(m) {
  const wasteLoss = m.monthlyMaterialSpend * (m.wasteRate / 100);
  const reBuyLoss = m.monthlyMaterialSpend * (m.reBuyRate / 100);
  const shrinkageLoss = m.monthlyMaterialSpend * (m.shrinkageRate / 100);
  const overstockLoss = m.monthlyMaterialSpend * (m.overstockRate / 100);
  const shortageImpact = m.shortageJobsPerMonth * m.avgShortageImpact;
  const leakage = wasteLoss + reBuyLoss + shrinkageLoss + overstockLoss + m.returnLossPerMonth + shortageImpact;
  const totalLoss = (m.wasteRate + m.reBuyRate + m.shrinkageRate + m.overstockRate);
  const score = Math.max(0, 100 - totalLoss * 5);
  return { leakage, score, wasteLoss, reBuyLoss, shrinkageLoss, overstockLoss, shortageImpact, drivers: ["Waste: " + fmt(wasteLoss), "Re-buys: " + fmt(reBuyLoss), "Shrinkage: " + fmt(shrinkageLoss)] };
}

function calcLabor(l) {
  const overrunLoss = l.totalLaborHours * (l.laborOverrunPct / 100) * l.loadedLaborCostPerHour;
  const reworkJobs = (l.totalLaborHours / 8) * (l.reworkRatePct / 100); // approx
  const reworkLoss = reworkJobs * l.avgReworkHours * l.loadedLaborCostPerHour;
  const idleLoss = l.idleWaitHours * l.loadedLaborCostPerHour;
  const travelLoss = l.travelInefficHours * l.loadedLaborCostPerHour;
  const delayLoss = l.delayedJobs * l.avgHoursLostPerDelay * l.loadedLaborCostPerHour;
  const leakage = overrunLoss + reworkLoss + idleLoss + travelLoss + delayLoss;
  const totalRecovHours = (l.idleWaitHours + l.travelInefficHours + l.delayedJobs * l.avgHoursLostPerDelay) * 0.6;
  const extraJobsFromRecovery = Math.round(totalRecovHours / 6);
  const score = Math.max(0, 100 - (l.laborOverrunPct * 2 + l.reworkRatePct * 2 + (l.idleWaitHours / l.totalLaborHours) * 100));
  return { leakage, score, overrunLoss, reworkLoss, idleLoss, travelLoss, delayLoss, totalRecovHours: Math.round(totalRecovHours), extraJobsFromRecovery, drivers: ["Labor overruns: " + fmt(overrunLoss), "Rework: " + fmt(reworkLoss), "Idle/travel time: " + fmt(idleLoss + travelLoss)] };
}

function calcExecution(e) {
  const returnVisitLoss = e.jobsPerMonth * (e.returnVisitRate / 100) * e.avgReturnVisitCost;
  const delayLoss = e.jobsPerMonth * (e.lateJobPct / 100) * e.avgDelayedJobCost;
  const incompleteLoss = e.jobsPerMonth * (e.incompleteJobRate / 100) * e.incompleteJobCost;
  const callbackLoss = e.callbacksPerMonth * e.avgCallbackCost;
  const docLoss = e.jobsPerMonth * (e.undocumentedRate / 100) * e.revenueLeakagePerUndocumented;
  const leakage = returnVisitLoss + delayLoss + incompleteLoss + callbackLoss + docLoss + e.safetyComplianceCosts;
  const score = Math.max(0, 100 - (e.returnVisitRate * 2 + e.lateJobPct + e.incompleteJobRate * 2 + e.undocumentedRate));
  return { leakage, score, returnVisitLoss, delayLoss, incompleteLoss, callbackLoss, docLoss, drivers: ["Return visits: " + fmt(returnVisitLoss), "Callbacks: " + fmt(callbackLoss), "Undocumented work: " + fmt(docLoss)] };
}

function calcBilling(b) {
  const uninvoicedLoss = b.jobsCompletedPerMonth * (b.unbilledWorkPct / 100) * b.avgInvoiceValue;
  const underbillingLoss = b.jobsCompletedPerMonth * b.avgInvoiceValue * (b.underbillingPct / 100);
  const unbilledCOLoss = b.unbilledChangeOrders * b.avgUnbilledChangeOrderValue;
  const leakage = uninvoicedLoss + underbillingLoss + b.unapprovedDiscountsPerMonth + unbilledCOLoss + b.writeOffsPerMonth;
  const arDrag = (b.invoiceLagDays / 30) * b.jobsCompletedPerMonth * b.avgInvoiceValue * 0.02;
  const score = Math.max(0, 100 - (b.unbilledWorkPct * 3 + b.underbillingPct * 2 + (b.invoiceLagDays / 30) * 10));
  return { leakage, score, uninvoicedLoss, underbillingLoss, unbilledCOLoss, arDrag, drivers: ["Uninvoiced work: " + fmt(uninvoicedLoss), "Underbilling: " + fmt(underbillingLoss), "Discounts & write-offs: " + fmt(b.unapprovedDiscountsPerMonth + b.writeOffsPerMonth)] };
}

function calcRetention(r) {
  const churnLoss = r.activeCustomers * (r.churnRate / 100) * r.avgCLTV / 12;
  const missingAttachRate = Math.max(0, (1 - r.maintenanceAttachRate / 100));
  const agreementLoss = r.eligibleForAgreements * missingAttachRate * r.avgAgreementValue / 12;
  const upsellLoss = r.activeCustomers * (r.missedUpsellRate / 100) * r.avgUpsellValue / 12;
  const referralLoss = r.activeCustomers * (r.missingReferralRate / 100) * r.avgReferralJobValue * r.referralConversionFactor / 12;
  const leakage = churnLoss + agreementLoss + upsellLoss + referralLoss;
  const score = Math.max(0, 100 - (r.churnRate * 2 + (100 - r.maintenanceAttachRate) * 0.5 + r.missedUpsellRate));
  return { leakage, score, churnLoss, agreementLoss, upsellLoss, referralLoss, drivers: ["Customer churn: " + fmt(churnLoss), "Missing agreements: " + fmt(agreementLoss), "Missed upsells: " + fmt(upsellLoss)] };
}

function calcForecasting(f) {
  const schedulingGapLoss = f.jobsLostToSchedulingGaps * f.avgLostScheduledJobValue;
  const unusedPct = Math.max(0, (100 - f.technicianUtilization) / 100);
  const underutilizationLoss = f.availableTechHours * unusedPct * f.revenuePerTechHour;
  const reschedulingLoss = f.rescheduledJobs * f.avgRescheduleCost;
  const leakage = schedulingGapLoss + underutilizationLoss + reschedulingLoss;
  const score = Math.max(0, (f.forecastAccuracy + f.technicianUtilization + f.scheduleUtilization) / 3);
  return { leakage, score, schedulingGapLoss, underutilizationLoss, reschedulingLoss, drivers: ["Scheduling gaps: " + fmt(schedulingGapLoss), "Underutilization: " + fmt(underutilizationLoss), "Rescheduling costs: " + fmt(reschedulingLoss)] };
}

function getSeverity(score) {
  if (score >= 85) return { label: "Healthy", color: "#22c55e", bg: "#052e16" };
  if (score >= 70) return { label: "Needs Attention", color: "#eab308", bg: "#1c1400" };
  if (score >= 50) return { label: "Significant Leakage", color: "#f97316", bg: "#1c0a00" };
  return { label: "Critical", color: "#ef4444", bg: "#1c0000" };
}

function getRecommendations(cat) {
  const recs = {
    demand: ["Implement 24/7 answering service or chatbot to capture missed calls", "Set a 15-min lead response SLA with auto-text on missed calls", "Build a CRM follow-up sequence for all unconverted leads", "Use dispatch software to optimize capacity and reduce declines"],
    sales: ["Conduct quarterly pricing reviews benchmarked to local market rates", "Train techs on real-time change order documentation and approval", "Use digital estimate tools with built-in scope documentation", "Review all T&M jobs for uncaptured scope creep monthly"],
    materials: ["Implement job-specific material kitting to reduce waste and re-buys", "Install locked storage and cycle count process to control shrinkage", "Review slow-moving inventory monthly and return/liquidate", "Require pre-job material verification to eliminate shortage delays"],
    labor: ["Use GPS dispatch and route optimization to cut travel inefficiency", "Track labor hours per job against estimate — flag overruns in real time", "Create rework log and root cause review to reduce repeat failures", "Schedule preventive maintenance windows to reduce unexpected idle time"],
    execution: ["Build digital return visit tracking and root cause analysis", "Implement photo documentation requirement for every completed job", "Create callback reduction program with tech accountability metrics", "Use job completion checklists to eliminate incomplete job issues"],
    billing: ["Invoice same day as job completion — use mobile invoicing in the field", "Audit all invoices monthly for underbilling and missing change orders", "Eliminate unauthorized discounts — require manager approval for any discount", "Set collections policy: 30-day follow-up, 60-day escalation"],
    retention: ["Launch service agreement program with field tech enrollment training", "Automate post-job follow-up texts and review requests", "Create upsell training for techs with 5% commission incentive", "Build a referral program with customer incentives and tracking"],
    forecasting: ["Implement scheduling software with real-time technician visibility", "Create weekly capacity planning meeting with dispatch and management", "Track forecast vs actual monthly and adjust planning inputs", "Set technician utilization targets with daily dispatch accountability"]
  };
  return recs[cat] || [];
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n === undefined || n === null) return "$0";
  return "$" + Math.round(n).toLocaleString();
}
function fmtPct(n) { return (Math.round(n * 10) / 10) + "%"; }
function fmtK(n) { return n >= 1000000 ? "$" + (n / 1000000).toFixed(2) + "M" : "$" + Math.round(n / 1000).toLocaleString() + "K"; }

// ─── INPUT COMPONENT ──────────────────────────────────────────────────────────

function InputField({ label, value, onChange, type = "number", min = 0, max, step = 1, prefix, suffix }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, overflow: "hidden" }}>
        {prefix && <span style={{ padding: "0 10px", color: "#64748b", fontSize: 13, background: "#0f172a", borderRight: "1px solid #1e293b" }}>{prefix}</span>}
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "8px 10px", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}
        />
        {suffix && <span style={{ padding: "0 10px", color: "#64748b", fontSize: 13, background: "#0f172a", borderLeft: "1px solid #1e293b" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, leakage, score }) {
  const sev = getSeverity(score);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1e293b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9" }}>{title}</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#f97316" }}>{fmt(leakage)}<span style={{ color: "#475569", fontWeight: 400 }}>/mo</span></span>
        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: sev.bg, color: sev.color, border: "1px solid " + sev.color + "40", fontWeight: 600 }}>{sev.label}</span>
      </div>
    </div>
  );
}

// ─── CATEGORY PANELS ──────────────────────────────────────────────────────────

function DemandPanel({ data, onChange }) {
  const res = calcDemand(data);
  return (
    <div>
      <SectionHeader icon="📡" title="Demand Conversion" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Leads Per Month" value={data.leadsPerMonth} onChange={v => onChange({ ...data, leadsPerMonth: v })} />
        <InputField label="Missed Call Rate" value={data.missedCallRate} onChange={v => onChange({ ...data, missedCallRate: v })} suffix="%" max={100} />
        <InputField label="Lead Response Time" value={data.leadResponseMinutes} onChange={v => onChange({ ...data, leadResponseMinutes: v })} suffix="min" />
        <InputField label="Booking Rate" value={data.bookingRate} onChange={v => onChange({ ...data, bookingRate: v })} suffix="%" max={100} />
        <InputField label="No Follow-Up Lead Rate" value={data.noFollowUpRate} onChange={v => onChange({ ...data, noFollowUpRate: v })} suffix="%" max={100} />
        <InputField label="Capacity Decline Rate" value={data.capacityDeclineRate} onChange={v => onChange({ ...data, capacityDeclineRate: v })} suffix="%" max={100} />
        <InputField label="Avg Job Value" value={data.avgJobValue} onChange={v => onChange({ ...data, avgJobValue: v })} prefix="$" />
      </div>
      <LeakageBreakdown items={[{ label: "Missed Calls", value: res.missed * (data.bookingRate / 100) * data.avgJobValue }, { label: "Unworked Leads", value: res.unworked * (data.bookingRate / 100) * data.avgJobValue }, { label: "Capacity Declines", value: res.declined * (data.bookingRate / 100) * data.avgJobValue }]} />
    </div>
  );
}

function SalesPanel({ data, onChange }) {
  const res = calcSales(data);
  return (
    <div>
      <SectionHeader icon="📋" title="Sales / Estimating" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Estimates Per Month" value={data.estimatesPerMonth} onChange={v => onChange({ ...data, estimatesPerMonth: v })} />
        <InputField label="Quote-to-Close Rate" value={data.quoteCloseRate} onChange={v => onChange({ ...data, quoteCloseRate: v })} suffix="%" max={100} />
        <InputField label="Avg Quoted Job Value" value={data.avgQuotedJobValue} onChange={v => onChange({ ...data, avgQuotedJobValue: v })} prefix="$" />
        <InputField label="Underpricing Rate" value={data.underpricingRate} onChange={v => onChange({ ...data, underpricingRate: v })} suffix="%" max={100} />
        <InputField label="Avg Underpricing %" value={data.avgUnderpricingPct} onChange={v => onChange({ ...data, avgUnderpricingPct: v })} suffix="%" max={100} />
        <InputField label="Missed Change Orders/mo" value={data.missedChangeOrders} onChange={v => onChange({ ...data, missedChangeOrders: v })} />
        <InputField label="Avg Missed CO Value" value={data.avgMissedChangeOrderValue} onChange={v => onChange({ ...data, avgMissedChangeOrderValue: v })} prefix="$" />
        <InputField label="Scope Creep Frequency" value={data.scopeCreepFreq} onChange={v => onChange({ ...data, scopeCreepFreq: v })} suffix="%" max={100} />
        <InputField label="Scope Creep Impact" value={data.scopeCreepImpact} onChange={v => onChange({ ...data, scopeCreepImpact: v })} suffix="%" max={100} />
      </div>
      <LeakageBreakdown items={[{ label: "Underpricing", value: res.underpricingLoss }, { label: "Missed Change Orders", value: res.changeOrderLoss }, { label: "Scope Creep", value: res.scopeCreepLoss }]} />
    </div>
  );
}

function MaterialsPanel({ data, onChange }) {
  const res = calcMaterials(data);
  return (
    <div>
      <SectionHeader icon="🏗️" title="Material Waste & Shrinkage" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Monthly Material Spend" value={data.monthlyMaterialSpend} onChange={v => onChange({ ...data, monthlyMaterialSpend: v })} prefix="$" />
        <InputField label="Material Waste Rate" value={data.wasteRate} onChange={v => onChange({ ...data, wasteRate: v })} suffix="%" max={100} />
        <InputField label="Re-Buy Rate" value={data.reBuyRate} onChange={v => onChange({ ...data, reBuyRate: v })} suffix="%" max={100} />
        <InputField label="Shrinkage / Theft Rate" value={data.shrinkageRate} onChange={v => onChange({ ...data, shrinkageRate: v })} suffix="%" max={100} />
        <InputField label="Overstock / Obsolete Rate" value={data.overstockRate} onChange={v => onChange({ ...data, overstockRate: v })} suffix="%" max={100} />
        <InputField label="Return / Restocking Losses" value={data.returnLossPerMonth} onChange={v => onChange({ ...data, returnLossPerMonth: v })} prefix="$" />
        <InputField label="Shortage Jobs/mo" value={data.shortageJobsPerMonth} onChange={v => onChange({ ...data, shortageJobsPerMonth: v })} />
        <InputField label="Avg Cost Per Shortage" value={data.avgShortageImpact} onChange={v => onChange({ ...data, avgShortageImpact: v })} prefix="$" />
      </div>
      <LeakageBreakdown items={[{ label: "Waste", value: res.wasteLoss }, { label: "Re-Buys", value: res.reBuyLoss }, { label: "Shrinkage", value: res.shrinkageLoss }, { label: "Overstock", value: res.overstockLoss }, { label: "Shortages", value: res.shortageImpact }]} />
    </div>
  );
}

function LaborPanel({ data, onChange }) {
  const res = calcLabor(data);
  return (
    <div>
      <SectionHeader icon="⚒️" title="Labor Efficiency" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Total Labor Hours/mo" value={data.totalLaborHours} onChange={v => onChange({ ...data, totalLaborHours: v })} />
        <InputField label="Loaded Labor Cost/Hour" value={data.loadedLaborCostPerHour} onChange={v => onChange({ ...data, loadedLaborCostPerHour: v })} prefix="$" />
        <InputField label="Labor Overrun %" value={data.laborOverrunPct} onChange={v => onChange({ ...data, laborOverrunPct: v })} suffix="%" max={100} />
        <InputField label="Rework Rate % of Jobs" value={data.reworkRatePct} onChange={v => onChange({ ...data, reworkRatePct: v })} suffix="%" max={100} />
        <InputField label="Avg Rework Hours" value={data.avgReworkHours} onChange={v => onChange({ ...data, avgReworkHours: v })} step={0.5} />
        <InputField label="Idle / Wait Hours/mo" value={data.idleWaitHours} onChange={v => onChange({ ...data, idleWaitHours: v })} />
        <InputField label="Travel Inefficiency Hours" value={data.travelInefficHours} onChange={v => onChange({ ...data, travelInefficHours: v })} />
        <InputField label="Jobs Delayed (material/tools)" value={data.delayedJobs} onChange={v => onChange({ ...data, delayedJobs: v })} />
        <InputField label="Avg Labor Hours Lost/Delay" value={data.avgHoursLostPerDelay} onChange={v => onChange({ ...data, avgHoursLostPerDelay: v })} step={0.5} />
      </div>
      <div style={{ margin: "16px 0", padding: 12, background: "#0d2136", border: "1px solid #0ea5e9", borderRadius: 8, display: "flex", gap: 24 }}>
        <div><div style={{ fontSize: 11, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recoverable Hours</div><div style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8" }}>{res.totalRecovHours} hrs</div></div>
        <div><div style={{ fontSize: 11, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em" }}>Extra Jobs Possible</div><div style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8" }}>+{res.extraJobsFromRecovery} jobs</div></div>
      </div>
      <LeakageBreakdown items={[{ label: "Labor Overruns", value: res.overrunLoss }, { label: "Rework", value: res.reworkLoss }, { label: "Idle Time", value: res.idleLoss }, { label: "Travel Inefficiency", value: res.travelLoss }, { label: "Delays", value: res.delayLoss }]} />
    </div>
  );
}

function ExecutionPanel({ data, onChange }) {
  const res = calcExecution(data);
  return (
    <div>
      <SectionHeader icon="🔧" title="Job Execution" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Jobs Per Month" value={data.jobsPerMonth} onChange={v => onChange({ ...data, jobsPerMonth: v })} />
        <InputField label="Return Visit Rate" value={data.returnVisitRate} onChange={v => onChange({ ...data, returnVisitRate: v })} suffix="%" max={100} />
        <InputField label="Avg Return Visit Cost" value={data.avgReturnVisitCost} onChange={v => onChange({ ...data, avgReturnVisitCost: v })} prefix="$" />
        <InputField label="Jobs Completed Late %" value={data.lateJobPct} onChange={v => onChange({ ...data, lateJobPct: v })} suffix="%" max={100} />
        <InputField label="Avg Delay Cost/Job" value={data.avgDelayedJobCost} onChange={v => onChange({ ...data, avgDelayedJobCost: v })} prefix="$" />
        <InputField label="Incomplete Job Rate" value={data.incompleteJobRate} onChange={v => onChange({ ...data, incompleteJobRate: v })} suffix="%" max={100} />
        <InputField label="Incomplete Job Cost" value={data.incompleteJobCost} onChange={v => onChange({ ...data, incompleteJobCost: v })} prefix="$" />
        <InputField label="Callbacks Per Month" value={data.callbacksPerMonth} onChange={v => onChange({ ...data, callbacksPerMonth: v })} />
        <InputField label="Avg Callback Cost" value={data.avgCallbackCost} onChange={v => onChange({ ...data, avgCallbackCost: v })} prefix="$" />
        <InputField label="Undocumented Work Rate" value={data.undocumentedRate} onChange={v => onChange({ ...data, undocumentedRate: v })} suffix="%" max={100} />
        <InputField label="Leakage/Undocumented Event" value={data.revenueLeakagePerUndocumented} onChange={v => onChange({ ...data, revenueLeakagePerUndocumented: v })} prefix="$" />
        <InputField label="Safety/Compliance Costs/mo" value={data.safetyComplianceCosts} onChange={v => onChange({ ...data, safetyComplianceCosts: v })} prefix="$" />
      </div>
      <LeakageBreakdown items={[{ label: "Return Visits", value: res.returnVisitLoss }, { label: "Delays", value: res.delayLoss }, { label: "Incomplete Jobs", value: res.incompleteLoss }, { label: "Callbacks", value: res.callbackLoss }, { label: "Undocumented Work", value: res.docLoss }]} />
    </div>
  );
}

function BillingPanel({ data, onChange }) {
  const res = calcBilling(data);
  return (
    <div>
      <SectionHeader icon="💰" title="Billing / Revenue Capture" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Jobs Completed/mo" value={data.jobsCompletedPerMonth} onChange={v => onChange({ ...data, jobsCompletedPerMonth: v })} />
        <InputField label="Work Completed, Not Invoiced" value={data.unbilledWorkPct} onChange={v => onChange({ ...data, unbilledWorkPct: v })} suffix="%" max={100} />
        <InputField label="Avg Invoice Value" value={data.avgInvoiceValue} onChange={v => onChange({ ...data, avgInvoiceValue: v })} prefix="$" />
        <InputField label="Avg Invoice Lag" value={data.invoiceLagDays} onChange={v => onChange({ ...data, invoiceLagDays: v })} suffix="days" />
        <InputField label="Underbilling Rate" value={data.underbillingPct} onChange={v => onChange({ ...data, underbillingPct: v })} suffix="%" max={100} />
        <InputField label="Unapproved Discounts/mo" value={data.unapprovedDiscountsPerMonth} onChange={v => onChange({ ...data, unapprovedDiscountsPerMonth: v })} prefix="$" />
        <InputField label="Unbilled Change Orders/mo" value={data.unbilledChangeOrders} onChange={v => onChange({ ...data, unbilledChangeOrders: v })} />
        <InputField label="Avg Unbilled CO Value" value={data.avgUnbilledChangeOrderValue} onChange={v => onChange({ ...data, avgUnbilledChangeOrderValue: v })} prefix="$" />
        <InputField label="Write-offs / Bad Debt/mo" value={data.writeOffsPerMonth} onChange={v => onChange({ ...data, writeOffsPerMonth: v })} prefix="$" />
      </div>
      <div style={{ marginTop: 12, padding: 10, background: "#0d1f0d", border: "1px solid #166534", borderRadius: 8, fontSize: 12, color: "#86efac" }}>
        💡 AR Drag Cost (opportunity cost of delayed invoicing): {fmt(res.arDrag)}/mo
      </div>
      <LeakageBreakdown items={[{ label: "Uninvoiced Work", value: res.uninvoicedLoss }, { label: "Underbilling", value: res.underbillingLoss }, { label: "Unbilled COs", value: res.unbilledCOLoss }]} />
    </div>
  );
}

function RetentionPanel({ data, onChange }) {
  const res = calcRetention(data);
  return (
    <div>
      <SectionHeader icon="🔄" title="Retention / Repeat Revenue" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Active Customers" value={data.activeCustomers} onChange={v => onChange({ ...data, activeCustomers: v })} />
        <InputField label="Customer Churn Rate" value={data.churnRate} onChange={v => onChange({ ...data, churnRate: v })} suffix="%" max={100} />
        <InputField label="Maintenance Attach Rate" value={data.maintenanceAttachRate} onChange={v => onChange({ ...data, maintenanceAttachRate: v })} suffix="%" max={100} />
        <InputField label="Eligible for Agreements" value={data.eligibleForAgreements} onChange={v => onChange({ ...data, eligibleForAgreements: v })} />
        <InputField label="Avg Agreement Value" value={data.avgAgreementValue} onChange={v => onChange({ ...data, avgAgreementValue: v })} prefix="$" />
        <InputField label="Missed Upsell Rate" value={data.missedUpsellRate} onChange={v => onChange({ ...data, missedUpsellRate: v })} suffix="%" max={100} />
        <InputField label="Avg Upsell Value" value={data.avgUpsellValue} onChange={v => onChange({ ...data, avgUpsellValue: v })} prefix="$" />
        <InputField label="Avg Customer LTV" value={data.avgCLTV} onChange={v => onChange({ ...data, avgCLTV: v })} prefix="$" />
        <InputField label="Missing Referral Capture %" value={data.missingReferralRate} onChange={v => onChange({ ...data, missingReferralRate: v })} suffix="%" max={100} />
        <InputField label="Avg Referred Job Value" value={data.avgReferralJobValue} onChange={v => onChange({ ...data, avgReferralJobValue: v })} prefix="$" />
        <InputField label="Referral Conversion Factor" value={data.referralConversionFactor} onChange={v => onChange({ ...data, referralConversionFactor: v })} step={0.05} />
      </div>
      <LeakageBreakdown items={[{ label: "Churn Loss", value: res.churnLoss }, { label: "Missing Agreements", value: res.agreementLoss }, { label: "Upsell Gaps", value: res.upsellLoss }, { label: "Lost Referrals", value: res.referralLoss }]} />
    </div>
  );
}

function ForecastingPanel({ data, onChange }) {
  const res = calcForecasting(data);
  return (
    <div>
      <SectionHeader icon="📊" title="Forecasting / Visibility" leakage={res.leakage} score={res.score} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <InputField label="Forecast Accuracy" value={data.forecastAccuracy} onChange={v => onChange({ ...data, forecastAccuracy: v })} suffix="%" max={100} />
        <InputField label="Schedule Utilization" value={data.scheduleUtilization} onChange={v => onChange({ ...data, scheduleUtilization: v })} suffix="%" max={100} />
        <InputField label="Rescheduled Jobs/mo" value={data.rescheduledJobs} onChange={v => onChange({ ...data, rescheduledJobs: v })} />
        <InputField label="Avg Reschedule Cost" value={data.avgRescheduleCost} onChange={v => onChange({ ...data, avgRescheduleCost: v })} prefix="$" />
        <InputField label="Technician Utilization" value={data.technicianUtilization} onChange={v => onChange({ ...data, technicianUtilization: v })} suffix="%" max={100} />
        <InputField label="Coordination Score (1-10)" value={data.coordinationScore} onChange={v => onChange({ ...data, coordinationScore: v })} min={1} max={10} />
        <InputField label="Jobs Lost to Sched. Gaps" value={data.jobsLostToSchedulingGaps} onChange={v => onChange({ ...data, jobsLostToSchedulingGaps: v })} />
        <InputField label="Avg Lost Job Value" value={data.avgLostScheduledJobValue} onChange={v => onChange({ ...data, avgLostScheduledJobValue: v })} prefix="$" />
        <InputField label="Available Tech Hours/mo" value={data.availableTechHours} onChange={v => onChange({ ...data, availableTechHours: v })} />
        <InputField label="Revenue Per Tech Hour" value={data.revenuePerTechHour} onChange={v => onChange({ ...data, revenuePerTechHour: v })} prefix="$" />
      </div>
      <LeakageBreakdown items={[{ label: "Scheduling Gaps", value: res.schedulingGapLoss }, { label: "Underutilization", value: res.underutilizationLoss }, { label: "Rescheduling", value: res.reschedulingLoss }]} />
    </div>
  );
}

function LeakageBreakdown({ items }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <div style={{ marginTop: 16, padding: 12, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Leakage Breakdown</div>
      {items.map(item => (
        <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.label}</span>
            <div style={{ flex: 1, height: 4, background: "#1e293b", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: total > 0 ? (item.value / total * 100) + "%" : "0%", height: "100%", background: "#f97316", borderRadius: 4, transition: "width 0.3s" }} />
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fb923c", marginLeft: 12, minWidth: 80, textAlign: "right" }}>{fmt(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── SCORECARD ────────────────────────────────────────────────────────────────

function ScoreGauge({ score }) {
  const sev = getSeverity(score);
  const rotation = (score / 100) * 180 - 90;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 120, height: 65, overflow: "hidden" }}>
        <svg viewBox="0 0 120 65" width="120" height="65">
          <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
          <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke={sev.color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(score / 100) * 157} 157`} />
          <g transform={`translate(60,60) rotate(${rotation})`}>
            <line x1="0" y1="0" x2="0" y2="-36" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4" fill="#e2e8f0" />
          </g>
        </svg>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: sev.color, marginTop: -8 }}>{Math.round(score)}</div>
      <div style={{ fontSize: 11, color: sev.color, fontWeight: 600 }}>{sev.label}</div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "demand", label: "Demand Conversion", weight: 0.15 },
  { key: "sales", label: "Sales / Estimating", weight: 0.10 },
  { key: "materials", label: "Materials", weight: 0.15 },
  { key: "labor", label: "Labor", weight: 0.20 },
  { key: "execution", label: "Job Execution", weight: 0.15 },
  { key: "billing", label: "Revenue Capture", weight: 0.15 },
  { key: "retention", label: "Retention", weight: 0.05 },
  { key: "forecasting", label: "Forecasting", weight: 0.05 },
];

const CATEGORY_COLORS = ["#f97316", "#fb923c", "#ef4444", "#eab308", "#22c55e", "#0ea5e9", "#a855f7", "#ec4899"];

const NAV_ITEMS = [
  { key: "company", label: "Company Profile", icon: "🏢" },
  { key: "demand", label: "Demand Conversion", icon: "📡" },
  { key: "sales", label: "Sales / Estimating", icon: "📋" },
  { key: "materials", label: "Material Waste", icon: "🏗️" },
  { key: "labor", label: "Labor Efficiency", icon: "⚒️" },
  { key: "execution", label: "Job Execution", icon: "🔧" },
  { key: "billing", label: "Billing / Revenue", icon: "💰" },
  { key: "retention", label: "Retention", icon: "🔄" },
  { key: "forecasting", label: "Forecasting", icon: "📊" },
  { key: "results", label: "RevAudit Report", icon: "🎯" },
];

export default function RevAudit() {
  const [activeSection, setActiveSection] = useState("company");
  const [preset, setPreset] = useState("electrical");
  const [company, setCompany] = useState(PRESETS.electrical.company);
  const [demand, setDemand] = useState(PRESETS.electrical.demand);
  const [sales, setSales] = useState(PRESETS.electrical.sales);
  const [materials, setMaterials] = useState(PRESETS.electrical.materials);
  const [labor, setLabor] = useState(PRESETS.electrical.labor);
  const [execution, setExecution] = useState(PRESETS.electrical.execution);
  const [billing, setBilling] = useState(PRESETS.electrical.billing);
  const [retention, setRetention] = useState(PRESETS.electrical.retention);
  const [forecasting, setForecasting] = useState(PRESETS.electrical.forecasting);

  const loadPreset = useCallback((key) => {
    const p = PRESETS[key];
    setPreset(key);
    setCompany(p.company);
    setDemand(p.demand);
    setSales(p.sales);
    setMaterials(p.materials);
    setLabor(p.labor);
    setExecution(p.execution);
    setBilling(p.billing);
    setRetention(p.retention);
    setForecasting(p.forecasting);
  }, []);

  const results = useMemo(() => {
    const d = calcDemand(demand);
    const s = calcSales(sales);
    const m = calcMaterials(materials);
    const l = calcLabor(labor);
    const e = calcExecution(execution);
    const b = calcBilling(billing);
    const r = calcRetention(retention);
    const f = calcForecasting(forecasting);
    const cats = [
      { ...d, key: "demand", label: "Demand Conversion", weight: 0.15, recs: getRecommendations("demand") },
      { ...s, key: "sales", label: "Sales / Estimating", weight: 0.10, recs: getRecommendations("sales") },
      { ...m, key: "materials", label: "Materials", weight: 0.15, recs: getRecommendations("materials") },
      { ...l, key: "labor", label: "Labor Efficiency", weight: 0.20, recs: getRecommendations("labor") },
      { ...e, key: "execution", label: "Job Execution", weight: 0.15, recs: getRecommendations("execution") },
      { ...b, key: "billing", label: "Revenue Capture", weight: 0.15, recs: getRecommendations("billing") },
      { ...r, key: "retention", label: "Retention", weight: 0.05, recs: getRecommendations("retention") },
      { ...f, key: "forecasting", label: "Forecasting", weight: 0.05, recs: getRecommendations("forecasting") },
    ];
    const totalMonthly = cats.reduce((s, c) => s + c.leakage, 0);
    const totalAnnual = totalMonthly * 12;
    const overallScore = cats.reduce((s, c) => s + c.score * c.weight, 0);
    const rrpPct = company.annualRevenue > 0 ? (totalAnnual / company.annualRevenue) * 100 : 0;
    const topLeaks = [...cats].sort((a, b) => b.leakage - a.leakage).slice(0, 3);
    return { cats, totalMonthly, totalAnnual, overallScore, rrpPct, topLeaks };
  }, [company, demand, sales, materials, labor, execution, billing, retention, forecasting]);

  const barData = results.cats.map((c, i) => ({ name: c.label.replace(" / ", "/").replace("Demand Conversion", "Demand").replace("Job Execution", "Execution").replace("Revenue Capture", "Billing").replace("Labor Efficiency", "Labor"), leakage: Math.round(c.leakage), color: CATEGORY_COLORS[i] }));
  const pieData = results.cats.filter(c => c.leakage > 0).map((c, i) => ({ name: c.label, value: Math.round(c.leakage), color: CATEGORY_COLORS[i] }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020817", fontFamily: "'IBM Plex Sans', 'DM Sans', system-ui, sans-serif", color: "#e2e8f0" }}>
      {/* SIDEBAR */}
      <div style={{ width: 240, background: "#0a0f1e", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Kuharski Capital</div>
          <div style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RevAudit™</div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Revenue Leakage Intelligence</div>
        </div>

        <div style={{ padding: "16px 12px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Quick Presets</div>
          {[["electrical", "⚡ Electrical"], ["hvac", "❄️ HVAC"], ["plumbing", "🔩 Plumbing"]].map(([key, label]) => (
            <button key={key} onClick={() => loadPreset(key)} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", borderRadius: 6, border: "1px solid " + (preset === key ? "#f97316" : "#1e293b"), background: preset === key ? "#1c0a00" : "transparent", color: preset === key ? "#fb923c" : "#64748b", fontSize: 12, cursor: "pointer", marginBottom: 4, transition: "all 0.15s" }}>{label}</button>
          ))}
        </div>

        <nav style={{ padding: "12px 8px", flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const catResult = results.cats.find(c => c.key === item.key);
            const sev = catResult ? getSeverity(catResult.score) : null;
            return (
              <button key={item.key} onClick={() => setActiveSection(item.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: activeSection === item.key ? "#1e293b" : "transparent", color: activeSection === item.key ? "#f1f5f9" : "#64748b", fontSize: 12, cursor: "pointer", marginBottom: 2, textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {sev && <span style={{ width: 7, height: 7, borderRadius: "50%", background: sev.color, flexShrink: 0 }} />}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #1e293b" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Total RRP</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f97316" }}>{fmtK(results.totalAnnual)}</div>
          <div style={{ fontSize: 11, color: "#475569" }}>annually recoverable</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* TOP SUMMARY BAR */}
        <div style={{ background: "#0a0f1e", borderBottom: "1px solid #1e293b", padding: "16px 32px", display: "flex", alignItems: "center", gap: 32 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{company.name || "Your Business"}</div>
            <div style={{ fontSize: 11, color: "#475569" }}>{company.industry}</div>
          </div>
          <div style={{ flex: 1 }} />
          {[
            { label: "Monthly RRP", value: fmtK(results.totalMonthly), color: "#f97316" },
            { label: "Annual RRP", value: fmtK(results.totalAnnual), color: "#f97316" },
            { label: "% of Revenue", value: fmtPct(results.rrpPct), color: results.rrpPct > 20 ? "#ef4444" : results.rrpPct > 10 ? "#eab308" : "#22c55e" },
            { label: "RevAudit Score", value: Math.round(results.overallScore), color: getSeverity(results.overallScore).color },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
          {activeSection === "company" && (
            <div style={{ maxWidth: 700 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 24, marginTop: 0 }}>Company Profile</h2>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <InputField label="Company Name" type="text" value={company.name} onChange={v => setCompany({ ...company, name: v })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <InputField label="Industry / Trade" type="text" value={company.industry} onChange={v => setCompany({ ...company, industry: v })} />
                  </div>
                  <InputField label="Annual Revenue" value={company.annualRevenue} onChange={v => setCompany({ ...company, annualRevenue: v })} prefix="$" />
                  <InputField label="Gross Margin" value={company.grossMargin} onChange={v => setCompany({ ...company, grossMargin: v })} suffix="%" max={100} />
                  <InputField label="Total Employees" value={company.employees} onChange={v => setCompany({ ...company, employees: v })} />
                  <InputField label="Field Technicians" value={company.fieldTechs} onChange={v => setCompany({ ...company, fieldTechs: v })} />
                  <InputField label="Office / Admin Staff" value={company.officeStaff} onChange={v => setCompany({ ...company, officeStaff: v })} />
                  <InputField label="Avg Job Size" value={company.avgJobSize} onChange={v => setCompany({ ...company, avgJobSize: v })} prefix="$" />
                  <InputField label="Jobs Per Month" value={company.jobsPerMonth} onChange={v => setCompany({ ...company, jobsPerMonth: v })} />
                  <InputField label="Avg Sales Cycle (days)" value={company.salesCycleDays} onChange={v => setCompany({ ...company, salesCycleDays: v })} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <InputField label="Primary Sales Channel" type="text" value={company.primaryChannel} onChange={v => setCompany({ ...company, primaryChannel: v })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <InputField label="Service Area / Market" type="text" value={company.serviceArea} onChange={v => setCompany({ ...company, serviceArea: v })} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[{ label: "Revenue/Tech/Mo", value: fmt(company.annualRevenue / 12 / Math.max(1, company.fieldTechs)) }, { label: "Jobs/Tech/Mo", value: Math.round(company.jobsPerMonth / Math.max(1, company.fieldTechs)) }, { label: "Avg Job Size", value: fmt(company.avgJobSize) }].map(s => (
                  <div key={s.label} style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginTop: 4 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: 16, background: "#0d1a0d", border: "1px solid #166534", borderRadius: 10, fontSize: 13, color: "#86efac", lineHeight: 1.6 }}>
                ✅ <strong>Next:</strong> Work through each category in the left navigation to quantify your leakage. Sample data is pre-loaded — update any field to reflect your actual business.
              </div>
            </div>
          )}

          {activeSection === "demand" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <DemandPanel data={demand} onChange={setDemand} />
              </div>
              <RecsPanel recs={getRecommendations("demand")} />
            </div>
          )}
          {activeSection === "sales" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <SalesPanel data={sales} onChange={setSales} />
              </div>
              <RecsPanel recs={getRecommendations("sales")} />
            </div>
          )}
          {activeSection === "materials" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <MaterialsPanel data={materials} onChange={setMaterials} />
              </div>
              <RecsPanel recs={getRecommendations("materials")} />
            </div>
          )}
          {activeSection === "labor" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <LaborPanel data={labor} onChange={setLabor} />
              </div>
              <RecsPanel recs={getRecommendations("labor")} />
            </div>
          )}
          {activeSection === "execution" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <ExecutionPanel data={execution} onChange={setExecution} />
              </div>
              <RecsPanel recs={getRecommendations("execution")} />
            </div>
          )}
          {activeSection === "billing" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <BillingPanel data={billing} onChange={setBilling} />
              </div>
              <RecsPanel recs={getRecommendations("billing")} />
            </div>
          )}
          {activeSection === "retention" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <RetentionPanel data={retention} onChange={setRetention} />
              </div>
              <RecsPanel recs={getRecommendations("retention")} />
            </div>
          )}
          {activeSection === "forecasting" && (
            <div style={{ maxWidth: 700 }}>
              <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 24 }}>
                <ForecastingPanel data={forecasting} onChange={setForecasting} />
              </div>
              <RecsPanel recs={getRecommendations("forecasting")} />
            </div>
          )}

          {activeSection === "results" && <ResultsDashboard results={results} company={company} labor={labor} />}
        </div>
      </div>
    </div>
  );
}

function RecsPanel({ recs }) {
  return (
    <div style={{ marginTop: 20, background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 14 }}>Priority Recommendations</div>
      {recs.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
          <span style={{ background: "#1c0a00", color: "#f97316", border: "1px solid #f9731640", borderRadius: 20, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
          <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>{r}</span>
        </div>
      ))}
    </div>
  );
}

function ResultsDashboard({ results, company, labor }) {
  const { cats, totalMonthly, totalAnnual, overallScore, rrpPct, topLeaks } = results;
  const overallSev = getSeverity(overallScore);
  const laborResult = calcLabor(labor);

  const barData = cats.map((c, i) => ({
    name: c.label.replace("Demand Conversion", "Demand").replace("Job Execution", "Execution").replace("Revenue Capture", "Billing").replace("Labor Efficiency", "Labor").replace("Sales / Estimating", "Sales").replace("Forecasting", "Forecast"),
    leakage: Math.round(c.leakage),
    fill: CATEGORY_COLORS[i]
  }));

  const pieData = cats.filter(c => c.leakage > 0).map((c, i) => ({
    name: c.label.replace("Demand Conversion", "Demand").replace("Job Execution", "Execution").replace("Revenue Capture", "Billing").replace("Labor Efficiency", "Labor"),
    value: Math.round(c.leakage),
    fill: CATEGORY_COLORS[i]
  }));

  return (
    <div>
      {/* HERO METRICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Monthly RRP", value: fmtK(totalMonthly), sub: "Recoverable/month", color: "#f97316", bg: "#1c0a00", border: "#f9731640" },
          { label: "Annual RRP", value: fmtK(totalAnnual), sub: "Total annual leakage", color: "#fb923c", bg: "#1c0a00", border: "#fb923c40" },
          { label: "% of Revenue", value: fmtPct(rrpPct), sub: company.annualRevenue > 0 ? "of " + fmtK(company.annualRevenue) + " rev" : "set revenue above", color: rrpPct > 20 ? "#ef4444" : "#eab308", bg: rrpPct > 20 ? "#1c0000" : "#1c1400", border: (rrpPct > 20 ? "#ef444440" : "#eab30840") },
          { label: "RevAudit Score", value: Math.round(overallScore), sub: overallSev.label, color: overallSev.color, bg: overallSev.bg, border: overallSev.color + "40" },
        ].map(m => (
          <div key={m.label} style={{ background: m.bg, border: "1px solid " + m.border, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* TOP 3 LEAKS */}
      <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Top 3 Revenue Leaks by Impact</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {topLeaks.map((c, i) => {
            const sev = getSeverity(c.score);
            return (
              <div key={c.key} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>#{i + 1}</span>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: sev.bg, color: sev.color, border: "1px solid " + sev.color + "40", fontWeight: 600 }}>{sev.label}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#f97316" }}>{fmt(c.leakage)}<span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>/mo</span></div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{fmt(c.leakage * 12)}/year</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Leakage by Category (Monthly)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} />
              <Tooltip formatter={(v) => [fmt(v), "Leakage"]} contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="leakage" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Leakage Mix</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.fill }} />
                <span style={{ fontSize: 10, color: "#64748b" }}>{d.name.split("/")[0].trim().substring(0, 10)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY SCORECARDS */}
      <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Category Scorecards</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {cats.map((c, i) => {
            const sev = getSeverity(c.score);
            return (
              <div key={c.key} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>{c.label}</div>
                <ScoreGauge score={c.score} />
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 11, color: "#475569" }}>Monthly Leakage</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f97316" }}>{fmt(c.leakage)}</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  {c.drivers.slice(0, 2).map((d, j) => (
                    <div key={j} style={{ fontSize: 10, color: "#475569", marginBottom: 3, display: "flex", alignItems: "flex-start", gap: 4 }}>
                      <span style={{ color: "#f97316", flexShrink: 0 }}>›</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRIORITY ACTIONS */}
      <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Priority Action Plan — Top 3 Categories</div>
        {topLeaks.map((c, ci) => {
          const sev = getSeverity(c.score);
          return (
            <div key={c.key} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: ci < 2 ? "1px solid #1e293b" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ background: "#1c0a00", color: "#f97316", border: "1px solid #f9731640", borderRadius: 20, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>#{ci + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{c.label}</span>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: sev.bg, color: sev.color, border: "1px solid " + sev.color + "40", fontWeight: 600 }}>{sev.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 14, fontWeight: 700, color: "#f97316" }}>{fmt(c.leakage * 12)}/yr opportunity</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {c.recs.map((r, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#0f172a", borderRadius: 8, padding: "10px 12px" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0, fontSize: 12, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* LABOR CAPACITY INSIGHT */}
      <div style={{ background: "#0d2136", border: "1px solid #0ea5e9", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8", marginBottom: 12 }}>⚡ Labor Capacity Recovery Insight</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div><div style={{ fontSize: 11, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recoverable Hours</div><div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>{calcLabor(labor).totalRecovHours} hrs/mo</div></div>
          <div><div style={{ fontSize: 11, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em" }}>Extra Jobs Possible</div><div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>+{calcLabor(labor).extraJobsFromRecovery} jobs/mo</div></div>
          <div><div style={{ fontSize: 11, color: "#7dd3fc", textTransform: "uppercase", letterSpacing: "0.06em" }}>Annual Revenue Upside</div><div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8" }}>{fmtK(calcLabor(labor).extraJobsFromRecovery * 12 * (company.avgJobSize || 2000))}</div></div>
        </div>
      </div>

      {/* INTEGRATION NOTE */}
      <div style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 12, padding: 20, fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, color: "#64748b", marginBottom: 8 }}>🔗 Integration Notes — Connecting to Airtable or Supabase</div>
        <p style={{ margin: "0 0 8px" }}>This app is structured for easy backend integration. Each input category maps to a distinct data model. To connect:</p>
        <p style={{ margin: "0 0 4px" }}><strong style={{ color: "#94a3b8" }}>Airtable:</strong> Create one table per category (CompanyProfile, DemandInputs, SalesInputs, etc.). Use the Airtable REST API to POST inputs on submit and GET saved audits by record ID. Store <code style={{ background: "#1e293b", padding: "1px 4px", borderRadius: 4 }}>auditId</code> in URL params for shareable links.</p>
        <p style={{ margin: "0 0 4px" }}><strong style={{ color: "#94a3b8" }}>Supabase:</strong> Use a single <code style={{ background: "#1e293b", padding: "1px 4px", borderRadius: 4 }}>audits</code> table with a JSONB <code style={{ background: "#1e293b", padding: "1px 4px", borderRadius: 4" }}>inputs</code> column. Call <code style={{ background: "#1e293b", padding: "1px 4px", borderRadius: 4 }}>supabase.from('audits').upsert()</code> on any change. Add RLS policies to scope to authenticated users.</p>
        <p style={{ margin: 0 }}><strong style={{ color: "#94a3b8" }}>PDF Export:</strong> Wrap the Results Dashboard in a <code style={{ background: "#1e293b", padding: "1px 4px", borderRadius: 4 }}>react-pdf</code> template or use <code style={{ background: "#1e293b", padding: "1px 4px", borderRadius: 4 }}>html2canvas + jsPDF</code> to generate a branded leave-behind for prospects.</p>
      </div>
    </div>
  );
}
