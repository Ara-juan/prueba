/* Windows 95 de Recuerdos
 * Escritorio retro: ventanas arrastrables, Bloc de notas con la carta y errores llenos de corazones.
 * Lógica interactiva en Vanilla JS — comentada y funcional.
 */
'use strict';
/* Windows 95: gestor de ventanas retro con arrastre, minimizar y pop-ups de corazones. */
'use strict';
const desktop = document.getElementById('desktop');
const tasksEl = document.getElementById('tasks');
let zTop = 10;

const CONTENT = {
  letter: { title: 'Carta.txt - Bloc de notas', icon: '📄', body: '<div class="win-body notepad">QUERIDA PERSONA:\n\nBienvenido/a a tu sistema operativo de recuerdos.\nTodo funciona correctamente, salvo\n\nError Cariño.exe:\nno se puede dejar de pensar en ti.\n\nAtentamente,\nEl Administrador de tu Corazón</div>' },
  love: { title: 'Amor.exe', icon: '💖', body: '<div class="win-body"><div class="heart-error"><span class="big">💖</span><div><b>Amor.exe ha detectado un sentimiento muy potente.</b><br><br>Diagnóstico: incurable y mutuo.<br>Recomendación: no actualizar. Disfrutar.</div></div><div class="err-actions"><button data-close>Aceptar</button><button data-heart>Lanzar corazones</button></div></div>' },
  error: { title: 'Error.Cariño', icon: '⚠️', body: '<div class="win-body"><div class="heart-error"><span class="big">⚠️</span><div><b>ERROR 404: MALOS DÍAS NO ENCONTRADOS.</b><br><br>El sistema intentó cargar un día gris… pero tu sonrisa lo bloqueó por seguridad.</div></div><div class="err-actions"><button data-close>Aceptar</button><button data-close>Reintentar (fallará igual)</button></div></div>' },
  trash: { title: 'Papelera: Días Malos (vacía)', icon: '🗑️', body: '<div class="win-body">La papelera está vacía. Los días malos se eliminaron definitivamente en cuanto apareciste tú. 🗑️✨<br><br><i>¿Vaciar más días malos?</i><div class="err-actions"><button data-close>Cerrar</button></div></div>' }
};
const openWins = {};

