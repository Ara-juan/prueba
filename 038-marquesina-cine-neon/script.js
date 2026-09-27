/* Marquesina de Cine Neón
 * Letrero luminoso años 50 con luces intermitentes: escribe el nombre y brilla en el cartel.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Marquesina neón: focos en secuencia perimetral + personalización del nombre. */
'use strict';
const bulbsEl = document.getElementById('bulbs');
const stageName = document.getElementById('stageName');
const nameInput = document.getElementById('nameInput');

/* Coloca los focos alrededor del perímetro del letrero */
(function placeBulbs() {
  const w = bulbsEl.offsetWidth, h = bulbsEl.offsetHeight;
  const perSide = 9;
  let n = 0;
  function add(x, y) {
    const b = document.createElement('i');
    b.style.left = x + 'px'; b.style.top = y + 'px';
    b.style.animationDelay = (n * .07) + 's';
    bulbsEl.appendChild(b);
    n++;
  }
  for (let i = 0; i < perSide; i++) add((w / perSide) * i + 4, 0);
  for (let i = 0; i < perSide; i++) add((w / perSide) * i + 4, h - 9);
  for (let i = 1; i < 4; i++) add(0, (h / 4) * i);
  for (let i = 1; i < 4; i++) add(w - 9, (h / 4) * i);
})();
addEventListener('resize', function () {
  bulbsEl.innerHTML = '';
  placeBulbs();
});

/* Al confirmar el nombre: animación de letras encendiéndose una a una */
function lightUp() {
  const name = (nameInput.value.trim() || 'ESTRELLA PRINCIPAL').toUpperCase();
  stageName.innerHTML = '';
  [...name].forEach(function (ch, i) {
    const s = document.createElement('span');
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.cssText = 'display:inline-block;opacity:0;transform:translateY(14px) rotate(-8deg);transition:opacity .3s,transform .5s cubic-bezier(.2,1.5,.3,1);transition-delay:' + (i * .06) + 's';
    stageName.appendChild(s);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        s.style.opacity = '1'; s.style.transform = 'none';
      });
    });
  });
  marqueeChime();
}
document.getElementById('lightUp').addEventListener('click', lightUp);
nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') lightUp(); });

function marqueeChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [659, 784, 988].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .09); });
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .7);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .7);
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

