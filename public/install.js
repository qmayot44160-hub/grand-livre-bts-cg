/* Bouton « Installer l'appli » : installation en un clic (Chrome, Edge, Android)
   ou mode d'emploi pas à pas (iPhone/iPad, Firefox, Safari Mac). */
(function () {
  var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  window.GLInstall = { available: !standalone, go: function () { go(); } };
  if (standalone) return;
  var ua = navigator.userAgent || "";
  var iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  var firefox = /Firefox|FxiOS/.test(ua);
  var macSafari = !iOS && /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);
  var deferred = null, buttons = [];

  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener("appinstalled", function () { deferred = null; buttons.forEach(function (b) { b.hidden = true; }); close(); });

  var ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>';

  function steps() {
    if (iOS) return {
      t: "Installer sur iPhone / iPad",
      l: ["Ouvre ce site dans <b>Safari</b> (ou Chrome).",
          "Touche le bouton <b>Partager</b> <span class=\"gli-k\">⬆︎</span> (en bas de l'écran sur iPhone, en haut sur iPad).",
          "Fais défiler et choisis <b>« Sur l'écran d'accueil »</b>.",
          "Touche <b>Ajouter</b> : l'icône Grand Livre apparaît avec tes applis."]
    };
    if (android) return {
      t: "Installer sur Android",
      l: ["Ouvre ce site dans <b>Chrome</b>.",
          "Touche le menu <span class=\"gli-k\">⋮</span> en haut à droite.",
          "Choisis <b>« Installer l'appli »</b> (ou « Ajouter à l'écran d'accueil »).",
          "Confirme : l'icône Grand Livre apparaît avec tes applis."]
    };
    if (macSafari) return {
      t: "Installer sur Mac",
      l: ["Dans Safari, ouvre le menu <b>Fichier</b> (ou le bouton Partager).",
          "Choisis <b>« Ajouter au Dock »</b>.",
          "Le Grand Livre s'ouvre ensuite comme une appli depuis le Dock."]
    };
    return {
      t: "Installer sur ordinateur",
      l: [firefox ? "Firefox ne sait pas installer d'applis : ouvre ce site dans <b>Chrome</b> ou <b>Edge</b>." : "Utilise <b>Chrome</b> ou <b>Edge</b>.",
          "Clique sur l'icône d'installation <span class=\"gli-k\">⊕</span> à droite de la barre d'adresse (ou menu <span class=\"gli-k\">⋮</span> → <b>« Installer Grand Livre »</b>).",
          "Clique sur <b>Installer</b> : le Grand Livre s'ouvre dans sa propre fenêtre et a son icône sur le bureau et dans le menu Démarrer."]
    };
  }

  var dlg;
  function close() { if (dlg && dlg.open) dlg.close(); }
  function help() {
    var s = steps();
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.className = "gli-dlg";
      dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest(".gli-x")) close(); });
      document.body.appendChild(dlg);
    }
    dlg.innerHTML = '<div class="gli-in"><h2>' + s.t + '</h2><ol>' + s.l.map(function (x) { return "<li>" + x + "</li>"; }).join("") +
      '</ol><p class="gli-n">Ta progression reste la même : l\'appli utilise ton compte.</p><button type="button" class="gli-x">J\'ai compris</button></div>';
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
  }
  async function go() {
    if (deferred) {
      var e = deferred; deferred = null;
      try { e.prompt(); var r = await e.userChoice; if (r && r.outcome === "accepted") return; } catch (x) {}
      return;
    }
    help();
  }

  var css = document.createElement("style");
  css.textContent =
    ".gli-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-weight:600;cursor:pointer;border-radius:10px;border:1px solid var(--accent,#2c43c6);background:var(--accent-soft,#e7eafb);color:var(--accent,#2c43c6);padding:11px 14px}" +
    ".gli-btn:hover{filter:brightness(.97)}" +
    ".gli-top{flex:none;border-radius:999px;padding:8px;border:1px solid var(--rule-strong,#c7cde3);background:var(--sheet,#fff);color:var(--ink,#1c2142)}.gli-top span{display:none}.gli-top:hover{border-color:var(--accent,#2c43c6);color:var(--accent,#2c43c6)}" +
    ".gli-dlg{border:0;border-radius:16px;padding:0;max-width:min(440px,calc(100vw - 32px));background:var(--sheet,#fff);color:var(--ink,#1c2142);box-shadow:0 20px 50px rgba(0,0,0,.3)}" +
    ".gli-dlg::backdrop{background:rgba(15,18,40,.55)}" +
    ".gli-in{padding:22px;display:grid;gap:12px;font:16px/1.5 var(--f-b,system-ui,sans-serif)}" +
    ".gli-in h2{margin:0;font:800 1.3rem/1.2 var(--f-d,system-ui,sans-serif)}.gli-in ol{margin:0;padding-left:1.3em;display:grid;gap:8px}" +
    ".gli-k{display:inline-block;min-width:1.5em;text-align:center;border:1px solid var(--rule,#e0e4f0);border-radius:6px;padding:0 .3em;background:var(--paper,#f4f6fb)}" +
    ".gli-n{margin:0;color:var(--muted,#5a6088);font-size:.88rem}" +
    ".gli-x{justify-self:end;font:inherit;font-weight:700;border:0;border-radius:10px;padding:10px 16px;background:var(--accent,#2c43c6);color:#fff;cursor:pointer}" +
    "@media (prefers-color-scheme:dark){.gli-x{color:#11132a}}";
  document.head.appendChild(css);

  function mount() {
    var slot = document.getElementById("glInstallSlot");
    if (slot) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "gli-btn"; b.innerHTML = ICON + "<span>Installer l'appli sur cet appareil</span>";
      b.onclick = go; slot.appendChild(b); buttons.push(b);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
