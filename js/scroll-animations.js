/**
 * scroll-animations.js — Scroll-triggered fly-in animations for split-section pages
 *
 * Replicates the IntersectionObserver pattern from schedule.js but for
 * document-level .split-content and .split-image elements (not day-containers).
 *
 * Included on: home.html, arrivals.html, costs.html
 * NOT included on: schedule.html (schedule.js handles its own animations)
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  const elements = document.querySelectorAll('.split-content, .split-image');
  if (elements.length === 0) return;

  const isDesktop = window.matchMedia('(min-width: 768px)').matches;

  /**
   * Determine slide direction based on md:order-N classes (desktop)
   * or element type (mobile).
   */
  function getSlideClass(el) {
    if (isDesktop) {
      const classes = Array.from(el.classList);
      const mdOrder = classes.find(c => c.startsWith('md:order-'));
      if (mdOrder) {
        const order = mdOrder.split('-').pop();
        return order === '1' ? 'slide-left' : 'slide-right';
      }
      return el.classList.contains('split-image') ? 'slide-right' : 'slide-left';
    }
    return el.classList.contains('split-image') ? 'slide-down' : 'slide-up';
  }

  elements.forEach(el => {
    const slideClass = getSlideClass(el);
    el.classList.add(slideClass);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
  });
});
