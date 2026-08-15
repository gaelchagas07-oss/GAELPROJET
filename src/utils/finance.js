export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const MONTH_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function formatBRL(value) {
  return (Number(value) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function monthLabel(year, month) {
  return `${MONTH_NAMES[month - 1]} de ${year}`;
}

export function monthLabelShort(year, month) {
  return `${MONTH_SHORT[month - 1]}/${String(year).slice(2)}`;
}

export function addMonths(year, month, delta) {
  const total = year * 12 + (month - 1) + delta;
  const y = Math.floor(total / 12);
  const m = ((total % 12) + 12) % 12 + 1;
  return { year: y, month: m };
}

export function last6Months(year, month) {
  const arr = [];
  for (let i = 5; i >= 0; i--) arr.push(addMonths(year, month, -i));
  return arr;
}

export function nextMonths(year, month, count) {
  const arr = [];
  for (let i = 1; i <= count; i++) arr.push(addMonths(year, month, i));
  return arr;
}

export function monthsFrom(year, month, count) {
  const arr = [];
  for (let i = 0; i < count; i++) arr.push(addMonths(year, month, i));
  return arr;
}

export function todayParts() {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export function todayISO() {
  const { year, month, day } = todayParts();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseISODate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

export function generateInstallments(purchase) {
  const per = purchase.totalAmount / purchase.installments;
  const list = [];
  for (let i = 0; i < purchase.installments; i++) {
    const { year, month } = addMonths(purchase.year, purchase.month, i);
    list.push({
      id: `${purchase.id}-${i + 1}`,
      purchaseId: purchase.id,
      cardId: purchase.cardId,
      description: purchase.description,
      category: purchase.category,
      categoryEmoji: purchase.categoryEmoji,
      amount: per,
      year,
      month,
      installmentNumber: i + 1,
      totalInstallments: purchase.installments,
    });
  }
  return list;
}

export function sum(list, pick = (x) => x.amount) {
  return list.reduce((acc, item) => acc + (Number(pick(item)) || 0), 0);
}

export function groupByCategory(items) {
  const map = new Map();
  for (const it of items) {
    const key = it.category;
    if (!map.has(key)) map.set(key, { category: it.category, emoji: it.categoryEmoji, total: 0 });
    map.get(key).total += it.amount;
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
