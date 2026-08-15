import { addMonths, monthLabel } from '../utils/finance';

export default function MonthSelector({ year, month, onChange }) {
  const go = (delta) => {
    const r = addMonths(year, month, delta);
    onChange(r.year, r.month);
  };

  const btnStyle = {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: 'none',
    background: '#f3f4f6',
    color: '#374151',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#ffffff',
        padding: '8px 10px',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
      }}
    >
      <button onClick={() => go(-1)} style={btnStyle} aria-label="Mês anterior">
        ‹
      </button>
      <div style={{ fontWeight: 700, fontSize: 14, minWidth: 140, textAlign: 'center', color: '#111827' }}>
        {monthLabel(year, month)}
      </div>
      <button onClick={() => go(1)} style={btnStyle} aria-label="Próximo mês">
        ›
      </button>
    </div>
  );
}
