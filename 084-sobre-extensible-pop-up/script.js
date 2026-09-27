/* Sobre Pop-Up 3D
 * Al abrir el sobre, se despliega una estructura 3D en CSS (¡un pastel de felicitación!).
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Sobre pop-up: clic abre la solapa, revela pastel 3D en CSS y llueve confeti. */
'use strict';
const envelope = document.getElementById('envelope');
const popup = document.getElementById('popup');
const hint = document.getElementById('hint');
let opened = false;

envelope.addEventListener('click', function () {
  if (opened) return;
  opened = true;
  hint.style.display = 'none';
  sealSound();
  envelope.classList.add('open');
  setTimeout(function () {
    envelope.classList.add('gone');
    popup.classList.add('show');
    fanfare();
    rainConfetti();
  }, 700);
});
envelope.addEventListener('keydown', function (e) { if (e.key === 'Enter') envelope.click(); });

/* Confeti de colores cayendo */
const COLORS = ['#ff8fab', '#ffd23c', '#7ad7ff', '#a8f0d4', '#cabcf5', '#ff9a6a'];
function rainConfetti() {
  const total = 90;
  for (let i = 0; i < total; i++) {
    setTimeout(function () {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.textContent = ['✦', '●', '■', '♥', '✿'][Math.floor(Math.random() * 5)];
      c.style.left = Math.random() * 100 + 'vw';
      c.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      c.style.animationDuration = (2.2 + Math.random() * 2.4) + 's';
      c.style.fontSize = (9 + Math.random() * 10) + 'px';
      document.body.appendChild(c);
      setTimeout(function () { c.remove(); }, 5200);
    }, i * 45);
  }
}
function sealSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .18;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200;
    const g = a.createGain(); g.gain.value = .22;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .13); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1.4);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1.4);
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

