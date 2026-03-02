import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { monthlyPnL } from '../data/financialModel';
import { formatCurrency } from '../utils/format';

const data = monthlyPnL.closingCash.map((cash, i) => ({
  month: `M${i + 1}`,
  cash,
}));

export default function CashChart() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fontFamily: 'Inter' }}
            tickLine={false}
            interval={5}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value as number), 'Closing Cash']}
            contentStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
          <ReferenceLine
            y={2880000}
            stroke="#D97706"
            strokeDasharray="6 4"
            label={{
              value: 'Max Redemption: $2,880,000',
              position: 'insideTopRight',
              style: { fontSize: 11, fontFamily: 'Inter', fill: '#D97706' },
            }}
          />
          <Line type="monotone" dataKey="cash" stroke="#0F1B2D" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