function openWin(key) {
  if (openWins[key]) { focusWin(openWins[key], key); return; }
  const c = CONTENT[key];
  const win = document.createElement('div');
  win.className = 'win';
  win.style.left = (90 + Math.random() * 60) + 'px';
  win.style.top = (60 + Math.random() * 80) + 'px';
  win.style.zIndex = ++zTop;
  win.innerHTML = '<div class="titlebar"><span>' + c.icon + ' ' + c.title + '</span><span class="btns"><button data-min>_</button><button data-close>✕</button></span></div>' + c.body;
  desktop.appendChild(win);
  openWins[key] = win;
  /* Tarea en la barra */
  const task = document.createElement('button');
  task.className = 'task active';
  task.textContent = c.title.split(' ')[0];
  task.addEventListener('click', function () {
    if (win.classList.contains('min')) { win.classList.remove('min'); task.classList.add('active'); }
    else { win.classList.add('min'); task.classList.remove('active'); }
  });
  tasksEl.appendChild(task);
  win._task = task;
  /* Arrastrar ventana */
  const tbar = win.querySelector('.titlebar');
  let drag = null;
  tbar.addEventListener('pointerdown', function (e) {
    drag = { dx: e.clientX - win.offsetLeft, dy: e.clientY - win.offsetTop };
    focusWin(win, key);
  });
  addEventListener('pointermove', function (e) {
    if (!drag) return;
    win.style.left = (e.clientX - drag.dx) + 'px';
    win.style.top = Math.max(0, e.clientY - drag.dy) + 'px';
  });
  addEventListener('pointerup', function () { drag = null; });
  tbar.addEventListener('dblclick', function () { win.classList.add('min'); task.classList.remove('active'); });
  win.querySelector('[data-min]').addEventListener('click', function () { win.classList.add('min'); task.classList.remove('active'); });
  win.querySelector('[data-close]').addEventListener('click', function () {
    win.remove(); task.remove(); delete openWins[key];
    beep(220);
  });
  win.querySelectorAll('[data-heart]').forEach(function (b) {
    b.addEventListener('click', function () { heartStorm(); beep(880); });
  });
  win.querySelectorAll('[data-close].err-actions button, .err-actions button').forEach(function (b) {
    if (b.textContent.includes('Aceptar') || b.textContent.includes('Reintentar')) {
      b.addEventListener('click', function () { shake(win); beep(160); });
    }
  });
  focusWin(win, key);
  beep(660);
}
function focusWin(win, key) {
  win.style.zIndex = ++zTop;
  Object.keys(openWins).forEach(function (k) {
    if (openWins[k]._task) openWins[k]._task.classList.toggle('active', k === key);
  });
}
function shake(win) {
  win.style.transition = 'transform .06s';
  let n = 0;
  const iv = setInterval(function () {
    win.style.transform = 'translateX(' + (n % 2 ? 4 : -4) + 'px)';
    if (++n > 5) { clearInterval(iv); win.style.transform = ''; }
  }, 60);
}
/* Tormenta de corazones estilo 95 */
function heartStorm() {
  for (let i = 0; i < 26; i++) {
    const h = document.createElement('div');
    h.textContent = Math.random() < .5 ? '💖' : '♥';
    h.style.cssText = 'position:fixed;font-size:' + (14 + Math.random() * 20) + 'px;z-index:999;pointer-events:none;left:' + (Math.random() * innerWidth) + 'px;top:' + (innerHeight + 30) + 'px;transition:transform ' + (1.6 + Math.random()) + 's linear,opacity 1.6s';
    document.body.appendChild(h);
    requestAnimationFrame(function () {
      h.style.transform = 'translateY(-' + (innerHeight + 120) + 'px) rotate(' + ((Math.random() - .5) * 60) + 'deg)';
      h.style.opacity = '0';
    });
    setTimeout(function () { h.remove(); }, 2800);
  }
}
/* Botón inicio: menú simple */
const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  let menu = document.getElementById('startMenu');
  if (menu) { menu.remove(); return; }
  menu = document.createElement('div');
  menu.id = 'startMenu';
  menu.style.cssText = 'position:absolute;left:4px;bottom:38px;background:var(--gray);border-top:3px solid #fff;border-left:3px solid #fff;border-right:3px solid #404040;border-bottom:3px solid #404040;z-index:200;min-width:190px;padding:3px';
  menu.innerHTML = ['letter|📄 Carta.txt', 'love|💖 Amor.exe', 'error|⚠️ Error.Cariño', 'trash|🗑️ Días Malos'].map(function (i) {
    const p = i.split('|');
    return '<div class="mi" data-k="' + p[0] + '" style="padding:8px 14px;cursor:pointer">' + p[1] + '</div>';
  }).join('');
  desktop.appendChild(menu);
  menu.querySelectorAll('.mi').forEach(function (mi) {
    mi.addEventListener('click', function () { openWin(mi.dataset.k); menu.remove(); });
    mi.addEventListener('mouseenter', function () { mi.style.background = 'var(--navy)'; mi.style.color = '#fff'; });
    mi.addEventListener('mouseleave', function () { mi.style.background = ''; mi.style.color = ''; });
  });
});
document.addEventListener('click', function (e) {
  const menu = document.getElementById('startMenu');
  if (menu && !menu.contains(e.target) && e.target !== startBtn) menu.remove();
});
document.querySelectorAll('.icon').forEach(function (ic) {
  ic.addEventListener('click', function () { openWin(ic.dataset.win); });
});
function beep(freq) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const a = new AC(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(.04, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .12);
    o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + .12);
  } catch (e) { /* opcional */ }
}
/* Reloj de la barra */
setInterval(function () {
  const d = new Date();
  document.getElementById('clock').textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}, 1000);
/* Arranque clásico: una ventana de bienvenida */
setTimeout(function () { openWin('letter'); }, 600);
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

