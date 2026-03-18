/**
 * auth.js — Password gate + photo explosion transition
 *
 * On success: explosion of cat + saxophone photos, then redirect to home
 * Uses sessionStorage to persist auth state across pages
 */

const VALID_HASHES = [
  '16947a078e82b8c8f278cfd5e3dbe1a52c85772e8e02c3ea585b68af0bf64dc5',
  '7a993ae05fd89df397d38a17c84d1777ae443c3b9e3b9de8476c93e2d0600a1b',
];
const AUTH_KEY = 'murdock_party_auth';

const EXPLOSION_IMAGES = [
  'images/explosion/cat1.webp',
  'images/explosion/cat2.webp',
  'images/explosion/cat3.webp',
  'images/explosion/sax1.webp',
  'images/explosion/sax2.webp',
];

/**
 * Check if user is already authenticated
 */
function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Require auth — redirect to landing if not authenticated.
 * Call this on every page except index.html.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}

/**
 * Hash a string using SHA-256 via the Web Crypto API
 * @returns {Promise<string>} hex-encoded digest
 */
async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Attempt login with the given password
 * @returns {Promise<boolean>}
 */
async function attemptLogin(password) {
  const normalized = password.toLowerCase().trim();
  const hash = await hashPassword(normalized);
  return VALID_HASHES.includes(hash);
}

/**
 * Trigger the photo explosion animation, then navigate to home
 */
function triggerExplosion() {
  const container = document.getElementById('explosion-container');
  if (!container) return;

  container.style.display = 'block';
  const count = 12;

  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.src = EXPLOSION_IMAGES[i % EXPLOSION_IMAGES.length];
    img.className = 'explosion-photo';

    // Random size between 80px and 200px
    const size = Math.random() * 120 + 80;
    img.style.width = size + 'px';

    // Start from random edge
    const edge = Math.floor(Math.random() * 4);
    let startX, startY;
    if (edge === 0) { startX = -size; startY = Math.random() * window.innerHeight; }
    else if (edge === 1) { startX = window.innerWidth + size; startY = Math.random() * window.innerHeight; }
    else if (edge === 2) { startX = Math.random() * window.innerWidth; startY = -size; }
    else { startX = Math.random() * window.innerWidth; startY = window.innerHeight + size; }

    img.style.left = startX + 'px';
    img.style.top = startY + 'px';
    img.style.opacity = '0';
    img.style.transform = `rotate(${Math.random() * 40 - 20}deg) scale(0.5)`;
    img.style.transitionDelay = (i * 80) + 'ms';

    container.appendChild(img);

    // Animate to random position on screen
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.style.left = (Math.random() * (window.innerWidth - size)) + 'px';
        img.style.top = (Math.random() * (window.innerHeight - size)) + 'px';
        img.style.transform = `rotate(${Math.random() * 30 - 15}deg) scale(1)`;
      });
    });
  }

  // Fade out and navigate after explosion settles
  setTimeout(() => {
    const landing = document.getElementById('landing-page');
    if (landing) {
      landing.style.transition = 'opacity 0.4s ease-out';
      landing.style.opacity = '0';
    }
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 400);
  }, 1400);
}

/**
 * Initialize the password form on the landing page
 */
function initPasswordForm() {
  // If already authenticated, skip to home
  if (isAuthenticated()) {
    window.location.href = 'home.html';
    return;
  }

  const form = document.getElementById('password-form');
  const input = document.getElementById('password-input');
  const error = document.getElementById('password-error');

  if (!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (await attemptLogin(input.value)) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      input.classList.remove('error');
      input.classList.add('success');
      if (error) error.style.display = 'none';

      setTimeout(() => triggerExplosion(), 150);
    } else {
      input.classList.add('error');
      if (error) {
        error.textContent = 'Not quite... try again!';
        error.style.display = 'block';
      }
      setTimeout(() => input.classList.remove('error'), 400);
    }
  });
}

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Only init password form on landing page
  if (document.getElementById('password-form')) {
    initPasswordForm();
  }
});
