import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';

const hero = document.querySelector('#accueil');
const header = document.querySelector('.site-header');
const dialog = document.querySelector('#mobile-menu');
const menuButton = document.querySelector('#menu-toggle');
const motionButton = document.querySelector('#motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 1024px)');
const controller = new AbortController();
const { signal } = controller;
let scene;
let paused = reducedMotion.matches;
let disposed = false;

// A native modal supplies focus containment and makes the background inert.
menuButton.hidden = false;
menuButton.addEventListener('click', () => {
  dialog.showModal();
  menuButton.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('menu-open');
}, { signal });
document.querySelector('#menu-close').addEventListener('click', () => dialog.close(), { signal });
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
}, { signal });
dialog.addEventListener('close', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('menu-open');
}, { signal });
dialog.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    dialog.close();
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }, { signal });
});
desktop.addEventListener('change', () => { if (desktop.matches && dialog.open) dialog.close(); }, { signal });

const heroObserver = new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-scrolled', !entry.isIntersecting);
}, { threshold: 0, rootMargin: '-85px 0px 0px 0px' });
heroObserver.observe(hero);

const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of navLinks) {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
}, { rootMargin: '-15% 0px -65% 0px' });
document.querySelectorAll('main > section').forEach((section) => sectionObserver.observe(section));

function updateMotion() {
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.querySelector('.motion-label').textContent = paused ? 'Animer le décor' : 'Mettre en pause';
  motionButton.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
  document.documentElement.classList.toggle('motion-paused', paused);
  scene?.setPaused(paused);
}
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); }, { signal });
reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updateMotion(); }, { signal });
updateMotion();
document.querySelector('#copyright-year').textContent = new Date().getFullYear();

// HTML and CSS render first; the decorative WebGL bundle is independent.
async function loadScene() {
  try {
    const { createSunset } = await import('./sunset.js');
    if (disposed) return;
    scene = createSunset(document.querySelector('#scene-canvas'), hero, {
      paused,
      onUnavailable: () => { motionButton.hidden = true; },
      onReady: () => { motionButton.hidden = false; },
    });
  } catch {
    // The static CSS sunset remains visible if the module or WebGL is unavailable.
    motionButton.hidden = true;
  }
}
loadScene();

function dispose() {
  disposed = true;
  controller.abort();
  heroObserver.disconnect();
  sectionObserver.disconnect();
  scene?.dispose();
}
if (import.meta.hot) import.meta.hot.dispose(dispose);
window.addEventListener('pagehide', (event) => { if (!event.persisted) dispose(); }, { signal });
