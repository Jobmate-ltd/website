/* ════════════════════════════════════════════
   main.js — Jobmate · Shared JS
   Component loader + scroll reveal
   ════════════════════════════════════════════ */

'use strict';

/* ─── Component Loader ─────────────────────── */
async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn('[Jobmate] Failed to load component:', url, e.message);
  }
}

/* ─── Scroll Reveal ────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length || !('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => observer.observe(el));
}

/* ─── Active Nav Link ───────────────────────── */
function setActiveNavLink() {
  const page = document.body.dataset.page;
  if (!page) return;
  const links = document.querySelectorAll('[data-nav]');
  links.forEach(link => {
    if (link.dataset.nav === page) link.classList.add('active');
  });
}

/* ─── Init ──────────────────────────────────── */
(async function init() {
  await Promise.all([
    loadComponent('site-header', '/_components/header.html'),
    loadComponent('site-footer', '/_components/footer.html'),
  ]);
  setActiveNavLink();
  initScrollReveal();
})();
