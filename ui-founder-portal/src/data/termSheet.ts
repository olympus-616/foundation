export interface TermRow {
  term: string;
  details: string;
}

export const termSheetHeader = {
  entity: 'CloudPremise LLC',
  instrument: 'Series 1 Redeemable Preferred Units',
  subtitle: 'Summary of Indicative Terms | For Discussion Purposes Only',
  alignment: 'Aligned with Olympus-Grid Cap Table v1.5.1 — Division B.1',
};

export const terms: TermRow[] = [
  {
    term: 'Issuer',
    details: 'CloudPremise LLC, a Colorado limited liability company. The Company intends to convert to a Delaware C-Corporation (the "Successor Entity") using a portion of the investment proceeds. Upon such conversion, all rights and obligations under this instrument shall automatically transfer to the Successor Entity on identical economic terms. No additional Investor consent is required for the conversion.',
  },
  {
    term: 'Investor(s)',
    details: '[Investor Name(s)]',
  },
  {
    term: 'Investment Amount',
    details: '$2,000,000 USD',
  },
  {
    term: 'Type of Security',
    details: 'Series 1 Redeemable Preferred Units (non-voting, non-participating). Upon conversion to a C-Corporation, Series 1 Units shall convert into an equivalent number of Class C Shares (Non-Voting Common) as defined in the Company\'s Cap Table (v1.5.1), Article II, Section 2.3, carrying identical economic rights and zero voting rights. No protective provisions shall attach to such Class C Shares except those required by applicable law.',
  },
  {
    term: 'Unit Economics',
    details: 'Total authorized: 2,000,000 units at $1.00/unit. Pre-money valuation implied: $20,000,000. Investor ownership: 10% economic, 0% voting. Cap Table Reconciliation: Series 1 Units represent a transient economic position that self-terminates upon mandatory redemption. Division B.1 (Points 31–34, 4% of fully diluted equity) defines standing capacity for non-voting capital. Series 1 occupies a separate time-limited economic layer. The 10% economic interest is calculated on a pre-money basis ($2M / $20M) and applies only during the instrument\'s active period.',
  },
  {
    term: 'Preferred Return',
    details: '8% per annum, cumulative, on unredeemed Investment Amount. Payable upon redemption, Liquidity Event, or annually at Company\'s election. Priority Order: Tithe Covenant is senior to all preferred return payments. Preferred return is senior to common distributions but subordinate to the Tithe Covenant.',
  },
  {
    term: 'Mandatory Redemption',
    details: 'Company SHALL redeem all Series 1 Units no later than 36 months from issuance. Redemption Price = Principal + Accrued Return + Premium.',
  },
  {
    term: 'Liquidity Event',
    details: 'Defined as: (a) sale/merger where Founder loses majority voting; (b) sale of substantially all assets/IP; (c) IPO; (d) change of control >50%. Series 1 redeems at applicable Redemption Price prior to common distributions (subject to Tithe).',
  },
  {
    term: 'Optional Early Redemption',
    details: 'M1–12: Principal + Return + 10% premium. M13–24: +15%. M25–36: +20%. Minimum partial: $250,000.',
  },
  {
    term: 'Voting Rights',
    details: 'ZERO. All voting with Managing Member. No say in management, operations, strategy, IP, or any decisions.',
  },
  {
    term: 'Liquidation Preference',
    details: 'Subject to Tithe: (1) Return of principal, (2) Accrued return, (3) Premium. Then all remaining to Common. Non-participating.',
  },
  {
    term: 'Governance',
    details: 'No board seats, observer rights, advisory positions, consent rights, or approval rights. Quarterly financial summaries + annual statements only.',
  },
  {
    term: 'Transfer Restrictions',
    details: 'Company consent required. 30-day ROFR. No competitor transfers. No secondary sales without Founder consent.',
  },
  {
    term: 'Intellectual Property',
    details: 'All IP sole property of Company. Series 1 confers no IP rights.',
  },
  {
    term: 'Use of Funds',
    details: 'Olympus-Grid development, TurtleShell.ai launch, enterprise sales, C-Corp formation, operations, hiring.',
  },
  {
    term: 'Anti-Dilution',
    details: 'Not applicable. Fixed economic terms, no conversion rights.',
  },
  {
    term: 'Governing Law',
    details: 'Colorado. Transitions to Delaware upon C-Corp conversion.',
  },
  {
    term: 'Legal Fees',
    details: 'Company covers up to $15,000 of Investor\'s reasonable legal fees.',
  },
];

export const entityConversionSteps = [
  'Investment closes into CloudPremise LLC — Series 1 issued as LLC units',
  'Within 90 days: Delaware C-Corp formed, dual-class share structure adopted',
  'Series 1 auto-converts to Class C Shares (Non-Voting Common), 1:1, identical economics',
  'All LLC obligations assumed by Successor Entity',
];

export const founderControlProvisions = [
  '100% Voting Control',
  'No Board',
  'Mandatory Redemption Path (interest terminates M36)',
  'Non-Participating (no upside beyond stated preference)',
];

export const nonBindingDisclaimer = 'This term sheet is for discussion purposes only and does not constitute a binding agreement. The terms described herein are indicative and subject to the execution of definitive legal agreements, completion of due diligence, and satisfaction of customary closing conditions. Either party may terminate discussions at any time without liability.';
