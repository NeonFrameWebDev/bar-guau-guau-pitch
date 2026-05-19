(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');
  const skipDemo = document.getElementById('skipDemo');

  let current = 0;
  const DEMO_SLIDE_INDEX = 10; // slide 11 (the preview slide), 0-based = 10

  function goTo(index, skipHash) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;

    slides.forEach((s, i) => {
      s.classList.remove('is-active', 'is-prev');
      if (i === index) s.classList.add('is-active');
      else if (i < index) s.classList.add('is-prev');
    });

    current = index;
    counter.textContent = `${index + 1} / ${total}`;
    progress.style.width = `${((index + 1) / total) * 100}%`;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;

    if (!skipHash) {
      history.replaceState(null, '', `#${index + 1}`);
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Click handlers
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  skipDemo.addEventListener('click', () => goTo(DEMO_SLIDE_INDEX));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Home') {
      goTo(0);
    } else if (e.key === 'End') {
      goTo(total - 1);
    } else if (e.key === 'f' || e.key === 'F') {
      // toggle fullscreen
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  });

  // Touch / swipe
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    // Only treat as a swipe if mostly horizontal and >50px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });

  // Click on slide background (not buttons / links) = next
  document.addEventListener('click', (e) => {
    const isNav = e.target.closest('.nav-bar, .skip-demo, a, button');
    if (isNav) return;
    next();
  });

  // Deep-link via hash (#3 etc.)
  function loadHash() {
    const h = parseInt(window.location.hash.replace('#', ''), 10);
    if (!isNaN(h) && h >= 1 && h <= total) {
      goTo(h - 1, true);
    } else {
      goTo(0, true);
    }
  }
  window.addEventListener('hashchange', loadHash);
  loadHash();

  // Hide cover hint after first interaction
  let interacted = false;
  function hideHint() {
    if (interacted) return;
    interacted = true;
    const hint = document.querySelector('.cover-hint');
    if (hint) hint.style.opacity = '0';
  }
  document.addEventListener('keydown', hideHint, { once: true });
  document.addEventListener('touchstart', hideHint, { once: true });
  document.addEventListener('click', hideHint, { once: true });

})();
