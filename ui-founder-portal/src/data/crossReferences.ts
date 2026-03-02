export interface CrossRef {
  provision: string;
  termSheet: string;
  execSummary: string;
  deck: string;
  faq: string;
  capTable: string;
  financialModel: string;
}

export const crossReferences: CrossRef[] = [
  { provision: 'Investment Amount ($2M)', termSheet: 'Issuer', execSummary: 'Structure', deck: 'Slide 8', faq: 'Instrument', capTable: '—', financialModel: 'Assumptions' },
  { provision: 'Preferred Return (8%)', termSheet: 'Preferred Return', execSummary: 'Structure', deck: 'Slide 8', faq: 'Instrument', capTable: '—', financialModel: 'Redemption' },
  { provision: 'Mandatory Redemption (M36)', termSheet: 'Mandatory', execSummary: 'Structure', deck: 'Slide 8', faq: 'Redemption', capTable: '—', financialModel: 'Redemption' },
  { provision: 'Max Payout ($2,880,000)', termSheet: 'Redemption Econ', execSummary: 'Structure', deck: 'Slide 9', faq: 'Instrument', capTable: '—', financialModel: 'Redemption' },
  { provision: 'Zero Governance', termSheet: 'Voting Rights', execSummary: 'Structure', deck: 'Slide 8', faq: 'Governance', capTable: 'Class C', financialModel: '—' },
  { provision: 'Tithe (7%, senior)', termSheet: 'Tithe Ack', execSummary: 'Tithe', deck: 'Slide 10', faq: 'Tithe', capTable: 'Art I', financialModel: 'P&L Row' },
  { provision: 'Entity Conversion', termSheet: 'Issuer + Mechanics', execSummary: 'Entity', deck: 'Slide 8', faq: 'Cap Table', capTable: 'Art II', financialModel: '—' },
  { provision: 'Class C Mapping', termSheet: 'Type of Security', execSummary: '—', deck: '—', faq: 'Cap Table', capTable: 'Art II §2.3', financialModel: '—' },
  { provision: '10%/4% Reconciliation', termSheet: 'Unit Economics', execSummary: '—', deck: '—', faq: 'Cap Table', capTable: 'Div B.1', financialModel: '—' },
  { provision: 'Liquidation Waterfall', termSheet: 'Liq Preference', execSummary: 'Structure', deck: '—', faq: 'Risk', capTable: 'Art III', financialModel: '—' },
  { provision: 'Redemption Paths', termSheet: 'Path Assurance', execSummary: '—', deck: '—', faq: 'Redemption', capTable: '—', financialModel: 'Scenarios' },
  { provision: 'Stress Test (70%)', termSheet: 'Path Assurance', execSummary: '—', deck: '—', faq: 'Risk', capTable: '—', financialModel: '—' },
  { provision: 'M36 Cash ($3.26M)', termSheet: 'Model Ref', execSummary: 'Financial', deck: 'Slide 7', faq: 'Redemption', capTable: '—', financialModel: 'Annual Summary' },
  { provision: 'Revenue ($4.73M)', termSheet: '—', execSummary: 'Financial', deck: 'Slide 7', faq: '—', capTable: '—', financialModel: 'Annual Summary' },
  { provision: 'Tithe Amount ($331K)', termSheet: '—', execSummary: 'Tithe', deck: 'Slide 10', faq: 'Tithe', capTable: '—', financialModel: 'Annual Summary' },
];

