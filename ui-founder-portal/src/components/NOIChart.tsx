import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { monthlyPnL } from '../data/financialModel';
import { formatCurrency } from '../utils/format';

const data = monthlyPnL.noi.map((noi, i) => ({
  month: `M${i + 1}`,
  noi,
}));

export default function NOIChart() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fontFamily: 'Inter' }}
            tickLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), 'Net Operating Income']}
            contentStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
          <Bar dataKey="noi">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.noi >= 0 ? '#059669' : '#DC2626'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
