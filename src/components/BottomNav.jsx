const NAV_ITEMS = [
  { id: 'overview', label: 'Início', icon: '📊' },
  { id: 'add', label: 'Lançar', icon: '➕' },
  { id: 'cards', label: 'Cartões', icon: '💳' },
  { id: 'history', label: 'Histórico', icon: '📜' },
  { id: 'tips', label: 'Dicas', icon: '💡' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        background: '#ffffff',
        borderTop: '1px solid #eef0f2',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 30,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              padding: '8px 2px 10px',
              border: 'none',
              background: 'transparent',
              color: isActive ? '#16a34a' : '#9ca3af',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
