/* LUNIKO · procedural night sky.
   Hero canvas: twinkling star field, a slow orbit ring carrying one lime star,
   a soft moon, and a constellation that grows one star at a time.
   Personal sky: a deterministic constellation grown from a wallet address.
   Pure canvas, no video, pauses when off screen or tab hidden. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mulberry(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function makeSky(canvas, opts) {
    if (!canvas) return null;
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, stars = [], walkers = [], raf = null, t0 = performance.now();
    var DPR = Math.min(window.devicePixelRatio || 1, 1.75);

    function build(seed) {
      var rnd = mulberry(seed);
      stars = [];
      var n = Math.floor(W * H / 6200);
      for (var i = 0; i < n; i++) {
        stars.push({ x: rnd() * W, y: rnd() * H, r: 0.5 + rnd() * 1.5, p: rnd() * Math.PI * 2, s: 0.4 + rnd() * 1.1 });
      }
      walkers = [];
      var count = opts.nodes;
      var cx = W * (opts.cx || 0.5), cy = H * (opts.cy || 0.46);
      for (var j = 0; j < count; j++) {
        var ang = (j / count) * Math.PI * 2 + rnd() * 0.7;
        var rad = (0.16 + rnd() * 0.30) * Math.min(W, H);
        walkers.push({
          x: cx + Math.cos(ang) * rad * 1.35, y: cy + Math.sin(ang) * rad * 0.8,
          r: 2.1 + rnd() * 2.9, born: j * 900
        });
      }
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(280, r.width); H = Math.max(240, r.height);
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      build(opts.seed);
      if (reduced) frame(1200);
    }
    function frame(now) {
      var t = now - t0;
      ctx.clearRect(0, 0, W, H);
      /* stars */
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.001 * st.s + st.p));
        ctx.globalAlpha = tw * 0.85;
        ctx.fillStyle = "#f6ecda";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      /* orbit ring + moon (hero only) */
      if (opts.orbit) {
        var small = W < 640;
        var cx = W * (small ? 0.84 : 0.76), cy = H * (small ? 0.17 : 0.34), R = Math.min(W, H) * (small ? 0.19 : 0.27);
        var mg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.15);
        mg.addColorStop(0, "rgba(246,236,218,.20)"); mg.addColorStop(1, "rgba(246,236,218,0)");
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(cx, cy, R * 1.15, 0, 7); ctx.fill();
        ctx.fillStyle = "#f6ecda";
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.52, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(41,38,65,.16)";
        ctx.beginPath(); ctx.arc(cx - R * 0.16, cy - R * 0.1, R * 0.09, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + R * 0.14, cy + R * 0.18, R * 0.06, 0, 7); ctx.fill();
        ctx.strokeStyle = "rgba(246,236,218,.75)"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
        var oa = t * 0.00011 - 0.7;
        var ox = cx + Math.cos(oa) * R, oy = cy + Math.sin(oa) * R;
        ctx.fillStyle = "#d7f75b";
        ctx.shadowColor = "#d7f75b"; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(ox, oy, 7, 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
      }
      /* growing constellation */
      ctx.strokeStyle = "rgba(246,236,218,.55)"; ctx.lineWidth = 1.3;
      ctx.beginPath();
      var drawn = 0;
      for (var j = 0; j < walkers.length; j++) {
        var w = walkers[j];
        if (t < w.born) break;
        drawn++;
        if (j === 0) ctx.moveTo(w.x, w.y); else ctx.lineTo(w.x, w.y);
      }
      ctx.stroke();
      for (var k = 0; k < drawn; k++) {
        var p = walkers[k];
        var pop = Math.min(1, (t - p.born) / 500);
        ctx.fillStyle = k % 5 === 4 ? "#d7f75b" : "#f6ecda";
        ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10 * pop;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pop + 0.4, 0, 7); ctx.fill();
        ctx.shadowBlur = 0;
      }
      if (!reduced && running) raf = requestAnimationFrame(frame);
    }
    var running = false;
    function start() { if (!running && !reduced) { running = true; raf = requestAnimationFrame(frame); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    resize();
    window.addEventListener("resize", resize);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(canvas);
    } else { start(); }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    if (reduced) frame(1400); else start();
    return { reseed: function (seed) { opts.seed = seed; build(seed); if (reduced) frame(1400); else { t0 = performance.now(); } } };
  }

  makeSky(document.getElementById("sky"), { seed: 20261125, nodes: 14, orbit: true, cx: 0.68, cy: 0.60 });
  var mine = makeSky(document.getElementById("mysky"), { seed: 4242, nodes: 9, orbit: false, cx: 0.60, cy: 0.52 });

  var form = document.getElementById("mysky-form");
  if (form && mine) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = document.getElementById("mysky-addr").value.trim().toLowerCase();
      var out = document.getElementById("mysky-out");
      if (!/^0x[0-9a-f]{40}$/.test(v)) {
        if (out) out.innerHTML = "That does not look like a BNB wallet address yet. Check it and try again.";
        return;
      }
      mine.reseed(hashStr(v));
      if (out) out.innerHTML = "A sky for <b>" + v.slice(0, 6) + "…" + v.slice(-4) + "</b>. Every Trace minted after launch takes a place in it, one star at a time.";
    });
  }
})();
