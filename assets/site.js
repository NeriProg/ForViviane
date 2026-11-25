const letter = document.querySelector('#letter');
const intro = document.querySelector('.intro');
const openButton = document.querySelector('.open');
const closeButton = document.querySelector('.close');
const letterTitle = document.querySelector('#letter-title');
const heartButton = document.querySelector('.heart');
const heartStatus = document.querySelector('.heart-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const musicButton = document.querySelector('.music');
const musicLabel = document.querySelector('#music-label');
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

let soundtrack;
let musicBusy = false;
const phrases = [
  [48, 55, 60, 64, 67, 64, 60, 55],
  [45, 52, 57, 60, 64, 60, 57, 52],
  [41, 48, 53, 57, 60, 64, 60, 57],
  [43, 50, 55, 59, 62, 67, 62, 59]
];

function createSoundtrack() {
  const context = new AudioContext();
  const duration = 0.55;
  const sampleCount = Math.round(context.sampleRate * duration * phrases.flat().length);
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const samples = buffer.getChannelData(0);

  phrases.flat().forEach((note, index) => {
    const start = Math.round(index * duration * context.sampleRate);
    const frequency = 440 * 2 ** ((note - 69) / 12);
    for (let frame = 0; frame < context.sampleRate * 2; frame++) {
      const time = frame / context.sampleRate;
      const phase = 2 * Math.PI * frequency * time;
      const volume = 0.15 * Math.min(time / 0.025, 1) * Math.exp(-3.2 * time);
      samples[(start + frame) % sampleCount] += volume *
        (Math.sin(phase) + 0.22 * Math.sin(phase * 2) + 0.07 * Math.sin(phase * 3));
    }
  });

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(context.destination);
  source.start();
  return context;
}

musicButton.addEventListener('click', async () => {
  if (musicBusy) return;
  musicBusy = true;
  try {
    if (musicButton.getAttribute('aria-pressed') === 'true') {
      await soundtrack.suspend();
      musicButton.setAttribute('aria-pressed', 'false');
      musicLabel.textContent = 'Tocar música';
    } else {
      soundtrack ??= createSoundtrack();
      await soundtrack.resume();
      musicButton.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = 'Pausar música';
    }
  } catch {
    musicLabel.textContent = 'Áudio indisponível';
  } finally {
    musicBusy = false;
  }
});
