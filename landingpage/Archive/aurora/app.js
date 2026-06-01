/* ============================================================
   WideCast — AURORA variant · vanilla JS
   nav state · mobile menu · tabs · copy · reveal ·
   agent transcript · loop pulse + platform bloom · parallax ·
   inert placeholder links
   ============================================================ */
(function () {
  "use strict";

  var REDUCE = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* -------- inert placeholder links -------- */
  $$("[data-inert]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* -------- nav scroll state -------- */
  var nav = $("#nav");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- mobile menu -------- */
  var toggle = $("#navToggle");
  var links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------- generic tab switcher -------- */
  function wireTabs(tabSel, panelAttr, dataKey) {
    var tabs = $$(tabSel);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute(dataKey);
        var group = tab.parentNode;
        $$(tabSel, group.closest("section, .install, .code") || document).forEach(function (t) {
          if (t.parentNode === group) {
            t.classList.remove("is-active");
            t.setAttribute("aria-selected", "false");
          }
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        var scope = tab.closest(".install, .code") || document;
        $$("[" + panelAttr + "]", scope).forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute(panelAttr) === key);
        });
      });
    });
  }
  wireTabs(".install__tab", "data-install-panel", "data-install");
  wireTabs(".code__tab", "data-code-panel", "data-code");

  /* -------- teleprompter mode toggle (human section) -------- */
  (function () {
    var modes = $$(".prompter__mode");
    if (!modes.length) return;
    modes.forEach(function (mode) {
      mode.addEventListener("click", function () {
        modes.forEach(function (m) {
          m.classList.remove("is-active");
          m.setAttribute("aria-selected", "false");
        });
        mode.classList.add("is-active");
        mode.setAttribute("aria-selected", "true");
      });
    });
  })();

  /* -------- copy to clipboard -------- */
  $$(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sel = btn.getAttribute("data-copy-target");
      var target = $(sel);
      if (!target) return;
      var text = target.textContent.trim();
      var done = function () {
        var orig = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove("is-copied");
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
      } else { fallback(text, done); }
    });
  });
  function fallback(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); cb();
  }

  /* -------- scroll reveal -------- */
  var revealEls = $$(".reveal");
  if (REDUCE || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = parseInt(en.target.getAttribute("data-reveal-delay") || "0", 10);
          setTimeout(function () { en.target.classList.add("is-in"); }, d);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* -------- agent transcript reveal -------- */
  var log = $("#agentLog");
  if (log) {
    var lines = $$("[data-line]", log);
    if (REDUCE) {
      lines.forEach(function (l) { l.classList.add("is-shown"); });
    } else {
      var played = false;
      var playLog = function () {
        if (played) return; played = true;
        lines.forEach(function (l, i) {
          setTimeout(function () { l.classList.add("is-shown"); }, 350 + i * 480);
        });
      };
      if ("IntersectionObserver" in window) {
        var lio = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { playLog(); lio.disconnect(); } });
        }, { threshold: 0.4 });
        lio.observe(log);
      } else { playLog(); }
    }
  }

  /* -------- THE LOOP: pulse along curve + platform bloom -------- */
  (function () {
    var curve = $("#loopCurve");
    var pulse = $("#loopPulse");
    var stage = $("#loopStage");
    var platforms = $$("#loopPlatforms [data-platform]");
    var orbs = $$("[data-orb]", stage || document);
    if (REDUCE || !curve || !pulse || typeof curve.getTotalLength !== "function") return;

    var length = 0;
    try { length = curve.getTotalLength(); } catch (e) { return; }
    if (!length) return;

    var running = false;

    function bloomPlatforms() {
      platforms.forEach(function (chip, i) {
        setTimeout(function () {
          chip.classList.add("is-bloom");
          setTimeout(function () { chip.classList.remove("is-bloom"); }, 900);
        }, i * 110);
      });
    }
    function litOrbs() {
      orbs.forEach(function (o, i) {
        setTimeout(function () {
          o.setAttribute("data-lit", "1");
          setTimeout(function () { o.removeAttribute("data-lit"); }, 700);
        }, i * 90);
      });
    }

    function travel() {
      pulse.classList.add("is-running");
      var dur = 2600, start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
        var pt = curve.getPointAtLength(eased * length);
        pulse.setAttribute("cx", pt.x);
        pulse.setAttribute("cy", pt.y);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          pulse.classList.remove("is-running");
          bloomPlatforms();
          // loop again after the bloom settles
          setTimeout(function () { start = null; travel(); }, 2600);
        }
      }
      litOrbs();
      requestAnimationFrame(step);
    }

    function begin() {
      if (running) return; running = true; travel();
    }
    if ("IntersectionObserver" in window && stage) {
      var sio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { begin(); sio.disconnect(); } });
      }, { threshold: 0.3 });
      sio.observe(stage);
    } else { begin(); }
  })();

  /* -------- subtle pointer parallax on aurora blobs -------- */
  (function () {
    if (REDUCE) return;
    var blobs = $$(".blob[data-parallax]");
    if (!blobs.length) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    window.addEventListener("pointermove", function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      blobs.forEach(function (b) {
        var f = parseFloat(b.getAttribute("data-parallax")) || 0.04;
        b.style.setProperty("transform", "translate3d(" + (cx * f * 100) + "px," + (cy * f * 100) + "px,0)");
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else { raf = null; }
    }
  })();

})();
