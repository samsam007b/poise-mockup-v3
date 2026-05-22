/**
 * band-morph.js — Module GSAP 4 phases complètes
 * Réf DS v2 : design-system/index.html lignes 2228-2256 · réf AutoStore
 * NE PAS amputer les phases C et D — c'est le moment signature.
 */

const BandMorph = (() => {

  let breathAnim = null;

  /**
   * init() — Prépare l'état initial des bandes (off-screen droite, légère rotation)
   * Appeler avant DOMContentLoaded.
   */
  function init(selector = '.bm-band') {
    const bands = document.querySelectorAll(selector);
    if (!bands.length) return;

    gsap.set(bands, {
      x: '110%',
      rotate: 6,          // légère rotation initiale que Phase C corrige
      borderRadius: 0,
      scaleX: 1,
      transformOrigin: 'right center',
      willChange: 'transform',
    });
  }

  /**
   * play(selector, onComplete) — Lance les 4 phases en séquence
   * Phase A+B+C = 1.2s · Phase D breath infini démarre après
   */
  function play(selector = '.bm-band', onComplete = null) {
    const bands = document.querySelectorAll(selector);
    if (!bands.length) return;

    // Arrêter un breath précédent si play est appelé plusieurs fois
    if (breathAnim) { breathAnim.kill(); breathAnim = null; }

    const tl = gsap.timeline({
      onComplete: () => {
        // Phase D — Breath infini (ne jamais sauter cette phase)
        breathAnim = gsap.to(selector, {
          scale: 1.004,
          yoyo: true,
          repeat: -1,
          duration: 4,
          ease: 'sine.inOut',
          overwrite: false,
        });
        if (onComplete) onComplete();
      }
    });

    // Phase A — Slide-in depuis droite, stagger 60ms, ease quart
    tl.to(bands, {
      x: 0,
      duration: 0.35,
      stagger: 0.06,
      ease: 'cubic-bezier(.76,0,.24,1)',
    });

    // Phase B — Morph borderRadius + scaleX, légère contraction
    tl.to(bands, {
      borderRadius: 6,
      scaleX: 0.88,
      duration: 0.5,
      stagger: 0.05,
      ease: 'cubic-bezier(.4,0,.2,1)',
    }, '-=0.08');

    // Phase C — Composition : correction rotation, bandes se "posent"
    tl.to(bands, {
      rotate: 0,
      duration: 0.4,
      ease: 'cubic-bezier(.2,.7,.2,1)',
      stagger: 0.04,
    }, '-=0.1');

    return tl;
  }

  /**
   * stopBreath() — Arrête le breath proprement (ex: reduced-motion)
   */
  function stopBreath() {
    if (breathAnim) { breathAnim.kill(); breathAnim = null; }
  }

  /**
   * playWithReducedMotion(selector) — Version accessible : skip A+B+C, juste état final
   */
  function playReduced(selector = '.bm-band') {
    gsap.set(selector, { x: 0, rotate: 0, borderRadius: 6, scaleX: 0.88 });
  }

  return { init, play, stopBreath, playReduced };
})();

// Export pour modules ES si besoin
if (typeof module !== 'undefined') module.exports = BandMorph;
