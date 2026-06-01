/* ============================================================
   WideCast.ai — JADE variant — vanilla JS
   nav+menu · tab switching · copy · scroll reveal ·
   transcript reveal · loop pulse + platform bloom ·
   teleprompter toggle · inert links
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- inert links (preventDefault) ---------- */
  document.querySelectorAll("[data-inert]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      // allow same-page anchors that are real targets; data-inert ones are dead links
      if (el.getAttribute("href") === "#" || el.getAttribute("href") == null) {
        e.preventDefault();
      } else if (el.getAttribute("href") === "#top") {
        // brand → scroll to top, no jump-flash needed
      }
    });
  });

  /* ---------- mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("[data-close]").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- copy buttons ---------- */
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function () {
        var orig = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove("copied");
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- quickstart tabs ---------- */
  var tabs = document.querySelectorAll(".tabs .tab");
  var panes = document.querySelectorAll(".panes .pane");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var name = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panes.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-pane") === name);
      });
    });
  });

  /* ---------- teleprompter delivery-mode toggle ---------- */
  var modes = document.querySelectorAll(".mode-toggle .mode");
  modes.forEach(function (m) {
    m.addEventListener("click", function () {
      modes.forEach(function (x) {
        var on = x === m;
        x.classList.toggle("active", on);
        x.setAttribute("aria-selected", on ? "true" : "false");
      });
    });
  });

  /* ---------- scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

  /* ---------- transcript staggered reveal ---------- */
  // PLACEHOLDER agent transcript — reveals line by line when scrolled into view
  var transcript = document.getElementById("transcript");
  if (transcript) {
    var lines = transcript.querySelectorAll(".tline");
    var revealLines = function () {
      if (reduceMotion) {
        lines.forEach(function (l) { l.classList.add("show"); });
        return;
      }
      lines.forEach(function (l, i) {
        setTimeout(function () { l.classList.add("show"); }, 320 * i + 200);
      });
    };
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { revealLines(); tio.disconnect(); }
        });
      }, { threshold: 0.3 });
      tio.observe(transcript);
    } else {
      revealLines();
    }
  }

  /* ---------- THE LOOP: stage bloom + platform bloom ---------- */
  // PLACEHOLDER platforms — bloom in sequence when the loop scrolls into view
  var loopFlow = document.getElementById("loopFlow");
  if (loopFlow) {
    var stages = loopFlow.querySelectorAll(".stage");
    var platforms = loopFlow.querySelectorAll("#loopPlatforms li");
    var runBloom = function () {
      if (reduceMotion) {
        stages.forEach(function (s) { s.classList.add("bloom"); });
        platforms.forEach(function (p) { p.classList.add("bloom"); });
        return;
      }
      stages.forEach(function (s, i) {
        setTimeout(function () { s.classList.add("bloom"); }, 480 * i);
      });
      // platforms bloom after stage 4 lights up
      var startPlat = 480 * stages.length;
      platforms.forEach(function (p, i) {
        setTimeout(function () { p.classList.add("bloom"); }, startPlat + 110 * i);
      });
    };
    if ("IntersectionObserver" in window) {
      var lio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runBloom(); lio.disconnect(); }
        });
      }, { threshold: 0.25 });
      lio.observe(loopFlow);
    } else {
      runBloom();
    }
  }

  /* ---------- close mobile nav on resize to desktop ---------- */
  window.addEventListener("resize", function () {
    if (window.innerWidth > 860 && navLinks && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    }
  });
})();
