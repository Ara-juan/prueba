'use strict';
(function () {
  /* ===== DEDIC · personalización de dedicatorias (URL + localStorage + fotos) ===== */
  var qs = {};
  try { new URLSearchParams(location.search).forEach(function (v, k) { qs[k] = v; }); } catch (e) { /* sin parámetros */ }
  var store = {};
  try { store = JSON.parse(localStorage.getItem('dedic_datos') || '{}') || {}; } catch (e) { store = {}; }
  var photos = [];
  try { photos = JSON.parse(localStorage.getItem('dedic_fotos') || '[]') || []; } catch (e) { photos = []; }
  var ACCENT = '#ff6f9c';
  var D = {
    para: qs.para || store.para || 'Ti',
    de: qs.de || store.de || 'Quien te quiere',
    fecha: qs.fecha || store.fecha || '',
    msg: qs.msg || store.msg || '',
    shared: !!(qs.para || qs.de || qs.fecha || qs.msg),
    photos: function () { return photos.slice(); },
    photo: function (i) {
      if (!photos.length) return null;
      var idx = ((i || 0) % photos.length + photos.length) % photos.length;
      return photos[idx];
    },
    save: function (obj) {
      if (obj.para) store.para = obj.para;
      if (obj.de) store.de = obj.de;
      if (obj.fecha) store.fecha = obj.fecha;
      if (obj.msg) store.msg = obj.msg;
      try { localStorage.setItem('dedic_datos', JSON.stringify(store)); } catch (e) { /* modo privado */ }
    },
    savePhotos: function (arr) {
      photos = arr.slice(0, 6);
      try { localStorage.setItem('dedic_fotos', JSON.stringify(photos)); } catch (e) { /* modo privado */ }
    },
    buildLink: function () {
      var parts = [];
      if (qs.para || store.para) parts.push('para=' + encodeURIComponent(qs.para || store.para));
      if (qs.de || store.de) parts.push('de=' + encodeURIComponent(qs.de || store.de));
      if (qs.fecha || store.fecha) parts.push('fecha=' + encodeURIComponent(qs.fecha || store.fecha));
      if (qs.msg || store.msg) parts.push('msg=' + encodeURIComponent(qs.msg || store.msg));
      var query = parts.length ? '?' + parts.join('&') : '';
      if (location.protocol === 'file:' || !location.origin || location.origin === 'null') {
        return location.pathname.split('/').pop() + query;   // funciona también compartiendo el archivo
      }
      return location.origin + location.pathname + query;
    },
    resetAll: function () {
      try { localStorage.removeItem('dedic_datos'); localStorage.removeItem('dedic_fotos'); } catch (e) { /* noop */ }
    }
  };
  window.DEDIC = D;

  /* ---------- Utilidades ---------- */
  function el(tag, style, text) {
    var n = document.createElement(tag);
    n.style.cssText = style || '';
    if (text) n.textContent = text;
    return n;
  }
  function escapeHTML(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function toast(text) {
    var t = el('div', 'position:fixed;left:50%;bottom:66px;transform:translateX(-50%);background:' + ACCENT + ';color:#fff;padding:9px 18px;border-radius:999px;font-size:.8rem;z-index:100000;box-shadow:0 10px 26px rgba(0,0,0,.35);font-family:Georgia,serif', text);
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2400);
  }
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).catch(function () { fallbackCopy(t); });
    } else { fallbackCopy(t); }
  }
  function fallbackCopy(t) {
    var ta = document.createElement('textarea');
    ta.value = t;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* sin permiso */ }
    ta.remove();
  }
  /* Reduce y comprime una foto elegida por el usuario para guardarla en localStorage */
  function shrink(file, cb) {
    var img = new Image();
    img.onload = function () {
      var max = 900;
      var s = Math.min(1, max / Math.max(img.width, img.height));
      var c = document.createElement('canvas');
      c.width = Math.max(1, Math.round(img.width * s));
      c.height = Math.max(1, Math.round(img.height * s));
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      cb(c.toDataURL('image/jpeg', .82));
    };
    img.src = URL.createObjectURL(file);
  }

  /* ---------- Chip flotante + panel editor ---------- */
  var root = el('div', 'position:fixed;right:14px;bottom:14px;z-index:99999;font-family:Georgia,serif');
  var chip = el('button', 'width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(24,20,32,.85);color:' + ACCENT + ';font-size:1.05rem;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.35)', '💌');
  chip.title = 'Personalizar dedicatoria';
  chip.setAttribute('aria-label', 'Personalizar dedicatoria');
  root.appendChild(chip);

  var panel = el('div', 'display:none;width:250px;margin-top:10px;background:rgba(24,20,32,.96);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:14px;color:#f4eef8;box-shadow:0 20px 50px rgba(0,0,0,.5)');
  var inputStyle = "width:100%;box-sizing:border-box;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);border-radius:8px;color:#fff;padding:7px 9px;font-size:.85rem";
  var labelStyle = "display:block;font-size:.68rem;opacity:.75;margin:6px 0 2px";
  panel.innerHTML =
    '<b style="display:block;margin-bottom:4px;font-size:.9rem">💌 Personalizar dedicatoria</b>'
    + '<label style="' + labelStyle + '">Para</label><input data-k="para" placeholder="Su nombre" style="' + inputStyle + '">'
    + '<label style="' + labelStyle + '">De</label><input data-k="de" placeholder="Tu nombre" style="' + inputStyle + '">'
    + '<label style="' + labelStyle + '">Fecha (opcional)</label><input data-k="fecha" placeholder="14 · 02 · 2026" style="' + inputStyle + '">'
    + '<label style="' + labelStyle + '">Mensaje (opcional)</label><input data-k="msg" placeholder="Una frase especial…" style="' + inputStyle + '">'
    + '<label style="' + labelStyle + 'margin-top:10px;cursor:pointer">📷 Añadir fotos (máx. 6)<input type="file" accept="image/*" multiple data-fotos style="display:none"></label>'
    + '<span data-count style="display:block;font-size:.68rem;opacity:.7;min-height:1em"></span>'
    + '<div style="display:flex;gap:6px;margin-top:8px">'
    + '<button data-save style="flex:1;background:' + ACCENT + ';border:none;border-radius:8px;color:#fff;padding:8px 6px;font-size:.78rem;cursor:pointer">Guardar</button>'
    + '<button data-link style="flex:1;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:8px;color:#fff;padding:8px 6px;font-size:.78rem;cursor:pointer">Link 🔗</button>'
    + '</div>'
    + '<div style="display:flex;gap:10px;margin-top:6px;justify-content:space-between">'
    + '<button data-clear style="background:none;border:none;color:#c9a0b0;font-size:.68rem;cursor:pointer;text-decoration:underline;padding:0">Borrar datos</button>'
    + '<button data-close style="background:none;border:none;color:#9a97ad;font-size:.68rem;cursor:pointer;padding:0">Cerrar ✕</button>'
    + '</div>'
  ;
  root.appendChild(panel);
  document.body.appendChild(root);

  /* Precarga los valores actuales (los por defecto se muestran vacíos) */
  var DEFAULTS = { para: 'Ti', de: 'Quien te quiere', fecha: '', msg: '' };
  panel.querySelectorAll('input[data-k]').forEach(function (inp) {
    var val = D[inp.dataset.k] || '';
    inp.value = (val === DEFAULTS[inp.dataset.k]) ? '' : val;
  });
  if (photos.length) panel.querySelector('[data-count]').textContent = photos.length + ' foto(s) cargada(s) ✓';

  panel.querySelector('[data-close]').addEventListener('click', function () { panel.style.display = 'none'; });
  chip.addEventListener('click', function () {
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
  });

  /* Fotos: leer, comprimir y guardar */
  var fotosInput = panel.querySelector('[data-fotos]');
  var countEl = panel.querySelector('[data-count]');
  fotosInput.addEventListener('change', function () {
    var files = Array.prototype.slice.call(fotosInput.files || []);
    if (!files.length) return;
    var processed = [];
    var pend = files.length;
    files.forEach(function (file) {
      shrink(file, function (dataURL) {
        processed.push(dataURL);
        pend--;
        if (!pend) {
          D.savePhotos(processed);
          countEl.textContent = processed.length + ' foto(s) lista(s) ✓';
          fotosInput.value = '';
        }
      });
    });
  });

  /* Guardar (localStorage + recarga) */
  panel.querySelector('[data-save]').addEventListener('click', function () {
    var obj = {};
    panel.querySelectorAll('input[data-k]').forEach(function (inp) {
      if (inp.value.trim()) obj[inp.dataset.k] = inp.value.trim();
    });
    D.save(obj);
    toast('Guardado ✓ recargando…');
    setTimeout(function () { location.reload(); }, 500);
  });

  /* Generar y copiar el link compartible */
  panel.querySelector('[data-link]').addEventListener('click', function () {
    var obj = {};
    panel.querySelectorAll('input[data-k]').forEach(function (inp) {
      if (inp.value.trim()) obj[inp.dataset.k] = inp.value.trim();
    });
    D.save(obj);
    var url = D.buildLink();
    copyText(url);
    toast('Link copiado ✓');
  });

  panel.querySelector('[data-clear]').addEventListener('click', function () {
    D.resetAll();
    toast('Datos borrados · recargando…');
    setTimeout(function () { location.reload(); }, 500);
  });

  /* Aviso elegante cuando la página llega de un link compartido */
  if (D.shared) {
    var info = el('div', 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);background:rgba(24,20,32,.9);border:1px solid rgba(255,255,255,.18);color:#f4eef8;border-radius:999px;padding:8px 16px;font-size:.78rem;z-index:99998;display:flex;gap:10px;align-items:center;font-family:Georgia,serif');
    info.innerHTML = '<span>💌 Para <b style="color:' + ACCENT + '">' + escapeHTML(D.para) + '</b> · de ' + escapeHTML(D.de) + '</span>';
    var closeBtn = el('button', 'background:none;border:none;color:#9a97ad;cursor:pointer;font-size:.8rem;padding:0', '✕');
    closeBtn.setAttribute('aria-label', 'Cerrar aviso');
    closeBtn.addEventListener('click', function () { info.remove(); });
    info.appendChild(closeBtn);
    document.body.appendChild(info);
  }
})();