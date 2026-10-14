/* Grand Livre en ligne : remplace les fonctions de Claude (progression, identité, correction)
   par celles du serveur du site. Injecté avant le code de l'appli. */
(function () {
  var ME = __GL_ME__;
  function toLogin() { location.replace("/"); }
  async function api(method, url, body, signal) {
    var r = await fetch(url, { method: method, credentials: "same-origin", signal: signal, headers: body ? { "Content-Type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401) { toLogin(); throw { code: "not_granted" }; }
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw { code: j.code || (r.status === 429 ? "rate_limited" : r.status === 413 ? "resource_exhausted" : r.status >= 500 ? "unavailable" : "failed"), message: j.error || "" };
    return j;
  }
  var db = {
    doc: function () {
      return {
        get: async function () { var j = await api("GET", "/api/progress"); return { exists: !!j.data, data: function () { return j.data; } }; },
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
  window.claude = { use: async function (n) { return n === "db" ? db : n === "user" ? user : n === "sample" ? sample : null; } };

  /* Bloc « Mon compte » dans la page Mon BTS */
  function accountPanel() {
    var d = document.createElement("section");
    d.className = "panel gl-account";
    d.innerHTML = '<div class="gl-acc-row"><div><b>Mon compte</b><p class="muted" style="margin:.2em 0 0">Compte : <b class="gl-name"></b>. Ta progression est enregistrée sur ce compte et te suit sur tous tes appareils.</p></div>' +
      '<div class="gl-acc-btns"><button class="btn" type="button" data-gl="pw">Changer de mot de passe</button><button class="btn" type="button" data-gl="out">Se déconnecter</button></div></div>' +
      '<form class="gl-pw" hidden><label>Mot de passe actuel<input type="password" name="old" autocomplete="current-password"></label><label>Nouveau mot de passe<input type="password" name="password" autocomplete="new-password" minlength="6"></label><div class="gl-acc-btns"><button class="btn primary" type="submit">Enregistrer</button></div><p class="gl-msg muted" role="status"></p></form>';
    d.querySelector(".gl-name").textContent = ME.name;
    d.addEventListener("click", async function (e) {
      var b = e.target.closest("[data-gl]"); if (!b) return;
      if (b.dataset.gl === "out") { try { await fetch("/api/logout", { method: "POST" }); } catch (x) {} toLogin(); }
      if (b.dataset.gl === "pw") { var f = d.querySelector(".gl-pw"); f.hidden = !f.hidden; }
    });
    d.querySelector(".gl-pw").addEventListener("submit", async function (e) {
      e.preventDefault(); var f = e.target, m = f.querySelector(".gl-msg");
      try { await api("POST", "/api/password", { old: f.old.value, password: f.password.value }); m.textContent = "Mot de passe modifié."; f.reset(); }
      catch (x) { m.textContent = x.message || "Impossible de modifier le mot de passe."; }
    });
    return d;
  }

  /* Bouton « Se déconnecter » dans la barre du haut : retour à la page de connexion */
  function addLogout() {
    var top = document.querySelector(".top-inner");
    if (!top || top.querySelector(".gl-out")) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "gl-out"; b.title = "Se déconnecter (" + ME.name + ")";
    b.setAttribute("aria-label", "Se déconnecter et revenir à la page de connexion");
    b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/></svg><span>Déconnexion</span>';
    b.addEventListener("click", async function () { b.disabled = true; try { await fetch("/api/logout", { method: "POST" }); } catch (x) {} toLogin(); });
    top.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addLogout); else addLogout();
  var st = document.createElement("style");
  st.textContent = ".gl-out{display:inline-flex;align-items:center;gap:6px;flex:none;border:1px solid var(--rule-strong,#c7cde3);background:var(--sheet,#fff);color:var(--ink,#1c2142);border-radius:999px;padding:8px 12px;font:inherit;font-weight:600;font-size:.9rem;cursor:pointer}.gl-out:hover{border-color:var(--accent,#2c43c6);color:var(--accent,#2c43c6)}.gl-out span{display:none}.gl-out{padding:8px}@media (max-width:480px){.top-inner .who .lvl{display:none}}.gl-account{margin:16px 0}.gl-acc-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}.gl-acc-btns{display:flex;flex-wrap:wrap;gap:8px}.gl-pw{display:grid;gap:10px;margin-top:12px;max-width:420px}.gl-pw label{display:grid;gap:4px;font-weight:600;font-size:.9rem}.gl-pw input{font:inherit;padding:9px 10px;border:1px solid var(--rule-strong,#c7cde3);border-radius:9px;background:var(--paper,#f4f6fb);color:var(--ink,#1c2142)}";
  document.head.appendChild(st);
  new MutationObserver(function () {
    var hero = document.querySelector(".bts-hero");
    if (hero && !document.querySelector(".gl-account")) hero.insertAdjacentElement("afterend", accountPanel());
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
