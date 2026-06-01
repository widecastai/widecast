/* =========================================================
   WideCast.ai — "CONSOLE" variant
   Vanilla JS: nav/menu, tabs, copy, scroll reveal,
   transcript reveal, loop signal + LED flip, teleprompter
   toggle, inert links. Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- inert links (preventDefault) ---------- */
  document.querySelectorAll("[data-inert]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
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
    // close on link tap
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- copy buttons ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function () {
        var orig = btn.textContent;
        btn.textContent = "copied";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove("copied");
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- quickstart tabs ---------- */
  var codeTabs = document.getElementById("codeTabs");
  if (codeTabs) {
    var tabBtns = codeTabs.querySelectorAll(".tab");
    var panes = document.querySelectorAll(".tab-pane");
    tabBtns.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-tab");
        tabBtns.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        panes.forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-pane") === key);
        });
      });
    });
  }

  /* ---------- teleprompter mode toggle ---------- */
  var tpModes = document.getElementById("tpModes");
  var tpModeStatus = document.getElementById("tpModeStatus");
  if (tpModes) {
    var modeBtns = tpModes.querySelectorAll(".tp-mode");
    modeBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        modeBtns.forEach(function (m) {
          var on = m === b;
          m.classList.toggle("active", on);
          m.setAttribute("aria-selected", on ? "true" : "false");
        });
        var label = b.getAttribute("data-mode") || "camera";
        label = label.charAt(0).toUpperCase() + label.slice(1);
        if (tpModeStatus) {
          tpModeStatus.innerHTML = "mode: <b>" + label + "</b> active";
        }
      });
    });
  }
  // record toggle (visual only)
  var tpRec = document.getElementById("tpRec");
  if (tpRec) {
    tpRec.addEventListener("click", function () {
      tpRec.classList.toggle("recording");
    });
  }
  // redo scene (visual ping)
  var tpRedo = document.getElementById("tpRedo");
  if (tpRedo) {
    tpRedo.addEventListener("click", function () {
      tpRedo.style.borderColor = "var(--signal)";
      setTimeout(function () {
        tpRedo.style.borderColor = "";
      }, 500);
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = [];
  document
    .querySelectorAll(
      ".section .headline, .section .intro, .panel, .band, .demo, .card, .step, .stage, .price, .int, .door"
    )
    .forEach(function (el) {
      el.classList.add("reveal");
      revealEls.push(el);
    });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- transcript reveal (hero monitor) ---------- */
  var transcript = document.getElementById("transcript");
  if (transcript) {
    var lines = transcript.querySelectorAll(".log-line");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      lines.forEach(function (l) {
        l.classList.add("reveal-line", "in");
      });
    } else {
      lines.forEach(function (l) {
        l.classList.add("reveal-line");
      });
      var tio = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              lines.forEach(function (l, i) {
                setTimeout(function () {
                  l.classList.add("in");
                }, i * 320);
              });
              obs.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      tio.observe(transcript);
    }
  }

  /* ---------- count-up helper ---------- */
  function countUp(el, to, suffix, dur) {
    if (reduceMotion) {
      el.textContent = to + (suffix || "");
      return;
    }
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(p * to) + (suffix || "");
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- THE LOOP — pipeline status board signal ---------- */
  var board = document.getElementById("board");
  var platformLeds = document.getElementById("platformLeds");
  var liveCounter = document.querySelector('[data-counter="live"]');

  function runSignal() {
    if (!board) return;
    var stages = board.querySelectorAll(".stage");

    // reset
    stages.forEach(function (s) {
      s.classList.remove("active", "done");
      var led = s.querySelector(".stage-led");
      if (led) {
        led.classList.remove("led-green");
        led.classList.add("led-amber");
      }
      var fill = s.querySelector(".bar-fill");
      if (fill) fill.style.width = "0";
    });
    if (platformLeds) {
      platformLeds.querySelectorAll("li").forEach(function (li) {
        li.classList.remove("live");
        var led = li.querySelector(".led");
        if (led) {
          led.classList.remove("led-green");
          led.classList.add("led-off");
        }
      });
    }
    if (liveCounter) liveCounter.textContent = "0";

    if (reduceMotion) {
      // settle into final state with no animation
      stages.forEach(function (s) {
        s.classList.add("active", "done");
        var led = s.querySelector(".stage-led");
        if (led) {
          led.classList.remove("led-amber");
          led.classList.add("led-green");
        }
        var fill = s.querySelector(".bar-fill");
        if (fill) fill.style.width = "100%";
      });
      if (platformLeds) {
        platformLeds.querySelectorAll("li").forEach(function (li) {
          li.classList.add("live");
          var led = li.querySelector(".led");
          if (led) {
            led.classList.remove("led-off");
            led.classList.add("led-green");
          }
        });
      }
      if (liveCounter) liveCounter.textContent = "10";
      return;
    }

    // advance signal panel -> panel
    stages.forEach(function (s, i) {
      setTimeout(function () {
        s.classList.add("active");
        var fill = s.querySelector(".bar-fill");
        if (fill) fill.style.width = "100%";
        setTimeout(function () {
          s.classList.add("done");
          var led = s.querySelector(".stage-led");
          if (led) {
            led.classList.remove("led-amber");
            led.classList.add("led-green");
          }
          // when final stage lights, flip platform LEDs in sequence
          if (i === stages.length - 1 && platformLeds) {
            var lis = platformLeds.querySelectorAll("li");
            lis.forEach(function (li, j) {
              setTimeout(function () {
                li.classList.add("live");
                var led2 = li.querySelector(".led");
                if (led2) {
                  led2.classList.remove("led-off");
                  led2.classList.add("led-green");
                }
                if (liveCounter) liveCounter.textContent = String(j + 1);
              }, j * 180);
            });
          }
        }, 650);
      }, i * 900);
    });
  }

  if (board) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      runSignal();
    } else {
      var bio = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runSignal();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      bio.observe(board);
    }
  }
})();
