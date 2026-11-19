/**
 * LifeBridge Institute — Animated Counters, Progress Rings & ECG Draw Engine
 * Uses IntersectionObserver to animate KPI numbers, circular SVG progress rings,
 * and ECG heartbeat stroke paths once visible.
 * @module LifeBridgeCounter
 */
(function (global) {
  'use strict';

  const reducedMotion = function () {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /**
   * Format numeric values with commas and optional decimals.
   * @param {number} val
   * @param {number} decimals
   * @returns {string}
   */
  function formatVal(val, decimals) {
    if (decimals > 0) {
      return val.toFixed(decimals);
    }
    return Math.round(val).toLocaleString('en-IN');
  }

  /**
   * Animate a single counter element from 0 to its target value.
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    if (el.dataset.counted === '1') return;
    el.dataset.counted = '1';

    const target = parseFloat(el.getAttribute('data-count') || '0');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = parseInt(el.getAttribute('data-duration') || '1500', 10);

    if (reducedMotion()) {
      el.textContent = prefix + formatVal(target, decimals) + suffix;
      return;
    }

    const start = performance.now();
    const step = function (now) {
      const progress = Math.min(1, (now - start) / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = prefix + formatVal(current, decimals) + suffix;
      if (progress < 1) {
        global.requestAnimationFrame(step);
      } else {
        el.textContent = prefix + formatVal(target, decimals) + suffix;
      }
    };
    global.requestAnimationFrame(step);
  }

  /**
   * Animate an SVG circular progress ring element.
   * @param {HTMLElement} ringWrap
   */
  function animateRing(ringWrap) {
    if (ringWrap.dataset.ringAnimated === '1') return;
    ringWrap.dataset.ringAnimated = '1';
    const circle = ringWrap.querySelector('.ring-progress');
    if (!circle) return;
    const pct = Math.max(0, Math.min(100, parseFloat(ringWrap.getAttribute('data-progress') || '0')));
    const r = parseFloat(circle.getAttribute('r') || '44');
    const circumference = 2 * Math.PI * r;
    circle.style.strokeDasharray = circumference.toFixed(2);
    const offset = circumference * (1 - pct / 100);
    if (reducedMotion()) {
      circle.style.transition = 'none';
      circle.style.strokeDashoffset = offset.toFixed(2);
    } else {
      circle.style.strokeDashoffset = circumference.toFixed(2);
      global.requestAnimationFrame(function () {
        circle.style.strokeDashoffset = offset.toFixed(2);
      });
    }
  }

  /**
   * Initialize observers for counters, progress rings, and animated ECG lines.
   * @param {ParentNode} [root=document]
   */
  function init(root) {
    const scope = root || document;
    const counters = scope.querySelectorAll('[data-count]');
    const rings = scope.querySelectorAll('[data-progress]');
    const ecgs = scope.querySelectorAll('.ecg-draw');

    if (!('IntersectionObserver' in global)) {
      counters.forEach(animateCounter);
      rings.forEach(animateRing);
      ecgs.forEach(function (el) { el.classList.add('is-drawn'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        if (target.hasAttribute('data-count')) animateCounter(target);
        if (target.hasAttribute('data-progress')) animateRing(target);
        if (target.classList.contains('ecg-draw')) target.classList.add('is-drawn');
        observer.unobserve(target);
      });
    }, { threshold: 0.2 });

    counters.forEach(function (el) { observer.observe(el); });
    rings.forEach(function (el) { observer.observe(el); });
    ecgs.forEach(function (el) { observer.observe(el); });
  }

  global.LifeBridgeCounter = { init: init, animateCounter: animateCounter, animateRing: animateRing };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }
})(window);
