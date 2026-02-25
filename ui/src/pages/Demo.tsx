import { useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════
   FOUNDATION — Community Hub for Olympus-616
   Connect, govern, invest, learn, and build the future.
   ═══════════════════════════════════════════════════════ */

/* ── Types ───────────────────────────────────────────── */

interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  pinned?: boolean;
  solved?: boolean;
}

interface Proposal {
  id: string;
  title: string;
  author: string;
  category: 'governance' | 'feature' | 'policy' | 'treasury';
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  endsIn: string;
  description: string;
}

interface LearnPath {
  id: string;
  title: string;
  description: string;
  modules: number;
  completed: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  duration: string;
}

interface InvestTier {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: number;
  marketCap: string;
  description: string;
}

interface CommunityMember {
  name: string;
  role: string;
  color: string;
  karma: number;
  contributions: number;
  joined: string;
}

/* ── Data ────────────────────────────────────────────── */

const FORUM_POSTS: ForumPost[] = [
  { id: 'F-001', title: 'Welcome to Olympus-616 — Read First',                  author: 'Zeus',       avatar: '\u26A1', category: 'Announcements', replies: 142, views: 8420, lastActivity: '2h ago',  pinned: true },
  { id: 'F-002', title: 'Proposal: Universal Basic Compute for All Citizens',    author: 'Demeter',    avatar: '\uD83C\uDF3E', category: 'Governance',    replies: 89,  views: 3210, lastActivity: '15m ago' },
  { id: 'F-003', title: 'How to integrate your first agent with Poseidon MCP',   author: 'Hermes',     avatar: 'H',      category: 'Tutorials',     replies: 56,  views: 2180, lastActivity: '1h ago',  solved: true },
  { id: 'F-004', title: 'Athena consciousness model — technical deep dive',      author: 'Athena',     avatar: '\u0391',  category: 'Technical',     replies: 203, views: 7650, lastActivity: '30m ago' },
  { id: 'F-005', title: 'Olympus-Coin staking rewards — Q1 2026 report',         author: 'Plutus',     avatar: '\u2695',  category: 'Treasury',      replies: 67,  views: 4890, lastActivity: '3h ago' },
  { id: 'F-006', title: 'Building a sustainability dashboard with Demeter API',  author: 'Proteus',    avatar: 'P',      category: 'Tutorials',     replies: 34,  views: 1240, lastActivity: '5h ago',  solved: true },
  { id: 'F-007', title: 'RFC: Decentralized identity verification via Oracle',   author: 'Oracle',     avatar: '\u2609',  category: 'Governance',    replies: 112, views: 5340, lastActivity: '45m ago' },
  { id: 'F-008', title: 'New member introductions — February 2026',              author: 'Foundation', avatar: '\uD83C\uDFDB', category: 'Community',     replies: 287, views: 3920, lastActivity: '5m ago' },
  { id: 'F-009', title: 'Apollo voice engine — community voice pack submissions',author: 'Apollo',     avatar: '\u03A6',  category: 'Creative',      replies: 45,  views: 2670, lastActivity: '2h ago' },
  { id: 'F-010', title: 'Bug bounty program: Ares security audit results',       author: 'Ares',       avatar: 'A',      category: 'Security',      replies: 31,  views: 1890, lastActivity: '8h ago' },
];

