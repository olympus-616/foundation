interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: 'default' | 'navy';
}

export default function MetricCard({ label, value, subtitle, variant = 'default' }: MetricCardProps) {
  if (variant === 'navy') {
    return (
      <div className="bg-navy rounded-md p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-sans mb-2">{label}</p>
        <p className="text-2xl md:text-3xl font-mono font-semibold text-gold">{value}</p>
        {subtitle && <p className="text-sm text-gray-300 font-sans mt-2">{subtitle}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white border border-light-gray rounded-md shadow-sm p-6 text-center">
      <p className="text-xs uppercase tracking-widest text-medium-gray font-sans mb-2">{label}</p>
      <p className="text-2xl md:text-3xl font-mono font-semibold text-navy">{value}</p>
      {subtitle && <p className="text-sm text-medium-gray font-sans mt-2">{subtitle}</p>}
    </div>
  );
}
