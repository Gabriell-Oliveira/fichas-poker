// Liga cliques da tela às regras do jogo. Cada ação em data-a="..." vira uma função aqui.
import { LIMITS } from './config.js';
import { $ } from './utils.js';
import { session, closeOverlays } from './session.js';
import * as store from './game/store.js';
import * as rules from './game/rules.js';
import { toast } from './ui/toast.js';

export function bindActions(render) {
  const game = () => store.getGame();
  // Aplica uma regra: se der erro, avisa; se der certo, fecha painéis e salva.
  const commit = (result) => {
    if (!result.ok) return toast(result.error);
    const before = game();
    closeOverlays();
    store.apply(result);
    const after = game();
    if (after.hand === before.hand && after.round > before.round) {
      toast(`Rodada ${after.round} de ${LIMITS.rounds}`);
    }
  };

  const actions = {
    // Configuração
    add() {
      const name = $('#nm').value.trim();
      if (!name) return;
      if (session.names.length >= LIMITS.maxPlayers) return toast(`Máximo de ${LIMITS.maxPlayers} jogadores`);
      session.names.push(name); render(); $('#nm').focus();
    },
    rm(d) { session.names.splice(+d.i, 1); render(); },
    start() {
      const start = rules.normalizeStart(+$('#st').value);
      const problem = rules.validateSetup(session.names, start);
      if (problem) return toast(problem);
      closeOverlays();
      store.start(rules.createGame(session.names, start));
    },
    reset() {
      if (!confirm('Encerrar esta partida e começar outra?')) return;
      session.names = []; closeOverlays(); store.reset();
    },
    undo() { closeOverlays(); store.undo(); toast('Última ação desfeita'); },

    // Painel do jogador
    pick(d) {
      const g = game(), i = +d.i;
      if (rules.isHandOver(g)) return toast('Mão encerrada: confirme o vencedor');
      if (rules.isOut(g.players[i])) return toast('Este jogador está sem fichas');
      session.sel = i; session.draft = 0; render();
    },
    close() { session.sel = null; session.draft = 0; render(); },
    chip(d) {
      const p = game().players[session.sel];
      session.draft = Math.min(p.chips, session.draft + +d.v); render();
    },
    clear() { session.draft = 0; render(); },
    bet() { commit(rules.placeBet(game(), session.sel, session.draft)); },
    call() { commit(rules.call(game(), session.sel)); },
    check() { commit(rules.check(game(), session.sel)); },
    fold() { commit(rules.fold(game(), session.sel)); },
    allin() { commit(rules.allIn(game(), session.sel)); },

    nextRound() { commit(rules.nextRound(game())); },

    // Fim da mão
    openSettle() {
      const active = rules.activeIndexes(game());
      session.modal = new Set(active.length === 1 ? active : []); render();
    },
    tog(d) { const i = +d.i; session.modal.has(i) ? session.modal.delete(i) : session.modal.add(i); render(); },
    closeM() { session.modal = null; render(); },
    settle() { commit(rules.settle(game(), session.modal)); },
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-a]');
    if (el && el.tagName !== 'INPUT' && actions[el.dataset.a]) actions[el.dataset.a](el.dataset);
  });
  document.addEventListener('change', (e) => {
    const el = e.target.closest('input[data-a]');
    if (el) actions[el.dataset.a](el.dataset);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.id === 'nm') actions.add();
  });
}
