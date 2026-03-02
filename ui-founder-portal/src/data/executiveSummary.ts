export interface SummarySection {
  title: string;
  content: string[];
}

export const executiveSummarySections: SummarySection[] = [
  {
    title: 'The Opportunity',
    content: [
      'The AI industry is consolidating around a model that strips users of control. Every major platform — OpenAI, Google, Microsoft — requires users to send their data to someone else\'s servers, run someone else\'s models, and accept someone else\'s terms. Enterprises in regulated industries (healthcare, financial services, government) face an impossible choice: adopt AI and accept the compliance risk, or refuse AI and accept the competitive risk.',
      'Olympus-Grid eliminates that choice.',
      'Olympus-Grid is a sovereign AI infrastructure platform that enables any user — individual or enterprise — to run AI on their own hardware, with their own models, connected to their own data, under their own control. The platform deploys identically across local machines, private clouds, and public infrastructure with zero code changes. Users choose their AI models, their deployment location, and their security posture. The platform connects to enterprise systems (Salesforce, Google Calendar, HubSpot, and others) through OAuth-authorized APIs — secure, permissioned, revocable.',
    ],
  },
  {
    title: 'What Exists Today',
    content: [
      'This is not a pitch for a product that hasn\'t been built. Olympus-Grid is operational:',
      '• A 31-service mesh running simultaneously on local hardware, with automatic health monitoring, self-healing fleet management, and comprehensive logging across all components.',
      '• An iPhone application (TurtleShell.ai) that connects to the mesh, streams AI responses in real-time, and integrates with Salesforce through OAuth 2.0 PKCE authentication — all running through the sovereign infrastructure.',
      '• The complete architecture deployed on AWS ECS/Fargate with CloudFront distribution, proving portability across local development and cloud environments.',
      '• Enterprise Salesforce integration demonstrating CRM data access through MCP (Model Context Protocol) — the same protocol Anthropic has adopted as the industry standard for AI-to-service connectivity.',
      'The platform has been in development for four years. The investment funds commercialization of working technology, not research.',
    ],
  },
  {
    title: 'The Founder',
    content: [
      'The Founder is a Salesforce Certified Technical Architect (CTA) — the highest technical certification in the Salesforce ecosystem, held by fewer than 500 people globally. His career spans enterprise architecture for healthcare, life sciences, and financial services organizations, including multi-org Salesforce consolidations, legacy CRM migrations, and the design and delivery of platforms handling sensitive regulated data.',
      'Prior to Olympus-Grid, the Founder co-founded a native Salesforce ISV that was successfully acquired. He brings direct experience building, scaling, and exiting enterprise technology products.',
      'The Founder designed, built, and deployed the entire Olympus-Grid platform — 31 services, the iOS application, the enterprise integrations, and the infrastructure automation — as a solo engineer over four years. The investment funds the transition from solo development to a commercial operation.',
    ],
  },
  {
    title: 'The Market',
    content: [
      'The sovereign AI infrastructure market is emerging as the counterweight to centralized AI platforms. Key market dynamics:',
      '• Enterprise AI spending is accelerating. Gartner projects enterprise AI spending exceeding $300 billion by 2027. The fastest-growing segment is on-premises and private cloud AI deployment — exactly what Olympus-Grid enables.',
      '• Regulatory pressure is increasing. GDPR, CCPA, HIPAA, and emerging AI regulations are making data sovereignty a legal requirement, not a preference.',
      '• The Salesforce ecosystem is massive and underserved. Salesforce has 150,000+ customers. The AppExchange is a proven distribution channel. A CTA-built AI integration for Salesforce has a built-in market and a credible path to distribution.',
    ],
  },
  {
    title: 'Revenue Model',
    content: [
      'Consumer (TurtleShell.ai): Free iPhone app with premium tiers. Pro ($19.99/month) provides cloud AI with advanced features. Sovereign ($49.99/month) provides local AI with complete data sovereignty.',
      'Enterprise (Olympus Grid): Tiered pricing from $500/month (small teams) to $7,500/month (dedicated deployment with SLA). The Founder\'s CTA credential and enterprise architecture background provide direct access to enterprise buyers.',
      '36-Month Targets: $4.5M annualized revenue run rate by Month 36. 55 enterprise clients at $3,000 blended ARPU. 6,860 paid consumer subscribers. Total 36-month revenue: $4.73M.',
    ],
  },
  {
    title: 'Investment Structure',
    content: [
      'Entity: CloudPremise LLC (Colorado) today. The Company intends to convert to a Delaware C-Corporation within 90 days of closing. Upon conversion, Series 1 Units automatically convert into Class C Shares (Non-Voting Common) on identical economic terms.',
      'Returns: 8% cumulative preferred return plus a 10–20% redemption premium (escalating by period). Maximum total payout at Month 36: $2,880,000 — representing a 44% total return over 36 months.',
      'Governance: Zero. No voting rights, no board seats, no consent rights, no protective provisions. The Managing Member retains 100% operational control.',
      'Mandatory Redemption: The Company MUST redeem all units by Month 36. The Investor\'s economic interest terminates upon redemption.',
      'Downside Protection: Non-participating liquidation preference ensures return of capital plus accrued return before any distributions to common equity holders.',
    ],
  },
  {
    title: 'The Tithe',
    content: [
      'Seven percent (7%) of every dollar of gross revenue is remitted to the Olympus Foundation — irrevocable, encoded in the governing documents, non-negotiable.',
      'Priority: The Tithe Covenant is senior to all other distributions, including the preferred return on Series 1 Units and any common distributions. The Investor\'s economic participation is in 93¢ of every dollar of gross revenue.',
      'Projected 36-month tithe: $331,210 to the Foundation.',
    ],
  },
  {
    title: 'Use of Funds',
    content: [
      'Product & Engineering (~50%): Three engineering hires over 14 months. Platform hardening, App Store launch, enterprise integration expansion.',
      'Go-to-Market (~25%): Enterprise sales hire (Month 6), growth marketing hire (Month 14). AppExchange listing.',
      'Operations & Legal (~15%): Delaware C-Corp formation (within 90 days of closing), securities counsel, compliance. Founder salary below market rate.',
      'Reserve (~10%): Working capital buffer.',
    ],
  },
];

export const financialSummaryTable = {
  headers: ['', 'Year 1', 'Year 2', 'Year 3'],
  rows: [
    { label: 'Total Revenue', values: [201909, 1239081, 3290616] },
    { label: 'Operating Expenses', values: [522173, 1058326, 1555683] },
    { label: 'Net Operating Income', values: [-334398, 94019, 1504593] },
    { label: 'Closing Cash', values: [1665602, 1759621, 3264214] },
  ],
};
