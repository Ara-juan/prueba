/* Frasco de Poción Flotante
 * Alquimia interactiva: agita el frasco, alimenta la poción y lee la fórmula del afecto.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Poción alquímica: burbujas, agitación con física simple y receta que se completa. */
'use strict';
const liquid = document.getElementById('liquid');
const flacon = document.querySelector('.flacon');
const recipe = document.getElementById('recipe');

/* Burbujas dentro del frasco */
const glass = document.querySelector('.body-glass');
const bubbles = [];
for (let i = 0; i < 14; i++) {
  const b = document.createElement('div');
  b.className = 'bubble';
  const size = 4 + Math.random() * 10;
  b.style.width = size + 'px'; b.style.height = size + 'px';
  b.style.left = (10 + Math.random() * 76) + '%';
  b.style.bottom = '4px';
  b.style.animationDuration = (2.2 + Math.random() * 2.6) + 's';
  b.style.animationDelay = (Math.random() * 3) + 's';
  glass.appendChild(b);
  bubbles.push(b);
}

const INGREDIENTS = [
  'una sonrisa tuya (de las que curan)',
  'memoria de nuestro mejor día',
  'extracto de paciencia infinita',
  'esencia de tu risa a las 2 a.m.',
  'polvo de abrazos pendientes',
  'tres gotas de "todo va a salir bien"',
  'una pizca de destino bien hecho',
  'cáscara de martes convertidos en viernes'
];
const CONCLUSION = '…y como ingrediente final: <b>TÚ</b>. El alquimista confirma que con esto, cualquier día gris se convierte en oro.';

let added = [];
document.getElementById('ingredient').addEventListener('click', function () {
  const remaining = INGREDIENTS.filter(function (i) { return !added.includes(i); });
  if (!remaining.length) { recipe.innerHTML = CONCLUSION; return; }
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  added.push(pick);
  recipe.innerHTML = 'Fórmula actual: ' + added.map(function (a) { return '<b>' + a + '</b>'; }).join(', ') + '.<br>¿Un ingrediente más?';
  brewSound();
  /* La poción sube y cambia de tono con cada ingrediente */
  liquid.style.height = Math.min(85, 62 + added.length * 4) + '%';
  liquid.style.background = 'linear-gradient(180deg,hsl(' + (260 + added.length * 14) % 360 + ',70%,60%),hsl(' + (250 + added.length * 12) % 360 + ',75%,38%))';
  flashGlow();
});
document.getElementById('shake').addEventListener('click', function () {
  flacon.style.animation = 'none'; void flacon.offsetWidth;
  flacon.style.animation = 'shakeFx .7s ease, floaty 3.6s ease-in-out .7s infinite';
  brewSound();
  burstBubbles();
});
/* Keyframes de agitación inyectados */
const style = document.createElement('style');
style.textContent = '@keyframes shakeFx{0%,100%{transform:rotate(0)}15%{transform:rotate(-7deg) translateX(-4px)}30%{transform:rotate(6deg) translateX(4px)}45%{transform:rotate(-5deg)}60%{transform:rotate(4deg)}75%{transform:rotate(-2deg)}}';
document.head.appendChild(style);

function burstBubbles() {
  bubbles.forEach(function (b) {
    b.style.animationDuration = (1 + Math.random() * 1.2) + 's';
    setTimeout(function () { b.style.animationDuration = (2.2 + Math.random() * 2.6) + 's'; }, 2400);
  });
}
function flashGlow() {
  const glow = document.querySelector('.glow');
  glow.style.transition = 'background .3s';
  glow.style.background = 'radial-gradient(circle,rgba(255,255,255,.5),transparent 70%)';
  setTimeout(function () { glow.style.background = 'radial-gradient(circle,rgba(150,80,240,.3),transparent 70%)'; }, 350);
}
function brewSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(300, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(720, a.currentTime + .3);
    g.gain.setValueAtTime(.07, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .45);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .45);
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

