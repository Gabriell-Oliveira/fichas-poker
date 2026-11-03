import { LIMITS, STATUS_LABEL } from '../config.js';
import { esc, fmt } from '../utils.js';
import { stack } from './chips.js';
import * as rules from '../game/rules.js';

function notice(game) {
  if (rules.gameOver(game)) {
    const w = game.players.find((p) => !rules.isOut(p));
    return `<b>Fim de jogo:</b> ${esc(w ? w.name : '')} ficou com todas as fichas. Use "Nova partida" para recomeçar.`;
  }
  if (rules.lastStanding(game)) return '<b>Só um jogador restou.</b> Confirme o vencedor do pote.';
  if (rules.roundsDone(game)) return `<b>Rodadas encerradas.</b> Confirme o vencedor do pote.`;
  return '';
}

export function tableView(game, canUndo) {
  const total = rules.pot(game), top = rules.maxBet(game), inRound = rules.roundBets(game);
  const dots = Array.from({ length: LIMITS.rounds }, (_, i) => {
    const r = i + 1;
    return `<span class="dot ${r < game.round ? 'done' : r === game.round ? 'now' : ''}"></span>`;
  }).join('');
  const msg = notice(game);
  const last = game.last
    ? `<div class="card"><small>Mão ${game.last.hand}</small><br>🏆 <b>${esc(game.last.names.join(' e '))}</b> levou ${fmt(game.last.amount)}</div>` : '';
  const players = game.players.map((p, i) => {
    const out = rules.isOut(p);
    return `<button class="card pl ${p.status === 'fold' || out ? 'fd' : ''}" data-a="pick" data-i="${i}">
      <div class="top"><b>${esc(p.name)}</b><span class="tag">${STATUS_LABEL[p.status]}</span></div>
      <small>${fmt(p.chips)} fichas${p.bet ? ` · na rodada ${fmt(p.bet)}` : ''}</small>${stack(p.chips)}</button>`;
  }).join('');
  return `<div class="top"><div><h1>🃏 Mão ${game.hand}</h1><small>${game.players.length} jogadores</small></div>
    <div class="row" style="flex:0 0 auto">
      <button class="btn sec" data-a="undo" ${canUndo ? '' : 'disabled'} style="width:auto">↶ Desfazer</button>
      <button class="btn sec" data-a="reset" style="width:auto">Nova partida</button></div></div>
  <div class="card top"><div><b>Rodada ${game.round} de ${LIMITS.rounds}</b><br><span class="dots">${dots}</span></div>
    <button class="btn sec" data-a="nextRound" ${rules.canNextRound(game) ? '' : 'disabled'} style="width:auto">Próxima rodada ▸</button></div>
  ${msg ? `<div class="card notice">${msg}</div>` : ''}
  ${last}
  <div class="card pot"><small>Pote</small><br><b>${fmt(total)}</b>${stack(total)}
    <small>${game.pot ? `Rodadas anteriores: ${fmt(game.pot)} · ` : ''}Rodada atual: ${fmt(inRound)}${top ? ` · Maior aposta: ${fmt(top)}` : ''}</small></div>
  <button class="btn" data-a="openSettle" ${total ? '' : 'disabled'}>Confirmar vencedor do pote</button>
  <h2 style="margin-top:16px">Toque num jogador para jogar</h2>
  <div class="grid sm">${players}</div>`;
}
