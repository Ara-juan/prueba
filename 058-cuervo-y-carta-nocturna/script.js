/* Cuervo y Carta Nocturna
 * Ventana gótica bajo la lluvia, un cuervo mensajero y una carta con sello oscuro.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Escena nocturna: lluvia, cuervo posado que vuela al clic y entrega la carta. */
'use strict';
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const letter = document.getElementById('letter');
const hint = document.getElementById('hint');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

const drops = Array.from({ length: 150 }, function () {
  return { x: Math.random() * 2200, y: Math.random() * 1400, l: 10 + Math.random() * 16, v: 10 + Math.random() * 6 };
});

/* Estado del cuervo */
const crow = { x: 0, y: 0, tx: 0, ty: 0, flying: false, delivered: false, flap: 0 };
function perch() {
  crow.x = W * .72; crow.y = H * .42;
  crow.tx = crow.x; crow.ty = crow.y;
}
perch(); addEventListener('resize', perch);

canvas.addEventListener('pointerdown', function (e) {
  if (crow.delivered) return;
  if (Math.hypot(e.clientX - crow.x, e.clientY - crow.y) < 90) {
    crow.flying = true;
    crow.tx = W * .4; crow.ty = H * .48;
    caw();
    setTimeout(function () {
      crow.delivered = true;
      letter.classList.add('show');
      hint.style.display = 'none';
      chime();
    }, 1500);
  }
});

function caw() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(420, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, a.currentTime + .25);
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .3);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .3);
  } catch (e) { /* opcional */ }
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    [392, 523].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .18); });
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .9);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .9);
  } catch (e) { /* opcional */ }
}

function drawCrow(t) {
  /* Movimiento: vuelo suave hacia el objetivo */
  crow.x += (crow.tx - crow.x) * .04;
  crow.y += (crow.ty - crow.y) * .04;
  const flying = crow.flying && Math.hypot(crow.tx - crow.x, crow.ty - crow.y) > 8;
  const bob = flying ? Math.sin(t * .02) * 6 : Math.sin(t * .0018) * 2;
  const flap = flying ? Math.sin(t * .045) : .25;
  ctx.save();
  ctx.translate(crow.x, crow.y + bob);
  ctx.scale(.9, .9);
  ctx.fillStyle = '#16141c';
  /* Cuerpo */
  ctx.beginPath(); ctx.ellipse(0, 0, 26, 16, .2, 0, Math.PI * 2); ctx.fill();
  /* Cabeza + pico */
  ctx.beginPath(); ctx.arc(20, -10, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a4050';
  ctx.beginPath(); ctx.moveTo(28, -10); ctx.lineTo(40, -7); ctx.lineTo(28, -5); ctx.closePath(); ctx.fill();
  /* Ala animada */
  ctx.fillStyle = '#100e16';
  ctx.save();
  ctx.rotate(flap * .7 - .3);
  ctx.beginPath(); ctx.ellipse(-6, -8, 26, 8, -.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  /* Cola */
  ctx.beginPath(); ctx.moveTo(-22, 2); ctx.lineTo(-44, -6); ctx.lineTo(-42, 8); ctx.closePath(); ctx.fill();
  /* Ojo */
  ctx.fillStyle = '#e8d860';
  ctx.beginPath(); ctx.arc(22, -12, 1.8, 0, Math.PI * 2); ctx.fill();
  /* Carta en el pico cuando vuela */
  if (flying || (crow.delivered && !letter.classList.contains('show'))) {
    ctx.fillStyle = '#d8ccb0';
    ctx.fillRect(38, -9, 10, 7);
  }
  ctx.restore();
}

function frame(t) {
  /* Cielo nocturno */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0a0a14'); sky.addColorStop(1, '#141221');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  /* Luna con halo */
  const mx = W * .18, my = H * .22;
  const halo = ctx.createRadialGradient(mx, my, 20, mx, my, 160);
  halo.addColorStop(0, 'rgba(216,212,232,.35)'); halo.addColorStop(1, 'rgba(216,212,232,0)');
  ctx.fillStyle = halo; ctx.fillRect(mx - 160, my - 160, 320, 320);
  ctx.beginPath(); ctx.arc(mx, my, 44, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(216,212,232,.9)'; ctx.fill();
  /* Marco de ventana gótica (arco apuntado) */
  ctx.strokeStyle = '#241f30'; ctx.lineWidth = 10;
  ctx.beginPath();
  const wx = W * .5, wy = H * .5, ww = Math.min(W, H) * .55, wh = ww * 1.25;
  ctx.moveTo(wx - ww / 2, wy + wh / 2);
  ctx.lineTo(wx - ww / 2, wy - wh * .1);
  ctx.quadraticCurveTo(wx, wy - wh / 2 - wh * .18, wx + ww / 2, wy - wh * .1);
  ctx.lineTo(wx + ww / 2, wy + wh / 2);
  ctx.stroke();
  /* Barrotes */
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(wx, wy - wh / 2); ctx.lineTo(wx, wy + wh / 2);
  ctx.moveTo(wx - ww / 2, wy + wh * .1); ctx.lineTo(wx + ww / 2, wy + wh * .1);
  ctx.stroke();
  drawCrow(t);
  /* Lluvia frente a todo */
  ctx.strokeStyle = 'rgba(150,160,200,.35)'; ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (const d of drops) {
    d.y += d.v; d.x += 2;
    if (d.y > H) { d.y = -20; d.x = Math.random() * (W + 200); }
    ctx.moveTo(d.x % (W + 200), d.y);
    ctx.lineTo((d.x % (W + 200)) - 3, d.y - d.l);
  }
  ctx.stroke();
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

