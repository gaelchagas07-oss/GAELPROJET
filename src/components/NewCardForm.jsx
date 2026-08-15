import React, { useState } from 'react'

export default function NewCardForm({ onAddCard }){
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [limit, setLimit] = useState(1000)
  const [colorA, setColorA] = useState('#2bca9b')
  const [colorB, setColorB] = useState('#066d51')

  function submit(e){ e.preventDefault(); if(!name) return alert('Nome do cartão'); onAddCard({ name, limit: Number(limit), colorA, colorB }); setOpen(false); setName(''); setLimit(1000) }
  if(!open) return <div style={{minWidth:180}}><button className="qa" onClick={()=>setOpen(true)}>+ Novo cartão</button></div>
  return (
    <form onSubmit={submit} style={{minWidth:260}}>
      <div className="form-row"><input placeholder="Nome do cartão" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div className="form-row"><input placeholder="Limite" value={limit} onChange={e=>setLimit(e.target.value)} /></div>
      <div className="form-row">
        <input placeholder="Cor A" value={colorA} onChange={e=>setColorA(e.target.value)} />
        <input placeholder="Cor B" value={colorB} onChange={e=>setColorB(e.target.value)} />
      </div>
      <div style={{display:'flex',gap:8}}><button className="btn" type="submit">Criar</button><button className="qa" onClick={()=>setOpen(false)} type="button">Cancelar</button></div>
    </form>
  )
}
