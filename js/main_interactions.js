// js/main_interactions.js

document.addEventListener('DOMContentLoaded', () => {
  const select = (s) => document.querySelector(s);
  const selectAll = (s) => Array.from(document.querySelectorAll(s));

  // 0. Update current year in footer
  const yearSpan = select('#current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 1. Rellax Parallax
  if (window.Rellax && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new Rellax('.rellax', {
      speed: -2, center: false, round: true,
    });
  }

  // 2. Custom Cursor
  const bodyEl = select('body');
  if (bodyEl && bodyEl.dataset.customCursor !== undefined && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const outerCursor = select('.cursor-outer');
    const innerCursor = select('.cursor-inner');
    if (outerCursor && innerCursor) {
      document.addEventListener('mousemove', e => {
        outerCursor.style.transform = `translate3d(${e.clientX - outerCursor.offsetWidth / 2}px, ${e.clientY - outerCursor.offsetHeight / 2}px, 0)`;
        innerCursor.style.transform = `translate3d(${e.clientX - innerCursor.offsetWidth / 2}px, ${e.clientY - innerCursor.offsetHeight / 2}px, 0)`;
      });
      const interactiveElements = 'a, .portfolio-item, .cta-button, button, input[type="submit"]';
      selectAll(interactiveElements).forEach(el => {
        el.addEventListener('mouseenter', () => innerCursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => innerCursor.classList.remove('hover'));
      });
    } else { delete bodyEl.dataset.customCursor; }
  } else if (bodyEl && bodyEl.dataset.customCursor !== undefined) { // Hide cursor elements if reduced motion
      const outerCursor = select('.cursor-outer');
      const innerCursor = select('.cursor-inner');
      if(outerCursor) outerCursor.style.display = 'none';
      if(innerCursor) innerCursor.style.display = 'none';
  }


  // 3. Scroll Down Indicator Smooth Scroll
  const scrollIndicator = select('.scroll-down-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', e => {
      e.preventDefault();
      const targetId = scrollIndicator.getAttribute('href');
      const targetElement = select(targetId);
      if (targetElement) {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        targetElement.scrollIntoView({ behavior: behavior });
      }
    });
  }

  // 4. Portfolio Gallery Revolve (Opacity cycle)
  selectAll('[data-gallery-revolve]').forEach(grid => {
    const items = Array.from(grid.children).filter(el => el.matches('.portfolio-item'));
    if (items.length === 0) return;
    let currentIndex = 0;
    const highlightClass = 'is-highlighted'; const dimClass = 'is-dimmed';
    items.forEach((item, i) => item.classList.add(i === currentIndex ? highlightClass : dimClass));

    if (items.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => {
            items[currentIndex].classList.remove(highlightClass); items[currentIndex].classList.add(dimClass);
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].classList.remove(dimClass); items[currentIndex].classList.add(highlightClass);
        }, 4000);
    }
  });


  // 5. Scroll Reveal for Sections
  const sectionsToReveal = selectAll('[data-scroll-reveal]');
  if (sectionsToReveal.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    sectionsToReveal.forEach(section => revealObserver.observe(section));
  } else if (sectionsToReveal.length > 0) { // If reduced motion, make them visible immediately
      sectionsToReveal.forEach(section => section.classList.add('visible'));
  }

  console.log("Main interactions initialized for Aegean Echoes & Digital Drift (Amphibian Glitch Edition).");
});