export const riskFactors = [
  { title: 'Revenue Risk', content: 'Projections assume 7% free-to-paid conversion, $3K blended enterprise ARPU, and 55 enterprise clients by M36. At 70% achievement, cash at M36 is ~$1.8M vs $2.88M obligation. Secondary and tertiary redemption paths activate.' },
  { title: 'Solo-Founder Risk', content: 'Single engineer built the entire platform. Mitigated by Steward Fiduciary Obligation (succession), planned hires M3–14 (4 FTEs), and the platform\'s operational stability (31 services running from fresh git clone).' },
  { title: 'Market Timing Risk', content: 'App Store launch at M3; enterprise pilots at M5. Delays compress revenue ramp. Enterprise revenue is independent of App Store. Both revenue engines operate in parallel.' },
  { title: 'Technology Risk', content: 'AI model landscape evolves rapidly. Sovereign architecture mitigates by supporting local execution (Ollama) and model-agnostic design. No dependency on any single AI provider.' },
  { title: 'Regulatory Risk', content: 'Evolving AI regulations (GDPR, CCPA, HIPAA) could impose compliance requirements. Sovereign deployment model positions the platform favorably — data stays under user control.' },
  { title: 'Redemption Risk', content: 'Coverage ratio at M36 is 1.13x — positive but tight. No escrow or collateral. Investor relies on projected cash generation. Default does not extinguish the obligation but creates enforcement complexity.' },
  { title: 'Tithe Impact', content: '7¢ of every revenue dollar is unavailable for operations or investor distributions. This is non-negotiable. Financial model fully accounts for tithe in all projections.' },
  { title: 'Entity Conversion Risk', content: 'LLC → C-Corp conversion introduces transaction costs and potential tax consequences. Planned within 90 days. Series 1 rights transfer automatically. Investor bears no action requirement.' },
];

export const assumptions = {
  consumer: [
    'App Store launch: Month 3',
    'Pro tier: $19.99/month (65% of paid users)',
    'Sovereign tier: $49.99/month (35% of paid users)',
    'Blended consumer ARPU: $30.49/month',
    'Free-to-paid conversion: 7% (industry range: 5–10% for premium AI tools)',
    'Free user acquisition: 800/mo (M3–12), 2,500/mo (M13–24), 5,000/mo (M25–36)',
    'Monthly churn: 5%',
  ],
  enterprise: [
    'First pilot: Month 5',
    'Tiers: Starter $500/mo, Professional $2,500/mo, Custom $7,500/mo',
    'Blended enterprise ARPU: $3,000/month',
    'Client targets: 8 by M12, 25 by M24, 55 by M36',
    'Informed by CTA credential and Salesforce ecosystem access',
  ],
  opex: [
    'Founder salary: $10,000/mo (below market — $10K × 36 = $360K)',
    'Infrastructure: $3K → $7K → $12K/mo (scales with users)',
    'Engineer #1: Month 3 start, $13K/mo',
    'Engineer #2: Month 8 start, $13K/mo',
    'Sales/CS: Month 6 start, $11K/mo',
    'Growth: Month 14 start, $10K/mo',
    'Legal/Compliance: $2K/mo ongoing',
    'Marketing: $2K → $6K → $12K/mo (organic → paid → scale)',
    'App Store commission: 30% on consumer subscriptions',
    'G&A: $1,500/mo',
  ],
};

export const documentIndex = [
  { name: 'Cap Table', version: 'v1.5.1 FINAL', description: 'Constitutional governing document. Share class definitions, voting formula, allocation map, tithe covenant, succession provisions. Source of truth for all structural provisions.' },
  { name: 'Executive Summary', version: 'v2', description: '6-page investor briefing. Opportunity, traction, founder profile, market, revenue model, investment structure, tithe, use of funds, financial summary.' },
  { name: 'Investor Deck', version: 'v2', description: '13-slide presentation. Visual overview of the investment opportunity for in-person or remote presentation.' },
  { name: 'Term Sheet', version: 'v3', description: 'Summary of indicative terms for Series 1 Redeemable Preferred Units. Non-binding. Includes entity conversion mechanics, redemption path assurance, and stress test.' },
  { name: 'Financial Model', version: 'v3', description: '36-month P&L with monthly granularity. Assumptions, revenue projections, operating expenses, cash position, redemption analysis, annual summary.' },
  { name: 'Investor FAQ', version: 'v3', description: '20 questions across 7 categories. Preempts common investor questions on instrument, governance, redemption, tithe, structure, risk, and mechanics.' },
  { name: 'Ratification Certificate', version: 'v2', description: 'One-page signing artifact converting Cap Table from "Final Ratification Draft" to "RATIFIED." Cross-references all package documents.' },
];
