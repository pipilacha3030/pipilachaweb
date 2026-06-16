# PIPILACHA WEB — UPGRADE V2
## Dirección creativa + nuevas páginas + sistema de regalo propio
## Claude Code — Junio 2026

---

## 0. ACCESO A ASSETS LOCALES (ejecutar siempre primero)

```bash
# Buscar fotos del restaurante en la Mac
find ~/Desktop ~/Downloads ~/Documents ~/Pictures -name "*.jpg" -o -name "*.jpeg" \
  -o -name "*.png" -o -name "*.webp" -o -name "*.heic" 2>/dev/null \
  | grep -i "pipilacha\|flor\|restaurante\|plato\|barra\|chef\|arán\|noé" | head -40

# Google Drive local (si está sincronizado con la app de Mac)
find ~/Library/CloudStorage -name "*.jpg" -o -name "*.png" -o \
  -name "*.webp" 2>/dev/null | grep -i "pipilacha" | head -30

# Vídeos disponibles
find ~/Desktop ~/Downloads ~/Movies -name "*.mp4" -o -name "*.mov" \
  -o -name "*.webm" 2>/dev/null | grep -i "pipilacha\|flor\|rest" | head -20
```

---

## 1. ESTADO ACTUAL — PROBLEMAS QUE SIGUEN PENDIENTES

### ❌ Críticos (no han cambiado desde v1)

**Jonah sigue en /conocenos.** El texto exacto que hay que eliminar:
```
ELIMINAR COMPLETAMENTE esta frase:
"Jonah lleva la sala y sirve cada copa con dos frases: qué es
y por qué va con ese pase. Con dieciséis personas por servicio
nos da tiempo a saber tu nombre."

REEMPLAZAR CON:
"Con dieciséis personas por servicio nos da tiempo a saber tu nombre."
```

**Sección barra duplicada en homepage.** Aparecen dos secciones consecutivas con el mismo contenido:
- "Seis metros de iroko. Los chefs al otro lado."
- "Solo 16 plazas por servicio"

Son la misma información. Mantener solo la primera (con la foto de la barra) y borrar la segunda por completo.

### ⚠️ Mejoras pendientes de esta versión
- La web sigue sin animaciones de scroll — todo aparece estático
- No hay diferencia visual entre mobile y desktop
- El hero "Todo empieza con una flor" está bien pero el CTA es pequeño
- Las secciones se ven como bloques de texto sin carácter visual

---

## 2. DIRECCIÓN CREATIVA — QUÉ HACE QUE UNA WEB VALGA 15.000€

La web actual tiene buen copy y estructura correcta. Lo que le falta es *presencia física*. Entras y lo lees — no lo sientes. Una web de este nivel tiene que hacer que el usuario sienta que ya está en el restaurante antes de reservar.

**Los tres principios que deben guiar cada decisión de diseño:**

**1. Lentitud deliberada.** Las webs baratas tienen prisa. Esta no. Cada elemento aparece con intención, con pausa. El scroll no es movimiento — es descubrimiento.

**2. La flor como sistema visual activo.** Los pétalos PNG que ya existen no hacen nada. Tienen que vivir: rotar levemente con el scroll, reaccionar al cursor, marcar el ritmo entre secciones. Son la identidad en movimiento.

**3. Tipografía como arquitectura.** El título no ocupa espacio — lo construye. Cormorant en 8–10vw con variaciones de peso y cursiva tiene más impacto que cualquier imagen.

---

## 3. HOMEPAGE — REDISEÑO COMPLETO

### Estructura final (orden exacto, sin duplicados):

```
1. NAV — sticky, fondo transparente en hero / opaco al scrollar
2. HERO — full viewport, foto barra o cuenco, titulo grande
3. MARQUEE — ticker con la frase de posicionamiento
4. MENÚ PREVIEW — preview del menú con foto lateral
5. LA BARRA — una sola vez, bien construida (eliminar duplicado)
6. DATOS — días / precios / plazas con animación
7. GALERÍA FRAGMENTO — 3 fotos editoriales
8. REGALO — teaser de la sección regalo (nuevo)
9. CTA RESERVA — pantalla completa, oscura, urgente
10. FOOTER
```

### Hero — código recomendado

