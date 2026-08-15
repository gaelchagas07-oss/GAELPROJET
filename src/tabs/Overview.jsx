import { useMemo, useState } from 'react';
import Sparkline from '../components/Sparkline';
import BarChart from '../components/BarChart';
import CardVisual from '../components/CardVisual';
import {
  formatBRL,
  last6Months,
  nextMonths,
  monthLabel,
  monthLabelShort,
  generateInstallments,
  groupByCategory,
} from '../utils/finance';

function monthTotals(transactions, installments, year, month) {
  const cash = transactions.filter((t) => t.year === year && t.month === month);
  const card = installments.filter((i) => i.year === year && i.month === month);
  const income = cash.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expenseCash = cash.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const expenseCard = card.reduce((a, i) => a + i.amount, 0);
  return { income, expense: expenseCash + expenseCard, balance: income - expenseCash - expenseCard, cash, card };
}

function SummaryCard({ title, value, icon, color, sparkData, sparkColor }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        flex: 1,
        minWidth: 220,
        animation: 'fadeIn .3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color }}>{formatBRL(value)}</div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Sparkline data={sparkData} color={sparkColor} width={200} height={40} />
      </div>
    </div>
  );
}

export default function Overview({ period, transactions, cards, purchases, savingsGoal, setSavingsGoal, goTo, isMobile = false }) {
  const { year, month } = period;
  const [goalInput, setGoalInput] = useState(savingsGoal.target);

  const allInstallments = useMemo(() => purchases.flatMap(generateInstallments), [purchases]);

  const current = useMemo(
    () => monthTotals(transactions, allInstallments, year, month),
    [transactions, allInstallments, year, month]
  );

  const history6 = useMemo(() => last6Months(year, month), [year, month]);
  const historyTotals = useMemo(
    () => history6.map((m) => monthTotals(transactions, allInstallments, m.year, m.month)),
    [history6, transactions, allInstallments]
  );

  const categoryData = useMemo(() => {
    const items = [
      ...current.cash.filter((t) => t.type === 'expense'),
      ...current.card,
    ];
    return groupByCategory(items);
  }, [current]);

  const recentActivity = useMemo(() => {
    const cashItems = transactions.map((t) => ({
      id: t.id,
      kind: t.type === 'income' ? 'Receita' : 'Gasto',
      description: t.description,
      emoji: t.categoryEmoji,
      amount: t.type === 'income' ? t.amount : -t.amount,
      createdAt: t.createdAt || 0,
    }));
    const cardItems = purchases.map((p) => ({
      id: p.id,
      kind: `Compra no cartão (${p.installments}x)`,
      description: p.description,
      emoji: p.categoryEmoji,
      amount: -p.totalAmount,
      createdAt: p.createdAt || 0,
    }));
    return [...cashItems, ...cardItems].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  }, [transactions, purchases]);

  const future3 = useMemo(() => nextMonths(year, month, 3), [year, month]);
  const futureCommitments = useMemo(
    () =>
      future3.map((m) => ({
        ...m,
        total: allInstallments.filter((i) => i.year === m.year && i.month === m.month).reduce((a, i) => a + i.amount, 0),
      })),
    [future3, allInstallments]
  );
  const totalFuture = futureCommitments.reduce((a, m) => a + m.total, 0);

  const netBalance = useMemo(() => {
    const isPastOrCurrent = (y, m) => y < year || (y === year && m <= month);
    const allIncome = transactions
      .filter((t) => t.type === 'income' && isPastOrCurrent(t.year, t.month))
      .reduce((a, t) => a + t.amount, 0);
    const allExpenseCash = transactions
      .filter((t) => t.type === 'expense' && isPastOrCurrent(t.year, t.month))
      .reduce((a, t) => a + t.amount, 0);
    const allExpenseCard = allInstallments
      .filter((i) => isPastOrCurrent(i.year, i.month))
      .reduce((a, i) => a + i.amount, 0);
    return allIncome - allExpenseCash - allExpenseCard;
  }, [transactions, allInstallments, year, month]);

  const goalPct = savingsGoal.target > 0 ? Math.max(0, Math.min(100, (netBalance / savingsGoal.target) * 100)) : 0;

  const cardStyle = {
    background: '#ffffff',
    borderRadius: 16,
    padding: isMobile ? 16 : 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 20 }}>
      {/* Summary cards */}
      <div style={{ display: 'flex', gap: isMobile ? 12 : 16, flexWrap: 'wrap' }}>
        <SummaryCard
          title="Receitas do mês"
          value={current.income}
          icon="⬆️"
          color="#16a34a"
          sparkColor="#16a34a"
          sparkData={historyTotals.map((h) => h.income)}
        />
        <SummaryCard
          title="Gastos do mês"
          value={current.expense}
          icon="⬇️"
          color="#dc2626"
          sparkColor="#dc2626"
          sparkData={historyTotals.map((h) => h.expense)}
        />
        <SummaryCard
          title="Saldo do mês"
          value={current.balance}
          icon="⚖️"
          color={current.balance >= 0 ? '#16a34a' : '#dc2626'}
          sparkColor={current.balance >= 0 ? '#16a34a' : '#dc2626'}
          sparkData={historyTotals.map((h) => h.balance)}
        />
      </div>

      {/* Cards + quick actions */}
      <div style={{ display: 'flex', gap: isMobile ? 14 : 20, flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, flex: 2, minWidth: 320 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Meus cartões</div>
            <button
              onClick={() => goTo('cards')}
              style={{ fontSize: 12, color: '#16a34a', fontWeight: 700, background: 'none', border: 'none' }}
            >
              Ver todos →
            </button>
          </div>
          {cards.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13, padding: '20px 0' }}>
              Nenhum cartão cadastrado ainda.{' '}
              <button onClick={() => goTo('cards')} style={{ color: '#16a34a', fontWeight: 700, background: 'none', border: 'none' }}>
                Cadastrar cartão
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
              {cards.map((card) => {
                const used = allInstallments
                  .filter((i) => i.cardId === card.id && i.year === year && i.month === month)
                  .reduce((a, i) => a + i.amount, 0);
                return <CardVisual key={card.id} card={card} usedAmount={used} />;
              })}
            </div>
          )}
        </div>

        <div style={{ ...cardStyle, flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Ações rápidas</div>
          {[
            { label: 'Nova Receita', icon: '💵', action: () => goTo('add', { mode: 'cash', type: 'income' }) },
            { label: 'Novo Gasto', icon: '🧾', action: () => goTo('add', { mode: 'cash', type: 'expense' }) },
            { label: 'Compra no Cartão', icon: '💳', action: () => goTo('add', { mode: 'card' }) },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 10,
                background: '#f0fdf4',
                border: '1px solid #dcfce7',
                fontSize: 13,
                fontWeight: 600,
                color: '#166534',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 18 }}>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart + latest transactions */}
      <div style={{ display: 'flex', gap: isMobile ? 14 : 20, flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Gastos por categoria — {monthLabel(year, month)}</div>
          <BarChart data={categoryData} />
        </div>

        <div style={{ ...cardStyle, flex: 1, minWidth: 280 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Últimas transações</div>
          {recentActivity.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: 13 }}>Nenhuma transação registrada ainda.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentActivity.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{item.kind}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.amount >= 0 ? '#16a34a' : '#dc2626', whiteSpace: 'nowrap' }}>
                    {item.amount >= 0 ? '+' : '-'}
                    {formatBRL(Math.abs(item.amount))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts + savings goal */}
      <div style={{ display: 'flex', gap: isMobile ? 14 : 20, flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, flex: 1, minWidth: 300 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Compromissos futuros (próx. 3 meses)</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#b45309', marginBottom: 12 }}>{formatBRL(totalFuture)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {futureCommitments.map((m) => (
              <div key={`${m.year}-${m.month}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>{monthLabelShort(m.year, m.month)}</span>
                <span style={{ fontWeight: 700, color: '#374151' }}>{formatBRL(m.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...cardStyle, flex: 1, minWidth: 300 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Meta de poupança</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: '#6b7280' }}>
              {formatBRL(Math.max(0, netBalance))} de {formatBRL(savingsGoal.target)}
            </span>
            <span style={{ fontWeight: 700, color: '#16a34a' }}>{goalPct.toFixed(0)}%</span>
          </div>
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden', marginBottom: 16 }}>
            <div
              style={{
                width: `${goalPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #4ade80, #16a34a)',
                transition: 'width .4s ease',
              }}
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = Number(goalInput);
              if (val > 0) setSavingsGoal({ target: val });
            }}
            style={{ display: 'flex', gap: 8 }}
          >
            <input
              type="number"
              min="1"
              step="0.01"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
            />
            <button
              type="submit"
              style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13 }}
            >
              Salvar meta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
