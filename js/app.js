/* LUNIKO · shared behaviour: scroll reveal, copy buttons, hero glow tracking. */
(function () {
  "use strict";

  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 }) : null;

  document.querySelectorAll(".rv").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("in");
  });

  /* Safety net: content must never stay invisible. Anything at or above the
     fold line gets revealed even if an observer event was missed. */
  function sweep() {
    var limit = window.scrollY + window.innerHeight + 240;
    document.querySelectorAll(".rv:not(.in)").forEach(function (el) {
      if (el.getBoundingClientRect().top + window.scrollY < limit) el.classList.add("in");
    });
  }
  window.addEventListener("scroll", sweep, { passive: true });
  setTimeout(sweep, 900);
  setTimeout(sweep, 2200);

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-copy"));
      if (!target) return;
      var text = target.textContent.trim();
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else { done(); }
    });
  });

  var hero = document.querySelector(".hero-sky");
  if (hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100) + "%");
      hero.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100) + "%");
    });
  }
})();
