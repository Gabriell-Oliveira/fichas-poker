// Decide qual tela mostrar. Só monta HTML; não altera o jogo.
import { $ } from '../utils.js';
import { getGame, canUndo } from '../game/store.js';
import { session } from '../session.js';
import { setupView } from './setup.js';
import { tableView } from './table.js';
import { sheetView } from './sheet.js';
import { settleView } from './settle.js';

export function render() {
  const game = getGame(), root = $('#app');
  if (!game) { root.innerHTML = setupView(session.names); return; }
  root.innerHTML = tableView(game, canUndo())
    + (session.sel !== null ? sheetView(game, session) : '')
    + (session.modal ? settleView(game, session.modal) : '');
}
