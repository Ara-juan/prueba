/* Invernadero de Recuerdos
 * Arrastra la regadera sobre las macetas: las plantas crecen y revelan recuerdos en sus hojas.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Invernadero: regadera arrastrable, plantas que crecen al regarlas y notas en las hojas. */
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

const MEMORIES = [
  'Aquella siesta al sol.', 'El té de las 5 de la tarde.', 'Nuestro primer viaje juntos.',
  'Las risas de la sobremesa.', 'Ese abrazo que curó todo.', 'La playlist de la carretera.'
];
const pots = MEMORIES.map(function (m, i) {
  const note = document.createElement('div');
  note.className = 'leaf-note';
  note.textContent = m;
  document.body.appendChild(note);
  return { x: 0, y: 0, note: note, water: 0, grown: false };
});
function layoutPots() {
  pots.forEach(function (p, i) {
    p.x = W * ((i + .5) / pots.length);
    p.y = H * .8;
  });
}
layoutPots(); addEventListener('resize', layoutPots);

const can = { x: W * .5, y: H * .55, drag: false, ox: 0, oy: 0 };

canvas.addEventListener('pointerdown', function (e) {
  /* ¿Agarra la regadera? */
  if (Math.hypot(e.clientX - can.x, e.clientY - can.y) < 70) {
    can.drag = true; can.ox = e.clientX - can.x; can.oy = e.clientY - can.y;
  }
});
addEventListener('pointerup', function () { can.drag = false; });
addEventListener('pointermove', function (e) {
  if (!can.drag) return;
  can.x = e.clientX - can.ox; can.y = e.clientY - can.oy;
  /* Riega macetas bajo la regadera */
  for (const p of pots) {
    if (Math.abs(can.x - p.x) < 70 && can.y < p.y && can.y > p.y - 260) {
      if (p.water < 1 && Math.random() < .2) p.water = Math.min(1, p.water + .015);
      if (p.water >= 1 && !p.grown) {
        p.grown = true;
        const r = p.note.getBoundingClientRect();
        p.note.style.left = (r.left + r.width / 2) + 'px';
        p.note.style.top = (p.y - 200) + 'px';
        p.note.classList.add('show');
        p.note.style.left = p.x + 'px'; p.note.style.top = (p.y - 190) + 'px';
        chime();
      }
    }
  }
});

function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(392, a.currentTime);
    o.frequency.linearRampToValueAtTime(523, a.currentTime + .25);
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .6);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .6);
  } catch (e) { /* opcional */ }
}

function drawPlant(p, t) {
  const g = p.water;                                   // 0 → 1 crecimiento
  if (g <= 0) return;
  const sway = Math.sin(t * .001 + p.x) * 4;
  ctx.strokeStyle = '#4c7a3d'; ctx.lineWidth = 4;
  /* Tallo con 3 pares de hojas */
  const height = 150 * g;
  ctx.beginPath(); ctx.moveTo(p.x, p.y - 34);
  ctx.quadraticCurveTo(p.x + sway, p.y - 34 - height * .5, p.x + sway, p.y - 34 - height);
  ctx.stroke();
  for (let l = 0; l < 3; l++) {
    const ly = p.y - 34 - height * (.3 + l * .25);
    const side = l % 2 ? 1 : -1;
    ctx.fillStyle = 'hsl(110,40%,' + (38 + l * 6) + '%)';
    ctx.beginPath(); ctx.ellipse(p.x + sway * .5 + side * 22 * g, ly, 20 * g, 8 * g, side * .5, 0, Math.PI * 2); ctx.fill();
  }
  /* Flor superior al completarse */
  if (g >= 1) {
    for (let pt = 0; pt < 6; pt++) {
      const a = pt / 6 * Math.PI * 2 + t * .0004;
      ctx.fillStyle = '#e79ac0';
      ctx.beginPath(); ctx.ellipse(p.x + sway + Math.cos(a) * 12, p.y - 34 - height + Math.sin(a) * 12, 9, 5, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#f6c445';
    ctx.beginPath(); ctx.arc(p.x + sway, p.y - 34 - height, 6, 0, Math.PI * 2); ctx.fill();
  }
}

function frame(t) {
  ctx.clearRect(0, 0, W, H);
  /* Estantería / banco */
  ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, H * .8, W, 14);
  ctx.fillStyle = '#6d5238';
  pots.forEach(function (p) { ctx.fillRect(p.x - 6, H * .8 + 14, 12, H); });
  for (const p of pots) drawPlant(p, t);
  /* Macetas de barro */
  for (const p of pots) {
    ctx.fillStyle = '#c96f4a';
    ctx.beginPath();
    ctx.moveTo(p.x - 34, p.y - 34); ctx.lineTo(p.x + 34, p.y - 34);
    ctx.lineTo(p.x + 26, p.y); ctx.lineTo(p.x - 26, p.y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a75537'; ctx.fillRect(p.x - 38, p.y - 40, 76, 8);
    if (p.water > 0) { ctx.fillStyle = '#5b3a22'; ctx.fillRect(p.x - 30, p.y - 38, 60 * Math.min(1, p.water + .3), 5); }
  }
  /* Regadera */
  ctx.save(); ctx.translate(can.x, can.y);
  ctx.globalAlpha = can.drag ? 1 : .85;
  ctx.fillStyle = '#7fa7b8';
  ctx.beginPath(); ctx.roundRect(-34, -22, 68, 42, 8); ctx.fill();
  ctx.beginPath(); ctx.moveTo(34, -10); ctx.lineTo(64, -26); ctx.lineTo(66, -18); ctx.lineTo(36, -2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6a92a3';
  ctx.beginPath(); ctx.arc(66, -20, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-30, -30, 13, Math.PI, Math.PI * 2); ctx.fill();
  /* Gotas mientras se arrastra sobre una maceta */
  if (can.drag) {
    for (const p of pots) {
      if (Math.abs(can.x - p.x) < 70 && can.y < p.y && can.y > p.y - 260 && p.water < 1) {
        for (let d = 0; d < 3; d++) {
          ctx.fillStyle = 'rgba(110,180,230,.8)';
          ctx.beginPath(); ctx.arc(60 + Math.random() * 12, 30 + Math.random() * 60, 2.4, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
  }
  ctx.restore();
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