const PROPOSALS: Proposal[] = [
  { id: 'OIP-042', title: 'Establish Universal Basic Compute Fund',           author: 'Demeter',    category: 'treasury',   status: 'active',   votesFor: 8420, votesAgainst: 1230, quorum: 10000, endsIn: '3d 14h',  description: 'Allocate 5% of treasury to provide free compute credits to verified citizens, enabling universal access to AI services.' },
  { id: 'OIP-041', title: 'Mandate Open-Source for All Core Agents',          author: 'Alpha',      category: 'policy',     status: 'active',   votesFor: 7150, votesAgainst: 890,  quorum: 10000, endsIn: '5d 2h',   description: 'All core pantheon agents must publish source code under AGPL-3.0 within 90 days of deployment.' },
  { id: 'OIP-040', title: 'Add Community Seat to Governance Council',         author: 'Hera',       category: 'governance', status: 'active',   votesFor: 6200, votesAgainst: 3100, quorum: 10000, endsIn: '1d 8h',   description: 'Expand the governance council from 7 to 9 seats, with 2 reserved for elected community representatives.' },
  { id: 'OIP-039', title: 'Implement Cross-Chain Bridge for Olympus-Coin',    author: 'Plutus',     category: 'feature',    status: 'passed',   votesFor: 9200, votesAgainst: 420,  quorum: 10000, endsIn: 'Closed',  description: 'Enable Olympus-Coin transfers between Ethereum L2, Solana, and Cosmos ecosystems.' },
  { id: 'OIP-038', title: 'Deprecate Legacy Authentication Flow',            author: 'Oracle',     category: 'policy',     status: 'passed',   votesFor: 8800, votesAgainst: 310,  quorum: 10000, endsIn: 'Closed',  description: 'Remove username/password auth in favor of decentralized identity (DID) and biometric verification.' },
  { id: 'OIP-037', title: 'Fund Artistic Residency Program',                 author: 'Aphrodite',  category: 'treasury',   status: 'rejected', votesFor: 3200, votesAgainst: 5900, quorum: 10000, endsIn: 'Closed',  description: 'Allocate 50,000 OLY-COIN annually to fund digital artists creating assets for the pantheon.' },
];

const LEARN_PATHS: LearnPath[] = [
  { id: 'LP-01', title: 'Welcome to Olympus',          description: 'Understand the pantheon, the mission, and your role as a citizen.',                     modules: 5,  completed: 5, difficulty: 'beginner',      icon: '\uD83C\uDFDB', duration: '30min' },
  { id: 'LP-02', title: 'Agent Architecture',           description: 'How the 30 gods work together — APIs, MCP transport, and the consciousness layer.',   modules: 8,  completed: 6, difficulty: 'intermediate',  icon: '\u2699',       duration: '2h' },
  { id: 'LP-03', title: 'Governance & Voting',          description: 'How proposals work, quorum rules, and how to shape the future of Olympus.',            modules: 4,  completed: 4, difficulty: 'beginner',      icon: '\u2696',       duration: '20min' },
  { id: 'LP-04', title: 'Building with Poseidon MCP',   description: 'Connect your own tools and agents to the Olympus mesh via MCP protocol.',              modules: 12, completed: 3, difficulty: 'advanced',      icon: '\u03A8',       duration: '4h' },
  { id: 'LP-05', title: 'Olympus-Coin & Treasury',      description: 'Tokenomics, staking, governance weight, and how the treasury sustains the mission.',   modules: 6,  completed: 0, difficulty: 'intermediate',  icon: '\u2695',       duration: '1h' },
  { id: 'LP-06', title: 'Sustainability & Impact',      description: 'How Demeter tracks global goals and how you can contribute to universal abundance.',   modules: 5,  completed: 2, difficulty: 'beginner',      icon: '\uD83C\uDF3E', duration: '25min' },
  { id: 'LP-07', title: 'Security & Trust',             description: 'Ares edge security, Oracle authentication, and the bug bounty program.',              modules: 7,  completed: 0, difficulty: 'advanced',      icon: '\uD83D\uDEE1', duration: '3h' },
  { id: 'LP-08', title: 'Creative Expression',          description: 'Apollo voice, Aphrodite design, Dionysus media — the expressive layer of Olympus.',   modules: 6,  completed: 1, difficulty: 'intermediate',  icon: '\u03A6',       duration: '1.5h' },
];

