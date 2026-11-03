// Constantes do app. Mexa aqui para trocar valores de fichas, limites e textos.
export const DENOMINATIONS = [
  { value: 1000, bg: '#1c1c1c', fg: '#ffffff' },
  { value: 500,  bg: '#2e8b57', fg: '#ffffff' },
  { value: 100,  bg: '#2a62c9', fg: '#ffffff' },
  { value: 50,   bg: '#c0392b', fg: '#ffffff' },
  { value: 10,   bg: '#f1efe6', fg: '#222222' },
];

export const STATUS_LABEL = {
  wait: 'Aguardando', check: 'Passou', call: 'Pagou',
  raise: 'Apostou', fold: 'Desistiu', allin: 'All-in', out: 'Sem fichas',
};

export const LIMITS = {
  minPlayers: 2,
  maxPlayers: 12,
  defaultStart: 1000,
  rounds: 3,       // rodadas de apostas por mão
  unit: 10,        // menor valor de ficha
  maxHistory: 40,  // quantas ações podem ser desfeitas
};

export const STORAGE_KEY = 'fichas-poker:v2';
