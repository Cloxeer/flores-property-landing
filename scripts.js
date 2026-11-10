/* scripts.js — interaction + motion for the custom clone.
   (1) sticky nav gains a shadow after scroll, (2) mobile hamburger opens the drawer,
   (3) reveal-on-scroll via IntersectionObserver with a staggered delay per section.
   All progressive enhancement: the page is fully readable with JS disabled. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  onReady(function () {
    /* 1. Sticky nav shadow on scroll */
    var nav = document.querySelector("[data-nav]");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* 2. Mobile menu toggle */
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (toggle && menu && nav) {
      var setOpen = function (open) {
        menu.classList.toggle("is-open", open);
        nav.classList.toggle("is-menu-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      };
      toggle.addEventListener("click", function () {
        setOpen(!menu.classList.contains("is-open"));
      });
      menu.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });
    }

    /* 3. Reveal-on-scroll, staggered within each section */
    var reveal = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (reduceMotion || !("IntersectionObserver" in window)) {
      reveal.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(
          (el.closest("section") || document).querySelectorAll("[data-reveal]")
        );
        var i = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(i, 6) * 80 + "ms";
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveal.forEach(function (el) { io.observe(el); });
  });
})();
