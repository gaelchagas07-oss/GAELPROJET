export const INCOME_CATEGORIES = [
  { name: 'Salário', emoji: '💼' },
  { name: 'Freelance', emoji: '💻' },
  { name: 'Investimentos', emoji: '📈' },
  { name: 'Presente', emoji: '🎁' },
  { name: 'Vendas', emoji: '🏷️' },
  { name: 'Outros', emoji: '💰' },
];

export const EXPENSE_CATEGORIES = [
  { name: 'Alimentação', emoji: '🍔' },
  { name: 'Moradia', emoji: '🏠' },
  { name: 'Transporte', emoji: '🚗' },
  { name: 'Saúde', emoji: '💊' },
  { name: 'Lazer', emoji: '🎮' },
  { name: 'Educação', emoji: '📚' },
  { name: 'Compras', emoji: '🛍️' },
  { name: 'Assinaturas', emoji: '📺' },
  { name: 'Pets', emoji: '🐶' },
  { name: 'Outros', emoji: '🧾' },
];

export function findCategory(list, name) {
  return list.find((c) => c.name === name) || list[list.length - 1];
}
