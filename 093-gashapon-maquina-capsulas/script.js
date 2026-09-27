/* Máquina Gashapon
 * Gira la perilla: una cápsula al azar cae con un premio dedicado dentro.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Gashapon: perilla giratoria → cápsula cae → premio aleatorio dedicado. */
'use strict';
const dome = document.getElementById('dome');
const knob = document.getElementById('knob');
const prize = document.getElementById('prize');
const PALETTE = ['#e84a5a', '#4a9ae8', '#4ecb8d', '#f0c040', '#a86ae8', '#ff9a5a', '#ff8fab', '#5ad0d8'];
const PRIZES = [
  ['🧸', 'Abrazo de Peluche Nivel 10', 'Válido para hoy, mañana y todos los días que duela el mundo.'],
  ['⭐', 'Estrella Fugaz Personalizada', 'Un deseo ya concedido: más tiempo juntos. No hace falta pedir más.'],
  ['🎟️', 'Boleto de Plan Sorpresa', 'Fecha, hora y destino: por decidir. La única certeza: contigo.'],
  ['🍪', 'Galleta de la Fortuna (Mejorada)', 'La fortuna dice: "Quien entrega esta galleta tiene muchísima suerte ya".'],
  ['💌', 'Carta Miniatura de Apoyo', 'Contenido: "Tú puedes con esto. Y con lo siguiente. Y con todo."'],
  ['🌈', 'Tramo de Arcoíris Certificado', 'Para días grises: se coloca sobre tu cabeza y funciona al instante.'],
  ['🏆', 'Trofeo a la Persona Más Genial', 'Jurado: yo. Resultado unánime. Entregado con admiración infinita.']
];

/* Llena la cúpula con cápsulas */
for (let i = 0; i < 22; i++) {
  const c = document.createElement('div');
  c.className = 'capsule';
  const col = PALETTE[i % PALETTE.length];
  c.style.background = 'linear-gradient(180deg,' + col + ' 50%,#fff 50%)';
  c.style.left = (6 + Math.random() * 74) + '%';
  c.style.top = (18 + Math.random() * 62) + '%';
  c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
  dome.appendChild(c);
}
let turning = false, turns = 0;
knob.addEventListener('click', turn);
/* También girar arrastrando */
let dragX = 0;
knob.addEventListener('pointerdown', function (e) { dragX = e.clientX; knob.setPointerCapture(e.pointerId); });
knob.addEventListener('pointerup', function (e) {
  if (Math.abs(e.clientX - dragX) > 22) turn();
});
function turn() {
  if (turning) return;
  turning = true;
  turns++;
  knob.style.transform = 'rotate(' + (turns * 360) + 'deg)';
  ratchet();
  /* Las cápsulas se agitan */
  dome.querySelectorAll('.capsule').forEach(function (c) {
    c.style.transform = 'translate(' + ((Math.random() - .5) * 20) + 'px,' + ((Math.random() - .5) * 20) + 'px) rotate(' + (Math.random() * 360) + 'deg)';
  });
  /* Cápsula que cae fuera de la máquina */
  setTimeout(releaseCapsule, 600);
  setTimeout(function () { turning = false; }, 1100);
}
function releaseCapsule() {
  const p = PRIZES[Math.floor(Math.random() * PRIZES.length)];
  const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const c = document.createElement('div');
  c.className = 'fallen';
  c.textContent = p[0];
  c.style.background = 'linear-gradient(180deg,' + col + ' 50%,#fff 50%)';
  c.style.left = 'calc(50% - 32px)';
  c.style.top = (innerHeight / 2 + 60) + 'px';
  document.body.appendChild(c);
  dropSound();
  /* Abre la cápsula al hacer clic (o solo tras un momento) */
  c.addEventListener('pointerdown', function () { showPrize(p, c); });
  setTimeout(function () { if (document.body.contains(c)) showPrize(p, c); }, 1800);
}
function showPrize(p, capsuleEl) {
  if (capsuleEl && document.body.contains(capsuleEl)) {
    capsuleEl.style.transform += ' scale(0)';
    capsuleEl.style.opacity = '0';
    setTimeout(function () { capsuleEl.remove(); }, 500);
  }
  document.getElementById('pEmoji').textContent = p[0];
  document.getElementById('pTitle').textContent = p[1];
  document.getElementById('pText').textContent = p[2];
  prize.classList.add('show');
  popSound();
}
document.getElementById('pClose').addEventListener('click', function () { prize.classList.remove('show'); });
function ratchet() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square';
    [340, 280, 340, 300].forEach(function (f, i) { o.frequency.setValueAtTime(f, a.currentTime + i * .09); });
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .4);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .4);
  } catch (e) { /* opcional */ }
}
function dropSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(520, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(190, a.currentTime + .22);
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .28);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .28);
  } catch (e) { /* opcional */ }
}
function popSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(700, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1250, a.currentTime + .14);
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .26);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .26);
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

