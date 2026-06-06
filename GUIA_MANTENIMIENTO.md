# Guía de Mantenimiento — Andina Web Studio
> Actualizado: Abril 2026 · Para usar sin ayuda externa

---

## 📁 ARCHIVOS DEL PROYECTO

```
raíz del proyecto/
├── index.html          ← Página principal
├── proyectos.html      ← Página de portafolio
├── css/styles.css      ← Estilos
├── js/main.js          ← Scripts
├── abstract_blue_black.json  ← Animación Lottie
├── track1.mp3          ← Always — DISTRXCT
├── track2.mp3          ← Stylish Lifestyle — Dope Cat
└── [imágenes .webp]
```

---

## 🎵 CAMBIAR LA MÚSICA

1. Descarga en **uppbeat.io** formato MP3
2. Renómbrala `track1.mp3` o `track2.mp3`
3. Para cambiar el nombre en el vinilo, busca en `main.js`:

```js
var tracks = [
  { src: 'track1.mp3', title: 'Always — DISTRXCT' },
  { src: 'track2.mp3', title: 'Stylish Lifestyle — Dope Cat' },
];
```

---

## 🎨 CAMBIAR LA ANIMACIÓN LOTTIE

1. Descarga en **lottiefiles.com** → formato JSON
2. Renómbrala `abstract_blue_black.json`
3. Reemplaza en la raíz del proyecto

---

## ⭐ AGREGAR UNA RESEÑA

1. Abre `main.js`, busca `var reviews = [` y agrega antes del `];`:

```js
{ quote: 'Texto.', name: 'Nombre', role: 'Ciudad · País', avatar: 'N', color: '#1a3550' },
```

2. En `index.html` busca `/10` y cámbialo por `/11`

---

## 🎬 AGREGAR UN PROYECTO AL PORTAFOLIO (proyectos.html)

**Patrón del layout — solo cambia esta clase:**
- Primer proyecto del grupo → `pf-card pf-card-featured` (grande)
- Segundo y tercero → `pf-card pf-card-sm` (pequeño)

```
07 grande → 08 pequeño → 09 pequeño
10 grande → 11 pequeño → 12 pequeño
```

**Bloque a copiar:**
```html
<a class="pf-card pf-card-sm" href="URL" target="_blank" rel="noopener">
  <video class="pf-card-bg" src="URL-cloudinary.mp4" autoplay muted loop playsinline></video>
  <div class="pf-card-ol"></div>
  <div class="pf-card-info">
    <div class="pf-card-n">07 — Categoría</div>
    <div class="pf-card-t">Nombre del proyecto</div>
    <div class="pf-card-tgs">
      <span class="pf-tag">Tag 1</span>
      <span class="pf-tag">Tag 2</span>
    </div>
  </div>
</a>
```

**Para subir videos:**
1. Graba el sitio scrolleando (8-12 segundos)
2. Sube en **cloudinary.com** → copia la URL → pégala en `src=""`

---

## 💰 CAMBIAR UN PRECIO

Busca el nombre del plan en `index.html` con Ctrl+F y edita el número.

---

## 🌐 SUBIR CAMBIOS A NETLIFY

```bash
git add .
git commit -m "descripción"
git push
```

Netlify despliega en 1-2 minutos automáticamente.

---

## 📌 DATOS IMPORTANTES

| Dato | Valor |
|---|---|
| Email | andinawebstudio@proton.me |
| WhatsApp | +593 989 565 924 |
| Instagram | @andinawebstudio |
| Web3Forms key | 4c7fd320-3da0-4f20-9873-b6099bead9b1 |
| Google Maps | https://maps.app.goo.gl/EPCDFseZJcTnPi177 |
| Cloudinary | dvukaadvx |
| Uppbeat licencia | G4TB5ORJYYZDMFJC |

---

## 🚨 REGLAS DE ORO

1. Nunca edites sin hacer copia antes
2. Verifica en el navegador antes de subir
3. Imágenes siempre en WebP
4. Videos siempre via Cloudinary
5. Si algo se rompe → vuelve a la última versión en GitHub
