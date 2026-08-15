import React, { useState, useEffect } from 'react'

export default function CardForm({ categories, cards, onAddCardPurchase, onAddCategory }){
  const [cardId, setCardId] = useState(cards[0]?.id || '')
  const [total, setTotal] = useState('')
  const [installments, setInstallments] = useState(1)
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [category, setCategory] = useState(categories.find(c=>c.type==='expense')?.id || '')
  const [emoji, setEmoji] = useState('💳')
  const [desc, setDesc] = useState('')

  useEffect(()=>{ if(cards.length && !cardId) setCardId(cards[0].id) },[cards])

  function submit(e){ e.preventDefault(); if(!total || isNaN(Number(total))) return alert('Valor inválido'); onAddCardPurchase({ cardId, totalAmount: Number(total), installments: Number(installments), date, category, emoji, desc: desc || 'Compra no cartão' }); setTotal(''); setInstallments(1); setDesc('') }
  function addCat(){ const id = prompt('ID curto da categoria (ex: roupa):'); if(!id) return; const name = prompt('Nome da categoria:'); const em = prompt('Emoji para a categoria (ex: 🧥):','🏷️'); const type = 'expense'; onAddCategory({ id, name, emoji: em, type }); setCategory(id) }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <select value={cardId} onChange={e=>setCardId(e.target.value)}>
          {cards.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Valor total (R$)" value={total} onChange={e=>setTotal(e.target.value)} />
      </div>
      <div className="form-row">
        <input type="number" min="1" value={installments} onChange={e=>setInstallments(e.target.value)} style={{width:120}} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </div>
      <div className="form-row">
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          {categories.filter(c=>c.type==='expense').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
        <input placeholder="Emoji" value={emoji} onChange={e=>setEmoji(e.target.value)} style={{width:80}} />
      </div>
      <div className="form-row">
        <input placeholder="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} />
        <div style={{display:'flex',gap:6}}>
          <button className="btn" type="submit">Parcelar e salvar</button>
          <button className="qa" type="button" onClick={addCat}>Nova categoria</button>
        </div>
      </div>
      <div className="muted">As parcelas serão geradas automaticamente e agendadas mês a mês.</div>
    </form>
  )
}
