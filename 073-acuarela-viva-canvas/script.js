/* Acuarela Viva (Canvas)
 * Lienzo interactivo: tus trazos manchan de acuarela el fondo de la carta mientras se escribe el mensaje.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Acuarela: manchas orgánicas con canvas, paleta pastel y difuminado natural. */
'use strict';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() {
  /* Conserva la pintura al redimensionar */
  const old = document.createElement('canvas');
  old.width = canvas.width; old.height = canvas.height;
  if (canvas.width) old.getContext('2d').drawImage(canvas, 0, 0);
  var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#fbfaf6'; ctx.fillRect(0, 0, W, H);
  if (old.width) ctx.drawImage(old, 0, 0, W, H);
}
resize(); addEventListener('resize', resize);

const PALETTE = ['#f4a8b8', '#a8c8f4', '#a8e8c8', '#f4e0a8', '#c8a8f4', '#f4c8a8'];
let color = PALETTE[0];

/* Paleta interactiva */
const pal = document.getElementById('palette');
PALETTE.forEach(function (c, i) {
  const b = document.createElement('button');
  b.style.background = c;
  if (i === 0) b.classList.add('sel');
  b.addEventListener('click', function () {
    color = c;
    pal.querySelectorAll('button').forEach(function (x) { x.classList.remove('sel'); });
    b.classList.add('sel');
  });
  pal.appendChild(b);
});

/* Manchas de acuarela: elipses superpuestas con baja opacidad */
function splash(x, y, size, c) {
  for (let i = 0; i < 5; i++) {
    const r = size * (.5 + Math.random() * .7);
    const ox = (Math.random() - .5) * size * 1.4;
    const oy = (Math.random() - .5) * size * 1.4;
    ctx.beginPath();
    ctx.ellipse(x + ox, y + oy, r, r * (.6 + Math.random() * .4), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = c + '14';                            // ~8% de opacidad
    ctx.fill();
  }
  /* Núcleo más denso */
  ctx.beginPath();
  ctx.ellipse(x, y, size * .4, size * .3, Math.random() * Math.PI, 0, Math.PI * 2);
  ctx.fillStyle = c + '20';
  ctx.fill();
}

let painting = false, lastX = 0, lastY = 0;
canvas.addEventListener('pointerdown', function (e) {
  painting = true;
  lastX = e.clientX; lastY = e.clientY;
  splash(e.clientX, e.clientY, 46, color);
});
addEventListener('pointerup', function () { painting = false; });
canvas.addEventListener('pointermove', function (e) {
  if (!painting) return;
  /* Interpola entre puntos para trazos continuos */
  const d = Math.hypot(e.clientX - lastX, e.clientY - lastY);
  const steps = Math.max(1, Math.floor(d / 14));
  for (let i = 1; i <= steps; i++) {
    const x = lastX + (e.clientX - lastX) * i / steps;
    const y = lastY + (e.clientY - lastY) * i / steps;
    splash(x, y, 40 + Math.random() * 18, color);
  }
  lastX = e.clientX; lastY = e.clientY;
});
/* El título se tiñe suavemente al pintar (efecto living) */
setInterval(function () {
  const h1 = document.querySelector('.lettering h1');
  h1.style.color = '#4a4048';
}, 1000);
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

