// Ponto de entrada: liga store, tela e ações.
import { subscribe } from './game/store.js';
import { render } from './ui/app.js';
import { bindActions } from './actions.js';

subscribe(render);
bindActions(render);
render();
