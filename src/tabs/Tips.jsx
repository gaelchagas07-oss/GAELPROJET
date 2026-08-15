const cardStyle = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
};

function TipCard({ icon, title, children }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {icon}
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#111827' }}>{title}</div>
      </div>
      <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export default function Tips() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TipCard icon="📐" title="Regra 50-30-20">
        <p style={{ marginBottom: 14 }}>
          Divida sua renda líquida mensal em três grandes blocos para manter o orçamento equilibrado sem esforço:
        </p>
        <div style={{ display: 'flex', height: 36, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ width: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
            50%
          </div>
          <div style={{ width: '30%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065f46', fontSize: 12, fontWeight: 700 }}>
            30%
          </div>
          <div style={{ width: '20%', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065f46', fontSize: 12, fontWeight: 700 }}>
            20%
          </div>
        </div>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><strong>50% Necessidades</strong> — moradia, contas, alimentação, transporte, saúde.</li>
          <li><strong>30% Desejos</strong> — lazer, assinaturas, compras não essenciais.</li>
          <li><strong>20% Poupança/dívidas</strong> — reserva de emergência, investimentos e quitação de dívidas.</li>
        </ul>
      </TipCard>

      <TipCard icon="🛟" title="Fundo de emergência">
        <p style={{ marginBottom: 10 }}>
          É o dinheiro que te protege de imprevistos (perda de renda, problemas de saúde, reparos urgentes) sem precisar recorrer a
          empréstimos ou cartão de crédito.
        </p>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Guarde de <strong>3 a 6 meses</strong> das suas despesas essenciais.</li>
          <li>Prefira aplicações com <strong>alta liquidez</strong> (resgate imediato), como Tesouro Selic ou CDB com liquidez diária.</li>
          <li>Construa aos poucos: mesmo 5-10% da renda por mês já cria o hábito.</li>
          <li>Só use esse fundo para emergências reais — não para desejos de consumo.</li>
        </ul>
      </TipCard>

      <TipCard icon="🌱" title="Como investir com pouco dinheiro">
        <p style={{ marginBottom: 10 }}>Você não precisa de muito capital para começar a investir. O importante é começar cedo e ser consistente.</p>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><strong>Tesouro Direto</strong> — títulos públicos a partir de poucos reais, segurança do governo federal.</li>
          <li><strong>CDBs de liquidez diária</strong> — bom para começar a reserva de emergência com rendimento melhor que a poupança.</li>
          <li><strong>Fundos de renda fixa</strong> — boa porta de entrada para quem ainda está aprendendo.</li>
          <li><strong>Aportes recorrentes</strong> — programe uma transferência automática todo mês, mesmo que pequena.</li>
          <li><strong>Diversifique aos poucos</strong> — conforme a reserva cresce, avalie ações, ETFs e fundos multimercado.</li>
          <li>Evite investir dinheiro que você pode precisar no curto prazo, e nunca invista antes de quitar dívidas com juros altos (cartão, cheque especial).</li>
        </ul>
      </TipCard>

      <TipCard icon="✅" title="Checklist rápido do mês">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Registrei todas as receitas e gastos do mês?</li>
          <li>Minhas parcelas de cartão cabem no orçamento dos próximos meses?</li>
          <li>Separei algo para a reserva de emergência antes de gastar com desejos?</li>
          <li>Revisei assinaturas e gastos recorrentes que não uso mais?</li>
          <li>Estou avançando em direção à minha meta de poupança?</li>
        </ul>
      </TipCard>
    </div>
  );
}
