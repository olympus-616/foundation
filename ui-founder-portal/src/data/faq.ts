export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export const faqCategories: FAQCategory[] = [
  {
    title: 'The Instrument',
    items: [
      {
        question: 'What exactly am I investing in?',
        answer: 'Series 1 Redeemable Preferred Units issued by CloudPremise LLC. These are non-voting, non-participating membership interests with a cumulative 8% preferred return and a mandatory redemption no later than Month 36. Think of it as a structured fixed-return position with equity-like liquidation protection, not traditional equity. Your economic interest terminates upon redemption.',
      },
      {
        question: 'Why redeemable preferred instead of equity?',
        answer: 'Because the objective is aligned returns without permanent dilution. You receive a fixed economic return (up to 44% total at Month 36) with downside protection (liquidation preference senior to common). The Founder retains 100% of the company\'s long-term equity value, which means every dollar of effort goes into building the platform\'s value — not into managing the complexities of a permanent equity investor relationship. You get paid. You get out. The company keeps building.',
      },
      {
        question: 'What is my maximum return?',
        answer: 'Month 12: $2,360,000 (18% total return). Month 24: $2,620,000 (31% total return). Month 36: $2,880,000 (44% total return). These are contractual obligations, not projections. The only variable is timing.',
      },
      {
        question: 'Is there any upside beyond the stated return?',
        answer: 'No. Series 1 Units are non-participating. You receive your preferred return and redemption premium, and nothing more. If you want uncapped upside, this is not the right instrument. If you want predictable, high-yield fixed returns with downside protection, it is.',
      },
    ],
  },
  {
    title: 'Governance & Control',
    items: [
      {
        question: 'Why do I have zero voting rights?',
        answer: 'Because Olympus-Grid\'s value is inseparable from its Founder\'s architectural vision. The platform is a 31-service mesh designed and built by a single engineer over four years. Introducing governance fragmentation at this stage would compromise the speed and coherence that makes the technology valuable. Your investment funds commercialization of a working product, not a committee\'s deliberation over product direction.',
      },
      {
        question: 'What if the Founder makes decisions I disagree with?',
        answer: 'Your protection is economic, not political. You have a liquidation preference senior to all common distributions (after the Tithe Covenant). You have a mandatory redemption that forces the Company to return your capital with a premium by Month 36. You have quarterly financial reporting. What you do not have is a veto, a board seat, or a voice in operational decisions.',
      },
      {
        question: 'What information rights do I have?',
        answer: 'Quarterly financial summaries and annual audited statements. Revenue, expenses, cash position, tithe payments, milestone progress. No product roadmap details, IP documentation, or strategic plans.',
      },
    ],
  },
  {
    title: 'Redemption & Liquidity',
    items: [
      {
        question: 'How does the Company plan to fund my redemption?',
        answer: 'Three paths: Primary — revenue-funded ($3.26M projected cash at M36 vs $2.88M obligation). Secondary — Series A proceeds at >$40M valuation. Tertiary — revenue-based financing or credit facility. 36 months provides three fiscal years across multiple paths.',
      },
      {
        question: 'What happens if the Company can\'t redeem at Month 36?',
        answer: 'The obligation does not disappear. Failure to redeem constitutes default. Your liquidation preference remains senior. The Founder\'s entire equity position is subordinate to your preference. A Redemption Extension clause at higher premium can be negotiated.',
      },
      {
        question: 'What if there\'s a sale or IPO before Month 36?',
        answer: 'A Liquidity Event triggers redemption at the applicable price before common distributions. You get paid first.',
      },
      {
        question: 'Can I sell or transfer my units?',
        answer: 'Only with Company consent. 30-day ROFR. No competitor transfers. No secondary sales without Founder consent. This is a hold-to-redemption instrument.',
      },
    ],
  },
  {
    title: 'The Tithe',
    items: [
      {
        question: 'Why does 7% of gross revenue go to a foundation?',
        answer: 'The Tithe Covenant ensures every dollar of revenue automatically allocates 7¢ to the Olympus Foundation, dedicated to eliminating human suffering through technology. Irrevocable, encoded in governing documents.',
      },
      {
        question: 'Does the tithe reduce my returns?',
        answer: 'Yes. Your participation is in 93¢ of every dollar. The tithe is senior to all distributions including your preferred return. The $3.26M closing cash at M36 is after tithe payments.',
      },
      {
        question: 'Can the tithe be suspended or reduced?',
        answer: 'No. Cannot be modified by any officer, board, or shareholder vote. Deferrals accrue interest at fed funds + 2%. Executive comp capped at 50th percentile during deferral. The tithe is architecture, not policy.',
      },
    ],
  },
  {
    title: 'Cap Table & Structure',
    items: [
      {
        question: 'How does my 10% relate to the 4-point B.1 allocation?',
        answer: 'Series 1 is a transient economic layer that self-terminates at redemption. Division B.1 (4% of fully diluted equity) is the standing capacity. Series 1 sits above as a time-limited overlay. The 10% is pre-money ($2M/$20M), active only during the instrument\'s life.',
      },
      {
        question: 'What happens when the LLC converts to a C-Corp?',
        answer: 'Within 90 days: Delaware C-Corp formed. Your units auto-convert to Class C Shares (Non-Voting Common), 1:1, identical economics. No action required.',
      },
      {
        question: 'What is the $20M valuation based on?',
        answer: 'Four years of development, 31-service platform, CTA credential, prior exit, sovereign AI market potential. Conservative vs comparable pre-revenue AI infrastructure. But because this is fixed-return with mandatory redemption, valuation affects Founder dilution, not your returns. Whether worth $20M or $200M at M36, your max payout is $2,880,000.',
      },
    ],
  },
  {
    title: 'Risk',
    items: [
      {
        question: 'What are the biggest risks?',
        answer: 'Revenue underperformance (70% scenario = ~$1.8M cash, activates secondary/tertiary paths). Solo-founder dependency (mitigated by Steward Fiduciary Obligation). App Store timing (enterprise revenue is independent). AI model costs (sovereign architecture allows local execution via Ollama).',
      },
      {
        question: 'What happens if the Company fails entirely?',
        answer: 'Liquidation preference is senior to common (after Tithe). You receive: (1) principal, (2) accrued return, (3) premium — before Founder. Does not guarantee full recovery. This is an investment, not a deposit.',
      },
    ],
  },
  {
    title: 'Mechanics',
    items: [
      {
        question: 'Minimum investment?',
        answer: '$2,000,000 total raise. May split across investors in $250K+ increments at Managing Member\'s discretion.',
      },
      {
        question: 'Next steps?',
        answer: '(1) Review package. (2) Due diligence call. (3) Legal review (Company covers up to $15K). (4) Execute definitive agreements. (5) Fund.',
      },
      {
        question: 'Is this a securities offering?',
        answer: 'Non-binding summary for discussion only. Will comply with Reg D (506(b) or 506(c)). Accredited investors required.',
      },
    ],
  },
];
