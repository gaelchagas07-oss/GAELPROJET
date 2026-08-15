import React, { useState, useEffect, useMemo } from 'react'
import { styles } from './lib/styles'
import { uid, addMonths, monthKey } from './lib/utils'
import Sparkline from './components/Sparkline'
import Bars from './components/Bars'
import CashForm from './components/CashForm'
import CardForm from './components/CardForm'
import NewCardForm from './components/NewCardForm'

function injectStyles(){
  if(document.getElementById('gp-styles')) return
  const s = document.createElement('style')
  s.id = 'gp-styles'
  s.innerHTML = styles
  document.head.appendChild(s)
}

function useLocalStorage(key, initial){
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)) } catch {} }, [key, state])
  return [state, setState]
}

const defaultCategories = [
  {id:'salario', name:'Salário', emoji:'💼', type:'income'},
  {id:'freelance', name:'Freelance', emoji:'🧑‍💻', type:'income'},
  {id:'alimentacao', name:'Alimentação', emoji:'🍔', type:'expense'},
  {id:'transporte', name:'Transporte', emoji:'🚌', type:'expense'},
  {id:'lazer', name:'Lazer', emoji:'🎮', type:'expense'},
  {id:'supermercado', name:'Supermercado', emoji:'🛒', type:'expense'},
  {id:'saude', name:'Saúde', emoji:'💊', type:'expense'},
]

function seedData(){
  const now = new Date(); const t = [];
  for(let i=0;i<8;i++){
    const d = addMonths(now, -i);
    t.push({ id: uid(), type: 'income', amount: 3000 + Math.round(Math.random()*800), date: new Date(d.getFullYear(), d.getMonth(), 5).toISOString(), category:'salario', emoji:'💼', desc:'Salário' });
    t.push({ id: uid(), type: 'expense', amount: 120 + Math.round(Math.random()*600), date: new Date(d.getFullYear(), d.getMonth(), 12).toISOString(), category: ['alimentacao','supermercado','transporte'][Math.floor(Math.random()*3)], emoji:'🍔', desc: 'Despesas' });
  }
  return t
}

