/* Letrero de Neón Pastel
 * Cartel de neón rosa/menta con parpadeo suave y frases que se alternan con brillo dreamy.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Neón pastel: letras que encienden una a una, colores rotativos y parpadeo suave. */
'use strict';
const neon = document.getElementById('neon');
const input = document.getElementById('custom');
const CLASSES = ['c1', 'c2', 'c3'];
let colorIdx = 0;

function display(text) {
  neon.className = 'neon ' + CLASSES[colorIdx % CLASSES.length];
  neon.innerHTML = '';
  [...text.toUpperCase()].forEach(function (ch, i) {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.transitionDelay = (i * 45) + 'ms';
    neon.appendChild(s);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { s.classList.add('on'); });
    });
  });
  hum();
}
/* Zumbido eléctrico sutil al encender */
function hum() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = 120;
    g.gain.setValueAtTime(.012, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .5);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .55);
  } catch (e) { /* opcional */ }
}
document.getElementById('glow').addEventListener('click', function () {
  colorIdx++;
  display(input.value.trim() || 'ERES LUZ');
});
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    colorIdx++;
    display(input.value.trim() || 'ERES LUZ');
  }
});
/* Frases rotativas si no hay personalización */
const ROTATION = ['ERES LUZ', 'SUEÑA BONITO', 'BRILLA HOY', 'ERES MAGIA', 'TODO ESTARÁ BIEN'];
let r = 0;
setInterval(function () {
  if (document.activeElement === input) return;
  r = (r + 1) % ROTATION.length;
  colorIdx++;
  display(ROTATION[r]);
}, 6000);
display(ROTATION[0]);
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

