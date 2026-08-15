import { formatBRL } from '../utils/finance';

export default function BarChart({ data, height = 220 }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: 13,
        }}
      >
        Sem gastos registrados neste mês.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const barAreaHeight = height - 56;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height, padding: '8px 4px', overflowX: 'auto' }}>
      {data.map((d, i) => {
        const barHeight = Math.max((d.total / max) * barAreaHeight, 4);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 56,
              gap: 6,
              justifyContent: 'flex-end',
              height: '100%',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
              {formatBRL(d.total)}
            </div>
            <div
              title={`${d.category}: ${formatBRL(d.total)}`}
              style={{
                width: 30,
                height: barHeight,
                borderRadius: '8px 8px 4px 4px',
                background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
                transition: 'height .35s ease',
              }}
            />
            <div style={{ fontSize: 18 }}>{d.emoji}</div>
            <div
              style={{
                fontSize: 11,
                color: '#6b7280',
                textAlign: 'center',
                maxWidth: 64,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {d.category}
            </div>
          </div>
        );
      })}
    </div>
  );
}
