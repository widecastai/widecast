/* ============================================================
   WideCast — BOLD variant · vanilla JS
   nav/menu · copy · tabs · scroll reveal · transcript reveal
   loop activate · teleprompter toggle · inert links
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }
  if (navLinks) {
    navLinks.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a) closeNav();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Inert links (preventDefault) ---------- */
  document.querySelectorAll("[data-inert]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function () {
        var orig = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        window.setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove("is-copied");
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
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
        } catch (err) { /* no-op */ }
      }
    });
  });

  /* ---------- Tabs (quickstart) ---------- */
  document.querySelectorAll(".code__tabs").forEach(function (tabs) {
    var code = tabs.closest(".code");
    if (!code) return;
    var buttons = tabs.querySelectorAll(".tab");
    var panes = code.querySelectorAll(".code__pane");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-tab");
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        panes.forEach(function (p) {
          p.classList.toggle("is-active", p.getAttribute("data-pane") === key);
        });
      });
    });
  });

  /* ---------- Teleprompter mode toggle ---------- */
  document.querySelectorAll(".prompter__modes").forEach(function (group) {
    var modes = group.querySelectorAll(".mode");
    modes.forEach(function (m) {
      m.addEventListener("click", function () {
        modes.forEach(function (other) {
          var on = other === m;
          other.classList.toggle("is-active", on);
          other.setAttribute("aria-pressed", on ? "true" : "false");
        });
      });
    });
  });

  /* ---------- Teleprompter "Redo scene" advances current line ---------- */
  var redoBtn = document.getElementById("redoScene");
  var promptLines = document.getElementById("prompterLines");
  if (redoBtn && promptLines) {
    var lineEls = promptLines.querySelectorAll("li");
    redoBtn.addEventListener("click", function () {
      var idx = -1;
      lineEls.forEach(function (li, i) {
        if (li.classList.contains("is-current")) idx = i;
      });
      var next = (idx + 1) % lineEls.length;
      lineEls.forEach(function (li, i) {
        li.classList.toggle("is-current", i === next);
      });
    });
  }

  /* ---------- The Loop: activate platform grid sequentially ---------- */
  var platGrid = document.getElementById("platGrid");
  function activatePlatforms() {
    if (!platGrid) return;
    var items = platGrid.querySelectorAll("li");
    if (prefersReduced) {
      items.forEach(function (li) { li.classList.add("is-active"); });
      return;
    }
    items.forEach(function (li, i) {
      window.setTimeout(function () {
        li.classList.add("is-active");
      }, i * 110);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal, .reveal-mask");
  var stages = document.querySelectorAll("[data-stage]");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
    stages.forEach(function (el) { el.classList.add("is-active"); });
    activatePlatforms();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });

    /* stages get a staggered activate when the flow scrolls in */
    var flow = document.getElementById("flow");
    if (flow) {
      var flowIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stages.forEach(function (st, i) {
              window.setTimeout(function () {
                st.classList.add("is-active");
              }, i * 160);
            });
            activatePlatforms();
            flowIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      flowIo.observe(flow);
    }
  }

  /* ---------- Transcript line-by-line reveal ---------- */
  var transcript = document.getElementById("transcript");
  var transcriptBody = document.getElementById("transcriptBody");
  if (transcript && transcriptBody) {
    var tLines = transcriptBody.querySelectorAll(".t-line");
    var playTranscript = function () {
      if (prefersReduced) {
        tLines.forEach(function (li) { li.classList.add("is-in"); });
        return;
      }
      tLines.forEach(function (li, i) {
        window.setTimeout(function () {
          li.classList.add("is-in");
        }, 250 + i * 360);
      });
    };
    if (!("IntersectionObserver" in window) || prefersReduced) {
      playTranscript();
    } else {
      var tIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playTranscript();
            tIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      tIo.observe(transcript);
    }
  }
})();
