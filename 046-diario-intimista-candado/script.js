/* Diario Íntimo con Candado
 * Ingresa la fecha especial como clave numérica para desbloquear el diario y leer sus páginas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Diario con candado: PIN de 4 dígitos (1402) desbloquea las páginas. */
'use strict';
const CODE = '1402';
const pad = document.getElementById('pad');
const dots = document.getElementById('dots');
const status = document.getElementById('status');
const diary = document.getElementById('diary');
const pages = document.getElementById('pages');
let input = '';

/* Teclado numérico */
[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].forEach(function (k) {
  const b = document.createElement('button');
  b.textContent = k;
  b.addEventListener('click', function () { press(k); });
  pad.appendChild(b);
});

function press(k) {
  clickSound();
  if (k === 'C') { input = ''; render(); return; }
  if (k === '✓') { check(); return; }
  if (input.length >= 4) return;
  input += String(k);
  render();
  if (input.length === 4) setTimeout(check, 220);
}
function render(err) {
  [...dots.children].forEach(function (d, i) {
    d.className = (err ? 'err' : '') + (i < input.length ? ' fill' : '');
  });
}
function check() {
  if (input === CODE) {
    status.textContent = '¡Clave correcta! Abriendo…';
    unlockSound();
    diary.classList.add('unlocked');
    setTimeout(function () { pages.classList.add('show'); }, 650);
  } else {
    status.textContent = 'Esa no es… piensa en nuestro día especial 💭';
    status.classList.add('err');
    render(true);
    buzzSound();
    setTimeout(function () {
      input = '';
      status.classList.remove('err');
      status.textContent = 'Ingresa los 4 dígitos del día (0–9)';
      render();
    }, 900);
  }
}
document.getElementById('closeDiary').addEventListener('click', function () {
  pages.classList.remove('show');
  diary.classList.remove('unlocked');
  input = '';
  status.textContent = 'Ingresa los 4 dígitos del día (0–9)';
  render();
});
/* Teclado físico también funciona */
document.addEventListener('keydown', function (e) {
  if (pages.classList.contains('show')) return;
  if (/^[0-9]$/.test(e.key)) press(Number(e.key));
  if (e.key === 'Enter') press('✓');
  if (e.key === 'Backspace') press('C');
});

function clickSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 320;
    g.gain.setValueAtTime(.04, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .07);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .07);
  } catch (e) { /* opcional */ }
}
function unlockSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 784].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .16); });
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .6);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .6);
  } catch (e) { /* opcional */ }
}
function buzzSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = 110;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .35);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .35);
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

