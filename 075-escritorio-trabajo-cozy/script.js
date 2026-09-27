/* Escritorio Cozy
 * Taza de té humeante, lámpara cálida y una libreta abierta con el mensaje del día.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Escritorio cozy: lámpara que ilumina, vapor animado y libreta con mensaje diario. */
'use strict';
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

let lampOn = true;
document.getElementById('lampBtn').addEventListener('click', function () {
  lampOn = !lampOn;
  this.textContent = lampOn ? '💡 Lámpara' : '🌑 Apagar';
  clickSound();
});

const NOTES = [
  'Hoy también salió el sol por tu culpa.',
  'Recordatorio: eres más fuerte que los lunes.',
  'Tu risa ya arregló tres días esta semana.',
  'Sorbo de té = sorbo de paciencia. Te lo mereces.',
  'Hay planes bonitos cargándose en el horizonte.',
  'Dato verificable: haces del mundo un lugar más suave.',
  '¡Cita pendiente contigo mismo/a para descansar!',
  'Lo que hoy pesa, mañana será anécdota. Mientras tanto, té.'
];
const note = NOTES[new Date().getDate() % NOTES.length];

/* Vapor */
const steam = [];
function spawnSteam(x, y) {
  steam.push({ x: x, y: y, r: 4 + Math.random() * 6, vy: -.4 - Math.random() * .4, vx: (Math.random() - .5) * .3, life: 1 });
}

function frame(t) {
  /* Pared */
  const wall = ctx.createLinearGradient(0, 0, 0, H);
  wall.addColorStop(0, '#4a3826'); wall.addColorStop(1, '#241a10');
  ctx.fillStyle = wall; ctx.fillRect(0, 0, W, H);
  /* Luz de lámpara */
  if (lampOn) {
    const lampX = W * .78, lampY = H * .3;
    const glow = ctx.createRadialGradient(lampX, lampY, 10, lampX, lampY, Math.max(W, H) * .65);
    glow.addColorStop(0, 'rgba(255,210,140,.4)');
    glow.addColorStop(.4, 'rgba(255,190,120,.16)');
    glow.addColorStop(1, 'rgba(255,190,120,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  }
  /* Escritorio */
  const deskY = H * .72;
  ctx.fillStyle = '#5d4430';
  ctx.fillRect(0, deskY, W, H - deskY);
  ctx.fillStyle = 'rgba(255,255,255,.05)';
  ctx.fillRect(0, deskY, W, 8);
  /* Lámpara */
  const lampX = W * .78;
  ctx.strokeStyle = '#2a1e12'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(lampX, deskY); ctx.lineTo(lampX, H * .34); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lampX, H * .34); ctx.lineTo(lampX - 34, H * .3); ctx.stroke();
  ctx.fillStyle = lampOn ? '#e8c87a' : '#8a7a5a';
  ctx.beginPath();
  ctx.moveTo(lampX - 52, H * .3); ctx.quadraticCurveTo(lampX, H * .16, lampX + 52, H * .3);
  ctx.closePath(); ctx.fill();
  if (lampOn) {
    ctx.fillStyle = 'rgba(255,230,160,.95)';
    ctx.beginPath(); ctx.arc(lampX, H * .31, 8, 0, Math.PI * 2); ctx.fill();
  }
  /* Taza de té */
  const cupX = W * .24, cupY = deskY - 34;
  if (Math.random() < .12) spawnSteam(cupX + (Math.random() - .5) * 26, cupY - 24);
  ctx.fillStyle = '#d8cbb0';
  ctx.beginPath(); ctx.roundRect(cupX - 34, cupY - 30, 68, 60, 8); ctx.fill();
  ctx.strokeStyle = '#d8cbb0'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(cupX + 42, cupY, 13, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.fillStyle = '#6a4a2a';
  ctx.beginPath(); ctx.ellipse(cupX, cupY - 26, 30, 7, 0, 0, Math.PI * 2); ctx.fill();
  /* Vapor dibujado */
  for (let i = steam.length - 1; i >= 0; i--) {
    const s = steam[i];
    s.y += s.vy; s.x += s.vx + Math.sin(t * .002 + s.y * .04) * .3; s.life -= .008; s.r += .1;
    if (s.life <= 0) { steam.splice(i, 1); continue; }
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(240,230,210,' + (s.life * .16) + ')';
    ctx.fill();
  }
  /* Libreta abierta */
  const bookX = W * .42, bookY = deskY + 6, bookW = Math.min(300, W * .4), bookH = 130;
  ctx.save();
  ctx.translate(bookX, bookY);
  ctx.fillStyle = '#f5efdc';
  ctx.beginPath(); ctx.roundRect(0, 0, bookW, bookH, 4); ctx.fill();
  ctx.fillStyle = 'rgba(120,90,50,.25)';
  ctx.fillRect(bookW / 2 - 1, 4, 2, bookH - 8);
  ctx.strokeStyle = 'rgba(160,140,100,.5)'; ctx.lineWidth = 1;
  for (let y = 22; y < bookH - 10; y += 18) {
    ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(bookW / 2 - 12, y); ctx.stroke();
  }
  /* Mensaje del día (manuscrito) */
  ctx.fillStyle = '#5a4a30';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.textAlign = 'center';
  const words = note.split(' ');
  let line = '', ly = 44;
  for (const w of words) {
    if (ctx.measureText(line + w).width > bookW / 2 - 34) { ctx.fillText(line, bookW / 4 + 6, ly); ly += 20; line = ''; }
    line += w + ' ';
  }
  ctx.fillText(line, bookW / 4 + 6, ly);
  /* Taza pequeña junto a la libreta */
  ctx.restore();
  /* Planta */
  const plantX = W * .12;
  ctx.strokeStyle = '#4a6a3a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(plantX, deskY - 20);
  ctx.quadraticCurveTo(plantX - 8 + Math.sin(t * .001) * 4, deskY - 60, plantX - 4, deskY - 90); ctx.stroke();
  ctx.fillStyle = '#5d8a4a';
  [[-14, -60, -.6], [12, -70, .6], [-4, -88, -.2]].forEach(function (l) {
    ctx.beginPath(); ctx.ellipse(plantX + l[0], deskY + l[1], 16, 6, l[2], 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#b8734a';
  ctx.beginPath(); ctx.roundRect(plantX - 22, deskY - 22, 44, 24, 4); ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
function clickSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 420;
    g.gain.setValueAtTime(.04, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .08);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .08);
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

