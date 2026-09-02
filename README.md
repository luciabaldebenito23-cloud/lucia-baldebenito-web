# Lucía Baldebenito — Sitio web (Corretaje + LB Consultora)

Sitio de una sola página (SPA por anclas) construido en HTML5 + CSS3 + JavaScript vanilla, siguiendo el Manual de Identidad de Marca v1.0 (agosto 2026).

## Estructura de carpetas

```
lucia-baldebenito/
├── index.html              → Toda la maquetación y el copy, en un solo archivo
├── css/
│   └── styles.css          → Variables de marca, estilos y responsive (mobile-first)
├── js/
│   └── script.js           → Menú móvil, filtros, validación de formularios
├── fonts/                  → Hello Paris Sans autohospedada (5 pesos, .woff2)
├── blog/                   → Artículos completos del blog (páginas propias, enlazadas desde #blog)
│   ├── alquilar-o-vender.html
│   ├── como-se-calcula-el-valor.html
│   └── autogestionar-tu-alquiler.html
├── propiedades/            → Ficha completa de cada propiedad (fotos, video, m², mapa, descripción)
│   ├── casa-general-mosconi.html
│   ├── depto-palazzo.html
│   ├── casa-rada-tilly.html
│   ├── casa-km8.html
│   ├── casa-stella-maris.html
│   └── depto-km3.html
├── img/
│   ├── propiedades/        → Fotos reales de propiedades (ver README.txt adentro)
│   └── blog/                → Fotos de portada de artículos (ver README.txt adentro)
└── README.md                → Este archivo
```

Es la estructura recomendada para cualquier hosting estático (GitHub Pages, Netlify, Vercel, etc.) sin necesidad de build ni backend.

## Notas de marca importantes

- **Tipografía de títulos**: *Hello Paris Sans* (Sans&Sons ©2019, con licencia), autohospedada vía `@font-face` en `styles.css` — los 5 pesos (ExtraLight a Bold) están en `fonts/` como `.woff2`. Por diseño, se usa solo en H1/H2 (títulos grandes de sección) y en el isotipo circular "Lb": es una tipografía editorial con mayúsculas y una "e" muy estilizadas, pensada para lucirse en titulares grandes, no para texto funcional chico. Por eso H3/H4 (nombres de propiedades, planes, servicios, notas de blog), precios y las citas de testimonios usan Inter — si se aplicara Hello Paris Sans ahí, a esos tamaños se vuelve difícil de leer rápido (lo comprobamos renderizando el sitio antes de decidirlo). El wordmark del header/footer también usa Inter en negrita por el mismo motivo de legibilidad en un elemento que se repite en cada página.
- **Cuerpo de texto**: Inter (exacta al manual), cargada desde Google Fonts.
- **Paleta**: las 4 variables de color (`--color-navy`, `--color-purple`, `--color-turquoise`, `--color-silver`) están al principio de `styles.css` con los HEX exactos del manual. El púrpura se usa solo en piezas de Corretaje/Propiedades y el turquesa solo en la sección de LB Consultora, respetando la regla de "un diferenciador por línea de negocio".
- **Imágenes**: todas las fotos están como placeholders con degradé de marca (`.img-placeholder`) para que el sitio funcione y se vea prolijo desde el primer momento. Reemplazalas por el book fotográfico real (luz natural, espacios reales, primera persona) apenas lo tengas — están señaladas con comentarios en el HTML.
- **Google Maps**: la sección de Contacto tiene un `div#mapPlaceholder` listo para reemplazar por un iframe o el SDK de Google Maps API cuando tengas la API key.

## Formularios

Los formularios de Tasación y Contacto validan en el navegador (campos obligatorios, formato de email y teléfono) y **ya están conectados** a [FormSubmit.co](https://formsubmit.co), un servicio de formulario-a-email para sitios estáticos que no requiere backend propio ni cuenta: cada envío llega directo a `inmobiliarialb.cr@gmail.com`.

- La primera vez que alguien complete un formulario, FormSubmit manda un mail a esa casilla pidiendo confirmarla — hay que clickear el link una sola vez para activar el envío automático de ahí en más.
- El destino está definido en el atributo `action` de cada `<form>` en `index.html` (`https://formsubmit.co/inmobiliarialb.cr@gmail.com`). Para cambiar el mail de destino, se edita ese `action` en los dos formularios.
- El envío real ocurre en `handleFormSubmit()` dentro de `script.js`, vía `fetch()` con `Accept: application/json` (así se evita la página intermedia de FormSubmit y se mantiene la experiencia de éxito/error propia del sitio).
- Si el envío falla (por ejemplo, sin conexión), se muestra un mensaje de error con un link directo a WhatsApp como alternativa.

## Cómo probarlo localmente

No necesitás instalar nada. Con Python instalado, desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

Y abrí `http://localhost:8000` en el navegador.

---

## Guía paso a paso: publicar el sitio gratis

### Opción A — GitHub Pages

1. Creá una cuenta en [github.com](https://github.com) si no tenés una.
2. Creá un repositorio nuevo (por ejemplo `lucia-baldebenito-web`), público.
3. Subí los archivos de esta carpeta al repositorio:
   - Con GitHub Desktop, o
   - Por línea de comandos:
     ```bash
     cd lucia-baldebenito
     git init
     git add .
     git commit -m "Sitio web Lucía Baldebenito"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/lucia-baldebenito-web.git
     git push -u origin main
     ```
4. En GitHub, entrá al repositorio → **Settings** → **Pages** (menú lateral).
5. En "Build and deployment" → **Source**, elegí **Deploy from a branch**.
6. En **Branch**, elegí `main` y la carpeta `/ (root)` → **Save**.
7. Esperá 1-2 minutos. GitHub te va a dar una URL del estilo `https://tu-usuario.github.io/lucia-baldebenito-web/`.
8. (Opcional) Si comprás un dominio propio (ej. `luciabaldebenito.com`), configurá un registro CNAME apuntando a `tu-usuario.github.io` y cargá el dominio en la misma pantalla de **Pages**.

### Opción B — Netlify (más simple, con formularios integrados)

1. Creá una cuenta gratis en [netlify.com](https://netlify.com).
2. Desde el panel, elegí **Add new site → Deploy manually**.
3. Arrastrá la carpeta `lucia-baldebenito` completa (o comprimida en `.zip`) al recuadro de subida.
4. En segundos, Netlify publica el sitio y te da una URL del tipo `https://nombre-al-azar.netlify.app`.
5. Para conectar tu dominio propio: **Site configuration → Domain management → Add a domain**, y seguí las instrucciones de DNS que te muestra Netlify.
6. **Bonus — formularios sin backend**: agregá `data-netlify="true"` y `name="tasacion"` (o `"contacto"`) a cada `<form>` en `index.html`. Netlify va a detectar y procesar los envíos automáticamente, sin escribir una línea de backend. Los mensajes te llegan al panel de Netlify (y podés reenviarlos a tu email).

### Después de publicar

- Verificá el sitio en el celular real, no solo en el navegador de escritorio achicado.
- Reemplazá los placeholders de imágenes por fotos reales.
- Actualizá el teléfono y el email de contacto (actualmente son de ejemplo: `+54 9 297 456-7890` y `hola@luciabaldebenito.com`).
- Conectá el mapa real de Google Maps y las redes sociales verdaderas.