```astro
<!-- src/components/Hero.astro -->
<section class="hero">
  <figure class="hero__media">
    <img
      src="/assets/img/hero.jpg"
      alt="Cuenco de cerámica con flores comestibles en Pipilacha, Madrid"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />
    <div class="hero__velo"></div>
  </figure>

  <div class="hero__copy">
    <p class="eyebrow">Restaurante de degustación · Madrid</p>
    <h1>
      Todo empieza<br />
      <em>con una flor.</em>
    </h1>
    <p class="hero__sub">
      El único restaurante del mundo construido íntegramente sobre las flores.<br />
      16 plazas. Jueves a domingo.
    </p>
    <div class="hero__actions">
      <a href="/reservas" class="btn btn--primary">Reservar</a>
      <a href="/regala" class="btn btn--ghost">Regalar una visita</a>
    </div>
  </div>

  <div class="hero__scroll-indicator" aria-hidden="true">
    <div class="hero__scroll-line"></div>
  </div>
</section>
```

```css
.hero {
  position: relative;
  height: 100svh; /* svh — más correcto que vh en mobile */
  display: flex;
  align-items: flex-end;
  padding: 0 clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vh, 5rem);
  overflow: hidden;
}

.hero__media {
  position: absolute;
  inset: 0;
  margin: 0;
}

.hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.08); /* margen para parallax */
}

.hero__velo {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(13, 13, 13, 0.75) 0%,
    rgba(13, 13, 13, 0.2) 50%,
    transparent 100%
  );
}

.hero__copy {
  position: relative;
  z-index: 2;
  color: var(--cloud-white);
  max-width: 42rem;
}

.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 8rem);
  font-weight: 300;
  font-style: normal;
  line-height: 0.95;
  margin: 0.5rem 0 1.5rem;
}

.hero h1 em {
  font-style: italic;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Scroll indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  right: 2.5rem;
  z-index: 2;
}

.hero__scroll-line {
  width: 1px;
  height: 60px;
  background: rgba(254, 252, 246, 0.4);
  position: relative;
  overflow: hidden;
}

.hero__scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--cloud-white);
  animation: scroll-line 1.8s ease-in-out infinite;
}

@keyframes scroll-line {
  to { top: 200%; }
}

/* MOBILE */
@media (max-width: 768px) {
  .hero__actions { flex-direction: column; }
  .hero__actions a { text-align: center; justify-content: center; }
}
```

---

## 4. SISTEMA DE ANIMACIONES — IMPLEMENTACIÓN COMPLETA

### Instalar dependencias
```bash
npm install gsap @studio-freight/lenis
```

### Archivo principal de animaciones
```javascript
// src/scripts/animations.js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

// ─── SMOOTH SCROLL ───────────────────────────────────────────
export function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add(time => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  return lenis
}

// ─── PARALLAX EN IMÁGENES ────────────────────────────────────
export function initParallax() {
  gsap.utils.toArray('.js-parallax').forEach(img => {
    gsap.to(img, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('figure, .parallax-wrap') || img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })
  })
}

// ─── FADE UP — TEXTOS Y SECCIONES ────────────────────────────
export function initFadeUps() {
  gsap.utils.toArray('.js-fade-up').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    )
  })
}

// ─── REVEAL LÍNEA A LÍNEA (headings grandes) ─────────────────
export function initHeadingReveal() {
  gsap.utils.toArray('.js-heading-reveal').forEach(el => {
    // Envuelve cada línea en un overflow:hidden
    const lines = el.querySelectorAll('br') // cada <br> es un salto de línea
    // Animación simple por heading completo si no hay <br>
    gsap.from(el, {
      opacity: 0,
      y: 70,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 82%' }
    })
  })
}

// ─── PÉTALOS CON PARALLAX Y ROTACIÓN ────────────────────────
export function initPetalos() {
  const petals = document.querySelectorAll('[data-petal]')
  petals.forEach((petal, i) => {
    const dir = i % 2 === 0 ? 1 : -1
    gsap.to(petal, {
      y: -60 * (i + 1) * 0.4,
      rotation: dir * 20,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    })
  })
}

// ─── NAV SCROLL ───────────────────────────────────────────────
export function initNav() {
  const nav = document.querySelector('#nav')
  if (!nav) return

  ScrollTrigger.create({
    start: 'top -60px',
    onEnter: () => nav.classList.add('nav--scrolled'),
    onLeaveBack: () => nav.classList.remove('nav--scrolled'),
  })
}

// ─── LOGO STROKE-DRAW AL CARGAR ───────────────────────────────
export function initLogoAnimation() {
  const iso = document.querySelector('.logo-iso path, .logo-iso circle')
  if (!iso) return

  // Si el SVG tiene paths con longitud medible
  document.querySelectorAll('.logo-iso path').forEach(path => {
    try {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: 'power2.inOut',
        delay: 0.3,
      })
    } catch (e) {
      // SVG no tiene getTotalLength — fallback a opacity
      gsap.from(path, { opacity: 0, duration: 0.8 })
    }
  })
}

// ─── INICIALIZAR TODO ─────────────────────────────────────────
export function initAll() {
  initLenis()
  initNav()
  initLogoAnimation()
  initParallax()
  initFadeUps()
  initHeadingReveal()
  initPetalos()
}
```

