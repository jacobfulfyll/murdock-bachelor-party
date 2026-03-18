/**
 * parallax.js — Scroll-linked parallax for hero background images
 * and split-image photos (desktop only, subtle factor).
 * Respects prefers-reduced-motion. Uses rAF throttling.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  // Apply parallax to .split-image containers (not imgs) so CSS hover zoom on img is not clobbered
  const splitImages = isDesktop ? document.querySelectorAll('.split-image') : [];

  if (parallaxBgs.length === 0 && splitImages.length === 0) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      parallaxBgs.forEach(el => {
        el.style.transform = `translateY(${scrollY * 0.4}px)`;
      });

      splitImages.forEach(container => {
        // Subtle local parallax on the container — img inside is free for hover zoom CSS
        const rect = container.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        container.style.transform = `translateY(${centerOffset * 0.1}px)`;
      });

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});
