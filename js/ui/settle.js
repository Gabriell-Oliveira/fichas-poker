import { esc, fmt } from '../utils.js';
import { pot, isOut } from '../game/rules.js';

// Janela para escolher quem ganhou o pote (jogadores sem fichas ficam de fora).
export function settleView(game, selected) {
  const options = game.players.map((p, i) => isOut(p) ? '' : `<label class="opt">
    <input type="checkbox" data-a="tog" data-i="${i}" ${selected.has(i) ? 'checked' : ''}>
    <span style="color:var(--tx)">${esc(p.name)} ${p.status === 'fold' ? '<small>(desistiu)</small>' : ''}</span></label>`).join('');
  return `<div class="ov"><div class="card"><h2>Quem ganhou ${fmt(pot(game))}?</h2>
    <small>Marque mais de um para dividir (empate).</small>${options}
    <div class="row" style="margin-top:12px"><button class="btn sec" data-a="closeM">Cancelar</button>
    <button class="btn" data-a="settle">Confirmar</button></div></div></div>`;
}
