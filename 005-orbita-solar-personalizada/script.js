/* Órbita Solar Personalizada
 * Un sistema planetario donde cada planeta guarda un mes, un recuerdo y una cualidad tuya.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Sistema planetario: 12 planetas (meses) con datos al pasar el cursor. */
const canvas = document.getElementById('system');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const MONTHS = [
  ['Enero', 'Empezaste el año cambiando mi vida.'], ['Febrero', 'Un mes corto, contigo se hizo eterno.'],
  ['Marzo', 'Aprendí que la primavera también se siente.'], ['Abril', 'Las lluvias suenan mejor contigo.'],
  ['Mayo', 'Florecimos sin darnos cuenta.'], ['Junio', 'Tu risa marcó el solsticio.'],
  ['Julio', 'Vacaciones que guardaré para siempre.'], ['Agosto', 'El calor se te había pegado.'],
  ['Septiembre', 'Regresamos a clases… y al mismo banco.'], ['Octubre', 'El otoño nos pintó de dorados.'],
  ['Noviembre', 'Dijiste algo que no olvidaré nunca.'], ['Diciembre', 'Cerramos el año de la mano.']
];
const QUALITIES = ['lealtad', 'valentía', 'dulzura', 'gracia', 'paciencia', 'ingenio', 'fuerza', 'calma', 'brillo', 'ternura', 'audacia', 'magia'];

const planets = MONTHS.map(function (m, i) {
  const a0 = Math.random() * Math.PI * 2;
  return { name: m[0], text: m[1], q: QUALITIES[i], orbit: 70 + i * 34, size: 6 + Math.random() * 7, angle: a0, speed: (.25 - i * .014) * (Math.random() < .5 ? 1 : -1), hue: (i * 30 + 20) % 360, hover: 0 };
});

const mouse = { x: -1e4, y: -1e4 };
addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });

function frame(t) {
  ctx.fillStyle = 'rgba(4,6,16,.32)'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  /* Fondo estelar fijo */
  if (!frame.dust) frame.dust = Array.from({ length: 90 }, function () { return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, p: Math.random() * 7 }; });
  for (const d of frame.dust) {
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + (.2 + .3 * Math.sin(t * .0015 + d.p)) + ')'; ctx.fill();
  }
  /* Órbitas */
  ctx.strokeStyle = 'rgba(127,216,255,.12)'; ctx.lineWidth = 1;
  for (const p of planets) { ctx.beginPath(); ctx.arc(cx, cy, p.orbit, 0, Math.PI * 2); ctx.stroke(); }
  /* Estrella central */
  const sunR = 34 + Math.sin(t * .001) * 2;
  const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, sunR * 2.2);
  g.addColorStop(0, 'rgba(255,220,130,.9)'); g.addColorStop(.4, 'rgba(255,170,60,.5)'); g.addColorStop(1, 'rgba(255,150,40,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, sunR * 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd66b'; ctx.beginPath(); ctx.arc(cx, cy, sunR, 0, Math.PI * 2); ctx.fill();
  /* Planetas */
  let hovered = null;
  for (const p of planets) {
    p.angle += p.speed * .01;
    const x = cx + Math.cos(p.angle) * p.orbit;
    const y = cy + Math.sin(p.angle) * p.orbit * .82;  // órbitas elípticas para profundidad
    p.sx = x; p.sy = y;
    p.hover = Math.max(0, p.hover - .05);
    if (Math.hypot(mouse.x - x, mouse.y - y) < p.size + 16) { p.hover = 1; hovered = p; }
    ctx.beginPath(); ctx.arc(x, y, p.size * (1 + p.hover * .5), 0, Math.PI * 2);
    ctx.fillStyle = 'hsl(' + p.hue + ',70%,62%)';
    ctx.shadowColor = 'hsl(' + p.hue + ',80%,70%)'; ctx.shadowBlur = p.hover ? 22 : 8;
    ctx.fill(); ctx.shadowBlur = 0;
    if (p.hover > .5) {                                // anillo al pasar el cursor
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, p.size + 6, 0, Math.PI * 2); ctx.stroke();
    }
  }
  if (hovered) {
    info.querySelector('h2').textContent = hovered.name + ' · ' + hovered.q;
    info.querySelector('p').textContent = hovered.text;
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

