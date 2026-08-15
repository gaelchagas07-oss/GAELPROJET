import { useMemo } from 'react';
import { formatBRL, generateInstallments, monthLabel } from '../utils/finance';

const cardStyle = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  flex: 1,
  minWidth: 340,
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 0',
  borderBottom: '1px solid #f3f4f6',
};

export default function History({ period, transactions, setTransactions, purchases, setPurchases, cards, isMobile = false }) {
  const { year, month } = period;

  const monthTransactions = useMemo(
    () =>
      transactions
        .filter((t) => t.year === year && t.month === month)
        .sort((a, b) => (b.day || 0) - (a.day || 0)),
    [transactions, year, month]
  );

  const monthInstallments = useMemo(() => {
    const list = purchases.flatMap(generateInstallments).filter((i) => i.year === year && i.month === month);
    return list.map((i) => ({ ...i, cardName: cards.find((c) => c.id === i.cardId)?.name || 'Cartão' }));
  }, [purchases, cards, year, month]);

  const totalIncome = monthTransactions.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const totalExpense = monthTransactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const totalCard = monthInstallments.reduce((a, i) => a + i.amount, 0);

  function deleteTransaction(id) {
    if (!confirm('Excluir esta transação?')) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function deletePurchase(purchaseId) {
    if (!confirm('Excluir esta compra? Todas as parcelas relacionadas (em todos os meses) serão removidas.')) return;
    setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));
  }

  return (
    <div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Exibindo movimentações de {monthLabel(year, month)}.</div>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 20, flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, minWidth: isMobile ? 0 : 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>💵 Transações à vista</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>
              <span style={{ color: '#16a34a' }}>+{formatBRL(totalIncome)}</span>{' '}
              <span style={{ color: '#dc2626' }}>-{formatBRL(totalExpense)}</span>
            </div>
          </div>
          {monthTransactions.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13 }}>Nenhuma transação à vista neste mês.</div>
          ) : (
            monthTransactions.map((t) => (
              <div key={t.id} style={rowStyle}>
                <div style={{ fontSize: 20 }}>{t.categoryEmoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{t.description}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {t.category} · dia {t.day}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.type === 'income' ? '#16a34a' : '#dc2626' }}>
                  {t.type === 'income' ? '+' : '-'}
                  {formatBRL(t.amount)}
                </div>
                <button onClick={() => deleteTransaction(t.id)} title="Excluir" style={{ background: 'none', border: 'none', fontSize: 14, color: '#9ca3af' }}>
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, minWidth: isMobile ? 0 : 340 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>💳 Parcelas do cartão</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>-{formatBRL(totalCard)}</div>
          </div>
          {monthInstallments.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13 }}>Nenhuma parcela de cartão neste mês.</div>
          ) : (
            monthInstallments.map((i) => (
              <div key={i.id} style={rowStyle}>
                <div style={{ fontSize: 20 }}>{i.categoryEmoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{i.description}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {i.cardName} · parcela {i.installmentNumber}/{i.totalInstallments}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>-{formatBRL(i.amount)}</div>
                <button onClick={() => deletePurchase(i.purchaseId)} title="Excluir compra completa" style={{ background: 'none', border: 'none', fontSize: 14, color: '#9ca3af' }}>
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