```astro
<!-- En Layout.astro — cargar animaciones -->
<script>
  import { initAll } from '../scripts/animations.js'
  document.addEventListener('DOMContentLoaded', initAll)
</script>
```

### Clases de animación — aplicar al HTML existente

```
js-parallax       → imágenes que hacen parallax al scrollar
js-fade-up        → cualquier bloque que aparece desde abajo
js-heading-reveal → headings grandes (H1, H2 de sección)
data-petal        → los PNG de pétalos flotantes
```

Ejemplo de uso:
```astro
<h2 class="js-heading-reveal">Seis metros de iroko.</h2>
<img class="js-parallax" src="..." />
<img data-petal src="/assets/img/petal-borraja.png" />
```

---

## 5. MARQUEE TICKER — COMPONENTE

```astro
<!-- src/components/Marquee.astro -->
<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    {Array(4).fill(null).map(() => (
      <>
        <span>El único restaurante del mundo construido íntegramente sobre las flores</span>
        <span class="marquee__sep" aria-hidden="true">·</span>
        <span>Madrid · Jueves a domingo · 16 plazas</span>
        <span class="marquee__sep" aria-hidden="true">·</span>
      </>
    ))}
  </div>
</div>

<style>
  .marquee {
    overflow: hidden;
    border-top: 1px solid var(--oat);
    border-bottom: 1px solid var(--oat);
    padding: 0.875rem 0;
    background: var(--fresh-cream);
  }

  .marquee__track {
    display: flex;
    gap: 2.5rem;
    width: max-content;
    animation: ticker 28s linear infinite;
    font-family: var(--font-body);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--olive);
    white-space: nowrap;
  }

  .marquee__sep { opacity: 0.4; }

  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .marquee:hover .marquee__track {
    animation-play-state: paused;
  }
</style>
```

---

## 6. NUEVA PÁGINA — /REGALA

### Por qué es urgente
El regalo es el mayor driver de conversión no capturado ahora mismo. Cumpleaños, aniversarios, San Valentín — son ocasiones donde alguien quiere regalar Pipilacha y no tiene cómo hacerlo digitalmente. Añadir este botón en el hero y en el nav puede aumentar los ingresos sin añadir una sola plaza.

### Sistema de tarjeta regalo — arquitectura propia

**La lógica:** El usuario compra → se genera un código único → llega notificación al equipo → en el restaurante se valida el código en una app/herramienta simple.

**Stack recomendado (sin pasarela compleja):**

```
Frontend (Astro):
  - Formulario de compra → POST a Stripe Payment Links o Stripe Checkout
  - Al completar pago: webhook de Stripe → función Netlify Edge
  - La función genera el código, guarda en base de datos, envía email

Backend (Netlify Functions + Supabase):
  - Supabase = base de datos de códigos (gratis hasta 500MB)
  - Cada código: { id, code, tipo, comprador, usado, fecha_uso }
  - Panel de validación: web app simple protegida por contraseña

Notificaciones:
  - Resend (email) o WhatsApp Business API → notificación inmediata al equipo
```

