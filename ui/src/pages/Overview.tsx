import { useEffect, useState } from 'react';

interface AgentStatus {
  service: string;
  version: string;
  status: string;
  layer: string;
  [key: string]: unknown;
}

export default function Overview() {
  const [status, setStatus] = useState<AgentStatus | null>(null);

  useEffect(() => {
    fetch('/status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg flex flex-col items-center gap-10">

        {/* Icon */}
        <div
          className="flex items-center justify-center w-24 h-24 rounded-full text-5xl font-display"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
        >
          &#x25B3;
        </div>

        {/* Title block */}
        <div className="text-center">
          <h1
            className="heading-display text-4xl tracking-wide"
            style={{ color: 'var(--accent)' }}
          >
            Foundation
          </h1>
          <p className="mt-2 text-sm tracking-widest uppercase text-text-tertiary font-mono">
            Non-Profit
          </p>
        </div>

        <div className="gold-thread w-full" />

        {/* Description */}
        <p className="text-text-secondary text-center leading-relaxed max-w-md">
          Foundation is the community layer of Olympus-616. She embodies the mission to build a better world &mdash; governing non-profit operations, community outreach, and the philanthropic heart of the pantheon.
        </p>

        {/* Capabilities */}
        <div className="w-full max-w-sm">
          <h2 className="section-label mb-4 text-center">Capabilities</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)' }}>&#x25B8;</span>
              Community Governance
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)' }}>&#x25B8;</span>
              Non-Profit Operations
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)' }}>&#x25B8;</span>
              Outreach Programs
            </li>
            <li className="flex items-center gap-2">
              <span style={{ color: 'var(--accent)' }}>&#x25B8;</span>
              Mission Alignment
            </li>
          </ul>
        </div>

        <div className="gold-thread w-full" />

        {/* Live status pill */}
        {status && (
          <div className="flex items-center gap-3 text-xs font-mono text-text-disabled">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: status.status === 'active' ? 'var(--success)' : 'var(--error)' }}
            />
            <span>v{status.version}</span>
            <span>&middot;</span>
            <span>{status.layer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
