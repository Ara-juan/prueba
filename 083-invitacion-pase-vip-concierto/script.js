/* Pase VIP de Concierto
 * Credencial de festival colgada de un cordón que se balancea con la física del puntero.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Pase VIP: péndulo físico con el puntero + personalización del nombre. */
'use strict';
const pendulum = document.getElementById('pendulum');
const badge = document.getElementById('badge');
/* Física de péndulo amortiguado */
let angle = 0, vel = 0, target = 0;
addEventListener('pointermove', function (e) {
  /* El puntero "tira" del cordón según su posición horizontal */
  target = ((e.clientX / innerWidth) - .5) * 24;
});
addEventListener('pointerdown', function (e) {
  /* Empujón al hacer clic cerca de la credencial */
  const r = badge.getBoundingClientRect();
  if (e.clientX > r.left - 40 && e.clientX < r.right + 40 && e.clientY > r.top - 60) {
    vel += (Math.random() < .5 ? -1 : 1) * 6;
    swish();
  }
});
(function swing() {
  /* Resort: la gravedad tira hacia target, con amortiguación */
  const k = .015, damp = .965;
  vel += (target - angle) * k;
  vel *= damp;
  angle += vel;
  pendulum.style.transform = 'rotate(' + angle + 'deg)';
  requestAnimationFrame(swing);
})();

/* Personalizar nombre con doble clic */
badge.addEventListener('dblclick', function () {
  const name = prompt('¿Nombre para el pase VIP?', 'PERSONA FAVORITA');
  if (name && name.trim()) document.getElementById('holderName').textContent = name.trim().toUpperCase();
});
function swish() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .2;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 500;
    const g = a.createGain(); g.gain.value = .08;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
/* Empujón inicial */
setTimeout(function () { vel = 4; }, 600);
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

