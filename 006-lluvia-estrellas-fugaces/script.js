/* Lluvia de Estrellas Fugaces
 * Haz clic en el cielo nocturno: cada estrella fugaz deja un rastro y un deseo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Estrellas fugaces: clic → cae un meteoro con estela y deseo flotante. */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const WISHES = [
  'Te deseo más noches como esta.', 'Que nunca falten razones para sonreír.', 'Que tus sueños encuentren el camino.',
  'Más aventuras contigo, siempre.', 'Que la vida te devuelva todo lo que das.', 'Un deseo: seguir aquí, contigo.',
  'Que nada apague tu brillo.', 'Te lo mereces todo y más.'
];
const shooting = [];
const dust = Array.from({ length: 140 }, function () { return { x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + .3, p: Math.random() * 7 }; });

function chime(freq) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 2.2, a.currentTime + .5);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .7);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .7);
  } catch (e) { /* opcional */ }
}

canvas.addEventListener('pointerdown', function (e) {
  const x = e.clientX, y = e.clientY;
  shooting.push({ x: x, y: y, vx: (Math.random() * 4 + 5) * (Math.random() < .5 ? -1 : 1), vy: Math.random() * 3 + 5, life: 1, trail: [] });
  chime(300 + Math.random() * 200);
  /* Burbuja con el deseo */
  const el = document.createElement('div');
  el.className = 'wish';
  el.textContent = WISHES[Math.floor(Math.random() * WISHES.length)];
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.body.appendChild(el);
  requestAnimationFrame(function () { el.classList.add('show'); });
  setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 600); }, 2600);
});

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  for (const d of dust) {
    ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,' + (.25 + .4 * Math.sin(t * .002 + d.p)) + ')'; ctx.fill();
  }
  for (let i = shooting.length - 1; i >= 0; i--) {
    const s = shooting[i];
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > 26) s.trail.shift();
    s.x += s.vx; s.y += s.vy; s.life -= .008;
    /* Estela brillante */
    for (let j = 1; j < s.trail.length; j++) {
      const a = j / s.trail.length;
      ctx.strokeStyle = 'rgba(210,180,255,' + (a * .8) + ')';
      ctx.lineWidth = a * 3;
      ctx.beginPath(); ctx.moveTo(s.trail[j - 1].x, s.trail[j - 1].y); ctx.lineTo(s.trail[j].x, s.trail[j].y); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(s.x, s.y, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#c9a7ff'; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0;
    if (s.life <= 0) shooting.splice(i, 1);
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

