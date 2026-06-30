(() => {
  'use strict';

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = reduceMotionQuery.matches;
  const prefersFinePointer = window.matchMedia('(pointer:fine)').matches;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // Progressive reveal.
  const revealItems = qsa('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Equipo docente: acordeón horizontal en escritorio y tarjetas abiertas en móvil.
  const facultyTiles = qs('#facultyTiles');
  if (facultyTiles) initFacultyTiles(facultyTiles);

  function initFacultyTiles(root) {
    const facultyItems = [
      {
        module: 'Módulo 1',
        badge: '01',
        date: '7 julio',
        short: 'Roberto',
        name: 'Roberto Ruiz de Arcaute',
        role: 'SEAE · NEIKER',
        eyebrow: 'Origen, semillas y producción ecológica',
        summary: 'Doctor en Mejora Genética de Plantas e investigador en NEIKER, especializado en producción ecológica de cultivos extensivos, mejora varietal y recuperación de trigos antiguos.',
        tags: ['Materia prima', 'Mejora genética', 'Trigos antiguos'],
        image: 'assets/roberto-ruiz-arcaute.jpg',
        position: '58% 50%',
        href: '#programa'
      },
      {
        module: 'Módulo 2',
        badge: '02',
        date: '8 julio',
        short: 'Panduru',
        name: 'Panduru Economía Circular',
        role: 'Economía social · Aprovechamiento alimentario',
        eyebrow: 'Economía circular aplicada al pan',
        summary: 'Empresa asturiana de economía social impulsada por Elena, Ana y Verónica. Su modelo valoriza pan excedente para reducir desperdicio alimentario y generar nuevos productos con impacto.',
        tags: ['Pan excedente', 'Desperdicio cero', 'Impacto'],
        image: 'assets/panduru-economia-circular.jpg',
        position: '50% 50%',
        href: '#programa'
      },
      {
        module: 'Módulo 3',
        badge: '03',
        date: '27 julio',
        short: 'Leire',
        name: 'Leire San Vicente Laurent',
        role: 'Bióloga · Especialista en Microbiología',
        eyebrow: 'Microbiología e innovación alimentaria',
        summary: 'Especializada en investigación alimentaria, fermentación de microorganismos, conservación de alimentos, seguridad alimentaria y desarrollo de nuevos ingredientes.',
        tags: ['Microbiología', 'Fermentación', 'Nuevos ingredientes'],
        image: 'assets/cereal-wide.webp',
        position: '55% 50%',
        href: '#programa'
      },
      {
        module: 'Módulo 4',
        badge: '04',
        date: '28 julio',
        short: 'Itziar',
        name: 'Itziar Aranguren Yárnoz',
        role: 'Responsable de Calidad y Laboratorio · ESPIGA I+D',
        eyebrow: 'Calidad, laboratorio y control del cereal',
        summary: 'Ingeniera Técnica Agrícola con más de 15 años de experiencia en control de calidad de trigo y otros cereales, innovación aplicada, formación y transferencia tecnológica.',
        tags: ['Calidad', 'Laboratorio', 'Trigo'],
        image: 'assets/itziar-aranguren-yarnoz.png',
        position: '50% 44%',
        href: '#programa'
      },
      {
        module: 'Módulo 5',
        badge: '05',
        date: '28 septiembre',
        short: 'Aina',
        name: 'Aina Calafat Rogers',
        role: 'Responsable de proyectos internacionales en SEAE',
        eyebrow: 'Certificación, proyectos y agricultura sostenible',
        summary: 'Bióloga, especialista en producción agraria ecológica y cooperación internacional, con más de 20 años de experiencia en certificación ecológica en Europa y América Latina.',
        tags: ['Certificación ecológica', 'SEAE', 'Proyectos'],
        image: 'assets/aina-calafat-rogers.jpg',
        position: '50% 42%',
        href: '#programa'
      },
      {
        module: 'Módulo 6',
        badge: '06',
        date: '29 septiembre',
        short: 'Lola',
        name: 'María Dolores Raigón Jiménez',
        role: 'Catedrática de Edafología y Química Agrícola · UPV',
        eyebrow: 'Valor nutricional, calidad alimentaria y sostenibilidad',
        summary: 'Ingeniera agrónoma, doctora y especialista en nutrición. Su trayectoria investigadora la convierte en referente en agricultura, calidad alimentaria y sostenibilidad.',
        tags: ['Nutrición', 'Calidad alimentaria', 'Sostenibilidad'],
        image: 'assets/maria-dolores-raigon-jimenez.jpg',
        position: '50% 42%',
        href: '#programa'
      },
      {
        module: 'Parte práctica transversal',
        badge: 'OB',
        date: '6 sesiones',
        short: 'Florindo',
        name: 'Florindo Fierro',
        role: 'Maestro panadero y asesor de obradores',
        eyebrow: 'Del conocimiento a la materia',
        summary: 'Uno de los maestros panaderos más reconocidos de España. Experto en harinas y procesos de panificación, conecta cada módulo con masas, texturas, tiempos y decisiones reales mediante demostraciones prácticas en obrador.',
        tags: ['Obrador', 'Harinas', 'Panadería artesana'],
        image: 'assets/florindo-fierro.jpg',
        position: '56% 50%',
        href: '#obrador'
      }
    ];

    let activeIndex = 0;
    const prefersHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    root.innerHTML = '';
    root.setAttribute('role', 'tablist');
    root.setAttribute('tabindex', '0');

    const tiles = facultyItems.map((item, index) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'faculty-tile';
      tile.setAttribute('role', 'tab');
      tile.setAttribute('aria-label', `${item.module}: ${item.name}`);
      tile.style.setProperty('--faculty-position', item.position || 'center');

      tile.innerHTML = `
        <img class="faculty-tile__image" src="${item.image}" alt="" loading="lazy" decoding="async">
        <span class="faculty-tile__shade" aria-hidden="true"></span>
        <span class="faculty-tile__rail" aria-hidden="true"><b>${item.short}</b></span>
        <span class="faculty-tile__topline">
          <b>${item.badge}</b>
          <span><small>${item.date}</small><i>${item.module}</i></span>
        </span>
        <span class="faculty-tile__content">
          <em>${item.eyebrow}</em>
          <strong>${item.name}</strong>
          <small>${item.role}</small>
          <span class="faculty-tile__summary">${item.summary}</span>
          <span class="faculty-tile__tags">${item.tags.map((tag) => `<i>${tag}</i>`).join('')}</span>
          <span class="faculty-tile__link">${item.href === '#obrador' ? 'Ver parte práctica' : 'Ver este módulo'} <i aria-hidden="true">↗</i></span>
        </span>`;

      tile.addEventListener('click', () => {
        if (mobileQuery.matches) return;
        if (activeIndex === index && item.href) {
          document.querySelector(item.href)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          return;
        }
        setActive(index);
      });
      if (prefersHover) {
        tile.addEventListener('mouseenter', () => {
          if (!mobileQuery.matches) setActive(index);
        });
      }
      root.appendChild(tile);
      return tile;
    });

    function setActive(index) {
      activeIndex = clamp(index, 0, facultyItems.length - 1);
      tiles.forEach((tile, tileIndex) => {
        const active = tileIndex === activeIndex;
        tile.classList.toggle('is-active', active);
        tile.setAttribute('aria-selected', String(active));
        tile.tabIndex = active ? 0 : -1;
      });
    }

    root.addEventListener('keydown', (event) => {
      if (mobileQuery.matches) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        setActive((activeIndex + 1) % facultyItems.length);
        tiles[activeIndex]?.focus();
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        setActive((activeIndex - 1 + facultyItems.length) % facultyItems.length);
        tiles[activeIndex]?.focus();
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setActive(0);
        tiles[activeIndex]?.focus();
      }
      if (event.key === 'End') {
        event.preventDefault();
        setActive(facultyItems.length - 1);
        tiles[activeIndex]?.focus();
      }
      if (event.key === 'Enter') {
        const href = facultyItems[activeIndex]?.href;
        if (href) document.querySelector(href)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });

    setActive(activeIndex);
  }

  // Very subtle hero depth on pointer devices. Disabled on touch and reduced motion.
  const art = qs('[data-parallax-art]');
  if (art && !reduceMotion && prefersFinePointer) {
    art.addEventListener('pointermove', (event) => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      art.style.transform = `perspective(1100px) rotateY(${x * 2.2}deg) rotateX(${-y * 1.7}deg)`;
    });
    art.addEventListener('pointerleave', () => {
      art.style.transform = '';
    });
  }

  // Keep a single programme accordion open on compact screens.
  const programmeModules = qsa('.module');
  programmeModules.forEach((module) => {
    module.addEventListener('toggle', () => {
      if (!module.open || window.innerWidth > 760) return;
      programmeModules.forEach((other) => {
        if (other !== module) other.open = false;
      });
    });
  });

  // Sticky CTA only after the first screen. It disappears near the final CTA.
  const mobileCta = qs('[data-mobile-cta]');
  const hero = qs('.hero');
  const finalCta = qs('.final-cta');
  if (mobileCta && hero && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let finalVisible = false;
    const renderMobileCta = () => {
      const show = !heroVisible && !finalVisible && window.innerWidth <= 760;
      mobileCta.classList.toggle('is-visible', show);
      mobileCta.setAttribute('aria-hidden', String(!show));
    };
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      renderMobileCta();
    }, { threshold: 0.12 }).observe(hero);
    if (finalCta) {
      new IntersectionObserver(([entry]) => {
        finalVisible = entry.isIntersecting;
        renderMobileCta();
      }, { threshold: 0.1 }).observe(finalCta);
    }
    window.addEventListener('resize', renderMobileCta, { passive: true });
  }
})();
