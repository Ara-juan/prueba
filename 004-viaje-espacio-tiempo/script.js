/* Viaje Espacio-Tiempo
 * Túnel hiperespacial: pulsa ESPACIACIO o toca la pantalla para frenar y leer el mensaje central.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Túnel hiperespacial con estrellas en perspectiva; se frena al mantener ESPACIO o toque. */
const canvas = document.getElementById('tunnel');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const STARS = Array.from({ length: 420 }, function () {
  return { x: (Math.random() - .5) * 2000, y: (Math.random() - .5) * 2000, z: Math.random() * 2000, pz: 0 };
});
let speed = 26, targetSpeed = 26;
const KEY = { space: false, touch: false };

addEventListener('keydown', function (e) { if (e.code === 'Space') { e.preventDefault(); KEY.space = true; } });
addEventListener('keyup', function (e) { if (e.code === 'Space') KEY.space = false; });
canvas.addEventListener('pointerdown', function () { KEY.touch = true; });
addEventListener('pointerup', function () { KEY.touch = false; });

function frame() {
  const braking = KEY.space || KEY.touch;
  targetSpeed = braking ? .4 : 26;
  speed += (targetSpeed - speed) * .06;               // inercia de frenado/aceleración
  document.body.classList.toggle('slow', speed < 6);
  ctx.fillStyle = 'rgba(0,0,0,' + (speed > 10 ? .35 : .18) + ')';
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  for (const s of STARS) {
    s.pz = s.z;
    s.z -= speed;
    if (s.z < 1) { s.z = 2000; s.pz = 2000; s.x = (Math.random() - .5) * 2000; s.y = (Math.random() - .5) * 2000; }
    const k = 500 / s.z, pk = 500 / s.pz;
    const x = cx + s.x * k, y = cy + s.y * k;
    const px = cx + s.x * pk, py = cy + s.y * pk;
    const t = 1 - s.z / 2000;
    ctx.strokeStyle = braking ? 'rgba(190,215,255,' + (.5 * t) + ')' : 'rgba(160,200,255,' + (.7 * t) + ')';
    ctx.lineWidth = Math.max(t * 2.4, .4);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
  }
  /* Núcleo luminoso al frenar */
  if (braking) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * .35);
    g.addColorStop(0, 'rgba(120,170,255,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
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

