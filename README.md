# Só para você

Site estático em português para apresentar uma carta de amor. Abra o arquivo
index.html no navegador para ver a prévia. O botão Tocar música reproduz em
loop a faixa Lullaby for Erik, de Evgeny Grinko, incluída em assets.

## Adicionar uma carta

Em `assets/carta.js`, acrescente um objeto à lista `cartas` para cada carta.
A ordem dos objetos é a ordem do menu. Use `AAAA-MM-DD` na data. Assinatura
e rodapé são opcionais. Para quebrar a linha dentro de um parágrafo, use `\n`.

```js
{
  titulo: 'Título da carta',
  data: '2026-11-26',
  paragrafos: ['Primeiro parágrafo.', 'Segundo parágrafo.'],
  assinatura: 'de: neri\npara: vivi ♥',
  rodape: 'Mensagem no fim da página.'
}
```

## Publicação

A raiz contém os arquivos estáticos e pode ser servida pelo GitHub Pages. A
publicação e a configuração do repositório remoto ficam para depois da aprovação.
