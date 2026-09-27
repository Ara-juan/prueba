/* Máquina de Chicles Vintage
 * Gira la perilla: cae una bola de chicle con una cápsula sorpresa y una frase al azar.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Máquina de chicles: perilla giratoria → bola cae → cápsula con frase. */
'use strict';
const globe = document.getElementById('globe');
const knob = document.getElementById('knob');
const msg = document.getElementById('msg');
const msgText = document.getElementById('msgText');
const COLORS = ['#e84a6a', '#4ac9e8', '#8ae84a', '#f0d84a', '#b06ae8', '#ff9a4a', '#ff6fa5', '#4a8ae8'];

/* Llena el globo con chicles */
const balls = [];
for (let i = 0; i < 34; i++) {
  const b = document.createElement('div');
  b.className = 'gumball';
  const c = COLORS[i % COLORS.length];
  b.style.background = 'radial-gradient(circle at 35% 30%,' + c + ',' + c + 'cc)';
  b.style.left = (4 + Math.random() * 82) + '%';
  b.style.top = (12 + Math.random() * 80) + '%';
  globe.appendChild(b);
  balls.push(b);
}

const FORTUNES = [
  'Hoy es un buen día para sonreír sin motivo. (Motivo: existes.)',
  'Deseo concedido: más días contigo.',
  'Advertencia: nivel de genialidad extremadamente alto. Sigue así.',
  'Este chicle sabe a martes convertido en viernes, gracias a ti.',
  'La suerte te busca. Dile que estás justo donde siempre: increíble.',
  'Intercambio justo: tu sonrisa por mi día completo.',
  'Recuerdo oficial: eres alguien muy importante para alguien (yo).',
  'Chicle edición limitada: como tú, no se repite.'
];
let turning = false;

/* Perilla: girar 180° con arrastre o clic */
knob.addEventListener('click', turn);
let dragStart = 0;
knob.addEventListener('pointerdown', function (e) { dragStart = e.clientX; knob.setPointerCapture(e.pointerId); });
knob.addEventListener('pointerup', function (e) {
  if (Math.abs(e.clientX - dragStart) > 24) turn();
});
function turn() {
  if (turning) return;
  turning = true;
  const rot = 180;
  knob.style.transform = 'rotate(' + rot + 'deg)';
  ratchetSound();
  /* Un chicle del globo cae */
  const b = balls[Math.floor(Math.random() * balls.length)];
  b.style.transform = 'translate(60px,300px) rotate(200deg)';
  setTimeout(function () {
    b.style.transform = '';
  }, 700);
  /* La cápsula sale de la ranura */
  setTimeout(releaseCapsule, 500);
  setTimeout(function () {
    knob.style.transform = '';
    turning = false;
  }, 900);
}
function releaseCapsule() {
  const slotR = document.querySelector('.slot').getBoundingClientRect();
  const c = document.createElement('div');
  c.className = 'capsule';
  c.textContent = '💌';
  c.style.background = 'linear-gradient(180deg,' + COLORS[Math.floor(Math.random() * COLORS.length)] + ' 50%,#fff 50%)';
  c.style.left = (slotR.left + slotR.width / 2 - 26) + 'px';
  c.style.top = (slotR.bottom + 6) + 'px';
  document.body.appendChild(c);
  dropSound();
  /* Cae y rebota */
  const floor = innerHeight - 90;
  c.style.transform = 'translateY(' + (floor - c.offsetTop) + 'px)';
  c.addEventListener('pointerdown', openCapsule);
  setTimeout(function () {
    if (document.body.contains(c)) openCapsule({ currentTarget: c });
  }, 1600);
}
function openCapsule(e) {
  const c = e.currentTarget;
  if (!c || !document.body.contains(c)) return;
  c.style.transform += ' scale(0)';
  c.style.opacity = '0';
  setTimeout(function () { c.remove(); }, 500);
  msgText.textContent = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  msg.classList.add('show');
  popSound();
}
document.getElementById('msgClose').addEventListener('click', function () { msg.classList.remove('show'); });

/* Sonidos */
function ratchetSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(320, a.currentTime);
    o.frequency.setValueAtTime(240, a.currentTime + .07);
    o.frequency.setValueAtTime(320, a.currentTime + .14);
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .25);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .25);
  } catch (e) { /* opcional */ }
}
function dropSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(500, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(180, a.currentTime + .25);
    g.gain.setValueAtTime(.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .3);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .3);
  } catch (e) { /* opcional */ }
}
function popSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(800, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(1300, a.currentTime + .12);
    g.gain.setValueAtTime(.09, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .25);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .25);
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

