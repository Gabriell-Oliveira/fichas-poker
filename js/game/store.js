// Guarda o jogo atual, o histórico (para desfazer) e persiste no storage.
// A interface só conversa com este módulo para ler ou mudar o jogo.
import { LIMITS } from '../config.js';
import * as storage from '../storage.js';

const saved = storage.load();
let game = saved?.game ?? null;
let history = saved?.history ?? [];
const listeners = new Set();

const persist = () => storage.save({ game, history });
const emit = () => listeners.forEach((fn) => fn());

export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getGame = () => game;
export const canUndo = () => history.length > 0;

export function start(newGame) {
  game = newGame; history = []; persist(); emit();
}
// Recebe o resultado de uma função de rules.js ({ok, game} ou {ok:false, error}).
export function apply(result) {
  if (!result.ok) return result;
  history.push(game);
  if (history.length > LIMITS.maxHistory) history.shift();
  game = result.game; persist(); emit();
  return result;
}
export function undo() {
  if (!history.length) return;
  game = history.pop(); persist(); emit();
}
export function reset() {
  game = null; history = []; storage.clear(); emit();
}
