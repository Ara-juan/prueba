/* Tarjeta VIP Holográfica
 * Tarjeta metálica que cambia de color según la inclinación: efecto holográfico real con el mouse.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Tarjeta holográfica: tilt 3D + gradiente iridiscente según ángulo del puntero. */
'use strict';
const card = document.getElementById('card');
const holo = card.querySelector('.holo');
const glare = card.querySelector('.glare');

card.addEventListener('pointermove', function (e) {
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;          // 0 → 1
  const py = (e.clientY - r.top) / r.height;
  /* Rotación 3D según posición relativa */
  const rotY = (px - .5) * 26;
  const rotX = (0.5 - py) * 20;
  card.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
  /* El holograma se desplaza según el ángulo (efecto iridiscencia) */
  holo.style.setProperty('--hx', (50 + rotY * 4) + '%');
  holo.style.setProperty('--hy', (50 + rotX * 4) + '%');
  /* Reflejo especular */
  glare.style.setProperty('--gx', (px * 100) + '%');
  glare.style.setProperty('--gy', (py * 100) + '%');
});
card.addEventListener('pointerleave', function () {
  card.style.transform = 'rotateX(0) rotateY(0)';
});
/* Doble clic: personalizar titular */
card.addEventListener('dblclick', function () {
  const name = prompt('Titular de la tarjeta:', 'PERSONA FAVORITA');
  if (name && name.trim()) document.getElementById('holder').textContent = name.trim().toUpperCase();
  chime();
});
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1568, a.currentTime + .3);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .5);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .5);
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

