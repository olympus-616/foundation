import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { glossaryTerms } from '../data/glossary';
import { crossReferences, riskFactors, assumptions, documentIndex } from '../data/crossReferences';

function useHash() {
  const location = useLocation();
  return location.hash.replace('#', '');
}

export default function Appendix() {
  const hash = useHash();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  const filteredTerms = filter
    ? glossaryTerms.filter(
        (t) =>
          t.term.toLowerCase().includes(filter.toLowerCase()) ||
          t.definition.toLowerCase().includes(filter.toLowerCase())
      )
    : glossaryTerms;

  return (
    <div>
      <PageHeader title="Appendix" subtitle="Glossary, cross-references, risk factors, assumptions, and document index" />

      {/* Quick Nav */}
      <nav className="flex flex-wrap gap-3 mb-10 text-sm font-sans">
        {['glossary', 'cross-references', 'risk-factors', 'assumptions', 'documents'].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-navy hover:text-gold transition-colors border-b border-dashed border-light-gray"
          >
            {id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </a>
        ))}
      </nav>

      {/* Glossary */}
      <section id="glossary" className="mb-16 scroll-mt-8">
        <h2 className="font-serif text-2xl text-navy mb-4">Glossary of Terms</h2>
        <input
          type="text"
          placeholder="Search terms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm mb-6 px-4 py-2 border border-light-gray rounded-md text-sm font-sans focus:outline-none focus:border-gold"
        />
        <div className="space-y-0">
          {filteredTerms.map((t) => (
            <div key={t.term} className="grid grid-cols-1 md:grid-cols-[220px_1fr_160px] border-b border-light-gray py-3 gap-2 md:gap-4">
              <div className="font-sans font-semibold text-navy text-sm">{t.term}</div>
              <div className="font-sans text-dark-text text-sm leading-relaxed">{t.definition}</div>
              <div className="text-xs text-medium-gray font-sans">{t.appearsIn.join(', ')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-Reference Index */}
      <section id="cross-references" className="mb-16 scroll-mt-8">
        <h2 className="font-serif text-2xl text-navy mb-4">Cross-Reference Index</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-xs font-sans whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="py-3 text-left font-semibold text-navy pr-4 sticky left-0 bg-warm-white">Provision</th>
                <th className="py-3 text-center font-semibold text-navy px-2">Term Sheet</th>
                <th className="py-3 text-center font-semibold text-navy px-2">Exec Summary</th>
                <th className="py-3 text-center font-semibold text-navy px-2">Deck</th>
                <th className="py-3 text-center font-semibold text-navy px-2">FAQ</th>
                <th className="py-3 text-center font-semibold text-navy px-2">Cap Table</th>
                <th className="py-3 text-center font-semibold text-navy px-2">Financial Model</th>
              </tr>
            </thead>
            <tbody>
              {crossReferences.map((r) => (
                <tr key={r.provision} className="border-b border-light-gray">
                  <td className="py-2 pr-4 font-medium sticky left-0 bg-warm-white">{r.provision}</td>
                  <td className="py-2 px-2 text-center">{r.termSheet === '—' ? <span className="text-light-gray">—</span> : <span className="text-success">&#10003; {r.termSheet}</span>}</td>
                  <td className="py-2 px-2 text-center">{r.execSummary === '—' ? <span className="text-light-gray">—</span> : <span className="text-success">&#10003; {r.execSummary}</span>}</td>
                  <td className="py-2 px-2 text-center">{r.deck === '—' ? <span className="text-light-gray">—</span> : <span className="text-success">&#10003; {r.deck}</span>}</td>
                  <td className="py-2 px-2 text-center">{r.faq === '—' ? <span className="text-light-gray">—</span> : <span className="text-success">&#10003; {r.faq}</span>}</td>
                  <td className="py-2 px-2 text-center">{r.capTable === '—' ? <span className="text-light-gray">—</span> : <span className="text-success">&#10003; {r.capTable}</span>}</td>
                  <td className="py-2 px-2 text-center">{r.financialModel === '—' ? <span className="text-light-gray">—</span> : <span className="text-success">&#10003; {r.financialModel}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Risk Factors */}
      <section id="risk-factors" className="mb-16 scroll-mt-8">
        <h2 className="font-serif text-2xl text-navy mb-6">Risk Factors</h2>
        <div className="space-y-6">
          {riskFactors.map((rf) => (
            <div key={rf.title}>
              <h3 className="font-sans font-semibold text-navy text-sm mb-1">{rf.title}</h3>
              <p className="text-sm text-dark-text font-sans leading-relaxed">{rf.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Assumptions */}
      <section id="assumptions" className="mb-16 scroll-mt-8">
        <h2 className="font-serif text-2xl text-navy mb-6">Assumptions</h2>

        <h3 className="font-sans font-semibold text-navy text-sm mb-3">Consumer Revenue Assumptions</h3>
        <ul className="space-y-1 mb-6">
          {assumptions.consumer.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-dark-text font-sans">
              <span className="text-gold mt-0.5 text-xs">&#9679;</span>
              {a}
            </li>
          ))}
        </ul>

        <h3 className="font-sans font-semibold text-navy text-sm mb-3">Enterprise Revenue Assumptions</h3>
        <ul className="space-y-1 mb-6">
          {assumptions.enterprise.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-dark-text font-sans">
              <span className="text-gold mt-0.5 text-xs">&#9679;</span>
              {a}
            </li>
          ))}
        </ul>

        <h3 className="font-sans font-semibold text-navy text-sm mb-3">Operating Expense Assumptions</h3>
        <ul className="space-y-1">
          {assumptions.opex.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-dark-text font-sans">
              <span className="text-gold mt-0.5 text-xs">&#9679;</span>
              {a}
            </li>
          ))}
        </ul>
      </section>

      {/* Document Index */}
      <section id="documents" className="scroll-mt-8">
        <h2 className="font-serif text-2xl text-navy mb-4">Document Index</h2>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b-2 border-navy">
                <th className="py-3 text-left font-semibold text-navy">Document</th>
                <th className="py-3 text-left font-semibold text-navy">Version</th>
                <th className="py-3 text-left font-semibold text-navy">Description</th>
              </tr>
            </thead>
            <tbody>
              {documentIndex.map((doc) => (
                <tr key={doc.name} className="border-b border-light-gray">
                  <td className="py-3 font-medium">{doc.name}</td>
                  <td className="py-3 font-mono text-xs">{doc.version}</td>
                  <td className="py-3 text-dark-text leading-relaxed">{doc.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
