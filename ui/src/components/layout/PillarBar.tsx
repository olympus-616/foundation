import { useState, useEffect, useRef } from 'react'
import type { StatusResponse } from '../../types/foundation'
import './PillarBar.css'

function formatUptime(seconds: number): string {
  if (seconds < 60) return seconds + 's'
  const m = Math.floor(seconds / 60)
  const rs = seconds % 60
  if (m < 60) return m + 'm ' + rs + 's'
  const h = Math.floor(m / 60)
  const rm = m % 60
  if (h < 24) return h + 'h ' + rm + 'm'
  const d = Math.floor(h / 24)
  return d + 'd ' + (h % 24) + 'h'
}

interface Props {
  healthy: boolean | null
  healthLoading: boolean
  healthError: string | null
  lastChecked: Date | null
  status: StatusResponse | null
  statusLoading: boolean
  statusError: string | null
  onRefreshHealth: () => void
  onRefreshStatus: () => void
}

export default function PillarBar({
  healthy,
  healthLoading,
  healthError,
  lastChecked,
  status,
  statusLoading,
  statusError,
  onRefreshHealth,
  onRefreshStatus,
}: Props) {
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [open])

  const handleToggle = () => {
    if (!open) { onRefreshHealth(); onRefreshStatus() }
    setOpen((v) => !v)
  }

  const online = healthy === true
  const dotClass = online ? 'pi-dot--on' : healthy === false ? 'pi-dot--off' : 'pi-dot--unknown'
  const statusLabel = online ? 'Connected' : healthy === false ? 'Disconnected' : 'Unknown'

  return (
    <footer ref={barRef} className="pi-footer">
      <div className={`pi-panel ${open ? 'pi-panel--open' : ''}`}>
        <div className="pi-panel-inner">
          <div className="pi-section">
            <div className="pi-section-head">
              <span className={`pi-dot-sm ${dotClass}`} />
              <span className="pi-section-label">Health</span>
            </div>
            <div className="pi-grid">
              <span className="pi-k">Status</span>
              <span className={`pi-v ${online ? 'pi-v--ok' : healthy === false ? 'pi-v--err' : ''}`}>{statusLabel}</span>
              {lastChecked && (<><span className="pi-k">Last Check</span><span className="pi-v">{lastChecked.toLocaleTimeString()}</span></>)}
            </div>
            {healthError && <div className="pi-error">{healthError}</div>}
          </div>
          <div className="pi-section">
            <div className="pi-section-head">
              <span className="pi-dot-sm pi-dot--accent" />
              <span className="pi-section-label">Service Info</span>
            </div>
            {statusLoading ? (
              <div className="pi-loading">Loading...</div>
            ) : statusError ? (
              <div className="pi-error">{statusError}</div>
            ) : status ? (
              <div className="pi-grid">
                {status.service && (<><span className="pi-k">Service</span><span className="pi-v">{status.service}</span></>)}
                {status.version && (<><span className="pi-k">Version</span><span className="pi-v">{status.version}</span></>)}
                {status.uptimeSeconds != null && (<><span className="pi-k">Uptime</span><span className="pi-v pi-v--ok">{formatUptime(status.uptimeSeconds)}</span></>)}
              </div>
            ) : (
              <div className="pi-loading">No status data</div>
            )}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onRefreshHealth(); onRefreshStatus() }} className="pi-refresh">Refresh</button>
        </div>
      </div>
      <div className="pi-bar" onClick={handleToggle}>
        <div className="pi-left">
          <span className={`pi-dot ${dotClass} ${healthLoading ? 'pi-dot--pulse' : ''}`} />
          <span className="pi-brand">PILLAR</span>
        </div>
        <div className="pi-right">
          {status?.service && (<span className="pi-stat"><span className="pi-k">SERVICE</span><span className="pi-v">{status.service}</span></span>)}
          {status?.uptimeSeconds != null && (<><span className="pi-sep" /><span className="pi-stat"><span className="pi-k">UPTIME</span><span className="pi-v">{formatUptime(status.uptimeSeconds)}</span></span></>)}
          {status?.version && (<><span className="pi-sep" /><span className="pi-stat"><span className="pi-k">VERSION</span><span className="pi-v">{status.version}</span></span></>)}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`pi-chevron ${open ? 'pi-chevron--open' : ''}`}><polyline points="2 6 5 3 8 6" /></svg>
        </div>
      </div>
    </footer>
  )
}
