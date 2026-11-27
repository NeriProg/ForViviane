const letter = document.querySelector('#letter');
const intro = document.querySelector('.intro');
const letterList = document.querySelector('#letter-list');
const closeButton = letter.querySelector('.close');
const deleteButton = document.querySelector('#delete-letter');
const letterTitle = document.querySelector('#letter-title');
const letterDate = document.querySelector('#letter-date');
const letterBody = document.querySelector('#letter-body');
const signature = document.querySelector('#signature');
const heartButton = document.querySelector('.heart');
const heartStatus = document.querySelector('.heart-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const footerDefault = document.querySelector('#footer-default');
const footerLetter = document.querySelector('#footer-letter');

const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' });
const likedLetters = new Set();
let activeLetter;
let activeButton;

function addLetterCard(carta) {
  const item = document.createElement('li');
  const button = document.createElement('button');
  const title = document.createElement('span');
  const date = document.createElement('time');
  button.type = 'button';
  button.className = 'letter-card';
  button.setAttribute('aria-controls', 'letter');
  button.setAttribute('aria-expanded', 'false');
  title.textContent = carta.titulo;
  date.dateTime = carta.data;
  date.textContent = dateFormat.format(new Date(carta.data));
  button.append(title, date);
  item.append(button);
  letterList.append(item);
  button.addEventListener('click', () => {
    activeButton?.setAttribute('aria-expanded', 'false');
    activeLetter = carta;
    activeButton = button;
    letterTitle.textContent = carta.titulo;
    letterDate.dateTime = date.dateTime;
    letterDate.textContent = date.textContent;
    letterBody.replaceChildren(...carta.paragrafos.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
    signature.textContent = carta.assinatura ?? '';
    footerLetter.textContent = carta.rodape ?? '';
    deleteButton.hidden = !savedLetters.includes(carta);
    updateHeart();
    showLetter(true);
  });
  return button;
}

const editor = document.querySelector('#letter-editor');
const newLetter = document.querySelector('#new-letter');
const editorStatus = document.querySelector('#editor-status');
const storageKey = 'forviviane.cartas';
let savedLetters = [];
let storageAvailable = true;
try {
  savedLetters = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (!Array.isArray(savedLetters)) throw new Error('Formato de cartas inválido');
} catch {
  savedLetters = [];
  storageAvailable = false;
  editorStatus.textContent = 'O armazenamento das cartas está indisponível neste navegador.';
}
for (const carta of [...cartas, ...savedLetters]) addLetterCard(carta);

function showEditor(open) {
  editor.hidden = !open;
  newLetter.setAttribute('aria-expanded', String(open));
  (open ? editor.elements.titulo : newLetter).focus();
}

newLetter.addEventListener('click', () => showEditor(editor.hidden));
document.querySelector('#cancel-letter').addEventListener('click', () => showEditor(false));
editor.addEventListener('submit', event => {
  event.preventDefault();
  const titulo = editor.elements.titulo.value.trim();
  const corpo = editor.elements.corpo.value.trim();
  const data = editor.elements.data.value;
  if (!titulo || !corpo) {
    editorStatus.textContent = 'Preencha o título e o corpo da carta.';
    (titulo ? editor.elements.corpo : editor.elements.titulo).focus();
    return;
  }

  const carta = { titulo, data, paragrafos: corpo.split(/\n\s*\n/) };
  try {
    if (!storageAvailable) throw new Error('Armazenamento indisponível');
    const current = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    localStorage.setItem(storageKey, JSON.stringify([...current, carta]));
  } catch {
    editorStatus.textContent = 'Não foi possível salvar a carta neste navegador. O texto continua no formulário.';
    return;
  }

  savedLetters.push(carta);
  editor.reset();
  showEditor(false);
  editorStatus.textContent = 'Carta salva neste navegador.';
  addLetterCard(carta).focus();
});

deleteButton.addEventListener('click', () => {
  const index = savedLetters.indexOf(activeLetter);
  if (index === -1 || !window.confirm('Excluir esta carta deste navegador?')) return;
  try {
    const current = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    const match = JSON.stringify(activeLetter);
    const occurrence = savedLetters.slice(0, index).filter(carta => JSON.stringify(carta) === match).length;
    const matches = current.map((carta, position) => JSON.stringify(carta) === match ? position : -1).filter(position => position !== -1);
    const position = matches[occurrence];
    if (position !== undefined) {
      current.splice(position, 1);
      localStorage.setItem(storageKey, JSON.stringify(current));
    }
  } catch {
    closeButton.click();
    editorStatus.textContent = 'Não foi possível excluir a carta.';
    return;
  }
  savedLetters.splice(index, 1);
  likedLetters.delete(activeLetter);
  showLetter(false);
  activeButton.closest('li').remove();
  newLetter.focus();
  editorStatus.textContent = 'Carta excluída deste navegador.';
});

function showLetter(open) {
  intro.classList.toggle('is-open', open);
  letter.hidden = !open;
  footerLetter.hidden = !open || !activeLetter.rodape;
  footerDefault.hidden = !footerLetter.hidden;
  activeButton.setAttribute('aria-expanded', String(open));
  const destination = open ? letterTitle : activeButton;
  destination.focus({ preventScroll: true });
  (open ? letter : activeButton).scrollIntoView({
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
    block: open ? 'start' : 'center',
    inline: 'nearest'
  });
}

closeButton.addEventListener('click', () => showLetter(false));
function updateHeart() {
  const liked = likedLetters.has(activeLetter);
  heartButton.setAttribute('aria-pressed', String(liked));
  heartButton.textContent = liked ? '♥' : '♡';
  heartStatus.textContent = liked ? 'Um coração ficou aqui.' : '';
}

heartButton.addEventListener('click', () => {
  if (likedLetters.has(activeLetter)) {
    likedLetters.delete(activeLetter);
  } else {
    likedLetters.add(activeLetter);
  }
  updateHeart();
});

const soundtrack = document.querySelector('#soundtrack');
const musicButton = document.querySelector('.music');
const musicLabel = document.querySelector('#music-label');

soundtrack.addEventListener('playing', () => {
  musicLabel.textContent = 'Pausar música';
});
soundtrack.addEventListener('pause', () => {
  musicLabel.textContent = 'Tocar música';
});
soundtrack.addEventListener('error', () => {
  musicLabel.textContent = 'Áudio indisponível';
});

musicButton.addEventListener('click', async () => {
  if (!soundtrack.paused) {
    soundtrack.pause();
    return;
  }

  try {
    await soundtrack.play();
  } catch (error) {
    if (error.name !== 'AbortError') {
      musicLabel.textContent = 'Áudio indisponível';
    }
  }
});
