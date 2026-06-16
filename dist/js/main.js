/* ============================================================
   PIPILACHA · interacción
   Lenis (scroll suave) + GSAP ScrollTrigger (revelados, parallax)
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- intro / portada disruptiva ---------- */
const intro = document.getElementById('intro');
const introAsk = document.getElementById('introAsk');
const introReply = document.getElementById('introReply');
const introLine = document.getElementById('introLine');
const introEnter = document.getElementById('introEnter');
const introGo = document.getElementById('introGo');
const introWord = document.getElementById('introWord');
let heroPlayed = false;
let introNeedsGate = false;

// respuestas diferenciadas; el <em> lleva el acento terracotta vía CSS
const introReplies = {
  si: 'Entonces ya conoces el <em>hibiscus</em>. Aquí lo vas a comer en serio.',
  no: 'Pipilacha es tu <em>primera vez</em>. Empezamos por el principio.'
};

// parte la respuesta en palabras (conserva el <em>) para revelarlas una a una
function splitIntroWords(el) {
  const frag = document.createDocumentFragment();
  [...el.childNodes].forEach(node => {
    if (node.nodeType === 3) {
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'intro__w';
        s.textContent = part;
        frag.appendChild(s);
      });
    } else {
      const s = document.createElement('span');
      s.className = 'intro__w';
      s.appendChild(node.cloneNode(true));
      frag.appendChild(s);
    }
  });
  el.innerHTML = '';
  el.appendChild(frag);
  return el.querySelectorAll('.intro__w');
}

// la última palabra de la pregunta rota entre flores y se detiene en "flores"
const introFlowers = ['violetas', 'capuchina', 'claveles', 'saúco', 'tagete', 'borraja', 'caléndula', 'begonia', 'hibiscus', 'cosmo', 'flores'];
function cycleIntroWord() {
  if (!introWord) return;
  if (reduceMotion) { introWord.textContent = 'flores'; return; }
  let i = 0;
  (function step() {
    introWord.textContent = introFlowers[i];
    introWord.classList.remove('is-in');
    void introWord.offsetWidth;
    introWord.classList.add('is-in');
    i++;
    if (i < introFlowers.length) setTimeout(step, 60 + i * 16); // rápido, frenando solo al final
  })();
}

function playHero() {
  if (heroPlayed || !window.gsap || reduceMotion) return;
  if (!document.querySelector('.hero__title')) return; // solo el Inicio tiene hero
  heroPlayed = true;
  // y:0 limpia el translateY(115%) que GSAP interpreta como px; el reveal lo mueve solo por yPercent
  gsap.fromTo('.hero__title .reveal-mask',
    { yPercent: 115, rotate: 4, y: 0, transformOrigin: '0% 100%' },
    { yPercent: 0, rotate: 0, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.1 });
  // ken burns de entrada en la foto
  gsap.fromTo('.hero__media img', { scale: 1.14 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
  document.querySelectorAll('.hero [data-delay]').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: parseFloat(el.dataset.delay) + 0.1 });
  });
}

function enterSite() {
  if (!intro) return;
  intro.classList.add('is-hidden');
  document.body.classList.remove('intro-open');
  if (window.lenis) window.lenis.start();
  playHero();
  setTimeout(() => { intro.style.display = 'none'; }, 950);
}

