import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { monthlyPnL } from '../data/financialModel';
import { formatCurrency } from '../utils/format';

const data = monthlyPnL.consumerRevenue.map((_, i) => ({
  month: `M${i + 1}`,
  consumer: monthlyPnL.consumerRevenue[i],
  enterprise: monthlyPnL.enterpriseRevenue[i],
}));

export default function RevenueChart() {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
            formatter={(value) => [
              formatCurrency(value as number),
            ]}
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
          <Legend
            formatter={(value: string) => (value === 'consumer' ? 'Consumer Revenue' : 'Enterprise Revenue')}
            wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
          <Area type="monotone" dataKey="consumer" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
          <Area type="monotone" dataKey="enterprise" stackId="1" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
