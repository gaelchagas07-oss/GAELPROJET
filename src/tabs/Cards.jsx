import { useMemo, useState } from 'react';
import CardVisual from '../components/CardVisual';
import { formatBRL, generateInstallments, monthsFrom, monthLabelShort, uid } from '../utils/finance';

const DEFAULT_COLORS = ['#16a34a', '#2563eb', '#7c3aed', '#dc2626', '#0891b2', '#ea580c', '#111827'];

const cardStyle = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
};

const labelStyle = { fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14 };

function CardTimeline({ card, allInstallments, period }) {
  const months = useMemo(() => monthsFrom(period.year, period.month, 6), [period]);
  const totals = months.map((m) => ({
    ...m,
    total: allInstallments
      .filter((i) => i.cardId === card.id && i.year === m.year && i.month === m.month)
      .reduce((a, i) => a + i.amount, 0),
  }));
  const max = Math.max(...totals.map((t) => t.total), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 130, padding: '4px 2px' }}>
      {totals.map((t, i) => {
        const h = t.total > 0 ? Math.max((t.total / max) * 80, 4) : 2;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 44 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>
              {t.total > 0 ? formatBRL(t.total) : '—'}
            </div>
            <div
              title={`${monthLabelShort(t.year, t.month)}: ${formatBRL(t.total)}`}
              style={{
                width: 22,
                height: h,
                borderRadius: '6px 6px 2px 2px',
                background: t.total > 0 ? card.color : '#e5e7eb',
              }}
            />
            <div style={{ fontSize: 10, color: '#9ca3af' }}>{monthLabelShort(t.year, t.month)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function Cards({ cards, setCards, purchases, setPurchases, period, isMobile = false }) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [last4, setLast4] = useState('');

  const allInstallments = useMemo(() => purchases.flatMap(generateInstallments), [purchases]);

  function addCard(e) {
    e.preventDefault();
    const limitVal = Number(limit);
    if (!name.trim() || !limitVal || limitVal <= 0) return;
    setCards((prev) => [...prev, { id: uid(), name: name.trim(), limit: limitVal, color, last4: last4.slice(0, 4) }]);
    setName('');
    setLimit('');
    setLast4('');
    setColor(DEFAULT_COLORS[(cards.length + 1) % DEFAULT_COLORS.length]);
  }

  function removeCard(id) {
    if (!confirm('Excluir este cartão? Todas as compras vinculadas a ele também serão removidas.')) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
    setPurchases((prev) => prev.filter((p) => p.cardId !== id));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20 }}>
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Cadastrar novo cartão</div>
        <form onSubmit={addCard} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 2, minWidth: 180 }}>
            <label style={labelStyle}>Nome do cartão</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Nubank" required />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={labelStyle}>Limite (R$)</label>
            <input style={inputStyle} type="number" min="0.01" step="0.01" value={limit} onChange={(e) => setLimit(e.target.value)} required />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <label style={labelStyle}>Últimos 4 dígitos</label>
            <input style={inputStyle} maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))} placeholder="0000" />
          </div>
          <div>
            <label style={labelStyle}>Cor</label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {DEFAULT_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '2px solid #111827' : '2px solid transparent',
                  }}
                />
              ))}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 30, height: 30, border: 'none', background: 'none' }} />
            </div>
          </div>
          <button type="submit" style={{ padding: '11px 20px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            Adicionar cartão
          </button>
        </form>
      </div>

      {cards.length === 0 ? (
        <div style={{ ...cardStyle, color: '#9ca3af', textAlign: 'center', padding: 40 }}>Nenhum cartão cadastrado ainda.</div>
      ) : (
        cards.map((card) => (
          <div key={card.id} style={{ ...cardStyle, padding: isMobile ? 16 : 24 }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 24, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <CardVisual card={card} usedAmount={0} fluid={isMobile} />
                <button
                  onClick={() => removeCard(card.id)}
                  title="Excluir cartão"
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#dc2626',
                    border: '1px solid #fee2e2',
                    fontSize: 13,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  🗑️
                </button>
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: '#374151' }}>
                  Timeline de parcelas — próximos 6 meses
                </div>
                <CardTimeline card={card} allInstallments={allInstallments} period={period} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
