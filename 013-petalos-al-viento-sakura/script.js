/* Pétalos al Viento (Sakura)
 * Lluvia perpetua de pétalos de cerezo que reaccionan al viento del cursor.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Sakura: pétalos con física de viento influida por el movimiento del puntero. */
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const wind = { x: 0, y: 0 };                          // vector de viento suavizado
let lastX = null, lastY = null, lastT = 0;
addEventListener('pointermove', function (e) {
  const now = performance.now();
  if (lastT && now - lastT > 0) {
    wind.x += ((e.clientX - lastX) / (now - lastT) * 40 - wind.x) * .2;
    wind.y += ((e.clientY - lastY) / (now - lastT) * 40 - wind.y) * .2;
  }
  lastX = e.clientX; lastY = e.clientY; lastT = now;
});

function makePetal(fromTop) {
  return {
    x: Math.random() * W,
    y: fromTop ? -20 : Math.random() * H,
    size: 7 + Math.random() * 9,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - .5) * .06,
    sway: Math.random() * Math.PI * 2,
    swayV: .01 + Math.random() * .02,
    baseFall: .5 + Math.random() * .9,
    hue: 345 + Math.random() * 20,
    light: 78 + Math.random() * 12
  };
}
const petals = Array.from({ length: 90 }, function () { return makePetal(false); });

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Rama de cerezo en la esquina */
  ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-10, 30);
  ctx.quadraticCurveTo(W * .18, 60, W * .3, 26);
  ctx.quadraticCurveTo(W * .36, 14, W * .42, 30); ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(W * .18, 55); ctx.quadraticCurveTo(W * .2, 90, W * .16, 112); ctx.stroke();
  /* Racimos de flores en la rama */
  for (const [fx, fy] of [[W * .17, 40], [W * .24, 34], [W * .3, 22], [W * .36, 26], [W * .17, 100], [W * .14, 118]]) {
    for (let f = 0; f < 5; f++) {
      ctx.beginPath();
      ctx.arc(fx + Math.cos(f / 5 * 6.28) * 7, fy + Math.sin(f / 5 * 6.28) * 7, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd7e0'; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(fx, fy, 4.5, 0, Math.PI * 2); ctx.fillStyle = '#fff0f4'; ctx.fill();
  }
  /* Viento decae hacia una brisa base */
  wind.x += (Math.sin(t * .0004) * 18 - wind.x) * .01;
  wind.y += (0 - wind.y) * .02;
  for (const p of petals) {
    p.sway += p.swayV;
    p.rot += p.rotV;
    p.x += wind.x * .016 + Math.cos(p.sway) * .8;
    p.y += p.baseFall + wind.y * .012 + Math.sin(p.sway * 2) * .3;
    if (p.y > H + 30 || p.x < -40 || p.x > W + 40) Object.assign(p, makePetal(true));
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot + Math.sin(p.sway) * .4);
    ctx.fillStyle = 'hsla(' + p.hue + ',90%,' + p.light + '%,.92)';
    ctx.beginPath();
    /* Forma de pétalo con dos curvas */
    ctx.moveTo(0, -p.size * .5);
    ctx.bezierCurveTo(p.size * .6, -p.size * .3, p.size * .5, p.size * .4, 0, p.size * .5);
    ctx.bezierCurveTo(-p.size * .5, p.size * .4, -p.size * .6, -p.size * .3, 0, -p.size * .5);
    ctx.fill();
    ctx.restore();
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

