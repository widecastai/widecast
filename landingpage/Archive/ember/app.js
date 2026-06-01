/* ============================================================
   WideCast — EMBER variant · vanilla JS
   nav state · mobile menu · tab switching · copy · scroll reveal ·
   agent transcript reveal · firelight loop spark + ember/platform bloom ·
   teleprompter toggle · inert placeholder links
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
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 24) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

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

  /* -------- generic tab switcher (install + code) -------- */
  function wireTabs(tabSel, panelAttr, dataKey) {
    $$(tabSel).forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute(dataKey);
        var group = tab.parentNode;
        $$(tabSel, group).forEach(function (t) {
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

  /* -------- teleprompter mode toggle -------- */
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
      var target = sel && $(sel);
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
          setTimeout(function () { l.classList.add("is-shown"); }, 350 + i * 460);
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

  /* -------- THE LOOP: firelight spark travels the path,
        embers light + 10 platforms bloom in warm light --------
        Works in BOTH orientations: the spark is positioned by
        measuring node/connector centers from the live layout,
        so it follows the horizontal path on desktop and the
        vertical path on mobile. */
  (function () {
    var journey = $("#journey");
    var spark = $("#journeySpark");
    if (!journey || !spark) return;

    var nodes = $$(".node", journey);
    var platformChips = $$("#loopPlatforms [data-platform]");

    function bloomPlatforms() {
      platformChips.forEach(function (chip, i) {
        setTimeout(function () {
          chip.classList.add("is-bloom");
          setTimeout(function () { chip.classList.remove("is-bloom"); }, 1100);
        }, i * 90);
      });
    }
    function litNode(idx) {
      var n = nodes[idx];
      if (!n) return;
      n.classList.add("is-lit");
      setTimeout(function () { n.classList.remove("is-lit"); }, 650);
    }

    // ordered list of waypoint centers (node centers), relative to journey box
    function waypoints() {
      var box = journey.getBoundingClientRect();
      return nodes.map(function (n) {
        var r = n.getBoundingClientRect();
        return {
          x: r.left - box.left + r.width / 2,
          y: r.top - box.top + r.height / 2
        };
      });
    }

    if (REDUCE || typeof requestAnimationFrame !== "function") {
      // static: just ensure nothing animates; reveal handles visibility
      return;
    }

    var running = false;

    function travel() {
      var pts = waypoints();
      if (pts.length < 2) { running = false; return; }

      // build cumulative segment lengths for even-speed travel
      var segs = [], total = 0;
      for (var i = 0; i < pts.length - 1; i++) {
        var dx = pts[i + 1].x - pts[i].x;
        var dy = pts[i + 1].y - pts[i].y;
        var len = Math.sqrt(dx * dx + dy * dy);
        segs.push(len); total += len;
      }
      if (!total) { running = false; return; }

      var litFlags = nodes.map(function () { return false; });
      var dur = 2800, start = null;
      spark.style.opacity = "1";
      journey.classList.add("is-sparking");

      function frame(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
        var dist = eased * total;

        // find current segment
        var acc = 0, seg = 0;
        while (seg < segs.length - 1 && acc + segs[seg] < dist) { acc += segs[seg]; seg++; }
        var local = segs[seg] ? (dist - acc) / segs[seg] : 0;
        var a = pts[seg], b = pts[seg + 1];
        var x = a.x + (b.x - a.x) * local;
        var y = a.y + (b.y - a.y) * local;
        spark.style.left = x + "px";
        spark.style.top = y + "px";

        // light each node ember as the spark passes its center
        nodes.forEach(function (n, idx) {
          if (!litFlags[idx]) {
            var c = pts[idx];
            var near = Math.abs(x - c.x) < 40 && Math.abs(y - c.y) < 40;
            if (near) { litFlags[idx] = true; litNode(idx); }
          }
        });

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          journey.classList.remove("is-sparking");
          spark.style.opacity = "0";
          bloomPlatforms();
          setTimeout(function () { start = null; travel(); }, 3000); // loop
        }
      }
      requestAnimationFrame(frame);
    }

    function begin() { if (running) return; running = true; travel(); }

    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { begin(); sio.disconnect(); } });
      }, { threshold: 0.25 });
      sio.observe(journey);
    } else { begin(); }
  })();

})();
