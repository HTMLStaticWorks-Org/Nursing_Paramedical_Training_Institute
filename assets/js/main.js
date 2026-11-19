/**
 * LifeBridge Institute of Nursing & Paramedical Sciences
 * Main Front-End Application Controller (ES6+, Zero Console Output)
 * Modules: Theme, RTL, Preloader, Header/Drawer, Reveals, Cursor/Spotlight,
 *          Hero Interactions, Tabs/Hotspots/Accordions, Form Validation,
 *          Courses Filter & Compare, Admissions Stepper, Gallery Lightbox,
 *          Command Palette (Ctrl/Cmd+K), Course Quiz, Prospectus Modal, Toasts.
 */
(function (global, doc) {
  'use strict';

  const STORAGE_THEME = 'lb_theme_pref';
  const STORAGE_DIR = 'lb_dir_pref';
  const STORAGE_DRAFT = 'lb_admission_draft_v1';

  const prefersReducedMotion = function () {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const isTouch = function () {
    return global.matchMedia && global.matchMedia('(hover: none), (pointer: coarse)').matches;
  };

  /* ------------------------------------------------------------------------
     1. TOAST NOTIFICATION SYSTEM
     ------------------------------------------------------------------------ */
  /**
   * Display a transient accessible toast notification.
   * @param {string} message
   * @param {'info'|'success'|'warning'} [type='info']
   */
  function showToast() {
    // Pop-up toast notifications disabled across the site
  }
  global.LifeBridgeToast = showToast;

  /* ------------------------------------------------------------------------
     2. DARK / LIGHT THEME & RTL TOGGLES
     ------------------------------------------------------------------------ */
  /**
   * Apply and persist dark or light theme.
   * @param {'light'|'dark'} theme
   */
  function applyTheme(theme) {
    doc.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_THEME, theme); } catch (e) { /* storage disabled */ }
    doc.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const iconName = theme === 'dark' ? 'sun' : 'moon';
      if (global.LifeBridgeIcons) {
        btn.innerHTML = global.LifeBridgeIcons.getSvg(iconName, 18);
      }
    });
  }

  /**
   * Initialize theme from localStorage or OS prefers-color-scheme.
   */
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_THEME); } catch (e) { /* ignore */ }
    const prefersDark = global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light'));

    doc.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const next = doc.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(next === 'dark' ? 'Dark clinical mode enabled' : 'Light clinical mode enabled', 'info');
      });
    });
  }

  /**
   * Apply and persist LTR / RTL layout direction.
   * @param {'ltr'|'rtl'} dir
   */
  function applyDir(dir) {
    doc.documentElement.setAttribute('dir', dir);
    try { localStorage.setItem(STORAGE_DIR, dir); } catch (e) { /* ignore */ }
    doc.querySelectorAll('[data-rtl-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', dir === 'rtl' ? 'true' : 'false');
      const lbl = btn.querySelector('.rtl-label');
      if (lbl) lbl.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  /**
   * Initialize RTL toggle state and handlers.
   */
  function initRtl() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_DIR); } catch (e) { /* ignore */ }
    applyDir(saved === 'rtl' ? 'rtl' : 'ltr');

    doc.querySelectorAll('[data-rtl-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const next = doc.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        applyDir(next);
        showToast(next === 'rtl' ? 'RTL layout direction active' : 'LTR layout direction active', 'info');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. ECG PRELOADER & PAGE TRANSITION WIPE
     ------------------------------------------------------------------------ */
  /**
   * Hide ECG preloader swiftly so LCP stays under 2.5s.
   */
  function initPreloader() {
    const loader = doc.querySelector('.lb-preloader');
    if (loader) {
      const hide = function () { loader.classList.add('is-hidden'); };
      global.setTimeout(hide, 280);
      global.addEventListener('load', hide, { once: true });
    }

    if (prefersReducedMotion()) return;
    let wipe = doc.querySelector('.lb-page-wipe');
    if (!wipe) {
      wipe = doc.createElement('div');
      wipe.className = 'lb-page-wipe';
      wipe.setAttribute('aria-hidden', 'true');
      doc.body.appendChild(wipe);
    }

    doc.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
          href.startsWith('http') || link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) {
        return;
      }
      if (href.endsWith('.html') || href.includes('.html?')) {
        e.preventDefault();
        wipe.classList.add('is-active');
        global.setTimeout(function () { global.location.href = href; }, 190);
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. STICKY HEADER, DROPDOWN & FULL-SCREEN MOBILE DRAWER
     ------------------------------------------------------------------------ */
  /**
   * Manage sticky shrinking header, Home dropdown, and accessible mobile drawer.
   */
  function initNavigation() {
    // Mark active nav & mobile drawer items based on current URL
    const currentPath = global.location.pathname.replace(/\/+$/, '');
    const currentSearch = global.location.search;
    doc.querySelectorAll('.nav-dropdown__item[href], .mobile-drawer__link[href], .mobile-drawer__dropdown-item[href]').forEach(function (item) {
      try {
        const u = new URL(item.getAttribute('href'), global.location.href);
        const itemPath = u.pathname.replace(/\/+$/, '');
        if (itemPath === currentPath && (!u.search || u.search === currentSearch) && !u.hash) {
          item.setAttribute('aria-current', 'page');
          const parentDropdown = item.closest('.mobile-drawer__dropdown');
          if (parentDropdown) {
            const summary = parentDropdown.querySelector('summary');
            if (summary) summary.setAttribute('aria-current', 'page');
          }
        }
      } catch (e) { /* ignore */ }
    });

    const header = doc.querySelector('.site-header');
    if (header) {
      const onScroll = function () {
        header.classList.toggle('is-scrolled', global.scrollY > 24);
      };
      onScroll();
      global.addEventListener('scroll', onScroll, { passive: true });
    }

    // Accessible Dropdown toggle + hover intent bridge (prevents fast close)
    doc.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      let closeTimer = null;
      dd.addEventListener('mouseenter', function () {
        if (closeTimer) {
          global.clearTimeout(closeTimer);
          closeTimer = null;
        }
        dd.classList.add('is-hovering');
      });
      dd.addEventListener('mouseleave', function () {
        closeTimer = global.setTimeout(function () {
          dd.classList.remove('is-hovering');
        }, 220);
      });
    });

    doc.querySelectorAll('.nav-dropdown > button, .nav-dropdown > .nav-link').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        const parent = trigger.closest('.nav-dropdown');
        if (!parent) return;
        if (trigger.tagName === 'BUTTON' || trigger.getAttribute('href') === '#') {
          e.preventDefault();
          const open = parent.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
      });
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        doc.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
          dd.classList.remove('is-open');
          const t = dd.querySelector('[aria-expanded]');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Full-Screen Drawer
    const drawer = doc.querySelector('.mobile-drawer');
    const openBtn = doc.querySelector('[data-drawer-open]');
    const closeBtn = doc.querySelector('[data-drawer-close]');
    if (drawer && openBtn) {
      const setDrawer = function (open) {
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
        openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        doc.body.style.overflow = open ? 'hidden' : '';
        if (open && closeBtn) closeBtn.focus();
        if (!open) openBtn.focus();
      };
      openBtn.addEventListener('click', function () { setDrawer(true); });
      if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setDrawer(false); });
      });
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
      });
    }
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL, PARALLAX, CURSOR RING, SPOTLIGHT & MAGNETIC BUTTONS
     ------------------------------------------------------------------------ */
  /**
   * Observe `.reveal` elements for staggered entrance animations.
   */
  function initReveals() {
    const items = doc.querySelectorAll('.reveal');
    if (!items.length) return;
    if (prefersReducedMotion() || !('IntersectionObserver' in global)) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /**
   * Initialize desktop-only cursor ring, dark-section spotlight, magnetic CTAs & subtle hero parallax.
   */
  function initDesktopPolish() {
    if (isTouch() || prefersReducedMotion()) return;

    // Custom cursor ring
    const ring = doc.createElement('div');
    ring.className = 'lb-cursor';
    ring.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    doc.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      ring.classList.add('is-visible');
      const interactive = e.target.closest('a, button, input, select, textarea, [data-tilt], .hotspot-pin');
      ring.classList.toggle('is-hover', Boolean(interactive));
    }, { passive: true });

    doc.addEventListener('mouseleave', function () {
      ring.classList.remove('is-visible');
    });

    const tick = function () {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      const offset = ring.classList.contains('is-hover') ? 24 : 14;
      ring.style.transform = 'translate3d(' + (rx - offset).toFixed(1) + 'px, ' + (ry - offset).toFixed(1) + 'px, 0)';
      global.requestAnimationFrame(tick);
    };
    global.requestAnimationFrame(tick);

    // Cursor-aware spotlight glow on dark sections
    doc.querySelectorAll('.spotlight-dark').forEach(function (sec) {
      sec.addEventListener('mousemove', function (e) {
        const rect = sec.getBoundingClientRect();
        sec.style.setProperty('--spot-x', (e.clientX - rect.left) + 'px');
        sec.style.setProperty('--spot-y', (e.clientY - rect.top) + 'px');
      }, { passive: true });
    });

    // Subtle magnetic buttons on desktop
    doc.querySelectorAll('.btn-accent, .btn-primary').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const r = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 6;
        btn.style.transform = 'translate3d(' + dx.toFixed(1) + 'px, ' + (dy - 2).toFixed(1) + 'px, 0)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });

    // Subtle parallax on hero photography
    const parallaxNodes = doc.querySelectorAll('[data-parallax]');
    if (parallaxNodes.length) {
      global.addEventListener('scroll', function () {
        const sy = global.scrollY;
        if (sy > 900) return;
        parallaxNodes.forEach(function (el) {
          const speed = parseFloat(el.getAttribute('data-parallax') || '0.08');
          el.style.transform = 'translate3d(0, ' + (sy * speed).toFixed(1) + 'px, 0)';
        });
      }, { passive: true });
    }
  }

  /* ------------------------------------------------------------------------
     6. HOME 1 WORD SWAP & HOME 2 SLIDER / CAREER TABS / SIMLAB HOTSPOTS
     ------------------------------------------------------------------------ */
  /**
   * Animate rotating hero headline phrases on Home 1.
   */
  function initHeroWordSwap() {
    const el = doc.querySelector('[data-word-swap]');
    if (!el || prefersReducedMotion()) return;
    const words = (el.getAttribute('data-word-swap') || '').split('|').filter(Boolean);
    if (words.length < 2) return;
    let idx = 0;
    global.setInterval(function () {
      el.classList.add('is-swapping');
      global.setTimeout(function () {
        idx = (idx + 1) % words.length;
        el.textContent = words[idx];
        el.classList.remove('is-swapping');
      }, 260);
    }, 3200);
  }

  /**
   * Control Home 2 full-bleed photographic slider and Course Finder bar.
   */
  function initHome2Hero() {
    const slides = doc.querySelectorAll('.hero-slide');
    const dots = doc.querySelectorAll('.hero-slider-dot');
    if (slides.length > 1) {
      let current = 0;
      let timer = null;
      const show = function (index) {
        slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === index);
          d.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        });
        current = index;
      };
      const startAuto = function () {
        if (timer) global.clearInterval(timer);
        timer = global.setInterval(function () { show((current + 1) % slides.length); }, 4000);
      };
      dots.forEach(function (dot, idx) {
        dot.addEventListener('click', function () {
          show(idx);
          startAuto();
        });
      });
      startAuto();
    }

    const finder = doc.querySelector('#home2-course-finder');
    if (finder) {
      finder.addEventListener('submit', function (e) {
        e.preventDefault();
        const cat = finder.querySelector('[name="category"]').value;
        const dur = finder.querySelector('[name="duration"]').value;
        const params = new URLSearchParams();
        if (cat && cat !== 'all') params.set('category', cat);
        if (dur && dur !== 'all') params.set('duration', dur);
        global.location.href = 'courses.html' + (params.toString() ? '?' + params.toString() : '');
      });
    }
  }

  /**
   * Bind accessible tab groups (Home 2 Career Path, Facilities Hostel Tour, Dashboard Kanban).
   */
  function initTabs() {
    doc.querySelectorAll('[data-tabs]').forEach(function (group) {
      const buttons = group.querySelectorAll('[role="tab"]');
      const panels = group.querySelectorAll('[role="tabpanel"]');
      const activate = function (btn) {
        const targetId = btn.getAttribute('aria-controls');
        buttons.forEach(function (b) {
          const active = b === btn;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.classList.toggle('is-active', active);
        });
        panels.forEach(function (p) {
          const match = p.id === targetId;
          p.classList.toggle('is-active', match);
          p.hidden = !match;
        });
      };
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () { activate(btn); });
      });
    });
  }

  /**
   * Bind interactive Simulation Lab hotspots on Home 2.
   */
  function initHotspots() {
    const pins = doc.querySelectorAll('.hotspot-pin');
    const titleEl = doc.querySelector('#hotspot-title');
    const tagEl = doc.querySelector('#hotspot-tag');
    const descEl = doc.querySelector('#hotspot-desc');
    if (!pins.length || !titleEl) return;

    pins.forEach(function (pin) {
      pin.addEventListener('click', function () {
        pins.forEach(function (p) {
          p.classList.remove('is-active');
          p.setAttribute('aria-pressed', 'false');
        });
        pin.classList.add('is-active');
        pin.setAttribute('aria-pressed', 'true');
        titleEl.textContent = pin.getAttribute('data-title') || '';
        if (tagEl) tagEl.textContent = pin.getAttribute('data-tag') || 'Simulation Equipment';
        if (descEl) descEl.textContent = pin.getAttribute('data-desc') || '';
      });
    });
  }

  /**
   * Bind accessible FAQ & Semester Curriculum accordions.
   */
  function initAccordions() {
    doc.querySelectorAll('.accordion-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? doc.getElementById(panelId) : btn.nextElementSibling;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.classList.toggle('is-open', !expanded);
      });
    });
  }

  /**
   * Live countdown timers (Home 2 intake & Coming Soon page).
   */
  function initCountdowns() {
    const nodes = doc.querySelectorAll('[data-countdown]');
    if (!nodes.length) return;
    nodes.forEach(function (box) {
      const targetStr = box.getAttribute('data-countdown');
      const targetMs = new Date(targetStr).getTime();
      if (isNaN(targetMs)) return;

      const update = function () {
        const diff = Math.max(0, targetMs - Date.now());
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const set = function (part, val) {
          const n = box.querySelector('[data-cd="' + part + '"]');
          if (n) n.textContent = String(val).padStart(2, '0');
        };
        set('days', d);
        set('hours', h);
        set('mins', m);
        set('secs', s);
      };
      update();
      global.setInterval(update, 1000);
    });
  }

  /* ------------------------------------------------------------------------
     7. FORM VALIDATION (Inline Messages, ARIA, Floating Feedback)
     ------------------------------------------------------------------------ */
  /**
   * Validate a single input/select/textarea field.
   * @param {HTMLElement} input
   * @returns {boolean}
   */
  function validateField(input) {
    const wrap = input.closest('.field');
    if (!wrap) return true;
    const errEl = wrap.querySelector('.field__error');
    const val = (input.value || '').trim();
    let msg = '';

    if (input.hasAttribute('required') && !val) {
      msg = input.getAttribute('data-msg-required') || 'This field is required.';
    } else if (val && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    } else if (val && input.type === 'tel' && !/^[+\d][\d\s-]{8,15}$/.test(val)) {
      msg = 'Please enter a valid 10-digit phone number.';
    } else if (val && input.minLength > 0 && val.length < input.minLength) {
      msg = 'Must be at least ' + input.minLength + ' characters.';
    } else if (input.hasAttribute('data-match')) {
      const other = doc.querySelector(input.getAttribute('data-match'));
      if (other && other.value !== input.value) {
        msg = 'Values do not match.';
      }
    }

    wrap.classList.toggle('is-invalid', Boolean(msg));
    wrap.classList.toggle('is-valid', !msg && Boolean(val));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  /**
   * Attach client-side validation to all `[data-validate]` forms.
   */
  function initForms() {
    // Password show/hide toggles
    doc.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const input = btn.closest('.field__password-wrap').querySelector('input');
        if (!input) return;
        const hidden = input.type === 'password';
        input.type = hidden ? 'text' : 'password';
        btn.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
        if (global.LifeBridgeIcons) {
          btn.innerHTML = global.LifeBridgeIcons.getSvg(hidden ? 'eye-off' : 'eye', 18);
        }
      });
    });

    doc.querySelectorAll('form[data-validate]').forEach(function (form) {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function (inp) {
        inp.addEventListener('blur', function () { validateField(inp); });
        inp.addEventListener('input', function () {
          if (inp.closest('.field') && inp.closest('.field').classList.contains('is-invalid')) {
            validateField(inp);
          }
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        let allValid = true;
        let firstBad = null;
        inputs.forEach(function (inp) {
          if (inp.disabled) return;
          if (!validateField(inp)) {
            allValid = false;
            if (!firstBad) firstBad = inp;
          }
        });

        if (!allValid) {
          if (firstBad) firstBad.focus();
          showToast('Please review the highlighted fields before submitting.', 'warning');
          return;
        }

        const banner = form.querySelector('.form-success-banner');
        const successMsg = form.getAttribute('data-success-msg') || 'Submitted successfully! Our admissions desk will respond shortly.';
        if (banner) {
          banner.classList.add('is-visible');
        }
        showToast(successMsg, 'success');

        const redirectUrl = form.getAttribute('data-redirect');
        if (redirectUrl) {
          global.setTimeout(function () { global.location.href = redirectUrl; }, 850);
        } else if (form.getAttribute('data-reset') !== 'false') {
          form.reset();
          form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. COURSES CATALOG FILTER, SKELETON SHIMMER & COMPARISON TOOL
     ------------------------------------------------------------------------ */
  /**
   * Filter, search, sort, and compare Nursing & Paramedical courses.
   */
  function initCoursesPage() {
    const grid = doc.querySelector('#courses-catalog-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.course-item'));
    const catBtns = doc.querySelectorAll('[data-course-cat]');
    const searchInput = doc.querySelector('#course-search');
    const durSelect = doc.querySelector('#course-duration-filter');
    const sortSelect = doc.querySelector('#course-sort');
    const countEl = doc.querySelector('#course-result-count');
    const skeletonEl = doc.querySelector('#courses-skeleton');

    let activeCat = 'all';

    // Read query params from Home 2 Course Finder
    const qp = new URLSearchParams(global.location.search);
    if (qp.get('category')) {
      activeCat = qp.get('category');
      catBtns.forEach(function (b) {
        const match = b.getAttribute('data-course-cat') === activeCat;
        b.classList.toggle('is-active', match);
        b.setAttribute('aria-pressed', match ? 'true' : 'false');
      });
    }
    if (qp.get('duration') && durSelect) {
      durSelect.value = qp.get('duration');
    }

    const applyFilters = function (withSkeleton) {
      const run = function () {
        const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const dur = durSelect ? durSelect.value : 'all';
        const sort = sortSelect ? sortSelect.value : 'featured';

        const visible = cards.filter(function (c) {
          const catOk = activeCat === 'all' || c.getAttribute('data-cat') === activeCat;
          const durOk = dur === 'all' || c.getAttribute('data-duration') === dur;
          const textOk = !q || c.textContent.toLowerCase().includes(q);
          c.style.display = (catOk && durOk && textOk) ? '' : 'none';
          return catOk && durOk && textOk;
        });

        if (sort === 'fee-asc' || sort === 'fee-desc' || sort === 'duration-asc') {
          visible.sort(function (a, b) {
            if (sort === 'fee-asc') return (+a.dataset.fee) - (+b.dataset.fee);
            if (sort === 'fee-desc') return (+b.dataset.fee) - (+a.dataset.fee);
            return (+a.dataset.months) - (+b.dataset.months);
          });
          visible.forEach(function (c) { grid.appendChild(c); });
        }

        if (countEl) {
          countEl.textContent = 'Showing ' + visible.length + ' of ' + cards.length + ' accredited programs';
        }
        if (skeletonEl) skeletonEl.style.display = 'none';
        grid.style.display = '';
      };

      if (withSkeleton && skeletonEl) {
        grid.style.display = 'none';
        skeletonEl.style.display = 'grid';
        global.setTimeout(run, 220);
      } else {
        run();
      }
    };

    catBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCat = btn.getAttribute('data-course-cat') || 'all';
        catBtns.forEach(function (b) {
          const act = b === btn;
          b.classList.toggle('is-active', act);
          b.setAttribute('aria-pressed', act ? 'true' : 'false');
        });
        applyFilters(true);
      });
    });

    if (searchInput) searchInput.addEventListener('input', function () { applyFilters(false); });
    if (durSelect) durSelect.addEventListener('change', function () { applyFilters(true); });
    if (sortSelect) sortSelect.addEventListener('change', function () { applyFilters(true); });
    applyFilters(false);

    // Side-by-Side Course Comparison Tool
    const cmpA = doc.querySelector('#compare-course-a');
    const cmpB = doc.querySelector('#compare-course-b');
    const cmpOut = doc.querySelector('#compare-output');
    const COURSE_META = {
      'bsc-nursing': { name: 'B.Sc. Nursing', dur: '4 Years (8 Semesters)', elig: '10+2 PCB (45% min)', clinical: '2,100+ Hospital Hours', fee: 'INR 1,15,000 / yr', role: 'Registered Nurse (RN), ICU, Overseas NCLEX' },
      'gnm': { name: 'GNM (General Nursing & Midwifery)', dur: '3 Years + 6 mo Internship', elig: '10+2 Any Stream (40% min)', clinical: '1,800+ Hospital Hours', fee: 'INR 82,000 / yr', role: 'Staff Nurse, Ward Supervisor, Midwife' },
      'anm': { name: 'ANM (Auxiliary Nurse Midwife)', dur: '2 Years', elig: '10+2 Any Stream', clinical: '1,100+ Field & Ward Hours', fee: 'INR 54,000 / yr', role: 'Community Health Nurse, PHC Officer' },
      'pbbsc': { name: 'Post Basic B.Sc. Nursing', dur: '2 Years', elig: 'GNM + RN/RM Registration', clinical: '950+ Specialty Hours', fee: 'INR 98,000 / yr', role: 'Nursing Tutor, ICU Lead, Nurse Manager' },
      'dmlt': { name: 'DMLT (Medical Lab Technology)', dur: '2 Years', elig: '10+2 Science', clinical: '900+ Lab Bench Hours', fee: 'INR 62,000 / yr', role: 'Clinical Lab Technologist, Pathology Tech' },
      'radiology': { name: 'Radiology & Imaging Technology', dur: '2 Years', elig: '10+2 Science', clinical: '850+ CT/MRI Hours', fee: 'INR 68,000 / yr', role: 'Radiographer, CT/MRI Technologist' },
      'ott': { name: 'Operation Theatre Technology', dur: '2 Years', elig: '10+2 Science', clinical: '960+ Surgical Suite Hours', fee: 'INR 66,000 / yr', role: 'OT Technologist, Anaesthesia Assistant' },
      'emt': { name: 'Emergency Medical Technician', dur: '1 Year', elig: '10+2 Pass', clinical: '550+ Ambulance & ER Hours', fee: 'INR 48,000 total', role: 'Paramedic, Trauma & ACLS Responder' }
    };

    const renderCompare = function () {
      if (!cmpA || !cmpB || !cmpOut) return;
      const a = COURSE_META[cmpA.value];
      const b = COURSE_META[cmpB.value];
      if (!a || !b) return;
      const rows = [
        ['Duration', a.dur, b.dur],
        ['Eligibility', a.elig, b.elig],
        ['Clinical Training', a.clinical, b.clinical],
        ['Indicative Tuition', a.fee, b.fee],
        ['Primary Career Track', a.role, b.role]
      ];
      cmpOut.innerHTML =
        '<table class="data-table"><thead><tr><th>Criterion</th><th>' + a.name + '</th><th>' + b.name + '</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td data-label="Criterion"><strong>' + r[0] + '</strong></td>' +
            '<td data-label="' + a.name + '">' + r[1] + '</td>' +
            '<td data-label="' + b.name + '">' + r[2] + '</td></tr>';
        }).join('') + '</tbody></table>';
    };

    if (cmpA && cmpB) {
      cmpA.addEventListener('change', renderCompare);
      cmpB.addEventListener('change', renderCompare);
      renderCompare();
    }
  }

  /* ------------------------------------------------------------------------
     9. ADMISSIONS MULTI-STEP FORM, SAVE DRAFT & ELIGIBILITY CHECKER
     ------------------------------------------------------------------------ */
  /**
   * Drive the 5-step admissions form with validation, draft persistence, and eligibility checker.
   */
  function initAdmissions() {
    // Eligibility Checker
    const eligForm = doc.querySelector('#eligibility-checker-form');
    const eligResult = doc.querySelector('#eligibility-result');
    if (eligForm && eligResult) {
      eligForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const stream = eligForm.querySelector('[name="elig_stream"]').value;
        const pct = parseFloat(eligForm.querySelector('[name="elig_pct"]').value || '0');
        const age = parseInt(eligForm.querySelector('[name="elig_age"]').value || '0', 10);
        let matches = [];
        if (age < 17) {
          eligResult.innerHTML = '<strong>Minimum age requirement:</strong> Applicants must be at least 17 years old by December 31 of the admission year.';
          eligResult.className = 'form-success-banner is-visible';
          return;
        }
        if (stream === 'pcb' && pct >= 45) {
          matches = ['B.Sc. Nursing', 'GNM', 'DMLT', 'Radiology & Imaging', 'OT Technology', 'Dialysis Tech', 'EMT'];
        } else if (stream === 'science' && pct >= 40) {
          matches = ['GNM', 'DMLT', 'Radiology & Imaging', 'OT Technology', 'Pharmacy Assistant', 'EMT'];
        } else if (stream === 'gnm') {
          matches = ['Post Basic B.Sc. Nursing (2-Year RN Upgrade)'];
        } else if (pct >= 40) {
          matches = ['GNM (Arts/Commerce Stream)', 'ANM', 'EMT', 'Patient Care Assistant', 'Physiotherapy Assistant'];
        } else {
          matches = ['Patient Care Assistant (Certificate)', 'Speak with Admissions Counselor for Bridge Options'];
        }
        eligResult.innerHTML = '<strong>Eligible Programs (' + matches.length + '):</strong> ' + matches.join(' • ');
        eligResult.className = 'form-success-banner is-visible';
      });
    }

    // 5-Step Application Form
    const appForm = doc.querySelector('#admission-multistep-form');
    if (!appForm) return;

    const steps = Array.from(appForm.querySelectorAll('.form-step'));
    const dots = Array.from(doc.querySelectorAll('.stepper__step'));
    const reviewBox = doc.querySelector('#admission-review-summary');
    let currentStep = 0;

    const showStep = function (idx) {
      currentStep = Math.max(0, Math.min(steps.length - 1, idx));
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === currentStep); });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === currentStep);
        d.classList.toggle('is-done', i < currentStep);
      });
      if (currentStep === steps.length - 1 && reviewBox) {
        const fd = new FormData(appForm);
        const summaryPairs = [
          ['Applicant Name', fd.get('full_name') || '—'],
          ['Email / Phone', (fd.get('email') || '—') + ' | ' + (fd.get('phone') || '—')],
          ['Highest Qualification', (fd.get('qualification') || '—') + ' (' + (fd.get('percentage') || '—') + '%)'],
          ['Preferred Program', fd.get('program') || '—'],
          ['Hostel Required', fd.get('hostel') || 'No']
        ];
        reviewBox.innerHTML = summaryPairs.map(function (p) {
          return '<div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)"><span>' +
            p[0] + '</span><strong>' + p[1] + '</strong></div>';
        }).join('');
      }
    };

    const validateCurrentStep = function () {
      const inputs = steps[currentStep].querySelectorAll('input, select, textarea');
      let ok = true;
      inputs.forEach(function (inp) {
        if (!validateField(inp)) ok = false;
      });
      return ok;
    };

    appForm.querySelectorAll('[data-step-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateCurrentStep()) showStep(currentStep + 1);
        else showToast('Please complete required details in this step.', 'warning');
      });
    });

    appForm.querySelectorAll('[data-step-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () { showStep(currentStep - 1); });
    });

    const saveBtn = doc.querySelector('#save-draft-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        const data = {};
        appForm.querySelectorAll('input, select, textarea').forEach(function (el) {
          if (el.name && el.type !== 'file') data[el.name] = el.value;
        });
        try {
          localStorage.setItem(STORAGE_DRAFT, JSON.stringify(data));
          showToast('Application draft saved locally on this device.', 'success');
        } catch (e) {
          showToast('Unable to access browser storage.', 'warning');
        }
      });
    }

    // Restore saved draft if present
    try {
      const raw = localStorage.getItem(STORAGE_DRAFT);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.keys(parsed).forEach(function (k) {
          const el = appForm.querySelector('[name="' + k + '"]');
          if (el && el.type !== 'file') el.value = parsed[k];
        });
      }
    } catch (e) { /* ignore */ }

    showStep(0);
  }

  /* ------------------------------------------------------------------------
     10. FACILITIES MAP, INSTRUCTORS, RESOURCES, GALLERY LIGHTBOX, BLOG, AUTH
     ------------------------------------------------------------------------ */
  /**
   * Bind page-specific interactive widgets cleanly across secondary pages.
   */
  function initSecondaryPages() {
    // Facilities Interactive Campus Map filter
    doc.querySelectorAll('[data-map-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.getAttribute('data-map-filter');
        doc.querySelectorAll('[data-map-filter]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        doc.querySelectorAll('.campus-zone').forEach(function (z) {
          const match = cat === 'all' || z.getAttribute('data-zone-cat') === cat;
          z.classList.toggle('is-highlighted', match && cat !== 'all');
          z.style.opacity = match ? '1' : '0.36';
        });
      });
    });

    // Instructors Department Filter
    const facultyCards = doc.querySelectorAll('[data-dept]');
    if (facultyCards.length) {
      doc.querySelectorAll('[data-dept-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const dept = btn.getAttribute('data-dept-filter');
          doc.querySelectorAll('[data-dept-filter]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          facultyCards.forEach(function (c) {
            c.style.display = (dept === 'all' || c.getAttribute('data-dept') === dept) ? '' : 'none';
          });
        });
      });
    }

    // Resources Search + Category Filter
    const resSearch = doc.querySelector('#resource-search');
    const resRows = doc.querySelectorAll('[data-res-cat]');
    if (resRows.length) {
      let activeResCat = 'all';
      const filterRes = function () {
        const q = (resSearch ? resSearch.value : '').trim().toLowerCase();
        resRows.forEach(function (row) {
          const cOk = activeResCat === 'all' || row.getAttribute('data-res-cat') === activeResCat;
          const qOk = !q || row.textContent.toLowerCase().includes(q);
          row.style.display = (cOk && qOk) ? '' : 'none';
        });
      };
      doc.querySelectorAll('[data-res-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeResCat = btn.getAttribute('data-res-filter');
          doc.querySelectorAll('[data-res-filter]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          filterRes();
        });
      });
      if (resSearch) resSearch.addEventListener('input', filterRes);
    }

    // Gallery Category Filter & Lightbox
    const galItems = Array.from(doc.querySelectorAll('.gallery-item'));
    const lightbox = doc.querySelector('#gallery-lightbox');
    if (galItems.length) {
      doc.querySelectorAll('[data-gallery-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const cat = btn.getAttribute('data-gallery-filter');
          doc.querySelectorAll('[data-gallery-filter]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          galItems.forEach(function (item) {
            item.style.display = (cat === 'all' || item.getAttribute('data-gal-cat') === cat) ? '' : 'none';
          });
        });
      });

      if (lightbox) {
        const lbImg = lightbox.querySelector('#lightbox-img');
        const lbCap = lightbox.querySelector('#lightbox-caption');
        const closeLb = function () {
          lightbox.classList.remove('is-open');
          doc.body.style.overflow = '';
        };
        galItems.forEach(function (item) {
          item.addEventListener('click', function () {
            const img = item.querySelector('img');
            if (lbImg && img) {
              lbImg.src = img.currentSrc || img.src;
              lbImg.alt = img.alt;
            }
            if (lbCap) lbCap.textContent = item.getAttribute('data-caption') || (img ? img.alt : '');
            lightbox.classList.add('is-open');
            doc.body.style.overflow = 'hidden';
          });
        });
        lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (b) {
          b.addEventListener('click', closeLb);
        });
        lightbox.addEventListener('click', function (e) {
          if (e.target === lightbox) closeLb();
        });
        doc.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLb();
        });
      }
    }

    // Blog Category Filter & Share Copy
    const blogCards = doc.querySelectorAll('[data-blog-cat]');
    if (blogCards.length) {
      doc.querySelectorAll('[data-blog-filter]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const cat = btn.getAttribute('data-blog-filter');
          doc.querySelectorAll('[data-blog-filter]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          blogCards.forEach(function (c) {
            c.style.display = (cat === 'all' || c.getAttribute('data-blog-cat') === cat) ? '' : 'none';
          });
        });
      });
    }

    doc.querySelectorAll('[data-copy-link]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(global.location.href).catch(function () {});
        }
        showToast('Article link copied to clipboard.', 'success');
      });
    });

    // Placements Charts (if present)
    if (global.LifeBridgeCharts) {
      const rateChart = doc.querySelector('#placement-rate-chart');
      if (rateChart) {
        global.LifeBridgeCharts.renderBarChart(rateChart, {
          labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
          values: [89, 91, 93, 95, 96, 97],
          unit: '%',
          max: 100,
          accentIndex: 5,
          ariaLabel: 'Year-wise campus placement percentage from 2021 to 2026'
        });
      }
      const sectorChart = doc.querySelector('#placement-sector-chart');
      if (sectorChart) {
        global.LifeBridgeCharts.renderDonutChart(sectorChart, {
          items: [
            { label: 'Multi-Specialty Hospitals', value: 52, color: '#0E8B8B' },
            { label: 'Critical Care & Trauma ICUs', value: 22, color: '#FF6B5E' },
            { label: 'International NHS / Gulf Trusts', value: 14, color: '#E3B85C' },
            { label: 'Diagnostic & Allied Labs', value: 12, color: '#143E49' }
          ],
          centerValue: '96.8%',
          centerLabel: 'Placed 2026',
          ariaLabel: 'Placement distribution by healthcare sector'
        });
      }
    }

    // Login Role Switch, OTP Mode & Rotating Quote
    doc.querySelectorAll('[data-auth-role]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        doc.querySelectorAll('[data-auth-role]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        const idInput = doc.querySelector('#login-id');
        const role = btn.getAttribute('data-auth-role');
        if (idInput) {
          idInput.placeholder = role === 'student' ? 'LB-2024-NUR-084 or student@lifebridge.edu' :
            (role === 'faculty' ? 'FAC-104 or faculty@lifebridge.edu' : 'admin@lifebridge.edu');
        }
      });
    });

    const otpBtn = doc.querySelector('#toggle-otp-login');
    const pwGroup = doc.querySelector('#password-field-group');
    const otpGroup = doc.querySelector('#otp-field-group');
    if (otpBtn && pwGroup && otpGroup) {
      otpBtn.addEventListener('click', function () {
        const usingOtp = otpGroup.hidden;
        otpGroup.hidden = !usingOtp;
        pwGroup.hidden = usingOtp;
        const pwIn = pwGroup.querySelector('input');
        const otpIn = otpGroup.querySelector('input');
        if (pwIn) pwIn.disabled = usingOtp;
        if (otpIn) otpIn.disabled = !usingOtp;
        otpBtn.textContent = usingOtp ? 'Use Password Instead' : 'Sign in with One-Time OTP';
        if (usingOtp) showToast('Demo OTP 482910 sent to your registered mobile.', 'info');
      });
    }

    const quoteEl = doc.querySelector('[data-rotating-quotes]');
    if (quoteEl) {
      const quotes = [
        '"Precision in procedure, warmth in presence — that is the bedside standard we practice every shift." — Florence Clinical Charter',
        '"Every vital sign tells a human story. Listen with your stethoscope and your empathy." — Dr. Nandini Rao, Principal',
        '"Calm hands save seconds in the golden hour; disciplined simulation builds calm hands." — Trauma & EMT Faculty'
      ];
      let qi = 0;
      global.setInterval(function () {
        qi = (qi + 1) % quotes.length;
        quoteEl.textContent = quotes[qi];
      }, 5200);
    }
  }

  /* ------------------------------------------------------------------------
     11. PREMIUM EXTRAS: COMMAND PALETTE (Ctrl/Cmd+K), QUIZ, PROSPECTUS, HELPLINE
     ------------------------------------------------------------------------ */
  /**
   * Inject and manage Command Palette search, 3-question Course Quiz,
   * Prospectus Download modal, and floating Helpline popover.
   */
  function initPremiumModals() {
    // Prefix path depending on whether inside /pages/dashboard/ or /pages/
    const inSubdir = global.location.pathname.includes('/dashboard/') || global.location.pathname.includes('/admin/');
    const p = inSubdir ? '../' : '';

    const SEARCH_INDEX = [
      { title: 'Home 1 — Editorial Overview', meta: 'Page', url: p + 'index.html' },
      { title: 'Home 2 — Cinematic Course Finder', meta: 'Page', url: p + 'home-2.html' },
      { title: 'B.Sc. Nursing (4 Years)', meta: 'Course', url: p + 'course-details.html' },
      { title: 'GNM, ANM, DMLT & 12 Accredited Programs', meta: 'Courses', url: p + 'courses.html' },
      { title: 'Advanced Simulation & Clinical Labs', meta: 'Facilities', url: p + 'facilities.html' },
      { title: 'Placements, Recruiters & Overseas NCLEX', meta: 'Placements', url: p + 'placements.html' },
      { title: 'Faculty & Visiting Clinicians Directory', meta: 'Instructors', url: p + 'instructors.html' },
      { title: 'Apply Online — Multi-Step Admissions', meta: 'Admissions', url: p + 'admissions.html' },
      { title: 'Syllabus, Notices & E-Library Downloads', meta: 'Resources', url: p + 'resources.html' },
      { title: 'Campus Photo Gallery', meta: 'Gallery', url: p + 'gallery.html' },
      { title: 'Healthcare Career Guides & Blog', meta: 'Blog', url: p + 'blog.html' },
      { title: 'Contact & Campus Visit Booking', meta: 'Contact', url: p + 'contact.html' },
      { title: 'Student Portal Login', meta: 'Portal', url: p + 'login.html' },
      { title: 'Student Dashboard Overview', meta: 'Dashboard', url: p + 'dashboard/overview.html' }
    ];

    // Command Palette Modal
    const cmdBackdrop = doc.createElement('div');
    cmdBackdrop.className = 'lb-modal-backdrop';
    cmdBackdrop.id = 'cmd-palette-modal';
    cmdBackdrop.setAttribute('role', 'dialog');
    cmdBackdrop.setAttribute('aria-modal', 'true');
    cmdBackdrop.setAttribute('aria-label', 'Quick site search');
    cmdBackdrop.innerHTML =
      '<div class="lb-modal">' +
        '<button type="button" class="icon-btn lb-modal__close" data-close-modal aria-label="Close search">' +
          (global.LifeBridgeIcons ? global.LifeBridgeIcons.getSvg('x', 18) : 'X') +
        '</button>' +
        '<span class="eyebrow">Quick Command Search (Ctrl + K)</span>' +
        '<h3>Jump to Programs, Labs &amp; Pages</h3>' +
        '<div class="field" style="margin-top:12px">' +
          '<label class="sr-only" for="cmd-search-input">Search LifeBridge Institute</label>' +
          '<input id="cmd-search-input" class="field__input" type="search" placeholder="Search B.Sc. Nursing, Simulation Lab, Syllabus, Fees...">' +
        '</div>' +
        '<div class="cmd-results" id="cmd-results"></div>' +
      '</div>';
    doc.body.appendChild(cmdBackdrop);

    const cmdInput = cmdBackdrop.querySelector('#cmd-search-input');
    const cmdList = cmdBackdrop.querySelector('#cmd-results');

    const renderCmd = function (q) {
      const term = (q || '').trim().toLowerCase();
      const hits = SEARCH_INDEX.filter(function (it) {
        return !term || it.title.toLowerCase().includes(term) || it.meta.toLowerCase().includes(term);
      });
      cmdList.innerHTML = hits.length
        ? hits.map(function (h) {
            return '<a class="cmd-result-item" href="' + h.url + '"><strong>' + h.title + '</strong><span class="badge-pill badge-pill--info">' + h.meta + '</span></a>';
          }).join('')
        : '<p style="text-align:center;padding:16px">No matching pages found. Try "Nursing", "Lab", or "Fees".</p>';
    };

    const openCmd = function () {
      cmdBackdrop.classList.add('is-open');
      renderCmd('');
      global.setTimeout(function () { cmdInput.focus(); }, 60);
    };

    cmdInput.addEventListener('input', function () { renderCmd(cmdInput.value); });
    doc.querySelectorAll('[data-open-search]').forEach(function (b) {
      b.addEventListener('click', openCmd);
    });

    doc.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmd();
      }
      if (e.key === 'Escape') {
        doc.querySelectorAll('.lb-modal-backdrop.is-open').forEach(function (m) { m.classList.remove('is-open'); });
      }
    });

    // 3-Question "Find Your Course" Quiz Modal
    const quizBackdrop = doc.createElement('div');
    quizBackdrop.className = 'lb-modal-backdrop';
    quizBackdrop.id = 'course-quiz-modal';
    quizBackdrop.setAttribute('role', 'dialog');
    quizBackdrop.setAttribute('aria-modal', 'true');
    quizBackdrop.setAttribute('aria-label', 'Find your ideal healthcare course quiz');
    quizBackdrop.innerHTML =
      '<div class="lb-modal">' +
        '<button type="button" class="icon-btn lb-modal__close" data-close-modal aria-label="Close course quiz">' +
          (global.LifeBridgeIcons ? global.LifeBridgeIcons.getSvg('x', 18) : 'X') +
        '</button>' +
        '<span class="eyebrow">3-Question Career Match</span>' +
        '<h3>Find Your Ideal Healthcare Program</h3>' +
        '<form id="lb-quiz-form" class="form-grid" style="margin-top:16px">' +
          '<div class="field"><label class="field__label" for="qz-interest">1. Where do you see yourself making the biggest impact?</label>' +
            '<select id="qz-interest" class="field__select">' +
              '<option value="bedside">Direct bedside &amp; ICU patient nursing care</option>' +
              '<option value="diagnostics">Lab diagnostics, pathology &amp; medical imaging</option>' +
              '<option value="emergency">Fast-paced ambulance trauma &amp; operation theatre</option>' +
              '<option value="community">Community midwifery, rehab &amp; pharmacy support</option>' +
            '</select></div>' +
          '<div class="field"><label class="field__label" for="qz-qual">2. Your current academic qualification?</label>' +
            '<select id="qz-qual" class="field__select">' +
              '<option value="pcb">10+2 with Biology (PCB)</option>' +
              '<option value="any12">10+2 (Arts / Commerce / Maths)</option>' +
              '<option value="rn">Completed GNM Diploma</option>' +
            '</select></div>' +
          '<div class="field"><label class="field__label" for="qz-goal">3. Preferred training duration?</label>' +
            '<select id="qz-goal" class="field__select">' +
              '<option value="degree">Full 4-Year Degree (Global NCLEX / NHS pathway)</option>' +
              '<option value="diploma">2–3 Year Clinical Diploma (Fast hospital entry)</option>' +
              '<option value="cert">1-Year Rapid Job-Ready Certificate</option>' +
            '</select></div>' +
          '<button type="submit" class="btn btn-primary" style="width:100%">Reveal Recommended Program</button>' +
        '</form>' +
        '<div id="lb-quiz-result" class="form-success-banner" style="flex-direction:column;text-align:center"></div>' +
      '</div>';
    doc.body.appendChild(quizBackdrop);

    quizBackdrop.querySelector('#lb-quiz-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const intr = doc.getElementById('qz-interest').value;
      const qual = doc.getElementById('qz-qual').value;
      const goal = doc.getElementById('qz-goal').value;
      let rec = 'B.Sc. Nursing (4 Years)';
      let reason = 'Highest global demand across tertiary ICUs and NHS/NCLEX pathways with 2,100+ supervised clinical hours.';
      if (qual === 'rn') {
        rec = 'Post Basic B.Sc. Nursing (2 Years)';
        reason = 'Upgrades your GNM diploma to a full university degree for nursing leadership and international placements.';
      } else if (intr === 'diagnostics') {
        rec = goal === 'cert' ? 'Diploma in Medical Lab Technology (DMLT)' : 'Radiology & Imaging Technology / DMLT';
        reason = 'Ideal for analytical minds thriving in NABL diagnostic laboratories and CT/MRI suites.';
      } else if (intr === 'emergency') {
        rec = goal === 'cert' ? 'Emergency Medical Technician (EMT — 1 Year)' : 'Operation Theatre Technology (2 Years)';
        reason = 'Hands-on trauma, ambulance ACLS, and surgical suite protocols with 97% immediate hospital absorption.';
      } else if (intr === 'community' || qual === 'any12') {
        rec = goal === 'cert' ? 'Patient Care / Pharmacy Assistant (1 Year)' : 'GNM — General Nursing & Midwifery (3 Years)';
        reason = 'Open to all 10+2 streams with comprehensive hospital ward and maternal-child clinical postings.';
      }
      const resBox = doc.getElementById('lb-quiz-result');
      resBox.innerHTML = '<strong>Recommended: ' + rec + '</strong><span>' + reason + '</span>' +
        '<a class="btn btn-accent" style="margin-top:8px" href="' + p + 'admissions.html">Apply for This Program</a>';
      resBox.classList.add('is-visible');
    });

    doc.querySelectorAll('[data-open-quiz]').forEach(function (b) {
      b.addEventListener('click', function () { quizBackdrop.classList.add('is-open'); });
    });

    // Prospectus Download Modal
    const prospBackdrop = doc.createElement('div');
    prospBackdrop.className = 'lb-modal-backdrop';
    prospBackdrop.id = 'prospectus-modal';
    prospBackdrop.setAttribute('role', 'dialog');
    prospBackdrop.setAttribute('aria-modal', 'true');
    prospBackdrop.setAttribute('aria-label', 'Download 2026-27 Academic Prospectus');
    prospBackdrop.innerHTML =
      '<div class="lb-modal">' +
        '<button type="button" class="icon-btn lb-modal__close" data-close-modal aria-label="Close prospectus modal">' +
          (global.LifeBridgeIcons ? global.LifeBridgeIcons.getSvg('x', 18) : 'X') +
        '</button>' +
        '<span class="eyebrow eyebrow--gold">2026–27 Academic Brochure</span>' +
        '<h3>Download Official Prospectus (PDF)</h3>' +
        '<p>Includes complete fee structures, INC/State Council seat matrix, hostel tariff, and hospital rotation schedule.</p>' +
        '<form id="prospectus-form" class="form-grid" data-validate data-success-msg="Prospectus PDF ready! Check your downloads & inbox.">' +
          '<div class="field"><label class="field__label" for="pr-name">Full Name</label>' +
            '<input id="pr-name" class="field__input" type="text" required placeholder="e.g. Ananya Deshmukh"><span class="field__error"></span></div>' +
          '<div class="field"><label class="field__label" for="pr-phone">Phone / WhatsApp</label>' +
            '<input id="pr-phone" class="field__input" type="tel" required placeholder="+91 98765 43210"><span class="field__error"></span></div>' +
          '<div class="field"><label class="field__label" for="pr-course">Program of Interest</label>' +
            '<select id="pr-course" class="field__select" required><option value="B.Sc. Nursing">B.Sc. Nursing</option><option value="GNM">GNM Diploma</option><option value="DMLT">DMLT</option><option value="Radiology">Radiology &amp; Imaging</option><option value="EMT">Emergency Medical Technician</option></select><span class="field__error"></span></div>' +
          '<button type="submit" class="btn btn-accent" style="width:100%">Unlock Prospectus PDF</button>' +
          '<div class="form-success-banner">Prospectus unlocked! Your download link has been emailed and queued.</div>' +
        '</form>' +
      '</div>';
    doc.body.appendChild(prospBackdrop);

    doc.querySelectorAll('[data-open-prospectus]').forEach(function (b) {
      b.addEventListener('click', function () { prospBackdrop.classList.add('is-open'); });
    });

    // Close modal handlers
    doc.querySelectorAll('.lb-modal-backdrop').forEach(function (bg) {
      bg.addEventListener('click', function (e) {
        if (e.target === bg || e.target.closest('[data-close-modal]')) {
          bg.classList.remove('is-open');
        }
      });
    });

    // Floating Helpline Popover
    const helpBtn = doc.querySelector('[data-helpline-toggle]');
    const helpPop = doc.querySelector('.helpline-popover');
    if (helpBtn && helpPop) {
      helpBtn.addEventListener('click', function () {
        const open = helpPop.classList.toggle('is-open');
        helpBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }

  /* ------------------------------------------------------------------------
     SCROLL-TO-TOP FLOATING BUTTON
     ------------------------------------------------------------------------ */
  function initScrollTop() {
    if (doc.querySelector('.scroll-top-btn')) return;
    const btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'scroll-top-btn no-print';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<span data-icon="chevron-up" data-size="20"></span>';
    doc.body.appendChild(btn);

    function toggleVisibility() {
      const y = global.scrollY || doc.documentElement.scrollTop || 0;
      btn.classList.toggle('is-visible', y > 320);
    }

    global.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', function () {
      global.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     CARD ROW ALIGNMENT (Headings, Text, Subtext & Footers across all grids)
     ------------------------------------------------------------------------ */
  function alignCardGrid(grid) {
    const cards = Array.from(grid.children).filter(function (el) {
      return el.classList && el.classList.contains('card') && el.offsetParent !== null;
    });
    if (!cards.length) return;

    const selectors = ['.card__tag', '.card__title', '.card__text', '.card__meta'];

    cards.forEach(function (card) {
      selectors.forEach(function (sel) {
        const el = card.querySelector(sel);
        if (el) el.style.minHeight = '';
      });
    });

    const rows = [];
    cards.forEach(function (card) {
      const top = card.offsetTop;
      let row = rows.find(function (r) { return Math.abs(r.top - top) <= 6; });
      if (!row) {
        row = { top: top, items: [] };
        rows.push(row);
      }
      row.items.push(card);
    });

    rows.forEach(function (row) {
      if (row.items.length < 2) return;
      selectors.forEach(function (sel) {
        let maxH = 0;
        const els = [];
        row.items.forEach(function (card) {
          const el = card.querySelector(sel);
          if (el) {
            const h = el.offsetHeight;
            if (h > maxH) maxH = h;
            els.push(el);
          }
        });
        if (els.length >= 2 && maxH > 0) {
          const px = maxH + 'px';
          els.forEach(function (el) { el.style.minHeight = px; });
        }
      });
    });
  }

  function initCardAlignment() {
    const grids = Array.from(doc.querySelectorAll('.grid, .process-grid, .bento-grid'));
    if (!grids.length) return;

    function runAll() {
      grids.forEach(alignCardGrid);
    }

    let resizeTimer = null;
    function scheduleRun() {
      if (resizeTimer) global.clearTimeout(resizeTimer);
      resizeTimer = global.setTimeout(function () {
        global.requestAnimationFrame(runAll);
      }, 80);
    }

    runAll();
    global.addEventListener('load', runAll);
    global.addEventListener('resize', scheduleRun);
    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready.then(runAll);
    }

    doc.addEventListener('click', function (e) {
      if (e.target.closest('[role="tab"], [data-filter], .filter-chip, .tab-btn')) {
        global.setTimeout(runAll, 60);
      }
    });
  }

  /* ------------------------------------------------------------------------
     BOOTSTRAP
     ------------------------------------------------------------------------ */
  doc.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initRtl();
    initPreloader();
    initNavigation();
    initReveals();
    initHeroWordSwap();
    initHome2Hero();
    initTabs();
    initHotspots();
    initAccordions();
    initCountdowns();
    initCoursesPage();
    initAdmissions();
    initSecondaryPages();
    initPremiumModals();
    initForms();
    initDesktopPolish();
    initScrollTop();
    initCardAlignment();
    if (global.LifeBridgeIcons) global.LifeBridgeIcons.render(doc);
  });
})(window, document);
