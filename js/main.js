

/**
 * main.js — Mediterranean-Glitch UX behaviors
 * Copy this file in place of your old main.js.
 */

// Utilities
const select = (s) => document.querySelector(s);
const selectAll = (s) => Array.from(document.querySelectorAll(s));

// Hero spiral & sand particle animations
function initHeroSpirals() {
  const hero = select('#hero');
  if (!hero) return;
  // Create and insert canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  // Position canvas behind shards
  canvas.style.zIndex = String(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z-hero-overlay')));
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  function resize() {
    width = canvas.width = hero.clientWidth;
    height = canvas.height = hero.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Particle setup
  const particles = [];
  const num = 150;
  for (let i = 0; i < num; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(width, height) * 0.5;
    particles.push({
      angle,
      radius,
      speed: 0.002 + Math.random() * 0.004,
      drift: 0.1 + Math.random() * 0.2,
      size: 1 + Math.random() * 3,
      color: `rgba(255,255,255,${0.1 + Math.random() * 0.2})`
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.angle += p.speed;
      p.radius += p.drift * 0.1;
      if (p.radius > Math.max(width, height)) {
        p.radius = Math.random() * Math.min(width, height) * 0.3;
        p.angle = Math.random() * Math.PI * 2;
      }
      const x = width / 2 + p.radius * Math.cos(p.angle);
      const y = height / 2 + p.radius * Math.sin(p.angle);
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// IntersectionObserver to reveal sections
function initScrollReveal() {
  const sections = selectAll('.section');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));
}

// Hero shards glitch effect
function initHeroCracks() {
  const hero = select('#hero');
  const container = select('#hero-cracks');
  if (!hero || !container) return;

  const crackImages = [
    'images/webp/7+1 (0).webp',
    'images/webp/7+1 (1).webp',
    'images/webp/7+1 (2).webp',
    'images/webp/7+1 (3).webp',
    'images/webp/7+1 (4).webp',
    'images/webp/1104 BM (2).webp',
    'images/webp/1104 BM (3).webp',
    'images/webp/1104 BM (4).webp',
    'images/webp/1104 BM (5).webp',
    'images/webp/1104 BM (6).webp',
    'images/webp/Autonymous opinion on the matter of the void (1).png.webp',
    'images/webp/Autonymous opinion on the matter of the void (2).png.webp',
    'images/webp/Autonymous opinion on the matter of the void (3).png.webp',
    'images/webp/DEFE (1).webp',
    'images/webp/DEFE (2).webp',
    'images/webp/DEFE (3).webp',
    'images/webp/DEFE (4).webp',
    'images/webp/DEFE (5).webp',
    'images/webp/HRC (2).webp',
    'images/webp/HRC (3).webp',
    'images/webp/HRC.webp',
    'images/webp/HVSNVSHVSN (1).webp',
    'images/webp/HVSNVSHVSN (2).webp',
    'images/webp/HVSNVSHVSN (3).webp',
    'images/webp/HVSNVSHVSN (4).webp',
    'images/webp/RDC (6).webp',
    'images/webp/RDC (7).webp',
    'images/webp/RDC (8).webp',
    'images/webp/RDC (9).webp',
    'images/webp/RDC (10).webp',
    'images/webp/RDC (12).webp',
    'images/webp/RDC (13).webp',
    'images/webp/THEDREAM (1).webp',
    'images/webp/THEDREAM (2).webp',
    'images/webp/THEDREAM (3).webp',
    'images/webp/THEDREAM (4).webp',
    'images/webp/THEDREAM.webp',
    'images/webp/TSs (1).webp',
    'images/webp/TSs (2).webp',
    'images/webp/TSs (3).webp',
    'images/webp/TSs (4).webp'
  ];

  // Helper to schedule next glitch
  function scheduleShardUpdate(shard) {
    const rot = (Math.random() * 8 - 4).toFixed(2) + 'deg';
    shard.style.setProperty('--rot', rot);
    const delay = 3000 + Math.random() * 4000;
    setTimeout(() => {
      shard.classList.add('glitching');
      setTimeout(() => {
        // swap image mid-glitch
        const img = crackImages[Math.floor(Math.random() * crackImages.length)];
        shard.style.backgroundImage = `url('${img}')`;
      }, 200);
      // remove glitch and reschedule
      setTimeout(() => {
        shard.classList.remove('glitching');
        scheduleShardUpdate(shard);
      }, 600);
    }, delay);
  }

  // Create a 4x4 grid of shards
  container.innerHTML = '';
  const rows = 4, cols = 4;
  const w = hero.clientWidth / cols;
  const h = hero.clientHeight / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const shard = document.createElement('div');
      shard.classList.add('hero-crack');
      shard.style.width = `${w}px`;
      shard.style.height = `${h}px`;
      shard.style.left = `${c * w}px`;
      shard.style.top = `${r * h}px`;
      // random polygon clip
      const o = 20;
      const tl = [Math.random() * o, Math.random() * o];
      const tr = [100 - Math.random() * o, Math.random() * o];
      const br = [100 - Math.random() * o, 100 - Math.random() * o];
      const bl = [Math.random() * o, 100 - Math.random() * o];
      shard.style.clipPath = `polygon(${tl[0]}% ${tl[1]}%, ${tr[0]}% ${tr[1]}%, ${br[0]}% ${br[1]}%, ${bl[0]}% ${bl[1]}%)`;
      // initial image
      shard.style.backgroundImage = `url('${crackImages[Math.floor(Math.random() * crackImages.length)]}')`;
      container.appendChild(shard);
      // schedule first glitch
      scheduleShardUpdate(shard);
    }
  }
}

// Hero bubbles for JS visitors
function initHeroBubbles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = select('#hero');
  if (!hero) return;
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'hero-bubble';
    hero.appendChild(b);
  }
}

// Film-strip autoscroll pause on hover
function initFilmStrip() {
  const strip = select('.portfolio-strip');
  if (!strip) return;
  // clone for seamless loop
  strip.parentElement.appendChild(strip.cloneNode(true));
  const toggle = (state) => {
    strip.style.animationPlayState = state;
    if (strip.nextElementSibling) strip.nextElementSibling.style.animationPlayState = state;
  };
  strip.addEventListener('mouseenter', () => toggle('paused'));
  strip.addEventListener('mouseleave', () => toggle('running'));
}

// Mobile hamburger toggle
function initMobileMenu() {
  const btn = select('#mobile-hamburger');
  const overlay = select('#mobile-menu-overlay');
  if (!btn || !overlay) return;
  btn.addEventListener('click', () => overlay.classList.toggle('open'));
  window.toggleMobileMenu = (show) => {
    overlay.classList.toggle('open', !!show);
  };
}

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeroSpirals();
  setTimeout(initHeroCracks, 500);   // delay to ensure layout metrics
  initHeroBubbles();
  initFilmStrip();
  initMobileMenu();
});