import { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, findCategory } from '../data/categories';
import { addMonths, formatBRL, monthLabel, parseISODate, todayISO, uid } from '../utils/finance';

const cardStyle = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  flex: 1,
  minWidth: 340,
};

const labelStyle = { fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14 };
const fieldWrap = { marginBottom: 16 };

function ToggleButtons({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 10,
              border: active ? '1px solid transparent' : '1px solid #e5e7eb',
              background: active ? opt.color || '#16a34a' : '#fff',
              color: active ? '#fff' : '#374151',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {opt.icon} {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function AddTransaction({ cards, setTransactions, purchases, setPurchases, prefill, goTo, isMobile = false }) {
  const [formMode, setFormMode] = useState(prefill?.mode === 'card' ? 'card' : 'cash');

  // Cash form state
  const [cashType, setCashType] = useState(prefill?.type || 'expense');
  const cashCategories = cashType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const [cashCategory, setCashCategory] = useState(cashCategories[0].name);
  const [cashDescription, setCashDescription] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cashDate, setCashDate] = useState(todayISO());
  const [cashMsg, setCashMsg] = useState('');

  // Card form state
  const [cardId, setCardId] = useState(cards[0]?.id || '');
  const [cardCategory, setCardCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [cardDescription, setCardDescription] = useState('');
  const [cardTotal, setCardTotal] = useState('');
  const [cardInstallments, setCardInstallments] = useState(1);
  const [cardDate, setCardDate] = useState(todayISO());
  const [cardMsg, setCardMsg] = useState('');

  function submitCash(e) {
    e.preventDefault();
    const amount = Number(cashAmount);
    if (!amount || amount <= 0 || !cashDescription.trim()) return;
    const { year, month } = parseISODate(cashDate);
    const cat = findCategory(cashCategories, cashCategory);
    setTransactions((prev) => [
      ...prev,
      {
        id: uid(),
        type: cashType,
        category: cat.name,
        categoryEmoji: cat.emoji,
        description: cashDescription.trim(),
        amount,
        year,
        month,
        day: parseISODate(cashDate).day,
        createdAt: Date.now(),
      },
    ]);
    setCashDescription('');
    setCashAmount('');
    setCashMsg(`${cashType === 'income' ? 'Receita' : 'Gasto'} de ${formatBRL(amount)} lançado em ${monthLabel(year, month)}.`);
    setTimeout(() => setCashMsg(''), 4000);
  }

  function submitCard(e) {
    e.preventDefault();
    const total = Number(cardTotal);
    const installments = Math.max(1, Math.min(48, Number(cardInstallments) || 1));
    if (!total || total <= 0 || !cardDescription.trim() || !cardId) return;
    const { year, month } = parseISODate(cardDate);
    const cat = findCategory(EXPENSE_CATEGORIES, cardCategory);
    setPurchases((prev) => [
      ...prev,
      {
        id: uid(),
        cardId,
        category: cat.name,
        categoryEmoji: cat.emoji,
        description: cardDescription.trim(),
        totalAmount: total,
        installments,
        year,
        month,
        createdAt: Date.now(),
      },
    ]);
    const last = addMonths(year, month, installments - 1);
    const per = total / installments;
    setCardDescription('');
    setCardTotal('');
    setCardInstallments(1);
    setCardMsg(
      installments === 1
        ? `Compra de ${formatBRL(total)} lançada em ${monthLabel(year, month)}.`
        : `${installments}x de ${formatBRL(per)} distribuídas de ${monthLabel(year, month)} até ${monthLabel(last.year, last.month)}.`
    );
    setTimeout(() => setCardMsg(''), 5000);
  }

  return (
    <div>
      <ToggleButtons
        options={[
          { value: 'cash', label: 'Receita / Gasto à vista', icon: '💵' },
          { value: 'card', label: 'Compra no cartão', icon: '💳' },
        ]}
        value={formMode}
        onChange={setFormMode}
      />

      {formMode === 'cash' && (
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, minWidth: isMobile ? 0 : 340 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Lançar receita ou gasto à vista</div>
          <form onSubmit={submitCash}>
            <ToggleButtons
              options={[
                { value: 'income', label: 'Receita', icon: '⬆️', color: '#16a34a' },
                { value: 'expense', label: 'Gasto', icon: '⬇️', color: '#dc2626' },
              ]}
              value={cashType}
              onChange={(v) => {
                setCashType(v);
                setCashCategory((v === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)[0].name);
              }}
            />

            <div style={fieldWrap}>
              <label style={labelStyle}>Categoria</label>
              <select style={inputStyle} value={cashCategory} onChange={(e) => setCashCategory(e.target.value)}>
                {cashCategories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle}>Descrição</label>
              <input
                style={inputStyle}
                value={cashDescription}
                onChange={(e) => setCashDescription(e.target.value)}
                placeholder="Ex: Supermercado, Salário..."
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 12 }}>
              <div style={{ ...fieldWrap, flex: 1 }}>
                <label style={labelStyle}>Valor (R$)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  required
                />
              </div>
              <div style={{ ...fieldWrap, flex: 1 }}>
                <label style={labelStyle}>Data</label>
                <input style={inputStyle} type="date" value={cashDate} onChange={(e) => setCashDate(e.target.value)} required />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                background: cashType === 'income' ? '#16a34a' : '#dc2626',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Lançar {cashType === 'income' ? 'receita' : 'gasto'}
            </button>
            {cashMsg && <div style={{ marginTop: 12, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✓ {cashMsg}</div>}
          </form>
        </div>
      )}

      {formMode === 'card' && (
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, minWidth: isMobile ? 0 : 340 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Compra no cartão de crédito</div>
          {cards.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 13 }}>
              Você ainda não tem cartões cadastrados.{' '}
              <button
                onClick={() => goTo && goTo('cards')}
                style={{ color: '#16a34a', fontWeight: 700, background: 'none', border: 'none' }}
              >
                Cadastrar um cartão
              </button>{' '}
              antes de lançar uma compra.
            </div>
          ) : (
            <form onSubmit={submitCard}>
              <div style={fieldWrap}>
                <label style={labelStyle}>Cartão</label>
                <select style={inputStyle} value={cardId} onChange={(e) => setCardId(e.target.value)}>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Categoria</label>
                <select style={inputStyle} value={cardCategory} onChange={(e) => setCardCategory(e.target.value)}>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Descrição</label>
                <input
                  style={inputStyle}
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="Ex: Notebook, Viagem..."
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0 : 12 }}>
                <div style={{ ...fieldWrap, flex: 1 }}>
                  <label style={labelStyle}>Valor total (R$)</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={cardTotal}
                    onChange={(e) => setCardTotal(e.target.value)}
                    required
                  />
                </div>
                <div style={{ ...fieldWrap, flex: 1 }}>
                  <label style={labelStyle}>Parcelas</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    max="48"
                    value={cardInstallments}
                    onChange={(e) => setCardInstallments(e.target.value)}
                    required
                  />
                </div>
                <div style={{ ...fieldWrap, flex: 1 }}>
                  <label style={labelStyle}>Data da compra</label>
                  <input style={inputStyle} type="date" value={cardDate} onChange={(e) => setCardDate(e.target.value)} required />
                </div>
              </div>

              {Number(cardTotal) > 0 && Number(cardInstallments) > 1 && (
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>
                  {cardInstallments}x de {formatBRL(Number(cardTotal) / Number(cardInstallments))}
                </div>
              )}

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#111827', color: '#fff', fontWeight: 700, fontSize: 14 }}
              >
                Lançar compra
              </button>
              {cardMsg && <div style={{ marginTop: 12, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>✓ {cardMsg}</div>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
