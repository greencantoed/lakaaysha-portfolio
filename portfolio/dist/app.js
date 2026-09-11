(() => {
  'use strict';
  const viewer = document.querySelector('.viewer');
  const stage = viewer?.querySelector('.viewer-media');
  const counter = viewer?.querySelector('.viewer-count');
  const label = viewer?.querySelector('.viewer-label');
  const prev = viewer?.querySelector('.viewer-prev');
  const next = viewer?.querySelector('.viewer-next');
  const gallery = JSON.parse(document.getElementById('gallery-data')?.textContent || '[]');
  const root = document.body.dataset.root || '';
  let current = 0, opener, isReel = false;
  function renderStill() {
    const item = gallery[current];
    if (!item) return;
    const img = document.createElement('img');
    img.src = item.src; img.alt = item.alt; stage.replaceChildren(img);
    label.textContent = item.alt;
    counter.textContent = `${String(current + 1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`;
  }
  function openViewer(trigger, reel = false) {
    opener = trigger; isReel = reel;
    prev.hidden = next.hidden = reel;
    document.body.classList.add('viewer-open');
    if (reel) {
      const video = document.createElement('video');
      video.src = root + 'media/hero-reel.mp4';
      video.poster = root + 'media/7p1-1.webp';
      video.controls = true; video.playsInline = true; video.autoplay = true; video.muted = true;
      stage.replaceChildren(video); label.textContent = 'Showreel'; counter.textContent = 'Loading video…';
      video.addEventListener('loadeddata', () => {counter.textContent = '00:58 / Silent';}, {once:true});
      video.addEventListener('error', () => {counter.textContent = 'Video could not load.';}, {once:true});
    } else { current = Number(trigger.dataset.index); renderStill(); }
    viewer.showModal(); viewer.querySelector('.viewer-close').focus();
    if (reel) stage.querySelector('video').play().catch(() => {});
  }
  document.querySelectorAll('.still-trigger').forEach(button => button.addEventListener('click', () => openViewer(button)));
  document.querySelectorAll('.reel-open').forEach(button => button.addEventListener('click', () => openViewer(button,true)));
  const advance = step => { current = (current+step+gallery.length)%gallery.length; renderStill(); };
  prev?.addEventListener('click', () => advance(-1));
  next?.addEventListener('click', () => advance(1));
  viewer?.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer?.addEventListener('click', e => { if(e.target === viewer) viewer.close(); });
  viewer?.addEventListener('keydown', e => {
    if(!isReel && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault(); advance(e.key === 'ArrowRight' ? 1 : -1);
    }
  });
  viewer?.addEventListener('close', () => {
    stage.replaceChildren(); document.body.classList.remove('viewer-open'); opener?.focus();
  });
  document.addEventListener('keydown', e => {
    if(e.key.toLowerCase() !== 'x' || e.ctrlKey || e.metaKey || e.altKey || e.repeat || viewer?.open) return;
    if(e.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    window.location.href = root + (document.body.classList.contains('world-ink') ? 'index.html' : 'ink/index.html');
  });
  let touchStart = null;
  stage?.addEventListener('touchstart', e => {touchStart = e.touches[0].clientX;}, {passive:true});
  stage?.addEventListener('touchend', e => {
    if(!isReel && touchStart !== null) {
      const delta = e.changedTouches[0].clientX-touchStart;
      if(Math.abs(delta) > 50) advance(delta > 0 ? -1 : 1);
    }
    touchStart = null;
  }, {passive:true});

  // The original portfolio's light-following cursor becomes an ink stroke in Writing.
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.cursor-toggle');
  const cursor = document.createElement('div');
  cursor.className = 'film-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<div class="cursor-glow"></div><div class="cursor-ring"></div><div class="cursor-dot"></div><canvas class="cursor-trail"></canvas>';
  document.body.append(cursor);
  const dot = cursor.querySelector('.cursor-dot');
  const glow = cursor.querySelector('.cursor-glow');
  const ring = cursor.querySelector('.cursor-ring');
  const canvas = cursor.querySelector('canvas');
  const context = canvas.getContext('2d');
  const ink = document.body.classList.contains('world-ink');
  let enabled = false, optedOut = false, active = false, frame = 0, lastFrame = 0, slowFrames = 0;
  let x = 0, y = 0, dx = 0, dy = 0, gx = 0, gy = 0, trail = [];
  try { optedOut = localStorage.getItem('lakaaysha-cursor') === 'off'; } catch (_) {}
  function resizeCanvas() {
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * scale);
    canvas.height = Math.round(innerHeight * scale);
    context?.setTransform(scale, 0, 0, scale, 0, 0);
    trail = [];
  }
  function hideCursor() {
    active = false; trail = []; lastFrame = 0;
    cursor.classList.remove('visible');
    document.body.classList.remove('film-cursor-active');
    cancelAnimationFrame(frame); frame = 0;
    context?.clearRect(0, 0, innerWidth, innerHeight);
  }
  function configureCursor() {
    hideCursor();
    slowFrames = 0;
    enabled = finePointer.matches && !reducedMotion.matches && !optedOut;
    if (toggle) {
      toggle.hidden = !finePointer.matches || reducedMotion.matches;
      toggle.setAttribute('aria-pressed', String(enabled));
      toggle.textContent = enabled ? 'Cursor animation on' : 'Cursor animation off';
    }
    if (enabled) resizeCanvas();
  }
  function draw(now) {
    frame = 0;
    if (!active || !enabled) return;
    if (lastFrame) {
      slowFrames = now - lastFrame > 45 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 30) {
        enabled = false; hideCursor();
        if (toggle) { toggle.setAttribute('aria-pressed','false'); toggle.textContent='Cursor animation off'; }
        return;
      }
    }
    const elapsed = lastFrame ? Math.min(40, now-lastFrame) : 16.7;
    lastFrame = now;
    const dotEase = 1-Math.pow(.65, elapsed/16.7), glowEase = 1-Math.pow(.85, elapsed/16.7);
    dx += (x-dx)*dotEase; dy += (y-dy)*dotEase;
    gx += (x-gx)*glowEase; gy += (y-gy)*glowEase;
    dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;
    ring.style.transform = `translate3d(${gx}px,${gy}px,0)`;
    glow.style.transform = `translate3d(${gx}px,${gy}px,0)`;
    if (ink && context) {
      context.clearRect(0, 0, innerWidth, innerHeight);
      trail = trail.filter(point => now-point.time < 950);
      context.lineCap = 'round'; context.lineJoin = 'round';
      for (let i=1; i<trail.length; i++) {
        const previous = trail[i-1], point = trail[i];
        context.strokeStyle = `rgba(255,193,168,${.65*(1-(now-point.time)/950)})`;
        context.lineWidth = Math.max(.7, 3.8-point.speed*.1);
        context.beginPath(); context.moveTo(previous.x, previous.y); context.lineTo(point.x, point.y); context.stroke();
      }
    }
    if (Math.abs(x-gx)+Math.abs(y-gy) > .15 || trail.length) frame = requestAnimationFrame(draw);
    else lastFrame = 0;
  }
  document.addEventListener('pointermove', e => {
    if (!enabled || e.pointerType !== 'mouse' || viewer?.open) { hideCursor(); return; }
    x=e.clientX; y=e.clientY;
    if (!active) { dx=gx=x; dy=gy=y; active=true; }
    const interactive = e.target.closest('a,button,input,textarea,select,[role="button"]');
    cursor.classList.toggle('hovering', Boolean(interactive));
    cursor.classList.add('visible'); document.body.classList.add('film-cursor-active');
    if (ink) {
      const previous = trail[trail.length-1];
      const distance = previous ? Math.hypot(x-previous.x,y-previous.y) : 0;
      if (!previous || distance > 1.2) trail.push({x,y,time:performance.now(),speed:distance});
    }
    if (!frame) frame=requestAnimationFrame(draw);
  }, {passive:true});
  document.documentElement.addEventListener('pointerleave', hideCursor);
  window.addEventListener('blur', hideCursor);
  window.addEventListener('resize', resizeCanvas, {passive:true});
  document.addEventListener('visibilitychange', () => { if(document.hidden) hideCursor(); });
  document.addEventListener('keydown', e => { if(e.key === 'Tab') hideCursor(); });
  document.querySelectorAll('.reel-open,.still-trigger').forEach(button => button.addEventListener('click', hideCursor));
  finePointer.addEventListener('change', configureCursor);
  reducedMotion.addEventListener('change', configureCursor);
  toggle?.addEventListener('click', () => {
    optedOut=enabled;
    try { localStorage.setItem('lakaaysha-cursor', optedOut ? 'off' : 'on'); } catch (_) {}
    configureCursor();
  });
  configureCursor();
})();