export default function AppShell(){
  useEffect(()=>injectStyles(),[])

  const [categories, setCategories] = useLocalStorage('gp:categories', defaultCategories)
  const [cards, setCards] = useLocalStorage('gp:cards', [{ id: 'card-1', name:'Visa Platinum', limit:5000, colorA:'#2bca9b', colorB:'#066d51' }])
  const [transactions, setTransactions] = useLocalStorage('gp:txs', seedData())
  const [savingsGoal, setSavingsGoal] = useLocalStorage('gp:goal', { amount: 10000, saved: 2500 })
  const [selectedTab, setSelectedTab] = useLocalStorage('gp:tab', 'overview')

  const now = new Date()
  const [viewMonth, setViewMonth] = useLocalStorage('gp:month', now.getMonth()+1)
  const [viewYear, setViewYear] = useLocalStorage('gp:year', now.getFullYear())
  const viewDate = useMemo(()=> new Date(viewYear, viewMonth-1, 1), [viewYear, viewMonth])

  const monthsBack = 6
  const lastMonths = useMemo(()=>{
    const arr=[]; for(let i=monthsBack-1;i>=0;i--){ arr.push(addMonths(viewDate, -i)) } return arr
  },[viewDate])

  const monthlyTotals = useMemo(()=>{
    return lastMonths.map(m=>{
      const txs = transactions.filter(t=>{ const d=new Date(t.date); return d.getFullYear()===m.getFullYear() && d.getMonth()===m.getMonth() })
      const income = txs.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)
      const expense = txs.filter(t=>t.type!=='income').reduce((s,t)=>s+t.amount,0)
      return { month:m, income, expense, balance: income-expense }
    })
  },[transactions, lastMonths])

  const totalIncome = monthlyTotals[monthlyTotals.length-1]?.income || 0
  const totalExpense = monthlyTotals[monthlyTotals.length-1]?.expense || 0
  const totalBalance = totalIncome - totalExpense

  function addCashTransaction({ type, amount, date, category, emoji, desc }){
    const tx = { id: uid(), type, amount: Number(amount), date: new Date(date).toISOString(), category, emoji, desc }
    setTransactions(prev=>[tx, ...prev])
  }

  function addCardPurchase({ cardId, totalAmount, installments, date, category, emoji, desc }){
    const baseDate = new Date(date)
    const amt = Number(totalAmount) / Number(installments || 1)
    const created = []
    const groupId = uid()
    for(let i=0;i<installments;i++){
      const d = addMonths(baseDate, i)
      const tx = { id: uid(), type: 'card', cardId, amount: Number((amt).toFixed(2)), date: new Date(d.getFullYear(), d.getMonth(), 1).toISOString(), category, emoji, desc: `${desc} (parcela ${i+1}/${installments})`, installmentsTotal: installments, installmentIndex: i+1, groupId }
      created.push(tx)
    }
    setTransactions(prev=>[...created, ...prev])
  }

  const commitments = useMemo(()=>{
    const arr=[]
    for(let i=0;i<6;i++){
      const d = addMonths(viewDate, i)
      const total = transactions.filter(t=>{ const td=new Date(t.date); return td.getFullYear()===d.getFullYear() && td.getMonth()===d.getMonth() && t.type!=='income' }).reduce((s,t)=>s+t.amount,0)
      arr.push({ month:d, total })
    }
    return arr
  },[transactions, viewDate])

  const txsThisMonth = transactions.filter(t=>{ const d=new Date(t.date); return d.getFullYear()===viewDate.getFullYear() && d.getMonth()===viewDate.getMonth() }).sort((a,b)=> new Date(b.date)-new Date(a.date))
  const cashTxs = txsThisMonth.filter(t=>t.type!=='card')
  const cardParcels = txsThisMonth.filter(t=>t.type==='card')

  const barsByCategory = useMemo(()=>{
    const sums = {}
    txsThisMonth.forEach(t=>{
      const cat = categories.find(c=>c.id===t.category) || { id:t.category, name:t.category, emoji:'🏷️' }
      if(!sums[cat.id]) sums[cat.id] = { key:cat.id, label:cat.name, emoji:cat.emoji, value:0 }
      sums[cat.id].value += t.type==='income' ? -t.amount : t.amount
    })
    return Object.values(sums).sort((a,b)=>b.value-a.value).slice(0,8)
  },[txsThisMonth, categories])

  const computedSaved = useMemo(()=>{
    const allIncome = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0)
    const allExpenses = transactions.filter(t=>t.type!=='income').reduce((s,t)=>s+t.amount,0)
    return Math.max(0, allIncome-allExpenses)
  },[transactions])

  function addCard({ name, limit, colorA, colorB }){ setCards(prev=>[{ id: uid(), name, limit: Number(limit), colorA, colorB }, ...prev]) }
  function removeCard(id){ setCards(prev=>prev.filter(c=>c.id!==id)) }
  function addCategory({ id, name, emoji, type }){ setCategories(prev=>[{ id, name, emoji, type }, ...prev]) }

  function quickIncome(){ addCashTransaction({ type:'income', amount: Math.round(100+Math.random()*2000), date: new Date().toISOString(), category:'freelance', emoji:'🧾', desc:'Entrada rápida' }) }
  function quickExpense(){ addCashTransaction({ type:'expense', amount: Math.round(20+Math.random()*400), date: new Date().toISOString(), category:'alimentacao', emoji:'🍔', desc:'Despesa rápida' }) }

  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const years = Array.from({length:6}).map((_,i)=> now.getFullYear()-2 + i)

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div style={{width:40,height:40,background:'linear-gradient(135deg,#06b77f,#08966d)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,color:'#fff'}}>G</div>
          <div>
            GAEL Financial
            <div style={{fontSize:12,opacity:0.9}}>Controle Pessoal</div>
          </div>
        </div>

        <nav className="nav">
          <button className={selectedTab==='overview' ? 'active' : ''} onClick={()=>setSelectedTab('overview')}>Visão Geral</button>
          <button className={selectedTab==='launch' ? 'active' : ''} onClick={()=>setSelectedTab('launch')}>Lançar</button>
          <button className={selectedTab==='cards' ? 'active' : ''} onClick={()=>setSelectedTab('cards')}>Cartões</button>
          <button className={selectedTab==='history' ? 'active' : ''} onClick={()=>setSelectedTab('history')}>Histórico</button>
          <button className={selectedTab==='tips' ? 'active' : ''} onClick={()=>setSelectedTab('tips')}>Dicas</button>
        </nav>

        <div style={{marginTop:'auto'}}>
          <div style={{fontSize:12,opacity:0.9,marginBottom:8}}>Meta de poupança</div>
          <div className="card" style={{padding:12, background:'#05291f', color:'#dfffea'}}>
            <div style={{fontSize:13,fontWeight:700}}>R$ {savingsGoal.amount.toLocaleString('pt-BR')}</div>
            <div style={{fontSize:12}} className="muted">Guardado: R$ {Math.round(computedSaved).toLocaleString('pt-BR')}</div>
            <div style={{height:8, marginTop:8, borderRadius:8, background:'#063f31'}}>
              <div style={{width: Math.min(100, Math.round((computedSaved / savingsGoal.amount)*100)) + '%', height:'100%', background:'linear-gradient(90deg,#59e5ad,#06b77f)'}} />
            </div>
          </div>
        </div>
      </aside>

      <main className="content">
        <div className="header">
          <div>
            <h2 style={{margin:0}}>Painel</h2>
            <div className="muted">Visão financeira e controles</div>
          </div>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div className="period card">
              <select value={viewMonth} onChange={(e)=>setViewMonth(Number(e.target.value))}>
                {monthNames.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
              <select value={viewYear} onChange={(e)=>setViewYear(Number(e.target.value))}>
                {years.map(y=> <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="controls">
              <button className="btn" onClick={()=>{ quickIncome(); }}>+ Receita</button>
              <button className="btn" style={{background:'#0b7a59'}} onClick={()=>{ quickExpense(); }}>- Gasto</button>
            </div>
          </div>
        </div>

        {selectedTab==='overview' && (
          <section>
            <div className="grid">
              <div className="card span-3">
                <div className="h">Receita (mês)</div>
                <div className="big">R$ {totalIncome.toFixed(2)}</div>
                <Sparkline values={monthlyTotals.map(m=>m.income)} color="#06b77f" />
              </div>
              <div className="card span-3">
                <div className="h">Gasto (mês)</div>
                <div className="big">R$ {totalExpense.toFixed(2)}</div>
                <Sparkline values={monthlyTotals.map(m=>m.expense)} color="#ff6b6b" />
              </div>
              <div className="card span-3">
                <div className="h">Saldo (mês)</div>
                <div className="big">R$ {totalBalance.toFixed(2)}</div>
                <Sparkline values={monthlyTotals.map(m=>m.balance)} color="#0a7a5e" />
              </div>

              <div className="card span-6">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><div className="h">Cartões</div><div className="muted">Visão rápida dos seus cartões</div></div>
                  <div className="muted">Limites e utilização</div>
                </div>
                <div style={{display:'flex',gap:12,marginTop:12}}>
                  {cards.map(c => (
                    <div key={c.id} className="bank-card" style={{background:`linear-gradient(135deg, ${c.colorA}, ${c.colorB})`, minWidth:200}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontWeight:800}}>{c.name}</div>
                        <div style={{fontSize:12}}>Validade ••••</div>
                      </div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginTop:8}}>
                        <div style={{fontSize:18,fontWeight:700}}>R$ { (c.limit).toLocaleString('pt-BR') }</div>
                        <div style={{fontSize:12,opacity:0.9}}>Limite</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12}} className="quick-actions">
                  <div className="qa" onClick={()=>setSelectedTab('launch')}>Lançar compra</div>
                  <div className="qa" onClick={()=>setSelectedTab('cards')}>Gerenciar cartões</div>
                  <div className="qa" onClick={()=>{ setSelectedTab('history'); }}>Ver histórico</div>
                </div>
              </div>

              <div className="card span-6">
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div><div className="h">Despesas por categoria</div><div className="muted">Mês selecionado</div></div>
                  <div className="muted">Total R$ {totalExpense.toFixed(2)}</div>
                </div>

                <div style={{marginTop:12}}>
                  <Bars items={barsByCategory} />
                  <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                    {barsByCategory.map(b => <div key={b.key} className="category-bubble">{b.emoji} {b.label} • R$ {b.value.toFixed(2)}</div>)}
                    {barsByCategory.length===0 && <div className="muted">Sem dados para o mês</div>}
                  </div>
                </div>
              </div>

              <div className="card span-6">
                <div className="h">Últimas transações</div>
                <div className="transactions">
                  {transactions.slice(0,8).map(tx => (
                    <div key={tx.id} className="tx">
                      <div className="meta">
                        <div style={{fontSize:20}}>{tx.emoji || '🏷️'}</div>
                        <div>
                          <div style={{fontWeight:700}}>{tx.desc}</div>
                          <div className="muted" style={{fontSize:12}}>{new Date(tx.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontWeight:800}} className={tx.type==='income' ? '' : ''}>{tx.type==='income' ? 'R+ ' : 'R- '}{tx.amount.toFixed(2)}</div>
                        <div className="muted" style={{fontSize:12}}>{categories.find(c=>c.id===tx.category)?.name || ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card span-6">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div className="h">Compromissos futuros</div>
                    <div className="muted">Próximos 6 meses</div>
                  </div>
                  <div className="muted">Total comprometido R$ { commitments.reduce((s,c)=>s+c.total,0).toFixed(2) }</div>
                </div>
                <div className="timeline" style={{marginTop:12}}>
                  {commitments.map((c,i) => (
                    <div key={i} className="month-pill">
                      <div style={{fontWeight:700}}>{monthNames[c.month.getMonth()]} {c.month.getFullYear()}</div>
                      <div className="muted" style={{fontSize:13}}>R$ {c.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>
        )}

        {selectedTab==='launch' && (
          <section>
            <div className="grid">
              <div className="card span-6">
                <h3 style={{marginTop:0}}>Lançar à vista</h3>
                <CashForm categories={categories} onAdd={addCashTransaction} onAddCategory={addCategory} />
              </div>

              <div className="card span-6">
                <h3 style={{marginTop:0}}>Lançar compra no cartão</h3>
                <CardForm categories={categories} cards={cards} onAddCardPurchase={addCardPurchase} onAddCategory={addCategory} />
              </div>

              <div className="card span-12">
                <h3 style={{marginTop:0}}>Ações rápidas</h3>
                <div style={{display:'flex',gap:8}}>
                  <div className="qa" onClick={quickIncome}>Registrar Renda aleatória</div>
                  <div className="qa" onClick={quickExpense}>Registrar Despesa aleatória</div>
                  <div className="qa" onClick={()=>{
                    if(confirm('Limpar dados e gerar dados de exemplo?')){
                      setTransactions(seedData()); setCategories(defaultCategories); setCards([{ id: 'card-1', name:'Visa Platinum', limit:5000, colorA:'#2bca9b', colorB:'#066d51' }]); setSavingsGoal({ amount:10000, saved:2500 })
                    }
                  }}>Reset</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {selectedTab==='cards' && (
          <section>
            <div className="grid">
              <div className="card span-6">
                <h3 style={{marginTop:0}}>Meus cartões</h3>
                <div className="cards-list">
                  {cards.map(c => (
                    <div key={c.id} className="card-small" style={{background:`linear-gradient(135deg, ${c.colorA}, ${c.colorB})`}}>
                      <div style={{fontWeight:800}}>{c.name}</div>
                      <div className="muted">Limite: R$ {c.limit}</div>
                      <div style={{marginTop:8,display:'flex',gap:6}}>
                        <button className="btn" onClick={()=>{ const use = prompt('Novo limite:'); if(use) { setCards(prev => prev.map(x=>x.id===c.id?{...x,limit:Number(use)}:x)); } }}>Editar</button>
                        <button className="btn" style={{background:'#ff6b6b'}} onClick={()=>{ if(confirm('Remover cartão?')) removeCard(c.id); }}>Remover</button>
                      </div>
                    </div>
                  ))}
                  <NewCardForm onAddCard={addCard} />
                </div>
              </div>

              <div className="card span-6">
                <h3 style={{marginTop:0}}>Linha do tempo de parcelas</h3>
                <div className="muted">Visual por cartão (parcelas agendadas por mês)</div>
                {cards.map(card => {
                  const months = []
                  for(let i=-2;i<10;i++){ months.push(addMonths(viewDate, i)) }
                  const grouped = {}
                  transactions.filter(t=>t.cardId===card.id).forEach(t=>{ const d=new Date(t.date); const key = monthKey(d); if(!grouped[key]) grouped[key]=[]; grouped[key].push(t) })
                  return (
                    <div key={card.id} style={{marginTop:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontWeight:800}}>{card.name}</div>
                        <div className="muted">Parcelas agendadas: {transactions.filter(t=>t.cardId===card.id).length}</div>
                      </div>
                      <div className="timeline" style={{marginTop:8}}>
                        {months.map(m => {
                          const key = monthKey(m)
                          const list = grouped[key] || []
                          return (
                            <div key={key} style={{minWidth:120, padding:8, borderRadius:8, background:'#fff', boxShadow: 'var(--shadow)'}}>
                              <div style={{fontWeight:700}}>{monthNames[m.getMonth()]} {m.getFullYear()}</div>
                              <div className="muted" style={{fontSize:13}}>{list.length} parcela(s)</div>
                              <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
                                {list.map(p => <div key={p.id} style={{fontSize:12, background:'#f6fffb', padding:6, borderRadius:6}}>{p.desc} — R$ {p.amount.toFixed(2)}</div>)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {selectedTab==='history' && (
          <section>
            <div className="grid">
              <div className="card span-6">
                <h3 style={{marginTop:0}}>Transações à vista — {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
                {cashTxs.length===0 && <div className="muted">Nenhuma transação à vista no mês</div>}
                {cashTxs.map(tx => (
                  <div key={tx.id} className="tx">
                    <div className="meta"><div style={{fontSize:20}}>{tx.emoji}</div>
                      <div><div style={{fontWeight:700}}>{tx.desc}</div><div className="muted">{categories.find(c=>c.id===tx.category)?.name || ''}</div></div></div>
                    <div style={{fontWeight:800}}>{tx.type==='income' ? '+' : '-'} R$ {tx.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="card span-6">
                <h3 style={{marginTop:0}}>Parcelas do cartão — {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
                {cardParcels.length===0 && <div className="muted">Nenhuma parcela no mês</div>}
                {cardParcels.map(tx => (
                  <div key={tx.id} className="tx">
                    <div className="meta"><div style={{fontSize:20}}>{tx.emoji}</div>
                      <div><div style={{fontWeight:700}}>{tx.desc}</div><div className="muted">{cards.find(c=>c.id===tx.cardId)?.name || ''}</div></div></div>
                    <div style={{fontWeight:800}}>R$ {tx.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="card span-12">
                <h3 style={{marginTop:0}}>Exportar / Limpar</h3>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn" onClick={()=>{
                    const data = { transactions, cards, categories, savingsGoal }
                    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'})
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a'); a.href = url; a.download = 'gael-financial-export.json'; a.click(); URL.revokeObjectURL(url)
                  }}>Exportar JSON</button>

                  <button className="btn" style={{background:'#ff6b6b'}} onClick={()=>{ if(confirm('Limpar todas as transações?')) { setTransactions([]) } }}>Limpar transações</button>
                </div>
              </div>

            </div>
          </section>
        )}

        {selectedTab==='tips' && (
          <section>
            <div className="card span-12">
              <h3 style={{marginTop:0}}>Guia financeiro</h3>
              <div className="tips">
                <h4>Regra 50-30-20</h4>
                <p>Divida sua renda líquida em 50% necessidades (moradia, alimentação), 30% desejos (lazer, restaurantes) e 20% poupança/investimentos.</p>

                <h4>Fundo de emergência</h4>
                <p>Monte um fundo de 3 a 6 meses de despesas fixas. Comece pequeno: guarde um valor mensal consistente.</p>

                <h4>Como investir com pouco</h4>
                <p>Priorize liquidez e baixo custo. Considere CDBs, Tesouro Direto (SELIC), fundos de índice (ETFs) conforme seu perfil. Automatize aportes mensais.</p>

                <h4>Dicas práticas</h4>
                <ul>
                  <li>Revise assinaturas e serviços regularmente.</li>
                  <li>Use cartões de forma consciente; prefira parcelar quando necessário e planeje as parcelas.</li>
                  <li>Automatize transferências para poupança/investimento todo mês.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
