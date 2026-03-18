/**
 * page-transitions.js — Smooth fade transitions between internal pages
 *
 * On internal link clicks: fades body opacity to 0, then navigates.
 * Skips external links, #anchors, right-click, Ctrl+click, Cmd+click.
 * Restores opacity on pageshow (handles bfcache).
 *
 * Included on all pages EXCEPT index.html.
 */

document.addEventListener('DOMContentLoaded', () => {
  const TRANSITION_MS = 200;

  document.addEventListener('click', (e) => {
    // Find closest anchor
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Skip modified clicks (new tab, context menu)
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;

    // Skip anchors
    if (href.startsWith('#')) return;

    // Skip external links
    if (link.target === '_blank') return;
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
    } catch (_) {
      return;
    }

    // Skip javascript: links
    if (href.startsWith('javascript:')) return;

    e.preventDefault();

    // Fade out
    document.body.style.opacity = '0';

    // Guard against double-navigation (transitionend + setTimeout both firing)
    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      window.location.href = href;
    };

    // Use transitionend if supported, fallback to timeout
    const handler = () => {
      document.body.removeEventListener('transitionend', handler);
      navigate();
    };
    document.body.addEventListener('transitionend', handler);

    // Safety fallback in case transitionend doesn't fire
    setTimeout(navigate, TRANSITION_MS + 50);
  });

  // Restore opacity on pageshow (bfcache)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body.style.opacity = '1';
    }
  });

  // Ensure body starts visible
  document.body.style.opacity = '1';
});
