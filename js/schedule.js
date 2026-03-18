/**
 * schedule.js — Day-by-day slideshow with scroll-snap navigation
 *
 * Desktop: CSS scroll-snap container with smooth glide between sections.
 * Mobile:  Free-scrolling sections, no snap.
 *
 * 4 days, 3 sections per day (morning, afternoon, evening)
 * Day navigation via timeline buttons + arrow keys (left/right)
 * Section navigation via scroll-snap + arrow keys (up/down, desktop only)
 */

document.addEventListener('DOMContentLoaded', () => {
  const dayButtons = document.querySelectorAll('.day-btn');
  const dayContainers = document.querySelectorAll('.day-container');
  const scheduleContent = document.getElementById('schedule-content');

  if (dayButtons.length === 0) return;

  let currentDay = 0;
  let activeObservers = [];
  let isSnapActive = false;

  const SLIDE_CLASSES = ['slide-left', 'slide-right', 'slide-up', 'slide-down', 'in-view'];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMQ = window.matchMedia('(min-width: 768px)');
  const NAV_HEIGHT = 64;

  // ─── Day-Selector Height Measurement ───

  function setDaySelectorHeight() {
    const bar = document.querySelector('.day-selector')?.closest('.sticky');
    if (bar) {
      document.documentElement.style.setProperty('--day-selector-height', bar.offsetHeight + 'px');
    }
  }

  setDaySelectorHeight();
  window.addEventListener('resize', setDaySelectorHeight);

  // ─── Scroll Indicators ("scroll" text + bounce arrow on text panel) ───

  function injectScrollIndicators() {
    const chevronSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

    dayContainers.forEach(container => {
      const slides = container.querySelectorAll('.schedule-slide');
      slides.forEach((slide, i) => {
        if (i === slides.length - 1) {
          slide.classList.add('last-slide');
        }

        const content = slide.querySelector('.split-content');
        if (content) {
          const indicator = document.createElement('div');
          indicator.className = 'scroll-indicator';
          indicator.innerHTML = '<span>scroll</span>' + chevronSVG;
          indicator.setAttribute('aria-hidden', 'true');
          content.appendChild(indicator);
        }
      });
    });
  }

  injectScrollIndicators();

  // ─── Snap Mode ───

  function enableSnapMode() {
    if (isSnapActive) return;

    document.body.classList.add('schedule-snap-active');
    scheduleContent?.classList.add('snap-enabled');

    // Nav glass effect won't trigger since window doesn't scroll
    document.getElementById('main-nav')?.classList.add('scrolled');

    isSnapActive = true;
  }

  function disableSnapMode() {
    if (!isSnapActive) return;

    document.body.classList.remove('schedule-snap-active');
    scheduleContent?.classList.remove('snap-enabled');

    // Let nav.js handle the glass effect naturally
    const nav = document.getElementById('main-nav');
    if (nav && window.scrollY <= 50) {
      nav.classList.remove('scrolled');
    }

    isSnapActive = false;
  }

  function onBreakpointChange() {
    if (desktopMQ.matches) {
      enableSnapMode();
    } else {
      disableSnapMode();
    }

    // Re-initialize scroll animations with correct observer root
    disconnectObservers();
    if (dayContainers[currentDay]) {
      resetAnimations(dayContainers[currentDay]);
    }
    initScrollAnimations();
  }

  desktopMQ.addEventListener('change', onBreakpointChange);

  // bfcache restoration
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      setDaySelectorHeight();
      if (desktopMQ.matches) enableSnapMode();
    }
  });

  // ─── Slide Direction + Animations ───

  function getSlideClass(el, isDesktop) {
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

  function resetAnimations(container) {
    const els = container.querySelectorAll('.split-content, .split-image');
    els.forEach(el => {
      SLIDE_CLASSES.forEach(cls => el.classList.remove(cls));
    });
  }

  function disconnectObservers() {
    activeObservers.forEach(obs => obs.disconnect());
    activeObservers = [];
  }

  function initScrollAnimations() {
    if (prefersReducedMotion.matches) return;

    const container = dayContainers[currentDay];
    if (!container) return;

    const isDesktop = desktopMQ.matches;
    const els = container.querySelectorAll('.split-content, .split-image');

    els.forEach(el => {
      const slideClass = getSlideClass(el, isDesktop);
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
        {
          threshold: 0.15,
          root: isSnapActive ? scheduleContent : null
        }
      );

      observer.observe(el);
      activeObservers.push(observer);
    });
  }

  // ─── Day Switching ───

  function showDay(index) {
    disconnectObservers();
    if (dayContainers[currentDay]) {
      resetAnimations(dayContainers[currentDay]);
    }

    dayButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    dayContainers.forEach((container, i) => {
      if (i === index) {
        container.classList.add('active');
        container.style.animation = 'fadeUp 0.3s ease-out';
      } else {
        container.classList.remove('active');
      }
    });

    currentDay = index;

    if (isSnapActive && scheduleContent) {
      // Reset snap container to top instantly
      scheduleContent.style.scrollBehavior = 'auto';
      scheduleContent.scrollTop = 0;
      requestAnimationFrame(() => {
        scheduleContent.style.scrollBehavior = '';
      });
    } else {
      // Mobile: scroll window to top of schedule content
      const daySelectorBar = document.querySelector('.day-selector')?.closest('.sticky');
      if (scheduleContent) {
        const selectorHeight = daySelectorBar ? daySelectorBar.offsetHeight : 0;
        const offset = scheduleContent.getBoundingClientRect().top + window.scrollY - selectorHeight - NAV_HEIGHT;

        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: offset, behavior: 'instant' });
        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = '';
        });
      }
    }

    initScrollAnimations();
  }

  // ─── Event Handlers ───

  dayButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => showDay(i));
  });

  document.addEventListener('keydown', (e) => {
    // Day switching: left/right arrows
    if (e.key === 'ArrowRight' && currentDay < dayContainers.length - 1) {
      showDay(currentDay + 1);
    } else if (e.key === 'ArrowLeft' && currentDay > 0) {
      showDay(currentDay - 1);
    }

    // Section navigation: up/down arrows (snap mode only)
    if (isSnapActive && scheduleContent) {
      const sectionHeight = scheduleContent.clientHeight;
      const currentSection = Math.round(scheduleContent.scrollTop / sectionHeight);
      const sectionCount = dayContainers[currentDay]?.querySelectorAll('.schedule-slide').length || 3;

      if (e.key === 'ArrowDown' && currentSection < sectionCount - 1) {
        scheduleContent.scrollTo({ top: (currentSection + 1) * sectionHeight, behavior: 'smooth' });
        e.preventDefault();
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        scheduleContent.scrollTo({ top: (currentSection - 1) * sectionHeight, behavior: 'smooth' });
        e.preventDefault();
      }
    }
  });

  // ─── Initialize ───

  if (desktopMQ.matches) {
    enableSnapMode();
  }

  showDay(0);
});
