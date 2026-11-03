import { DENOMINATIONS } from '../config.js';

const label = (v) => (v >= 1000 ? `${v / 1000}k` : v);

export const chip = (d, shadow = '') =>
  `<span class="chip" style="background:${d.bg};color:${d.fg};border-color:${d.fg}99;box-shadow:${shadow}">${label(d.value)}</span>`;

function column(d, count) {
  const layers = Math.min(count, 5), shadow = [];
  for (let i = 1; i < layers; i++) shadow.push(`0 ${i * 4}px 0 ${d.bg}`, `0 ${i * 4 + 1}px 0 rgba(0,0,0,.5)`);
  return `<div class="col"><div style="padding-bottom:${layers * 4}px">${chip(d, shadow.join(','))}</div><small>×${count}</small></div>`;
}

// Converte um valor em pilhas de fichas coloridas (maiores primeiro).
export function stack(amount) {
  let html = '';
  for (const d of DENOMINATIONS) {
    const count = Math.floor(amount / d.value);
    amount -= count * d.value;
    if (count) html += column(d, count);
  }
  return `<div class="stk">${html || '<span class="mut">sem fichas</span>'}</div>`;
}

// Botões para montar uma aposta (só fichas que o jogador consegue pagar).
export const picker = (maxChips) =>
  DENOMINATIONS.filter((d) => d.value <= maxChips)
    .map((d) => `<button class="pk" data-a="chip" data-v="${d.value}">${chip(d)}</button>`).join('');
