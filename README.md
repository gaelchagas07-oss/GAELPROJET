# FinControl — Controle Financeiro Pessoal

Aplicativo completo de controle financeiro pessoal, construído em React (Vite) com hooks (`useState`, `useEffect`), sem bibliotecas externas de gráficos — todos os gráficos são SVG puro, e todo o CSS é inline (objetos de estilo) ou via template string.

## Funcionalidades

- **Visão Geral** — cards de receita/gasto/saldo com sparklines dos últimos 6 meses, cartões bancários com gradiente, ações rápidas, gráfico de barras por categoria, últimas transações e alertas de compromissos futuros.
- **Lançar** — formulário para receitas e gastos à vista, e formulário separado para compras no cartão de crédito com parcelamento automático.
- **Cartões** — cadastro de múltiplos cartões com limite, cor personalizada e timeline visual de parcelas por mês.
- **Histórico** — listagem separada de transações à vista e parcelas do cartão no mês selecionado.
- **Dicas** — guia financeiro com Regra 50-30-20, fundo de emergência e como investir com pouco.

Outros recursos: seletor de mês/ano, parcelamento inteligente (distribuição automática das parcelas pelos meses corretos), meta de poupança ajustável com barra de progresso, e persistência de todos os dados via `localStorage`.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```
