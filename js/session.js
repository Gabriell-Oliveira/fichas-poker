// Estado só de tela (não é salvo): quem está jogando, valor sendo montado, modais abertos.
export const session = { names: [], sel: null, draft: 0, modal: null };

export function closeOverlays() {
  session.sel = null; session.draft = 0; session.modal = null;
}
