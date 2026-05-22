/**
 * lenis-init.js — Lenis × GSAP ScrollTrigger proxy
 * lerp 0.09 · wrapper body · smooth organique
 * Source : doc officielle Lenis + Studio Freight
 */

function initLenis() {
  const lenis = new Lenis({
    lerp: 0.09,
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
    touchMultiplier: 1.5,
  });

  // Expose globalement pour debug
  window.__lenis = lenis;

  // ScrollTrigger proxy — obligatoire pour que GSAP et Lenis parlent le même langage
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) lenis.scrollTo(value, { immediate: true });
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? 'transform' : 'fixed',
  });

  // Tick — synchroniser Lenis avec GSAP ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ScrollTrigger se met à jour quand Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);

  return lenis;
}
