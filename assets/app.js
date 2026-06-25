(() => {
  'use strict';

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = reduceMotionQuery.matches;
  const prefersFinePointer = window.matchMedia('(pointer:fine)').matches;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);

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

  // Transformation module.
  const transformStage = qs('[data-transform-stage]');
  if (transformStage) initTransformation(transformStage);

  function initTransformation(root) {
    const visual = qs('.transformation-visual', root);
    const shell = qs('.transform-canvas-shell', root);
    const canvas = qs('[data-transform-canvas]', root);
    const fallback = qs('.transform-fallback-image', root);
    const steps = qsa('[data-transform-step]', root);
    const jumpButtons = qsa('[data-transform-jump]', root);
    const numberEl = qs('[data-transform-number]', root);
    const titleEl = qs('[data-transform-title]', root);
    const captionEl = qs('[data-transform-caption]', root);
    const pauseButton = qs('[data-transform-pause]', root);
    const progressNav = qs('[data-transform-nav]', root);

    const meta = [
      {
        title: 'Comprender la materia prima',
        caption: 'Todo empieza en el cereal: conocer su origen, su calidad y su comportamiento cambia el resto de decisiones.'
      },
      {
        title: 'Reducir lo que se desperdicia',
        caption: 'Cada pérdida detectada es una oportunidad de mejora: menos desperdicio y más margen para seguir transformando.'
      },
      {
        title: 'Aprovechar subproductos',
        caption: 'Cuando el residuo se entiende como materia aprovechable, aparecen nuevas aplicaciones y líneas de valor.'
      },
      {
        title: 'Innovar con criterio',
        caption: 'La circularidad necesita tecnología, calidad, normativa y financiación alineadas para convertirse en proyecto real.'
      },
      {
        title: 'Convertirlo en impacto visible',
        caption: 'El ciclo se cierra cuando ese valor generado se comunica bien y se traduce en beneficios tangibles para el sector.'
      }
    ];

    const supportsCanvas = !!canvas && !!canvas.getContext;
    if (!supportsCanvas) return;

    const ctx = canvas.getContext('2d');
    const isCompact = () => window.innerWidth <= 760;
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      target: 0,
      current: 0,
      activeIndex: 0,
      pointerX: 0,
      pointerY: 0,
      paused: false,
      inside: true,
      raf: 0,
      lastTime: 0,
      time: 0,
      needsRender: true,
      anchors: [],
      count: isCompact() ? 180 : 280,
    };

    function createRng(seed) {
      let s = seed >>> 0;
      return () => {
        s = (1664525 * s + 1013904223) >>> 0;
        return s / 4294967296;
      };
    }

    function grainObject(x, y, z, size, warm = 0.5, stretch = 1.6, alpha = 1) {
      return { x, y, z, size, warm, stretch, alpha };
    }

    function generateWheat(count) {
      const rng = createRng(7);
      const items = [];
      const rows = 18;
      const perRow = Math.max(6, Math.floor((count * 0.74) / rows));
      const grainCount = Math.min(count, rows * perRow);
      for (let i = 0; i < grainCount; i += 1) {
        const row = Math.min(rows - 1, Math.floor(i / perRow));
        const slot = i % perRow;
        const rowT = row / Math.max(1, rows - 1);
        const side = slot < perRow / 2 ? -1 : 1;
        const local = (slot % Math.ceil(perRow / 2)) / Math.max(1, Math.ceil(perRow / 2) - 1);
        const width = 72 - Math.abs(rowT - 0.56) * 42;
        const x = side * (26 + local * width) + (rng() - 0.5) * 8;
        const y = 148 - row * 19 + (rng() - 0.5) * 7;
        const z = (local - 0.5) * 80 + (rng() - 0.5) * 34;
        items.push(grainObject(x, y, z, 13 + rng() * 5, .94, 2.45, .98));
      }
      const remaining = count - items.length;
      for (let i = 0; i < remaining; i += 1) {
        const t = i / Math.max(1, remaining - 1);
        const isAwn = i < remaining * 0.58;
        if (isAwn) {
          const side = i % 2 === 0 ? -1 : 1;
          const rowT = (i % rows) / Math.max(1, rows - 1);
          items.push(grainObject(side * (72 + rowT * 90) + (rng() - .5) * 8, 142 - rowT * 310, (rng() - .5) * 45, 4.8 + rng() * 2.2, .84, 3.4, .68));
        } else {
          const stemT = (i - remaining * .58) / Math.max(1, remaining * .42);
          items.push(grainObject((rng() - 0.5) * 10, 160 + stemT * 170, (rng() - 0.5) * 34, 6 + rng() * 2.5, .66, 1.5, .78));
        }
      }
      return items;
    }

    function generateSeparatedGrains(count) {
      const rng = createRng(19);
      const items = [];
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2.4;
        const radius = 28 + (i / count) * 170 + rng() * 14;
        const x = Math.cos(angle) * radius * .72 + (rng() - .5) * 18;
        const y = Math.sin(angle * .9) * radius * .46 + (rng() - .5) * 24;
        const z = Math.sin(angle * 1.2) * 120 + (rng() - .5) * 56;
        const emphasis = i < count * .7 ? .86 : .52;
        items.push(grainObject(x, y, z, 12 + rng() * 7, .88, 2.05, emphasis));
      }
      return items;
    }

    function generateFlour(count) {
      const rng = createRng(31);
      const items = [];
      for (let i = 0; i < count; i += 1) {
        const t = i / Math.max(1, count - 1);
        const angle = t * Math.PI * 8.2;
        const radius = 10 + t * 162 + Math.sin(t * 9.2) * 16 + rng() * 6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * .52;
        const z = Math.cos(angle * .45) * 130 + (rng() - .5) * 22;
        items.push(grainObject(x, y, z, 5.2 + rng() * 4.4, .28, 1, .78));
      }
      return items;
    }

    function generateMaterial(count) {
      const rng = createRng(47);
      const cols = Math.round(Math.sqrt(count * 1.1));
      const rows = Math.ceil(count / cols);
      const items = [];
      for (let i = 0; i < count; i += 1) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const u = cols <= 1 ? 0 : col / (cols - 1);
        const v = rows <= 1 ? 0 : row / (rows - 1);
        const x = (u - 0.5) * 280;
        const y = (v - 0.5) * 220;
        const bend = Math.sin(u * Math.PI) * 56;
        const z = bend + Math.cos(v * Math.PI * 1.2) * 38 + (rng() - .5) * 18;
        items.push(grainObject(x, y, z, 6 + rng() * 4.6, .34, 1.22, .86));
      }
      return items;
    }

    function generateCycle(count) {
      const rng = createRng(61);
      const items = [];
      for (let i = 0; i < count; i += 1) {
        const t = i / Math.max(1, count - 1);
        const angle = t * Math.PI * 2;
        const radius = 176 + Math.sin(angle * 4) * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * .72;
        const z = Math.cos(angle * 2) * 82;
        items.push(grainObject(x, y, z, 6.4 + rng() * 4.4, .58, 1.15, .95));
      }
      return items;
    }

    const shapes = [generateWheat, generateSeparatedGrains, generateFlour, generateMaterial, generateCycle].map((factory) => factory(state.count));

    function setActive(index) {
      const safeIndex = clamp(Math.round(index), 0, meta.length - 1);
      state.activeIndex = safeIndex;
      root.dataset.stage = String(safeIndex);
      steps.forEach((step, stepIndex) => {
        const active = stepIndex === safeIndex;
        step.classList.toggle('is-active', active);
        step.setAttribute('aria-current', active ? 'step' : 'false');
      });
      jumpButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === safeIndex;
        button.classList.toggle('is-active', active);
        if (active) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      if (numberEl) numberEl.textContent = String(safeIndex + 1).padStart(2, '0');
      if (titleEl) titleEl.textContent = meta[safeIndex].title;
      if (captionEl) captionEl.textContent = meta[safeIndex].caption;
      if (progressNav) progressNav.setAttribute('aria-label', `Etapa ${safeIndex + 1} de ${meta.length}`);
    }

    function refreshAnchors() {
      state.anchors = steps.map((step) => window.scrollY + step.getBoundingClientRect().top + step.offsetHeight * 0.48);
      state.count = isCompact() ? 180 : 280;
    }

    function updateTargetFromScroll() {
      if (!state.anchors.length) refreshAnchors();
      const probe = window.scrollY + window.innerHeight * 0.48;
      const anchors = state.anchors;
      const maxIndex = anchors.length - 1;
      let target = 0;
      if (probe <= anchors[0]) target = 0;
      else if (probe >= anchors[maxIndex]) target = maxIndex;
      else {
        for (let i = 0; i < maxIndex; i += 1) {
          const a = anchors[i];
          const b = anchors[i + 1];
          if (probe >= a && probe <= b) {
            const local = clamp((probe - a) / Math.max(1, b - a), 0, 1);
            target = i + local;
            break;
          }
        }
      }
      state.target = target;
      const active = Math.round(target);
      if (active !== state.activeIndex) setActive(active);
      state.needsRender = true;
    }

    function resize() {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      state.width = shell.clientWidth;
      state.height = shell.clientHeight;
      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      refreshAnchors();
      updateTargetFromScroll();
      state.needsRender = true;
    }

    function projectPoint(point, currentTime) {
      const rotY = 0.62 + state.pointerX * 0.34;
      const rotX = -0.16 + state.pointerY * 0.16;
      let x = point.x;
      let y = point.y;
      let z = point.z;
      if (!state.paused && !reduceMotion) {
        x += Math.sin(currentTime * 0.00055 + point.y * 0.02) * 3.8;
        y += Math.cos(currentTime * 0.00048 + point.x * 0.018) * 2.8;
        z += Math.sin(currentTime * 0.00043 + point.z * 0.012) * 6.5;
      }
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;
      const y1 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;
      const camera = 520;
      const scale = camera / (camera + z2 + 160);
      return {
        x: state.width * 0.5 + x1 * scale,
        y: state.height * 0.54 + y1 * scale,
        scale,
        depth: z2,
      };
    }

    function drawParticle(particle, projection, styleMix) {
      const radius = Math.max(1.1, particle.size * projection.scale * .62);
      const stretch = lerp(1.0, particle.stretch, styleMix.grain); 
      const alpha = particle.alpha * lerp(.76, 1, styleMix.solid) * clamp((projection.scale - 0.1) / 1.3, .2, 1);
      const hue = lerp(46, 160, particle.warm * .15 + styleMix.green * .85);
      const saturation = lerp(88, 52, styleMix.green * .9 + styleMix.flour * .65);
      const light = lerp(78, 68, styleMix.green * .8) + particle.warm * 4;
      const glow = radius * lerp(1.25, 2.65, clamp(styleMix.flour, 0, 1));

      const gradient = ctx.createRadialGradient(projection.x, projection.y, radius * .2, projection.x, projection.y, glow);
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${Math.min(light + 8, 92)}%, ${Math.min(alpha, 1)})`);
      gradient.addColorStop(.45, `hsla(${hue}, ${saturation}%, ${light}%, ${alpha * .84})`);
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${light}%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(projection.x, projection.y, glow, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(projection.x, projection.y);
      ctx.rotate((particle.x + particle.y) * .004 + styleMix.rotation);
      ctx.scale(1, stretch);
      ctx.fillStyle = `hsla(${hue}, ${Math.min(saturation + 4, 90)}%, ${Math.max(light - 4, 46)}%, ${Math.min(alpha * .94, 1)})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.05, Math.max(radius * .55, .8), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, state.width, state.height);

      const t = clamp(state.current, 0, meta.length - 1);
      const baseIndex = Math.floor(t);
      const nextIndex = Math.min(meta.length - 1, baseIndex + 1);
      const mix = smooth(t - baseIndex);
      const from = shapes[baseIndex];
      const to = shapes[nextIndex];
      const currentTime = state.time;

      const stageMix = {
        grain: clamp(1 - (t / (meta.length - 1)), 0, 1),
        flour: clamp((t - 1) / 1.6, 0, 1) * (1 - clamp((t - 3.1) / 1.2, 0, 1)),
        green: clamp((t - 2.2) / 1.9, 0, 1),
        solid: clamp((t - 1.6) / 1.8, 0, 1),
        rotation: currentTime * 0.00008 + t * 0.15,
      };

      // A recognisable stalk and awns anchor the first state so it reads as cereal, not generic particles.
      const wheatAlpha = 1 - clamp(t / 1.05, 0, 1);
      if (wheatAlpha > 0.01) {
        ctx.save();
        ctx.translate(state.width * .5, state.height * .54);
        ctx.strokeStyle = `rgba(224, 169, 76, ${wheatAlpha * .62})`;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 205);
        ctx.quadraticCurveTo(-7, 24, 0, -205);
        ctx.stroke();
        ctx.lineWidth = 1.15;
        for (let row = 0; row < 15; row += 1) {
          const y = 132 - row * 20;
          const spread = 74 + row * 3.2;
          ctx.beginPath();
          ctx.moveTo(-34, y);
          ctx.lineTo(-spread, y - 46);
          ctx.moveTo(34, y);
          ctx.lineTo(spread, y - 46);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ambient rings
      ctx.save();
      ctx.translate(state.width * .5, state.height * .54);
      ctx.rotate(state.paused ? 0 : currentTime * 0.00006);
      ctx.strokeStyle = 'rgba(255,255,255,.085)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i += 1) {
        const rx = 160 + i * 74;
        const ry = 96 + i * 42;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, i * 0.35, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      const particles = new Array(state.count);
      for (let i = 0; i < state.count; i += 1) {
        const a = from[i];
        const b = to[i];
        const particle = {
          x: lerp(a.x, b.x, mix),
          y: lerp(a.y, b.y, mix),
          z: lerp(a.z, b.z, mix),
          size: lerp(a.size, b.size, mix),
          warm: lerp(a.warm, b.warm, mix),
          stretch: lerp(a.stretch, b.stretch, mix),
          alpha: lerp(a.alpha, b.alpha, mix),
        };
        particles[i] = { particle, projection: projectPoint(particle, currentTime) };
      }

      particles.sort((left, right) => left.projection.depth - right.projection.depth);

      const cycleLines = clamp((t - 3.35) / 1.2, 0, 1);
      if (cycleLines > 0.05) {
        ctx.save();
        ctx.strokeStyle = `rgba(224, 138, 30, ${cycleLines * 0.16})`;
        ctx.lineWidth = 1.1;
        for (let i = 0; i < 18; i += 1) {
          const a = particles[(i * 11) % particles.length].projection;
          const b = particles[(i * 17 + 14) % particles.length].projection;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(state.width * 0.5, state.height * 0.52, b.x, b.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      particles.forEach(({ particle, projection }) => drawParticle(particle, projection, stageMix));

      // highlight center pulse
      const pulse = 18 + (state.paused ? 0 : Math.sin(currentTime * 0.0021) * 4);
      const pulseGradient = ctx.createRadialGradient(state.width * .5, state.height * .54, 0, state.width * .5, state.height * .54, 140);
      pulseGradient.addColorStop(0, 'rgba(224,138,30,.18)');
      pulseGradient.addColorStop(.25, 'rgba(224,138,30,.08)');
      pulseGradient.addColorStop(1, 'rgba(224,138,30,0)');
      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(state.width * .5, state.height * .54, 140 + pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    function animate(now) {
      state.raf = requestAnimationFrame(animate);
      if (!state.lastTime) state.lastTime = now;
      const delta = now - state.lastTime;
      state.lastTime = now;
      state.time += delta;

      if (!state.inside && !state.needsRender) return;

      if (reduceMotion) {
        state.current = state.target;
      } else {
        const easing = state.paused ? 1 : .085;
        state.current += (state.target - state.current) * easing;
      }

      if (!state.needsRender && Math.abs(state.target - state.current) < 0.001 && state.paused) return;
      render();
      state.needsRender = false;
    }

    function togglePause(force) {
      state.paused = typeof force === 'boolean' ? force : !state.paused;
      if (pauseButton) {
        pauseButton.setAttribute('aria-pressed', String(state.paused));
        pauseButton.textContent = state.paused ? 'Reanudar' : 'Pausar';
      }
      state.needsRender = true;
    }

    if (pauseButton) {
      pauseButton.addEventListener('click', () => togglePause());
    }

    jumpButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const targetIndex = Number(button.dataset.transformJump || 0);
        const step = steps[targetIndex];
        step?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
    });

    if (prefersFinePointer) {
      shell.addEventListener('pointermove', (event) => {
        const rect = shell.getBoundingClientRect();
        state.pointerX = ((event.clientX - rect.left) / rect.width - .5) * .9;
        state.pointerY = ((event.clientY - rect.top) / rect.height - .5) * .65;
        state.needsRender = true;
      });
      shell.addEventListener('pointerleave', () => {
        state.pointerX = 0;
        state.pointerY = 0;
        state.needsRender = true;
      });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        state.inside = entry.isIntersecting;
        state.needsRender = true;
      }, { threshold: .06 }).observe(root);
    }

    let scrollTick = 0;
    const requestScrollUpdate = () => {
      if (scrollTick) return;
      scrollTick = requestAnimationFrame(() => {
        scrollTick = 0;
        updateTargetFromScroll();
      });
    };

    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', () => {
      resize();
      state.needsRender = true;
    }, { passive: true });
    reduceMotionQuery.addEventListener?.('change', (event) => {
      reduceMotion = event.matches;
      if (reduceMotion) togglePause(true);
      else togglePause(false);
      state.needsRender = true;
      render();
    });

    setActive(0);
    resize();
    if (reduceMotion) togglePause(true);
    state.raf = requestAnimationFrame(animate);
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
