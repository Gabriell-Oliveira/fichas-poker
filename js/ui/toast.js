import { $ } from '../utils.js';

let timer;
export function toast(message) {
  const el = $('#toast');
  el.textContent = message; el.className = 'on';
  clearTimeout(timer);
  timer = setTimeout(() => { el.className = ''; }, 3000);
}
