export const styles = `
:root{ --bg:#f5f7fb; --card:#ffffff; --muted:#6b7280; --accent:#08966d; --accent-2:#06b77f; --shadow: 0 6px 18px rgba(12, 18, 28, 0.06); }
html,body,#root { height:100%; margin:0; font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: var(--bg); color:#0f1724; }
.app { display:flex; height:100vh; color:#0f1724; }
.sidebar { width:260px; background:linear-gradient(180deg,#063a2a,#0b4f3d); color:#e6fff6; padding:28px; box-sizing:border-box; display:flex; flex-direction:column; gap:18px; }
.brand { font-weight:700; font-size:20px; display:flex; align-items:center; gap:10px; }
.nav { display:flex; flex-direction:column; gap:8px; margin-top:6px; }
.nav button { background:transparent;border:0;color:#d8fff2;text-align:left;padding:10px;border-radius:8px; cursor:pointer; font-weight:600; display:flex; gap:10px; align-items:center; }
.nav button.active { background: rgba(255,255,255,0.06); color:#fff; box-shadow: inset 0 -1px 0 rgba(255,255,255,0.02); }
.content { flex:1; padding:28px; overflow:auto; box-sizing:border-box; }
.header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:18px; }
.period { display:flex; gap:10px; align-items:center; background:var(--card); padding:10px 12px; border-radius:10px; box-shadow: var(--shadow); }
.period select { border:0; background:transparent; font-weight:600; }
.grid { display:grid; grid-template-columns: repeat(12,1fr); gap:16px; }
.card { background:var(--card); border-radius:12px; padding:16px; box-shadow: var(--shadow); }
.span-3 { grid-column: span 3; }
.span-6 { grid-column: span 6; }
.span-12 { grid-column: span 12; }
.h { font-size:14px; color:var(--muted); margin:0 0 8px 0; }
.big { font-size:22px; font-weight:700; }
.bank-card { border-radius:12px; padding:18px; color:white; min-height:110px; display:flex; flex-direction:column; justify-content:space-between; }
.quick-actions { display:flex; gap:8px; margin-top:10px; }
.qa { background:rgba(9,122,88,0.08); border-radius:8px; padding:8px 10px; cursor:pointer; color:var(--accent); font-weight:600; }
.transactions { display:flex; flex-direction:column; gap:8px; max-height:240px; overflow:auto; }
.tx { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px; border-radius:8px; }
.tx .meta { display:flex; gap:10px; align-items:center; }
.pill { background:#eefaf6; padding:6px 8px; border-radius:8px; color:var(--accent); font-weight:700; font-size:13px; }
.bar-chart { display:flex; gap:12px; align-items:end; height:140px; padding-top:12px; }
.bar { background:linear-gradient(180deg,#06b77f,#08966d); width:28px; border-radius:6px 6px 0 0; display:flex; align-items:flex-end; justify-content:center; color:white; font-weight:700; font-size:12px; }
.controls { display:flex; gap:8px; align-items:center; }
.btn { background:var(--accent); color:white; border:0; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700; }
.muted { color:var(--muted); font-size:13px; }
.form-row { display:flex; gap:8px; margin-bottom:8px; }
input, select, textarea { padding:10px; border-radius:8px; border:1px solid #e6eef0; flex:1; }
.cards-list { display:flex; gap:12px; flex-wrap:wrap; }
.card-small { min-width:180px; padding:12px; border-radius:10px; color:white; box-shadow:var(--shadow); }
.timeline { display:flex; gap:8px; align-items:center; overflow:auto; padding:8px 0; }
.month-pill { min-width:80px; padding:10px; border-radius:8px; background:#fff; box-shadow:var(--shadow); text-align:center; }
.progress { background:#e6f7f1; height:12px; border-radius:8px; overflow:hidden; }
.progress-inner { height:100%; background:linear-gradient(90deg,#06b77f,#08966d); }
.tips { line-height:1.6; }
.category-bubble { display:inline-flex; gap:8px; align-items:center; padding:6px 8px; border-radius:12px; background:#fbfffd; border:1px solid #ecf6f2; margin-right:6px; }
@media (max-width:900px) { .sidebar { display:none; } .grid { grid-template-columns: repeat(6,1fr); } .span-3 { grid-column: span 3; } .span-6 { grid-column: span 6; } }
`
