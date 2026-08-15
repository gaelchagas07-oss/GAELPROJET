import React from 'react'

export default function Sparkline({ values = [], color = '#06b77f', height = 36, width = 120 }){
  if(values.length === 0) return <svg width={width} height={height}></svg>
  const max = Math.max(...values.map(v=>Math.abs(v))) || 1
  const min = Math.min(...values) || 0
  const range = max - min || 1
  const step = width / (values.length - 1)
  const points = values.map((v,i)=>{ const x=i*step; const y=height - ((v-min)/range)*(height-6)-3; return `${x},${y}` }).join(' ')
  return (
    <svg width={width} height={height}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