if (intro) {
  // la portada se muestra en cada carga del Inicio (no se recuerda entre visitas)
  introNeedsGate = true;
  document.body.classList.add('intro-open');
  intro.querySelectorAll('.intro__choice').forEach(btn => {
    btn.addEventListener('click', () => {
      introLine.innerHTML = introReplies[btn.dataset.answer] || introReplies.si;
      introAsk.classList.add('is-fading');
      setTimeout(() => {
        introAsk.hidden = true;
        introReply.hidden = false;
        void introReply.offsetWidth; // reflow para que transicione
        introReply.classList.remove('is-fading');
        // la respuesta entra palabra a palabra; los botones, detrás
        if (window.gsap && !reduceMotion) {
          const words = splitIntroWords(introLine);
          gsap.fromTo(words,
            { opacity: 0, yPercent: 60 },
            { opacity: 1, yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.05 });
          gsap.fromTo([introEnter, introGo].filter(Boolean),
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 0.45 });
        }
        introEnter.focus();
      }, 380);
    });
  });
  introEnter.addEventListener('click', enterSite);
  // atajo: entrar y bajar suave hasta el manifiesto («El único restaurante de flores del mundo»)
  if (introGo) introGo.addEventListener('click', () => {
    enterSite();
    setTimeout(() => {
      const target = document.getElementById('manifesto');
      if (!target) return;
      if (window.lenis && !reduceMotion) window.lenis.scrollTo(target, { duration: 1.8 });
      else target.scrollIntoView();
    }, 500);
  });
  cycleIntroWord();
}

/* ---------- nav: fondo al hacer scroll + menú móvil ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');

burger.addEventListener('click', () => {
  const opening = !links.classList.contains('open');
  links.classList.toggle('open');
  burger.classList.toggle('is-open');
  // T10: al abrir el menú móvil, los enlaces entran en cascada
  if (opening && window.gsap && !reduceMotion) {
    gsap.fromTo(links.querySelectorAll('a'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07, delay: 0.18 });
  }
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => links.classList.remove('open'))
);

/* ---------- Lenis: scroll suave ---------- */
let lenis;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({ duration: 1.1, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  window.lenis = lenis; // expuesto para depuración
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (introNeedsGate) lenis.stop(); // bloquea el scroll tras la portada

  // anclas suaves
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); lenis.scrollTo(id, { offset: 0 }); }
    });
  });
}

/* botón flotante de reserva: aparece tras el primer scroll (solo móvil, vía CSS) */
const reservaFab = document.getElementById('reservaFab');
/* T11: barra de progreso de scroll */
const scrollProgress = document.getElementById('scrollProgress');

/* nav background toggle (umbral pequeño si la nav ya es sólida) */
const onScroll = y => {
  const threshold = nav.classList.contains('nav--solid') ? 10 : window.innerHeight * 0.6;
  nav.classList.toggle('scrolled', y > threshold);
  if (reservaFab) reservaFab.classList.toggle('is-visible', y > window.innerHeight * 0.5);
  if (scrollProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  }
};
if (lenis) lenis.on('scroll', e => onScroll(e.scroll));
else window.addEventListener('scroll', () => onScroll(window.scrollY));

/* ============================================================
   GSAP
   ============================================================ */
