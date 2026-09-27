/* Caja de Regalo 3D
 * Regalo envuelto en CSS 3D: desliza la cinta con el ratón para desatarlo y abrirlo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Caja 3D: arrastrar la cinta desata el moño, vuela la tapa y aparece el regalo. */
'use strict';
const pull = document.getElementById('pull');
const ribbonEnd = pull.querySelector('.ribbon-end');
const lid = document.getElementById('lid');
const giftContent = document.getElementById('giftContent');
const hint = document.getElementById('hint');
let drag = false, startX = 0, progress = 0, opened = false;

pull.addEventListener('pointerdown', function (e) {
  if (opened) return;
  drag = true; startX = e.clientX;
  pull.setPointerCapture(e.pointerId);
});
pull.addEventListener('pointermove', function (e) {
  if (!drag || opened) return;
  progress = Math.min(90, Math.max(-90, e.clientX - startX));
  ribbonEnd.style.transform = 'translateX(calc(-50% + ' + progress + 'px)) rotate(' + progress * .15 + 'deg)';
  if (Math.abs(progress) > 70) openGift();
});
addEventListener('pointerup', function () {
  drag = false;
  if (!opened) ribbonEnd.style.transform = 'translateX(-50%)';
});
function openGift() {
  opened = true;
  hint.style.display = 'none';
  pull.style.opacity = '0';
  lid.classList.add('opened');
  giftContent.classList.add('show');
  unwrapSound();
  setTimeout(function () {
    fanfare();
    burstStars();
  }, 500);
}
/* Estrellitas que saltan de la caja */
function burstStars() {
  const stage = document.querySelector('.stage').getBoundingClientRect();
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('div');
    s.textContent = ['✨', '⭐', '🌟', '💛'][Math.floor(Math.random() * 4)];
    s.style.cssText = 'position:fixed;z-index:20;pointer-events:none;left:' + (stage.left + stage.width / 2) + 'px;top:' + (stage.top + stage.height / 2) + 'px;font-size:' + (12 + Math.random() * 12) + 'px;transition:transform 1.1s cubic-bezier(.2,.8,.3,1),opacity 1.1s';
    document.body.appendChild(s);
    const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 130;
    requestAnimationFrame(function () {
      s.style.transform = 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist - 40) + 'px) rotate(' + ((Math.random() - .5) * 300) + 'deg)';
      s.style.opacity = '0';
    });
    setTimeout(function () { s.remove(); }, 1200);
  }
}
function unwrapSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .35;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) * (Math.sin(i * .02) > 0 ? 1 : .3);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 800;
    const g = a.createGain(); g.gain.value = .2;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
function fanfare() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    [523, 659, 784, 1046].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .12); });
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 1);
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

