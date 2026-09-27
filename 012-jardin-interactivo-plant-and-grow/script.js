/* Jardín Interactivo (Plant & Grow)
 * La pantalla está vacía: cada clic hace brotar una flor distinta con su propio mensaje.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Jardín plant-and-grow: cada clic planta una flor procedural con mensaje flotante. */
const canvas = document.getElementById('garden');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const MESSAGES = [
  'Eres mi lugar favorito.', 'Contigo todo florece.', 'Gracias por existir.',
  'Tu risa es mi primavera.', 'Nada como tu compañía.', 'Brillas hasta en invierno.',
  'Eres pura luz.', 'Mi flor favorita eres tú.', 'Contigo, siempre.', 'Te quiero hoy y mañana.'
];
const flowers = [];
const bee = { x: W / 2, y: H * .4, tx: 0, ty: 0, t: 0 };

function plant(x, y) {
  const hue = Math.floor(Math.random() * 360);
  flowers.push({
    x: x, y: y, hue: hue,
    petals: 5 + Math.floor(Math.random() * 6),
    size: 18 + Math.random() * 22,
    grow: 0, born: performance.now(), wobble: Math.random() * 7
  });
  const msg = MESSAGES[flowers.length % MESSAGES.length];
  const bubble = document.createElement('div');
  bubble.className = 'seed-bubble';
  bubble.textContent = msg;
  bubble.style.left = x + 'px'; bubble.style.top = (y - 10) + 'px';
  document.body.appendChild(bubble);
  setTimeout(function () { bubble.remove(); }, 2900);
  document.body.classList.add('planted');
}
canvas.addEventListener('pointerdown', function (e) { plant(e.clientX, e.clientY); });

function drawFlower(f, t) {
  f.grow = Math.min(1, (performance.now() - f.born) / 1400);
  const g = f.grow, sway = Math.sin(t * .0014 + f.wobble) * 5;
  ctx.strokeStyle = '#3d6b3a'; ctx.lineWidth = 2.6 * g;
  ctx.beginPath(); ctx.moveTo(f.x, f.y);
  ctx.quadraticCurveTo(f.x + sway, f.y - 30 * g, f.x + sway, f.y - 64 * g);
  ctx.stroke();
  const cx = f.x + sway, cy = f.y - 64 * g;
  if (g < .4) return;
  for (let p = 0; p < f.petals; p++) {
    const a = p / f.petals * Math.PI * 2 + t * .0004;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
    ctx.fillStyle = 'hsla(' + f.hue + ',75%,68%,.92)';
    ctx.beginPath(); ctx.ellipse(f.size * g * .6, 0, f.size * g * .55, f.size * g * .3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(cx, cy, f.size * g * .3, 0, Math.PI * 2);
  ctx.fillStyle = 'hsl(' + ((f.hue + 40) % 360) + ',70%,45%)'; ctx.fill();
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Cielo suave */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#dff3ff'); sky.addColorStop(1, '#eaf7e6');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  /* Suelo */
  ctx.fillStyle = '#b7dba4';
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 24) ctx.lineTo(x, H * .82 + Math.sin(x * .012) * 8);
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  flowers.sort(function (a, b) { return a.y - b.y; });
  for (const f of flowers) drawFlower(f, t);
  /* Abejorro curioso que recorre el jardín */
  bee.t += .008;
  bee.x = W * (.5 + Math.cos(bee.t) * .4);
  bee.y = H * (.4 + Math.sin(bee.t * 2.3) * .18);
  ctx.fillStyle = '#e2b23c';
  ctx.beginPath(); ctx.ellipse(bee.x, bee.y, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath(); ctx.ellipse(bee.x - 1, bee.y, 2.6, 4.4, 0, 0, Math.PI * 2); ctx.fill();
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

