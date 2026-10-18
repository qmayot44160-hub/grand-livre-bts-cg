/* Grand Livre en ligne : remplace les fonctions de l'artefact (progression, identité, correction)
   par celles du serveur du site. Injecté avant le code de l'appli. */
(function () {
  var ME = __GL_ME__, GUEST = !!ME.guest;
  window.GL_NAME = ME.name; window.GL_GUEST = GUEST;
  /* Clés du stockage local : celle de ce compte (réécrite par le serveur) et celle de l'essai sans compte. */
  var UK = "grand-livre-btscg-v1", GK = "grand-livre-btscg-" + "v1-guest";
  /* Essai : sur un appareil partagé, un essai abandonné depuis plus de 2 jours repart de zéro */
  if (GUEST) try { var gd = JSON.parse(localStorage.getItem(GK) || "null"); if (gd && gd.u && Date.now() - gd.u > 2 * 864e5) localStorage.removeItem(GK); } catch (e) {}
  /* Juste après une inscription : la progression faite en essai passe sur le nouveau compte. */
  if (!GUEST) try {
    if (localStorage.getItem("gl-from-trial") === "1") {
      localStorage.removeItem("gl-from-trial");
      var g = localStorage.getItem(GK);
      if (g && !localStorage.getItem(UK)) { localStorage.setItem(UK, g); localStorage.removeItem(GK); }
    }
  } catch (e) {}

  /* Rapport de bug anonyme : message, page et version, jamais tes réponses ni ton nom. */
  (function () {
    var sent = 0, seen = {};
    function report(msg, stack) {
      try {
        msg = String(msg || "").slice(0, 300); if (!msg || seen[msg] || sent >= 5) return; seen[msg] = 1; sent++;
        var body = JSON.stringify({ m: msg, s: String(stack || "").slice(0, 900), p: (typeof view !== "undefined" ? view : "") + (GUEST ? " (essai)" : ""), v: "web" });
        if (navigator.sendBeacon) navigator.sendBeacon("/api/err", new Blob([body], { type: "application/json" }));
        else fetch("/api/err", { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true }).catch(function () {});
      } catch (e) {}
    }
    window.addEventListener("error", function (e) { if (e && e.message && !/^Script error/.test(e.message)) report(e.message, (e.error && e.error.stack) || (e.filename + ":" + e.lineno)); });
    window.addEventListener("unhandledrejection", function (e) { var r = e && e.reason; if (r && (r.code === "unavailable" || r.code === "not_granted" || r.name === "AbortError")) return; report(r && (r.message || r.code) || String(r), r && r.stack); });
  })();
  async function dropCache() { try { if (window.caches) { var ks = await caches.keys(); await Promise.all(ks.map(function (k) { return caches.delete(k); })); } } catch (e) {} }
  async function toLogin() { await dropCache(); location.replace("/"); }
  async function api(method, url, body, signal) {
    var r;
    try { r = await fetch(url, { method: method, credentials: "same-origin", signal: signal, keepalive: method === "PUT" && body && JSON.stringify(body).length < 60000, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined }); }
    catch (e) { if (e && e.name === "AbortError") throw e; throw { code: "unavailable", message: "Hors connexion" }; }
    if (r.status === 401) { toLogin(); throw { code: "not_granted" }; }
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw { code: j.code || (r.status === 429 ? "rate_limited" : r.status === 413 ? "resource_exhausted" : r.status >= 500 ? "unavailable" : "failed"), message: j.error || "" };
    return j;
  }
  var db = {
    doc: function () {
      return {
        get: async function () { var j = await api("GET", "/api/progress?v=2"); return { exists: !!j.data, data: function () { return j.data; } }; },
        set: async function (obj) { await api("PUT", "/api/progress", obj); }
      };
    }
  };
  var user = { id: async function () { return ME.id; }, me: async function () { return { id: ME.id, name: ME.name }; }, isOwner: function () { return false; }, canEdit: function () { return false; } };

  function shrink(blob) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(blob), img = new Image();
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        var data = c.toDataURL("image/jpeg", 0.85);
        resolve({ type: "image/jpeg", data: data.slice(data.indexOf(",") + 1) });
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }
  async function ask(input, opts, asJson) {
    opts = opts || {};
    var list = opts.images ? Array.prototype.slice.call(opts.images instanceof Blob ? [opts.images] : opts.images) : [];
    var imgs = (await Promise.all(list.slice(0, 6).map(shrink))).filter(Boolean);
    var j = await api("POST", "/api/sample", { input: input, images: imgs, json: !!asJson }, opts.signal);
    if (opts.onText) try { opts.onText({ text: j.text, delta: j.text }); } catch (e) {}
    return j;
  }
  var sample = null;
  if (ME.ai) {
    sample = function (input, opts) { return ask(input, opts, false); };
    sample.json = async function (input, opts) {
      var j = await ask(input, opts, true), t = String(j.text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
      try { return JSON.parse(t); } catch (e) {
        var a = t.indexOf("{"), b = t.lastIndexOf("}");
        if (a >= 0 && b > a) try { return JSON.parse(t.slice(a, b + 1)); } catch (e2) {}
        throw { code: "invalid_json", text: j.text };
      }
    };
    sample.limits = async function () { return { inputBytes: 200000, images: { maxCount: 6, maxBytes: 20 * 1024 * 1024, mediaTypes: ["image/jpeg", "image/png", "image/webp"] } }; };
  }
  window.claude = { use: async function (n) { if (GUEST) return null; return n === "db" ? db : n === "user" ? user : n === "sample" ? sample : null; } };

  /* Signalements : envoyés au serveur (en mode essai, gardés sur l'appareil) */
  if (!GUEST) window.GL_REPORT = function (r) { return api("POST", "/api/report", r); };
  if (!GUEST) window.GL_CLASS = function () { return api("GET", "/api/class"); };
  if (!GUEST) window.GL_AV = function () { return api("GET", "/api/avatars"); };
  if (!GUEST) window.GL_PV = { list: function () { return api("GET", "/api/progress/versions"); }, restore: function (id) { return api("POST", "/api/progress/restore", { id: id }); } };
  if (!GUEST) window.GL_FRIENDS = {
    list: function () { return api("GET", "/api/friends"); },
    add: function (code) { return api("POST", "/api/friends/add", { code: code }); },
    respond: function (k, accept) { return api("POST", "/api/friends/respond", { k: k, accept: !!accept }); },
    remove: function (k) { return api("POST", "/api/friends/remove", { k: k }); }
  };
  if (!GUEST) window.GL_ROOM = {
    create: function () { return api("POST", "/api/room", {}); },
    join: function (code) { return api("POST", "/api/room/join", { code: code }); },
    get: function (id) { return api("GET", "/api/room/" + encodeURIComponent(id)); },
    start: function (id, ids, cats) { return api("POST", "/api/room/" + encodeURIComponent(id) + "/start", { ids: ids, cats: cats }); },
    ans: function (id, i, pos, ok) { return api("POST", "/api/room/" + encodeURIComponent(id) + "/ans", { i: i, pos: pos, ok: ok }); },
    next: function (id) { return api("POST", "/api/room/" + encodeURIComponent(id) + "/next", {}); },
    leave: function (id) { return api("POST", "/api/room/" + encodeURIComponent(id) + "/leave", {}); }
  };
  if (!GUEST) window.GL_DUEL = {
    list: function () { return api("GET", "/api/duels"); },
    inbox: function () { return api("GET", "/api/inbox"); },
    create: function (o) { return api("POST", "/api/duel", o); },
    join: function (code) { return api("POST", "/api/duel/join", { code: code }); },
    get: function (id) { return api("GET", "/api/duel/" + encodeURIComponent(id)); },
    start: function (id) { return api("POST", "/api/duel/" + encodeURIComponent(id) + "/start", {}); },
    ans: function (id, i, ok, t) { return api("POST", "/api/duel/" + encodeURIComponent(id) + "/ans", { i: i, ok: ok, t: t }); },
    rematch: function (id, ids) { return api("POST", "/api/duel/" + encodeURIComponent(id) + "/rematch", { ids: ids }); },
    decline: function (id) { return api("POST", "/api/duel/" + encodeURIComponent(id) + "/decline", {}); }
  };

  /* Rappels quotidiens (notifications) */
  function b64(u) { var p = "=".repeat((4 - u.length % 4) % 4), b = atob((u + p).replace(/-/g, "+").replace(/_/g, "/")), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  var PUSH = {
    ok: function () { return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; },
    ios: function () { return /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window.matchMedia && matchMedia("(display-mode: standalone)").matches) && !navigator.standalone; },
    current: async function () { var r = await navigator.serviceWorker.ready; return r.pushManager.getSubscription(); },
    on: async function (hour) {
      var perm = await Notification.requestPermission(); if (perm !== "granted") throw { message: "Notifications refusées dans les réglages du téléphone ou du navigateur." };
      var k = await api("GET", "/api/push/key"), reg = await navigator.serviceWorker.ready;
      var sub = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(k.key) });
      await api("POST", "/api/push/sub", { sub: sub.toJSON(), hour: hour });
    },
    off: async function () { var sub = await PUSH.current(); if (sub) { try { await api("POST", "/api/push/unsub", { endpoint: sub.endpoint }); } catch (e) {} await sub.unsubscribe(); } },
    hour: async function () { try { var sub = await PUSH.current(); if (!sub) return null; var k = await api("GET", "/api/push/key"); var m = (k.subs || []).filter(function (x) { return x.endpoint === sub.endpoint; })[0]; return m ? m.hour : null; } catch (e) { return null; } }
  };

  /* Bloc « Mon compte » dans le profil */
  function hours(sel) { var o = ""; for (var hh = 7; hh <= 22; hh++) o += '<option value="' + hh + '"' + (hh === sel ? " selected" : "") + ">" + hh + " h</option>"; return o; }
  function accountPanel() {
    var d = document.createElement("section");
    d.className = "panel gl-account";
    if (GUEST) {
      d.innerHTML = '<div class="gl-acc-row"><div><b>Mode essai</b><p class="muted" style="margin:.2em 0 0">L\'essai ouvre P1 et la CEJM. Ta progression reste sur cet appareil (effacée après 2 jours sans visite). Crée ton compte pour tout débloquer : ce que tu as fait pendant l\'essai est repris.</p></div>' +
        '<div class="gl-acc-btns"><a class="btn primary" href="/#signup">Créer mon compte</a><a class="btn" href="/#login">J\'ai déjà un compte</a><button class="btn" type="button" data-gl="reset">Effacer l\'essai</button></div></div>' +
        '<p class="gl-legal"><a href="/mentions-legales">Mentions légales</a><a href="/confidentialite">Confidentialité</a></p>';
      d.addEventListener("click", function (e) { var b = e.target.closest('[data-gl="reset"]'); if (!b) return; try { localStorage.removeItem(UK); } catch (x) {} location.reload(); });
      return d;
    }
    d.innerHTML = '<div class="gl-acc-row"><div><b>Mon compte</b><p class="muted" style="margin:.2em 0 0">Compte : <b class="gl-name"></b>. Ta progression est enregistrée sur ce compte et te suit sur tous tes appareils.</p></div>' +
      '<div class="gl-acc-btns"><button class="btn" type="button" data-gl="pw">Changer de mot de passe</button><button class="btn" type="button" data-gl="inst" hidden>Installer l\'appli</button><button class="btn" type="button" data-gl="out">Se déconnecter</button></div></div>' +
      '<form class="gl-pw" hidden><label>Mot de passe actuel<input type="password" name="old" autocomplete="current-password"></label><label>Nouveau mot de passe<input type="password" name="password" autocomplete="new-password" minlength="6"></label><div class="gl-acc-btns"><button class="btn primary" type="submit">Enregistrer</button></div><p class="gl-msg muted" role="status"></p></form>' +
      '<div class="gl-sep"></div><div class="gl-acc-row"><div><b>Ma classe</b><p class="muted gl-grp-txt" style="margin:.2em 0 0">…</p></div><form class="gl-acc-btns gl-grp-f"></form></div><p class="gl-msg muted gl-grp-msg" role="status"></p>' +
      '<div class="gl-sep"></div><div class="gl-acc-row gl-push"><div><b>Rappel quotidien</b><p class="muted gl-push-txt" style="margin:.2em 0 0">Une notification par jour quand des cartes ou des questions t\'attendent, sauf si tu as déjà révisé.</p></div>' +
      '<div class="gl-acc-btns"><select class="gl-hour" aria-label="Heure du rappel">' + hours(18) + '</select><button class="btn" type="button" data-gl="push">Activer</button><button class="btn" type="button" data-gl="ptest" hidden>Tester</button></div></div><p class="gl-msg muted gl-push-msg" role="status"></p>' +
      '<div class="gl-sep"></div><div class="gl-acc-row"><div><b>Mes données</b><p class="muted" style="margin:.2em 0 0">Tout ce que le site garde sur toi, dans un fichier.</p></div><div class="gl-acc-btns"><a class="btn" href="/api/account/export" download>Télécharger mes données</a></div></div>' +
      '<div class="gl-sep"></div><div class="gl-acc-row"><div><b>Supprimer mon compte</b><p class="muted" style="margin:.2em 0 0">Efface ton compte et toute ta progression, définitivement.</p></div><div class="gl-acc-btns"><button class="btn gl-danger" type="button" data-gl="del">Supprimer…</button></div></div>' +
      '<form class="gl-del" hidden><p><b>C\'est définitif.</b> Ta progression ne pourra pas être récupérée. Pense à télécharger une sauvegarde avant si tu veux la garder.</p><label>Ton mot de passe pour confirmer<input type="password" name="password" autocomplete="current-password" required></label><div class="gl-acc-btns"><button class="btn" type="button" data-gl="delno">Annuler</button><button class="btn gl-danger" type="submit">Supprimer définitivement</button></div><p class="gl-msg" role="alert"></p></form>' +
      '<p class="gl-legal"><a href="/mentions-legales">Mentions légales et conditions d\'utilisation</a><a href="/confidentialite">Confidentialité</a></p>';
    d.querySelector(".gl-name").textContent = ME.name;
    var gt = d.querySelector(".gl-grp-txt"), gf = d.querySelector(".gl-grp-f"), gmsg = d.querySelector(".gl-grp-msg");
    function grpUi(g) {
      gf.innerHTML = "";
      if (g) {
        gt.innerHTML = 'Tu es dans la classe <b></b>. Ton prof voit ta progression (pas tes réponses une à une).'; gt.querySelector("b").textContent = g.name;
        var q = document.createElement("button"); q.type = "button"; q.className = "btn"; q.textContent = "Quitter la classe"; gf.appendChild(q);
        q.addEventListener("click", function () { var go = async function () { try { grpUi((await api("POST", "/api/group/leave", {})).groupe); gmsg.textContent = "Tu as quitté la classe."; } catch (x) { gmsg.textContent = x.message || "Impossible pour l'instant."; } }; if (typeof askConfirm === "function") askConfirm("Quitter la classe ?", "Ton prof ne verra plus ta progression. Tu pourras revenir avec le code.", "Quitter").then(function (ok) { if (ok) go(); }); else go(); });
      } else {
        gt.textContent = "Ton prof t'a donné un code ? Entre-le pour rejoindre ta classe.";
        var i = document.createElement("input"); i.name = "code"; i.placeholder = "Code (6 caractères)"; i.maxLength = 8; i.autocomplete = "off"; i.setAttribute("autocapitalize", "characters"); i.className = "gl-hour"; i.style.textTransform = "uppercase"; i.style.width = "11em"; i.setAttribute("aria-label", "Code de la classe");
        var b = document.createElement("button"); b.type = "submit"; b.className = "btn"; b.textContent = "Rejoindre";
        gf.appendChild(i); gf.appendChild(b);
      }
    }
    gf.addEventListener("submit", async function (e) { e.preventDefault(); var c = gf.code && gf.code.value.trim(); if (!c) return; gmsg.textContent = ""; try { var g = (await api("POST", "/api/group/join", { code: c })).groupe; grpUi(g); gmsg.textContent = "Bienvenue dans la classe « " + g.name + " » !"; } catch (x) { gmsg.textContent = x.message || "Code refusé."; } });
    api("GET", "/api/group").then(function (j) { grpUi(j.groupe); }).catch(function () { gt.textContent = "Indisponible hors connexion."; });
    if (window.GLInstall && window.GLInstall.available) d.querySelector('[data-gl="inst"]').hidden = false;
    var pb = d.querySelector('[data-gl="push"]'), pt = d.querySelector('[data-gl="ptest"]'), pm = d.querySelector(".gl-push-msg"), hs = d.querySelector(".gl-hour");
    function pushUi(h) { var on = h != null; pb.textContent = on ? "Désactiver" : "Activer"; pb.dataset.on = on ? "1" : ""; pt.hidden = !on; if (on) hs.value = String(h); }
    if (!PUSH.ok()) { pb.disabled = true; hs.disabled = true; pm.textContent = PUSH.ios() ? "Sur iPhone : ajoute d'abord le Grand Livre à l'écran d'accueil (Partager › Sur l'écran d'accueil), puis ouvre-le depuis l'icône pour activer les rappels." : "Les notifications ne sont pas disponibles dans ce navigateur."; }
    else PUSH.hour().then(pushUi);
    hs.addEventListener("change", async function () { if (pb.dataset.on) { try { await PUSH.on(+hs.value); pm.textContent = "Rappel déplacé à " + hs.value + " h."; } catch (x) { pm.textContent = x.message || "Impossible de changer l'heure."; } } });
    d.addEventListener("click", async function (e) {
      var b = e.target.closest("[data-gl]"); if (!b) return;
      if (b.dataset.gl === "out") { if (typeof askConfirm === "function") askConfirm("Se déconnecter ?", "Ta progression reste enregistrée sur ton compte. Tu pourras te reconnecter quand tu veux.", "Se déconnecter").then(function (ok) { if (ok) logout(); }); else logout(); }
      if (b.dataset.gl === "inst" && window.GLInstall) window.GLInstall.go();
      if (b.dataset.gl === "pw") { var f = d.querySelector(".gl-pw"); f.hidden = !f.hidden; }
      if (b.dataset.gl === "del") { var g = d.querySelector(".gl-del"); g.hidden = false; g.querySelector("input").focus(); }
      if (b.dataset.gl === "delno") { d.querySelector(".gl-del").hidden = true; }
      if (b.dataset.gl === "push") {
        b.disabled = true; pm.textContent = "";
        try { if (b.dataset.on) { await PUSH.off(); pushUi(null); pm.textContent = "Rappels désactivés sur cet appareil."; } else { await PUSH.on(+hs.value); pushUi(+hs.value); pm.textContent = "C'est noté : un rappel vers " + hs.value + " h les jours où tu n'as pas encore révisé."; } }
        catch (x) { pm.textContent = x.message || "Impossible d'activer les rappels sur cet appareil."; }
        b.disabled = false;
      }
      if (b.dataset.gl === "ptest") { try { await api("POST", "/api/push/test", {}); pm.textContent = "Notification de test envoyée."; } catch (x) { pm.textContent = x.message || "Échec de l'envoi."; } }
    });
    d.querySelector(".gl-pw").addEventListener("submit", async function (e) {
      e.preventDefault(); var f = e.target, m = f.querySelector(".gl-msg");
      try { await api("POST", "/api/password", { old: f.old.value, password: f.password.value }); m.textContent = "Mot de passe modifié."; f.reset(); }
      catch (x) { m.textContent = x.message || "Impossible de modifier le mot de passe."; }
    });
    d.querySelector(".gl-del").addEventListener("submit", async function (e) {
      e.preventDefault(); var f = e.target, m = f.querySelector(".gl-msg"), btn = f.querySelector('[type="submit"]');
      btn.disabled = true;
      try {
        await api("POST", "/api/account/delete", { password: f.password.value });
        try { await PUSH.off(); } catch (x) {}
        try { localStorage.removeItem(UK); localStorage.removeItem("gl-last-name"); } catch (x) {}
        await dropCache(); location.replace("/");
      } catch (x) { m.textContent = x.message || "Suppression impossible."; btn.disabled = false; }
    });
    return d;
  }

  /* Bandeau du mode essai */
  if (GUEST) {
    var gb = function () {
      if (document.querySelector(".gl-trial")) return;
      var t = document.createElement("div"); t.className = "gl-trial"; t.setAttribute("role", "note");
      t.innerHTML = '<span><b>Mode essai</b> · P1 et CEJM ouverts, progression gardée sur cet appareil.</span><a href="/#signup">Créer mon compte</a>';
      document.body.insertBefore(t, document.body.firstChild);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", gb); else gb();
  }

  /* Menu « compte » dans la barre du haut : installer l'appli, retour à la page de connexion */
  async function logout() { try { await fetch("/api/logout", { method: "POST" }); } catch (x) {} await toLogin(); }
  function addLogout() { // bouton « Mon profil » : ouvre directement la page profil (réglages, compte, déconnexion)
    var top = document.querySelector(".top-inner");
    if (!top || top.querySelector(".gl-menu")) return;
    var w = document.createElement("div"); w.className = "gl-menu";
    var b = document.createElement("button");
    b.type = "button"; b.className = "gl-out"; b.title = "Mon profil (" + (GUEST ? "mode essai" : ME.name) + ")";
    b.setAttribute("aria-label", "Mon profil, réglages et compte");
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
    b.dataset.ic = b.innerHTML;
    b.addEventListener("click", function () { if (typeof go === "function") go("profil"); });
    w.appendChild(b); top.appendChild(w);
    try { if (typeof renderTop === "function") renderTop(); } catch (x) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addLogout); else addLogout();
  var st = document.createElement("style");
  st.textContent = ".gl-out{display:inline-flex;align-items:center;gap:6px;flex:none;border:1px solid var(--rule-strong,#C3CBD6);background:var(--sheet,#fff);color:var(--ink,#18202B);border-radius:var(--radius,8px);padding:8px 12px;font:inherit;font-weight:600;font-size:.9rem;cursor:pointer}.gl-out:hover{border-color:var(--accent,#1E3A5F);color:var(--accent,#1E3A5F)}.gl-out{padding:8px}.gl-menu{position:relative;flex:none}.gl-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:60;min-width:220px;background:var(--sheet,#fff);border:1px solid var(--rule-strong,#C3CBD6);border-radius:var(--radius,8px);box-shadow:0 2px 8px rgba(24,32,43,.12);padding:6px;display:grid}.gl-pop[hidden],.gl-pop [hidden]{display:none!important}.gl-pop-who{padding:8px 10px 6px;font-weight:700;color:var(--muted,#59657A);font-size:.85rem;border-bottom:1px solid var(--rule,#D6DCE4);margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.gl-pop button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;background:none;color:var(--ink,#18202B);font:inherit;font-weight:600;padding:10px;border-radius:var(--radius,8px);cursor:pointer}.gl-pop button:hover{background:var(--accent-soft,#E8EDF4);color:var(--accent,#1E3A5F)}@media (min-width:761px){.top-inner .gs-btn span,.top-inner .gs-btn kbd{display:none}.top-inner .gs-btn{padding:8px}}@media (min-width:761px) and (max-width:1099px){.top-inner{gap:10px}.top-inner .who .lvl{display:none}}@media (min-width:761px) and (max-width:1019px){.top-inner .nav-btn{font-size:0;gap:0;padding:9px 12px}.top-inner .nav-btn .svg{width:20px;height:20px}}@media (max-width:480px){.top-inner .who .lvl{display:none}}.gl-account{margin:16px 0}.gl-acc-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}.gl-acc-btns{display:flex;flex-wrap:wrap;gap:8px}.gl-pw{display:grid;gap:10px;margin-top:12px;max-width:420px}.gl-pw label{display:grid;gap:4px;font-weight:600;font-size:.9rem}.gl-pw input,.gl-del input,.gl-hour{font:inherit;padding:9px 10px;border:1px solid var(--rule-strong,#C3CBD6);border-radius:var(--radius,8px);background:var(--paper,#F5F7FA);color:var(--ink,#18202B)}.gl-del{display:grid;gap:10px;margin-top:12px;max-width:460px;padding:12px;border:1px solid var(--bad,#B42318);border-radius:var(--radius,8px)}.gl-del p{margin:0}.gl-del label{display:grid;gap:4px;font-weight:600;font-size:.9rem}.gl-del .gl-msg{color:var(--bad,#B42318)}.gl-danger{border-color:var(--bad,#B42318)!important;color:var(--bad,#B42318)!important}.gl-sep{height:1px;background:var(--rule,#D6DCE4);margin:14px 0}.gl-legal{display:flex;flex-wrap:wrap;gap:14px;margin:16px 0 0;font-size:.85rem}.gl-legal a{color:var(--accent,#1E3A5F)}.gl-account a.btn{text-decoration:none;color:var(--ink,#18202B)}.gl-account a.btn.primary{color:var(--accent-ink,#fff)}.gl-push-msg{margin:6px 0 0;font-size:.88rem}.gl-trial{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:center;padding:8px 16px;background:var(--accent-soft,#E8EDF4);color:var(--ink,#18202B);font-size:.88rem;text-align:center}.gl-trial a{font-weight:700;color:var(--accent,#1E3A5F)}";
  document.head.appendChild(st);
  new MutationObserver(function () {
    var set = document.querySelector(".pf-settings");
    if (set && !document.querySelector(".gl-account")) set.insertAdjacentElement("afterend", accountPanel());
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
(function () { /* Œil pour afficher / masquer les mots de passe */
  var EYE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  var NOEYE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a10.6 10.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  var st = document.createElement("style");
  st.textContent = ".pw-wrap{position:relative;display:block;width:100%}.pw-wrap>input{width:100%;padding-right:46px!important;box-sizing:border-box}.pw-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:38px;height:38px;display:grid;place-items:center;border:0;background:none;color:inherit;opacity:.6;cursor:pointer;border-radius:var(--radius,8px);padding:0}.pw-eye:hover,.pw-eye:focus-visible{opacity:1}.pw-eye[aria-pressed=true]{opacity:.95}";
  document.head.appendChild(st);
  function add(i) {
    if (i.dataset.eye) return; i.dataset.eye = "1";
    if (i.parentNode.querySelector(".eye,.pw-eye")) return; /* la page a déjà son propre œil */
    var w = i.parentNode;
    if (!w.classList.contains("field")) { w = document.createElement("span"); w.className = "pw-wrap"; i.parentNode.insertBefore(w, i); w.appendChild(i); }
    else i.style.paddingRight = "46px";
    var b = document.createElement("button"); b.type = "button"; b.className = "pw-eye"; b.innerHTML = EYE;
    b.setAttribute("aria-label", "Afficher le mot de passe"); b.setAttribute("aria-pressed", "false");
    b.addEventListener("mousedown", function (e) { e.preventDefault(); });
    b.addEventListener("click", function () { var show = i.type === "password"; i.type = show ? "text" : "password"; b.innerHTML = show ? NOEYE : EYE; b.setAttribute("aria-pressed", String(show)); b.setAttribute("aria-label", show ? "Masquer le mot de passe" : "Afficher le mot de passe"); i.focus(); });
    w.appendChild(b);
    var f = i.form; if (f && !f.dataset.eyeReset) { f.dataset.eyeReset = "1"; f.addEventListener("submit", function () { f.querySelectorAll("input[data-eye]").forEach(function (x) { if (x.type === "text") { x.type = "password"; var bb = x.parentNode.querySelector(".pw-eye"); if (bb) { bb.innerHTML = EYE; bb.setAttribute("aria-pressed", "false"); } } }); }, true); }
  }
  function scan() { document.querySelectorAll('input[type="password"]:not([data-eye])').forEach(add); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
