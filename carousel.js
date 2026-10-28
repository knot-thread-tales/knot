// ============================================================
// Knot & Thread Tales — Hero Carousel
// Standalone: no dependency on app.js. Styles live in styles.css.
//
// IMAGES (upload to the  images/banners/  folder of your repo):
//   hero-1-desktop.jpg   hero-1-mobile.jpg
//   hero-2-desktop.jpg   hero-2-mobile.jpg
//   hero-3-desktop.jpg   hero-3-mobile.jpg
// "desktop" file is used on screens ≥ 700px wide (tablet + desktop),
// "mobile" file on phones. If a file is missing, that slide is skipped;
// if all are missing the carousel hides itself and the old hero shows.
// ============================================================
(function () {
  'use strict';

  var CAROUSEL = {
    folder: 'images/banners/',
    ext: 'jpg',            // change to 'webp' / 'png' here if you export a different format
    autoplayMs: 5500,
    hideTextHero: false,   // true = hide the text hero ("Where Every Stitch…") under the carousel
    slides: [
      { id: 'hero-1', link: '/products',                 alt: 'Art in every stitch — explore our handmade crochet collection' },
      { id: 'hero-2', link: '/category/handmade-gifts',  alt: 'Handmade gifts made just for you — shop gifts' },
      { id: 'hero-3', link: '/category/crochet',         alt: 'Crochet bags and accessories — shop the crochet collection' }
    ]
  };

  var ARROW_PREV = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  var ARROW_NEXT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

  function init() {
    var section = document.getElementById('heroCarousel');
    if (!section || !CAROUSEL.slides.length) return;

    var slides = CAROUSEL.slides.slice();
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var index = 0, timer = null;
    var hovering = false, focused = false, inView = true, dragging = false, suppressClick = false;

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function src(id, kind) { return CAROUSEL.folder + id + '-' + kind + '.' + CAROUSEL.ext; }

    function slideHtml(s, i) {
      return '<a class="hc__slide" href="#' + esc(s.link) + '" data-route="' + esc(s.link) + '" role="group" aria-roledescription="slide" data-id="' + esc(s.id) + '">' +
        '<picture>' +
          '<source media="(max-width: 699px)" srcset="' + esc(src(s.id, 'mobile')) + '">' +
          '<img src="' + esc(src(s.id, 'desktop')) + '" alt="' + esc(s.alt) + '" decoding="async" draggable="false" fetchpriority="' + (i === 0 ? 'high' : 'low') + '">' +
        '</picture>' +
      '</a>';
    }

    section.innerHTML =
      '<div class="hc__frame">' +
        '<div class="hc__viewport"><div class="hc__track" aria-live="off">' + slides.map(slideHtml).join('') + '</div></div>' +
        '<button type="button" class="hc__arrow hc__arrow--prev" aria-label="Previous slide">' + ARROW_PREV + '</button>' +
        '<button type="button" class="hc__arrow hc__arrow--next" aria-label="Next slide">' + ARROW_NEXT + '</button>' +
        '<div class="hc__dots" role="group" aria-label="Choose slide"></div>' +
      '</div>';

    document.body.classList.add('has-hero-carousel');
    if (CAROUSEL.hideTextHero) document.body.classList.add('hero-carousel-only');

    var viewport = section.querySelector('.hc__viewport');
    var track = section.querySelector('.hc__track');
    var dotsWrap = section.querySelector('.hc__dots');
    var prevBtn = section.querySelector('.hc__arrow--prev');
    var nextBtn = section.querySelector('.hc__arrow--next');

    function slideEls() { return Array.prototype.slice.call(track.children); }

    function buildDots() {
      dotsWrap.innerHTML = slides.map(function (_, i) {
        return '<button type="button" class="hc__dot" aria-label="Go to slide ' + (i + 1) + '"></button>';
      }).join('');
      dotsWrap.style.display = slides.length > 1 ? '' : 'none';
      var show = slides.length > 1 ? '' : 'none';
      prevBtn.style.display = show; nextBtn.style.display = show;
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.addEventListener('click', function () { go(i); restart(); });
      });
    }

    function updateState() {
      var n = slides.length;
      slideEls().forEach(function (el, i) {
        el.setAttribute('aria-label', (i + 1) + ' of ' + n);
        if (i === index) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true');
        el.tabIndex = i === index ? 0 : -1;
      });
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }

    function go(i, instant) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      if (instant) track.classList.add('no-anim');
      track.style.transform = 'translate3d(' + (-index * 100) + '%,0,0)';
      if (instant) { void track.offsetWidth; track.classList.remove('no-anim'); }
      updateState();
    }

    // ── autoplay ────────────────────────────────────────────
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (reduceMotion || slides.length < 2 || hovering || focused || dragging || !inView || document.hidden) return;
      timer = setInterval(function () { go(index + 1); }, CAROUSEL.autoplayMs);
    }
    function restart() { start(); }

    // ── missing image → drop that slide ─────────────────────
    function dropSlide(el) {
      var i = slideEls().indexOf(el);
      if (i < 0) return;
      el.parentNode.removeChild(el);
      slides.splice(i, 1);
      if (!slides.length) { destroy(); return; }
      if (i < index) index--;
      if (index >= slides.length) index = slides.length - 1;
      buildDots(); go(index, true); start();
    }
    track.addEventListener('error', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('.hc__slide') : null;
      if (el) dropSlide(el);
    }, true);   // 'error' doesn't bubble, so listen in the capture phase

    function destroy() {
      stop();
      section.hidden = true;
      section.innerHTML = '';
      document.body.classList.remove('has-hero-carousel', 'hero-carousel-only');
    }

    // ── controls ────────────────────────────────────────────
    prevBtn.addEventListener('click', function () { go(index - 1); restart(); });
    nextBtn.addEventListener('click', function () { go(index + 1); restart(); });

    section.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { go(index - 1); restart(); }
      if (e.key === 'ArrowRight') { go(index + 1); restart(); }
    });

    section.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hovering = true; stop(); } });
    section.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hovering = false; start(); } });
    section.addEventListener('focusin',  function () { focused = true;  stop(); track.setAttribute('aria-live', 'polite'); });
    section.addEventListener('focusout', function () { focused = false; start(); track.setAttribute('aria-live', 'off'); });
    document.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting; start();
      }, { threshold: 0.25 }).observe(section);
    }

    // ── swipe / drag (touch + mouse) ────────────────────────
    var startX = 0, startY = 0, startT = 0, dx = 0, tracking = false, pid = null;

    viewport.addEventListener('pointerdown', function (e) {
      if (slides.length < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
      tracking = true; dragging = false; dx = 0; pid = e.pointerId;
      startX = e.clientX; startY = e.clientY; startT = Date.now();
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!tracking || e.pointerId !== pid) return;
      var mx = e.clientX - startX, my = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) {
          dragging = true; stop();
          viewport.classList.add('is-dragging');
          track.classList.add('no-anim');
          if (e.pointerType === 'mouse') { try { viewport.setPointerCapture(pid); } catch (_) {} }
        } else { return; }
      }
      dx = mx;
      track.style.transform = 'translate3d(calc(' + (-index * 100) + '% + ' + dx + 'px),0,0)';
    });
    function endDrag(cancelled) {
      if (!tracking) return;
      tracking = false;
      var wasDragging = dragging;
      dragging = false;
      viewport.classList.remove('is-dragging');
      track.classList.remove('no-anim');
      if (wasDragging) {
        suppressClick = true; setTimeout(function () { suppressClick = false; }, 60);
        var w = viewport.offsetWidth || 1;
        var fast = Math.abs(dx) / Math.max(Date.now() - startT, 1) > 0.5;   // flick
        if (!cancelled && (Math.abs(dx) > Math.max(40, w * 0.15) || (fast && Math.abs(dx) > 20))) go(index + (dx < 0 ? 1 : -1));
        else go(index);
      }
      start();
    }
    viewport.addEventListener('pointerup',     function () { endDrag(false); });
    viewport.addEventListener('pointercancel', function () { endDrag(true); });
    // Don't follow the slide link if the gesture was a swipe. Runs in capture
    // phase, before app.js's document-level [data-route] click handler.
    section.addEventListener('click', function (e) {
      if (suppressClick) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    buildDots();
    go(0, true);
    start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
