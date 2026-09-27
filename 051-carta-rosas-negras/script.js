/* Carta de Rosas Negras
 * Modo oscuro con encajes, rosas carmesí/negras y caligrafía victoriana que florece letra a letra.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Carta gótica: revelado letra a letra y rosas que despiertan con el cursor. */
'use strict';
const TEXT = 'En la penumbra de la noche, cuando el mundo se queda sin nombres, el tuyo es el único que susurra mi silencio. Eres la rosa que floreció en mi jardín de invierno: imposible, terca y absolutamente hermosa. Y aunque las rosas se marchitan, lo que siento por ti eligió ser eterno.';
const letterEl = document.getElementById('letter');
const sig = document.getElementById('sig');
const roseRow = document.getElementById('roseRow');

/* Revelado palabra a palabra */
const words = TEXT.split(' ');
words.forEach(function (w, i) {
  const s = document.createElement('span');
  s.textContent = w + ' ';
  s.style.transitionDelay = (i * 55) + 'ms';
  letterEl.appendChild(s);
});
requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    letterEl.querySelectorAll('span').forEach(function (s) { s.classList.add('on'); });
  });
});
setTimeout(function () { sig.classList.add('on'); }, words.length * 55 + 400);

/* Rosas interactivas */
'🌹🌹🌹🌹🌹'.split('').forEach(function (r) {
  const s = document.createElement('span');
  s.className = 'rose';
  s.textContent = r;
  s.addEventListener('mouseenter', function () {
    s.classList.add('alive');
    petalSound();
  });
  roseRow.appendChild(s);
});

function petalSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 392 + Math.random() * 200;
    g.gain.setValueAtTime(.04, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .4);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .4);
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