if (window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  // sincroniza ScrollTrigger con Lenis
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // si el visitante ya entró en esta sesión, no hay portada: anima el hero ya
  if (!introNeedsGate) playHero();

  if (!reduceMotion) {
    /* reveal genérico: los elementos que entran juntos al viewport
       se escalonan (stagger) en vez de aparecer todos a la vez */
    const revealEls = gsap.utils.toArray('.reveal').filter(el => !el.closest('.hero')); // el hero ya se anima arriba
    ScrollTrigger.batch(revealEls, {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, overwrite: true
      })
    });

    /* manifiesto pinned: las palabras se encienden una a una con el scrub,
       la flor azul cruza por detrás */
    if (document.querySelector('.manifesto')) {
      const mTl = gsap.timeline({
        scrollTrigger: { trigger: '.manifesto', start: 'top top', end: '+=85%', pin: true, scrub: 0.5 }
      });
      mTl.fromTo('.manifesto .m-word',
        { opacity: 0.08, yPercent: 36, filter: 'blur(6px)' },
        { opacity: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.14, ease: 'none' })
        .fromTo('.manifesto__bloom',
          { yPercent: 45, rotate: -16 },
          { yPercent: -55, rotate: 12, ease: 'none' }, 0);
    }

    /* despertar de las flores, en dos fases encadenadas con el manifiesto:
       1) mientras la sección sube hacia el viewport ya está floreciendo
       2) al llegar arriba se fija un momento y remata a pantalla completa */
    const sFrame = document.querySelector('.showcase__frame');
    if (sFrame) {
      const sImg = sFrame.querySelector('img');
      const CLIP_MID = 'inset(26% 30% 26% 30% round 26px)';
      gsap.timeline({
        scrollTrigger: { trigger: '.showcase-wrap', start: 'top bottom', end: 'top top', scrub: 0.3 }
      })
        .fromTo(sFrame,
          { clipPath: 'inset(50% 50% 50% 50% round 30px)' },
          { clipPath: CLIP_MID, ease: 'none' })
        .fromTo(sImg, { scale: 1.45 }, { scale: 1.25, ease: 'none' }, 0);

      gsap.timeline({
        scrollTrigger: { trigger: '.showcase-wrap', start: 'top top', end: '+=55%', pin: true, scrub: 0.4 }
      })
        .fromTo(sFrame,
          { clipPath: CLIP_MID },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out', duration: 0.7, immediateRender: false })
        .fromTo(sImg, { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1, immediateRender: false }, 0)
        .fromTo('.showcase__veil', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.45)
        .fromTo('.showcase__cap', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.6);
    }

    /* pétalos como partículas: deriva lenta en loop + parallax ligero al scroll.
       Todo en GSAP (se apaga el keyframe CSS float para que no pelee con el transform);
       cada pétalo lleva su factor en data-drift → profundidad distinta por capa */
    gsap.utils.toArray('.petal').forEach((p, i) => {
      p.style.animation = 'none'; // GSAP toma el control del transform
      const drift = parseFloat(p.dataset.drift || 0.4);
      const dir = i % 2 ? -1 : 1;
      gsap.set(p, { rotation: dir * (6 + drift * 14) });
      // deriva: respiración vertical + giro sutil, en loop infinito
      gsap.to(p, {
        y: -(12 + drift * 26), rotation: `+=${dir * (3 + drift * 5)}`,
        duration: 8 + i * 1.9, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });
      // parallax: yPercent es independiente de y, GSAP compone ambos
      gsap.fromTo(p, { yPercent: -drift * 26 }, {
        yPercent: drift * 26, ease: 'none',
        scrollTrigger: { trigger: p.closest('section') || p, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* parallax CENTRADO: a mitad de recorrido (incluido el scroll 0 del hero)
       el desplazamiento es 0, así nunca se ve el fondo por arriba ni por abajo */
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const amt = parseFloat(el.dataset.parallax);
      gsap.fromTo(el,
        { yPercent: () => -amt * 50 },
        {
          yPercent: () => amt * 50, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });

    /* menú: cada pase entra por piezas — número, nombre letra a letra, pista */
    if (document.querySelector('.pase')) {
      const splitLetters = el => {
        const frag = document.createDocumentFragment();
        [...el.textContent].forEach(ch => {
          if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'pase__ch';
          s.textContent = ch;
          frag.appendChild(s);
        });
        el.textContent = '';
        el.appendChild(frag);
        return el.querySelectorAll('.pase__ch');
      };
      gsap.utils.toArray('.pase').forEach(pase => {
        const letters = splitLetters(pase.querySelector('.pase__name'));
        gsap.timeline({ scrollTrigger: { trigger: pase, start: 'top 86%', once: true } })
          .from(pase.querySelector('.pase__n'), { opacity: 0, y: 22, duration: 0.6, ease: 'power3.out' })
          .from(letters, { opacity: 0, yPercent: 55, duration: 0.5, ease: 'power3.out', stagger: 0.02 }, 0.08)
          .from(pase.querySelector('.pase__hook'), { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out' }, '-=0.35');
      });
    }

    /* T5: las tarjetas de maridaje se revelan con máscara (clip-path) + desenfoque.
       clearProps al terminar: deja libre el transform para que el hover (lift) funcione */
    gsap.utils.toArray('.maridaje__card').forEach((card, i) => {
      gsap.fromTo(card,
        { clipPath: 'inset(0 0 100% 0)', filter: 'blur(8px)', opacity: 0, y: 26 },
        { clipPath: 'inset(0 0 0% 0)', filter: 'blur(0px)', opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: '.maridaje__cards', start: 'top 82%', once: true },
          onComplete: () => gsap.set(card, { clearProps: 'transform,filter,clipPath,opacity' })
        });
    });

    /* zoom-out de las fotos de plato al entrar */
    gsap.utils.toArray('.course__media img').forEach(img => {
      gsap.to(img, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'top center', scrub: true }
      });
    });

    /* galería (solo si la página la tiene) */
    if (document.querySelector('.gallery__grid')) {
      /* cascada de entrada */
      gsap.from('.g-item', {
        opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: '.gallery__grid', start: 'top 80%' }
      });

      /* cinética: cada imagen deriva a su ritmo dentro del marco */
      gsap.utils.toArray('.g-item img').forEach(img => {
        gsap.fromTo(img,
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.12, ease: 'none',
            scrollTrigger: { trigger: img.closest('.g-item'), start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }
    /* botones magnéticos «tallo»: atracción en radio ~80px alrededor del botón,
       retorno amortiguado sin rebote (quickTo: un solo tween reciclado por eje) */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      const RADIO = 80;
      const magnets = [...document.querySelectorAll('.btn, .nav__cta, .intro__enter, .intro__choice')].map(btn => {
        // T3: pequeño rebote de escala al entrar/salir, encima del magnético
        btn.addEventListener('pointerenter', () => gsap.to(btn, { scale: 1.06, duration: 0.3, ease: 'back.out(2.5)', overwrite: 'auto' }));
        btn.addEventListener('pointerleave', () => gsap.to(btn, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' }));
        return {
          btn,
          xTo: gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' }),
          yTo: gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' })
        };
      });
      window.addEventListener('pointermove', e => {
        magnets.forEach(m => {
          const r = m.btn.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          // distancia al borde del botón (no al centro): el radio empieza donde acaba el botón
          const dist = Math.hypot(Math.max(Math.abs(dx) - r.width / 2, 0), Math.max(Math.abs(dy) - r.height / 2, 0));
          if (dist < RADIO) {
            const pull = 1 - dist / RADIO; // 1 pegado al botón → 0 a 80px
            m.xTo(dx * 0.3 * pull);
            m.yTo(dy * 0.34 * pull);
          } else {
            m.xTo(0); m.yTo(0);
          }
        });
      }, { passive: true });
    }

    /* contraste tipográfico (2.4): los H2 de sección crecen un punto al
       entrar — vía scale (NO font-size) para no provocar reflow ni CLS */
    gsap.utils.toArray('.cta-band h2, .maridaje h2, .barra__title, .showcooking h2, .concepto h2').forEach(h => {
      const origin = getComputedStyle(h).textAlign === 'center' ? 'center bottom' : 'left bottom';
      gsap.fromTo(h, { scale: 0.94 }, {
        scale: 1, ease: 'none', transformOrigin: origin,
        scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 58%', scrub: true }
      });
    });
  } else {
    gsap.set('.reveal', { opacity: 1, y: 0 });
  }

  ScrollTrigger.refresh();
}

/* ============================================================
   LIGHTBOX (galería)
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const items = Array.from(document.querySelectorAll('.g-item'));
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const data = items.map(btn => { const img = btn.querySelector('img'); return { src: img.src, alt: img.alt }; });
  let current = 0;
  let lastFocus = null;

  const show = i => {
    current = (i + data.length) % data.length;
    lbImg.src = data[current].src;
    lbImg.alt = data[current].alt;
    lbCap.textContent = data[current].alt;
  };
  const openLb = i => {
    lastFocus = document.activeElement;
    show(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('intro-open'); // reutiliza el bloqueo de scroll
    if (window.lenis) window.lenis.stop();
    lbClose.focus();
  };
  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('intro-open');
    if (window.lenis) window.lenis.start();
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((btn, i) => btn.addEventListener('click', () => openLb(i)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => show(current - 1));
  lbNext.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}
