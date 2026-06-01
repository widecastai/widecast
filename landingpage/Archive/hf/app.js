/* ============================================================
   WideCast.ai — HF-style landing — vanilla JS
   nav scroll + mobile menu, tab switching (install/code),
   copy-to-clipboard, scroll reveal, transcript animation,
   loop single-dot sequence + platform activation,
   teleprompter toggle, draggable range slider, inert links.
   ============================================================ */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- inert placeholder links ---------- */
  document.querySelectorAll("[data-inert]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  /* ---------- nav: scroll state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- nav: mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- generic tab switcher ---------- */
  function wireTabs(tabSelector, attr, panelSelector, panelAttr) {
    var tabs = document.querySelectorAll(tabSelector);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute(attr);
        var scope = tab.closest("[id], section") || document;
        // tabs in same group
        tab.parentNode.querySelectorAll(tabSelector).forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-on", on);
          if (t.hasAttribute("role")) t.setAttribute("aria-selected", on ? "true" : "false");
        });
        scope.querySelectorAll(panelSelector).forEach(function (p) {
          p.classList.toggle("is-on", p.getAttribute(panelAttr) === key);
        });
      });
    });
  }
  wireTabs(".itab", "data-itab", ".ipanel", "data-ipanel");
  wireTabs(".ctab[data-ctab]", "data-ctab", ".cpanel", "data-cpanel");

  /* ---------- teleprompter capture toggle ---------- */
  document.querySelectorAll(".ptab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      tab.parentNode.querySelectorAll(".ptab").forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
  });

  /* ---------- facet sidebar tabs (visual) ---------- */
  document.querySelectorAll(".ftab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      tab.parentNode.querySelectorAll(".ftab").forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
  });

  /* ---------- faceted sidebar collapse (mobile) ---------- */
  var facetToggle = document.getElementById("facetToggle");
  var facetBody = document.getElementById("facetBody");
  if (facetToggle && facetBody) {
    facetToggle.addEventListener("click", function () {
      var open = facetBody.classList.toggle("open");
      facetToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- copy to clipboard ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sel = btn.getAttribute("data-copy-target");
      var target = null;
      if (sel) {
        // resolve relative to button's block when possible
        var block = btn.closest(".install, .code-block, .install-final");
        target = (block && block.querySelector(sel)) || document.querySelector(sel);
      }
      if (!target) return;
      var text = target.innerText.trim();
      var done = function () {
        var label = btn.querySelector(".copy-label");
        var prev = label ? label.textContent : "";
        btn.classList.add("copied");
        if (label) label.textContent = "Copied";
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = prev || "Copy";
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        try {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "absolute";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          done();
        } catch (e) { /* no-op */ }
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- transcript line-by-line reveal ---------- */
  var transcript = document.getElementById("transcript");
  var tsBody = document.getElementById("tsBody");
  if (transcript && tsBody) {
    var lines = tsBody.querySelectorAll(".ts-line");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      lines.forEach(function (l) { l.classList.add("is-in"); });
    } else {
      transcript.classList.add("anim");
      var played = false;
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !played) {
            played = true;
            lines.forEach(function (line, i) {
              setTimeout(function () { line.classList.add("is-in"); }, i * 380);
            });
            tio.unobserve(en.target);
          }
        });
      }, { threshold: 0.3 });
      tio.observe(transcript);
    }
  }

  /* ---------- THE LOOP: single traveling dot + platform activation ---------- */
  var loopRig = document.getElementById("loopRig");
  var platformPills = document.getElementById("platformPills");
  if (loopRig && !prefersReduced) {
    var connectors = loopRig.querySelectorAll(".connector");
    // inject one dot per connector (reused sequentially)
    connectors.forEach(function (c) {
      var dot = document.createElement("span");
      dot.className = "loop-dot";
      c.appendChild(dot);
    });
    var dots = loopRig.querySelectorAll(".loop-dot");
    var plats = platformPills ? platformPills.querySelectorAll(".plat") : [];

    function isVertical() {
      // connector stacks vertically below desktop breakpoint
      return window.innerWidth < 900;
    }

    function travel(dot, cb) {
      var vertical = isVertical();
      var dur = 620;
      var start = null;
      dot.style.opacity = "1";
      function frame(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        if (vertical) {
          dot.style.top = (t * 100) + "%";
          dot.style.left = "50%";
        } else {
          dot.style.left = (t * 100) + "%";
          dot.style.top = "50%";
        }
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          dot.style.opacity = "0";
          dot.style.top = vertical ? "0%" : "50%";
          dot.style.left = vertical ? "50%" : "0%";
          cb();
        }
      }
      requestAnimationFrame(frame);
    }

    function activatePlatforms(done) {
      var i = 0;
      function next() {
        if (i >= plats.length) {
          setTimeout(function () {
            plats.forEach(function (p) { p.classList.remove("is-active"); });
            done();
          }, 700);
          return;
        }
        plats[i].classList.add("is-active");
        i++;
        setTimeout(next, 120);
      }
      next();
    }

    function runSequence() {
      var idx = 0;
      function step() {
        if (idx >= dots.length) {
          // reached distribute stage -> light up platforms, then loop
          activatePlatforms(function () {
            idx = 0;
            setTimeout(step, 900);
          });
          return;
        }
        travel(dots[idx], function () {
          idx++;
          setTimeout(step, 120);
        });
      }
      step();
    }

    // start when loop scrolls into view
    if ("IntersectionObserver" in window) {
      var started = false;
      var lio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !started) {
            started = true;
            runSequence();
          }
        });
      }, { threshold: 0.25 });
      lio.observe(loopRig);
    } else {
      runSequence();
    }
  }

  /* ---------- range slider (draggable, visual only) ---------- */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var fill = slider.querySelector(".slider-fill");
    var knobA = slider.querySelector('[data-knob="a"]');
    var knobB = slider.querySelector('[data-knob="b"]');
    if (!track || !fill || !knobA || !knobB) return;

    var dragging = null;
    var posA = 15, posB = 75; // percent

    function render() {
      var lo = Math.min(posA, posB);
      var hi = Math.max(posA, posB);
      knobA.style.left = posA + "%";
      knobB.style.left = posB + "%";
      fill.style.left = lo + "%";
      fill.style.right = (100 - hi) + "%";
      var min = 15, max = 180;
      slider.setAttribute("aria-valuenow", Math.round(min + (lo / 100) * (max - min)));
    }

    function pctFromEvent(clientX) {
      var r = track.getBoundingClientRect();
      var p = ((clientX - r.left) / r.width) * 100;
      return Math.max(0, Math.min(100, p));
    }

    function pointerDown(e, knob) {
      dragging = knob;
      e.preventDefault();
      window.addEventListener("pointermove", pointerMove);
      window.addEventListener("pointerup", pointerUp);
    }
    function pointerMove(e) {
      if (!dragging) return;
      var p = pctFromEvent(e.clientX);
      if (dragging === "a") posA = p; else posB = p;
      render();
    }
    function pointerUp() {
      dragging = null;
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
    }

    knobA.addEventListener("pointerdown", function (e) { pointerDown(e, "a"); });
    knobB.addEventListener("pointerdown", function (e) { pointerDown(e, "b"); });
    // click on track moves nearest knob
    track.addEventListener("pointerdown", function (e) {
      if (e.target === knobA || e.target === knobB) return;
      var p = pctFromEvent(e.clientX);
      if (Math.abs(p - posA) <= Math.abs(p - posB)) posA = p; else posB = p;
      render();
    });
    // keyboard
    slider.addEventListener("keydown", function (e) {
      var d = 0;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") d = 3;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") d = -3;
      else return;
      posB = Math.max(0, Math.min(100, posB + d));
      render();
      e.preventDefault();
    });
    render();
  });

})();
