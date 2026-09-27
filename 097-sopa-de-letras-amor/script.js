/* Sopa de Letras del Amor
 * Encuentra las palabras clave (tu risa, fechas, lugares) arrastrando sobre la cuadrícula.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Sopa de letras: palabras ocultas en 4 direcciones; selección por arrastre. */
'use strict';
const SIZE = 10;
const WORDS = ['SONRISA', 'ABRAZO', 'SIEMPRE', 'CAFES', 'VIAJES'];
const grid = document.getElementById('grid');
const wordList = document.getElementById('wordList');
const bar = document.getElementById('bar');
const congrats = document.getElementById('congrats');
let cells = [], found = 0;

/* Genera la sopa */
function generate() {
  /* Matriz vacía */
  const M = Array.from({ length: SIZE }, function () { return Array(SIZE).fill(''); });
  const DIRS = [[0, 1], [1, 0], [1, 1], [-1, 1]];     // →, ↓, ↘, ↗
  const placedCells = [];
  WORDS.forEach(function (word) {
    let ok = false, tries = 0;
    while (!ok && tries < 300) {
      tries++;
      const d = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r0 = Math.floor(Math.random() * SIZE);
      const c0 = Math.floor(Math.random() * SIZE);
      const rEnd = r0 + d[0] * (word.length - 1), cEnd = c0 + d[1] * (word.length - 1);
      if (rEnd < 0 || rEnd >= SIZE || cEnd < 0 || cEnd >= SIZE) continue;
      /* ¿Cabe? */
      let fits = true;
      const spots = [];
      for (let i = 0; i < word.length; i++) {
        const ch = M[r0 + d[0] * i][c0 + d[1] * i];
        if (ch && ch !== word[i]) { fits = false; break; }
        spots.push([r0 + d[0] * i, c0 + d[1] * i, word[i]]);
      }
      if (!fits) continue;
      spots.forEach(function (s) { M[s[0]][s[1]] = s[2]; placedCells.push({ r: s[0], c: s[1], word: word }); });
      ok = true;
    }
  });
  /* Relleno aleatorio */
  const ABC = 'AEIOURSTNLMCD';
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (!M[r][c]) M[r][c] = ABC[Math.floor(Math.random() * ABC.length)];
  }
  /* Render */
  grid.innerHTML = '';
  cells = [];
  for (let r = 0; r < SIZE; r++) {
    cells.push([]);
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.textContent = M[r][c];
      el.dataset.r = r; el.dataset.c = c;
      grid.appendChild(el);
      cells[r].push(el);
    }
  }
  return placedCells;
}
const placed = generate();

/* Lista de palabras */
WORDS.forEach(function (w) {
  const chip = document.createElement('span');
  chip.className = 'word-chip';
  chip.textContent = w;
  chip.dataset.word = w;
  wordList.appendChild(chip);
});

/* Selección por arrastre (pointer) */
let selecting = false, selected = new Set(), selStart = null;
grid.addEventListener('pointerdown', function (e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  selecting = true;
  selected.clear();
  selStart = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
  toggle(cell);
  grid.setPointerCapture(e.pointerId);
});
grid.addEventListener('pointermove', function (e) {
  if (!selecting) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const cell = el && el.closest ? el.closest('.cell') : null;
  if (cell) toggle(cell);
});
addEventListener('pointerup', checkSelection);
function toggle(cell) {
  const key = cell.dataset.r + ',' + cell.dataset.c;
  if (selected.has(key)) return;
  selected.add(key);
  cell.classList.add('sel');
}
function checkSelection() {
  if (!selecting) return;
  selecting = false;
  /* ¿Las celdas seleccionadas forman una palabra? */
  const word = [...selected].map(function (k) {
    const r = Number(k.split(',')[0]), c = Number(k.split(',')[1]);
    return cells[r][c].textContent;
  }).join('');
  const chip = wordList.querySelector('[data-word="' + word + '"]');
  const alreadyFound = chip && chip.classList.contains('found');
  if (chip && !alreadyFound) {
    chip.classList.add('found');
    [...selected].forEach(function (k) {
      const r = Number(k.split(',')[0]), c = Number(k.split(',')[1]);
      cells[r][c].classList.remove('sel');
      cells[r][c].classList.add('found');
    });
    found++;
    bar.style.width = (found / WORDS.length * 100) + '%';
    ding(600 + found * 60);
    if (found === WORDS.length) {
      congrats.classList.add('show');
      fanfare();
    }
  } else {
    [...selected].forEach(function (k) {
      const r = Number(k.split(',')[0]), c = Number(k.split(',')[1]);
      cells[r][c].classList.remove('sel');
    });
  }
  selected.clear();
}
/* Fallback táctil: tocar celdas una a una y levantar el dedo */
function ding(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .25);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .25);
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
  } catch (e) { /* opcional */ }
}
/* Rendimiento: los bucles de animación se pausan con la pestaña en segundo plano */
(function () {
  var raf = window.requestAnimationFrame.bind(window);
  var pendientes = [];
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && pendientes.length) {
      var q = pendientes.splice(0);
      q.forEach(function (cb) { raf(cb); });
    }
  });
  window.requestAnimationFrame = function (cb) {
    if (document.hidden) { pendientes.push(cb); return 0; }
    return raf(cb);
  };
})();

