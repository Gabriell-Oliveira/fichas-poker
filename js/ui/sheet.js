import { esc, fmt } from '../utils.js';
import { picker } from './chips.js';
import { amountToCall, maxBet } from '../game/rules.js';

// Painel de ações do jogador selecionado.
export function sheetView(game, session) {
  const i = session.sel, p = game.players[i], draft = session.draft;
  const head = `<div class="ov"><div class="card"><div class="top"><h2>${esc(p.name)}</h2><small>${fmt(p.chips)} fichas · na mesa ${fmt(p.bet)}</small></div>`;
  if (p.chips === 0) {
    return `${head}<p>${p.bet ? 'Está all-in.' : 'Está sem fichas.'}</p><button class="btn sec" data-a="close">Fechar</button></div></div>`;
  }
  const need = amountToCall(game, i);
  const raising = maxBet(game) > 0;
  return `${head}<div class="stk">${picker(p.chips)}</div>
  <div class="draft">${draft ? fmt(draft) : 'Toque nas fichas'}</div>
  <div class="row"><button class="btn" data-a="bet" ${draft ? '' : 'disabled'}>${raising ? 'Aumentar' : 'Apostar'}</button>
    <button class="btn sec" data-a="clear" ${draft ? '' : 'disabled'}>Limpar</button></div>
  <div class="row" style="margin-top:8px">
    ${need ? `<button class="btn sec" data-a="call">Pagar ${fmt(need)}</button>` : '<button class="btn sec" data-a="check">Passar</button>'}
    <button class="btn sec" data-a="allin">All-in ${fmt(p.chips)}</button>
    <button class="btn bad" data-a="fold">Desistir</button></div>
  <button class="btn sec" data-a="close" style="margin-top:8px">Fechar</button></div></div>`;
}
