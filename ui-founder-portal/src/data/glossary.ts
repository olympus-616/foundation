export interface GlossaryTerm {
  term: string;
  definition: string;
  appearsIn: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  { term: 'Accredited Investor', definition: 'An individual with net worth >$1M (excl. primary residence) or income >$200K ($300K joint) for the past two years, as defined by SEC Rule 501.', appearsIn: ['FAQ', 'Term Sheet'] },
  { term: 'AppExchange', definition: 'Salesforce\'s marketplace for third-party applications. A distribution channel for Olympus-Grid\'s enterprise offering.', appearsIn: ['Exec Summary'] },
  { term: 'Class A Shares', definition: 'Voting Common shares held by non-Founder equity holders. One vote per share. Issued for all grants from the 49-point allocation pool unless stated otherwise.', appearsIn: ['Cap Table'] },
  { term: 'Class B Shares', definition: 'Founder shares with variable voting multiple (Voting Adjustment Formula). Cannot be transferred. Maintains ≥51% voting control automatically.', appearsIn: ['Cap Table'] },
  { term: 'Class C Shares', definition: 'Non-Voting Common shares. Zero votes per share. Economic participation without governance. Series 1 Units convert to Class C upon C-Corp formation.', appearsIn: ['Cap Table', 'Term Sheet'] },
  { term: 'CloudPremise LLC', definition: 'The issuing entity. A Colorado limited liability company that intends to convert to a Delaware C-Corporation within 90 days of closing.', appearsIn: ['All Documents'] },
  { term: 'Cosmos Logos', definition: 'The protocol specification owned by the Olympus Foundation. Defines the philosophical and technical framework for sovereign AI infrastructure.', appearsIn: ['Cap Table', 'Term Sheet'] },
  { term: 'Coverage Ratio', definition: 'Cash available divided by total redemption payout. A ratio ≥1.0x indicates full coverage from operations. M36 projected coverage: 1.13x.', appearsIn: ['Financial Model', 'Redemption Analysis'] },
  { term: 'CTA (Certified Technical Architect)', definition: 'The highest technical certification in the Salesforce ecosystem, held by fewer than 500 people globally. The Founder holds this credential.', appearsIn: ['Exec Summary', 'FAQ'] },
  { term: 'Division B.1', definition: 'The section of the Cap Table (Points 31–34) designated for Non-Voting Investment Capital. Series 1 Preferred Units are issued pursuant to this division.', appearsIn: ['Cap Table', 'Term Sheet'] },
  { term: 'ECS/Fargate', definition: 'AWS container orchestration services used for Olympus-Grid\'s cloud deployment, proving portability from local to cloud environments.', appearsIn: ['Exec Summary'] },
  { term: 'Liquidity Event', definition: 'Sale/merger (Founder loses majority voting), sale of substantially all assets/IP, IPO, or change of control >50%. Triggers mandatory redemption.', appearsIn: ['Term Sheet'] },
  { term: 'Managing Member', definition: 'The Founder, in their capacity as sole manager of CloudPremise LLC. Retains exclusive management authority under the operating agreement.', appearsIn: ['Term Sheet', 'Cap Table'] },
  { term: 'Mandatory Redemption', definition: 'The contractual obligation for the Company to repurchase all Series 1 Units no later than Month 36 at the Redemption Price.', appearsIn: ['Term Sheet', 'FAQ'] },
  { term: 'MCP (Model Context Protocol)', definition: 'An industry-standard protocol (adopted by Anthropic) for AI-to-service connectivity. Olympus-Grid uses MCP for enterprise integrations.', appearsIn: ['Exec Summary'] },
  { term: 'Non-Participating', definition: 'The characteristic of Series 1 Units that limits returns to the stated preference. Holders do not participate in upside beyond preferred return and premium.', appearsIn: ['Term Sheet', 'FAQ'] },
  { term: 'OAuth 2.0 PKCE', definition: 'A secure authentication protocol used by Olympus-Grid for enterprise integrations (e.g., Salesforce). Proof Key for Code Exchange prevents authorization code interception.', appearsIn: ['Exec Summary'] },
  { term: 'Olympus Foundation', definition: 'A separate entity that owns the Cosmos Logos protocol and receives the 7% tithe. Dedicated to eliminating human suffering through technology.', appearsIn: ['All Documents'] },
  { term: 'Olympus-Grid', definition: 'The sovereign AI infrastructure platform. A 31-service mesh enabling AI deployment on any hardware under full user control. The commercial product of CloudPremise LLC.', appearsIn: ['All Documents'] },
  { term: 'Preferred Return', definition: 'The cumulative 8% per annum return accruing on the unredeemed Investment Amount. Payable upon redemption, Liquidity Event, or annually at Company\'s election.', appearsIn: ['Term Sheet'] },
  { term: 'Redemption Premium', definition: 'An additional payment above principal and preferred return: 10% (M1–12), 15% (M13–24), 20% (M25–36). Escalates by period.', appearsIn: ['Term Sheet', 'FAQ'] },
  { term: 'Redemption Price', definition: 'Principal + Accrued Preferred Return + Redemption Premium. The total amount payable upon redemption.', appearsIn: ['Term Sheet'] },
  { term: 'Regulation D', definition: 'SEC exemption from securities registration. The Company intends to structure the offering under Rule 506(b) or 506(c).', appearsIn: ['FAQ'] },
  { term: 'ROFR (Right of First Refusal)', definition: 'The Company\'s 30-day right to purchase any Series 1 Units before they can be transferred to a third party.', appearsIn: ['Term Sheet'] },
  { term: 'Series 1 Redeemable Preferred Units', definition: 'The investment instrument: non-voting, non-participating membership interests with 8% cumulative preferred return, redemption premium, and mandatory 36-month redemption.', appearsIn: ['All Documents'] },
  { term: 'Sovereign Architecture', definition: 'The design principle that users control their own AI infrastructure: own hardware, own models, own data, own security posture. Zero vendor lock-in.', appearsIn: ['Exec Summary', 'FAQ'] },
  { term: 'Steward Fiduciary Obligation', definition: 'Cap table provision requiring a temporary steward (upon Founder incapacitation/death) to preserve the company and tithe. Steward cannot sell or modify the Tithe.', appearsIn: ['Cap Table', 'FAQ'] },
  { term: 'Tithe Covenant', definition: 'The irrevocable obligation requiring 7% of recognized gross revenue to the Olympus Foundation, quarterly, in perpetuity. Senior to all distributions. Cannot be modified.', appearsIn: ['All Documents'] },
  { term: 'TurtleShell.ai', definition: 'The consumer-facing iPhone application that connects to the Olympus-Grid mesh. Premium tiers: Pro ($19.99/mo) and Sovereign ($49.99/mo).', appearsIn: ['Exec Summary', 'Financial Model'] },
  { term: 'Voting Adjustment Formula', definition: 'The automatic recalculation of Class B votes-per-share to maintain Founder\'s ≥51% voting control. Self-executing, no approval required. Capped at 100x.', appearsIn: ['Cap Table'] },
];
