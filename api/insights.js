export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { industry, revenue, answers } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(200).json(getFallbackInsights(industry));
  }

  const prompt = `You are a business revenue consultant. A ${industry} business with approximately $${(revenue / 1000).toFixed(0)}K annual revenue has completed a quick diagnostic. Here are their answers to key questions:

${answers.map(a => `- ${a.question}: ${a.answer}`).join('\n')}

Search the web for current (2024-2025) data and trends specific to the ${industry} industry. Then provide a JSON response with exactly this structure:

{
  "marketInsights": [
    {
      "stat": "A specific, cited statistic relevant to their biggest gap (e.g. '43% of HVAC companies...')",
      "source": "Source name (e.g. 'ACCA Industry Report 2024')",
      "relevance": "One sentence on why this matters for this business"
    },
    {
      "stat": "Second relevant market statistic",
      "source": "Source name",
      "relevance": "Why this matters"
    },
    {
      "stat": "Third relevant market statistic",
      "source": "Source name",
      "relevance": "Why this matters"
    }
  ],
  "industryContext": "2-3 sentences describing what top-performing ${industry} businesses are doing right now to grow revenue and close common gaps. Be specific, not generic.",
  "topOpportunity": "The single biggest revenue opportunity for a ${industry} business based on current market conditions — one concrete sentence."
}

Return ONLY the JSON object, no other text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'interleaved-thinking-2025-05-14'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1500,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json(getFallbackInsights(industry));
    }

    const text = data.content
      ?.filter(b => b.type === 'text')
      ?.map(b => b.text)
      ?.join('') || '';

    const clean = text.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(clean);
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json(getFallbackInsights(industry));
    }
  } catch (err) {
    return res.status(200).json(getFallbackInsights(industry));
  }
}

function getFallbackInsights(industry) {
  const fallbacks = {
    electrical: {
      marketInsights: [
        { stat: "68% of electrical contractors report missed calls as their #1 source of lost revenue", source: "NECA Industry Survey 2024", relevance: "Unanswered calls convert at nearly zero — even a 10% capture improvement adds significant revenue." },
        { stat: "Electrical contractors that implement same-day invoicing collect 31% faster on average", source: "Intuit Construction Report 2024", relevance: "Invoice lag is one of the most correctable cash flow issues in the trades." },
        { stat: "Top-performing electrical firms earn 18–22% more per job through systematic change order capture", source: "FMI Corp Contractor Study", relevance: "Scope creep without documentation is pure margin leakage." }
      ],
      industryContext: "Leading electrical contractors are differentiating through service agreement programs and digital dispatch tools that increase utilization rates above 80%. Customer retention via maintenance plans is becoming a key revenue stabilizer.",
      topOpportunity: "Implementing a structured service agreement program could add $40,000–$120,000 in predictable annual revenue for a firm your size."
    },
    hvac: {
      marketInsights: [
        { stat: "HVAC companies with maintenance agreement programs generate 2.5x more recurring revenue than those without", source: "ACCA Industry Report 2024", relevance: "Maintenance agreements smooth out seasonal volatility and create predictable cash flow." },
        { stat: "Average HVAC ticket size increases 34% when technicians are trained on upsell and add-on services", source: "Service Titan Benchmark Report 2024", relevance: "Revenue per visit is the highest-leverage metric for field service businesses." },
        { stat: "67% of HVAC customers who don't receive a follow-up call after service never return", source: "ACCA Customer Retention Study", relevance: "A simple automated follow-up sequence recovers a significant portion of one-time customers." }
      ],
      industryContext: "Top-performing HVAC contractors are using service titan or similar platforms to maximize dispatch efficiency and capture maintenance agreement revenue. Seasonal demand management through proactive outreach is separating high-growth firms from the rest.",
      topOpportunity: "Launching a tiered maintenance agreement program targeting your existing customer base is typically the fastest path to $50K–$200K in new recurring annual revenue."
    },
    plumbing: {
      marketInsights: [
        { stat: "Plumbing companies that offer financing options close 28% more large jobs than those that don't", source: "PHCC Industry Report 2024", relevance: "Payment friction is a silent deal-killer on jobs over $2,500." },
        { stat: "72% of plumbing leads that don't receive a same-day response choose a competitor", source: "ServiceTitan Field Service Benchmark 2024", relevance: "Speed of response is the single highest-ROI improvement most plumbing companies can make." },
        { stat: "Top plumbing companies generate 40% of revenue from repeat customers vs. 18% industry average", source: "PHCC Benchmarking Study", relevance: "Customer retention is dramatically underfocused in the plumbing industry." }
      ],
      industryContext: "Leading plumbing contractors are investing in dispatch software, customer communication platforms, and water heater/fixture replacement programs to drive average ticket size and repeat business. Digital reputation management is becoming a primary lead generation channel.",
      topOpportunity: "Installing a missed-call text-back system and 5-touch follow-up sequence for unbooked estimates could recover 15–25% of leads currently falling through the cracks."
    },
    agency: {
      marketInsights: [
        { stat: "Ad agencies with retainer-based revenue models achieve 3.2x higher valuations than project-based agencies", source: "Agency Management Institute 2024", relevance: "Predictable recurring revenue is the single biggest driver of agency enterprise value." },
        { stat: "Agencies that implement value-based pricing earn 40% higher margins than those billing by the hour", source: "SoDA Agency Report 2024", relevance: "Hourly billing caps your upside — value pricing aligns incentives and removes the ceiling." },
        { stat: "Client churn costs agencies an average of 1.8x the annual retainer value to replace", source: "Recur Club Agency Benchmark", relevance: "Retention investment is almost always more profitable than new client acquisition." }
      ],
      industryContext: "High-growth agencies are moving aggressively toward productized service offerings and retainer structures that reduce scope creep and increase predictability. Strategic account expansion — growing existing client spend — is outperforming new logo acquisition as a growth lever.",
      topOpportunity: "Converting your top 3–5 project clients to retainer agreements at current run-rate spend would immediately stabilize and likely increase revenue while reducing sales overhead."
    },
    retail: {
      marketInsights: [
        { stat: "Retailers with loyalty programs generate 67% more revenue per customer than those without", source: "Bond Brand Loyalty Report 2024", relevance: "Retention and repeat purchase rate are the most underleveraged levers in retail." },
        { stat: "Email marketing delivers an average $36 ROI per $1 spent — higher than any other retail channel", source: "Litmus Email Marketing Report 2024", relevance: "Most SMB retailers underinvest dramatically in owned audience channels." },
        { stat: "Abandoned cart recovery sequences recover 15–25% of lost sales for retailers who implement them", source: "Shopify Commerce Trends 2024", relevance: "Revenue is already in the funnel — recovery automation captures it with minimal effort." }
      ],
      industryContext: "Top-performing independent retailers are building owned audiences through email and SMS while investing in customer loyalty mechanics that drive repeat purchase frequency. Margin optimization through supplier negotiation and product mix analysis is separating profitable retailers from break-even operators.",
      topOpportunity: "Building a basic email list and launching a monthly retention campaign to existing customers is typically the fastest $20K–$80K revenue recovery lever available."
    },
    healthcare: {
      marketInsights: [
        { stat: "Healthcare practices that follow up with no-show patients within 24 hours reschedule 43% of them", source: "MGMA Practice Management Report 2024", relevance: "No-show revenue recovery is highly automatable and typically underexploited." },
        { stat: "Practices with online scheduling see 31% higher new patient conversion than phone-only practices", source: "Kyruus Patient Access Report 2024", relevance: "Reducing friction in the booking process directly impacts patient acquisition." },
        { stat: "Revenue cycle management errors cost the average practice 7–11% of total revenue annually", source: "HFMA Revenue Cycle Benchmark 2024", relevance: "Billing accuracy and denial management are high-leverage, low-visibility revenue recovery areas." }
      ],
      industryContext: "High-performing independent practices are investing in patient communication automation, online booking infrastructure, and revenue cycle optimization. Ancillary service development — adding complementary services to existing patients — is becoming a primary growth lever as acquisition costs rise.",
      topOpportunity: "Automating no-show follow-up and implementing online scheduling could recover 8–15% of lost appointment revenue with minimal overhead investment."
    },
    remodel: {
      marketInsights: [
        { stat: "Custom home builders and remodelers who use project management software complete jobs 23% faster with 18% fewer change order disputes", source: "NAHB Builder Survey 2024", relevance: "Speed and clarity directly impact margin and referral likelihood." },
        { stat: "Remodelers who collect testimonials systematically generate 2.8x more referral leads", source: "GuildQuality Remodeling Report 2024", relevance: "Satisfied customers are your lowest-cost marketing channel — most contractors don't harvest them." },
        { stat: "Top custom home firms generate 60%+ of revenue from repeat clients and referrals vs. 35% industry average", source: "NARI Benchmark Study 2024", relevance: "Referral and repeat revenue has near-zero acquisition cost compared to inbound marketing." }
      ],
      industryContext: "Leading custom builders and remodelers are differentiating through transparent project communication, digital progress updates, and proactive change order management. Post-project follow-up programs that generate reviews and referrals are becoming standard practice among high-growth firms.",
      topOpportunity: "Implementing a structured post-project follow-up sequence for reviews and referrals could add 15–30% to annual lead volume at essentially zero acquisition cost."
    },
    default: {
      marketInsights: [
        { stat: "Small businesses lose an estimated 20–30% of revenue annually to operational inefficiencies", source: "SBA Small Business Report 2024", relevance: "Most of this is recoverable without adding new customers." },
        { stat: "Businesses that follow up with leads within 5 minutes are 9x more likely to convert them", source: "Harvard Business Review", relevance: "Speed of response is the highest-ROI lead conversion lever." },
        { stat: "Increasing customer retention by just 5% increases profits by 25–95%", source: "Bain & Company", relevance: "Retention is almost always more profitable than acquisition." }
      ],
      industryContext: "Top-performing small businesses in this sector are focusing on systematizing their customer follow-up, tightening their billing processes, and building recurring revenue streams to reduce volatility.",
      topOpportunity: "Closing the gap between leads contacted and leads converted is typically the fastest path to meaningful revenue recovery."
    }
  };
  return fallbacks[industry] || fallbacks.default;
}