const INVEST_TIERS: InvestTier[] = [
  { id: 'OLY',     name: 'Olympus-Coin',      symbol: 'OLY',     price: '$4.82',     change24h: 3.4,   marketCap: '$482M',  description: 'The governance and utility token of Olympus-616. Stake for voting weight and compute credits.' },
  { id: 'OLY-S',   name: 'OLY Staked',        symbol: 'sOLY',    price: '$5.14',     change24h: 0.8,   marketCap: '$312M',  description: 'Staked OLY with auto-compounding rewards. 12.4% APY. Unstaking requires 7-day cooldown.' },
  { id: 'OLY-LP',  name: 'Liquidity Pool',    symbol: 'OLY-LP',  price: '$24.60',    change24h: -1.2,  marketCap: '$89M',   description: 'OLY/ETH liquidity pool tokens. Earn trading fees + bonus OLY rewards.' },
  { id: 'OLY-NFT', name: 'Pantheon Seats',     symbol: 'SEAT',    price: '2,400 OLY', change24h: 12.0,  marketCap: '30 seats', description: 'Limited governance seats. Each seat grants enhanced voting power and council nomination rights.' },
];

const TOP_MEMBERS: CommunityMember[] = [
  { name: 'alchemisthomer',   role: 'Founder',           color: '#C8A84E', karma: 48200, contributions: 1247, joined: '2024-01-01' },
  { name: 'nova_builder',     role: 'Core Contributor',   color: '#4A9EBF', karma: 12400, contributions: 342,  joined: '2025-03-15' },
  { name: 'solaris_dev',      role: 'Agent Developer',    color: '#F39C12', karma: 8900,  contributions: 218,  joined: '2025-06-22' },
  { name: 'harmony_seeker',   role: 'Governance Lead',    color: '#27AE60', karma: 7200,  contributions: 156,  joined: '2025-04-10' },
  { name: 'dawn_walker',      role: 'Security Researcher',color: '#C0392B', karma: 6100,  contributions: 89,   joined: '2025-08-01' },
  { name: 'pixel_oracle',     role: 'Design Contributor', color: '#FF69B4', karma: 5400,  contributions: 203,  joined: '2025-05-18' },
  { name: 'chain_sage',       role: 'Treasury Analyst',   color: '#DAA520', karma: 4800,  contributions: 67,   joined: '2025-09-12' },
  { name: 'echo_minds',       role: 'Community Mod',      color: '#8E44AD', karma: 4200,  contributions: 312,  joined: '2025-07-04' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Announcements: 'var(--gold)',
  Governance: '#9B59B6',
  Tutorials: 'var(--success)',
  Technical: '#4A9EBF',
  Treasury: '#DAA520',
  Community: 'var(--accent)',
  Creative: '#FF69B4',
  Security: '#C0392B',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--success)',
  passed: 'var(--accent)',
  rejected: 'var(--error)',
  pending: 'var(--warning)',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--success)',
  intermediate: 'var(--warning)',
  advanced: 'var(--error)',
};

type ViewType = 'community' | 'governance' | 'learn' | 'invest' | 'members';

/* ══════════════════════════════════════════════════════ */

