/* Burbujas de Jabón Pastel
 * Burbujas iridiscentes flotando: revienta cada una y libera pequeñas palabras bonitas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Burbujas iridiscentes en canvas que explotan liberando palabras. */
'use strict';
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

const WORDS = ['te quiero', 'brillas', 'gracias', 'sonríe', 'abrazo', 'luz', 'calma', 'magia', 'eres oro', 'me haces feliz', 'brillante', 'suerte mía'];
const HUES = [200, 320, 150, 45, 270, 10];
const bubbles = [];
function spawnBubble(fromBottom) {
  bubbles.push({
    x: Math.random() * W,
    y: fromBottom ? H + 40 : Math.random() * H,
    r: 14 + Math.random() * 30,
    vy: -.3 - Math.random() * .5,
    vx: (Math.random() - .5) * .4,
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    wobble: Math.random() * 7,
    pop: 0
  });
}
for (let i = 0; i < 22; i++) spawnBubble(false);

function popBubble(b, x, y) {
  b.pop = 1;
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const el = document.createElement('div');
  el.className = 'word';
  el.textContent = word;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.color = 'hsl(' + b.hue + ',55%,45%)';
  document.body.appendChild(el);
  requestAnimationFrame(function () {
    el.style.transform = 'translate(-50%,-50%) translateY(-70px) scale(1.15)';
    el.style.opacity = '0';
  });
  setTimeout(function () { el.remove(); }, 1500);
  popSound(b.r);
}
canvas.addEventListener('pointerdown', function (e) {
  for (const b of bubbles) {
    if (b.pop === 0 && Math.hypot(e.clientX - b.x, e.clientY - b.y) < b.r + 10) {
      popBubble(b, b.x, b.y);
      return;
    }
  }
  spawnBubble(true);                                  // clic al aire: nueva burbuja
});
function popSound(r) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(600 + 8000 / r, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(120, a.currentTime + .1);
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .16);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .16);
  } catch (e) { /* opcional */ }
}
function frame(t) {
  ctx.clearRect(0, 0, W, H);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (b.pop > 0) {
      /* Animación de estallido: anillo creciente */
      b.pop += .07;
      ctx.strokeStyle = 'hsla(' + b.hue + ',70%,70%,' + (1 - b.pop) + ')';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r * (1 + b.pop * 1.6), 0, Math.PI * 2); ctx.stroke();
      if (b.pop >= 1) bubbles.splice(i, 1);
      continue;
    }
    b.wobble += .02;
    b.x += b.vx + Math.sin(b.wobble) * .4;
    b.y += b.vy;
    if (b.y < -50 || b.x < -60 || b.x > W + 60) {
      bubbles.splice(i, 1);
      spawnBubble(true);
      continue;
    }
    /* Burbuja iridiscente: degradados múltiples */
    const g = ctx.createRadialGradient(b.x - b.r * .35, b.y - b.r * .35, b.r * .1, b.x, b.y, b.r);
    g.addColorStop(0, 'hsla(' + b.hue + ',80%,92%,.85)');
    g.addColorStop(.55, 'hsla(' + ((b.hue + 40) % 360) + ',75%,80%,.35)');
    g.addColorStop(.85, 'hsla(' + ((b.hue + 80) % 360) + ',70%,72%,.5)');
    g.addColorStop(1, 'hsla(' + b.hue + ',85%,88%,.9)');
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'hsla(' + b.hue + ',80%,90%,.9)';
    ctx.lineWidth = 1.4; ctx.stroke();
    /* Brillo especular */
    ctx.beginPath();
    ctx.ellipse(b.x - b.r * .3, b.y - b.r * .4, b.r * .18, b.r * .1, -.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
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

