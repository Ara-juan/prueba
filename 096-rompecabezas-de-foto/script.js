/* Rompecabezas de Foto
 * Un recuerdo cortado en piezas: arrastra y suelta cada ficha hasta reconstruir el momento.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Rompecabezas drag & drop: 3×3 con drag nativo + fallback táctil. */
'use strict';
const board = document.getElementById('board');
const tray = document.getElementById('tray');
const winEl = document.getElementById('win');
const N = 3;
const EMOJI = ['🌅', '☀️', '🟠', '🌤️', '🏔️', '🟡', '🟣', '🧡', '✨'];
let placed = 0;

/* Slots del tablero con su posición correcta */
for (let i = 0; i < N * N; i++) {
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.dataset.pos = i;
  board.appendChild(slot);
}
/* Piezas mezcladas en la bandeja */
const order = [...Array(N * N).keys()].sort(function () { return Math.random() - .5; });
order.forEach(function (pos) {
  const p = document.createElement('div');
  p.className = 'piece';
  if (window.DEDIC && DEDIC.photo(0)) {
    /* Foto real del usuario: la pieza muestra su porción (técnica CSS de recortes) */
    var col = pos % N, row = Math.floor(pos / N);
    p.style.backgroundImage = 'url(' + DEDIC.photo(0) + ')';
    p.style.backgroundSize = 'cover';
    p.style.backgroundPosition = (col * 50) + '% ' + (row * 50) + '%';
  } else {
    p.textContent = EMOJI[pos];
  }
  p.dataset.pos = pos;
  p.draggable = true;
  /* Drag nativo (desktop) */
  p.addEventListener('dragstart', function (e) {
    e.dataTransfer.setData('text/plain', pos);
    p.style.opacity = '.4';
  });
  p.addEventListener('dragend', function () { p.style.opacity = ''; });
  /* Drag táctil: pointer + click para colocar */
  p.addEventListener('click', function () {
    /* Colocar en el primer slot libre correcto si coincide; si no, en el primero vacío */
    const target = [...board.querySelectorAll('.slot:not(.filled)')].find(function (s) { return Number(s.dataset.pos) === Number(p.dataset.pos); })
      || [...board.querySelectorAll('.slot:not(.filled)')][0];
    if (target) place(p, target);
  });
  tray.appendChild(p);
});

/* Eventos de los slots */
board.querySelectorAll('.slot').forEach(function (slot) {
  slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('over'); });
  slot.addEventListener('dragleave', function () { slot.classList.remove('over'); });
  slot.addEventListener('drop', function (e) {
    e.preventDefault();
    slot.classList.remove('over');
    const pos = Number(e.dataTransfer.getData('text/plain'));
    const piece = tray.querySelector('[data-pos="' + pos + '"]');
    if (piece) tryPlace(piece, slot);
  });
});
function tryPlace(piece, slot) {
  if (Number(piece.dataset.pos) === Number(slot.dataset.pos)) {
    place(piece, slot);
  } else {
    /* Pieza incorrecta: sacudida */
    piece.style.transition = 'transform .08s';
    let n = 0;
    const iv = setInterval(function () {
      piece.style.transform = 'translateX(' + (n % 2 ? 5 : -5) + 'px)';
      if (++n > 5) { clearInterval(iv); piece.style.transform = ''; }
    }, 55);
    buzz();
  }
}
function place(piece, slot) {
  if (slot.classList.contains('filled')) return;
  slot.classList.add('filled');
  slot.appendChild(piece);
  piece.classList.add('placed');
  piece.draggable = false;
  piece.style.cursor = 'default';
  piece.onclick = null;
  ding(520 + Number(piece.dataset.pos) * 40);
  placed++;
  if (placed === N * N) setTimeout(win, 400);
}
function win() {
  winEl.classList.add('show');
  fanfare();
}
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
function buzz() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = 130;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .14);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .14);
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

