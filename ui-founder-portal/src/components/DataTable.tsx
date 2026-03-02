import { formatCurrency } from '../utils/format';

interface DataTableProps {
  headers: string[];
  rows: { label: string; values: (number | string)[]; bold?: boolean }[];
  formatValues?: boolean;
  highlightLast?: boolean;
}

export default function DataTable({ headers, rows, formatValues = true, highlightLast = false }: DataTableProps) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b-2 border-navy">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`py-3 font-semibold text-navy ${i === 0 ? 'text-left pr-4' : 'text-right pl-4'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const isLast = ri === rows.length - 1;
            const highlight = highlightLast && isLast;
            return (
              <tr
                key={ri}
                className={`border-b border-light-gray ${highlight ? 'bg-navy/5 font-semibold' : ''} ${row.bold ? 'font-semibold' : ''}`}
              >
                <td className="py-3 pr-4 text-left">{row.label}</td>
                {row.values.map((v, vi) => (
                  <td key={vi} className="py-3 pl-4 text-right font-mono">
                    {formatValues && typeof v === 'number'
                      ? formatCurrency(v)
                      : v}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
