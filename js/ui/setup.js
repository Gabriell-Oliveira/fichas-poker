import { LIMITS } from '../config.js';
import { esc } from '../utils.js';

export function setupView(names) {
  const pills = names.map((n, i) => `<span class="pill">${esc(n)}<button data-a="rm" data-i="${i}" aria-label="Remover">×</button></span>`).join('');
  return `<h1>🃏 Fichas de Poker</h1>
  <p class="mut">Um aparelho na mesa controla as fichas de todos. O jogo (cartas e regras) acontece na vida real.</p>
  <div class="card"><h2>Jogadores (${names.length})</h2>
    <div>${pills || '<small>Adicione os nomes abaixo</small>'}</div>
    <div class="row" style="margin-top:8px">
      <input type="text" id="nm" maxlength="16" placeholder="Nome do jogador" style="margin:0;flex:3 1 140px">
      <button class="btn sec" data-a="add" style="flex:1 1 80px">Adicionar</button>
    </div></div>
  <div class="card"><label>Fichas iniciais de cada jogador
    <input type="number" id="st" inputmode="numeric" min="${LIMITS.unit}" step="${LIMITS.unit}" value="${LIMITS.defaultStart}"></label>
    <button class="btn" data-a="start">Começar partida</button></div>`;
}
