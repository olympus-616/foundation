import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import MetricCard from '../components/MetricCard';
import DataTable from '../components/DataTable';
import RevenueChart from '../components/RevenueChart';
import CashChart from '../components/CashChart';
import NOIChart from '../components/NOIChart';
import UseOfFundsChart from '../components/UseOfFundsChart';
import { annualSummary, keyMetrics, monthlyPnL } from '../data/financialModel';
import { formatCurrency, formatNumber } from '../utils/format';

export default function FinancialModel() {
  const [showMonthly, setShowMonthly] = useState(false);

  return (
    <div>
      <PageHeader title="Financial Model" subtitle="36-Month Projections — All data from Financial Model v3" />

      {/* Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <MetricCard label="3-Year Revenue" value={formatCurrency(annualSummary.totalRevenue.total)} />
        <MetricCard label="M36 ARR" value={formatCurrency(keyMetrics.m36.monthlyRevenue * 12)} />
        <MetricCard label="M36 Cash" value={formatCurrency(keyMetrics.m36.closingCash)} />
        <MetricCard label="Tithe to Foundation" value={formatCurrency(annualSummary.tithe.total)} />
      </section>

      {/* Revenue Chart */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Revenue by Segment</h2>
        <div className="bg-white border border-light-gray rounded-md p-4 shadow-sm">
          <RevenueChart />
        </div>
      </section>

      {/* Cash Position */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Cash Position</h2>
        <div className="bg-white border border-light-gray rounded-md p-4 shadow-sm">
          <CashChart />
        </div>
      </section>

      {/* NOI */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Net Operating Income</h2>
        <div className="bg-white border border-light-gray rounded-md p-4 shadow-sm">
          <NOIChart />
        </div>
      </section>

      {/* Annual Summary Table */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Annual Summary</h2>
        <DataTable
          headers={['', 'Year 1', 'Year 2', 'Year 3', '3-Year Total']}
          rows={[
            { label: 'Consumer Revenue', values: [annualSummary.consumerRevenue.y1, annualSummary.consumerRevenue.y2, annualSummary.consumerRevenue.y3, annualSummary.consumerRevenue.total] },
            { label: 'Enterprise Revenue', values: [annualSummary.enterpriseRevenue.y1, annualSummary.enterpriseRevenue.y2, annualSummary.enterpriseRevenue.y3, annualSummary.enterpriseRevenue.total] },
            { label: 'Total Revenue', values: [annualSummary.totalRevenue.y1, annualSummary.totalRevenue.y2, annualSummary.totalRevenue.y3, annualSummary.totalRevenue.total], bold: true },
            { label: 'Tithe to Foundation', values: [annualSummary.tithe.y1, annualSummary.tithe.y2, annualSummary.tithe.y3, annualSummary.tithe.total] },
            { label: 'Operating Expenses', values: [annualSummary.opex.y1, annualSummary.opex.y2, annualSummary.opex.y3, annualSummary.opex.total] },
            { label: 'Net Operating Income', values: [annualSummary.noi.y1, annualSummary.noi.y2, annualSummary.noi.y3, annualSummary.noi.total], bold: true },
          ]}
        />
      </section>

      {/* Growth Metrics */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Growth Metrics</h2>
        <DataTable
          headers={['', 'M12', 'M24', 'M36']}
          rows={[
            { label: 'Free Users', values: [formatNumber(keyMetrics.m12.freeUsers), formatNumber(keyMetrics.m24.freeUsers), formatNumber(keyMetrics.m36.freeUsers)] },
            { label: 'Paid Users (7% conv)', values: [formatNumber(keyMetrics.m12.paidUsers), formatNumber(keyMetrics.m24.paidUsers), formatNumber(keyMetrics.m36.paidUsers)] },
            { label: 'Enterprise Clients', values: [keyMetrics.m12.enterpriseClients, keyMetrics.m24.enterpriseClients, keyMetrics.m36.enterpriseClients] },
            { label: 'Monthly Revenue', values: [formatCurrency(keyMetrics.m12.monthlyRevenue), formatCurrency(keyMetrics.m24.monthlyRevenue), formatCurrency(keyMetrics.m36.monthlyRevenue)] },
            { label: 'Annualized Run Rate', values: [formatCurrency(keyMetrics.m12.monthlyRevenue * 12), formatCurrency(keyMetrics.m24.monthlyRevenue * 12), formatCurrency(keyMetrics.m36.monthlyRevenue * 12)] },
          ]}
          formatValues={false}
        />
      </section>

      {/* Use of Funds */}
      <section className="mb-12">
        <h2 className="font-serif text-xl text-navy mb-4">Use of Funds</h2>
        <div className="bg-white border border-light-gray rounded-md p-4 shadow-sm">
          <UseOfFundsChart />
        </div>
      </section>

      {/* Full Monthly P&L (collapsible) */}
      <section>
        <button
          onClick={() => setShowMonthly(!showMonthly)}
          className="flex items-center gap-2 font-serif text-xl text-navy mb-4 cursor-pointer hover:text-gold transition-colors"
        >
          <span>{showMonthly ? '\u25BC' : '\u25B6'}</span>
          <span>Full 36-Month P&L</span>
        </button>
        {showMonthly && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="text-[11px] font-sans whitespace-nowrap">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="py-2 pr-4 text-left font-semibold text-navy sticky left-0 bg-warm-white">Metric</th>
                  {Array.from({ length: 36 }, (_, i) => (
                    <th key={i} className="py-2 px-2 text-right font-semibold text-navy">M{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ['Total Revenue', monthlyPnL.totalRevenue],
                  ['Consumer Revenue', monthlyPnL.consumerRevenue],
                  ['Enterprise Revenue', monthlyPnL.enterpriseRevenue],
                  ['Tithe (7%)', monthlyPnL.tithe],
                  ['Total OpEx', monthlyPnL.totalOpex],
                  ['NOI', monthlyPnL.noi],
                  ['Closing Cash', monthlyPnL.closingCash],
                ] as [string, number[]][]).map(([label, data]) => (
                  <tr key={label} className="border-b border-light-gray">
                    <td className="py-1.5 pr-4 font-medium sticky left-0 bg-warm-white">{label}</td>
                    {data.map((v, i) => (
                      <td key={i} className={`py-1.5 px-2 text-right font-mono ${v < 0 ? 'text-red-600' : ''}`}>
                        {formatCurrency(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
