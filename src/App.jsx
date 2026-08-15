import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MonthSelector from './components/MonthSelector';
import Overview from './tabs/Overview';
import AddTransaction from './tabs/AddTransaction';
import Cards from './tabs/Cards';
import History from './tabs/History';
import Tips from './tabs/Tips';
import usePersistedState from './hooks/usePersistedState';
import { todayParts } from './utils/finance';
import { globalStyles } from './styles/globalStyles';

const TAB_TITLES = {
  overview: 'Visão Geral',
  add: 'Lançar',
  cards: 'Cartões',
  history: 'Histórico',
  tips: 'Dicas',
};

const TAB_SUBTITLES = {
  overview: 'Olá! Aqui está o resumo das suas finanças.',
  add: 'Registre receitas, gastos e compras parceladas.',
  cards: 'Gerencie seus cartões e acompanhe as parcelas futuras.',
  history: 'Consulte tudo o que foi movimentado no mês selecionado.',
  tips: 'Estratégias simples para organizar sua vida financeira.',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const today = todayParts();
  const [period, setPeriod] = useState({ year: today.year, month: today.month });
  const [addPrefill, setAddPrefill] = useState(null);

  const [transactions, setTransactions] = usePersistedState('fc_transactions', []);
  const [cards, setCards] = usePersistedState('fc_cards', []);
  const [purchases, setPurchases] = usePersistedState('fc_purchases', []);
  const [savingsGoal, setSavingsGoal] = usePersistedState('fc_savings_goal', { target: 5000 });

  function goTo(tab, prefill = null) {
    setAddPrefill(prefill);
    setActiveTab(tab);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>
      <style>{globalStyles}</style>
      <Sidebar active={activeTab} onChange={setActiveTab} />

      <main style={{ marginLeft: 260, flex: 1, padding: '28px 36px 60px', maxWidth: 1240 }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>{TAB_TITLES[activeTab]}</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{TAB_SUBTITLES[activeTab]}</p>
          </div>
          <MonthSelector year={period.year} month={period.month} onChange={(year, month) => setPeriod({ year, month })} />
        </header>

        {activeTab === 'overview' && (
          <Overview
            period={period}
            transactions={transactions}
            cards={cards}
            purchases={purchases}
            savingsGoal={savingsGoal}
            setSavingsGoal={setSavingsGoal}
            goTo={goTo}
          />
        )}

        {activeTab === 'add' && (
          <AddTransaction
            cards={cards}
            setTransactions={setTransactions}
            purchases={purchases}
            setPurchases={setPurchases}
            prefill={addPrefill}
            goTo={goTo}
          />
        )}

        {activeTab === 'cards' && <Cards cards={cards} setCards={setCards} purchases={purchases} setPurchases={setPurchases} period={period} />}

        {activeTab === 'history' && (
          <History
            period={period}
            transactions={transactions}
            setTransactions={setTransactions}
            purchases={purchases}
            setPurchases={setPurchases}
            cards={cards}
          />
        )}

        {activeTab === 'tips' && <Tips />}
      </main>
    </div>
  );
}
