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
  $$(".copy-btn, .install-prompt-copy").forEach(function (btn) {
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
  var revealEls = $$(".section-head, .card, .mode-card, .transform-card, .hero-studio, .broadcast-board, .demo, .int, .feat, .loop, .human-visual, .final-inner");
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
    function wave() {
      pfs.forEach(function (p) { p.classList.remove("lit"); });
      pfs.forEach(function (p, i) {
        setTimeout(function () { p.classList.add("lit"); }, i * 110);
      });
    }
    wave();
    setInterval(wave, 2400);   // re-cascade in sync with the loop dot
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

  /* ── demo reel chapters ──────────────────────────────────────────────── */
  var demoReel = $("#demoReel");
  var modeTitle = $("#modeStageTitle");
  var modeVideo = $("#modeStageVideo");
  var modeSteps = $$(".reel-chapter");
  var reelProgress = $("#reelProgress");
  var modeClasses = ["is-real", "is-avatar-real", "is-avatar-ai", "is-faceless-real", "is-faceless-ai"];
  var reelIndex = 0;
  var reelTimer = null;
  function setMode(step) {
    if (!step || !modeTitle || !modeVideo) return;
    var title = step.getAttribute("data-title") || "";
    var mode = step.getAttribute("data-mode") || "real";
    var cls = "is-" + mode;
    reelIndex = Math.max(0, modeSteps.indexOf(step));
    if (reelProgress) reelProgress.style.width = (((reelIndex + 1) / Math.max(1, modeSteps.length)) * 100) + "%";
    modeSteps.forEach(function (s) { s.classList.toggle("is-active", s === step); });
    if (modeVideo.classList.contains(cls) && modeTitle.textContent === title) return;
    modeTitle.classList.add("is-swapping");
    window.setTimeout(function () {
      modeTitle.textContent = title;
      modeTitle.classList.remove("is-swapping");
    }, reduce ? 0 : 160);
    modeClasses.forEach(function (c) { modeVideo.classList.remove(c); });
    modeVideo.classList.add(cls, "is-playing");
  }
  if (modeSteps.length && modeTitle && modeVideo) {
    setMode(modeSteps[0]);
    modeSteps.forEach(function (step) {
      step.addEventListener("click", function () {
        setMode(step);
        startReel();
      });
    });
    function startReel() {
      if (reduce) return;
      if (reelTimer) clearInterval(reelTimer);
      reelTimer = setInterval(function () {
        reelIndex = (reelIndex + 1) % modeSteps.length;
        setMode(modeSteps[reelIndex]);
      }, 3600);
    }
    function stopReel() {
      if (reelTimer) clearInterval(reelTimer);
      reelTimer = null;
    }
    if (!reduce && "IntersectionObserver" in window && demoReel) {
      var mo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) startReel();
          else stopReel();
        });
      }, { threshold: 0.35 });
      mo.observe(demoReel);
    } else {
      startReel();
    }
  }

  /* ── source switcher: five inputs into one publishable output ────────── */
  var sourceSwitcher = $("#sourceSwitcher");
  var sourceTiles = $$(".source-tile", sourceSwitcher || document);
  var sourcePreview = $("#sourceOutputPreview");
  var sourceLabel = $("#sourceOutputLabel");
  var sourceIndex = 0;
  var sourceTimer = null;
  var sourceLabels = {
    script: "Script becomes scenes",
    idea: "Idea becomes a launch reel",
    blog: "Article becomes a short",
    audio: "Voice becomes a founder reel",
    video: "Clip becomes a remake"
  };
  var sourceClasses = ["is-script", "is-idea", "is-blog", "is-audio", "is-video"];
  function setSource(tile) {
    if (!tile || !sourcePreview) return;
    var source = tile.getAttribute("data-source") || "script";
    sourceIndex = Math.max(0, sourceTiles.indexOf(tile));
    sourceTiles.forEach(function (t) { t.classList.toggle("is-active", t === tile); });
    sourceClasses.forEach(function (c) { sourcePreview.classList.remove(c); });
    sourcePreview.classList.add("is-" + source);
    if (sourceLabel) sourceLabel.textContent = sourceLabels[source] || "Publishable content out";
    $$(".output-tab", sourcePreview).forEach(function (tab, i) {
      tab.classList.toggle("is-on", i === (sourceIndex % 3));
    });
  }
  if (sourceSwitcher && sourceTiles.length) {
    setSource(sourceTiles[0]);
    sourceTiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        setSource(tile);
        startSourceSwitch();
      });
      tile.addEventListener("mouseenter", function () { setSource(tile); });
    });
    function startSourceSwitch() {
      if (reduce) return;
      if (sourceTimer) clearInterval(sourceTimer);
      sourceTimer = setInterval(function () {
        sourceIndex = (sourceIndex + 1) % sourceTiles.length;
        setSource(sourceTiles[sourceIndex]);
      }, 2800);
    }
    function stopSourceSwitch() {
      if (sourceTimer) clearInterval(sourceTimer);
      sourceTimer = null;
    }
    if (!reduce && "IntersectionObserver" in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) startSourceSwitch();
          else stopSourceSwitch();
        });
      }, { threshold: 0.32 });
      so.observe(sourceSwitcher);
    } else {
      startSourceSwitch();
    }
  }

  /* ── demo "play" placeholders: gentle feedback, no real video yet ────── */
  $$("[data-play]").forEach(function (frame) {
    frame.addEventListener("click", function () {
      frame.classList.toggle("is-playing");
      var btn = $(".demo-play", frame);
      if (btn) btn.style.opacity = frame.classList.contains("is-playing") ? "0.35" : "1";
    });
  });
})();
