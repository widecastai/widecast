/* ============================================================
   WideCast — NEON variant · vanilla JS
   nav scroll state · mobile menu · tab switching · copy ·
   scroll reveal · agent transcript reveal · loop beam +
   platform ignite · teleprompter toggle · inert links
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- inert placeholder links ---------- */
  $$("[data-inert]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- nav scroll state ---------- */
  var nav = $("#nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = $("#navToggle");
  var links = $("#navLinks");
  function closeMenu() {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* install tabs */
  (function () {
    var tabs = $$(".install__tab");
    var bodies = $$(".install__cmd");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-install");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", String(on));
        });
        bodies.forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-install-body") === key);
        });
      });
    });
  })();

  /* code tabs */
  (function () {
    var tabs = $$(".code__tab");
    var bodies = $$(".code__block");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-code");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-selected", String(on));
        });
        bodies.forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-code-body") === key);
        });
      });
    });
  })();

  /* ---------- copy to clipboard ---------- */
  function copyText(text, btn) {
    function done() {
      if (!btn) return;
      var orig = btn.textContent;
      btn.textContent = "Copied ✓";
      btn.classList.add("is-copied");
      setTimeout(function () {
        btn.textContent = orig;
        btn.classList.remove("is-copied");
      }, 1500);
    }
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
      } catch (err) { /* no-op */ }
    }
  }

  var installCopy = $("#installCopy");
  if (installCopy) {
    installCopy.addEventListener("click", function () {
      var active = $(".install__cmd.is-active");
      if (active) copyText(active.textContent.trim(), installCopy);
    });
  }

  var codeCopy = $("#codeCopy");
  if (codeCopy) {
    codeCopy.addEventListener("click", function () {
      var active = $(".code__block.is-active code") || $(".code__block.is-active");
      if (active) copyText(active.textContent.replace(/\s+$/, ""), codeCopy);
    });
  }

  var ctaCopy = $("#ctaCopy");
  var ctaCmd = $("#ctaCmd");
  if (ctaCopy && ctaCmd) {
    ctaCopy.addEventListener("click", function () {
      copyText(ctaCmd.textContent.trim(), ctaCopy);
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- agent transcript reveal (lines flicker in) ---------- */
  (function () {
    var log = $("#agentLog");
    if (!log) return;
    var steps = $$("[data-step]", log);
    function play() {
      if (prefersReduced) {
        steps.forEach(function (s) { s.classList.add("is-in"); });
        return;
      }
      steps.forEach(function (s, i) {
        setTimeout(function () { s.classList.add("is-in"); }, 320 * i);
      });
    }
    if ("IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { play(); io2.unobserve(en.target); }
        });
      }, { threshold: 0.3 });
      io2.observe(log);
    } else {
      play();
    }
  })();

  /* ---------- THE LOOP: beam + platform ignite ---------- */
  (function () {
    var highway = $("#highway");
    var platforms = $("#platforms");
    if (!highway) return;
    var chips = platforms ? $$("[data-chip]", platforms) : [];
    var ran = false;

    function igniteChips() {
      chips.forEach(function (chip, i) {
        setTimeout(function () { chip.classList.add("is-ignited"); }, 180 * i);
      });
    }

    function runLoop() {
      if (ran) return;
      ran = true;
      if (prefersReduced) {
        // static end-state: everything lit, no motion
        chips.forEach(function (chip) { chip.classList.add("is-ignited"); });
        $$("[data-node]", highway).forEach(function (n) {
          n.style.boxShadow = "0 0 8px rgba(0,229,255,.25)";
          n.style.borderColor = "rgba(0,229,255,.4)";
        });
        return;
      }
      highway.classList.add("is-running");
      // chips ignite as the beam reaches the far end of the highway
      setTimeout(igniteChips, 1400);
    }

    if ("IntersectionObserver" in window) {
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runLoop(); io3.unobserve(en.target); }
        });
      }, { threshold: 0.3 });
      io3.observe(highway);
    } else {
      runLoop();
    }
  })();

  /* ---------- teleprompter mock: mode toggle + record ---------- */
  (function () {
    var prompter = $("#prompter");
    if (!prompter) return;
    var modes = $$(".mode", prompter);
    var recBtn = $("#recBtn");
    var redoBtn = $("#redoScene");
    var scroll = $("#prompterScroll");
    var lines = scroll ? $$("p", scroll) : [];
    var current = 0;
    var recTimer = null;

    /* set initial current line */
    function setCurrent(i) {
      lines.forEach(function (p, idx) {
        p.classList.toggle("is-current", idx === i);
      });
      current = i;
    }
    if (lines.length) {
      var initial = lines.findIndex
        ? lines.findIndex(function (p) { return p.classList.contains("is-current"); })
        : -1;
      setCurrent(initial >= 0 ? initial : 0);
    }

    /* mode toggle: camera / avatar / audio */
    function setMode(mode, btn) {
      modes.forEach(function (m) {
        var on = m === btn;
        m.classList.toggle("is-active", on);
        m.setAttribute("aria-selected", String(on));
      });
      prompter.classList.toggle("is-avatar", mode === "avatar");
    }
    modes.forEach(function (m) {
      m.addEventListener("click", function () {
        setMode(m.getAttribute("data-mode"), m);
      });
    });

    /* record: toggles recording state + auto-advances the prompter line */
    function stopRecording() {
      prompter.classList.remove("is-recording");
      if (recTimer) { clearInterval(recTimer); recTimer = null; }
      if (recBtn) recBtn.querySelector(".pbtn__dot") && (recBtn.innerHTML = '<span class="pbtn__dot">●</span> Record');
    }
    function startRecording() {
      prompter.classList.add("is-recording");
      if (recBtn) recBtn.innerHTML = '<span class="pbtn__dot">■</span> Stop';
      if (prefersReduced || !lines.length) return;
      recTimer = setInterval(function () {
        var next = (current + 1) % lines.length;
        setCurrent(next);
        if (next === 0) stopRecording(); // looped through the scene
      }, 1400);
    }
    if (recBtn) {
      recBtn.addEventListener("click", function () {
        if (prompter.classList.contains("is-recording")) stopRecording();
        else startRecording();
      });
    }

    /* redo scene: reset to first line, stop recording, flash */
    if (redoBtn) {
      redoBtn.addEventListener("click", function () {
        stopRecording();
        setCurrent(0);
        redoBtn.animate
          ? redoBtn.animate(
              [{ transform: "rotate(0)" }, { transform: "rotate(-360deg)" }],
              { duration: 500, easing: "ease" }
            )
          : void 0;
      });
    }
  })();
})();
