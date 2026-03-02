import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { redemptionScenarios } from '../data/financialModel';
import { formatRatio } from '../utils/format';

const data = redemptionScenarios.map((s) => ({
  timing: s.timing.replace(' (Mandatory)', ''),
  coverage: s.coverage,
}));

export default function CoverageChart() {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timing"
            tick={{ fontSize: 11, fontFamily: 'Inter' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(v: number) => `${v.toFixed(1)}x`}
            tickLine={false}
            axisLine={false}
            domain={[0.5, 1.3]}
          />
          <Tooltip
            formatter={(value) => [formatRatio(value as number), 'Coverage']}
            contentStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
          <ReferenceLine
            y={1.0}
            stroke="#059669"
            strokeDasharray="6 4"
            label={{
              value: 'Full Coverage (1.0x)',
              position: 'insideTopRight',
              style: { fontSize: 11, fontFamily: 'Inter', fill: '#059669' },
            }}
          />
          <Line type="monotone" dataKey="coverage" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#C9A84C', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
