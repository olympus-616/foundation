import PageHeader from '../components/PageHeader';
import { shareClasses, allocationMap, keyProvisions } from '../data/capTable';

export default function CapTable() {
  return (
    <div>
      <PageHeader title="Cap Table Summary" subtitle="Olympus-Grid Cap Table v1.5.1 — Share Class Structure & Allocation" />

      <p className="text-dark-text font-sans text-[15px] leading-relaxed mb-8">
        This page provides a readable summary of the Olympus-Grid Cap Table v1.5.1 structure.
        The full constitutional document is available in the downloadable package.
      </p>

      {/* Share Classes */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-6">Share Class Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shareClasses.map((sc) => (
            <div key={sc.name} className="bg-white border border-light-gray rounded-md p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest text-gold font-sans font-semibold mb-1">{sc.name}</p>
              <h3 className="font-serif text-lg text-navy mb-3">{sc.label}</h3>
              <p className="text-xs text-medium-gray font-sans mb-1">Held by: {sc.holders}</p>
              <p className="text-xs text-medium-gray font-sans mb-3">{sc.votesPerShare}</p>
              <p className="text-sm text-dark-text font-sans leading-relaxed">{sc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Allocation Map */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Allocation Map</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="py-3 text-left font-semibold text-navy">Division</th>
                <th className="py-3 text-left font-semibold text-navy">Points</th>
                <th className="py-3 text-left font-semibold text-navy">Purpose</th>
                <th className="py-3 text-left font-semibold text-navy">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocationMap.map((row) => (
                <tr key={row.division} className="border-b border-light-gray">
                  <td className="py-3 font-medium">{row.division}</td>
                  <td className="py-3 font-mono">{row.points}</td>
                  <td className="py-3">{row.purpose}</td>
                  <td className="py-3 text-medium-gray">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Voting Adjustment Formula */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Voting Adjustment Formula</h2>
        <div className="border-l-4 border-gold bg-gold/5 p-6 rounded-r-md">
          <p className="text-sm text-dark-text font-sans leading-relaxed">
            Class B votes-per-share (m) is set to the minimum integer such that Founder maintains
            ≥51% of total votes. Self-executing, automatic, requires no board or shareholder approval.
            Initial multiple: 10x. Ceiling: 100x (reaffirmable by Founder).
          </p>
        </div>
      </section>

      {/* Key Provisions */}
      <section>
        <h2 className="font-serif text-xl text-navy mb-4">Key Provisions</h2>
        <ul className="space-y-2">
          {keyProvisions.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="text-gold mt-0.5">&#9679;</span>
              <span className="text-dark-text font-sans text-[15px]">{p}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
