import { Link } from 'react-router-dom';
import MetricCard from '../components/MetricCard';

const exploreLinks = [
  { label: 'Executive Summary', to: '/executive-summary', desc: 'The opportunity, the founder, the market' },
  { label: 'Investment Structure', to: '/investment-structure', desc: 'Returns, governance, redemption economics' },
  { label: 'Financial Model', to: '/financial-model', desc: '36-month P&L with monthly granularity' },
  { label: 'Redemption Analysis', to: '/redemption', desc: 'Coverage ratios, stress tests, return paths' },
  { label: 'Term Sheet', to: '/term-sheet', desc: 'Summary of indicative terms' },
  { label: 'Cap Table Summary', to: '/cap-table', desc: 'Share classes, allocation, voting formula' },
  { label: 'Investor FAQ', to: '/faq', desc: '20 questions across 7 categories' },
  { label: 'Appendix', to: '/appendix', desc: 'Glossary, cross-references, risk factors' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy rounded-md px-8 py-16 text-center mb-12 -mx-2">
        <h1 className="font-serif text-4xl md:text-5xl text-white tracking-wide">OLYMPUS-GRID</h1>
        <p className="text-gold italic text-lg mt-2 font-serif">Sovereign AI Infrastructure</p>
        <p className="text-gray-300 text-lg mt-4 font-sans">
          $2,000,000 — Series 1 Redeemable Preferred Units
        </p>
        <p className="text-gray-400 text-sm mt-2 font-sans">CloudPremise LLC — March 2026</p>
      </section>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <MetricCard label="Investment" value="$2,000,000" subtitle="Series 1 Redeemable Preferred" />
        <MetricCard label="Maximum Return" value="$2,880,000" subtitle="44% total at Month 36" />
        <MetricCard label="Governance" value="Zero" subtitle="No votes, no board, no consent" />
        <MetricCard label="Mandatory Redemption" value="Month 36" subtitle="Interest terminates" />
      </section>

      {/* Three Column Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div>
          <h3 className="font-serif text-lg text-navy mb-3">The Opportunity</h3>
          <p className="text-sm text-dark-text leading-relaxed font-sans">
            The AI industry is consolidating around centralized platforms that strip users of control.
            Olympus-Grid enables sovereign AI deployment — any user, any hardware, any model, full control.
            31 services operational. 4 years of development. Funding commercialization, not research.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-navy mb-3">The Structure</h3>
          <p className="text-sm text-dark-text leading-relaxed font-sans">
            Fixed-return instrument with capped upside and mandatory exit.
            8% cumulative preferred return + 10–20% redemption premium.
            Non-voting, non-participating.
            Your interest terminates at Month 36. You get paid. You get out.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-lg text-navy mb-3">The Mission</h3>
          <p className="text-sm text-dark-text leading-relaxed font-sans">
            7% of gross revenue flows irrevocably to the Olympus Foundation.
            Senior to all distributions. The tithe is architecture, not charity.
            Your economic participation is in 93¢ of every dollar.
          </p>
        </div>
      </section>

      {/* Explore the Package */}
      <section>
        <h2 className="font-serif text-2xl text-navy mb-6">Explore the Package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exploreLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block bg-white border border-light-gray rounded-md shadow-sm p-5 hover:border-gold transition-colors group"
            >
              <p className="font-sans font-medium text-navy group-hover:text-gold transition-colors">
                {link.label}
              </p>
              <p className="text-sm text-medium-gray mt-1 font-sans">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
