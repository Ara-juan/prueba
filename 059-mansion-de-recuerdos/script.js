/* Mansión de Recuerdos
 * Fachada nocturna de una mansión: cada ventana encendida guarda una dedicatoria o foto.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Mansión: fachada dibujada en canvas con ventanas interactivas. */
'use strict';
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = Math.min(680, innerWidth * .94); H = Math.min(520, innerHeight * .7); canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
resize(); addEventListener('resize', resize);

const ROOMS = [
  ['La Sala de los Abrazos', 'Aquí se guardan, al calor de la chimenea, todos los abrazos que nos debemos todavía.'],
  ['La Cocina de las Sobremesas', 'Donde el tiempo se mide en risas por minuto y la receta secreta es quién acompaña.'],
  ['La Biblioteca de Secretos', 'Confidencias encuadernadas en cuero: solo se abren con tu voz.'],
  ['El Jardín de Invierno', 'Flores que florecen en plena escarcha. Sí, como tú: imposible y hermoso.'],
  ['La Torreta de los Deseos', 'Desde aquí se ven todos los caminos. Todos llevan a personas buenas. Tú estás en el centro.'],
  ['El Sótano de los Abrazos Pendientes', 'Se acumulan por falta de tiempo. Aviso: están ganando interés.']
];
/* Ventanas: posiciones relativas [x, y] en fracciones del lienzo */
const WINDOWS = [
  [.18, .42], [.38, .42], [.58, .42], [.78, .42],
  [.28, .68], [.48, .68], [.68, .68]
];
let litIdx = 0;
const lit = WINDOWS.map(function (_, i) { return i < 3; });   // algunas ya encendidas

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Cielo con luna */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0c0a14'); sky.addColorStop(1, '#181228');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  ctx.beginPath(); ctx.arc(W * .85, H * .16, 26, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(220,215,235,.9)'; ctx.fill();
  /* Murciélagos lejanos */
  for (let i = 0; i < 5; i++) {
    const bx = (t * .02 + i * 130) % (W + 60) - 30;
    const by = H * (.12 + .06 * Math.sin(t * .002 + i * 2));
    ctx.fillStyle = 'rgba(20,16,28,.9)';
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx - 7, by - 4 + Math.sin(t * .02 + i) * 2);
    ctx.lineTo(bx - 3, by);
    ctx.lineTo(bx + 3, by);
    ctx.lineTo(bx + 7, by - 4 + Math.cos(t * .02 + i) * 2);
    ctx.closePath(); ctx.fill();
  }
  /* Cuerpo de la mansión */
  ctx.fillStyle = '#1c1826';
  ctx.fillRect(W * .08, H * .3, W * .84, H * .66);
  /* Tejado */
  ctx.fillStyle = '#141020';
  ctx.beginPath();
  ctx.moveTo(W * .04, H * .32); ctx.lineTo(W * .5, H * .08); ctx.lineTo(W * .96, H * .32);
  ctx.closePath(); ctx.fill();
  /* Torre central */
  ctx.fillRect(W * .44, H * .16, W * .12, H * .2);
  ctx.beginPath();
  ctx.moveTo(W * .42, H * .18); ctx.lineTo(W * .5, H * .04); ctx.lineTo(W * .58, H * .18);
  ctx.closePath(); ctx.fill();
  /* Piedras */
  ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1;
  for (let y = H * .35; y < H * .92; y += 22) {
    ctx.beginPath(); ctx.moveTo(W * .1, y); ctx.lineTo(W * .9, y); ctx.stroke();
  }
  /* Ventanas */
  WINDOWS.forEach(function (wpos, i) {
    const x = wpos[0] * W, y = wpos[1] * H;
    const ww = W * .075, wh = H * .13;
    /* Resplandor si está encendida */
    if (lit[i]) {
      const g = ctx.createRadialGradient(x, y, 4, x, y, ww * 2.4);
      g.addColorStop(0, 'rgba(255,200,110,.28)'); g.addColorStop(1, 'rgba(255,200,110,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - ww * 2.4, y - wh * 1.6, ww * 4.8, wh * 3.4);
    }
    ctx.fillStyle = lit[i] ? 'rgba(255,205,120,' + (.75 + .25 * Math.sin(t * .003 + i * 2)) + ')' : '#0e0c16';
    ctx.fillRect(x - ww / 2, y - wh / 2, ww, wh);
    ctx.strokeStyle = '#2a2436'; ctx.lineWidth = 3;
    ctx.strokeRect(x - ww / 2, y - wh / 2, ww, wh);
    ctx.beginPath(); ctx.moveTo(x, y - wh / 2); ctx.lineTo(x, y + wh / 2); ctx.stroke();
  });
  /* Puerta */
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(W * .47, H * .82, W * .06, H * .14);
  ctx.beginPath(); ctx.arc(W * .5, H * .82, W * .03, Math.PI, 0);
  ctx.fillStyle = '#3a2a1a'; ctx.fill();
  /* Candelabro junto a la puerta */
  const lampX = W * .41, lampY = H * .84;
  const lg = ctx.createRadialGradient(lampX, lampY, 2, lampX, lampY, 46);
  lg.addColorStop(0, 'rgba(255,210,130,.5)'); lg.addColorStop(1, 'rgba(255,210,130,0)');
  ctx.fillStyle = lg; ctx.fillRect(lampX - 46, lampY - 46, 92, 92);
  ctx.fillStyle = '#ffe9b0';
  ctx.beginPath(); ctx.arc(lampX, lampY, 5, 0, Math.PI * 2); ctx.fill();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

canvas.addEventListener('pointerdown', function (e) {
  const r = canvas.getBoundingClientRect();
  const x = (e.clientX - r.left) * (canvas.width / r.width);
  const y = (e.clientY - r.top) * (canvas.height / r.height);
  WINDOWS.forEach(function (wpos, i) {
    const wx = wpos[0] * W, wy = wpos[1] * H;
    if (Math.hypot(x - wx, y - wy) < W * .07) {
      lit[i] = true;                                    // enciende también las apagadas
      const room = ROOMS[i % ROOMS.length];
      infoTitle.textContent = room[0];
      infoText.textContent = room[1];
      info.classList.add('show');
      clearTimeout(info.timer);
      info.timer = setTimeout(function () { info.classList.remove('show'); }, 4600);
      creak();
    }
  });
});
function creak() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(160, a.currentTime);
    o.frequency.linearRampToValueAtTime(90, a.currentTime + .3);
    g.gain.setValueAtTime(.04, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .4);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .4);
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

