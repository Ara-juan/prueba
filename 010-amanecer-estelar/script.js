/* Amanecer Estelar
 * Desliza el tiempo: la noche estrellada se convierte en un amanecer con tipografía animada.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Amanecer: el slider interpola cielo, sol, estrellas y montañas de medianoche a alba. */
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('time');
const label = document.querySelector('.controls label');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const STARS = Array.from({ length: 170 }, function () { return { x: Math.random(), y: Math.random() * .7, r: Math.random() * 1.5 + .4, p: Math.random() * 7 }; });

/* Paletas de medianoche → amanecer (interpolación lineal por canal) */
const NIGHT = { top: [8, 10, 40], mid: [24, 26, 78], hor: [40, 40, 96] };
const DAWN = { top: [255, 190, 140], mid: [255, 150, 120], hor: [255, 210, 160] };
function mix(a, b, t) { return [0, 1, 2].map(function (i) { return Math.round(a[i] + (b[i] - a[i]) * t); }); }
function rgb(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }

function draw() {
  const t = slider.value / 100;                       // 0 noche → 1 amanecer
  document.body.classList.toggle('spun', t > .8);
  label.textContent = t < .05 ? '00:00 · medianoche — arrastra hacia el amanecer →'
    : t < .5 ? String(Math.floor(t * 24)).padStart(2, '0') + ':' + String(Math.floor((t * 24 % 1) * 60)).padStart(2, '0') + ' · el cielo despierta…'
    : t < .99 ? String(Math.floor(t * 24)).padStart(2, '0') + ':' + String(Math.floor((t * 24 % 1) * 60)).padStart(2, '0') + ' · casi amanece…'
    : '06:30 · ¡buenos días!';
  const top = mix(NIGHT.top, DAWN.top, t), mid = mix(NIGHT.mid, DAWN.mid, t), hor = mix(NIGHT.hor, DAWN.hor, t);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgb(top)); g.addColorStop(.55, rgb(mid)); g.addColorStop(1, rgb(hor));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  /* Estrellas se apagan con el día */
  const starA = 1 - t;
  if (starA > 0) {
    for (const s of STARS) {
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + (starA * (.3 + .5 * Math.abs(Math.sin(s.p + performance.now() * .001)))) + ')'; ctx.fill();
    }
  }
  /* Sol/Luna: la luna baja y el sol sube */
  const sunY = H * (.95 - t * .55), sunX = W * (.5 + (t - .5) * .3);
  ctx.beginPath(); ctx.arc(sunX, sunY, 34 + t * 22, 0, Math.PI * 2);
  ctx.fillStyle = t < .5 ? '#f4f1e0' : '#ffdf8a';
  ctx.shadowColor = t < .5 ? 'rgba(240,240,220,.8)' : 'rgba(255,200,80,.95)';
  ctx.shadowBlur = 40 + t * 50; ctx.fill(); ctx.shadowBlur = 0;
  /* Montañas en silueta (dos capas) */
  function ridge(base, amp, color, seed) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 14) {
      const y = base - Math.abs(Math.sin(x * .008 + seed)) * amp - Math.sin(x * .02 + seed * 2) * amp * .3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  }
  const dark = 1 - t * .8;
  ridge(H * .72, 70, 'rgba(' + Math.round(18 + t * 120) + ',' + Math.round(20 + t * 60) + ',' + Math.round(52 + t * 40) + ',' + (.9 * dark + .12) + ')', 3);
  ridge(H * .84, 50, 'rgba(' + Math.round(10 + t * 90) + ',' + Math.round(12 + t * 45) + ',' + Math.round(30 + t * 30) + ',' + (.95 * dark + .15) + ')', 7);
}
slider.addEventListener('input', draw);
draw();
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

