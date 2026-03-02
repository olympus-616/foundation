interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="font-serif text-3xl md:text-4xl text-navy font-normal">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-medium-gray text-lg font-sans">{subtitle}</p>
      )}
      <div className="mt-4 h-px bg-gold w-16" />
    </div>
  );
}
