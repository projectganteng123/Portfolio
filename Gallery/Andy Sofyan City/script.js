/* ============================================
   URBAN FRAMES — Photography Portfolio
   script.js
   ============================================ */

(function () {
  'use strict';

  /* ---- STATE ---- */
  const SLIDES_COUNT = document.querySelectorAll('.slide').length;
  const AUTO_INTERVAL = 5500; // ms per slide
  let currentSlide = 0;
  let autoTimer = null;
  let progressTimer = null;
  let progressStart = null;

  /* ============================================
     NAVBAR — scroll behaviour
     ============================================ */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load

  /* ============================================
     MOBILE MENU
     ============================================ */
  function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
  }
  window.toggleMenu = toggleMenu;

  /* ============================================
     SMOOTH SCROLL
     ============================================ */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  window.scrollToSection = scrollToSection;

  /* ============================================
     SLIDESHOW
     ============================================ */
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  const currentNumEl = document.getElementById('currentNum');
  const totalNumEl = document.getElementById('totalNum');
  const progressFill = document.getElementById('progressFill');

  // Build dots
  if (dotsContainer) {
    for (let i = 0; i < SLIDES_COUNT; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    if (totalNumEl) totalNumEl.textContent = String(SLIDES_COUNT).padStart(2, '0');
  }

  function updateDots(index) {
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function updateCounter(index) {
    if (currentNumEl) currentNumEl.textContent = String(index + 1).padStart(2, '0');
  }

  function startProgress() {
    stopProgress();
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    progressStart = performance.now();

    function tick(now) {
      const elapsed = now - progressStart;
      const pct = Math.min((elapsed / AUTO_INTERVAL) * 100, 100);
      progressFill.style.width = pct + '%';
      if (pct < 100) {
        progressTimer = requestAnimationFrame(tick);
      }
    }
    progressTimer = requestAnimationFrame(tick);
  }

  function stopProgress() {
    if (progressTimer) {
      cancelAnimationFrame(progressTimer);
      progressTimer = null;
    }
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + SLIDES_COUNT) % SLIDES_COUNT;
    slides[currentSlide].classList.add('active');
    updateDots(currentSlide);
    updateCounter(currentSlide);
    startProgress();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, AUTO_INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function changeSlide(dir) {
    stopAuto();
    goToSlide(currentSlide + dir);
    startAuto(); // restart timer after manual change
  }
  window.changeSlide = changeSlide;

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    heroEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    heroEl.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

  // Init slideshow
  updateDots(0);
  updateCounter(0);
  startProgress();
  startAuto();

  /* ============================================
     GALLERY FILTER
     ============================================ */
  function filterGallery(btn, cat) {
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide items
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      const itemCat = item.getAttribute('data-cat');
      const show = cat === 'all' || itemCat === cat;
      item.classList.toggle('hidden', !show);
    });
  }
  window.filterGallery = filterGallery;

  /* ============================================
     SCROLL REVEAL — Intersection Observer
     ============================================ */
  const revealTargets = document.querySelectorAll(
    '.gallery-item, .about-inner, .section-header, .contact-inner, .stat'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${(i % 6) * 0.07}s, transform 0.7s ease ${(i % 6) * 0.07}s`;
    revealObserver.observe(el);
  });

  /* ============================================
     LIGHTBOX (simple)
     ============================================ */
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position: fixed; inset: 0; z-index: 999;
    background: rgba(44,31,14,0.93);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
    cursor: zoom-out;
  `;
  const lbImg = document.createElement('img');
  lbImg.style.cssText = `
    max-width: 88vw; max-height: 88vh;
    object-fit: contain; border-radius: 4px;
    transform: scale(0.92);
    transition: transform 0.35s ease;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    cursor: default;
  `;
  lightbox.appendChild(lbImg);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'all';
    lbImg.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
    lbImg.style.transform = 'scale(0.92)';
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target !== lbImg) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

})();
