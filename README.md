# GAEL Financial (Vite)

Projeto convertido para Vite + React. Tudo escrito com React Hooks e sem bibliotecas de gráficos — gráficos usam SVG puro. CSS foi mantido em um template string injetado dinamicamente para cumprir o requisito "CSS inline ou template string".

Como rodar:

1. Instale dependências: npm install
2. Rode em dev: npm run dev
3. Build: npm run build

Persistência: localStorage (chaves gp:txs, gp:cards, gp:categories, gp:goal)

Funcionalidades principais:
- Sidebar e 5 abas: Visão Geral, Lançar, Cartões, Histórico, Dicas
- Seletor de mês/ano
- Parcelamento inteligente: compras no cartão geram parcelas agendadas mês a mês
- Alertas de compromissos futuros
- Meta de poupança com barra de progresso
- Categorias com emoji


