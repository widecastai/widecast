/* ============================================================
   WideCast — NOIR variant — vanilla JS
   nav scroll state · mobile menu · install/code tabs ·
   copy-to-clipboard · scroll reveal · transcript reveal ·
   loop dot + platform marking · teleprompter mode toggle ·
   inert placeholder links
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- nav scroll state ---------- */
  var nav = $("#nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var toggle = $("#navToggle");
  var navLinks = $("#navLinks");
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  if (navLinks) {
    $$("a", navLinks).forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- generic tab switcher (install + code) ---------- */
  function wireTabs(tabSel, tabAttr, bodyAttr) {
    var tabs = $$(tabSel);
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute(tabAttr);
        var group = tab.parentElement;
        // tabs
        $$("[" + tabAttr + "]", group).forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        // bodies (search within shared container)
        var scope = group.parentElement || document;
        $$("[" + bodyAttr + "]", scope).forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute(bodyAttr) === key);
        });
      });
    });
  }
  wireTabs(".install__tab", "data-install", "data-install-body");
  wireTabs(".code__tab", "data-code", "data-code-body");

  /* ---------- copy to clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      resolve();
    });
  }
  $$(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      copyText(btn.getAttribute("data-copy") || "").then(function () {
        var prev = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("is-copied");
        setTimeout(function () {
          btn.textContent = prev;
          btn.classList.remove("is-copied");
        }, 1600);
      });
    });
  });

  /* ---------- scroll reveal ---------- */
  var reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- agent transcript staggered reveal ---------- */
  var feed = $("#transcriptFeed");
  if (feed) {
    var lines = $$(".t-line", feed);
    function playTranscript() {
      if (reduceMotion) {
        lines.forEach(function (l) { l.classList.add("is-shown"); });
        return;
      }
      lines.forEach(function (l, i) {
        setTimeout(function () { l.classList.add("is-shown"); }, 380 + i * 460);
      });
    }
    if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { playTranscript(); tio.disconnect(); }
        });
      }, { threshold: 0.3 });
      tio.observe(feed);
    } else {
      playTranscript();
    }
  }

  /* ---------- the loop: platform marking (in sync with travelling dot) ---------- */
  var platforms = $$("#loopPlatforms li");
  if (platforms.length) {
    var pIdx = 0;
    function markNext() {
      platforms.forEach(function (li, i) {
        li.classList.toggle("is-active", i <= pIdx);
      });
      pIdx = (pIdx + 1) % (platforms.length + 1);
    }
    if (reduceMotion) {
      platforms.forEach(function (li) { li.classList.add("is-active"); });
    } else {
      var diagram = $("#loopDiagram");
      var started = false;
      function startLoop() {
        if (started) return;
        started = true;
        markNext();
        setInterval(markNext, 520);
      }
      if (diagram && "IntersectionObserver" in window) {
        var lio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { startLoop(); } });
        }, { threshold: 0.2 });
        lio.observe(diagram);
      } else {
        startLoop();
      }
    }
  }

  /* ---------- teleprompter mode toggle ---------- */
  var modes = $$(".prompter__modes .mode");
  modes.forEach(function (m) {
    m.addEventListener("click", function () {
      modes.forEach(function (o) {
        var active = o === m;
        o.classList.toggle("is-active", active);
        o.setAttribute("aria-selected", active ? "true" : "false");
      });
    });
  });

  /* ---------- teleprompter: gently advance the highlighted line ---------- */
  var scriptLines = $$("#prompterScript .line");
  if (scriptLines.length && !reduceMotion) {
    var sIdx = scriptLines.findIndex
      ? scriptLines.findIndex(function (l) { return l.classList.contains("is-current"); })
      : 1;
    if (sIdx < 0) sIdx = 0;
    var scriptEl = $("#prompterScript");
    var scriptVisible = false;
    if (scriptEl && "IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { scriptVisible = e.isIntersecting; });
      }, { threshold: 0.4 });
      sio.observe(scriptEl);
    } else {
      scriptVisible = true;
    }
    setInterval(function () {
      if (!scriptVisible) return;
      scriptLines[sIdx].classList.remove("is-current");
      sIdx = (sIdx + 1) % scriptLines.length;
      scriptLines[sIdx].classList.add("is-current");
    }, 2600);
  }

  /* ---------- inert placeholder links ---------- */
  $$("[data-inert]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
})();
