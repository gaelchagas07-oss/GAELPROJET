const NAV_ITEMS = [
  { id: 'overview', label: 'Visão Geral', icon: '📊' },
  { id: 'add', label: 'Lançar', icon: '➕' },
  { id: 'cards', label: 'Cartões', icon: '💳' },
  { id: 'history', label: 'Histórico', icon: '📜' },
  { id: 'tips', label: 'Dicas', icon: '💡' },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#ffffff',
        borderRight: '1px solid #eef0f2',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', marginBottom: 32 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 4px 10px rgba(21,128,61,0.35)',
          }}
        >
          💰
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#111827', lineHeight: 1.2 }}>FinControl</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>Controle Financeiro</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 10,
                border: 'none',
                background: isActive ? '#16a34a' : 'transparent',
                color: isActive ? '#ffffff' : '#4b5563',
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                textAlign: 'left',
                transition: 'background .15s ease, color .15s ease',
                boxShadow: isActive ? '0 6px 14px rgba(22,163,74,0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '12px 8px', fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>
        Seus dados ficam salvos apenas neste navegador (localStorage).
      </div>
    </aside>
  );
}
