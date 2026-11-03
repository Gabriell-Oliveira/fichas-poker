# 🃏 Fichas de Poker

Site para controlar as fichas de uma mesa de poker **presencial**. O jogo (cartas e regras) acontece na vida real; o app só gerencia fichas, apostas e o pote.

Versão de tela única: um celular ou tablet fica na mesa e controla todos os jogadores. Sem servidor, sem build.

## Funcionalidades
- Cadastro de 2 a 12 jogadores e fichas iniciais iguais
- Fichas coloridas por valor (10, 50, 100, 500, 1k)
- 3 rodadas de apostas por mão: a rodada fecha sozinha quando todos jogaram e igualaram a aposta (um aumento reabre para os outros), ou pelo botão "Próxima rodada"
- Apostar/Aumentar, Pagar, Passar, All-in e Desistir
- Aviso ao fim da 3ª rodada para confirmar o vencedor
- Confirmação do vencedor, com divisão do pote em caso de empate
- Desfazer a última ação
- Partida salva no aparelho (`localStorage`)

## Como rodar
O projeto usa módulos ES, que **não funcionam abrindo o `index.html` direto** (`file://`). Use um servidor local:

```bash
npm run dev        # ou: npx serve .
```

Também serve a extensão Live Server do VS Code.

## Deploy no Vercel
É um site estático, sem configuração:
1. Suba o repositório no GitHub.
2. Em vercel.com/new, importe o repositório e clique em Deploy (Framework: *Other*, sem build command).

## Estrutura
```
index.html           página única
css/
  tokens.css         cores e tema (claro/escuro)
  styles.css         estilos dos componentes
js/
  main.js            ponto de entrada
  config.js          fichas, limites, textos de status
  utils.js           helpers (formatar, escapar HTML)
  storage.js         único ponto de acesso ao localStorage
  session.js         estado só de tela (modais, valor sendo montado)
  actions.js         liga cliques às regras
  game/
    rules.js         regras puras (apostar, pagar, dividir pote)
    store.js         jogo atual, histórico/desfazer, persistência
  ui/
    app.js           escolhe a tela
    setup.js table.js sheet.js settle.js   telas e janelas
    chips.js         desenho das fichas
    toast.js         avisos
```

## Onde mexer ao evoluir
| Quero... | Arquivo |
|---|---|
| Mudar valores das fichas ou o número de rodadas (`LIMITS.rounds`) | `js/config.js` |
| Mudar como uma rodada abre e fecha | `js/game/rules.js` (`roundComplete`, `advance`) |
| Mudar cores do tema | `css/tokens.css` |
| Adicionar blinds ou recarga de fichas (rebuy) | `js/game/rules.js` + botão em `js/ui/table.js` + ação em `js/actions.js` |
| Guardar histórico de mãos | `js/game/rules.js` (campo no estado) + nova tela em `js/ui/` |
| Sincronizar entre celulares (sala online) | trocar `js/storage.js` / `js/game/store.js` por um backend |

## Limitações
- Sem pote lateral (*side pot*) para all-ins com valores diferentes: quem opera o aparelho decide o vencedor e o valor.
