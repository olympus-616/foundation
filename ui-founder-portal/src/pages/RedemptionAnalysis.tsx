import PageHeader from '../components/PageHeader';
import CoverageChart from '../components/CoverageChart';
import { redemptionScenarios } from '../data/financialModel';
import { formatCurrency, formatPercent, formatRatio } from '../utils/format';

const returnComparison = [
  { investment: 'Series 1 Preferred', m12: '18%', m24: '31%', m36: '44%' },
  { investment: 'S&P 500 (avg)', m12: '~10%', m24: '~21%', m36: '~33%' },
  { investment: 'Real Estate (avg)', m12: '~8%', m24: '~17%', m36: '~26%' },
  { investment: 'Private Credit (avg)', m12: '~9%', m24: '~19%', m36: '~30%' },
];

export default function RedemptionAnalysis() {
  return (
    <div>
      <PageHeader title="Redemption Analysis" subtitle="Coverage ratios, return paths, and stress scenarios" />

      {/* Scenarios Table */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Redemption Scenarios</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="py-3 text-left font-semibold text-navy">Timing</th>
                <th className="py-3 text-right font-semibold text-navy">Principal</th>
                <th className="py-3 text-right font-semibold text-navy">Pref Return</th>
                <th className="py-3 text-right font-semibold text-navy">Premium</th>
                <th className="py-3 text-right font-semibold text-navy">Total Payout</th>
                <th className="py-3 text-right font-semibold text-navy">Cash Available</th>
                <th className="py-3 text-right font-semibold text-navy">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {redemptionScenarios.map((s, i) => {
                const isLast = i === redemptionScenarios.length - 1;
                return (
                  <tr key={s.timing} className={`border-b border-light-gray ${isLast ? 'bg-navy/5 font-semibold' : ''}`}>
                    <td className="py-3">{s.timing}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(s.principal)}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(s.prefReturn)}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(s.premiumAmt)} ({formatPercent(s.premiumRate, 0)})</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(s.totalPayout)}</td>
                    <td className="py-3 text-right font-mono">{formatCurrency(s.cashAvailable)}</td>
                    <td className={`py-3 text-right font-mono ${s.coverage >= 1 ? 'text-success' : 'text-warning'}`}>
                      {formatRatio(s.coverage)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Coverage Chart */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Coverage Ratio Over Time</h2>
        <div className="bg-white border border-light-gray rounded-md p-4 shadow-sm">
          <CoverageChart />
        </div>
      </section>

      {/* Three Redemption Paths */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-6">Redemption Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-light-gray rounded-md p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-success font-sans font-semibold mb-2">Primary</p>
            <h3 className="font-serif text-lg text-navy mb-3">Revenue-Funded</h3>
            <p className="text-sm text-dark-text font-sans leading-relaxed">
              Base case projects $3.26M cash at M36, exceeding $2.88M max redemption by $384K.
              Enterprise alone targets $1.49M ARR by M36. Cash flow positive by Year 2.
            </p>
          </div>
          <div className="bg-white border border-light-gray rounded-md p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-chart-blue font-sans font-semibold mb-2">Secondary</p>
            <h3 className="font-serif text-lg text-navy mb-3">Equity-Funded</h3>
            <p className="text-sm text-dark-text font-sans leading-relaxed">
              Series A at &gt;$40M valuation. Available but not relied upon in base case.
            </p>
          </div>
          <div className="bg-white border border-light-gray rounded-md p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-medium-gray font-sans font-semibold mb-2">Tertiary</p>
            <h3 className="font-serif text-lg text-navy mb-3">Bridge Financing</h3>
            <p className="text-sm text-dark-text font-sans leading-relaxed">
              Revenue-based financing or credit facility against recurring revenue.
              Contingency, not a plan.
            </p>
          </div>
        </div>
      </section>

      {/* Stress Test */}
      <section className="mb-12">
        <div className="border-2 border-warning rounded-md p-6 bg-warning/5">
          <h3 className="font-serif text-lg text-navy mb-2">Stress Test — 70% Revenue Scenario</h3>
          <p className="text-sm text-dark-text font-sans leading-relaxed">
            At 70% of projected revenue (30% downside), the Company accumulates ~$1.8M by Month 36 —
            insufficient for full operations-funded redemption. Secondary or tertiary paths activate.
            The 36-month window provides three fiscal years to execute across multiple paths.
          </p>
        </div>
      </section>

      {/* Return Comparison */}
      <section>
        <h2 className="font-serif text-xl text-navy mb-4">Return Comparison</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="py-3 text-left font-semibold text-navy">Investment</th>
                <th className="py-3 text-right font-semibold text-navy">12-Month</th>
                <th className="py-3 text-right font-semibold text-navy">24-Month</th>
                <th className="py-3 text-right font-semibold text-navy">36-Month</th>
              </tr>
            </thead>
            <tbody>
              {returnComparison.map((r, i) => (
                <tr key={r.investment} className={`border-b border-light-gray ${i === 0 ? 'font-semibold bg-navy/5' : ''}`}>
                  <td className="py-3">{r.investment}</td>
                  <td className="py-3 text-right font-mono">{r.m12}</td>
                  <td className="py-3 text-right font-mono">{r.m24}</td>
                  <td className="py-3 text-right font-mono">{r.m36}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
