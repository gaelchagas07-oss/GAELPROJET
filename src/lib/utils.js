export function uid(){ return Math.random().toString(36).slice(2,9) }
export function addMonths(date, n){ const d=new Date(date); d.setMonth(d.getMonth()+n); return d }
export function monthKey(d){ return `${d.getFullYear()}-${d.getMonth()+1}` }
