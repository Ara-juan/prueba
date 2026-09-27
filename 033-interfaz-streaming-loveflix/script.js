/* Interfaz Streaming "Loveflix"
 * Réplica de plataforma de streaming con "Tus momentos favoritos" y auto-reproducción del tráiler.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Loveflix: carrusel de momentos + modal de detalles + "tráiler" reproducido como zapping. */
'use strict';
const ITEMS = [
  ['🌅', 'El Primer Día', '2021', '97% coincide', 'Donde todo empezó: una mirada que duró dos segundos y una historia que aún no termina.', 'c1'],
  ['😂', 'La Risa Infinita', '2022', '100% coincide', 'Ese chiste interno que nadie más entiende y que nos hace llorar de risa.', 'c2'],
  ['🚗', 'Ruta Sin Destino', '2022', '95% coincide', 'Perderse fue la mejor parte del viaje. El destino: cualquier lugar contigo.', 'c3'],
  ['🍜', 'La Cita de Ramen', '2023', '99% coincide', 'Sopa humeante, conversación infinita y la certeza de estar exactamente donde debo.', 'c4'],
  ['🌧️', 'Bajo la Tormenta', '2023', '94% coincide', 'El día gris que se volvió dorado porque estábamos juntos.', 'c5'],
  ['✨', 'Próximo Capítulo', '2024', '101% coincide', 'Spoiler: todavía nos quedan los mejores momentos. Ya estoy contando los días.', 'c6']
];
const row = document.getElementById('row');
const modal = document.getElementById('modal');

ITEMS.forEach(function (it) {
  const card = document.createElement('article');
  card.className = 'card ' + it[5];
  card.innerHTML = (window.DEDIC && DEDIC.photo(ITEMS.indexOf(it))
    ? '<img src="' + DEDIC.photo(ITEMS.indexOf(it)) + '" alt="' + it[1] + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9">'
    : '<span class="emoji">' + it[0] + '</span>')
    + '<b>' + it[1] + '</b><span class="match">✔ ' + it[3] + '</span><span>' + it[2] + '</span>';
  card.addEventListener('click', function () {
    document.getElementById('modalTitle').textContent = it[0] + ' ' + it[1];
    document.getElementById('modalMatch').textContent = '✔ ' + it[3];
    document.getElementById('modalYear').textContent = it[2];
    document.getElementById('modalDesc').textContent = it[4];
    modal.classList.add('show');
  });
  row.appendChild(card);
});
document.getElementById('closeModal').addEventListener('click', function () { modal.classList.remove('show'); });
modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('show'); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.remove('show'); });

/* "Reproducir": efecto de zapping con destello y barra de progreso falsa */
document.getElementById('playBtn').addEventListener('click', function () {
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;transition:opacity .3s;z-index:30;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.2rem;letter-spacing:.2em';
  flash.textContent = 'REPRODUCIENDO: NOSOTROS — T1:E1 "EL COMIENZO"';
  document.body.appendChild(flash);
  requestAnimationFrame(function () { flash.style.opacity = '1'; });
  setTimeout(function () { flash.style.opacity = '0'; }, 1400);
  setTimeout(function () { flash.remove(); }, 1800);
  whoosh();
});
function whoosh() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC();
    const len = a.sampleRate * .6;
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.setValueAtTime(300, a.currentTime);
    f.frequency.exponentialRampToValueAtTime(2600, a.currentTime + .5);
    const g = a.createGain(); g.gain.value = .18;
    src.connect(f).connect(g).connect(a.destination); src.start();
  } catch (e) { /* opcional */ }
}
document.getElementById('infoBtn').addEventListener('click', function () {
  modal.classList.add('show');
  document.getElementById('modalTitle').textContent = 'Nosotros: La Serie';
  document.getElementById('modalMatch').textContent = '✔ 100% para ti';
  document.getElementById('modalYear').textContent = 'En emisión';
  document.getElementById('modalDesc').textContent = 'Documental íntimo sobre la persona más increíble que conozco. Crítica especializada (yo): "Una obra maestra. Se recomienda ver a diario."';
});
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

