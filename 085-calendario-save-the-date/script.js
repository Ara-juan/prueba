/* Calendario Save the Date
 * Mes del evento: el día clave brilla y al pulsarlo despliega el itinerario completo.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Calendario: genera el mes, marca el día del evento y despliega el itinerario. */
'use strict';
const YEAR = 2026, MONTH = 1, EVENT_DAY = 14;         // febrero 2026, día 14
const daysEl = document.getElementById('days');
const itinerary = document.getElementById('itinerary');

function buildMonth() {
  daysEl.innerHTML = '';
  const first = new Date(YEAR, MONTH, 1);
  const offset = first.getDay();                      // 0 domingo
  const total = new Date(YEAR, MONTH + 1, 0).getDate();
  const prevTotal = new Date(YEAR, MONTH, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear() === YEAR && today.getMonth() === MONTH;
  /* Días del mes anterior */
  for (let i = offset - 1; i >= 0; i--) {
    const b = document.createElement('button');
    b.className = 'day other';
    b.textContent = prevTotal - i;
    b.disabled = true;
    daysEl.appendChild(b);
  }
  /* Días del mes */
  for (let d = 1; d <= total; d++) {
    const b = document.createElement('button');
    b.className = 'day';
    b.textContent = d;
    if (isThisMonth && d === today.getDate()) b.classList.add('today');
    if (d === EVENT_DAY) {
      b.classList.add('event');
      b.title = '¡El gran día! Pulsa para ver el itinerario';
      b.addEventListener('click', function () {
        itinerary.classList.toggle('open');
        chime();
      });
    }
    daysEl.appendChild(b);
  }
  /* Relleno final */
  const rest = (7 - (offset + total) % 7) % 7;
  for (let d = 1; d <= rest; d++) {
    const b = document.createElement('button');
    b.className = 'day other';
    b.textContent = d;
    b.disabled = true;
    daysEl.appendChild(b);
  }
}
buildMonth();

/* Clic en cualquier día normal: comentario dulce */
daysEl.addEventListener('click', function (e) {
  const t = e.target;
  if (t.classList.contains('day') && !t.classList.contains('event') && !t.classList.contains('other')) {
    toast('📅 El ' + t.textContent + ' también cuenta: todos los días son buenos para acordarte de lo mucho que vales.');
  }
});
function toast(text) {
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = 'position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(16px);background:#3a342a;color:#fdfaf4;padding:11px 20px;border-radius:999px;font-size:.82rem;opacity:0;transition:.35s;z-index:60;max-width:88vw;text-align:center';
  document.body.appendChild(el);
  requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateX(-50%)'; });
  setTimeout(function () { el.style.opacity = '0'; }, 2800);
  setTimeout(function () { el.remove(); }, 3300);
}
function chime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'sine'; o.frequency.value = 660;
    g.gain.setValueAtTime(.06, a.currentTime);
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

