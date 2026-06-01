/* ============================================================================
   WideCast landing — interactions (self-contained, no framework, no deps).
   PLACEHOLDER data lives here too: the agent transcript platform list.
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── nav: stuck shadow + mobile menu ─────────────────────────────────── */
  var nav = $("#nav");
  function onScroll() { if (nav) nav.classList.toggle("is-stuck", window.scrollY > 12); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var burger = $("#navBurger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav-links a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("menu-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── generic tab groups (install + code) ─────────────────────────────── */
  function wireTabs(scope, tabSel, paneSel) {
    $$(tabSel, scope).forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-tab");
        $$(tabSel, scope).forEach(function (t) { t.classList.remove("is-active"); });
        $$(paneSel, scope).forEach(function (p) { p.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var pane = scope.querySelector(paneSel + '[data-pane="' + key + '"]');
        if (pane) pane.classList.add("is-active");
      });
    });
  }
  $$('[data-tabs="install"]').forEach(function (s) { wireTabs(s, ".install-tab", ".install-pane"); });
  $$('[data-tabs="code"]').forEach(function (s) { wireTabs(s, ".code-tab", ".code-pane"); });

  /* ── copy buttons ────────────────────────────────────────────────────── */
  $$(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function () {
        var prev = btn.textContent;
        btn.textContent = "Copied"; btn.classList.add("copied");
        setTimeout(function () { btn.textContent = prev; btn.classList.remove("copied"); }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ── inert placeholder links (docs/playground not wired yet) ─────────── */
  $$('a[data-ext]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "#") e.preventDefault(); // avoid jump-to-top on placeholders
    });
  });

  /* ── scroll reveal ───────────────────────────────────────────────────── */
  var revealEls = $$(".section-head, .card, .demo, .int, .feat, .loop, .human-visual, .final-inner");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    revealEls.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = ((i % 4) * 60) + "ms";
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ── agent terminal: staggered line reveal (PLACEHOLDER transcript) ──── */
  // Distribution platforms shown on the "published" line — fake set.
  var TERM_PLATFORMS = "TikTok · YouTube · IG · X · +6";
  var termPf = $("#termPlatforms");
  var termBody = $("#termBody");
  var termLines = termBody ? $$(".term-line", termBody) : [];

  function runTerminal() {
    if (!termLines.length) return;
    termLines.forEach(function (l) { l.classList.remove("show"); });
    if (termPf) termPf.textContent = "";
    if (reduce) {
      termLines.forEach(function (l) { l.classList.add("show"); });
      if (termPf) termPf.textContent = TERM_PLATFORMS;
      return;
    }
    var delay = 0;
    termLines.forEach(function (line, i) {
      // status lines linger a touch longer to feel like real work
      var role = line.getAttribute("data-role");
      var gap = (role === "status" || role === "review") ? 820 : 520;
      setTimeout(function () {
        line.classList.add("show");
        if (line.querySelector("#termPlatforms")) {
          typePlatforms(TERM_PLATFORMS);
        }
      }, delay);
      delay += (i === 0 ? 350 : gap);
    });
  }
  function typePlatforms(str) {
    if (!termPf) return;
    var n = 0;
    (function step() {
      termPf.textContent = str.slice(0, n++);
      if (n <= str.length) setTimeout(step, 28);
    })();
  }

  if (termBody) {
    if (!("IntersectionObserver" in window)) {
      runTerminal();
    } else {
      var seen = false;
      var to = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !seen) { seen = true; runTerminal(); }
        });
      }, { threshold: 0.4 });
      to.observe(termBody);
    }
  }

  /* ── the loop: light up the 10 platforms in sequence on first view ───── */
  var loopDiagram = $("#loopDiagram");
  var pfs = $$("#platforms [data-pf]");
  function lightLoop() {
    if (reduce) { pfs.forEach(function (p) { p.classList.add("lit"); }); return; }
    pfs.forEach(function (p, i) {
      setTimeout(function () { p.classList.add("lit"); }, 300 + i * 160);
    });
  }
  if (loopDiagram && pfs.length) {
    if (!("IntersectionObserver" in window)) {
      lightLoop();
    } else {
      var litOnce = false;
      var lo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !litOnce) { litOnce = true; lightLoop(); }
        });
      }, { threshold: 0.35 });
      lo.observe(loopDiagram);
    }
  }

  /* ── demo "play" placeholders: gentle feedback, no real video yet ────── */
  $$(".demo-frame[data-play]").forEach(function (frame) {
    frame.addEventListener("click", function () {
      frame.classList.toggle("is-playing");
      var btn = $(".demo-play", frame);
      if (btn) btn.style.opacity = frame.classList.contains("is-playing") ? "0.35" : "1";
    });
  });
})();
