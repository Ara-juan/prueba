/* Periódico de Época "Daily Romance"
 * Periódico vintage con titular principal, columnas de noticias sobre ti y fotos en sepia.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Periódico de época: meteorología del corazón en vivo + titular interactivo. */
'use strict';
/* Barrómetro de cariño: se actualiza solo, siempre al alza */
const temps = ['🌡️ Cariño: en aumento', '🌡️ Cariño: por las nubes', '🌡️ Cariño: máximo histórico', '🌡️ Cariño: récord insuperable'];
let t = 0;
setInterval(function () {
  t = (t + 1) % temps.length;
  const el = document.querySelector('.weather span:nth-child(2)');
  if (el) el.textContent = temps[t];
}, 3000);

/* El titular reacciona al clic: edición "extra" con titulares alternativos */
const HEADLINES = [
  'PERSONA EXTRAORDINARIA SIGUE HACIENDO EL MUNDO MEJOR, CONFIRMAN FUENTES CERCANAS',
  'ÚLTIMA HORA: TU SONRISA CAUSA FELICIDAD MASIVA EN TODO EL BARRIO',
  'EDICIÓN ESPECIAL: NADA NUEVO QUE REPORTAR — SIGUES SIENDO INCREÍBLE',
  'PRÓXIMO PLURAL: "LOS MEJORES DÍAS" (TRADUCCIÓN: LOS QUE VENGAN CONTIGO)'
];
let h = 0;
const headline = document.querySelector('.headline h2');
headline.style.cursor = 'pointer';
headline.title = 'Haz clic para tirada extra';
headline.addEventListener('click', function () {
  h = (h + 1) % HEADLINES.length;
  headline.style.opacity = '0';
  headline.style.transition = 'opacity .25s';
  setTimeout(function () {
    headline.textContent = HEADLINES[h];
    headline.style.opacity = '1';
    press();
  }, 260);
});

function press() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 160;
    g.gain.setValueAtTime(.06, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .12);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .12);
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

