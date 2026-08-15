import { shadeColor } from '../utils/color';
import { formatBRL } from '../utils/finance';

export default function CardVisual({ card, usedAmount = 0, footer }) {
  const gradient = `linear-gradient(135deg, ${card.color} 0%, ${shadeColor(card.color, -35)} 100%)`;
  const pct = card.limit > 0 ? Math.min(100, Math.round((usedAmount / card.limit) * 100)) : 0;

  return (
    <div
      style={{
        width: 260,
        minWidth: 260,
        height: 156,
        borderRadius: 18,
        padding: 20,
        background: gradient,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.95 }}>{card.name}</div>
        <div style={{ fontSize: 22 }}>💳</div>
      </div>

      <div style={{ fontSize: 16, letterSpacing: 2, opacity: 0.85, zIndex: 1 }}>
        •••• •••• •••• {card.last4 || '0000'}
      </div>

      <div style={{ zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 10, opacity: 0.75, textTransform: 'uppercase', letterSpacing: 0.5 }}>Limite</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{formatBRL(card.limit)}</div>
          </div>
          {footer}
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#ffffff', opacity: 0.9 }} />
        </div>
        <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>
          {formatBRL(usedAmount)} usados ({pct}%)
        </div>
      </div>
    </div>
  );
}
