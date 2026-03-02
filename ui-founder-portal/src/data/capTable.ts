export interface ShareClass {
  name: string;
  label: string;
  holders: string;
  votesPerShare: string;
  description: string;
}

export const shareClasses: ShareClass[] = [
  {
    name: 'Class A',
    label: 'Voting Common',
    holders: 'Non-Founder equity holders',
    votesPerShare: '1 vote per share',
    description: 'All grants from 49-point pool issued as Class A unless stated otherwise.',
  },
  {
    name: 'Class B',
    label: 'Founder',
    holders: 'Exclusively the Founder',
    votesPerShare: 'Variable (Voting Adjustment Formula)',
    description: 'Maintains minimum 51% voting control automatically. Cannot be transferred except to succession vehicle. 100x voting multiple ceiling.',
  },
  {
    name: 'Class C',
    label: 'Non-Voting Common',
    holders: 'Friends & Family, Non-Voting Investment Capital',
    votesPerShare: '0 votes per share',
    description: 'Economic participation without voting rights. Series 1 Preferred converts to Class C upon C-Corp formation.',
  },
];

export interface AllocationRow {
  division: string;
  points: string;
  purpose: string;
  status: string;
}

export const allocationMap: AllocationRow[] = [
  { division: 'A — Operational Equity', points: '1–30', purpose: 'Employees, advisors, key hires', status: '49-point Founder-controlled pool' },
  { division: 'B.1 — Non-Voting Capital', points: '31–34', purpose: 'Revenue-based financing, SAFEs, Class C equity', status: 'Series 1 instrument (transient)' },
  { division: 'B.2 — Voting Capital', points: '35–37', purpose: 'Strategic/institutional investors with governance', status: 'Reserved' },
  { division: 'C — Advisors & Board', points: '38–42', purpose: 'Advisory, board compensation', status: 'Reserved' },
  { division: 'D — Reserve', points: '43–49', purpose: 'Strategic flexibility', status: 'Founder discretion' },
];

export const keyProvisions = [
  'Transfer restrictions with ROFR and Founder consent',
  'Succession provisions (Steward Fiduciary Obligation)',
  'Economic dilution pro-rata across all classes; voting preserved through formula',
  'Tithe Covenant encoded as irrevocable constitutional provision',
];
