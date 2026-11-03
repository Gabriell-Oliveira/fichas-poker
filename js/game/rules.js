// Regras puras do jogo: recebem o estado e devolvem um NOVO estado.
// Nada aqui toca em tela, DOM ou armazenamento, então é fácil de testar.
//
// Modelo: cada mão tem LIMITS.rounds rodadas de apostas.
//  - player.bet   = aposta na rodada atual
//  - game.pot     = fichas das rodadas anteriores (já recolhidas)
//  - player.acted = já jogou nesta rodada (um aumento zera isso para os outros)
import { LIMITS } from '../config.js';
import { fmt } from '../utils.js';

const ok = (game) => ({ ok: true, game });
const err = (error) => ({ ok: false, error });
const clone = (g) => structuredClone(g);

export const createGame = (names, start) => ({
  start, hand: 1, round: 1, pot: 0, last: null,
  players: names.map((name) => ({ name, chips: start, bet: 0, acted: false, status: 'wait' })),
});

// ---------- Consultas ----------
const inHand = (p) => p.status !== 'fold' && p.status !== 'out';
const actors = (g) => g.players.filter((p) => inHand(p) && p.chips > 0); // quem ainda pode apostar

export const maxBet = (g) => Math.max(0, ...g.players.map((p) => p.bet));
export const roundBets = (g) => g.players.reduce((s, p) => s + p.bet, 0);
export const pot = (g) => g.pot + roundBets(g);
export const amountToCall = (g, i) => {
  const p = g.players[i];
  return Math.min(Math.max(maxBet(g) - p.bet, 0), p.chips);
};
export const isOut = (p) => p.status === 'out';
export const activeIndexes = (g) => g.players.map((_, i) => i).filter((i) => inHand(g.players[i]));
export const lastStanding = (g) => g.players.filter(inHand).length <= 1;
export const gameOver = (g) => g.players.filter((p) => !isOut(p)).length <= 1;

// A rodada fecha quando todos que ainda podem apostar jogaram e igualaram a maior aposta.
export function roundComplete(g) {
  const mx = maxBet(g), a = actors(g);
  if (a.length <= 1) return a.every((p) => p.bet === mx); // ninguém mais para apostar contra
  return a.every((p) => p.acted && p.bet === mx);
}
export const roundsDone = (g) => g.round >= LIMITS.rounds && roundComplete(g);
export const isHandOver = (g) => lastStanding(g) || roundsDone(g);
export const canNextRound = (g) =>
  !isHandOver(g) && g.round < LIMITS.rounds && actors(g).every((p) => p.bet === maxBet(g));

export const normalizeStart = (v) => Math.round(v / LIMITS.unit) * LIMITS.unit;
export function validateSetup(names, start) {
  if (names.length < LIMITS.minPlayers) return `Adicione pelo menos ${LIMITS.minPlayers} jogadores`;
  if (!(start >= LIMITS.unit)) return 'Informe as fichas iniciais';
  return null;
}

// ---------- Rodadas ----------
function roll(n) { // recolhe as apostas para o pote e abre a próxima rodada
  n.pot += roundBets(n);
  n.round += 1;
  n.players.forEach((p) => {
    p.bet = 0; p.acted = false;
    if (inHand(p) && p.status !== 'allin') p.status = 'wait';
  });
}
function advance(n) { // avança sozinho enquanto a rodada estiver completa
  while (!lastStanding(n) && n.round < LIMITS.rounds && roundComplete(n)) roll(n);
  return n;
}
export function nextRound(g) {
  if (isHandOver(g)) return err('Mão encerrada: confirme o vencedor');
  if (g.round >= LIMITS.rounds) return err('Esta já é a última rodada');
  if (!canNextRound(g)) return err('Ainda há aposta a cobrir');
  const n = clone(g); roll(n);
  return ok(advance(n));
}

// ---------- Ações do jogador ----------
function guard(g, i) {
  if (isHandOver(g)) return 'Mão encerrada: confirme o vencedor';
  if (!inHand(g.players[i])) return 'Este jogador não está na mão';
  return null;
}

export function placeBet(g, i, amount) {
  const bad = guard(g, i); if (bad) return err(bad);
  const p = g.players[i], mx = maxBet(g);
  if (amount <= 0) return err('Escolha um valor');
  if (amount > p.chips) return err('Fichas insuficientes');
  if (p.bet + amount < mx && amount < p.chips) return err(`A aposta precisa cobrir a mesa (${fmt(mx)})`);
  const n = clone(g), q = n.players[i];
  q.chips -= amount; q.bet += amount; q.acted = true;
  const raised = q.bet > mx;
  q.status = q.chips === 0 ? 'allin' : (raised ? 'raise' : 'call');
  if (raised) { // aumento: os outros precisam responder de novo
    n.players.forEach((o, k) => { if (k !== i) { o.acted = false; if (inHand(o) && o.status !== 'allin') o.status = 'wait'; } });
  }
  return ok(advance(n));
}
export const call = (g, i) => placeBet(g, i, amountToCall(g, i));
export const allIn = (g, i) => placeBet(g, i, g.players[i].chips);

export function check(g, i) {
  const bad = guard(g, i); if (bad) return err(bad);
  if (amountToCall(g, i) > 0) return err('Há aposta a cobrir: pague ou desista');
  const n = clone(g); n.players[i].status = 'check'; n.players[i].acted = true;
  return ok(advance(n));
}
export function fold(g, i) {
  const bad = guard(g, i); if (bad) return err(bad);
  const n = clone(g); n.players[i].status = 'fold'; n.players[i].acted = true;
  return ok(advance(n));
}

// ---------- Fim da mão ----------
// Divide o pote entre os vencedores (múltiplos de 10). O resto vai para o primeiro.
export function settle(g, winners) {
  const ids = [...winners].sort((a, b) => a - b);
  if (!ids.length) return err('Escolha ao menos um vencedor');
  const total = pot(g), share = Math.floor(total / ids.length / LIMITS.unit) * LIMITS.unit;
  const rest = total - share * ids.length;
  const n = clone(g);
  n.last = { hand: g.hand, names: ids.map((i) => g.players[i].name), amount: total };
  n.players.forEach((p, i) => {
    const k = ids.indexOf(i);
    if (k >= 0) p.chips += share + (k === 0 ? rest : 0);
    p.bet = 0; p.acted = false;
    p.status = p.chips === 0 ? 'out' : 'wait';
  });
  n.pot = 0; n.round = 1; n.hand += 1;
  return ok(n);
}