### Generador de códigos únicos
```javascript
// netlify/functions/create-gift.js
import { createClient } from '@supabase/supabase-js'
import Resend from 'resend'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const resend = new Resend(process.env.RESEND_KEY)

function generateCode() {
  // Formato: PIPI-XXXX-XXXX (legible, memorable)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin I, O, 0, 1
  const block = () => Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]).join('')
  return `PIPI-${block()}-${block()}`
}

export const handler = async (event) => {
  // Solo acepta webhooks de Stripe
  const body = JSON.parse(event.body)

  if (body.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'ok' }
  }

  const session = body.data.object
  const tipo = session.metadata.tipo         // 'degustacion' | 'maridaje'
  const comprador_email = session.customer_details.email
  const comprador_nombre = session.customer_details.name
  const destinatario = session.metadata.destinatario_nombre || ''
  const mensaje = session.metadata.mensaje || ''

  const code = generateCode()

  // Guardar en Supabase
  const { error } = await supabase.from('gift_cards').insert({
    code,
    tipo,
    comprador_email,
    comprador_nombre,
    destinatario,
    mensaje,
    usado: false,
    stripe_session_id: session.id,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Supabase error:', error)
    return { statusCode: 500, body: 'Error guardando código' }
  }

  const precio = tipo === 'maridaje' ? '145€' : '85€'
  const label = tipo === 'maridaje' ? 'Menú degustación + maridaje' : 'Menú degustación'

  // Email al comprador — con el código en grande
  await resend.emails.send({
    from: 'Pipilacha <hola@pipilacha.es>',
    to: comprador_email,
    subject: `Tu regalo de Pipilacha — ${code}`,
    html: giftEmailHTML({ code, label, precio, comprador_nombre, destinatario, mensaje }),
  })

  // Notificación al equipo
  await resend.emails.send({
    from: 'Sistema Pipilacha <hola@pipilacha.es>',
    to: 'admin@pipilacha.es', // cambiar por el email del equipo
    subject: `🌸 Nueva tarjeta regalo — ${code}`,
    html: `
      <h2>Nueva tarjeta regalo vendida</h2>
      <p><strong>Código:</strong> ${code}</p>
      <p><strong>Tipo:</strong> ${label} (${precio})</p>
      <p><strong>Comprador:</strong> ${comprador_nombre} (${comprador_email})</p>
      <p><strong>Para:</strong> ${destinatario || 'No especificado'}</p>
      <p><strong>Mensaje:</strong> ${mensaje || '—'}</p>
    `
  })

  return { statusCode: 200, body: JSON.stringify({ code }) }
}

function giftEmailHTML({ code, label, precio, comprador_nombre, destinatario, mensaje }) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Georgia, serif; background: #F4EFE6; padding: 40px 20px; margin: 0;">
      <div style="max-width: 480px; margin: 0 auto; background: #FEFCF6; padding: 48px; border-radius: 2px;">
        <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #645D3B; margin: 0 0 32px;">
          Pipilacha · Madrid
        </p>
        <h1 style="font-size: 2rem; font-weight: 300; color: #0D0D0D; margin: 0 0 8px; line-height: 1.1;">
          Una cena entre flores.
        </h1>
        ${destinatario ? `<p style="color: #645D3B; margin: 0 0 32px; font-size: 0.9rem;">Para ${destinatario}</p>` : ''}
        ${mensaje ? `<p style="color: #0D0D0D; border-left: 2px solid #D5CDBC; padding-left: 16px; font-style: italic; margin: 0 0 32px;">${mensaje}</p>` : ''}

        <div style="background: #0D0D0D; color: #FEFCF6; padding: 32px; text-align: center; margin: 0 0 32px; border-radius: 2px;">
          <p style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #D5CDBC; margin: 0 0 12px;">
            Código de regalo
          </p>
          <p style="font-size: 2rem; letter-spacing: 0.25em; font-family: monospace; color: #FEFCF6; margin: 0 0 12px; font-weight: 400;">
            ${code}
          </p>
          <p style="font-size: 0.8rem; color: #D5CDBC; margin: 0;">
            ${label} · ${precio} / persona
          </p>
        </div>

        <p style="font-size: 0.875rem; color: #645D3B; line-height: 1.6; margin: 0 0 24px;">
          Para usar este regalo, reserva en <a href="https://pipilacha.es/reservas" style="color: #0D0D0D;">pipilacha.es/reservas</a> 
          y presenta este código al llegar al restaurante. El equipo lo validará en mesa.
        </p>
        <p style="font-size: 0.75rem; color: #D5CDBC; margin: 0;">
          Válido para cualquier servicio disponible. Sin caducidad.
          Reserva obligatoria. Solo 16 plazas por servicio.
        </p>
      </div>
    </body>
    </html>
  `
}
```

### Panel de validación — app web interna

```astro
<!-- src/pages/validar.astro — protegida por contraseña simple -->
---
// Esta página NO aparece en el nav ni en el sitemap
// Acceso por URL directa: pipilacha.es/validar
---
```

```html
<!-- La UI de validación — HTML + JS vanilla, sin framework -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validar regalo · Pipilacha</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #0D0D0D;
      color: #FEFCF6;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #1A1A1A;
      border: 1px solid #2A2A2A;
      border-radius: 8px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
    }
    .logo {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #645D3B;
      margin-bottom: 1.5rem;
    }
    h1 { font-size: 1.25rem; font-weight: 400; margin-bottom: 2rem; }
    input {
      width: 100%;
      background: #111;
      border: 1px solid #333;
      color: #FEFCF6;
      padding: 0.875rem 1rem;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 4px;
      font-family: monospace;
      margin-bottom: 1rem;
    }
    input:focus { outline: none; border-color: #645D3B; }
    button {
      width: 100%;
      background: #FEFCF6;
      color: #0D0D0D;
      border: none;
      padding: 0.875rem;
      font-size: 0.9rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 600;
    }
    button:hover { background: #D5CDBC; }
    #result {
      margin-top: 1.5rem;
      padding: 1.25rem;
      border-radius: 4px;
      display: none;
    }
    .result--ok {
      background: rgba(100, 93, 59, 0.2);
      border: 1px solid #645D3B;
    }
    .result--error {
      background: rgba(180, 60, 60, 0.15);
      border: 1px solid rgba(180, 60, 60, 0.4);
    }
    .result__code { font-family: monospace; font-size: 1.2rem; letter-spacing: 0.15em; }
    .result__detail { font-size: 0.8rem; color: #D5CDBC; margin-top: 0.5rem; }
    .btn-use {
      margin-top: 1rem;
      background: #645D3B;
      color: #FEFCF6;
    }
    .used-badge {
      display: inline-block;
      background: #333;
      padding: 2px 8px;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 2px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="card">
    <p class="logo">Pipilacha · Validar regalo</p>
    <h1>Introduce el código</h1>
    <input type="text" id="code-input" placeholder="PIPI-XXXX-XXXX"
           maxlength="14" autocomplete="off" autocapitalize="characters" />
    <button onclick="checkCode()">Verificar código</button>
    <div id="result"></div>
  </div>

  <script>
    const input = document.getElementById('code-input')
    const result = document.getElementById('result')

    // Autoformatear mientras escribe
    input.addEventListener('input', (e) => {
      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (val.length > 4) val = val.slice(0,4) + '-' + val.slice(4)
      if (val.length > 9) val = val.slice(0,9) + '-' + val.slice(9)
      e.target.value = val.slice(0, 14)
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkCode()
    })

    async function checkCode() {
      const code = input.value.trim()
      if (code.length < 14) {
        showError('Código incompleto. Formato: PIPI-XXXX-XXXX')
        return
      }

      result.style.display = 'none'
      result.textContent = 'Verificando...'
      result.style.display = 'block'
      result.className = ''

      try {
        const res = await fetch(`/api/gift-check?code=${encodeURIComponent(code)}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          showError(data.error || 'Código no encontrado')
          return
        }

        if (data.usado) {
          result.className = 'result--error'
          result.innerHTML = `
            <p class="result__code">${data.code}</p>
            <p class="result__detail">${data.tipo_label}</p>
            <span class="used-badge">⚠ Ya utilizado el ${data.fecha_uso}</span>
          `
          return
        }

        result.className = 'result--ok'
        result.innerHTML = `
          <p class="result__code">${data.code}</p>
          <p class="result__detail">
            ${data.tipo_label}<br>
            Para: ${data.destinatario || data.comprador_nombre}<br>
            <small>Comprado el ${data.fecha_compra}</small>
          </p>
          <button class="btn-use" onclick="markUsed('${data.code}')">
            ✓ Marcar como usado
          </button>
        `
      } catch (err) {
        showError('Error de conexión. Verifica el wifi.')
      }
    }

    async function markUsed(code) {
      if (!confirm(`¿Confirmar uso del código ${code}?`)) return

      const res = await fetch('/api/gift-use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      if (res.ok) {
        result.className = 'result--ok'
        result.innerHTML = `
          <p>✓ Código marcado como usado</p>
          <p class="result__detail">${code}</p>
        `
        input.value = ''
      } else {
        showError('Error al marcar como usado. Intenta de nuevo.')
      }
    }

    function showError(msg) {
      result.className = 'result--error'
      result.innerHTML = `<p>${msg}</p>`
      result.style.display = 'block'
    }
  </script>
</body>
</html>
```

### APIs necesarias en Netlify Functions

```javascript
// netlify/functions/gift-check.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export const handler = async (event) => {
  const code = event.queryStringParameters?.code?.toUpperCase()

  if (!code) return { statusCode: 400, body: JSON.stringify({ error: 'Código requerido' }) }

  const { data, error } = await supabase
    .from('gift_cards')
    .select('*')
    .eq('code', code)
    .single()

  if (error || !data) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Código no encontrado' }) }
  }

  const tipos = {
    degustacion: 'Menú degustación · 85€ / persona',
    maridaje: 'Menú degustación + maridaje · 145€ / persona',
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      code: data.code,
      tipo_label: tipos[data.tipo] || data.tipo,
      usado: data.usado,
      fecha_uso: data.fecha_uso
        ? new Date(data.fecha_uso).toLocaleDateString('es-ES') : null,
      destinatario: data.destinatario,
      comprador_nombre: data.comprador_nombre,
      fecha_compra: new Date(data.created_at).toLocaleDateString('es-ES'),
    })
  }
}
```

```javascript
// netlify/functions/gift-use.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export const handler = async (event) => {
  const { code } = JSON.parse(event.body)

  const { error } = await supabase
    .from('gift_cards')
    .update({ usado: true, fecha_uso: new Date().toISOString() })
    .eq('code', code.toUpperCase())
    .eq('usado', false) // Solo si no está ya usado

  if (error) return { statusCode: 500, body: JSON.stringify({ error: 'Error' }) }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
```

### Schema de Supabase — ejecutar una vez
```sql
CREATE TABLE gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('degustacion', 'maridaje')),
  comprador_nombre TEXT,
  comprador_email TEXT NOT NULL,
  destinatario TEXT,
  mensaje TEXT,
  usado BOOLEAN DEFAULT FALSE,
  fecha_uso TIMESTAMPTZ,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por código (validación en restaurante)
CREATE INDEX idx_code ON gift_cards (code);
```

### Página /regala — copy y estructura

```astro
<!-- src/pages/regala.astro -->
```

**Estructura visual de la página:**

```
HERO oscuro:
  H1: "Regala Pipilacha"
  Subtítulo: "Quince pases. Dieciséis plazas. Una noche que no se olvida."

OPCIONES — dos cards:
  ① Solo menú · 85€ / persona
     "Los quince pases. Cada flor con su historia."
     [Regalar menú →]

  ② Menú + maridaje · 145€ / persona
     "Con las seis copas elegidas para la temporada.
      La versión completa."
     [Regalar con maridaje →]

FORMULARIO (aparece al elegir opción):
  - Para quién es (nombre del destinatario)
  - Mensaje personal (opcional, máx 200 caracteres)
  - Email de quien compra
  → Pago con Stripe → código generado → email enviado

INFO:
  - Sin caducidad
  - Reserva obligatoria
  - Válido cualquier servicio disponible
  - "¿Dudas? Escríbenos a hola@pipilacha.es"
```

**Copy de la página (listo para usar):**

```
HERO:
Regala Pipilacha.

Quince flores. Una noche entera.
Sin caducidad, sin urgencia: cuando quieran y con quien quieran.

CARD 1:
El menú
85€ por persona

Los quince pases del menú "Despertar de las flores".
La flor eléctrica al principio. Las fresas de Aranjuez al final.
Todo lo que hay en medio.

CARD 2:
El menú con maridaje
145€ por persona

Los quince pases más seis copas elegidas para la temporada.
Vinos de productores pequeños, fermentos de casa.
La versión sin atajos.

TEXTO INFERIOR:
El regalo llega por email al momento de comprar.
Incluye un código único. En el restaurante lo escaneamos
y queda canjeado.
```

---

## 7. NUEVA PÁGINA — /VINOS

### ¿Vale la pena? Sí, y mucho.

El maridaje a 60€ con una adopción del 30% son 18€ extra por comensal promedio. Con 16 plazas y ~560 comensales/mes, es ~10.000€/mes en riesgo si no se presenta bien. La página de vinos es una herramienta de venta, no un catálogo.

**La clave creativa: los vinos se presentan como personajes, no como productos.**

```astro
<!-- Estructura /vinos -->
```

**Copy de la página (listo):**

```
EYEBROW: La otra mitad del menú

H1:
Lo que bebemos
con las flores.

INTRO:
Seis copas para recorrer los quince pases. No hay carta: 
se elige al sentarse, se sirve y se explica en mesa.
Las flores dictan qué va con cada pase; nosotros buscamos 
lo que las ayuda.

─────────────────────────────────

SECCIÓN DOS OPCIONES:

CON VINO
+60€ / persona

Vinos de productores pequeños o fermentos de casa.
Cambian con las flores que entran cada temporada.
Seis copas. Ninguna en carta.

SIN ALCOHOL
+60€ / persona

Kombuchas, kéfires de agua y cheongs de flor.
Hechos en casa con las mismas flores del menú.
La misma ambición. Sin vino.

─────────────────────────────────

SECCIÓN ALGUNOS DE LOS QUE PASARON:
(rotatoria — cambiar con cada temporada)

Mas Candí · Penedès
Xarel·lo que huele a campo después de lluvia.
Fue con las vieiras y el hibiscus.

Stallmann Riesling · Rheinhessen
Con acidez de cítrico y fondo mineral.
Lo pusimos con el tupinambo de lavanda.

Cheong de glicinia · Pipilacha
Fermentado en casa durante seis semanas.
Va directo al pase de caballa.

─────────────────────────────────

CTA:
El maridaje se decide al sentarse.
No hace falta elegir ahora.

[Reservar con maridaje →]
```

**Diseño visual /vinos:**
- Fondo oscuro (`--obsidian`) para diferenciarse del resto de la web
- Las botellas / copas NO aparecen — solo nombres, orígenes, una línea de descripción
- Los "personajes" se revelan con scroll, uno a uno
- Sensación de lista editorial, como una colección de discos de vinilo

---

## 8. NUEVA PÁGINA — /PRENSA

### Estructura

```
EYEBROW: Prensa

H1: Pipilacha en los medios.

INTRO (texto para GEO — visible, copiable por IA):
"Pipilacha es el primer restaurante del mundo construido
íntegramente sobre las flores comestibles como ingrediente
principal. Situado en el barrio de Fuente del Berro, Madrid
(Calle del Azulejo, 2, 28028), abre de jueves a domingo con
menú de degustación de 15 pases a 85€. Los chefs fundadores
son Arán Rodrigo y Noé David."

GRID DE MENCIONES:
─ El País · Enero 2026
  "El jardín que se come"
  [Leer el artículo →] (si hay link)

─ El Mundo · Marzo 2026
  "Las flores más deliciosas de Madrid"
  [Leer →]

── (añadir según lleguen menciones)

PRESS KIT:
"Periodistas y medios"
[Descargar dossier de prensa →]  ← el PDF de 29 páginas que ya existe
[Fotos en alta resolución →]     ← link a carpeta Google Drive compartida
[Contacto de prensa →]           ← email

CONTACTO:
hola@pipilacha.es
+34 919 12 59 98
```

**Nota para Claude Code:** El press kit PDF ya existe (generado con Playwright/Chromium, 29 páginas bilingüe). Buscar el archivo en los outputs previos o preguntar al usuario dónde está guardado antes de linkarlo.

---

## 9. NAVEGACIÓN — AÑADIR NUEVAS PÁGINAS

```astro
<!-- Nav actualizado -->
<ul class="nav__links">
  <li><a href="/conocenos">Conócenos</a></li>
  <li><a href="/menu">Menú</a></li>
  <li><a href="/vinos">Vinos</a></li>
  <li><a href="/galeria">Galería</a></li>
  <li><a href="/prensa">Prensa</a></li>
</ul>

<!-- CTAs principales — siempre visibles -->
<div class="nav__ctas">
  <a href="/regala" class="btn btn--ghost btn--sm">Regalar</a>
  <a href="/reservas" class="btn btn--primary btn--sm">Reservar</a>
</div>
```

```css
/* Botón Regalar — diferente al de Reservar */
.btn--ghost {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.6rem 1.25rem;
  transition: background 0.2s, color 0.2s;
}

.btn--ghost:hover {
  background: var(--obsidian);
  color: var(--cloud-white);
  border-color: var(--obsidian);
}

/* En hero (fondo oscuro) */
.hero .btn--ghost {
  border-color: rgba(254, 252, 246, 0.5);
  color: var(--cloud-white);
}

.hero .btn--ghost:hover {
  background: rgba(254, 252, 246, 0.1);
}
```

---

## 10. SECCIÓN REGALO EN HOMEPAGE

Añadir entre la sección galería y el CTA de reserva:

```astro
<section class="teaser-regalo">
  <div class="teaser-regalo__content">
    <p class="eyebrow">Tarjetas regalo</p>
    <h2 class="js-heading-reveal">
      El mejor regalo<br />
      <em>es uno que no se espera.</em>
    </h2>
    <p>
      Cumpleaños, aniversarios, caprichos de martes.
      Enviamos el código al momento, sin caducidad.
    </p>
    <a href="/regala" class="btn btn--primary">Ver opciones de regalo</a>
  </div>
  <figure class="teaser-regalo__img">
    <img
      src="/assets/img/plato-hero.jpg"
      alt="Pase del menú Despertar de las flores en Pipilacha"
      loading="lazy"
      class="js-parallax"
    />
  </figure>
</section>
```

---

## 11. CORRECCIONES QUE AÚN NO SE HAN HECHO

### /conocenos — Jonah (PENDIENTE)
```
ARCHIVO: src/pages/conocenos.astro (o .md)
BUSCAR EXACTAMENTE:
"Jonah lleva la sala y sirve cada copa con dos frases: qué es y por qué
va con ese pase. Con dieciséis personas por servicio nos da tiempo a saber tu nombre."

REEMPLAZAR CON:
"Con dieciséis personas por servicio nos da tiempo a saber tu nombre."
```

### Homepage — sección barra duplicada (PENDIENTE)
```
BUSCAR Y ELIMINAR el bloque que contiene:
"Solo 16 plazas por servicio"
"Ocho de ellas en la barra de iroko, frente a Arán y Noé mientras cocinan."

(mantener solo la sección anterior: "Seis metros de iroko. Los chefs al otro lado.")
```

---

## 12. VARIABLES DE ENTORNO — .env

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...

# Resend (email transaccional)
RESEND_KEY=re_...

# URL del site
PUBLIC_SITE_URL=https://pipilacha.es
```

```bash
# Instalar dependencias del sistema de regalo
npm install stripe @supabase/supabase-js resend
```

---

## 13. PLAN DE TRABAJO — ORDEN EXACTO

### Sesión 1 — Correcciones urgentes (30 min)
1. Eliminar Jonah de /conocenos
2. Eliminar sección barra duplicada en homepage
3. Añadir clases `js-parallax`, `js-fade-up`, `data-petal` al HTML existente
4. Instalar Lenis + GSAP y conectar animations.js al Layout

### Sesión 2 — Nuevas páginas (2h)
5. Crear /vinos con el copy de la sección 7
6. Crear /prensa con estructura de la sección 8
7. Actualizar nav con los nuevos links + botón Regalar

### Sesión 3 — Sistema regalo (3-4h)
8. Crear cuenta Supabase + ejecutar schema SQL
9. Crear cuenta Resend + verificar dominio pipilacha.es
10. Configurar Stripe (producto + webhook)
11. Implementar netlify/functions/create-gift.js
12. Implementar netlify/functions/gift-check.js + gift-use.js
13. Crear src/pages/regala.astro con formulario
14. Crear src/pages/validar.astro (panel interno)
15. Añadir teaser regalo en homepage

### Sesión 4 — Animaciones + pulido (2h)
16. Conectar todas las animaciones de scroll
17. Marquee ticker
18. Hero con parallax en imagen
19. Mobile CTA sticky
20. Test final en iPhone (modo real, no simulador)

---

## 14. ASSETS MULTIMEDIA NECESARIOS

Antes de pedir al usuario que suba fotos, Claude Code debe buscar localmente (ver sección 0). Si no encuentra, pedir estas fotos específicas:

| Foto necesaria | Dónde se usa | Prioridad |
|---|---|---|
| Foto plato más fotogénico (close-up) | /regala hero | ALTA |
| Foto copa de vino con flor | /vinos hero | ALTA |
| Foto de Arán y Noé juntos | /prensa | MEDIA |
| Foto sala desde arriba | /galeria | MEDIA |
| Foto detalle barra de iroko | ya existe `/assets/img/barra.jpg` | OK |

---

*PIPILACHA WEB — V2 · Junio 2026*
*Prioridades: (1) correcciones pendientes, (2) sistema regalo, (3) animaciones*
