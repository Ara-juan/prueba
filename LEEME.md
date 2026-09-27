# 💌 Plantillas Dedicatorias Web

100 experiencias interactivas (HTML + CSS + JavaScript puro, sin frameworks ni build)
para dedicar a alguien especial. Cada carpeta es una plantilla autónoma.

## 🚀 Cómo verlas

**Opción 1 — Galería (recomendado):** abre `index.html` (este archivo está aquí mismo).
Muestra las 100 plantillas por categoría y trae un **editor de dedicatoria**.

**Opción 2 — Directo:** abre el `index.html` de cualquier subcarpeta con doble clic.

## 💌 Personalización (lo nuevo)

Todas las plantillas comparten el módulo `dedic.js`:

1. **Editor flotante** — pulsa el chip 💌 (abajo a la derecha) en cualquier plantilla:
   escribe *Para / De / Fecha / Mensaje*, añade hasta **6 fotos** (se comprimen solas)
   y guarda. Se recuerda en ese navegador.

2. **Links compartibles** — el botón **Link 🔗** genera una URL como:

   ```
   064-ventana-sistema-windows-95/index.html?para=Sof%C3%ADa&de=Diego&fecha=14%20%C2%B7%2002&msg=Nuestro%20aniversario
   ```

   Quien la abra verá la dedicatoria con esos datos y un aviso elegante:
   *"💌 Para **Sofía** · de Diego"*.

3. **Editor global en la galería** — rellena el formulario del índice y pulsa
   "🔗 personalizar" en cualquier tarjeta: abre la plantilla ya personalizada
   y copia el link al portapapeles.

   Las plantillas que **usan el nombre/fotos** de forma especial:
   `032` boleto (nombre+fecha), `033` Loveflix (fotos en las tarjetas),
   `063` Polaroid (imprime tus fotos), `091` botón escurridizo (nombre en la pregunta),
   `096` rompecabezas (tu foto como puzzle), `100` test (nombre en el resultado).

## 🎨 Extras profesionales incluidos

- Tipografía **Cormorant Garamond + Caveat** (CDN con `preconnect`, `display=swap`).
- **Favicon** embebido (data URI, sin 404) y **Open Graph tags** para previews en redes.
- Canvas **HiDPI/Retina** (nítidos, con `devicePixelRatio`).
- Las animaciones se **pausan** con la pestaña en segundo plano.
- Accesibilidad: `prefers-reduced-motion`, `:focus-visible`, `aria-label`.
- Audio 100% generado con **Web Audio API** (se activa con el primer clic, por política de navegadores).

## 🛠️ Regenerar con tus propios textos

El generador vive en `../tools/generator/`:

```bash
node tools/generator/build.js     # regenera las 100 plantillas
node tools/generator/gallery.js   # regenera la galería índice
```

Edita frases y nombres dentro de `tools/generator/tXXX_YYY.js` y vuelve a ejecutar.
`fix-escapes.js` es una utilidad de mantenimiento (no hace falta ejecutarla).
