/* Pergamino Antiguo
 * Sello de cera que se rompe con un clic y pergamino que se desenrolla revelando el mensaje.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Pergamino: el sello se rompe y el rollo se desenrolla con sonido de cera. */
'use strict';
const seal = document.getElementById('seal');
const scrollEl = document.getElementById('scroll');
const hint = document.getElementById('hint');
let broken = false;

function crack() {
  if (broken) return;
  broken = true;
  hint.style.display = 'none';
  seal.classList.add('broken');
  crackSound();
  /* Fragmentos de cera que saltan */
  for (let i = 0; i < 8; i++) spawnShard();
  setTimeout(function () { scrollEl.classList.add('open'); }, 350);
}
seal.addEventListener('click', crack);
seal.addEventListener('keydown', function (e) { if (e.key === 'Enter') crack(); });

function spawnShard() {
  const s = document.createElement('div');
  s.textContent = ['🟥', '🔻', '🔺'][Math.floor(Math.random() * 3)];
  s.style.cssText = 'position:fixed;font-size:' + (10 + Math.random() * 12) + 'px;z-index:6;pointer-events:none;left:' + seal.getBoundingClientRect().left + 'px;top:' + seal.getBoundingClientRect().top + 'px;transition:transform .9s ease-out,opacity .9s';
  document.body.appendChild(s);
  requestAnimationFrame(function () {
    s.style.transform = 'translate(' + ((Math.random() - .5) * 160) + 'px,' + (60 + Math.random() * 120) + 'px) rotate(' + ((Math.random() - .5) * 360) + 'deg)';
    s.style.opacity = '0';
  });
  setTimeout(function () { s.remove(); }, 1000);
}

function crackSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .22;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = .8;
    const g = a.createGain(); g.gain.value = .3;
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

