import React, { useState } from 'react';
import axios from 'axios';

const ALB = 'http://statusnest-dev-alb-1293848550.us-east-1.elb.amazonaws.com';

const STATUS = {
  UP:      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   label: 'Operational' },
  DOWN:    { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   label: 'Outage' },
  UNKNOWN: { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', label: 'Unknown' },
};

export default function ServiceCard({ service, username }) {
  const [history, setHistory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const st = STATUS[service.status] || STATUS.UNKNOWN;

  const toggleHistory = () => {
    if (!showHistory && !history) {
      setLoadingHistory(true);
      axios.get(`${ALB}/status/${username}/history/${service.service_id}`)
        .then(res => setHistory(res.data))
        .finally(() => setLoadingHistory(false));
    }
    setShowHistory(!showHistory);
  };

  return (
    <div style={s.card}>
      <div style={s.row}>
        <div style={s.left}>
          <div style={{ ...s.statusDot, background: st.color, boxShadow: `0 0 8px ${st.color}` }} />
          <div>
            <div style={s.name}>{service.name}</div>
            <div style={s.url}>{service.url}</div>
          </div>
        </div>
        <div style={s.right}>
          {service.response_time && (
            <span style={s.rt}>{Math.round(service.response_time)}ms</span>
          )}
          <span style={{ ...s.badge, color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>
            {st.label}
          </span>
          <button style={s.histBtn} onClick={toggleHistory}>
            {showHistory ? 'Hide' : 'History'}
          </button>
        </div>
      </div>

      {showHistory && (
        <div style={s.historyWrap}>
          <p style={s.histLabel}>LAST 24 HOURS</p>
          {loadingHistory && <p style={s.muted}>Loading...</p>}
          {history && history.length === 0 && <p style={s.muted}>No history yet — Lambda hasn't run yet</p>}
          {history && history.map((h, i) => {
            const hst = STATUS[h.status] || STATUS.UNKNOWN;
            return (
              <div key={i} style={s.histRow}>
                <div style={{ ...s.histDot, background: hst.color }} />
                <span style={{ color: hst.color, fontSize: '12px', fontWeight: '600', width: '80px' }}>{h.status}</span>
                <span style={s.muted}>{new Date(h.checked_at).toLocaleString()}</span>
                {h.response_time && <span style={s.muted}>{Math.round(h.response_time)}ms</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px', backdropFilter: 'blur(10px)', transition: 'border-color 0.2s' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  left: { display: 'flex', alignItems: 'center', gap: '14px' },
  statusDot: { width: '9px', height: '9px', borderRadius: '50%', flexShrink: 0 },
  name: { color: '#f1f5f9', fontWeight: '600', fontSize: '15px' },
  url: { color: '#475569', fontSize: '12px', marginTop: '3px' },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  rt: { color: '#475569', fontSize: '12px', fontWeight: '500' },
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' },
  histBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif' },
  historyWrap: { marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' },
  histLabel: { color: '#334155', fontSize: '10px', fontWeight: '600', letterSpacing: '1px', marginBottom: '10px' },
  histRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
  histDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0 },
  muted: { color: '#475569', fontSize: '12px' },
};