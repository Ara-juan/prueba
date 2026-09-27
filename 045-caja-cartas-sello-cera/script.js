/* Caja de Cartas con Sello de Cera
 * Sobre vintage 3D: retira el sello interactivo y la solapa se abrirá revelando la carta.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Sobre 3D: el sello se retira (clic o arrastre) y la solapa se abre con la carta. */
'use strict';
const seal = document.getElementById('seal');
const envelope = document.getElementById('envelope');
const hint = document.getElementById('hint');
let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;
  hint.style.display = 'none';
  seal.classList.add('lifted');
  sealSound();
  spawnWaxBits();
  setTimeout(function () { envelope.classList.add('open'); }, 420);
}
seal.addEventListener('click', openEnvelope);
seal.addEventListener('keydown', function (e) { if (e.key === 'Enter') openEnvelope(); });
/* Arrastre del sello: al moverlo lejos, se considera retirado */
let drag = false, sx = 0, sy = 0;
seal.addEventListener('pointerdown', function (e) { drag = true; sx = e.clientX; sy = e.clientY; });
addEventListener('pointermove', function (e) {
  if (!drag || opened) return;
  if (Math.hypot(e.clientX - sx, e.clientY - sy) > 60) { drag = false; openEnvelope(); }
});
addEventListener('pointerup', function () { drag = false; });

function spawnWaxBits() {
  const r = seal.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const b = document.createElement('div');
    b.className = 'wax-bits';
    b.textContent = '●';
    b.style.color = i % 2 ? '#a12a2a' : '#c23c3c';
    b.style.left = (r.left + r.width / 2) + 'px';
    b.style.top = (r.top + r.height / 2) + 'px';
    document.body.appendChild(b);
    const dx = (Math.random() - .5) * 200, dy = 40 + Math.random() * 140;
    requestAnimationFrame(function () {
      b.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + (Math.random() * .6 + .5) + ')';
      b.style.opacity = '0';
    });
    setTimeout(function () { b.remove(); }, 1100);
  }
}

function sealSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .16;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1100;
    const g = a.createGain(); g.gain.value = .25;
    src.connect(f).connect(g).connect(a.destination); src.start();
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

