import React, { useState, useEffect } from 'react'

export default function CashForm({ categories, onAdd, onAddCategory }){
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [category, setCategory] = useState(categories[0]?.id || '')
  const [emoji, setEmoji] = useState('💸')
  const [desc, setDesc] = useState('')

  useEffect(()=>{ if(categories.length && !category) setCategory(categories[0].id) },[categories])

  function submit(e){ e.preventDefault(); if(!amount || isNaN(Number(amount))) return alert('Informe um valor válido'); onAdd({ type, amount: Number(amount), date, category, emoji, desc: desc || (type==='income' ? 'Receita' : 'Despesa') }); setAmount(''); setDesc('') }
  function addCat(){ const id = prompt('ID curto da categoria (ex: aluguel):'); if(!id) return; const name = prompt('Nome da categoria:'); const em = prompt('Emoji para a categoria (ex: 🏠):','🏷️'); const type = prompt('Tipo (income/expense):','expense'); onAddCategory({ id, name, emoji: em, type }); setCategory(id) }

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <select value={type} onChange={e=>setType(e.target.value)} style={{width:120}}>
          <option value="expense">Gasto</option>
          <option value="income">Receita</option>
        </select>
        <input placeholder="Valor (R$)" value={amount} onChange={e=>setAmount(e.target.value)} />
      </div>
      <div className="form-row">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          {categories.filter(c=>c.type === (type==='income'?'income':'expense')).map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
      </div>
      <div className="form-row">
        <input placeholder="Emoji" value={emoji} onChange={e=>setEmoji(e.target.value)} style={{width:80}} />
        <input placeholder="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} />
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn" type="submit">Salvar</button>
        <button type="button" className="qa" onClick={addCat}>Nova categoria</button>
      </div>
    </form>
  )
}
