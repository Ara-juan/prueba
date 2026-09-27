/* Game Boy Color de Mensajes
 * Consola retro con botones funcionales: recorre los "niveles" de nuestros mejores momentos.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Game Boy: niveles de mensajes navegables con sonido chiptune. */
'use strict';
const LEVELS = [
  { art: '🌟', text: 'NIVEL 1: EL ENCUENTRO\n\nUn día normal. Una casualidad.\nEl inicio de mi saga favorita.' },
  { art: '🎮', text: 'NIVEL 2: LOS RETOS\n\nJefes finales: lunes y desvelos.\nArma secreta: tu sentido del humor.' },
  { art: '🗺️', text: 'NIVEL 3: LA AVENTURA\n\nMapa descubierto al 70%.\nLos mejores cofres aún sin abrir.' },
  { art: '💖', text: 'NIVEL 4: EL PODER OCULTO\n\nDesbloqueado: escucharte.\nEfecto: todo duele menos.' },
  { art: '🏆', text: 'NIVEL FINAL: TÚ\n\nPuntuación: imposible de medir.\n¿Nueva partida? La que quieras. ♥' }
];
const screen = document.getElementById('screen');
const artEl = document.getElementById('art');
const bodyEl = document.getElementById('body');
const lvlEl = document.getElementById('lvl');
let idx = 0;
let ac = null;

function render() {
  const L = LEVELS[idx];
  artEl.textContent = L.art;
  lvlEl.textContent = idx + 1;
  bodyEl.textContent = '';
  /* Typewriter de 8 bits */
  let i = 0;
  const timer = setInterval(function () {
    bodyEl.textContent += L.text[i];
    if (L.text[i] !== ' ' && L.text[i] !== '\n') blip(300 + Math.random() * 300);
    i++;
    if (i >= L.text.length) clearInterval(timer);
  }, 26);
}
function blip(freq) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(.03, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .07);
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + .07);
  } catch (e) { /* opcional */ }
}
function nav(d) {
  idx = (idx + d + LEVELS.length) % LEVELS.length;
  blip(520); blip(660);
  render();
}
document.querySelectorAll('[data-nav]').forEach(function (b) {
  b.addEventListener('click', function () { nav(Number(b.dataset.nav)); });
});
document.getElementById('btnA').addEventListener('click', function () { nav(1); });
document.getElementById('btnB').addEventListener('click', function () { nav(-1); });
document.getElementById('startBtn2').addEventListener('click', function () { nav(1); });
document.getElementById('selBtn').addEventListener('click', function () { nav(-1); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nav(1); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); nav(-1); }
  if (e.key.toLowerCase() === 'a') nav(1);
  if (e.key.toLowerCase() === 'b') nav(-1);
});
render();
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

