// Única camada que fala com o localStorage. Para trocar por um servidor no futuro,
// mantenha estas funções e mude só o corpo delas.
import { STORAGE_KEY } from './config.js';

export function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
export function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* sem armazenamento */ }
}
export function clear() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* sem armazenamento */ }
}
