import { useState } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MonthSelector from './components/MonthSelector';
import Overview from './tabs/Overview';
import AddTransaction from './tabs/AddTransaction';
import Cards from './tabs/Cards';
import History from './tabs/History';
import Tips from './tabs/Tips';
import usePersistedState from './hooks/usePersistedState';
import useIsMobile from './hooks/useIsMobile';
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
  const isMobile = useIsMobile();

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
      {isMobile ? <BottomNav active={activeTab} onChange={setActiveTab} /> : <Sidebar active={activeTab} onChange={setActiveTab} />}

      <main
        style={{
          marginLeft: isMobile ? 0 : 260,
          flex: 1,
          width: '100%',
          minWidth: 0,
          padding: isMobile ? '18px 14px 84px' : '28px 36px 60px',
          maxWidth: 1240,
          boxSizing: 'border-box',
        }}
      >
        <header
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginBottom: isMobile ? 16 : 24,
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#111827' }}>{TAB_TITLES[activeTab]}</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{TAB_SUBTITLES[activeTab]}</p>
          </div>
          <div style={{ alignSelf: isMobile ? 'stretch' : 'auto' }}>
            <MonthSelector year={period.year} month={period.month} onChange={(year, month) => setPeriod({ year, month })} fullWidth={isMobile} />
          </div>
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
            isMobile={isMobile}
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
            isMobile={isMobile}
          />
        )}

        {activeTab === 'cards' && (
          <Cards cards={cards} setCards={setCards} purchases={purchases} setPurchases={setPurchases} period={period} isMobile={isMobile} />
        )}

        {activeTab === 'history' && (
          <History
            period={period}
            transactions={transactions}
            setTransactions={setTransactions}
            purchases={purchases}
            setPurchases={setPurchases}
            cards={cards}
            isMobile={isMobile}
          />
        )}

        {activeTab === 'tips' && <Tips />}
      </main>
    </div>
  );
}
