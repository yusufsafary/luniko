/* LUNIKO · live board.
   Contracts are not deployed yet (see config.js), so chain reads stay off and
   boards show an honest Genesis state. Clocks always run on real UTC time:
   Sparks seal at 00:00 UTC, claim phases open every 6 hours. */
(function () {
  "use strict";
  var cfg = window.LUNIKO_CONFIG || {};
  var live = !!(cfg.contracts && cfg.contracts.traces);

  var PROMPTS = [
    "What if a quietest thing in a room had a story?",
    "Why do shadows stretch at end of day?",
    "Where does a story begin?",
    "Can a map be a feeling?",
    "What does moonlight remember?",
    "Which sound does rain keep for itself?",
    "What grows in a garden nobody planted?",
    "How far can a paper boat remember?",
    "What if clouds were slow letters?",
    "Who teaches a river its way home?",
    "What colour is a held breath?",
    "Where do lost buttons go to be found?",
    "What does a seed dream about?",
    "Can silence have a shape?",
    "What if doors remembered every hand?"
  ];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmtClock(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(ss);
  }
  function nextUtcMidnight(now) {
    var d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return d.getTime();
  }
  function nextPhase(now) {
    var step = 6 * 3600 * 1000;
    var dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    var elapsed = now.getTime() - dayStart;
    return dayStart + (Math.floor(elapsed / step) + 1) * step;
  }
  function dayOfYear(now) {
    var start = Date.UTC(now.getUTCFullYear(), 0, 0);
    return Math.floor((now.getTime() - start) / 86400000);
  }

  function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  /* Header + board status */
  var statusTxt = live ? "Live" : "Genesis · awaiting first Spark";
  setText("h-status", statusTxt);
  setText("board-status", live ? "Live on BNB Chain" : "Genesis · awaiting first Spark");

  /* Spark of the day: rotates daily, numbered from a Genesis day one. */
  var now0 = new Date();
  var prompt = PROMPTS[dayOfYear(now0) % PROMPTS.length];
  setText("spark-prompt", prompt);
  setText("spark-no", live ? "…" : "Nº 1 · Genesis");

  /* Verdict gauge: Genesis sits at zero, honestly. */
  if (!live) {
    setText("spark-traces", "0");
    setText("spark-agents", "0");
    setText("spark-verdict", "Unwritten");
    setText("claim-total", "0");
  }

  /* Phase chips: highlight a phase holding current UTC hour. */
  function paintPhases(now) {
    var idx = Math.floor(now.getUTCHours() / 6);
    document.querySelectorAll(".phase-chip").forEach(function (chip, i) {
      chip.classList.toggle("on", i === idx);
    });
    setText("phase-now-label", "Phase " + ["00:00", "06:00", "12:00", "18:00"][idx] + " UTC is open now");
  }

  function tick() {
    var now = new Date();
    setText("seal-count", fmtClock(nextUtcMidnight(now) - now.getTime()));
    setText("phase-count", fmtClock(nextPhase(now) - now.getTime()));
    paintPhases(now);
  }
  tick();
  setInterval(tick, 1000);

  /* Read-only claim checker: honest pre-launch answer, real lookup after launch. */
  var form = document.getElementById("checker-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = document.getElementById("checker-id").value.trim();
      var out = document.getElementById("checker-out");
      if (!v) { out.textContent = "Type a Trace number first."; return; }
      if (!live) {
        out.innerHTML = "Trace <b>#" + v.replace(/[<>&]/g, "") + "</b> cannot be checked yet. Claims open after Genesis launch, in phases every 6 hours.";
        return;
      }
      out.textContent = "Reading chain…";
    });
  }
})();
