const letter = document.querySelector('#letter');
const intro = document.querySelector('.intro');
const openButton = document.querySelector('.open');
const closeButton = document.querySelector('.close');
const letterTitle = document.querySelector('#letter-title');
const heartButton = document.querySelector('.heart');
const heartStatus = document.querySelector('.heart-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const footerDefault = document.querySelector('#footer-default');
const footerLetter = document.querySelector('#footer-letter');

document.querySelector('#letter-note').hidden = !carta.previa;
letterTitle.textContent = carta.titulo;
document.querySelector('#signature').textContent = carta.assinatura;
for (const text of carta.paragrafos) {
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  document.querySelector('#letter-body').append(paragraph);
}

function showLetter(open) {
  intro.classList.toggle('is-open', open);
  letter.hidden = !open;
  footerDefault.hidden = open;
  footerLetter.hidden = !open;
  openButton.setAttribute('aria-expanded', String(open));
  const destination = open ? letterTitle : openButton;
  destination.focus({ preventScroll: true });
  (open ? letter : intro).scrollIntoView({
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
    block: 'start'
  });
}

openButton.addEventListener('click', () => showLetter(true));
closeButton.addEventListener('click', () => showLetter(false));
heartButton.addEventListener('click', () => {
  const liked = heartButton.getAttribute('aria-pressed') === 'true';
  heartButton.setAttribute('aria-pressed', String(!liked));
  heartButton.textContent = liked ? '♡' : '♥';
  heartStatus.textContent = liked ? '' : 'Um coração ficou aqui.';
});

const soundtrack = document.querySelector('.soundtrack');
const soundtrackPanel = document.querySelector('.soundtrack-panel');
let player;

soundtrack.addEventListener('toggle', () => {
  if (!soundtrack.open) {
    player?.remove();
    player = undefined;
    return;
  }

  player = document.createElement('iframe');
  player.title = 'Trilha sonora no YouTube';
  player.src = 'https://www.youtube.com/embed/X5UmxZkLXro?playsinline=1&loop=1&playlist=X5UmxZkLXro';
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  player.allowFullscreen = true;
  soundtrackPanel.prepend(player);
});
