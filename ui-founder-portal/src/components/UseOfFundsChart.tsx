import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useOfFunds } from '../data/financialModel';

export default function UseOfFundsChart() {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={useOfFunds}
            dataKey="pct"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
          >
            {useOfFunds.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`]}
            contentStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
