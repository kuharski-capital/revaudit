"use client";

import { FormEvent, useMemo, useState } from "react";
import { DM_Mono, DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

type FormState = {
  clientName: string;
  annualRevenue: string;
  leadsPerMonth: string;
  closeRate: string;
  avgDealSize: string;
  leadResponseTime: string;
  followUpAttempts: string;
  salesProcessDefined: boolean;
  retentionRate: string;
  estimatedLeakage: string;
  impact: number;
  easeOfFix: number;
};

type FieldKey =
  | "clientName"
  | "annualRevenue"
  | "leadsPerMonth"
  | "closeRate"
  | "avgDealSize"
  | "followUpAttempts"
  | "retentionRate"
  | "estimatedLeakage";

const initialState: FormState = {
  clientName: "",
  annualRevenue: "",
  leadsPerMonth: "",
  closeRate: "",
  avgDealSize: "",
  leadResponseTime: "within-1-hour",
  followUpAttempts: "",
  salesProcessDefined: false,
  retentionRate: "",
  estimatedLeakage: "",
  impact: 3,
  easeOfFix: 3,
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function Page() {
  const [form, setForm] = useState<FormState>(initialState);
  const [showScorecard, setShowScorecard] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const numbers = useMemo(() => {
    const annualRevenue = Number(form.annualRevenue) || 0;
    const leadsPerMonth = Number(form.leadsPerMonth) || 0;
    const closeRate = Number(form.closeRate) || 0;
    const avgDealSize = Number(form.avgDealSize) || 0;
    const followUpAttempts = Number(form.followUpAttempts) || 0;
    const retentionRate = Number(form.retentionRate) || 0;
    const estimatedLeakage = Number(form.estimatedLeakage) || 0;

    const annualLeakage = annualRevenue * (estimatedLeakage / 100);
    const monthlyLeakage = annualLeakage / 12;
    const priorityScore = form.impact * form.easeOfFix;
    const recoverableRevenue = annualLeakage * (priorityScore / 25);

    return {
      annualRevenue,
      leadsPerMonth,
      closeRate,
      avgDealSize,
      followUpAttempts,
      retentionRate,
      estimatedLeakage,
      annualLeakage,
      monthlyLeakage,
      priorityScore,
      recoverableRevenue,
    };
  }, [form]);

  const insight = useMemo(() => {
    const responseTimeWeakness: Record<string, number> = {
      "within-1-hour": 0,
      "same-day": 1,
      "next-day": 2,
      "2-3-days": 3,
      "4-plus-days": 4,
    };

    const weakPoints = [
      {
        key: "closeRate",
        score:
          numbers.closeRate >= 30
            ? 0
            : numbers.closeRate >= 20
            ? 1
            : numbers.closeRate >= 10
            ? 3
            : 5,
      },
      {
        key: "leadResponseTime",
        score: responseTimeWeakness[form.leadResponseTime] ?? 0,
      },
      {
        key: "followUpAttempts",
        score:
          numbers.followUpAttempts >= 7
            ? 0
            : numbers.followUpAttempts >= 5
            ? 2
            : numbers.followUpAttempts >= 3
            ? 4
            : 5,
      },
      {
        key: "salesProcessDefined",
        score: form.salesProcessDefined ? 0 : 4,
      },
      {
        key: "retentionRate",
        score:
          numbers.retentionRate >= 90
            ? 0
            : numbers.retentionRate >= 80
            ? 2
            : numbers.retentionRate >= 70
            ? 4
            : 5,
      },
      {
        key: "estimatedLeakage",
        score:
          numbers.estimatedLeakage <= 5
            ? 0
            : numbers.estimatedLeakage <= 10
            ? 2
            : numbers.estimatedLeakage <= 20
            ? 4
            : 5,
      },
    ];

    weakPoints.sort((a, b) => b.score - a.score);
    const weakest = weakPoints[0]?.key ?? "closeRate";

    const recommendations: Record<string, { insight: string; actions: string[] }> = {
      closeRate: {
        insight:
          "Your close rate is the biggest constraint. Lead quality may be acceptable, but conversion discipline is likely leaking revenue.",
        actions: [
          "Audit your qualification script and disqualify poor-fit leads earlier.",
          "Standardize a proposal + objection-handling framework for every rep.",
          "Run weekly close-rate reviews by stage and rep.",
        ],
      },
      leadResponseTime: {
        insight:
          "Response speed appears to be your weakest metric. Slower first contact usually causes immediate intent decay.",
        actions: [
          "Set an SLA to respond to every new lead within 1 hour.",
          "Use automated routing and instant acknowledgement messages.",
          "Track first-response time daily and coach missed SLA events.",
        ],
      },
      followUpAttempts: {
        insight:
          "Insufficient follow-up is likely suppressing conversion. Most deals need multiple touchpoints before closing.",
        actions: [
          "Adopt a minimum 7-touch follow-up cadence over 14 days.",
          "Create call, email, and SMS templates per follow-up step.",
          "Monitor follow-up completion rates in your CRM.",
        ],
      },
      salesProcessDefined: {
        insight:
          "A loosely defined sales process is creating inconsistency and missed handoffs across the funnel.",
        actions: [
          "Document your sales stages with exit criteria for each stage.",
          "Add required CRM fields to enforce process compliance.",
          "Review stage aging weekly to find bottlenecks.",
        ],
      },
      retentionRate: {
        insight:
          "Retention is your largest risk area. Revenue growth will stall if churn offsets new sales.",
        actions: [
          "Identify churn drivers by segment, tenure, and product usage.",
          "Launch a 90-day customer success plan for new accounts.",
          "Set proactive renewal checkpoints before contract end dates.",
        ],
      },
      estimatedLeakage: {
        insight:
          "Estimated revenue leakage is materially high, which suggests multiple compounding gaps across your revenue engine.",
        actions: [
          "Prioritize the highest-value leakage point first for fast wins.",
          "Create a leakage dashboard (response, conversion, retention).",
          "Recalculate leakage monthly to measure recovery progress.",
        ],
      },
    };

    return recommendations[weakest] ?? recommendations.closeRate;
  }, [form.leadResponseTime, form.salesProcessDefined, numbers]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setShowScorecard(false);
      return;
    }
    setShowScorecard(true);
  };

  const clearError = (field: FieldKey) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    setShowScorecard(false);
  };

  return (
    <main
      className={`${dmSans.variable} ${dmMono.variable}`}
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F0F0E",
        color: "#EDEDED",
        fontFamily: "var(--font-dm-sans)",
        padding: "2rem 1rem 3rem",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.35rem" }}>RevAudit Revenue Diagnostic</h1>
        <p style={{ color: "#A4A4A4", marginBottom: "1.5rem" }}>
          Capture baseline metrics, estimate leakage, and identify your highest-impact next actions.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.95rem",
            background: "#171716",
            border: "1px solid #262624",
            borderRadius: 14,
            padding: "1rem",
          }}
        >
          <Field
            label="Client Name"
            value={form.clientName}
            onChange={(v) => {
              clearError("clientName");
              setForm((s) => ({ ...s, clientName: v }));
            }}
            placeholder="Acme Industries"
            error={errors.clientName}
          />
          <Field
            label="Annual Revenue ($)"
            type="number"
            value={form.annualRevenue}
            onChange={(v) => {
              clearError("annualRevenue");
              setForm((s) => ({ ...s, annualRevenue: v }));
            }}
            placeholder="1200000"
            min={0}
            step="any"
            error={errors.annualRevenue}
          />
          <Field
            label="Leads per Month"
            type="number"
            value={form.leadsPerMonth}
            onChange={(v) => {
              clearError("leadsPerMonth");
              setForm((s) => ({ ...s, leadsPerMonth: v }));
            }}
            placeholder="240"
            min={0}
            step={1}
            error={errors.leadsPerMonth}
          />
          <Field
            label="Close Rate (%)"
            type="number"
            value={form.closeRate}
            onChange={(v) => {
              clearError("closeRate");
              setForm((s) => ({ ...s, closeRate: v }));
            }}
            placeholder="18"
            min={0}
            max={100}
            step="any"
            error={errors.closeRate}
          />
          <Field
            label="Avg Deal Size ($)"
            type="number"
            value={form.avgDealSize}
            onChange={(v) => {
              clearError("avgDealSize");
              setForm((s) => ({ ...s, avgDealSize: v }));
            }}
            placeholder="7500"
            min={0}
            step="any"
            error={errors.avgDealSize}
          />

          <label style={labelStyle}>
            Lead Response Time
            <select
              value={form.leadResponseTime}
              onChange={(e) => setForm((s) => ({ ...s, leadResponseTime: e.target.value }))}
              style={inputStyle}
            >
              <option value="within-1-hour">Within 1 hour</option>
              <option value="same-day">Same day</option>
              <option value="next-day">Next day</option>
              <option value="2-3-days">2-3 days</option>
              <option value="4-plus-days">4+ days</option>
            </select>
          </label>

          <Field
            label="Follow-up Attempts"
            type="number"
            value={form.followUpAttempts}
            onChange={(v) => {
              clearError("followUpAttempts");
              setForm((s) => ({ ...s, followUpAttempts: v }));
            }}
            placeholder="5"
            min={0}
            step={1}
            error={errors.followUpAttempts}
          />

          <label style={labelStyle}>
            Sales Process Defined
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.45rem" }}>
              <Toggle
                active={form.salesProcessDefined}
                onClick={() => setForm((s) => ({ ...s, salesProcessDefined: true }))}
              >
                Yes
              </Toggle>
              <Toggle
                active={!form.salesProcessDefined}
                onClick={() => setForm((s) => ({ ...s, salesProcessDefined: false }))}
              >
                No
              </Toggle>
            </div>
          </label>

          <Field
            label="Retention Rate (%)"
            type="number"
            value={form.retentionRate}
            onChange={(v) => {
              clearError("retentionRate");
              setForm((s) => ({ ...s, retentionRate: v }));
            }}
            placeholder="84"
            min={0}
            max={100}
            step="any"
            error={errors.retentionRate}
          />
          <Field
            label="Estimated Leakage (%)"
            type="number"
            value={form.estimatedLeakage}
            onChange={(v) => {
              clearError("estimatedLeakage");
              setForm((s) => ({ ...s, estimatedLeakage: v }));
            }}
            placeholder="12"
            min={0}
            max={100}
            step="any"
            error={errors.estimatedLeakage}
          />

          <label style={labelStyle}>
            Impact (1-5)
            <input
              type="range"
              min={1}
              max={5}
              value={form.impact}
              onChange={(e) => setForm((s) => ({ ...s, impact: Number(e.target.value) }))}
              style={{ marginTop: "0.55rem" }}
            />
            <small style={smallStyle}>{form.impact}</small>
          </label>
          <label style={labelStyle}>
            Ease of Fix (1-5)
            <input
              type="range"
              min={1}
              max={5}
              value={form.easeOfFix}
              onChange={(e) => setForm((s) => ({ ...s, easeOfFix: Number(e.target.value) }))}
              style={{ marginTop: "0.55rem" }}
            />
            <small style={smallStyle}>{form.easeOfFix}</small>
          </label>

          <div style={{ gridColumn: "1 / -1", marginTop: "0.25rem" }}>
            <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "1fr auto" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#EDEDED",
                  color: "#121212",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  padding: "0.8rem 1rem",
                  cursor: "pointer",
                }}
              >
                Generate Revenue Diagnostic
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "#0F0F0E",
                  color: "#D8D8D8",
                  border: "1px solid #2F2F2D",
                  borderRadius: 10,
                  fontWeight: 600,
                  padding: "0.8rem 1rem",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {showScorecard && (
          <section style={{ marginTop: "1.25rem", display: "grid", gap: "0.9rem" }}>
            <Card title="1. Business Snapshot">
              <Metric label="Client" value={form.clientName || "N/A"} />
              <Metric label="Annual Revenue" value={currency.format(numbers.annualRevenue)} />
              <Metric label="Leads / Month" value={String(numbers.leadsPerMonth)} />
              <Metric label="Close Rate" value={`${numbers.closeRate}%`} />
              <Metric label="Avg Deal Size" value={currency.format(numbers.avgDealSize)} />
            </Card>

            <Card title="2. Revenue Leakage">
              <Metric label="Leakage %" value={`${numbers.estimatedLeakage}%`} />
              <Metric label="Annual Leakage $" value={currency.format(numbers.annualLeakage)} />
              <Metric label="Monthly Leakage $" value={currency.format(numbers.monthlyLeakage)} />
              <Metric
                label="Recoverable Revenue $"
                value={currency.format(numbers.recoverableRevenue)}
              />
            </Card>

            <Card title="3. Priority Score">
              <p
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "1.6rem",
                  margin: "0 0 0.35rem",
                }}
              >
                {numbers.priorityScore} / 25
              </p>
              <p style={{ margin: 0, color: "#B3B3B3" }}>Calculated as Impact x Ease of Fix.</p>
            </Card>

            <Card title="4. Key Insight + Recommended Actions">
              <p style={{ marginTop: 0 }}>{insight.insight}</p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "#D6D6D6" }}>
                {insight.actions.map((item) => (
                  <li key={item} style={{ marginBottom: "0.25rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
  step,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  error?: string;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        style={{ ...inputStyle, borderColor: error ? "#7F1D1D" : "#2F2F2D" }}
      />
      {error && <small style={errorStyle}>{error}</small>}
    </label>
  );
}

function validateForm(form: FormState): Partial<Record<FieldKey, string>> {
  const nextErrors: Partial<Record<FieldKey, string>> = {};
  const requiredNumber = (value: string) => value.trim() !== "" && !Number.isNaN(Number(value));
  const asNumber = (value: string) => Number(value);

  if (!form.clientName.trim()) nextErrors.clientName = "Client name is required.";

  if (!requiredNumber(form.annualRevenue) || asNumber(form.annualRevenue) <= 0) {
    nextErrors.annualRevenue = "Annual revenue must be greater than 0.";
  }
  if (!requiredNumber(form.leadsPerMonth) || asNumber(form.leadsPerMonth) < 0) {
    nextErrors.leadsPerMonth = "Leads per month cannot be negative.";
  }
  if (
    !requiredNumber(form.closeRate) ||
    asNumber(form.closeRate) < 0 ||
    asNumber(form.closeRate) > 100
  ) {
    nextErrors.closeRate = "Close rate must be between 0 and 100.";
  }
  if (!requiredNumber(form.avgDealSize) || asNumber(form.avgDealSize) <= 0) {
    nextErrors.avgDealSize = "Average deal size must be greater than 0.";
  }
  if (!requiredNumber(form.followUpAttempts) || asNumber(form.followUpAttempts) < 0) {
    nextErrors.followUpAttempts = "Follow-up attempts cannot be negative.";
  }
  if (
    !requiredNumber(form.retentionRate) ||
    asNumber(form.retentionRate) < 0 ||
    asNumber(form.retentionRate) > 100
  ) {
    nextErrors.retentionRate = "Retention rate must be between 0 and 100.";
  }
  if (
    !requiredNumber(form.estimatedLeakage) ||
    asNumber(form.estimatedLeakage) < 0 ||
    asNumber(form.estimatedLeakage) > 100
  ) {
    nextErrors.estimatedLeakage = "Estimated leakage must be between 0 and 100.";
  }

  return nextErrors;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article
      style={{
        background: "#171716",
        border: "1px solid #262624",
        borderRadius: 14,
        padding: "1rem",
      }}
    >
      <h2 style={{ margin: "0 0 0.7rem", fontSize: "1.05rem" }}>{title}</h2>
      {children}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <p style={{ margin: "0 0 0.35rem", color: "#D7D7D7" }}>
      <span style={{ color: "#9B9B9B" }}>{label}: </span>
      <span style={{ fontFamily: "var(--font-dm-mono)" }}>{value}</span>
    </p>
  );
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 8,
        border: "1px solid #333331",
        background: active ? "#EDEDED" : "#10100F",
        color: active ? "#121212" : "#CDCDCD",
        padding: "0.45rem 0.8rem",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
  fontSize: "0.88rem",
  color: "#DADADA",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #2F2F2D",
  background: "#10100F",
  color: "#F2F2F2",
  padding: "0.6rem 0.65rem",
  marginTop: "0.15rem",
  outline: "none",
};

const smallStyle: React.CSSProperties = {
  color: "#A0A0A0",
  marginTop: "0.3rem",
  fontFamily: "var(--font-dm-mono)",
};

const errorStyle: React.CSSProperties = {
  color: "#FCA5A5",
  marginTop: "0.25rem",
  fontSize: "0.75rem",
};
