/* Juego de Memoria
 * Cartas boca abajo: encuentra las parejas de momentos y desbloquea el mensaje final.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Memoria clásica: 6 parejas, volteo 3D, bloqueo de errores y victoria. */
'use strict';
const EMOJIS = ['🌅', '🎡', '☕', '🌊', '🎂', '🎵'];
const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const winEl = document.getElementById('win');
let first = null, second = null, lock = false;
let moves = 0, pairs = 0;

/* Duplica y mezcla */
const deck = [...EMOJIS, ...EMOJIS].sort(function () { return Math.random() - .5; });
deck.forEach(function (emoji) {
  const card = document.createElement('div');
  card.className = 'cardm';
  card.innerHTML = '<div class="face back">✦</div><div class="face front">' + emoji + '</div>';
  card.dataset.emoji = emoji;
  card.addEventListener('click', function () { flip(card); });
  grid.appendChild(card);
});
function flip(card) {
  if (lock || card === first || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  blip(520);
  if (!first) { first = card; return; }
  second = card;
  moves++;
  movesEl.textContent = moves;
  lock = true;
  if (first.dataset.emoji === second.dataset.emoji) {
    /* ¡Pareja! */
    setTimeout(function () {
      first.classList.add('matched');
      second.classList.add('matched');
      first = second = null;
      lock = false;
      pairs++;
      pairsEl.textContent = pairs;
      ding(700 + pairs * 60);
      if (pairs === EMOJIS.length) setTimeout(win, 500);
    }, 450);
  } else {
    /* Falla: voltea de nuevo */
    setTimeout(function () {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      first = second = null;
      lock = false;
      buzz();
    }, 850);
  }
}
function win() {
  winEl.classList.add('show');
  fanfare();
}
function blip(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .18);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .18);
  } catch (e) { /* opcional */ }
}
function ding(f) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(f * 1.5, a.currentTime + .18);
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .35);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .35);
  } catch (e) { /* opcional */ }
}
function buzz() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = 130;
    g.gain.setValueAtTime(.045, a.currentTime);
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

