import PageHeader from '../components/PageHeader';
import { terms, termSheetHeader, entityConversionSteps, founderControlProvisions, nonBindingDisclaimer } from '../data/termSheet';

export default function TermSheet() {
  return (
    <div>
      <PageHeader title="Term Sheet" />

      {/* Header Block */}
      <div className="bg-navy rounded-md p-6 mb-8 text-center">
        <p className="font-serif text-xl text-white">{termSheetHeader.entity}</p>
        <p className="text-gold font-sans text-sm mt-1">{termSheetHeader.instrument}</p>
        <p className="text-gray-400 text-xs mt-2 font-sans">{termSheetHeader.subtitle}</p>
        <p className="text-gray-500 text-xs mt-1 font-sans italic">{termSheetHeader.alignment}</p>
      </div>

      {/* Terms Table */}
      <section className="mb-12">
        <div className="space-y-0">
          {terms.map((t) => (
            <div key={t.term} className="grid grid-cols-1 md:grid-cols-[200px_1fr] border-b border-light-gray py-4 gap-2 md:gap-6">
              <div className="font-sans font-semibold text-navy text-sm">{t.term}</div>
              <div className="font-sans text-dark-text text-[15px] leading-relaxed">{t.details}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Entity Conversion */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-6">Entity Conversion Mechanics</h2>
        <div className="relative">
          {entityConversionSteps.map((step, i) => (
            <div key={i} className="flex items-start mb-6 last:mb-0">
              <div className="flex flex-col items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-mono font-semibold">
                  {i + 1}
                </div>
                {i < entityConversionSteps.length - 1 && <div className="w-px h-8 bg-light-gray mt-1" />}
              </div>
              <p className="text-dark-text font-sans text-[15px] leading-relaxed pt-1">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tithe Acknowledgment */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Tithe Acknowledgment</h2>
        <div className="border-l-4 border-gold bg-gold/5 p-6 rounded-r-md">
          <p className="text-sm text-dark-text font-sans leading-relaxed">
            The Investor acknowledges the irrevocable Tithe Covenant: 7% of recognized gross revenue
            to the Olympus Foundation, quarterly, in perpetuity. Cannot be modified by any vote or action.
            Deferred tithe accrues interest at fed funds + 2% as a priority obligation.
            Investor's economic participation is in 93¢ of every dollar.
          </p>
        </div>
      </section>

      {/* Founder Control */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Founder Control Provisions</h2>
        <ul className="space-y-2">
          {founderControlProvisions.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="text-gold mt-0.5">&#9679;</span>
              <span className="text-dark-text font-sans text-[15px]">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cap Table Alignment */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Cap Table Alignment</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <span className="text-gold mt-0.5">&#9679;</span>
            <span className="text-dark-text font-sans text-[15px]">Division B.1, non-voting, non-participating, mandatory redemption</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold mt-0.5">&#9679;</span>
            <span className="text-dark-text font-sans text-[15px]">Upon C-Corp: maps to Class C (Non-Voting Common), zero votes, same economics</span>
          </li>
        </ul>
      </section>

      {/* Non-Binding Disclaimer */}
      <section>
        <p className="text-xs text-medium-gray font-sans italic leading-relaxed">
          {nonBindingDisclaimer}
        </p>
      </section>
    </div>
  );
}
