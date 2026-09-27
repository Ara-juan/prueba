/* Carta Ghibli (Parada del Bus)
 * Parada de autobús nocturna, lluvia en Canvas y un vecino curioso y peludo. Música activable.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Escena Ghibli: lluvia, farol de parada, Totoro-like dibujado en canvas y música generativa. */
'use strict';
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { var dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener('resize', resize); resize();

/* --- Lluvia --- */
const drops = Array.from({ length: 190 }, function () {
  return { x: Math.random() * 2000, y: Math.random() * 1200, l: 8 + Math.random() * 14, v: 9 + Math.random() * 7 };
});
/* --- Salpicaduras --- */
const splashes = [];

/* --- Música generativa: arpegio pentatónico suave en loop --- */
let musicOn = false, musicTimer = null, ac = null;
const SCALE = [220, 247, 294, 330, 392, 440];
function startMusic() {
  if (musicOn) return;
  musicOn = true;
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  const seq = [0, 2, 4, 3, 5, 4, 2, 1];
  let step = 0;
  musicTimer = setInterval(function () {
    if (!musicOn) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = SCALE[seq[step % seq.length]] * 2;
    g.gain.setValueAtTime(.05, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .9);
    o.connect(g).connect(ac.destination);
    o.start(); o.stop(ac.currentTime + .9);
    if (step % 4 === 0) {                            // bajo suave cada 4 notas
      const b = ac.createOscillator(), bg = ac.createGain();
      b.type = 'triangle'; b.frequency.value = SCALE[0] / 2;
      bg.gain.setValueAtTime(.07, ac.currentTime);
      bg.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + 1.6);
      b.connect(bg).connect(ac.destination);
      b.start(); b.stop(ac.currentTime + 1.6);
    }
    step++;
  }, 480);
}
const musicBtn = document.getElementById('music');
musicBtn.addEventListener('click', function () {
  musicOn = !musicOn;
  musicBtn.classList.toggle('on', musicOn);
  musicBtn.textContent = musicOn ? '♪ Sonando…' : '♪ Música';
  if (musicOn) startMusic(); else clearInterval(musicTimer);
});

function drawBusStop(t) {
  /* Parada: poste + letrero */
  ctx.strokeStyle = '#3a4a5a'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(W * .78, H * .88); ctx.lineTo(W * .78, H * .3); ctx.stroke();
  ctx.fillStyle = '#d8e8f5';
  ctx.beginPath(); ctx.roundRect(W * .78 - 46, H * .3 - 8, 92, 40, 6); ctx.fill();
  ctx.fillStyle = '#243448'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('BUS', W * .78, H * .3 + 18);
  /* Banco */
  ctx.fillStyle = '#4a3a2c';
  ctx.fillRect(W * .62, H * .8, 120, 10);
  ctx.fillRect(W * .62, H * .8 + 26, 120, 8);
  ctx.fillRect(W * .62 + 4, H * .8, 8, 34);
  ctx.fillRect(W * .62 + 108, H * .8, 8, 34);
}

function drawNeighbor(t) {
  /* Criatura gris y redondeada esperando junto al banco */
  const x = W * .68, y = H * .8;
  const breathe = Math.sin(t * .0018) * 2;
  ctx.fillStyle = '#8a8a8a';
  ctx.beginPath(); ctx.ellipse(x, y - 46 + breathe, 44, 50, 0, 0, Math.PI * 2); ctx.fill();
  /* Orejitas */
  ctx.beginPath(); ctx.moveTo(x - 30, y - 84 + breathe); ctx.lineTo(x - 22, y - 104 + breathe); ctx.lineTo(x - 12, y - 86 + breathe); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 30, y - 84 + breathe); ctx.lineTo(x + 22, y - 104 + breathe); ctx.lineTo(x + 12, y - 86 + breathe); ctx.fill();
  /* Panza clara */
  ctx.fillStyle = '#c8c8c8';
  ctx.beginPath(); ctx.ellipse(x, y - 36 + breathe, 26, 32, 0, 0, Math.PI * 2); ctx.fill();
  /* Marcas del pecho */
  ctx.strokeStyle = '#8a8a8a'; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(x - 12, y - 48 + i * 10 + breathe); ctx.lineTo(x + 12, y - 48 + i * 10 + breathe); ctx.stroke();
  }
  /* Ojos y nariz */
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(x - 10, y - 66 + breathe, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 10, y - 66 + breathe, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y - 56 + breathe, 2, 0, Math.PI * 2); ctx.fill();
  /* Paraguas que comparte */
  ctx.strokeStyle = '#5a4a3a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x + 40, y - 30); ctx.lineTo(x + 40, y - 120); ctx.stroke();
  ctx.fillStyle = '#b04a4a';
  ctx.beginPath(); ctx.arc(x + 40, y - 120, 42, Math.PI, 0); ctx.closePath(); ctx.fill();
}

function frame(t) {
  /* Cielo nocturno de lluvia */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0c1622'); sky.addColorStop(1, '#182a3a');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  /* Farol de la parada */
  const lampX = W * .78, lampY = H * .3 - 30;
  const glow = ctx.createRadialGradient(lampX, lampY, 4, lampX, lampY, 150);
  glow.addColorStop(0, 'rgba(255,220,140,.5)'); glow.addColorStop(1, 'rgba(255,220,140,0)');
  ctx.fillStyle = glow; ctx.fillRect(lampX - 150, lampY - 150, 300, 300);
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath(); ctx.arc(lampX, lampY, 8, 0, Math.PI * 2); ctx.fill();
  drawBusStop(t);
  drawNeighbor(t);
  /* Suelo mojado con reflejos */
  ctx.fillStyle = '#0d1826'; ctx.fillRect(0, H * .88, W, H * .12);
  ctx.fillStyle = 'rgba(255,220,140,.12)';
  ctx.beginPath(); ctx.ellipse(lampX, H * .93, 40, 6, 0, 0, Math.PI * 2); ctx.fill();
  /* Lluvia */
  ctx.strokeStyle = 'rgba(170,200,235,.4)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (const d of drops) {
    d.y += d.v; d.x += 1.6;
    if (d.y > H) {
      if (Math.random() < .3) splashes.push({ x: d.x % W, y: H * .9 + Math.random() * H * .08, r: 1, a: .8 });
      d.y = -20; d.x = Math.random() * (W + 200);
    }
    ctx.moveTo(d.x % (W + 200), d.y);
    ctx.lineTo((d.x % (W + 200)) - 2, d.y - d.l);
  }
  ctx.stroke();
  /* Salpicaduras */
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    s.r += .7; s.a -= .05;
    if (s.a <= 0) { splashes.splice(i, 1); continue; }
    ctx.strokeStyle = 'rgba(170,200,235,' + s.a + ')';
    ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r * 2, s.r * .7, 0, 0, Math.PI * 2); ctx.stroke();
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

