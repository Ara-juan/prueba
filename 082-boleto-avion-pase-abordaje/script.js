/* Pase de Abordaje
 * Boleto de vuelo estilizado con "QR" interactivo, solapa desprendible y destino: el evento.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Pase de abordaje: QR decorativo, talón arrastrable que revela info de embarque. */
'use strict';
const stub = document.getElementById('stub');
const qr = document.getElementById('qr');
const hint = document.getElementById('hint');
const gateInfo = document.getElementById('gateInfo');

/* Genera un "código QR" decorativo con esquinas de anclaje */
(function buildQR() {
  const N = 11;
  const cells = [];
  function anchor(ox, oy) {
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) cells.push([ox + x, oy + y]);
    /* Marco blanco interior simulado */
    cells.push([ox + 3, oy]); cells.push([ox + 3, oy + 2]);
  }
  anchor(0, 0); anchor(N - 3, 0); anchor(0, N - 3);
  for (let i = 0; i < 42; i++) {
    const x = Math.floor(Math.random() * N), y = Math.floor(Math.random() * N);
    if (!cells.some(function (c) { return c[0] === x && c[1] === y; })) cells.push([x, y]);
  }
  const on = new Set(cells.map(function (c) { return c[0] + ',' + c[1]; }));
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = document.createElement('i');
    if (on.has(x + ',' + y)) i.className = 'on';
    qr.appendChild(i);
  }
})();

/* Arrastrar el talón hacia la derecha para "arrancarlo" */
let drag = false, startX = 0;
stub.addEventListener('pointerdown', function (e) {
  drag = true; startX = e.clientX;
  stub.setPointerCapture(e.pointerId);
});
stub.addEventListener('pointermove', function (e) {
  if (!drag) return;
  const dx = e.clientX - startX;
  stub.style.transform = 'translateX(' + Math.max(0, dx) + 'px) rotate(' + Math.min(8, dx / 14) + 'deg)';
  if (dx > 70) { takeStub(); drag = false; }
});
addEventListener('pointerup', function () {
  if (drag && !stub.classList.contains('taken')) {
    drag = false;
    stub.style.transform = '';
  }
});
function takeStub() {
  stub.classList.add('taken');
  hint.style.display = 'none';
  gateInfo.classList.add('show');
  tearSound();
  setTimeout(fanfare, 350);
}
function tearSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .3;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (Math.sin(i * .015) > 0 ? 1 : .2) * (1 - i / len);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1000;
    const g = a.createGain(); g.gain.value = .22;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [392, 523, 659, 880].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .9);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .9);
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

