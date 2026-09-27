/* Carta de Coctelería (Cita Especial)
 * Invitación formato carta de cócteles: bebidas personalizadas con los ingredientes de nuestra cita.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Carta de coctelería: cada cóctel es una propuesta de cita; pedir muestra la invitación. */
'use strict';
const COCKTAILS = [
  ['🍸', 'Martini "Primera Vez"', 'ginebra de nervios bonitos · una oliva de curiosidad · hielo de "¿y si…?"', '1 cita'],
  ['🍹', 'Sunset Contigo', 'ron dorado de risas · zumo de atardecer · granadina de descaro sano', '1 tarde'],
  ['🥂', 'Burbujas de Celebración', 'espumoso de logros · pulpa de orgullo ajeno · twist de "lo logramos"', 'siempre'],
  ['🌶️', 'Spicy "Tú y Yo"', 'tequila de aventuras · chile de química obvia · limón de complicidad', '1 noche'],
  ['☕', 'Carajillo de Madrugada', 'espresso doble de confidencias · licor de "una más y nos vamos" · hielo eterno', '3:00 a.m.']
];
const menu = document.getElementById('menu');
const orderNote = document.getElementById('orderNote');
let ordered = 0;

COCKTAILS.forEach(function (c) {
  const el = document.createElement('div');
  el.className = 'cocktail';
  el.innerHTML = '<span class="glass">' + c[0] + '</span><div class="info"><h2>' + c[1] + '</h2><div class="ing">' + c[2] + '</div></div><span class="price">♥ ' + c[3] + '</span>';
  el.addEventListener('click', function () {
    ordered++;
    orderNote.innerHTML = 'Excelente elección. El bartender (yo) confirma tu pedido: <b>' + c[1] + '</b> servido en la mesa de siempre.<br>Tu cita queda reservada para el momento en que digas "vamos". 🥂';
    orderNote.classList.add('show');
    pourSound();
  });
  menu.appendChild(el);
});
function pourSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .5;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      /* Líquido sirviéndose: burbujeo ascendente */
      const env = Math.min(1, i / (len * .2)) * (1 - i / len);
      d[i] = Math.sin(i * (.08 + i / len * .2)) * env * .6 + (Math.random() * 2 - 1) * env * .15;
    }
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1600;
    const g = a.createGain(); g.gain.value = .18;
    src.connect(f).connect(g).connect(a.destination); src.start();
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