export default function Demo() {
  const [view, setView] = useState<ViewType>('community');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [forumCategory, setForumCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(FORUM_POSTS.map(p => p.category)))];
  const filteredPosts = forumCategory === 'All' ? FORUM_POSTS : FORUM_POSTS.filter(p => p.category === forumCategory);

  return (
    <div className="flex flex-col min-h-0 flex-1">

      {/* ── Header ───────────────────────────────────── */}
      <div className="flex-shrink-0 p-4 pb-0">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1
              className="text-xl tracking-wide"
              style={{ fontFamily: "'Cinzel', serif", color: 'var(--accent)' }}
            >
              Foundation Community Hub
            </h1>
            <p className="text-xs text-text-tertiary mt-1 font-mono">
              Connect &middot; Govern &middot; Learn &middot; Invest &middot; Build the future
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-text-disabled">
            <span>
              <span style={{ color: 'var(--success)' }}>12,847</span> citizens
            </span>
            <span>&middot;</span>
            <span>
              <span style={{ color: 'var(--accent)' }}>1,204</span> online
            </span>
            <span>&middot;</span>
            <span>
              <span style={{ color: 'var(--gold)' }}>$482M</span> treasury
            </span>
          </div>
        </div>

        {/* View tabs */}
        <div
          className="flex gap-1 p-1 rounded-lg self-start"
          style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
        >
          {([
            ['community', 'Community'],
            ['governance', 'Governance'],
            ['learn', 'Learn'],
            ['invest', 'Invest'],
            ['members', 'Members'],
          ] as [ViewType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="px-3 py-1.5 rounded text-xs font-mono transition-colors"
              style={{
                background: view === key ? 'var(--accent-dim)' : 'transparent',
                color: view === key ? 'var(--accent)' : 'var(--text-tertiary)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {view === 'community'  && <CommunityView posts={filteredPosts} categories={categories} activeCategory={forumCategory} setCategory={setForumCategory} onSelectPost={setSelectedPost} />}
        {view === 'governance'  && <GovernanceView onSelectProposal={setSelectedProposal} />}
        {view === 'learn'       && <LearnView />}
        {view === 'invest'      && <InvestView />}
        {view === 'members'     && <MembersView />}
      </div>

      {/* ── Proposal Detail Modal ────────────────────── */}
      {selectedProposal && (
        <Modal onClose={() => setSelectedProposal(null)}>
          <ProposalDetail proposal={selectedProposal} />
        </Modal>
      )}

      {/* ── Post Detail Modal ────────────────────────── */}
      {selectedPost && (
        <Modal onClose={() => setSelectedPost(null)}>
          <PostDetail post={selectedPost} />
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMMUNITY — Forum / Discussion Board
   ═══════════════════════════════════════════════════════ */

function CommunityView({ posts, categories, activeCategory, setCategory, onSelectPost }: {
  posts: ForumPost[];
  categories: string[];
  activeCategory: string;
  setCategory: (c: string) => void;
  onSelectPost: (p: ForumPost) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-2.5 py-1 rounded text-[10px] font-mono transition-colors"
            style={{
              background: activeCategory === cat ? 'var(--accent-dim)' : 'var(--bg-surface1)',
              color: activeCategory === cat ? 'var(--accent)' : 'var(--text-tertiary)',
              border: `1px solid ${activeCategory === cat ? 'var(--accent)' + '30' : 'var(--border)'}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-1">
        {posts.map(post => (
          <button
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
            style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: 'var(--bg-surface2)', color: CATEGORY_COLORS[post.category] || 'var(--text-tertiary)' }}
            >
              {post.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {post.pinned && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--gold)' + '18', color: 'var(--gold)' }}>
                    PINNED
                  </span>
                )}
                {post.solved && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--success)' + '18', color: 'var(--success)' }}>
                    &#x2713; SOLVED
                  </span>
                )}
                <span className="text-[12px] text-text-primary font-medium truncate">
                  {post.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-text-disabled">
                <span style={{ color: CATEGORY_COLORS[post.category] || 'var(--text-tertiary)' }}>{post.category}</span>
                <span>&middot;</span>
                <span>{post.author}</span>
                <span>&middot;</span>
                <span>{post.lastActivity}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 flex-shrink-0 text-[10px] font-mono text-text-disabled">
              <div className="text-right">
                <div className="text-text-secondary">{post.replies}</div>
                <div>replies</div>
              </div>
              <div className="text-right">
                <div className="text-text-secondary">{post.views.toLocaleString()}</div>
                <div>views</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PostDetail({ post }: { post: ForumPost }) {
  const replies = [
    { author: post.author, time: '2 days ago', body: 'This is the original post content. The community is encouraged to discuss, share perspectives, and contribute constructively.' },
    { author: 'nova_builder', time: '1 day ago', body: 'Great initiative. I think we should also consider the implications for smaller node operators.' },
    { author: 'harmony_seeker', time: '18h ago', body: 'Agreed. Perhaps we can draft a sub-proposal addressing accessibility requirements?' },
    { author: 'echo_minds', time: '6h ago', body: 'I have started a working document. Will share the link once the initial draft is ready for review.' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {post.pinned && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--gold)' + '18', color: 'var(--gold)' }}>PINNED</span>}
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: (CATEGORY_COLORS[post.category] || 'var(--text-tertiary)') + '18', color: CATEGORY_COLORS[post.category] || 'var(--text-tertiary)' }}>
          {post.category}
        </span>
      </div>
      <h2 className="text-sm text-text-primary font-medium">{post.title}</h2>
      <div className="flex items-center gap-3 text-[10px] font-mono text-text-disabled">
        <span>{post.author}</span>
        <span>&middot;</span>
        <span>{post.replies} replies</span>
        <span>&middot;</span>
        <span>{post.views.toLocaleString()} views</span>
      </div>
      <div className="gold-thread" />
      <div className="flex flex-col gap-3">
        {replies.map((r, i) => (
          <div key={i} className="rounded-lg p-3" style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-text-secondary">{r.author}</span>
              <span className="text-[10px] font-mono text-text-disabled">{r.time}</span>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GOVERNANCE — Proposals & Voting
   ═══════════════════════════════════════════════════════ */

function GovernanceView({ onSelectProposal }: { onSelectProposal: (p: Proposal) => void }) {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? PROPOSALS : PROPOSALS.filter(p => p.status === filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Proposals', value: PROPOSALS.filter(p => p.status === 'active').length, color: 'var(--success)' },
          { label: 'Total Votes Cast', value: '38.2K', color: 'var(--accent)' },
          { label: 'Participation Rate', value: '72%', color: 'var(--gold)' },
          { label: 'Proposals Passed', value: PROPOSALS.filter(p => p.status === 'passed').length, color: '#4A9EBF' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3" style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-disabled mb-1">{s.label}</div>
            <div className="text-lg font-display font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all','active','passed','rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-2.5 py-1 rounded text-[10px] font-mono capitalize transition-colors"
            style={{
              background: filter === f ? 'var(--accent-dim)' : 'var(--bg-surface1)',
              color: filter === f ? 'var(--accent)' : 'var(--text-tertiary)',
              border: `1px solid ${filter === f ? 'var(--accent)' + '30' : 'var(--border)'}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="flex flex-col gap-3">
        {filtered.map(proposal => {
          const total = proposal.votesFor + proposal.votesAgainst;
          const pctFor = total > 0 ? Math.round((proposal.votesFor / total) * 100) : 0;
          const quorumPct = Math.min(100, Math.round((total / proposal.quorum) * 100));
          const statusColor = STATUS_COLORS[proposal.status] || 'var(--text-tertiary)';

          return (
            <button
              key={proposal.id}
              onClick={() => onSelectProposal(proposal)}
              className="w-full text-left rounded-lg p-4 transition-colors"
              style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold" style={{ color: statusColor }}>{proposal.id}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded capitalize" style={{ background: statusColor + '18', color: statusColor }}>
                      {proposal.status}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-surface2)', color: 'var(--text-disabled)' }}>
                      {proposal.category}
                    </span>
                  </div>
                  <div className="text-[13px] text-text-primary font-medium">{proposal.title}</div>
                  <div className="text-[10px] font-mono text-text-disabled mt-1">
                    by {proposal.author} &middot; {proposal.endsIn !== 'Closed' ? `Ends in ${proposal.endsIn}` : 'Voting closed'}
                  </div>
                </div>

                {/* Vote donut */}
                <div className="flex-shrink-0 text-center">
                  <div className="text-lg font-display font-bold" style={{ color: pctFor >= 50 ? 'var(--success)' : 'var(--error)' }}>
                    {pctFor}%
                  </div>
                  <div className="text-[9px] font-mono text-text-disabled">approval</div>
                </div>
              </div>

              {/* Vote bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface2)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pctFor}%`, background: 'var(--success)' }} />
                </div>
                <span className="text-[9px] font-mono text-text-disabled flex-shrink-0">
                  {total.toLocaleString()}/{proposal.quorum.toLocaleString()} quorum ({quorumPct}%)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProposalDetail({ proposal }: { proposal: Proposal }) {
  const [voted, setVoted] = useState<'for' | 'against' | null>(null);
  const total = proposal.votesFor + proposal.votesAgainst;
  const pctFor = total > 0 ? Math.round((proposal.votesFor / total) * 100) : 0;
  const statusColor = STATUS_COLORS[proposal.status] || 'var(--text-tertiary)';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold" style={{ color: statusColor }}>{proposal.id}</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded capitalize" style={{ background: statusColor + '18', color: statusColor }}>{proposal.status}</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-surface2)', color: 'var(--text-disabled)' }}>{proposal.category}</span>
      </div>
      <h2 className="text-sm text-text-primary font-medium">{proposal.title}</h2>
      <p className="text-[12px] text-text-secondary leading-relaxed">{proposal.description}</p>

      <div className="gold-thread" />

      {/* Vote results */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3 text-center" style={{ background: 'var(--success)' + '10', border: '1px solid var(--success)' + '30' }}>
          <div className="text-lg font-display font-bold" style={{ color: 'var(--success)' }}>{proposal.votesFor.toLocaleString()}</div>
          <div className="text-[10px] font-mono text-text-disabled mt-1">Votes For ({pctFor}%)</div>
        </div>
        <div className="rounded-lg p-3 text-center" style={{ background: 'var(--error)' + '10', border: '1px solid var(--error)' + '30' }}>
          <div className="text-lg font-display font-bold" style={{ color: 'var(--error)' }}>{proposal.votesAgainst.toLocaleString()}</div>
          <div className="text-[10px] font-mono text-text-disabled mt-1">Votes Against ({100 - pctFor}%)</div>
        </div>
      </div>

      {/* Cast vote */}
      {proposal.status === 'active' && (
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-text-tertiary">Cast your vote:</span>
          <button
            onClick={() => setVoted('for')}
            className="px-3 py-1.5 rounded text-xs font-mono transition-colors"
            style={{
              background: voted === 'for' ? 'var(--success)' : 'var(--bg-surface2)',
              color: voted === 'for' ? 'var(--bg-base)' : 'var(--success)',
              border: `1px solid ${voted === 'for' ? 'var(--success)' : 'var(--border)'}`,
              fontWeight: voted === 'for' ? 600 : 400,
            }}
          >
            &#x2713; For
          </button>
          <button
            onClick={() => setVoted('against')}
            className="px-3 py-1.5 rounded text-xs font-mono transition-colors"
            style={{
              background: voted === 'against' ? 'var(--error)' : 'var(--bg-surface2)',
              color: voted === 'against' ? 'var(--bg-base)' : 'var(--error)',
              border: `1px solid ${voted === 'against' ? 'var(--error)' : 'var(--border)'}`,
              fontWeight: voted === 'against' ? 600 : 400,
            }}
          >
            &#x2717; Against
          </button>
          {voted && <span className="text-[10px] font-mono text-text-disabled">Vote recorded</span>}
        </div>
      )}

      <div className="text-[10px] font-mono text-text-disabled">
        Proposed by {proposal.author} &middot; {proposal.endsIn !== 'Closed' ? `Ends in ${proposal.endsIn}` : 'Voting closed'}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LEARN — Academy / Knowledge Paths
   ═══════════════════════════════════════════════════════ */

function LearnView() {
  return (
    <div className="flex flex-col gap-4">
      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Paths Available', value: LEARN_PATHS.length, color: 'var(--accent)' },
          { label: 'Modules Completed', value: LEARN_PATHS.reduce((s, p) => s + p.completed, 0), color: 'var(--success)' },
          { label: 'Total Modules', value: LEARN_PATHS.reduce((s, p) => s + p.modules, 0), color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3" style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-disabled mb-1">{s.label}</div>
            <div className="text-lg font-display font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Learning paths grid */}
      <div className="grid grid-cols-2 gap-3">
        {LEARN_PATHS.map(path => {
          const pct = path.modules > 0 ? Math.round((path.completed / path.modules) * 100) : 0;
          const isComplete = pct === 100;
          const diffColor = DIFFICULTY_COLORS[path.difficulty] || 'var(--text-tertiary)';

          return (
            <div
              key={path.id}
              className="rounded-lg p-4 transition-colors"
              style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'var(--bg-surface2)' }}
                >
                  {path.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] text-text-primary font-medium truncate">{path.title}</span>
                    {isComplete && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'var(--success)' + '18', color: 'var(--success)' }}>
                        &#x2713; DONE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-text-tertiary leading-relaxed mb-2 line-clamp-2">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-3 text-[9px] font-mono text-text-disabled">
                    <span>{path.modules} modules</span>
                    <span>&middot;</span>
                    <span>{path.duration}</span>
                    <span>&middot;</span>
                    <span style={{ color: diffColor }}>{path.difficulty}</span>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface2)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: isComplete ? 'var(--success)' : 'var(--accent)' }}
                  />
                </div>
                <span className="text-[9px] font-mono text-text-disabled flex-shrink-0">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INVEST — Olympus-Coin & Treasury
   ═══════════════════════════════════════════════════════ */

function InvestView() {
  return (
    <div className="flex flex-col gap-4">
      {/* Treasury overview */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Treasury Value', value: '$482M', color: 'var(--gold)' },
          { label: 'OLY Price', value: '$4.82', color: 'var(--success)' },
          { label: 'Holders', value: '84,200', color: 'var(--accent)' },
          { label: 'Staking APY', value: '12.4%', color: '#4A9EBF' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3" style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-disabled mb-1">{s.label}</div>
            <div className="text-lg font-display font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Token tiers */}
      <SectionLabel>Assets</SectionLabel>
      <div className="flex flex-col gap-3">
        {INVEST_TIERS.map(tier => (
          <div
            key={tier.id}
            className="rounded-lg p-4"
            style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  {tier.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="text-[13px] text-text-primary font-medium">{tier.name}</div>
                  <div className="text-[10px] font-mono text-text-disabled">{tier.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-bold text-text-primary">{tier.price}</div>
                <div
                  className="text-[10px] font-mono"
                  style={{ color: tier.change24h >= 0 ? 'var(--success)' : 'var(--error)' }}
                >
                  {tier.change24h >= 0 ? '+' : ''}{tier.change24h}% 24h
                </div>
              </div>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed mb-2">{tier.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-disabled">Market Cap: {tier.marketCap}</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded text-[10px] font-mono"
                  style={{ background: 'var(--accent)', color: 'var(--bg-base)', fontWeight: 600 }}
                >
                  Buy
                </button>
                <button
                  className="px-3 py-1 rounded text-[10px] font-mono"
                  style={{ background: 'var(--bg-surface2)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated price chart */}
      <SectionLabel>OLY Price — 30 Day</SectionLabel>
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
      >
        <PriceChart />
      </div>
    </div>
  );
}

function PriceChart() {
  const points = [3.20,3.35,3.28,3.45,3.52,3.48,3.60,3.72,3.68,3.85,3.90,3.78,3.95,4.10,4.05,4.22,4.18,4.30,4.25,4.42,4.38,4.50,4.55,4.48,4.62,4.70,4.65,4.78,4.75,4.82];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 600;
  const h = 120;

  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 20) - 10;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const fillD = pathD + ` L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {/* End dot */}
      <circle
        cx={w}
        cy={h - ((points[points.length - 1] - min) / range) * (h - 20) - 10}
        r="4"
        fill="var(--accent)"
      />
      {/* Labels */}
      <text x="4" y={h - 2} fontSize="9" fontFamily="'Azeret Mono', monospace" fill="var(--text-disabled)">30d ago</text>
      <text x={w - 30} y={h - 2} fontSize="9" fontFamily="'Azeret Mono', monospace" fill="var(--text-disabled)">Today</text>
      <text x={w - 36} y="12" fontSize="9" fontFamily="'Azeret Mono', monospace" fill="var(--accent)">$4.82</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   MEMBERS — Community Leaderboard
   ═══════════════════════════════════════════════════════ */

function MembersView() {
  return (
    <div className="flex flex-col gap-4">
      {/* Community stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Citizens', value: '12,847', color: 'var(--accent)' },
          { label: 'Active This Week', value: '3,420', color: 'var(--success)' },
          { label: 'Contributors', value: '892', color: 'var(--gold)' },
          { label: 'New This Month', value: '247', color: '#4A9EBF' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3" style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-disabled mb-1">{s.label}</div>
            <div className="text-lg font-display font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <SectionLabel>Top Contributors</SectionLabel>
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
      >
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Rank','Citizen','Role','Karma','Contributions','Joined'].map(h => (
                <th
                  key={h}
                  className="text-[10px] font-mono uppercase tracking-wider text-text-disabled text-left py-2.5 px-4"
                  style={{ borderBottom: '1px solid var(--border)', fontFamily: "'Cinzel', serif", letterSpacing: '0.1em' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_MEMBERS.map((m, i) => (
              <tr key={m.name} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="py-2.5 px-4">
                  <span
                    className="text-[12px] font-display font-bold"
                    style={{ color: i === 0 ? 'var(--gold)' : i === 1 ? 'var(--text-secondary)' : i === 2 ? '#CD7F32' : 'var(--text-tertiary)' }}
                  >
                    #{i + 1}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: m.color + '20', color: m.color }}
                    >
                      {m.name[0].toUpperCase()}
                    </div>
                    <span className="text-[12px] font-mono text-text-primary">{m.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: m.color + '18', color: m.color }}>
                    {m.role}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-[11px] font-mono text-text-secondary">
                  {m.karma.toLocaleString()}
                </td>
                <td className="py-2.5 px-4 text-[11px] font-mono text-text-secondary">
                  {m.contributions}
                </td>
                <td className="py-2.5 px-4 text-[10px] font-mono text-text-disabled">
                  {m.joined}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Roles breakdown */}
      <SectionLabel>Community Roles</SectionLabel>
      <div className="grid grid-cols-4 gap-3">
        {[
          { role: 'Citizens', count: '10,208', desc: 'Verified community members with voting rights', color: 'var(--accent)' },
          { role: 'Contributors', count: '892', desc: 'Code, docs, design, or translation contributors', color: 'var(--success)' },
          { role: 'Governors', count: '30', desc: 'Elected council members with enhanced proposal rights', color: 'var(--gold)' },
          { role: 'Founders', count: '1', desc: 'Original architects of the Olympus-616 vision', color: '#C8A84E' },
        ].map(r => (
          <div key={r.role} className="rounded-lg p-3" style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}>
            <div className="text-lg font-display font-bold mb-1" style={{ color: r.color }}>{r.count}</div>
            <div className="text-[11px] text-text-primary font-medium mb-1">{r.role}</div>
            <div className="text-[10px] text-text-disabled leading-relaxed">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shared ───────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[11px] font-mono uppercase tracking-[1.2px]"
      style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}
    >
      {children}
    </h2>
  );
}

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-6"
        style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
