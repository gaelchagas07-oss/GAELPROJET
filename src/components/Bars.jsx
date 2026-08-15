import React from 'react'

export default function Bars({ items = [] }){
  const max = Math.max(...items.map(i=>i.value), 1)
  return (
    <div className="bar-chart">
      {items.map(it => {
        const h = Math.round((it.value / max) * 100)
        return (
          <div key={it.key} style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div className="bar" style={{height: Math.max(6,h)+'px'}} title={`${it.label}: R$ ${it.value.toFixed(2)}`}></div>
            <div className="muted" style={{marginTop:6,fontSize:12}}>{it.emoji}</div>
          </div>
        )
      })}
    </div>
  )
}
