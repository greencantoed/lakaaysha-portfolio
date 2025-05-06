/* 5.5  Mediterranean‑Glitch Shards */
#hero-cracks{
  position:absolute;
  inset:0;
  pointer-events:none;
  isolation:isolate;
  z-index:var(--z-hero-bubbles);
}
.hero-crack{
  position:absolute;
  background-size:cover;
  background-position:center;
  filter:brightness(.85) contrast(1.15) saturate(1.4);
  transition:transform .4s var(--ease-out),opacity .4s var(--ease-out);
  will-change:transform;
}
.hero-crack::after{
  content:'';
  position:absolute;
  inset:0;
  background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.15),transparent 70%);
  mix-blend-mode:overlay;
}
.hero-crack.glitching{
  animation:shard-pulse .6s ease-in-out;
}
@keyframes shard-pulse{
  0%{transform:scale(1) rotate(0deg);}
  50%{transform:scale(1.12) rotate(var(--rot,2deg));}
  100%{transform:scale(1) rotate(0deg);}
}

/* 5.5  Primary CTA */
document.addEventListener('DOMContentLoaded', () => {
  // ----- Scroll-triggered Animations -----
  const sections = document.querySelectorAll('.section');
  const observerOptions = { threshold: 0.2 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);
  sections.forEach(section => observer.observe(section));

  // Fallback: ensure all sections become visible after 500ms (in case observer doesn't fire)
  setTimeout(() => {
    sections.forEach(section => {
      if (!section.classList.contains('visible')) {
        section.classList.add('visible');
      }
    });
  }, 500);

  // ----- Film‑strip Autoscroll Pause on Hover -----
  const strip = document.querySelector('.portfolio-strip');
  if (strip) {
    // Duplicate contents to create a seamless loop.
    strip.parentElement.appendChild(strip.cloneNode(true));

    const controlPlayState = (state) => {
      strip.style.animationPlayState = state;
      if (strip.nextElementSibling) {
        strip.nextElementSibling.style.animationPlayState = state;
      }
    };

    strip.addEventListener('mouseenter', () => controlPlayState('paused'));
    strip.addEventListener('mouseleave', () => controlPlayState('running'));
  }

  // ----- Auto-cycle Preview Images for Portfolio Items -----
  const autoCycleItems = document.querySelectorAll('.portfolio-item');
  autoCycleItems.forEach(item => {
    let cycleIndex = 0;
    const imgEl = item.querySelector('img');
    setInterval(() => {
      cycleIndex = (cycleIndex + 1) % 5; // assuming 5 preview images per project
      imgEl.classList.add('fade-in');
      setTimeout(() => { imgEl.classList.remove('fade-in'); }, 500);
    }, 5000);
  });

  // ----- Cracked-Mirror Glitch Effect for Hero Section -----
  const crackImages = [
    "images/webp/7+1 (0).webp",
    "images/webp/7+1 (1).webp",
    "images/webp/7+1 (2).webp",
    "images/webp/7+1 (3).webp",
    "images/webp/7+1 (4).webp",
    "images/webp/1104 BM (2).webp",
    "images/webp/1104 BM (3).webp",
    "images/webp/1104 BM (4).webp",
    "images/webp/1104 BM (5).webp",
    "images/webp/1104 BM (6).webp",
    "images/webp/Autonymous opinion on the matter of the void (1).png.webp",
    "images/webp/Autonymous opinion on the matter of the void (2).png.webp",
    "images/webp/Autonymous opinion on the matter of the void (3).png.webp",
    "images/webp/DEFE (1).webp",
    "images/webp/DEFE (2).webp",
    "images/webp/DEFE (3).webp",
    "images/webp/DEFE (4).webp",
    "images/webp/DEFE (5).webp",
    "images/webp/HRC (2).webp",
    "images/webp/HRC (3).webp",
    "images/webp/HRC.webp",
    "images/webp/HVSNVSHVSN (1).webp",
    "images/webp/HVSNVSHVSN (2).webp",
    "images/webp/HVSNVSHVSN (3).webp",
    "images/webp/HVSNVSHVSN (4).webp",
    "images/webp/RDC (6).webp",
    "images/webp/RDC (7).webp",
    "images/webp/RDC (8).webp",
    "images/webp/RDC (9).webp",
    "images/webp/RDC (10).webp",
    "images/webp/RDC (12).webp",
    "images/webp/RDC (13).webp",
    "images/webp/THEDREAM (1).webp",
    "images/webp/THEDREAM (2).webp",
    "images/webp/THEDREAM (3).webp",
    "images/webp/THEDREAM (4).webp",
    "images/webp/THEDREAM.webp",
    "images/webp/TSs (1).webp",
    "images/webp/TSs (2).webp",
    "images/webp/TSs (3).webp",
    "images/webp/TSs (4).webp"
  ];

  function scheduleUpdate(shard) {
        const rot = (Math.random() * 8 - 4).toFixed(2); // random rotation between -4° and 4°
        shard.style.setProperty('--rot', rot + 'deg');
    const delay = 4000 + Math.random() * 3000;
    setTimeout(() => {
      shard.classList.add('glitching');
      setTimeout(() => {
        const newImg = crackImages[Math.floor(Math.random() * crackImages.length)];
        shard.style.backgroundImage = `url('${newImg}')`;
      }, 250);
      setTimeout(() => {
        shard.classList.remove('glitching');
        scheduleUpdate(shard);
      }, 500);
    }, delay);
  }

  function createHeroCracks() {
    const hero = document.getElementById('hero');
    const container = document.getElementById('hero-cracks');
    if (!container) return;
    container.innerHTML = "";
    const rows = 4, cols = 4;
    const containerWidth = hero.clientWidth;
    const containerHeight = hero.clientHeight;
    const shardWidth = containerWidth / cols;
    const shardHeight = containerHeight / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const shard = document.createElement('div');
        shard.classList.add('hero-crack');
        shard.style.width = shardWidth + "px";
        shard.style.height = shardHeight + "px";
        shard.style.left = (c * shardWidth) + "px";
        shard.style.top = (r * shardHeight) + "px";
        const offsetMax = 20;
        const tlx = Math.random() * offsetMax;
        const tly = Math.random() * offsetMax;
        const trx = 100 - Math.random() * offsetMax;
        const try_ = Math.random() * offsetMax;
        const brx = 100 - Math.random() * offsetMax;
        const bry = 100 - Math.random() * offsetMax;
        const blx = Math.random() * offsetMax;
        const bly = 100 - Math.random() * offsetMax;
        const clipPath = `polygon(${tlx}% ${tly}%, ${trx}% ${try_}%, ${brx}% ${bry}%, ${blx}% ${bly}%)`;
        shard.style.clipPath = clipPath;
        const initialImg = crackImages[Math.floor(Math.random() * crackImages.length)];
        shard.style.backgroundImage = `url('${initialImg}')`;
        shard.style.backgroundSize = "cover";
        shard.style.backgroundPosition = "center";
        container.appendChild(shard);
        const initialDelay = Math.random() * 5000;
        setTimeout(() => scheduleUpdate(shard), initialDelay);
      }
    }
  }

  setTimeout(createHeroCracks, 1500);

  // ----- Hero Bubble Fallback for JS‑only visitors -----
  function createHeroBubbles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    for (let i = 0; i < 12; i++) {
      const b = document.createElement('div');
      b.classList.add('hero-bubble');
      hero.appendChild(b);
    }
  }
  createHeroBubbles();

  // ----- Mobile Hamburger Menu Toggle (if applicable) -----
  const mobileHamburger = document.getElementById('mobile-hamburger');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  if (mobileHamburger && mobileMenuOverlay) {
    mobileHamburger.addEventListener('click', () => {
      mobileMenuOverlay.classList.toggle('open');
    });
  }
  window.toggleMobileMenu = function(show) {
    if (show) {
      mobileMenuOverlay.classList.add('open');
    } else {
      mobileMenuOverlay.classList.remove('open');
    }
  }
});
