import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import { formatCurrency } from '../utils/format';

const metrics = [
  { label: 'Investment', value: '$2,000,000', subtitle: 'Series 1 Redeemable Preferred Units' },
  { label: 'Valuation', value: '$20M Pre-Money', subtitle: '10% economic interest, 0% voting' },
  { label: 'Return', value: '8% + Premium', subtitle: 'Cumulative preferred + 10–20% premium' },
  { label: 'Timeline', value: '36 Months', subtitle: 'Mandatory redemption — interest terminates' },
  { label: 'Governance', value: 'Zero', subtitle: 'No votes, no board, no consent rights' },
  { label: 'Max Payout', value: '$2,880,000', subtitle: '44% total return at Month 36' },
];

const redemptionRows = [
  { timing: 'Month 12', principalReturn: 2160000, premium: 200000, premiumLabel: '10%', total: 2360000, annualized: '~18%' },
  { timing: 'Month 24', principalReturn: 2320000, premium: 300000, premiumLabel: '15%', total: 2620000, annualized: '~15.5%' },
  { timing: 'Month 36 (mandatory)', principalReturn: 2480000, premium: 400000, premiumLabel: '20%', total: 2880000, annualized: '~14.7%' },
];

const conversionSteps = [
  'Investment closes into CloudPremise LLC \u2192 Series 1 issued as LLC units',
  'Within 90 days: Delaware C-Corp formed, dual-class share structure adopted',
  'Series 1 auto-converts to Class C Shares (Non-Voting Common), 1:1, identical economics',
  'All LLC obligations assumed by Successor Entity',
];

export default function InvestmentStructure() {
  return (
    <div>
      <PageHeader title="Investment Structure" subtitle="Series 1 Redeemable Preferred Units — Economic Terms" />

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} subtitle={m.subtitle} variant="navy" />
        ))}
      </section>

      {/* Redemption Economics */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Redemption Economics</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="py-3 text-left font-semibold text-navy">Timing</th>
                <th className="py-3 text-right font-semibold text-navy">Principal + Return</th>
                <th className="py-3 text-right font-semibold text-navy">Premium</th>
                <th className="py-3 text-right font-semibold text-navy">Total Payout</th>
                <th className="py-3 text-right font-semibold text-navy">Annualized</th>
              </tr>
            </thead>
            <tbody>
              {redemptionRows.map((r, i) => {
                const isLast = i === redemptionRows.length - 1;
                return (
                  <tr key={r.timing} className={`border-b border-light-gray ${isLast ? 'bg-navy/5 font-semibold' : ''}`}>
                    <td className="py-3">{r.timing}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(r.principalReturn)}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(r.premium)} ({r.premiumLabel})</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(r.total)}</td>
                    <td className="py-3 text-right font-mono">{r.annualized}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Entity Conversion Timeline */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-6">Entity Conversion Timeline</h2>
        <div className="relative">
          {conversionSteps.map((step, i) => (
            <div key={i} className="flex items-start mb-6 last:mb-0">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-mono font-semibold">
                  {i + 1}
                </div>
                {i < conversionSteps.length - 1 && <div className="w-px h-8 bg-light-gray mt-1" />}
              </div>
              <p className="text-dark-text font-sans text-[15px] leading-relaxed pt-1">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Priority Waterfall */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Priority Waterfall</h2>
        <div className="space-y-0">
          <div className="bg-gold/10 border border-gold rounded-t-md p-4">
            <p className="font-sans font-semibold text-navy text-sm">1. Tithe Covenant (7%)</p>
            <p className="text-xs text-medium-gray mt-0.5">SENIOR — irrevocable</p>
          </div>
          <div className="bg-navy/5 border-x border-light-gray p-4">
            <p className="font-sans font-semibold text-navy text-sm">2. Series 1 Preferred</p>
            <p className="text-xs text-medium-gray mt-0.5">Preferred return + premium</p>
          </div>
          <div className="bg-white border border-light-gray rounded-b-md p-4">
            <p className="font-sans font-semibold text-navy text-sm">3. Common Distributions</p>
            <p className="text-xs text-medium-gray mt-0.5">Founder / grant recipients</p>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-xs text-medium-gray font-sans italic">
            Tithe Covenant (7%) is senior to all distributions including preferred returns.
          </p>
          <p className="text-xs text-medium-gray font-sans italic">
            Issuer: CloudPremise LLC (CO) → Delaware C-Corp within 90 days. Units convert to Class C (Non-Voting) automatically.
          </p>
        </div>
      </section>
    </div>
  );
}
