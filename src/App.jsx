"use client";
import { useState, useMemo, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',-apple-system,sans-serif}
.ra-mono{font-family:'DM Mono','SFMono-Regular',monospace}
.ra-root{display:flex;min-height:100vh;background:#0C0C0C;font-family:'DM Sans',-apple-system,sans-serif;color:#E8E8E8}
.ra-sidebar{width:240px;min-width:240px;flex-shrink:0;background:#0F0F0F;border-right:1px solid #1E1E1E;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;transition:transform 0.25s;z-index:50}
.ra-main{flex:1;display:flex;flex-direction:column;min-width:0;width:0}
.ra-topbar{background:#0F0F0F;border-bottom:1px solid #1E1E1E;padding:16px 32px;display:flex;align-items:center;gap:24px;flex-shrink:0}
.ra-metrics{display:flex;gap:32px;margin-left:auto}
.ra-page{flex:1;overflow-y:auto;padding:40px}
.ra-section{width:100%}
.ra-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ra-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.ra-4col{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.ra-3eq{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.ra-4eq{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.ra-chart-row{display:grid;grid-template-columns:3fr 2fr;gap:16px;margin-bottom:20px}
.ra-2rec{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ra-mbtn{display:none;background:none;border:1px solid #1E1E1E;border-radius:8px;padding:6px 12px;color:#686868;cursor:pointer;font-size:18px;line-height:1;font-family:inherit}
.ra-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:49}
.ra-overlay.on{display:block}
.ra-preset-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.ra-preset-card{background:#141414;border:1px solid #1E1E1E;border-radius:14px;padding:28px 20px;text-align:left;cursor:pointer;transition:border-color 0.15s,background 0.15s;font-family:'DM Sans',-apple-system,sans-serif}
.ra-preset-card:hover{border-color:#F97316;background:#1A1008}
@media(max-width:768px){
  .ra-sidebar{position:fixed!important;left:0;top:0;height:100%;transform:translateX(-100%);z-index:100}
  .ra-sidebar.on{transform:translateX(0)}
  .ra-main{width:100%}
  .ra-mbtn{display:block!important}
  .ra-topbar{padding:12px 16px;gap:12px}
  .ra-metrics{display:none!important}
  .ra-page{padding:20px}
  .ra-2col,.ra-3col,.ra-4col,.ra-3eq,.ra-4eq,.ra-chart-row,.ra-2rec{grid-template-columns:1fr!important}
  .ra-preset-grid{grid-template-columns:1fr 1fr}
}
`;

const BENCHMARKS = {
  electrical: {
    demand:{missedCallRate:18,leadResponseMinutes:47,bookingRate:62,noFollowUpRate:22,capacityDeclineRate:8},
    sales:{quoteCloseRate:58,underpricingRate:22,avgUnderpricingPct:12,scopeCreepFreq:28,scopeCreepImpact:9},
    materials:{wasteRate:7,reBuyRate:4,shrinkageRate:2,overstockRate:5},
    labor:{laborOverrunPct:12,reworkRatePct:8,technicianUtilization:68},
    execution:{returnVisitRate:11,lateJobPct:14,incompleteJobRate:4,undocumentedRate:15},
    billing:{unbilledWorkPct:6,underbillingPct:4,invoiceLagDays:18},
    retention:{churnRate:22,maintenanceAttachRate:18,missedUpsellRate:28,missingReferralRate:46},
    forecasting:{forecastAccuracy:58,technicianUtilization:68,scheduleUtilization:71}
  },
  hvac: {
    demand:{missedCallRate:14,leadResponseMinutes:38,bookingRate:68,noFollowUpRate:18,capacityDeclineRate:12},
    sales:{quoteCloseRate:62,underpricingRate:18,avgUnderpricingPct:10,scopeCreepFreq:24,scopeCreepImpact:8},
    materials:{wasteRate:6,reBuyRate:3,shrinkageRate:1.5,overstockRate:6},
    labor:{laborOverrunPct:10,reworkRatePct:6,technicianUtilization:72},
    execution:{returnVisitRate:9,lateJobPct:12,incompleteJobRate:3,undocumentedRate:12},
    billing:{unbilledWorkPct:5,underbillingPct:3,invoiceLagDays:22},
    retention:{churnRate:18,maintenanceAttachRate:28,missedUpsellRate:24,missingReferralRate:42},
    forecasting:{forecastAccuracy:62,technicianUtilization:72,scheduleUtilization:74}
  },
  plumbing: {
    demand:{missedCallRate:22,leadResponseMinutes:55,bookingRate:58,noFollowUpRate:26,capacityDeclineRate:10},
    sales:{quoteCloseRate:54,underpricingRate:26,avgUnderpricingPct:14,scopeCreepFreq:32,scopeCreepImpact:11},
    materials:{wasteRate:9,reBuyRate:5,shrinkageRate:3,overstockRate:6},
    labor:{laborOverrunPct:14,reworkRatePct:10,technicianUtilization:64},
    execution:{returnVisitRate:13,lateJobPct:16,incompleteJobRate:5,undocumentedRate:18},
    billing:{unbilledWorkPct:7,underbillingPct:5,invoiceLagDays:24},
    retention:{churnRate:28,maintenanceAttachRate:12,missedUpsellRate:32,missingReferralRate:52},
    forecasting:{forecastAccuracy:52,technicianUtilization:64,scheduleUtilization:68}
  },
  advertising: {
    demand:{missedCallRate:8,leadResponseMinutes:120,bookingRate:42,noFollowUpRate:32,capacityDeclineRate:5},
    sales:{quoteCloseRate:38,underpricingRate:28,avgUnderpricingPct:18,scopeCreepFreq:48,scopeCreepImpact:22},
    materials:{wasteRate:3,reBuyRate:2,shrinkageRate:1,overstockRate:4},
    labor:{laborOverrunPct:18,reworkRatePct:22,technicianUtilization:62},
    execution:{returnVisitRate:5,lateJobPct:28,incompleteJobRate:12,undocumentedRate:35},
    billing:{unbilledWorkPct:14,underbillingPct:9,invoiceLagDays:32},
    retention:{churnRate:34,maintenanceAttachRate:8,missedUpsellRate:42,missingReferralRate:58},
    forecasting:{forecastAccuracy:48,technicianUtilization:62,scheduleUtilization:58}
  },
  retail: {
    demand:{missedCallRate:5,leadResponseMinutes:8,bookingRate:72,noFollowUpRate:38,capacityDeclineRate:4},
    sales:{quoteCloseRate:68,underpricingRate:14,avgUnderpricingPct:8,scopeCreepFreq:12,scopeCreepImpact:5},
    materials:{wasteRate:4,reBuyRate:6,shrinkageRate:3,overstockRate:18},
    labor:{laborOverrunPct:8,reworkRatePct:4,technicianUtilization:62},
    execution:{returnVisitRate:12,lateJobPct:8,incompleteJobRate:3,undocumentedRate:14},
    billing:{unbilledWorkPct:4,underbillingPct:3,invoiceLagDays:2},
    retention:{churnRate:32,maintenanceAttachRate:14,missedUpsellRate:38,missingReferralRate:54},
    forecasting:{forecastAccuracy:56,technicianUtilization:62,scheduleUtilization:64}
  },
  healthcare: {
    demand:{missedCallRate:12,leadResponseMinutes:60,bookingRate:70,noFollowUpRate:15,capacityDeclineRate:5},
    sales:{quoteCloseRate:72,underpricingRate:6,avgUnderpricingPct:4,scopeCreepFreq:8,scopeCreepImpact:3},
    materials:{wasteRate:3,reBuyRate:2,shrinkageRate:1,overstockRate:5},
    labor:{laborOverrunPct:6,reworkRatePct:2,technicianUtilization:78},
    execution:{returnVisitRate:4,lateJobPct:8,incompleteJobRate:2,undocumentedRate:8},
    billing:{unbilledWorkPct:3,underbillingPct:2,invoiceLagDays:3},
    retention:{churnRate:18,maintenanceAttachRate:22,missedUpsellRate:28,missingReferralRate:40},
    forecasting:{forecastAccuracy:72,technicianUtilization:78,scheduleUtilization:80}
  },
  customhome: {
    demand:{missedCallRate:14,leadResponseMinutes:240,bookingRate:38,noFollowUpRate:30,capacityDeclineRate:14},
    sales:{quoteCloseRate:30,underpricingRate:32,avgUnderpricingPct:15,scopeCreepFreq:58,scopeCreepImpact:17},
    materials:{wasteRate:11,reBuyRate:7,shrinkageRate:3,overstockRate:8},
    labor:{laborOverrunPct:20,reworkRatePct:12,technicianUtilization:60},
    execution:{returnVisitRate:9,lateJobPct:38,incompleteJobRate:7,undocumentedRate:26},
    billing:{unbilledWorkPct:11,underbillingPct:7,invoiceLagDays:40},
    retention:{churnRate:65,maintenanceAttachRate:4,missedUpsellRate:50,missingReferralRate:50},
    forecasting:{forecastAccuracy:42,technicianUtilization:60,scheduleUtilization:54}
  },
  construction: {
    demand:{missedCallRate:12,leadResponseMinutes:240,bookingRate:38,noFollowUpRate:28,capacityDeclineRate:15},
    sales:{quoteCloseRate:32,underpricingRate:34,avgUnderpricingPct:16,scopeCreepFreq:62,scopeCreepImpact:18},
    materials:{wasteRate:12,reBuyRate:8,shrinkageRate:4,overstockRate:9},
    labor:{laborOverrunPct:22,reworkRatePct:14,technicianUtilization:58},
    execution:{returnVisitRate:8,lateJobPct:42,incompleteJobRate:8,undocumentedRate:28},
    billing:{unbilledWorkPct:12,underbillingPct:8,invoiceLagDays:45},
    retention:{churnRate:28,maintenanceAttachRate:4,missedUpsellRate:52,missingReferralRate:48},
    forecasting:{forecastAccuracy:42,technicianUtilization:58,scheduleUtilization:52}
  }
};

const PRESETS = {
  electrical: {
    company:{name:"Precision Electric Co.",industry:"Electrical Contractor",annualRevenue:2400000,grossMargin:38,employees:14,fieldTechs:10,officeStaff:4,avgJobSize:2200,jobsPerMonth:90,salesCycleDays:3,primaryChannel:"Referrals / Phone",serviceArea:"Metro Area"},
    demand:{leadsPerMonth:140,missedCallRate:18,leadResponseMinutes:47,bookingRate:62,noFollowUpRate:22,capacityDeclineRate:8,avgJobValue:2200},
    sales:{estimatesPerMonth:75,quoteCloseRate:58,avgQuotedJobValue:2800,underpricingRate:22,avgUnderpricingPct:12,missedChangeOrders:18,avgMissedChangeOrderValue:380,scopeCreepFreq:28,scopeCreepImpact:9},
    materials:{monthlyMaterialSpend:95000,wasteRate:7,reBuyRate:4,shrinkageRate:2,overstockRate:5,returnLossPerMonth:1800,shortageJobsPerMonth:9,avgShortageImpact:220},
    labor:{totalLaborHours:1600,loadedLaborCostPerHour:68,laborOverrunPct:12,reworkRatePct:8,avgReworkHours:3.5,idleWaitHours:85,travelInefficHours:110,delayedJobs:12,avgHoursLostPerDelay:2.2},
    execution:{jobsPerMonth:90,returnVisitRate:11,avgReturnVisitCost:280,lateJobPct:14,avgDelayedJobCost:180,incompleteJobRate:4,incompleteJobCost:420,callbacksPerMonth:8,avgCallbackCost:310,undocumentedRate:15,revenueLeakagePerUndocumented:190,safetyComplianceCosts:1200},
    billing:{jobsCompletedPerMonth:88,unbilledWorkPct:6,avgInvoiceValue:2100,invoiceLagDays:18,underbillingPct:4,unapprovedDiscountsPerMonth:2800,unbilledChangeOrders:7,avgUnbilledChangeOrderValue:340,writeOffsPerMonth:1400},
    retention:{activeCustomers:420,repeatRate:44,churnRate:22,maintenanceAttachRate:18,eligibleForAgreements:180,avgAgreementValue:1200,postJobFollowUpRate:38,reviewRequestRate:42,upsellConversionRate:12,missedUpsellRate:28,avgUpsellValue:680,avgCLTV:8400,referralCaptureRate:24,missingReferralRate:46,avgReferralJobValue:2100,referralConversionFactor:0.35},
    forecasting:{forecastAccuracy:58,scheduleUtilization:71,revenueVolatility:3,rescheduledJobs:14,avgRescheduleCost:180,capacityPlanningAccuracy:52,technicianUtilization:68,coordinationScore:5,jobsLostToSchedulingGaps:6,avgLostScheduledJobValue:2200,availableTechHours:1600,revenuePerTechHour:95}
  },
  hvac: {
    company:{name:"Arctic Air HVAC",industry:"HVAC Company",annualRevenue:3800000,grossMargin:42,employees:22,fieldTechs:16,officeStaff:6,avgJobSize:3400,jobsPerMonth:110,salesCycleDays:5,primaryChannel:"Digital / Referrals",serviceArea:"Tri-County"},
    demand:{leadsPerMonth:190,missedCallRate:14,leadResponseMinutes:38,bookingRate:68,noFollowUpRate:18,capacityDeclineRate:12,avgJobValue:3400},
    sales:{estimatesPerMonth:95,quoteCloseRate:62,avgQuotedJobValue:4200,underpricingRate:18,avgUnderpricingPct:10,missedChangeOrders:22,avgMissedChangeOrderValue:520,scopeCreepFreq:24,scopeCreepImpact:8},
    materials:{monthlyMaterialSpend:145000,wasteRate:6,reBuyRate:3,shrinkageRate:1.5,overstockRate:6,returnLossPerMonth:2400,shortageJobsPerMonth:7,avgShortageImpact:310},
    labor:{totalLaborHours:2400,loadedLaborCostPerHour:72,laborOverrunPct:10,reworkRatePct:6,avgReworkHours:4.0,idleWaitHours:110,travelInefficHours:140,delayedJobs:14,avgHoursLostPerDelay:2.5},
    execution:{jobsPerMonth:110,returnVisitRate:9,avgReturnVisitCost:320,lateJobPct:12,avgDelayedJobCost:210,incompleteJobRate:3,incompleteJobCost:580,callbacksPerMonth:10,avgCallbackCost:380,undocumentedRate:12,revenueLeakagePerUndocumented:240,safetyComplianceCosts:1800},
    billing:{jobsCompletedPerMonth:108,unbilledWorkPct:5,avgInvoiceValue:3200,invoiceLagDays:22,underbillingPct:3,unapprovedDiscountsPerMonth:3400,unbilledChangeOrders:9,avgUnbilledChangeOrderValue:480,writeOffsPerMonth:2100},
    retention:{activeCustomers:680,repeatRate:52,churnRate:18,maintenanceAttachRate:28,eligibleForAgreements:280,avgAgreementValue:1800,postJobFollowUpRate:44,reviewRequestRate:48,upsellConversionRate:15,missedUpsellRate:24,avgUpsellValue:920,avgCLTV:12000,referralCaptureRate:28,missingReferralRate:42,avgReferralJobValue:3200,referralConversionFactor:0.4},
    forecasting:{forecastAccuracy:62,scheduleUtilization:74,revenueVolatility:3,rescheduledJobs:18,avgRescheduleCost:220,capacityPlanningAccuracy:58,technicianUtilization:72,coordinationScore:6,jobsLostToSchedulingGaps:8,avgLostScheduledJobValue:3400,availableTechHours:2400,revenuePerTechHour:110}
  },
  plumbing: {
    company:{name:"BlueFlow Plumbing",industry:"Plumbing Business",annualRevenue:1800000,grossMargin:36,employees:11,fieldTechs:8,officeStaff:3,avgJobSize:1650,jobsPerMonth:95,salesCycleDays:2,primaryChannel:"Google / Phone",serviceArea:"City + Suburbs"},
    demand:{leadsPerMonth:160,missedCallRate:22,leadResponseMinutes:55,bookingRate:58,noFollowUpRate:26,capacityDeclineRate:10,avgJobValue:1650},
    sales:{estimatesPerMonth:65,quoteCloseRate:54,avgQuotedJobValue:2100,underpricingRate:26,avgUnderpricingPct:14,missedChangeOrders:20,avgMissedChangeOrderValue:290,scopeCreepFreq:32,scopeCreepImpact:11},
    materials:{monthlyMaterialSpend:72000,wasteRate:9,reBuyRate:5,shrinkageRate:3,overstockRate:6,returnLossPerMonth:1400,shortageJobsPerMonth:11,avgShortageImpact:190},
    labor:{totalLaborHours:1280,loadedLaborCostPerHour:62,laborOverrunPct:14,reworkRatePct:10,avgReworkHours:3.0,idleWaitHours:95,travelInefficHours:120,delayedJobs:15,avgHoursLostPerDelay:2.0},
    execution:{jobsPerMonth:95,returnVisitRate:13,avgReturnVisitCost:240,lateJobPct:16,avgDelayedJobCost:150,incompleteJobRate:5,incompleteJobCost:360,callbacksPerMonth:10,avgCallbackCost:270,undocumentedRate:18,revenueLeakagePerUndocumented:160,safetyComplianceCosts:900},
    billing:{jobsCompletedPerMonth:93,unbilledWorkPct:7,avgInvoiceValue:1580,invoiceLagDays:24,underbillingPct:5,unapprovedDiscountsPerMonth:2200,unbilledChangeOrders:8,avgUnbilledChangeOrderValue:260,writeOffsPerMonth:1200},
    retention:{activeCustomers:360,repeatRate:38,churnRate:28,maintenanceAttachRate:12,eligibleForAgreements:140,avgAgreementValue:980,postJobFollowUpRate:32,reviewRequestRate:36,upsellConversionRate:9,missedUpsellRate:32,avgUpsellValue:540,avgCLTV:6200,referralCaptureRate:20,missingReferralRate:52,avgReferralJobValue:1600,referralConversionFactor:0.3},
    forecasting:{forecastAccuracy:52,scheduleUtilization:68,revenueVolatility:4,rescheduledJobs:16,avgRescheduleCost:150,capacityPlanningAccuracy:48,technicianUtilization:64,coordinationScore:4,jobsLostToSchedulingGaps:7,avgLostScheduledJobValue:1650,availableTechHours:1280,revenuePerTechHour:82}
  },
  advertising: {
    company:{name:"Apex Creative Agency",industry:"Advertising / Marketing Agency",annualRevenue:3200000,grossMargin:52,employees:18,fieldTechs:0,officeStaff:18,avgJobSize:28000,jobsPerMonth:9,salesCycleDays:45,primaryChannel:"Referrals / Outbound",serviceArea:"National"},
    demand:{leadsPerMonth:28,missedCallRate:8,leadResponseMinutes:120,bookingRate:42,noFollowUpRate:32,capacityDeclineRate:5,avgJobValue:28000},
    sales:{estimatesPerMonth:14,quoteCloseRate:38,avgQuotedJobValue:38000,underpricingRate:28,avgUnderpricingPct:18,missedChangeOrders:6,avgMissedChangeOrderValue:4200,scopeCreepFreq:48,scopeCreepImpact:22},
    materials:{monthlyMaterialSpend:28000,wasteRate:3,reBuyRate:2,shrinkageRate:1,overstockRate:4,returnLossPerMonth:800,shortageJobsPerMonth:2,avgShortageImpact:1200},
    labor:{totalLaborHours:2800,loadedLaborCostPerHour:95,laborOverrunPct:18,reworkRatePct:22,avgReworkHours:6.0,idleWaitHours:180,travelInefficHours:60,delayedJobs:4,avgHoursLostPerDelay:8.0},
    execution:{jobsPerMonth:9,returnVisitRate:5,avgReturnVisitCost:1200,lateJobPct:28,avgDelayedJobCost:2800,incompleteJobRate:12,incompleteJobCost:6500,callbacksPerMonth:3,avgCallbackCost:1800,undocumentedRate:35,revenueLeakagePerUndocumented:1400,safetyComplianceCosts:400},
    billing:{jobsCompletedPerMonth:8,unbilledWorkPct:14,avgInvoiceValue:26000,invoiceLagDays:32,underbillingPct:9,unapprovedDiscountsPerMonth:4200,unbilledChangeOrders:4,avgUnbilledChangeOrderValue:3800,writeOffsPerMonth:3200},
    retention:{activeCustomers:68,repeatRate:44,churnRate:34,maintenanceAttachRate:8,eligibleForAgreements:40,avgAgreementValue:4800,postJobFollowUpRate:28,reviewRequestRate:22,upsellConversionRate:14,missedUpsellRate:42,avgUpsellValue:12000,avgCLTV:85000,referralCaptureRate:18,missingReferralRate:58,avgReferralJobValue:28000,referralConversionFactor:0.25},
    forecasting:{forecastAccuracy:48,scheduleUtilization:58,revenueVolatility:5,rescheduledJobs:3,avgRescheduleCost:2400,capacityPlanningAccuracy:44,technicianUtilization:62,coordinationScore:4,jobsLostToSchedulingGaps:2,avgLostScheduledJobValue:28000,availableTechHours:2800,revenuePerTechHour:185}
  },
  retail: {
    company:{name:"Main Street Retail Co.",industry:"Retail Store",annualRevenue:2200000,grossMargin:44,employees:16,fieldTechs:0,officeStaff:16,avgJobSize:85,jobsPerMonth:2100,salesCycleDays:0,primaryChannel:"Walk-in / E-commerce",serviceArea:"Local / Online"},
    demand:{leadsPerMonth:3200,missedCallRate:5,leadResponseMinutes:8,bookingRate:72,noFollowUpRate:38,capacityDeclineRate:4,avgJobValue:85},
    sales:{estimatesPerMonth:2100,quoteCloseRate:68,avgQuotedJobValue:95,underpricingRate:14,avgUnderpricingPct:8,missedChangeOrders:0,avgMissedChangeOrderValue:0,scopeCreepFreq:12,scopeCreepImpact:5},
    materials:{monthlyMaterialSpend:82000,wasteRate:4,reBuyRate:6,shrinkageRate:3,overstockRate:18,returnLossPerMonth:4200,shortageJobsPerMonth:28,avgShortageImpact:320},
    labor:{totalLaborHours:2400,loadedLaborCostPerHour:24,laborOverrunPct:8,reworkRatePct:4,avgReworkHours:1.5,idleWaitHours:220,travelInefficHours:30,delayedJobs:0,avgHoursLostPerDelay:0},
    execution:{jobsPerMonth:2100,returnVisitRate:12,avgReturnVisitCost:28,lateJobPct:8,avgDelayedJobCost:45,incompleteJobRate:3,incompleteJobCost:65,callbacksPerMonth:18,avgCallbackCost:35,undocumentedRate:14,revenueLeakagePerUndocumented:55,safetyComplianceCosts:800},
    billing:{jobsCompletedPerMonth:2050,unbilledWorkPct:4,avgInvoiceValue:85,invoiceLagDays:2,underbillingPct:3,unapprovedDiscountsPerMonth:3800,unbilledChangeOrders:0,avgUnbilledChangeOrderValue:0,writeOffsPerMonth:1600},
    retention:{activeCustomers:1800,repeatRate:42,churnRate:32,maintenanceAttachRate:14,eligibleForAgreements:420,avgAgreementValue:280,postJobFollowUpRate:18,reviewRequestRate:22,upsellConversionRate:18,missedUpsellRate:38,avgUpsellValue:42,avgCLTV:680,referralCaptureRate:12,missingReferralRate:54,avgReferralJobValue:85,referralConversionFactor:0.22},
    forecasting:{forecastAccuracy:56,scheduleUtilization:64,revenueVolatility:4,rescheduledJobs:8,avgRescheduleCost:95,capacityPlanningAccuracy:52,technicianUtilization:62,coordinationScore:5,jobsLostToSchedulingGaps:22,avgLostScheduledJobValue:85,availableTechHours:2400,revenuePerTechHour:38}
  },
  healthcare: {
    company:{name:"Revive Health & Wellness",industry:"Healthcare Services",annualRevenue:1400000,grossMargin:58,employees:14,fieldTechs:8,officeStaff:5,avgJobSize:280,jobsPerMonth:420,salesCycleDays:1,primaryChannel:"Referrals & Google",serviceArea:"Metro Area"},
    demand:{leadsPerMonth:120,missedCallRate:24,leadResponseMinutes:180,bookingRate:52,noFollowUpRate:38,capacityDeclineRate:8,avgJobValue:280},
    sales:{estimatesPerMonth:80,quoteCloseRate:55,avgQuotedJobValue:340,underpricingRate:14,avgUnderpricingPct:8,missedChangeOrders:12,avgMissedChangeOrderValue:95,scopeCreepFreq:18,scopeCreepImpact:6},
    materials:{monthlyMaterialSpend:18000,wasteRate:8,reBuyRate:4,shrinkageRate:3,overstockRate:12,returnLossPerMonth:800,shortageJobsPerMonth:6,avgShortageImpact:120},
    labor:{totalLaborHours:2200,loadedLaborCostPerHour:58,laborOverrunPct:12,reworkRatePct:6,avgReworkHours:1.5,idleWaitHours:180,travelInefficHours:40,delayedJobs:8,avgHoursLostPerDelay:1.5},
    execution:{jobsPerMonth:420,returnVisitRate:8,avgReturnVisitCost:85,lateJobPct:15,avgDelayedJobCost:65,incompleteJobRate:4,incompleteJobCost:120,callbacksPerMonth:22,avgCallbackCost:75,undocumentedRate:22,revenueLeakagePerUndocumented:65,safetyComplianceCosts:1200},
    billing:{jobsCompletedPerMonth:410,unbilledWorkPct:8,avgInvoiceValue:265,invoiceLagDays:12,underbillingPct:5,unapprovedDiscountsPerMonth:2200,unbilledChangeOrders:0,avgUnbilledChangeOrderValue:0,writeOffsPerMonth:2800},
    retention:{activeCustomers:680,repeatRate:55,churnRate:28,maintenanceAttachRate:14,eligibleForAgreements:320,avgAgreementValue:480,postJobFollowUpRate:22,reviewRequestRate:18,upsellConversionRate:8,missedUpsellRate:42,avgUpsellValue:185,avgCLTV:3200,referralCaptureRate:18,missingReferralRate:55,avgReferralJobValue:280,referralConversionFactor:0.28},
    forecasting:{forecastAccuracy:52,scheduleUtilization:65,revenueVolatility:3,rescheduledJobs:28,avgRescheduleCost:95,capacityPlanningAccuracy:48,technicianUtilization:64,coordinationScore:5,jobsLostToSchedulingGaps:14,avgLostScheduledJobValue:280,availableTechHours:2200,revenuePerTechHour:72}
  },
  customhome: {
    company:{name:"Craftsman Custom Homes",industry:"Custom Home & Remodel",annualRevenue:2800000,grossMargin:24,employees:18,fieldTechs:14,officeStaff:4,avgJobSize:95000,jobsPerMonth:2,salesCycleDays:60,primaryChannel:"Referrals / Showroom",serviceArea:"Regional"},
    demand:{leadsPerMonth:14,missedCallRate:20,leadResponseMinutes:300,bookingRate:35,noFollowUpRate:32,capacityDeclineRate:12,avgJobValue:95000},
    sales:{estimatesPerMonth:6,quoteCloseRate:28,avgQuotedJobValue:115000,underpricingRate:30,avgUnderpricingPct:14,missedChangeOrders:8,avgMissedChangeOrderValue:12000,scopeCreepFreq:58,scopeCreepImpact:16},
    materials:{monthlyMaterialSpend:145000,wasteRate:11,reBuyRate:7,shrinkageRate:3,overstockRate:8,returnLossPerMonth:8500,shortageJobsPerMonth:3,avgShortageImpact:5500},
    labor:{totalLaborHours:3200,loadedLaborCostPerHour:72,laborOverrunPct:20,reworkRatePct:12,avgReworkHours:8.0,idleWaitHours:240,travelInefficHours:160,delayedJobs:2,avgHoursLostPerDelay:14.0},
    execution:{jobsPerMonth:2,returnVisitRate:10,avgReturnVisitCost:2400,lateJobPct:40,avgDelayedJobCost:14000,incompleteJobRate:6,incompleteJobCost:32000,callbacksPerMonth:2,avgCallbackCost:4800,undocumentedRate:30,revenueLeakagePerUndocumented:3200,safetyComplianceCosts:6500},
    billing:{jobsCompletedPerMonth:2,unbilledWorkPct:12,avgInvoiceValue:95000,invoiceLagDays:38,underbillingPct:7,unapprovedDiscountsPerMonth:8500,unbilledChangeOrders:5,avgUnbilledChangeOrderValue:11000,writeOffsPerMonth:6500},
    retention:{activeCustomers:32,repeatRate:18,churnRate:72,maintenanceAttachRate:3,eligibleForAgreements:22,avgAgreementValue:2800,postJobFollowUpRate:20,reviewRequestRate:15,upsellConversionRate:6,missedUpsellRate:55,avgUpsellValue:65000,avgCLTV:195000,referralCaptureRate:20,missingReferralRate:52,avgReferralJobValue:95000,referralConversionFactor:0.18},
    forecasting:{forecastAccuracy:40,scheduleUtilization:54,revenueVolatility:5,rescheduledJobs:2,avgRescheduleCost:9500,capacityPlanningAccuracy:36,technicianUtilization:60,coordinationScore:4,jobsLostToSchedulingGaps:1,avgLostScheduledJobValue:95000,availableTechHours:3200,revenuePerTechHour:128}
  },
  construction: {
    company:{name:"Summit Custom Homes",industry:"Custom Home Construction",annualRevenue:8500000,grossMargin:22,employees:32,fieldTechs:24,officeStaff:8,avgJobSize:680000,jobsPerMonth:1,salesCycleDays:90,primaryChannel:"Referrals / Showroom",serviceArea:"Regional"},
    demand:{leadsPerMonth:18,missedCallRate:12,leadResponseMinutes:240,bookingRate:38,noFollowUpRate:28,capacityDeclineRate:15,avgJobValue:680000},
    sales:{estimatesPerMonth:8,quoteCloseRate:32,avgQuotedJobValue:720000,underpricingRate:34,avgUnderpricingPct:16,missedChangeOrders:12,avgMissedChangeOrderValue:18000,scopeCreepFreq:62,scopeCreepImpact:18},
    materials:{monthlyMaterialSpend:420000,wasteRate:12,reBuyRate:8,shrinkageRate:4,overstockRate:9,returnLossPerMonth:12000,shortageJobsPerMonth:4,avgShortageImpact:8500},
    labor:{totalLaborHours:4800,loadedLaborCostPerHour:78,laborOverrunPct:22,reworkRatePct:14,avgReworkHours:12.0,idleWaitHours:320,travelInefficHours:180,delayedJobs:3,avgHoursLostPerDelay:16.0},
    execution:{jobsPerMonth:1,returnVisitRate:8,avgReturnVisitCost:2800,lateJobPct:42,avgDelayedJobCost:18000,incompleteJobRate:8,incompleteJobCost:45000,callbacksPerMonth:2,avgCallbackCost:6500,undocumentedRate:28,revenueLeakagePerUndocumented:4200,safetyComplianceCosts:8500},
    billing:{jobsCompletedPerMonth:1,unbilledWorkPct:12,avgInvoiceValue:680000,invoiceLagDays:45,underbillingPct:8,unapprovedDiscountsPerMonth:12000,unbilledChangeOrders:6,avgUnbilledChangeOrderValue:14000,writeOffsPerMonth:8500},
    retention:{activeCustomers:48,repeatRate:22,churnRate:28,maintenanceAttachRate:4,eligibleForAgreements:32,avgAgreementValue:3600,postJobFollowUpRate:24,reviewRequestRate:18,upsellConversionRate:8,missedUpsellRate:52,avgUpsellValue:85000,avgCLTV:280000,referralCaptureRate:22,missingReferralRate:48,avgReferralJobValue:680000,referralConversionFactor:0.2},
    forecasting:{forecastAccuracy:42,scheduleUtilization:52,revenueVolatility:5,rescheduledJobs:2,avgRescheduleCost:12000,capacityPlanningAccuracy:38,technicianUtilization:58,coordinationScore:4,jobsLostToSchedulingGaps:1,avgLostScheduledJobValue:680000,availableTechHours:4800,revenuePerTechHour:145}
  }
};

function fmt(n){if(!n)return"$0";return"$"+Math.round(n).toLocaleString()}
function fmtK(n){return n>=1000000?"$"+(n/1000000).toFixed(2)+"M":"$"+Math.round(n/1000).toLocaleString()+"K"}
function fmtPct(n){return(Math.round(n*10)/10)+"%"}

function calcDemand(d){
  const missed=d.leadsPerMonth*(d.missedCallRate/100);
  const unworked=d.leadsPerMonth*(d.noFollowUpRate/100);
  const declined=d.leadsPerMonth*(d.capacityDeclineRate/100);
  const leakage=(missed+unworked+declined)*(d.bookingRate/100)*d.avgJobValue;
  const score=Math.max(0,100-(d.missedCallRate*2+d.noFollowUpRate*1.5+d.capacityDeclineRate));
  return{leakage,score,missed,unworked,declined,drivers:["Missed calls: "+fmt(missed*(d.bookingRate/100)*d.avgJobValue),"Unworked leads: "+fmt(unworked*(d.bookingRate/100)*d.avgJobValue),"Capacity declines: "+fmt(declined*(d.bookingRate/100)*d.avgJobValue)]};
}
function calcSales(s){
  const closed=s.estimatesPerMonth*(s.quoteCloseRate/100);
  const underpricingLoss=closed*s.avgQuotedJobValue*(s.underpricingRate/100)*(s.avgUnderpricingPct/100);
  const changeOrderLoss=s.missedChangeOrders*s.avgMissedChangeOrderValue;
  const scopeCreepLoss=closed*s.avgQuotedJobValue*(s.scopeCreepFreq/100)*(s.scopeCreepImpact/100);
  const leakage=underpricingLoss+changeOrderLoss+scopeCreepLoss;
  const score=Math.max(0,100-(s.underpricingRate*1.5+(100-s.quoteCloseRate)*0.5+s.scopeCreepFreq*0.5));
  return{leakage,score,underpricingLoss,changeOrderLoss,scopeCreepLoss,drivers:["Underpricing: "+fmt(underpricingLoss),"Missed COs: "+fmt(changeOrderLoss),"Scope creep: "+fmt(scopeCreepLoss)]};
}
function calcMaterials(m){
  const wasteLoss=m.monthlyMaterialSpend*(m.wasteRate/100);
  const reBuyLoss=m.monthlyMaterialSpend*(m.reBuyRate/100);
  const shrinkageLoss=m.monthlyMaterialSpend*(m.shrinkageRate/100);
  const overstockLoss=m.monthlyMaterialSpend*(m.overstockRate/100);
  const shortageImpact=m.shortageJobsPerMonth*m.avgShortageImpact;
  const leakage=wasteLoss+reBuyLoss+shrinkageLoss+overstockLoss+m.returnLossPerMonth+shortageImpact;
  const score=Math.max(0,100-(m.wasteRate+m.reBuyRate+m.shrinkageRate+m.overstockRate)*5);
  return{leakage,score,wasteLoss,reBuyLoss,shrinkageLoss,overstockLoss,shortageImpact,drivers:["Waste: "+fmt(wasteLoss),"Re-buys: "+fmt(reBuyLoss),"Shrinkage: "+fmt(shrinkageLoss)]};
}
function calcLabor(l){
  const overrunLoss=l.totalLaborHours*(l.laborOverrunPct/100)*l.loadedLaborCostPerHour;
  const reworkLoss=(l.totalLaborHours/8)*(l.reworkRatePct/100)*l.avgReworkHours*l.loadedLaborCostPerHour;
  const idleLoss=l.idleWaitHours*l.loadedLaborCostPerHour;
  const travelLoss=l.travelInefficHours*l.loadedLaborCostPerHour;
  const delayLoss=l.delayedJobs*l.avgHoursLostPerDelay*l.loadedLaborCostPerHour;
  const leakage=overrunLoss+reworkLoss+idleLoss+travelLoss+delayLoss;
  const recovHours=Math.round((l.idleWaitHours+l.travelInefficHours+l.delayedJobs*l.avgHoursLostPerDelay)*0.6);
  const score=Math.max(0,100-(l.laborOverrunPct*2+l.reworkRatePct*2+(l.idleWaitHours/Math.max(l.totalLaborHours,1))*100));
  return{leakage,score,overrunLoss,reworkLoss,idleLoss,travelLoss,delayLoss,recovHours,extraJobs:Math.round(recovHours/6),drivers:["Overruns: "+fmt(overrunLoss),"Rework: "+fmt(reworkLoss),"Idle/travel: "+fmt(idleLoss+travelLoss)]};
}
function calcExecution(e){
  const rvLoss=e.jobsPerMonth*(e.returnVisitRate/100)*e.avgReturnVisitCost;
  const delayLoss=e.jobsPerMonth*(e.lateJobPct/100)*e.avgDelayedJobCost;
  const incompleteLoss=e.jobsPerMonth*(e.incompleteJobRate/100)*e.incompleteJobCost;
  const callbackLoss=e.callbacksPerMonth*e.avgCallbackCost;
  const docLoss=e.jobsPerMonth*(e.undocumentedRate/100)*e.revenueLeakagePerUndocumented;
  const leakage=rvLoss+delayLoss+incompleteLoss+callbackLoss+docLoss+e.safetyComplianceCosts;
  const score=Math.max(0,100-(e.returnVisitRate*2+e.lateJobPct+e.incompleteJobRate*2+e.undocumentedRate));
  return{leakage,score,rvLoss,delayLoss,incompleteLoss,callbackLoss,docLoss,drivers:["Return visits: "+fmt(rvLoss),"Callbacks: "+fmt(callbackLoss),"Undocumented: "+fmt(docLoss)]};
}
function calcBilling(b){
  const uninvoicedLoss=b.jobsCompletedPerMonth*(b.unbilledWorkPct/100)*b.avgInvoiceValue;
  const underbillingLoss=b.jobsCompletedPerMonth*b.avgInvoiceValue*(b.underbillingPct/100);
  const coLoss=b.unbilledChangeOrders*b.avgUnbilledChangeOrderValue;
  const leakage=uninvoicedLoss+underbillingLoss+b.unapprovedDiscountsPerMonth+coLoss+b.writeOffsPerMonth;
  const score=Math.max(0,100-(b.unbilledWorkPct*3+b.underbillingPct*2+(b.invoiceLagDays/30)*10));
  return{leakage,score,uninvoicedLoss,underbillingLoss,coLoss,drivers:["Uninvoiced: "+fmt(uninvoicedLoss),"Underbilling: "+fmt(underbillingLoss),"Discounts/write-offs: "+fmt(b.unapprovedDiscountsPerMonth+b.writeOffsPerMonth)]};
}
function calcRetention(r){
  const churnLoss=r.activeCustomers*(r.churnRate/100)*r.avgCLTV/12;
  const agreementLoss=r.eligibleForAgreements*Math.max(0,1-r.maintenanceAttachRate/100)*r.avgAgreementValue/12;
  const upsellLoss=r.activeCustomers*(r.missedUpsellRate/100)*r.avgUpsellValue/12;
  const referralLoss=r.activeCustomers*(r.missingReferralRate/100)*r.avgReferralJobValue*r.referralConversionFactor/12;
  const leakage=churnLoss+agreementLoss+upsellLoss+referralLoss;
  const score=Math.max(0,100-(r.churnRate*2+(100-r.maintenanceAttachRate)*0.5+r.missedUpsellRate));
  return{leakage,score,churnLoss,agreementLoss,upsellLoss,referralLoss,drivers:["Churn: "+fmt(churnLoss),"Missing agreements: "+fmt(agreementLoss),"Missed upsells: "+fmt(upsellLoss)]};
}
function calcForecasting(f){
  const gapLoss=f.jobsLostToSchedulingGaps*f.avgLostScheduledJobValue;
  const utilLoss=f.availableTechHours*Math.max(0,(100-f.technicianUtilization)/100)*f.revenuePerTechHour;
  const reschLoss=f.rescheduledJobs*f.avgRescheduleCost;
  const leakage=gapLoss+utilLoss+reschLoss;
  const score=Math.max(0,(f.forecastAccuracy+f.technicianUtilization+f.scheduleUtilization)/3);
  return{leakage,score,gapLoss,utilLoss,reschLoss,drivers:["Scheduling gaps: "+fmt(gapLoss),"Underutilization: "+fmt(utilLoss),"Rescheduling: "+fmt(reschLoss)]};
}
function getSeverity(s){
  if(s>=85)return{label:"Healthy",color:"#22C55E",bg:"#052E16"};
  if(s>=70)return{label:"Needs Attention",color:"#EAB308",bg:"#1C1400"};
  if(s>=50)return{label:"Significant Leakage",color:"#F97316",bg:"#1C0A00"};
  return{label:"Critical",color:"#EF4444",bg:"#1C0000"};
}
function getRecs(cat){
  const map={
    demand:["Implement 24/7 answering or chatbot to capture missed calls","Set 15-min lead response SLA with auto-text on missed calls","Build CRM follow-up sequence for all unconverted leads","Use dispatch software to optimize capacity and reduce declines"],
    sales:["Conduct quarterly pricing reviews benchmarked to market rates","Train techs on real-time change order documentation","Use digital estimate tools with built-in scope documentation","Review all T&M jobs for uncaptured scope creep monthly"],
    materials:["Implement job-specific material kitting to reduce waste","Install locked storage and cycle count to control shrinkage","Review slow-moving inventory monthly and liquidate","Require pre-job material verification to eliminate shortages"],
    labor:["Use GPS dispatch and route optimization to cut travel time","Track labor hours per job against estimate in real time","Create rework log and root cause review process","Schedule preventive maintenance to reduce idle time"],
    execution:["Build digital return visit tracking and root cause analysis","Require photo documentation for every completed job","Create callback reduction program with tech accountability","Use job completion checklists to eliminate incomplete jobs"],
    billing:["Invoice same day as job completion using mobile invoicing","Audit all invoices monthly for underbilling and missing COs","Eliminate unauthorized discounts — require manager approval","Set collections policy: 30-day follow-up, 60-day escalation"],
    retention:["Launch service agreement program with field tech training","Automate post-job follow-up texts and review requests","Create upsell training for techs with commission incentive","Build referral program with customer incentives and tracking"],
    forecasting:["Implement scheduling software with real-time tech visibility","Create weekly capacity planning meeting with dispatch","Track forecast vs actual monthly and adjust inputs","Set utilization targets with daily dispatch accountability"]
  };
  return map[cat]||[];
}

function InputField({label,value,onChange,type="number",min=0,max,step=1,prefix,suffix,bv,onAvg}){
  const isAvg=bv!==undefined&&Math.abs(value-bv)<0.01;
  const showHint=bv!==undefined&&!isAvg;
  return(
    <div style={{marginBottom:12}}>
      <label style={{display:"flex",alignItems:"center",fontSize:11,fontWeight:500,color:"#686868",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>
        {label}
        {isAvg&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:10,background:"#1A1A1A",color:"#F97316",border:"1px solid #F9731640",fontWeight:600,marginLeft:6}}>BENCHMARK</span>}
      </label>
      <div style={{display:"flex",alignItems:"center",background:"#111111",border:"1px solid "+(isAvg?"#F9731630":"#1E1E1E"),borderRadius:8,overflow:"hidden"}}>
        {prefix&&<span style={{padding:"0 10px",color:"#484848",fontSize:13,borderRight:"1px solid #1E1E1E"}}>{prefix}</span>}
        <input type={type} value={value} min={min} max={max} step={step}
          onChange={e=>onChange(type==="number"?parseFloat(e.target.value)||0:e.target.value)}
          style={{flex:1,background:"transparent",border:"none",outline:"none",padding:"8px 10px",color:"#E8E8E8",fontSize:13,fontFamily:"'DM Mono',monospace"}}/>
        {suffix&&<span style={{padding:"0 10px",color:"#484848",fontSize:13,borderLeft:"1px solid #1E1E1E"}}>{suffix}</span>}
        {showHint&&onAvg&&<button onClick={onAvg} style={{padding:"0 10px",background:"#1A1A1A",border:"none",borderLeft:"1px solid #1E1E1E",color:"#F97316",fontSize:10,cursor:"pointer",height:"100%",whiteSpace:"nowrap",fontWeight:600,fontFamily:"inherit"}}>use avg</button>}
      </div>
      {showHint&&<div style={{fontSize:10,color:"#383838",marginTop:3}}>Industry avg: <span style={{color:"#F97316"}}>{bv}{suffix||""}</span></div>}
    </div>
  );
}

function SecHead({icon,title,leakage,score}){
  const sev=getSeverity(score);
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,paddingBottom:16,borderBottom:"1px solid #1E1E1E"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:20}}>{icon}</span>
        <span style={{fontSize:16,fontWeight:600,color:"#F0F0F0"}}>{title}</span>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <span style={{fontSize:13,fontWeight:600,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmt(leakage)}<span style={{color:"#484848",fontWeight:400}}>/mo</span></span>
        <span style={{fontSize:11,padding:"3px 8px",borderRadius:20,background:sev.bg,color:sev.color,border:"1px solid "+sev.color+"40",fontWeight:600}}>{sev.label}</span>
      </div>
    </div>
  );
}

function BmStrip({bm,fields}){
  const avail=fields.filter(f=>f.k in bm);
  if(!avail.length)return null;
  return(
    <div style={{marginBottom:16,padding:"10px 14px",background:"#141414",border:"1px solid #F9731620",borderRadius:8}}>
      <div style={{fontSize:10,color:"#F97316",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,fontWeight:600}}>Industry Benchmarks</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:16}}>
        {avail.map(f=><div key={f.k} style={{fontSize:11}}><span style={{color:"#484848"}}>{f.label}: </span><span style={{color:"#F97316",fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{bm[f.k]}{f.sfx||""}</span></div>)}
      </div>
    </div>
  );
}

function Breakdown({items}){
  const total=items.reduce((s,i)=>s+i.v,0);
  return(
    <div style={{marginTop:16,padding:12,background:"#111111",borderRadius:8,border:"1px solid #1E1E1E"}}>
      <div style={{fontSize:11,color:"#484848",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Leakage Breakdown</div>
      {items.map(item=>(
        <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
            <span style={{fontSize:12,color:"#A0A0A0",minWidth:120}}>{item.label}</span>
            <div style={{flex:1,height:4,background:"#1E1E1E",borderRadius:4,overflow:"hidden"}}>
              <div style={{width:total>0?(item.v/total*100)+"%":"0%",height:"100%",background:"#F97316",borderRadius:4}}/>
            </div>
          </div>
          <span style={{fontSize:12,fontWeight:600,color:"#F97316",marginLeft:12,minWidth:80,textAlign:"right",fontFamily:"'DM Mono',monospace"}}>{fmt(item.v)}</span>
        </div>
      ))}
    </div>
  );
}

function DemandPanel({data,onChange,bm}){
  const res=calcDemand(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="📡" title="Demand Conversion" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"missedCallRate",label:"Missed calls",sfx:"%"},{k:"bookingRate",label:"Booking rate",sfx:"%"},{k:"noFollowUpRate",label:"No follow-up",sfx:"%"},{k:"leadResponseMinutes",label:"Response time",sfx:" min"}]}/>
    <div className="ra-2col">
      <InputField label="Leads Per Month" value={data.leadsPerMonth} onChange={v=>u("leadsPerMonth",v)}/>
      <InputField label="Missed Call Rate" value={data.missedCallRate} onChange={v=>u("missedCallRate",v)} suffix="%" max={100} bv={bm.missedCallRate} onAvg={()=>u("missedCallRate",bm.missedCallRate)}/>
      <InputField label="Lead Response Time" value={data.leadResponseMinutes} onChange={v=>u("leadResponseMinutes",v)} suffix="min" bv={bm.leadResponseMinutes} onAvg={()=>u("leadResponseMinutes",bm.leadResponseMinutes)}/>
      <InputField label="Booking Rate" value={data.bookingRate} onChange={v=>u("bookingRate",v)} suffix="%" max={100} bv={bm.bookingRate} onAvg={()=>u("bookingRate",bm.bookingRate)}/>
      <InputField label="No Follow-Up Rate" value={data.noFollowUpRate} onChange={v=>u("noFollowUpRate",v)} suffix="%" max={100} bv={bm.noFollowUpRate} onAvg={()=>u("noFollowUpRate",bm.noFollowUpRate)}/>
      <InputField label="Capacity Decline Rate" value={data.capacityDeclineRate} onChange={v=>u("capacityDeclineRate",v)} suffix="%" max={100} bv={bm.capacityDeclineRate} onAvg={()=>u("capacityDeclineRate",bm.capacityDeclineRate)}/>
      <InputField label="Avg Job Value" value={data.avgJobValue} onChange={v=>u("avgJobValue",v)} prefix="$"/>
    </div>
    <Breakdown items={[{label:"Missed Calls",v:res.missed*(data.bookingRate/100)*data.avgJobValue},{label:"Unworked Leads",v:res.unworked*(data.bookingRate/100)*data.avgJobValue},{label:"Capacity Declines",v:res.declined*(data.bookingRate/100)*data.avgJobValue}]}/>
  </div>);
}

function SalesPanel({data,onChange,bm}){
  const res=calcSales(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="📋" title="Sales / Estimating" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"quoteCloseRate",label:"Close rate",sfx:"%"},{k:"underpricingRate",label:"Underpricing",sfx:"%"},{k:"scopeCreepFreq",label:"Scope creep",sfx:"%"}]}/>
    <div className="ra-2col">
      <InputField label="Estimates Per Month" value={data.estimatesPerMonth} onChange={v=>u("estimatesPerMonth",v)}/>
      <InputField label="Quote-to-Close Rate" value={data.quoteCloseRate} onChange={v=>u("quoteCloseRate",v)} suffix="%" max={100} bv={bm.quoteCloseRate} onAvg={()=>u("quoteCloseRate",bm.quoteCloseRate)}/>
      <InputField label="Avg Quoted Job Value" value={data.avgQuotedJobValue} onChange={v=>u("avgQuotedJobValue",v)} prefix="$"/>
      <InputField label="Underpricing Rate" value={data.underpricingRate} onChange={v=>u("underpricingRate",v)} suffix="%" max={100} bv={bm.underpricingRate} onAvg={()=>u("underpricingRate",bm.underpricingRate)}/>
      <InputField label="Avg Underpricing %" value={data.avgUnderpricingPct} onChange={v=>u("avgUnderpricingPct",v)} suffix="%" max={100} bv={bm.avgUnderpricingPct} onAvg={()=>u("avgUnderpricingPct",bm.avgUnderpricingPct)}/>
      <InputField label="Missed Change Orders/mo" value={data.missedChangeOrders} onChange={v=>u("missedChangeOrders",v)}/>
      <InputField label="Avg Missed CO Value" value={data.avgMissedChangeOrderValue} onChange={v=>u("avgMissedChangeOrderValue",v)} prefix="$"/>
      <InputField label="Scope Creep Frequency" value={data.scopeCreepFreq} onChange={v=>u("scopeCreepFreq",v)} suffix="%" max={100} bv={bm.scopeCreepFreq} onAvg={()=>u("scopeCreepFreq",bm.scopeCreepFreq)}/>
      <InputField label="Scope Creep Impact" value={data.scopeCreepImpact} onChange={v=>u("scopeCreepImpact",v)} suffix="%" max={100} bv={bm.scopeCreepImpact} onAvg={()=>u("scopeCreepImpact",bm.scopeCreepImpact)}/>
    </div>
    <Breakdown items={[{label:"Underpricing",v:res.underpricingLoss},{label:"Missed COs",v:res.changeOrderLoss},{label:"Scope Creep",v:res.scopeCreepLoss}]}/>
  </div>);
}

function MaterialsPanel({data,onChange,bm}){
  const res=calcMaterials(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="🏗️" title="Material Waste & Shrinkage" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"wasteRate",label:"Waste",sfx:"%"},{k:"reBuyRate",label:"Re-buy",sfx:"%"},{k:"shrinkageRate",label:"Shrinkage",sfx:"%"},{k:"overstockRate",label:"Overstock",sfx:"%"}]}/>
    <div className="ra-2col">
      <InputField label="Monthly Material Spend" value={data.monthlyMaterialSpend} onChange={v=>u("monthlyMaterialSpend",v)} prefix="$"/>
      <InputField label="Waste Rate" value={data.wasteRate} onChange={v=>u("wasteRate",v)} suffix="%" max={100} bv={bm.wasteRate} onAvg={()=>u("wasteRate",bm.wasteRate)}/>
      <InputField label="Re-Buy Rate" value={data.reBuyRate} onChange={v=>u("reBuyRate",v)} suffix="%" max={100} bv={bm.reBuyRate} onAvg={()=>u("reBuyRate",bm.reBuyRate)}/>
      <InputField label="Shrinkage Rate" value={data.shrinkageRate} onChange={v=>u("shrinkageRate",v)} suffix="%" max={100} bv={bm.shrinkageRate} onAvg={()=>u("shrinkageRate",bm.shrinkageRate)}/>
      <InputField label="Overstock Rate" value={data.overstockRate} onChange={v=>u("overstockRate",v)} suffix="%" max={100} bv={bm.overstockRate} onAvg={()=>u("overstockRate",bm.overstockRate)}/>
      <InputField label="Return/Restocking Losses" value={data.returnLossPerMonth} onChange={v=>u("returnLossPerMonth",v)} prefix="$"/>
      <InputField label="Shortage Jobs/mo" value={data.shortageJobsPerMonth} onChange={v=>u("shortageJobsPerMonth",v)}/>
      <InputField label="Avg Cost Per Shortage" value={data.avgShortageImpact} onChange={v=>u("avgShortageImpact",v)} prefix="$"/>
    </div>
    <Breakdown items={[{label:"Waste",v:res.wasteLoss},{label:"Re-Buys",v:res.reBuyLoss},{label:"Shrinkage",v:res.shrinkageLoss},{label:"Overstock",v:res.overstockLoss},{label:"Shortages",v:res.shortageImpact}]}/>
  </div>);
}

function LaborPanel({data,onChange,bm,avgJobSize}){
  const res=calcLabor(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="⚒️" title="Labor Efficiency" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"laborOverrunPct",label:"Overrun",sfx:"%"},{k:"reworkRatePct",label:"Rework",sfx:"%"},{k:"technicianUtilization",label:"Utilization",sfx:"%"}]}/>
    <div className="ra-2col">
      <InputField label="Total Labor Hours/mo" value={data.totalLaborHours} onChange={v=>u("totalLaborHours",v)}/>
      <InputField label="Loaded Labor Cost/Hr" value={data.loadedLaborCostPerHour} onChange={v=>u("loadedLaborCostPerHour",v)} prefix="$"/>
      <InputField label="Labor Overrun %" value={data.laborOverrunPct} onChange={v=>u("laborOverrunPct",v)} suffix="%" max={100} bv={bm.laborOverrunPct} onAvg={()=>u("laborOverrunPct",bm.laborOverrunPct)}/>
      <InputField label="Rework Rate %" value={data.reworkRatePct} onChange={v=>u("reworkRatePct",v)} suffix="%" max={100} bv={bm.reworkRatePct} onAvg={()=>u("reworkRatePct",bm.reworkRatePct)}/>
      <InputField label="Avg Rework Hours" value={data.avgReworkHours} onChange={v=>u("avgReworkHours",v)} step={0.5}/>
      <InputField label="Idle/Wait Hours/mo" value={data.idleWaitHours} onChange={v=>u("idleWaitHours",v)}/>
      <InputField label="Travel Inefficiency Hours" value={data.travelInefficHours} onChange={v=>u("travelInefficHours",v)}/>
      <InputField label="Jobs Delayed/mo" value={data.delayedJobs} onChange={v=>u("delayedJobs",v)}/>
      <InputField label="Avg Hours Lost/Delay" value={data.avgHoursLostPerDelay} onChange={v=>u("avgHoursLostPerDelay",v)} step={0.5}/>
    </div>
    <div style={{margin:"16px 0",padding:14,background:"#141414",border:"1px solid #F97316",borderRadius:8,display:"flex",gap:24,flexWrap:"wrap"}}>
      <div><div style={{fontSize:11,color:"#A0A0A0",textTransform:"uppercase"}}>Recoverable Hours</div><div style={{fontSize:18,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{res.recovHours} hrs</div></div>
      <div><div style={{fontSize:11,color:"#A0A0A0",textTransform:"uppercase"}}>Extra Jobs Possible</div><div style={{fontSize:18,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>+{res.extraJobs} jobs</div></div>
      <div><div style={{fontSize:11,color:"#A0A0A0",textTransform:"uppercase"}}>Revenue Upside/mo</div><div style={{fontSize:18,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmtK(res.extraJobs*(avgJobSize||2000))}</div></div>
    </div>
    <Breakdown items={[{label:"Overruns",v:res.overrunLoss},{label:"Rework",v:res.reworkLoss},{label:"Idle Time",v:res.idleLoss},{label:"Travel",v:res.travelLoss},{label:"Delays",v:res.delayLoss}]}/>
  </div>);
}

function ExecutionPanel({data,onChange,bm}){
  const res=calcExecution(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="🔧" title="Job Execution" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"returnVisitRate",label:"Return visits",sfx:"%"},{k:"lateJobPct",label:"Late jobs",sfx:"%"},{k:"undocumentedRate",label:"Undocumented",sfx:"%"}]}/>
    <div className="ra-2col">
      <InputField label="Jobs Per Month" value={data.jobsPerMonth} onChange={v=>u("jobsPerMonth",v)}/>
      <InputField label="Return Visit Rate" value={data.returnVisitRate} onChange={v=>u("returnVisitRate",v)} suffix="%" max={100} bv={bm.returnVisitRate} onAvg={()=>u("returnVisitRate",bm.returnVisitRate)}/>
      <InputField label="Avg Return Visit Cost" value={data.avgReturnVisitCost} onChange={v=>u("avgReturnVisitCost",v)} prefix="$"/>
      <InputField label="Jobs Completed Late %" value={data.lateJobPct} onChange={v=>u("lateJobPct",v)} suffix="%" max={100} bv={bm.lateJobPct} onAvg={()=>u("lateJobPct",bm.lateJobPct)}/>
      <InputField label="Avg Delay Cost/Job" value={data.avgDelayedJobCost} onChange={v=>u("avgDelayedJobCost",v)} prefix="$"/>
      <InputField label="Incomplete Job Rate" value={data.incompleteJobRate} onChange={v=>u("incompleteJobRate",v)} suffix="%" max={100} bv={bm.incompleteJobRate} onAvg={()=>u("incompleteJobRate",bm.incompleteJobRate)}/>
      <InputField label="Incomplete Job Cost" value={data.incompleteJobCost} onChange={v=>u("incompleteJobCost",v)} prefix="$"/>
      <InputField label="Callbacks Per Month" value={data.callbacksPerMonth} onChange={v=>u("callbacksPerMonth",v)}/>
      <InputField label="Avg Callback Cost" value={data.avgCallbackCost} onChange={v=>u("avgCallbackCost",v)} prefix="$"/>
      <InputField label="Undocumented Work Rate" value={data.undocumentedRate} onChange={v=>u("undocumentedRate",v)} suffix="%" max={100} bv={bm.undocumentedRate} onAvg={()=>u("undocumentedRate",bm.undocumentedRate)}/>
      <InputField label="Leakage/Undocumented Event" value={data.revenueLeakagePerUndocumented} onChange={v=>u("revenueLeakagePerUndocumented",v)} prefix="$"/>
      <InputField label="Safety/Compliance Costs/mo" value={data.safetyComplianceCosts} onChange={v=>u("safetyComplianceCosts",v)} prefix="$"/>
    </div>
    <Breakdown items={[{label:"Return Visits",v:res.rvLoss},{label:"Delays",v:res.delayLoss},{label:"Incomplete Jobs",v:res.incompleteLoss},{label:"Callbacks",v:res.callbackLoss},{label:"Undocumented",v:res.docLoss}]}/>
  </div>);
}

function BillingPanel({data,onChange,bm}){
  const res=calcBilling(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="💰" title="Billing / Revenue Capture" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"unbilledWorkPct",label:"Unbilled work",sfx:"%"},{k:"underbillingPct",label:"Underbilling",sfx:"%"},{k:"invoiceLagDays",label:"Invoice lag",sfx:" days"}]}/>
    <div className="ra-2col">
      <InputField label="Jobs Completed/mo" value={data.jobsCompletedPerMonth} onChange={v=>u("jobsCompletedPerMonth",v)}/>
      <InputField label="Work Not Invoiced %" value={data.unbilledWorkPct} onChange={v=>u("unbilledWorkPct",v)} suffix="%" max={100} bv={bm.unbilledWorkPct} onAvg={()=>u("unbilledWorkPct",bm.unbilledWorkPct)}/>
      <InputField label="Avg Invoice Value" value={data.avgInvoiceValue} onChange={v=>u("avgInvoiceValue",v)} prefix="$"/>
      <InputField label="Avg Invoice Lag" value={data.invoiceLagDays} onChange={v=>u("invoiceLagDays",v)} suffix="days" bv={bm.invoiceLagDays} onAvg={()=>u("invoiceLagDays",bm.invoiceLagDays)}/>
      <InputField label="Underbilling Rate" value={data.underbillingPct} onChange={v=>u("underbillingPct",v)} suffix="%" max={100} bv={bm.underbillingPct} onAvg={()=>u("underbillingPct",bm.underbillingPct)}/>
      <InputField label="Unapproved Discounts/mo" value={data.unapprovedDiscountsPerMonth} onChange={v=>u("unapprovedDiscountsPerMonth",v)} prefix="$"/>
      <InputField label="Unbilled Change Orders/mo" value={data.unbilledChangeOrders} onChange={v=>u("unbilledChangeOrders",v)}/>
      <InputField label="Avg Unbilled CO Value" value={data.avgUnbilledChangeOrderValue} onChange={v=>u("avgUnbilledChangeOrderValue",v)} prefix="$"/>
      <InputField label="Write-offs/Bad Debt/mo" value={data.writeOffsPerMonth} onChange={v=>u("writeOffsPerMonth",v)} prefix="$"/>
    </div>
    <Breakdown items={[{label:"Uninvoiced Work",v:res.uninvoicedLoss},{label:"Underbilling",v:res.underbillingLoss},{label:"Unbilled COs",v:res.coLoss}]}/>
  </div>);
}

function RetentionPanel({data,onChange,bm}){
  const res=calcRetention(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="🔄" title="Retention / Repeat Revenue" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"churnRate",label:"Churn",sfx:"%"},{k:"maintenanceAttachRate",label:"Agreement attach",sfx:"%"},{k:"missedUpsellRate",label:"Missed upsells",sfx:"%"},{k:"missingReferralRate",label:"Missing referrals",sfx:"%"}]}/>
    <div className="ra-2col">
      <InputField label="Active Customers" value={data.activeCustomers} onChange={v=>u("activeCustomers",v)}/>
      <InputField label="Customer Churn Rate" value={data.churnRate} onChange={v=>u("churnRate",v)} suffix="%" max={100} bv={bm.churnRate} onAvg={()=>u("churnRate",bm.churnRate)}/>
      <InputField label="Maintenance Attach Rate" value={data.maintenanceAttachRate} onChange={v=>u("maintenanceAttachRate",v)} suffix="%" max={100} bv={bm.maintenanceAttachRate} onAvg={()=>u("maintenanceAttachRate",bm.maintenanceAttachRate)}/>
      <InputField label="Eligible for Agreements" value={data.eligibleForAgreements} onChange={v=>u("eligibleForAgreements",v)}/>
      <InputField label="Avg Agreement Value" value={data.avgAgreementValue} onChange={v=>u("avgAgreementValue",v)} prefix="$"/>
      <InputField label="Missed Upsell Rate" value={data.missedUpsellRate} onChange={v=>u("missedUpsellRate",v)} suffix="%" max={100} bv={bm.missedUpsellRate} onAvg={()=>u("missedUpsellRate",bm.missedUpsellRate)}/>
      <InputField label="Avg Upsell Value" value={data.avgUpsellValue} onChange={v=>u("avgUpsellValue",v)} prefix="$"/>
      <InputField label="Avg Customer LTV" value={data.avgCLTV} onChange={v=>u("avgCLTV",v)} prefix="$"/>
      <InputField label="Missing Referral Capture %" value={data.missingReferralRate} onChange={v=>u("missingReferralRate",v)} suffix="%" max={100} bv={bm.missingReferralRate} onAvg={()=>u("missingReferralRate",bm.missingReferralRate)}/>
      <InputField label="Avg Referred Job Value" value={data.avgReferralJobValue} onChange={v=>u("avgReferralJobValue",v)} prefix="$"/>
      <InputField label="Referral Conversion Factor" value={data.referralConversionFactor} onChange={v=>u("referralConversionFactor",v)} step={0.05}/>
    </div>
    <Breakdown items={[{label:"Churn Loss",v:res.churnLoss},{label:"Missing Agreements",v:res.agreementLoss},{label:"Upsell Gaps",v:res.upsellLoss},{label:"Lost Referrals",v:res.referralLoss}]}/>
  </div>);
}

function ForecastingPanel({data,onChange,bm}){
  const res=calcForecasting(data);const u=(k,v)=>onChange({...data,[k]:v});
  return(<div><SecHead icon="📊" title="Forecasting / Visibility" leakage={res.leakage} score={res.score}/>
    <BmStrip bm={bm} fields={[{k:"forecastAccuracy",label:"Forecast accuracy",sfx:"%"},{k:"technicianUtilization",label:"Tech utilization",sfx:"%"},{k:"scheduleUtilization",label:"Schedule util",sfx:"%"}]}/>
    <div className="ra-2col">
      <InputField label="Forecast Accuracy" value={data.forecastAccuracy} onChange={v=>u("forecastAccuracy",v)} suffix="%" max={100} bv={bm.forecastAccuracy} onAvg={()=>u("forecastAccuracy",bm.forecastAccuracy)}/>
      <InputField label="Schedule Utilization" value={data.scheduleUtilization} onChange={v=>u("scheduleUtilization",v)} suffix="%" max={100} bv={bm.scheduleUtilization} onAvg={()=>u("scheduleUtilization",bm.scheduleUtilization)}/>
      <InputField label="Rescheduled Jobs/mo" value={data.rescheduledJobs} onChange={v=>u("rescheduledJobs",v)}/>
      <InputField label="Avg Reschedule Cost" value={data.avgRescheduleCost} onChange={v=>u("avgRescheduleCost",v)} prefix="$"/>
      <InputField label="Technician Utilization" value={data.technicianUtilization} onChange={v=>u("technicianUtilization",v)} suffix="%" max={100} bv={bm.technicianUtilization} onAvg={()=>u("technicianUtilization",bm.technicianUtilization)}/>
      <InputField label="Coordination Score (1-10)" value={data.coordinationScore} onChange={v=>u("coordinationScore",v)} min={1} max={10}/>
      <InputField label="Jobs Lost to Sched Gaps" value={data.jobsLostToSchedulingGaps} onChange={v=>u("jobsLostToSchedulingGaps",v)}/>
      <InputField label="Avg Lost Job Value" value={data.avgLostScheduledJobValue} onChange={v=>u("avgLostScheduledJobValue",v)} prefix="$"/>
      <InputField label="Available Tech Hours/mo" value={data.availableTechHours} onChange={v=>u("availableTechHours",v)}/>
      <InputField label="Revenue Per Tech Hour" value={data.revenuePerTechHour} onChange={v=>u("revenuePerTechHour",v)} prefix="$"/>
    </div>
    <Breakdown items={[{label:"Scheduling Gaps",v:res.gapLoss},{label:"Underutilization",v:res.utilLoss},{label:"Rescheduling",v:res.reschLoss}]}/>
  </div>);
}

function ScoreGauge({score}){
  const sev=getSeverity(score);const rot=(score/100)*180-90;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{position:"relative",width:100,height:54,overflow:"hidden"}}>
        <svg viewBox="0 0 120 65" width="100" height="54">
          <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#1E1E1E" strokeWidth="10" strokeLinecap="round"/>
          <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke={sev.color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(score/100)*157} 157`}/>
          <g transform={`translate(60,60) rotate(${rot})`}>
            <line x1="0" y1="0" x2="0" y2="-36" stroke="#E8E8E8" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="0" cy="0" r="4" fill="#E8E8E8"/>
          </g>
        </svg>
      </div>
      <div style={{fontSize:22,fontWeight:700,color:sev.color,marginTop:-4,fontFamily:"'DM Mono',monospace"}}>{Math.round(score)}</div>
      <div style={{fontSize:10,color:sev.color,fontWeight:600}}>{sev.label}</div>
    </div>
  );
}

function RecsPanel({recs}){
  if(!recs||!recs.length)return null;
  return(
    <div style={{marginTop:20,background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:20}}>
      <div style={{fontSize:13,fontWeight:600,color:"#F0F0F0",marginBottom:14}}>Priority Recommendations</div>
      {recs.map((r,i)=>(
        <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
          <span style={{background:"#1C0A00",color:"#F97316",border:"1px solid #F9731640",borderRadius:20,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
          <span style={{fontSize:13,color:"#A0A0A0",lineHeight:1.5}}>{r}</span>
        </div>
      ))}
    </div>
  );
}

const COLORS=["#F97316","#FB923C","#EF4444","#EAB308","#22C55E","#60A5FA","#A855F7","#EC4899"];

const NAV=[
  {key:"company",label:"Company Profile",icon:"🏢"},
  {key:"demand",label:"Demand",icon:"📡"},
  {key:"sales",label:"Sales",icon:"📋"},
  {key:"materials",label:"Materials",icon:"🏗️"},
  {key:"labor",label:"Labor",icon:"⚒️"},
  {key:"execution",label:"Execution",icon:"🔧"},
  {key:"billing",label:"Billing",icon:"💰"},
  {key:"retention",label:"Retention",icon:"🔄"},
  {key:"forecasting",label:"Forecasting",icon:"📊"},
  {key:"results",label:"RevAudit Report",icon:"🎯"},
];

const PRESET_BTNS=[
  {key:"electrical",label:"⚡ Electrical"},
  {key:"hvac",label:"❄️ HVAC"},
  {key:"plumbing",label:"🔧 Plumbing"},
  {key:"advertising",label:"📣 Ad Agency"},
  {key:"retail",label:"🛒 Retail"},
  {key:"healthcare",label:"🏥 Healthcare"},
  {key:"customhome",label:"🏠 Custom Home"},
];

const PRESET_LABEL_MAP={electrical:"⚡ Electrical",hvac:"❄️ HVAC",plumbing:"🔧 Plumbing",advertising:"📣 Ad Agency",retail:"🛒 Retail",healthcare:"🏥 Healthcare",customhome:"🏠 Custom Home / Remodel"};

// Web scan kept in background (hidden from UI)
function WebScanPanel({onApply}){
  return <div/>;
}

function HomeScreen({onSelect}){
  const presets=[
    {key:"electrical",label:"Electrical",icon:"⚡",desc:"Residential & commercial electrical contractors"},
    {key:"hvac",label:"HVAC",icon:"❄️",desc:"Heating, cooling & ventilation companies"},
    {key:"plumbing",label:"Plumbing",icon:"🔧",desc:"Residential & commercial plumbing services"},
    {key:"advertising",label:"Ad Agency",icon:"📣",desc:"Marketing, advertising & creative agencies"},
    {key:"retail",label:"Retail",icon:"🛒",desc:"Product-based retail & e-commerce"},
    {key:"healthcare",label:"Healthcare Services",icon:"🏥",desc:"Medical, dental & wellness practices"},
    {key:"customhome",label:"Custom Home / Remodel",icon:"🏠",desc:"Custom builders & remodeling contractors"},
  ];
  return(
    <div style={{maxWidth:820,paddingBottom:80}}>
      <div style={{marginBottom:52}}>
        <div style={{fontSize:11,color:"#383838",textTransform:"uppercase",letterSpacing:"0.14em",marginBottom:14,fontWeight:500}}>KUHARSKI CAPITAL</div>
        <h1 style={{fontSize:38,fontWeight:700,color:"#F0F0F0",margin:0,letterSpacing:"-0.02em",lineHeight:1.1}}>RevAudit™</h1>
        <p style={{fontSize:15,color:"#686868",marginTop:14,lineHeight:1.6,maxWidth:500}}>Select your industry to begin the revenue diagnostic. We'll pre-fill industry benchmarks and guide you through each category.</p>
      </div>
      <div className="ra-preset-grid">
        {presets.map(({key,label,icon,desc})=>(
          <button key={key} className="ra-preset-card" onClick={()=>onSelect(key)}>
            <div style={{fontSize:30,marginBottom:16,lineHeight:1}}>{icon}</div>
            <div style={{fontSize:14,fontWeight:600,color:"#F0F0F0",marginBottom:8,letterSpacing:"-0.01em"}}>{label}</div>
            <div style={{fontSize:12,color:"#686868",lineHeight:1.5}}>{desc}</div>
            <div style={{marginTop:18,fontSize:11,color:"#F97316",fontWeight:500}}>Start audit →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RevAudit(){
  const[section,setSection]=useState("home");
  const[preset,setPreset]=useState("electrical");
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[company,setCompany]=useState(PRESETS.electrical.company);
  const[demand,setDemand]=useState(PRESETS.electrical.demand);
  const[sales,setSales]=useState(PRESETS.electrical.sales);
  const[materials,setMaterials]=useState(PRESETS.electrical.materials);
  const[labor,setLabor]=useState(PRESETS.electrical.labor);
  const[execution,setExecution]=useState(PRESETS.electrical.execution);
  const[billing,setBilling]=useState(PRESETS.electrical.billing);
  const[retention,setRetention]=useState(PRESETS.electrical.retention);
  const[forecasting,setForecasting]=useState(PRESETS.electrical.forecasting);

  const loadPreset=useCallback(key=>{
    const p=PRESETS[key];if(!p)return;
    setPreset(key);setCompany(p.company);setDemand(p.demand);setSales(p.sales);
    setMaterials(p.materials);setLabor(p.labor);setExecution(p.execution);
    setBilling(p.billing);setRetention(p.retention);setForecasting(p.forecasting);
  },[]);

  const bm=BENCHMARKS[preset]||BENCHMARKS.electrical;

  const results=useMemo(()=>{
    const cats=[
      {...calcDemand(demand),key:"demand",label:"Demand Conversion",weight:0.15,recs:getRecs("demand")},
      {...calcSales(sales),key:"sales",label:"Sales / Estimating",weight:0.10,recs:getRecs("sales")},
      {...calcMaterials(materials),key:"materials",label:"Materials",weight:0.15,recs:getRecs("materials")},
      {...calcLabor(labor),key:"labor",label:"Labor Efficiency",weight:0.20,recs:getRecs("labor")},
      {...calcExecution(execution),key:"execution",label:"Job Execution",weight:0.15,recs:getRecs("execution")},
      {...calcBilling(billing),key:"billing",label:"Revenue Capture",weight:0.15,recs:getRecs("billing")},
      {...calcRetention(retention),key:"retention",label:"Retention",weight:0.05,recs:getRecs("retention")},
      {...calcForecasting(forecasting),key:"forecasting",label:"Forecasting",weight:0.05,recs:getRecs("forecasting")},
    ];
    const totalMonthly=cats.reduce((s,c)=>s+c.leakage,0);
    const totalAnnual=totalMonthly*12;
    const overallScore=cats.reduce((s,c)=>s+c.score*c.weight,0);
    const rrpPct=company.annualRevenue>0?(totalAnnual/company.annualRevenue)*100:0;
    const topLeaks=[...cats].sort((a,b)=>b.leakage-a.leakage).slice(0,3);
    return{cats,totalMonthly,totalAnnual,overallScore,rrpPct,topLeaks};
  },[company,demand,sales,materials,labor,execution,billing,retention,forecasting]);

  const nav=key=>{setSection(key);setSidebarOpen(false)};

  return(
    <div className="ra-root">
      <style>{CSS}</style>
      <div className={"ra-overlay"+(sidebarOpen?" on":"")} onClick={()=>setSidebarOpen(false)}/>
      <div className={"ra-sidebar"+(sidebarOpen?" on":"")}>
        <div style={{padding:"24px 20px 18px",borderBottom:"1px solid #1E1E1E"}}>
          <div style={{fontSize:10,color:"#383838",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>Kuharski Capital</div>
          <div style={{fontSize:19,fontWeight:700,color:"#F0F0F0",letterSpacing:"-0.02em"}}>RevAudit™</div>
          <div style={{fontSize:11,color:"#484848",marginTop:2}}>Revenue Leakage Intelligence</div>
        </div>

        {section==="home"?(
          <div style={{padding:"14px 12px",flex:1}}>
            <div style={{fontSize:10,color:"#383838",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,paddingLeft:2}}>Industries</div>
            {PRESET_BTNS.map(({key,label})=>(
              <button key={key} onClick={()=>{loadPreset(key);nav("company")}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",borderRadius:8,border:"none",background:"transparent",color:"#686868",fontSize:12,cursor:"pointer",marginBottom:2,fontFamily:"inherit"}}>{label}</button>
            ))}
          </div>
        ):(
          <>
            <div style={{padding:"10px 12px 6px"}}>
              <button onClick={()=>nav("home")} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid #1E1E1E",background:"transparent",color:"#686868",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← New Audit</button>
            </div>
            <div style={{padding:"6px 12px 12px",borderBottom:"1px solid #1E1E1E"}}>
              <div style={{fontSize:10,color:"#383838",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,paddingLeft:2}}>Active Preset</div>
              <div style={{fontSize:13,fontWeight:600,color:"#F97316",paddingLeft:2}}>{PRESET_LABEL_MAP[preset]||preset}</div>
            </div>
            <div style={{padding:"8px 12px 10px",borderBottom:"1px solid #1E1E1E"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,paddingLeft:2}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:"#22C55E",display:"inline-block"}}/>
                <span style={{fontSize:10,color:"#484848"}}>Benchmarks active — click "use avg"</span>
              </div>
            </div>
            <nav style={{padding:"10px 8px",flex:1}}>
              {NAV.map(item=>{
                const cat=results.cats.find(c=>c.key===item.key);
                const sev=cat?getSeverity(cat.score):null;
                return(
                  <button key={item.key} onClick={()=>nav(item.key)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"9px 12px",borderRadius:8,border:"none",background:section===item.key?"#1A1A1A":"transparent",color:section===item.key?"#F0F0F0":"#686868",fontSize:12,cursor:"pointer",marginBottom:2,textAlign:"left",fontFamily:"inherit"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{item.icon}</span><span>{item.label}</span></div>
                    {sev&&<span style={{width:6,height:6,borderRadius:"50%",background:sev.color,flexShrink:0}}/>}
                  </button>
                );
              })}
            </nav>
            <div style={{padding:"16px 20px",borderTop:"1px solid #1E1E1E"}}>
              <div style={{fontSize:10,color:"#484848",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>Est. Annual Leakage</div>
              <div style={{fontSize:22,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmtK(results.totalAnnual)}</div>
              <div style={{fontSize:11,color:"#484848",marginTop:2}}>recoverable revenue</div>
            </div>
          </>
        )}
      </div>

      <div className="ra-main">
        <div className="ra-topbar">
          <button className="ra-mbtn" onClick={()=>setSidebarOpen(o=>!o)}>☰</button>
          {section==="home"?(
            <div>
              <div style={{fontSize:14,fontWeight:600,color:"#F0F0F0"}}>RevAudit™</div>
              <div style={{fontSize:11,color:"#484848"}}>Revenue Leakage Intelligence</div>
            </div>
          ):(
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"#F0F0F0"}}>{company.name||"Your Business"}</div>
              <div style={{fontSize:11,color:"#484848"}}>{company.industry}</div>
            </div>
          )}
          {section!=="home"&&(
            <div className="ra-metrics">
              {[
                {label:"Monthly RRP",value:fmtK(results.totalMonthly),color:"#F97316"},
                {label:"Annual RRP",value:fmtK(results.totalAnnual),color:"#F97316"},
                {label:"% of Revenue",value:fmtPct(results.rrpPct),color:results.rrpPct>20?"#EF4444":results.rrpPct>10?"#EAB308":"#22C55E"},
                {label:"RevAudit Score",value:Math.round(results.overallScore),color:getSeverity(results.overallScore).color},
              ].map(m=>(
                <div key={m.label} style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:"#484848",textTransform:"uppercase",letterSpacing:"0.06em"}}>{m.label}</div>
                  <div style={{fontSize:20,fontWeight:700,color:m.color,fontFamily:"'DM Mono',monospace"}}>{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ra-page">
          {section==="home"&&<HomeScreen onSelect={key=>{loadPreset(key);nav("company")}}/>}
          {section==="company"&&(
            <div className="ra-section">
              <h2 style={{fontSize:18,fontWeight:600,color:"#F0F0F0",marginBottom:20,marginTop:0,letterSpacing:"-0.01em"}}>Company Profile</h2>
              <div style={{marginBottom:16,padding:"12px 16px",background:"#141414",border:"1px solid #F9731620",borderRadius:10,fontSize:12,color:"#A0A0A0",lineHeight:1.6}}>
                <strong style={{color:"#F97316"}}>Benchmarks:</strong> Each field shows the industry average for your selected preset. Click <strong style={{color:"#F97316"}}>"use avg"</strong> on any field you don't know.
              </div>
              <div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}>
                <div className="ra-2col">
                  <div style={{gridColumn:"1/-1"}}><InputField label="Company Name" type="text" value={company.name} onChange={v=>setCompany({...company,name:v})}/></div>
                  <div style={{gridColumn:"1/-1"}}><InputField label="Industry / Trade" type="text" value={company.industry} onChange={v=>setCompany({...company,industry:v})}/></div>
                  <InputField label="Annual Revenue" value={company.annualRevenue} onChange={v=>setCompany({...company,annualRevenue:v})} prefix="$"/>
                  <InputField label="Gross Margin" value={company.grossMargin} onChange={v=>setCompany({...company,grossMargin:v})} suffix="%" max={100}/>
                  <InputField label="Total Employees" value={company.employees} onChange={v=>setCompany({...company,employees:v})}/>
                  <InputField label="Field Technicians" value={company.fieldTechs} onChange={v=>setCompany({...company,fieldTechs:v})}/>
                  <InputField label="Office / Admin Staff" value={company.officeStaff} onChange={v=>setCompany({...company,officeStaff:v})}/>
                  <InputField label="Avg Job Size" value={company.avgJobSize} onChange={v=>setCompany({...company,avgJobSize:v})} prefix="$"/>
                  <InputField label="Jobs Per Month" value={company.jobsPerMonth} onChange={v=>setCompany({...company,jobsPerMonth:v})}/>
                  <InputField label="Avg Sales Cycle (days)" value={company.salesCycleDays} onChange={v=>setCompany({...company,salesCycleDays:v})}/>
                  <div style={{gridColumn:"1/-1"}}><InputField label="Primary Sales Channel" type="text" value={company.primaryChannel} onChange={v=>setCompany({...company,primaryChannel:v})}/></div>
                  <div style={{gridColumn:"1/-1"}}><InputField label="Service Area / Market" type="text" value={company.serviceArea} onChange={v=>setCompany({...company,serviceArea:v})}/></div>
                </div>
              </div>
              <div className="ra-3col" style={{marginTop:16}}>
                {[{label:"Revenue/Tech/Mo",value:fmt(company.annualRevenue/12/Math.max(1,company.fieldTechs||company.employees))},{label:"Jobs/Month",value:company.jobsPerMonth},{label:"Avg Job Size",value:fmt(company.avgJobSize)}].map(s=>(
                  <div key={s.label} style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:10,padding:"14px 16px"}}>
                    <div style={{fontSize:10,color:"#484848",textTransform:"uppercase",letterSpacing:"0.08em"}}>{s.label}</div>
                    <div style={{fontSize:20,fontWeight:700,color:"#F0F0F0",marginTop:4,fontFamily:"'DM Mono',monospace"}}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section==="demand"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><DemandPanel data={demand} onChange={setDemand} bm={bm.demand||{}}/></div><RecsPanel recs={getRecs("demand")}/></div>}
          {section==="sales"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><SalesPanel data={sales} onChange={setSales} bm={bm.sales||{}}/></div><RecsPanel recs={getRecs("sales")}/></div>}
          {section==="materials"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><MaterialsPanel data={materials} onChange={setMaterials} bm={bm.materials||{}}/></div><RecsPanel recs={getRecs("materials")}/></div>}
          {section==="labor"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><LaborPanel data={labor} onChange={setLabor} bm={bm.labor||{}} avgJobSize={company.avgJobSize}/></div><RecsPanel recs={getRecs("labor")}/></div>}
          {section==="execution"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><ExecutionPanel data={execution} onChange={setExecution} bm={bm.execution||{}}/></div><RecsPanel recs={getRecs("execution")}/></div>}
          {section==="billing"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><BillingPanel data={billing} onChange={setBilling} bm={bm.billing||{}}/></div><RecsPanel recs={getRecs("billing")}/></div>}
          {section==="retention"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><RetentionPanel data={retention} onChange={setRetention} bm={bm.retention||{}}/></div><RecsPanel recs={getRecs("retention")}/></div>}
          {section==="forecasting"&&<div className="ra-section"><div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:24}}><ForecastingPanel data={forecasting} onChange={setForecasting} bm={bm.forecasting||{}}/></div><RecsPanel recs={getRecs("forecasting")}/></div>}
          {section==="results"&&<ResultsDash results={results} company={company} labor={labor}/>}
        </div>
      </div>
    </div>
  );
}

function ResultsDash({results,company,labor}){
  const{cats,totalMonthly,totalAnnual,overallScore,rrpPct,topLeaks}=results;
  const oSev=getSeverity(overallScore);
  const lr=calcLabor(labor);
  const barData=cats.map((c,i)=>({name:c.label.replace("Demand Conversion","Demand").replace("Job Execution","Execution").replace("Revenue Capture","Billing").replace("Labor Efficiency","Labor").replace("Sales / Estimating","Sales"),leakage:Math.round(c.leakage),fill:COLORS[i]}));
  const pieData=cats.filter(c=>c.leakage>0).map((c,i)=>({name:c.label.split("/")[0].trim(),value:Math.round(c.leakage),fill:COLORS[i]}));
  return(
    <div>
      <div className="ra-4col">
        {[
          {label:"Monthly RRP",value:fmtK(totalMonthly),color:"#F97316",bg:"#1C0A00",border:"#F9731640"},
          {label:"Annual RRP",value:fmtK(totalAnnual),color:"#FB923C",bg:"#1C0A00",border:"#FB923C40"},
          {label:"% of Revenue",value:fmtPct(rrpPct),color:rrpPct>20?"#EF4444":"#EAB308",bg:rrpPct>20?"#1C0000":"#1C1400",border:rrpPct>20?"#EF444440":"#EAB30840"},
          {label:"RevAudit Score",value:Math.round(overallScore),color:oSev.color,bg:oSev.bg,border:oSev.color+"40"}
        ].map(m=>(
          <div key={m.label} style={{background:m.bg,border:"1px solid "+m.border,borderRadius:12,padding:"18px 20px"}}>
            <div style={{fontSize:11,color:"#686868",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{m.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:m.color,fontFamily:"'DM Mono',monospace"}}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#F0F0F0",marginBottom:16}}>Top 3 Revenue Leaks</div>
        <div className="ra-3eq">
          {topLeaks.map((c,i)=>{const sev=getSeverity(c.score);return(
            <div key={c.key} style={{background:"#111111",border:"1px solid #1E1E1E",borderRadius:10,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:22,fontWeight:700,color:"#1E1E1E"}}>#{i+1}</span>
                <span style={{fontSize:11,padding:"3px 8px",borderRadius:20,background:sev.bg,color:sev.color,border:"1px solid "+sev.color+"40",fontWeight:600}}>{sev.label}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:"#F0F0F0",marginBottom:4}}>{c.label}</div>
              <div style={{fontSize:22,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmt(c.leakage)}<span style={{fontSize:11,color:"#484848",fontWeight:400}}>/mo</span></div>
              <div style={{fontSize:11,color:"#484848",marginTop:2,fontFamily:"'DM Mono',monospace"}}>{fmt(c.leakage*12)}/year</div>
            </div>
          );})}
        </div>
      </div>
      <div className="ra-chart-row">
        <div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:600,color:"#F0F0F0",marginBottom:16}}>Leakage by Category (Monthly)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{top:0,right:10,left:10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/>
              <XAxis dataKey="name" tick={{fill:"#686868",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#686868",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>"$"+(v/1000).toFixed(0)+"k"}/>
              <Tooltip formatter={v=>[fmt(v),"Leakage"]} contentStyle={{background:"#141414",border:"1px solid #2A2A2A",borderRadius:8,fontSize:12}} labelStyle={{color:"#A0A0A0"}}/>
              <Bar dataKey="leakage" radius={[4,4,0,0]}>{barData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:20}}>
          <div style={{fontSize:13,fontWeight:600,color:"#F0F0F0",marginBottom:16}}>Leakage Mix</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">{pieData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Pie><Tooltip formatter={v=>fmt(v)} contentStyle={{background:"#141414",border:"1px solid #2A2A2A",borderRadius:8,fontSize:12}}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {pieData.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:8,height:8,borderRadius:2,background:d.fill}}/><span style={{fontSize:10,color:"#686868"}}>{d.name.substring(0,12)}</span></div>)}
          </div>
        </div>
      </div>
      <div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#F0F0F0",marginBottom:16}}>Category Scorecards</div>
        <div className="ra-4eq">
          {cats.map(c=>(
            <div key={c.key} style={{background:"#111111",border:"1px solid #1E1E1E",borderRadius:10,padding:14}}>
              <div style={{fontSize:11,fontWeight:500,color:"#A0A0A0",marginBottom:8}}>{c.label}</div>
              <ScoreGauge score={c.score}/>
              <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1E1E1E"}}>
                <div style={{fontSize:11,color:"#484848"}}>Monthly Leakage</div>
                <div style={{fontSize:15,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmt(c.leakage)}</div>
              </div>
              <div style={{marginTop:8}}>
                {c.drivers.slice(0,2).map((d,j)=><div key={j} style={{fontSize:10,color:"#484848",marginBottom:3,display:"flex",gap:4}}><span style={{color:"#F97316",flexShrink:0}}>›</span><span>{d}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"#141414",border:"1px solid #1E1E1E",borderRadius:12,padding:20,marginBottom:20}}>
        <div style={{fontSize:14,fontWeight:600,color:"#F0F0F0",marginBottom:16}}>Priority Action Plan — Top 3 Categories</div>
        {topLeaks.map((c,ci)=>{const sev=getSeverity(c.score);return(
          <div key={c.key} style={{marginBottom:20,paddingBottom:20,borderBottom:ci<2?"1px solid #1E1E1E":"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
              <span style={{background:"#1C0A00",color:"#F97316",border:"1px solid #F9731640",borderRadius:20,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>#{ci+1}</span>
              <span style={{fontSize:14,fontWeight:600,color:"#F0F0F0"}}>{c.label}</span>
              <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:sev.bg,color:sev.color,border:"1px solid "+sev.color+"40",fontWeight:600}}>{sev.label}</span>
              <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmt(c.leakage*12)}/yr</span>
            </div>
            <div className="ra-2rec">
              {c.recs.map((r,ri)=>(
                <div key={ri} style={{display:"flex",gap:8,background:"#111111",borderRadius:8,padding:"10px 12px"}}>
                  <span style={{color:"#22C55E",flexShrink:0,fontSize:12}}>✓</span>
                  <span style={{fontSize:12,color:"#A0A0A0",lineHeight:1.5}}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        );})}
      </div>
      <div style={{background:"#141414",border:"1px solid #F97316",borderRadius:12,padding:20}}>
        <div style={{fontSize:13,fontWeight:600,color:"#F97316",marginBottom:12}}>⚡ Labor Capacity Recovery</div>
        <div className="ra-3eq">
          <div><div style={{fontSize:11,color:"#A0A0A0",textTransform:"uppercase"}}>Recoverable Hours</div><div style={{fontSize:22,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{lr.recovHours} hrs/mo</div></div>
          <div><div style={{fontSize:11,color:"#A0A0A0",textTransform:"uppercase"}}>Extra Jobs Possible</div><div style={{fontSize:22,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>+{lr.extraJobs} jobs/mo</div></div>
          <div><div style={{fontSize:11,color:"#A0A0A0",textTransform:"uppercase"}}>Annual Revenue Upside</div><div style={{fontSize:22,fontWeight:700,color:"#F97316",fontFamily:"'DM Mono',monospace"}}>{fmtK(lr.extraJobs*12*(company.avgJobSize||2000))}</div></div>
        </div>
      </div>
    </div>
  );
}
