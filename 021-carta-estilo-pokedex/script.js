/* Carta Estilo Pokédex
 * Ficha interactiva tipo Pokédex: "stats", habilidades especiales y anotaciones del ser querido.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Pokédex personal: navega fichas del ser querido con stats y habilidades. */
'use strict';
const dexData = document.getElementById('dexData');
const dexButtons = document.getElementById('dexButtons');
const dexName = document.getElementById('dexName');
const dexNo = document.getElementById('dexNo');
const dexSprite = document.getElementById('dexSprite');

const ENTRIES = [
  {
    name: 'Tú', sprite: '🌟', no: 'Nº 001',
    stats: { 'Corazón': 100, 'Paciencia': 92, 'Humor': 98, 'Brillo': 100, 'Fuerza': 87 },
    type: 'Tipo: PERSONA INCREÍBLE',
    desc: 'Espécimen único en el universo. Su presencia eleva el ánimo de todos los que la rodean.',
    abilities: ['Abrazo Curativo — restaura el ánimo al instante', 'Risa Sonora — confunde a la tristeza', 'Escucha Infinita — anula cualquier tormenta']
  },
  {
    name: 'Tú (modo aventurero)', sprite: '🧭', no: 'Nº 002',
    stats: { 'Audacia': 95, 'Curiosidad': 100, 'Mapa interno': 40, 'Antojos': 88 },
    type: 'Tipo: EXPLORADORA/EXPLORADOR',
    desc: 'Convierte cualquier domingo aburrido en una epopeya. Nunca pierde el norte (casi).',
    abilities: ['Atajo Improvisado — llega antes que el GPS', 'Snack Eterno — nunca viaja sin provisiones']
  },
  {
    name: 'Tú (modo siesta)', sprite: '😴', no: 'Nº 003',
    stats: { 'Sueño': 100, 'Mimosidad': 99, 'Ronquidos': 30, 'Calma': 100 },
    type: 'Tipo: SERENIDAD PURA',
    desc: 'En este estado regenera toda su energía y la de quien la rodea.',
    abilities: ['Siesta Legendaria — recupera 100 PS del corazón', 'Calor de Mantita — entorno acogedor garantizado']
  }
];
let current = 0;

/* Barra de stats estilo juego */
function bar(label, val) {
  const filled = Math.round(val / 10);
  return label + ' '.repeat(Math.max(1, 12 - label.length)) + '[' + '█'.repeat(filled) + '░░'.slice(0, 10 - filled) + '] ' + val;
}
function render() {
  const e = ENTRIES[current];
  dexName.textContent = e.name;
  dexNo.textContent = e.no;
  dexSprite.textContent = e.sprite;
  dexData.textContent =
    e.type + '\n'
    + '--------------------------------\n'
    + Object.entries(e.stats).map(function (kv) { return bar(kv[0], kv[1]); }).join('\n')
    + '\n--------------------------------\n'
    + e.desc + '\n\n'
    + 'HABILIDADES ESPECIALES:\n'
    + e.abilities.map(function (a) { return '· ' + a; }).join('\n');
  dexData.style.animation = 'none'; void dexData.offsetWidth;
  dexData.style.animation = 'glitchIn .25s steps(3)';
}

/* Sonido de "bip" retro al navegar */
function beep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 660;
    g.gain.setValueAtTime(.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .18);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .18);
  } catch (e) { /* opcional */ }
}

/* Botones de navegación */
const labels = ['◀ Anterior', 'Sonido', 'Siguiente ▶'];
labels.forEach(function (label, i) {
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = label;
  if (i === 1) b.addEventListener('click', beep);
  else b.addEventListener('click', function () {
    current = (current + (i === 2 ? 1 : -1) + ENTRIES.length) % ENTRIES.length;
    beep(); render();
  });
  dexButtons.appendChild(b);
});

/* Estilo del glitch de refresco */
const style = document.createElement('style');
style.textContent = '@keyframes glitchIn{0%{transform:translateX(-4px);opacity:.3}50%{transform:translateX(3px)}100%{transform:none;opacity:1}}';
document.head.appendChild(style);
render();
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

