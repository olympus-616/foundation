import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    heading: 'Overview',
    items: [{ label: 'Home', to: '/' }],
  },
  {
    heading: 'Investment Package',
    items: [
      { label: 'Executive Summary', to: '/executive-summary' },
      { label: 'Investment Structure', to: '/investment-structure' },
      { label: 'Financial Model', to: '/financial-model' },
      { label: 'Redemption Analysis', to: '/redemption' },
      { label: 'Term Sheet', to: '/term-sheet' },
      { label: 'Cap Table Summary', to: '/cap-table' },
    ],
  },
  {
    heading: 'Reference',
    items: [
      { label: 'Investor FAQ', to: '/faq' },
      { label: 'Appendix', to: '/appendix' },
    ],
  },
];

interface NavigationProps {
  onNavigate?: () => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  return (
    <nav className="font-sans text-sm" aria-label="Main navigation">
      {navGroups.map((group) => (
        <div key={group.heading} className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-medium-gray font-semibold mb-2 px-4">
            {group.heading}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `block px-4 py-2 border-l-2 transition-colors ${
                      isActive
                        ? 'border-gold text-navy font-medium bg-gold/5'
                        : 'border-transparent text-medium-gray hover:text-navy hover:border-light-gray'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
