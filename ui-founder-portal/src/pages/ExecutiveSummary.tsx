import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { executiveSummarySections, financialSummaryTable } from '../data/executiveSummary';

export default function ExecutiveSummary() {
  return (
    <div>
      <PageHeader title="Executive Summary" subtitle="CloudPremise LLC — Series 1 Redeemable Preferred Units" />

      <div className="space-y-12">
        {executiveSummarySections.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-xl text-navy mb-4 uppercase tracking-wide">{section.title}</h2>
            <div className="space-y-4">
              {section.content.map((para, i) => (
                <p key={i} className="text-dark-text font-sans leading-relaxed text-[15px]">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}

        {/* Financial Summary Table */}
        <section>
          <h2 className="font-serif text-xl text-navy mb-4 uppercase tracking-wide">Financial Summary</h2>
          <DataTable
            headers={financialSummaryTable.headers}
            rows={financialSummaryTable.rows.map((r) => ({
              label: r.label,
              values: r.values,
              bold: r.label === 'Net Operating Income' || r.label === 'Closing Cash',
            }))}
          />
        </section>
      </div>
    </div>
  );
}
