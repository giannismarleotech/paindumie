/* =========================================================
   Dashboard Pain du Mie
   Bewerkt de website rechtstreeks in GitHub. Geen server nodig.
   ========================================================= */
(function () {
  "use strict";

  var PAGES = [
    { f: "index.html", n: "Home" },
    { f: "kaart.html", n: "Kaart" },
    { f: "over-ons.html", n: "Over ons" },
    { f: "reserveren.html", n: "Reserveren" },
    { f: "contact.html", n: "Contact" },
    { f: "algemene-voorwaarden.html", n: "Algemene voorwaarden" },
    { f: "privacy.html", n: "Privacybeleid" },
    { f: "404.html", n: "Foutpagina" }
  ];
  var CSS_FILE = "assets/css/style.css";
  var CONFIG_FILE = "assets/js/config.js";

  // aanmelden (enkel een slot op de deur; de echte beveiliging is de GitHub-sleutel)
  var MAIL_HASH = "b08562db9db4b187f1e92799f3ebdeac5fb6a8d1ce974892b21653d21f51e9b8";
  var PASS_HASH = "8356e40969f44cc2787428b64b8ac0bcc5d018db754beeec67a10053f4218745";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var state = {
    gh: null,                      // {owner, repo, branch, token}
    page: PAGES[0].f,
    text: {},                      // { "index.html": { t3: {html:"…"} | {p1:"9,00",p2:"12,50"} } }
    images: {},                    // { "img/oud.jpg": {newPath, base64, dataUrl} }
    config: null,                  // gewijzigde instellingen
    configOrig: null,
    configRaw: null
  };

  /* ---------- kleine helpers ---------- */
  function sha256hex(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }
  function b64encode(text) {
    var bytes = new TextEncoder().encode(text), bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64decode(b64) {
    var bin = atob(b64.replace(/\s/g, "")), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }
  function show(el, yes) { el.hidden = !yes; }
  function setErr(el, msg) { if (!msg) { el.hidden = true; el.textContent = ""; } else { el.hidden = false; el.textContent = msg; } }

  /* ---------- GitHub ---------- */
  function ghFetch(path, opts) {
    opts = opts || {};
    var url = "https://api.github.com/repos/" + state.gh.owner + "/" + state.gh.repo + path;
    opts.headers = Object.assign({
      Authorization: "Bearer " + state.gh.token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }, opts.headers || {});
    return fetch(url, opts).then(function (r) {
      return r.text().then(function (body) {
        var data = null;
        try { data = JSON.parse(body); } catch (e) { /* leeg antwoord */ }
        if (!r.ok) {
          var msg = (data && data.message) || ("HTTP " + r.status);
          if (r.status === 401) msg = "De toegangssleutel wordt niet aanvaard. Maak een nieuwe aan en verbind opnieuw.";
          else if (r.status === 403) msg = "Geen toestemming. Controleer of de sleutel 'Contents: Read and write' heeft voor deze repository.";
          else if (r.status === 404) msg = "Niet gevonden: controleer gebruiker, repository en branch (" + path + ").";
          else if (r.status === 409 || r.status === 422) msg = "Het bestand werd ondertussen elders gewijzigd. Herlaad het dashboard en probeer opnieuw.";
          var err = new Error(msg); err.status = r.status; throw err;
        }
        return data;
      });
    });
  }
  function ghGet(path) {
    var q = "/contents/" + encodeURI(path) + "?ref=" + encodeURIComponent(state.gh.branch) + "&t=" + Date.now();
    return ghFetch(q).then(function (d) { return { sha: d.sha, text: b64decode(d.content || "") }; });
  }
  function ghGetSha(path) {
    var q = "/contents/" + encodeURI(path) + "?ref=" + encodeURIComponent(state.gh.branch) + "&t=" + Date.now();
    return ghFetch(q).then(function (d) { return d.sha; }).catch(function (e) {
      if (e.status === 404) return null;              // nieuw bestand
      throw e;
    });
  }
  function ghPut(path, contentB64, sha, message) {
    var body = { message: message, content: contentB64, branch: state.gh.branch };
    if (sha) body.sha = sha;
    return ghFetch("/contents/" + encodeURI(path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  /* ---------- aanmelden ---------- */
  var gate = $("#gate"), setup = $("#setup"), app = $("#app");

  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var mail = $("#gMail").value.trim().toLowerCase(), pass = $("#gPass").value;
    Promise.all([sha256hex(mail), sha256hex(pass)]).then(function (h) {
      if (h[0] !== MAIL_HASH || h[1] !== PASS_HASH) {
        setErr($("#gErr"), "E-mailadres of wachtwoord klopt niet.");
        return;
      }
      setErr($("#gErr"), "");
      sessionStorage.setItem("pdm-in", "1");
      afterLogin();
    });
  });

  function storedGh() {
    try {
      var raw = localStorage.getItem("pdm-gh") || sessionStorage.getItem("pdm-gh");
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function afterLogin() {
    var gh = storedGh();
    if (gh && gh.owner && gh.repo && gh.token) {
      state.gh = gh;
      startApp();
    } else {
      show(gate, false); show(setup, true);
      var g = gh || {};
      $("#sOwner").value = g.owner || "giannismarleotech";
      $("#sRepo").value = g.repo || "paindumie";
      $("#sBranch").value = g.branch || "main";
    }
  }

  $("#sBack").addEventListener("click", function () { show(setup, false); show(gate, true); });

  $("#setupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = $("#setupForm button[type=submit]");
    state.gh = {
      owner: $("#sOwner").value.trim().replace(/^https?:\/\/github\.com\//, "").split("/")[0],
      repo: $("#sRepo").value.trim().replace(/\.git$/, ""),
      branch: $("#sBranch").value.trim() || "main",
      token: $("#sToken").value.trim()
    };
    setErr($("#sErr"), "");
    btn.classList.add("busy");
    ghGet("index.html").then(function () {
      var store = $("#sRemember").checked ? localStorage : sessionStorage;
      store.setItem("pdm-gh", JSON.stringify(state.gh));
      btn.classList.remove("busy");
      startApp();
    }).catch(function (err) {
      btn.classList.remove("busy");
      state.gh = null;
      setErr($("#sErr"), err.message);
    });
  });

  $("#logoutBtn").addEventListener("click", function () {
    if (changeCount() && !confirm("Je hebt nog niet-gepubliceerde aanpassingen. Toch afmelden?")) return;
    sessionStorage.removeItem("pdm-in");
    localStorage.removeItem("pdm-gh");
    sessionStorage.removeItem("pdm-gh");
    location.reload();
  });

  /* ---------- dashboard starten ---------- */
  function startApp() {
    show(gate, false); show(setup, false); show(app, true);
    var sel = $("#pageSel");
    sel.innerHTML = PAGES.map(function (p) { return '<option value="' + p.f + '">' + p.n + "</option>"; }).join("");
    sel.value = state.page;
    sel.addEventListener("change", function () { state.page = sel.value; loadPreview(); });
    loadPreview();
    loadConfig().then(telNieuwe).catch(function () {});
  }

  /* ---------- voorbeeld met bewerking ---------- */
  var frame = $("#preview");

  function loadPreview() {
    show($("#loading"), true);
    frame.src = "../" + state.page + "?edit=1&t=" + Date.now();
  }

  frame.addEventListener("load", function () {
    var doc;
    try { doc = frame.contentDocument; } catch (e) { doc = null; }
    if (!doc || !doc.body) { show($("#loading"), false); return; }
    injectEditor(doc);
    show($("#loading"), false);
  });

  function injectEditor(doc) {
    // storende onderdelen uit de weg
    var intro = doc.getElementById("intro"); if (intro) intro.remove();
    var fx = doc.getElementById("pagefx"); if (fx) fx.remove();
    doc.body.classList.remove("intro-running");
    doc.documentElement.style.overflow = "";

    var st = doc.createElement("style");
    st.textContent =
      "[data-e],[data-img]{outline:1px dashed rgba(156,74,44,.45);outline-offset:3px;transition:outline-color .2s,background .2s}" +
      "[data-e]:hover,[data-img]:hover{outline:2px solid #9C4A2C;background:rgba(227,163,58,.14);cursor:text}" +
      "[data-img]:hover{cursor:pointer}" +
      "[data-e][contenteditable]:focus{outline:2px solid #9C4A2C;background:rgba(227,163,58,.2)}" +
      ".pdm-changed{outline:2px solid #3F7A46!important}" +
      ".pdm-imgbadge{position:absolute;z-index:99;background:#9C4A2C;color:#fff;font:500 12px/1 sans-serif;padding:6px 9px;border-radius:999px;pointer-events:none;transform:translate(8px,8px)}";
    doc.head.appendChild(st);

    // geen navigatie tijdens het bewerken
    doc.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      e.preventDefault();
      var href = (a.getAttribute("href") || "").split("#")[0];
      var match = PAGES.filter(function (p) { return p.f === href; })[0];
      if (match && href !== state.page) {
        state.page = href; $("#pageSel").value = href; loadPreview();
      }
    }, true);

    var pend = state.text[state.page] || {};

    $$("[data-e]", doc).forEach(function (el) {
      var id = el.getAttribute("data-e");

      if (el.hasAttribute("data-p1")) {                 // prijs met 1 stuk / 2 stuks
        el.addEventListener("click", function (ev) { ev.preventDefault(); openPrice(el); });
        if (pend[id] && pend[id].p1 !== undefined) {
          el.textContent = pend[id].p1;
          el.setAttribute("data-p1", pend[id].p1);
          if (pend[id].p2) el.setAttribute("data-p2", pend[id].p2); else el.removeAttribute("data-p2");
          el.classList.add("pdm-changed");
        }
        return;
      }

      if (pend[id] && pend[id].html !== undefined) {
        el.innerHTML = pend[id].html;
        el.classList.add("pdm-changed");
      }
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "true");
      el.addEventListener("paste", function (ev) {      // altijd platte tekst plakken
        ev.preventDefault();
        var t = (ev.clipboardData || frame.contentWindow.clipboardData).getData("text/plain");
        doc.execCommand("insertText", false, t);
      });
      el.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); el.blur(); }
        if (ev.key === "Escape") { el.blur(); }
      });
      el.addEventListener("input", function () {
        state.text[state.page] = state.text[state.page] || {};
        state.text[state.page][id] = { html: el.innerHTML };
        el.classList.add("pdm-changed");
        refreshCount();
      });
    });

    $$("[data-img]", doc).forEach(function (img) {
      var src = img.getAttribute("src");
      var rep = state.images[src];
      if (rep) { img.src = rep.dataUrl; img.classList.add("pdm-changed"); }
      img.addEventListener("click", function (ev) { ev.preventDefault(); pickImage(img); });
    });

    refreshCount();
  }

  /* ---------- prijs met twee bedragen ---------- */
  var priceEl = null;
  function openPrice(el) {
    priceEl = el;
    var row = el.closest(".special") || el.parentElement;
    var name = row ? (row.querySelector(".n") || {}).textContent : "";
    $("#prName").textContent = (name || "").trim();
    $("#prOne").value = el.getAttribute("data-p1") || "";
    $("#prTwo").value = el.getAttribute("data-p2") || "";
    show($("#priceModal"), true);
    setTimeout(function () { $("#prOne").focus(); }, 30);
  }
  function closePrice() { show($("#priceModal"), false); priceEl = null; }
  $("#prClose").addEventListener("click", closePrice);
  $("#prCancel").addEventListener("click", closePrice);
  $("#prSave").addEventListener("click", function () {
    if (!priceEl) return;
    var p1 = $("#prOne").value.trim(), p2 = $("#prTwo").value.trim();
    if (!p1) { $("#prOne").focus(); return; }
    var id = priceEl.getAttribute("data-e");
    priceEl.setAttribute("data-p1", p1);
    if (p2) priceEl.setAttribute("data-p2", p2); else priceEl.removeAttribute("data-p2");
    priceEl.textContent = p1;
    priceEl.classList.add("pdm-changed");
    state.text[state.page] = state.text[state.page] || {};
    state.text[state.page][id] = { p1: p1, p2: p2 };
    closePrice(); refreshCount();
  });

  /* ---------- foto vervangen ---------- */
  var imgEl = null, picker = $("#filePick");
  function pickImage(img) { imgEl = img; picker.value = ""; picker.click(); }

  picker.addEventListener("change", function () {
    var file = picker.files && picker.files[0];
    if (!file || !imgEl) return;
    if (!/^image\//.test(file.type)) { alert("Kies een afbeelding (jpg of png)."); return; }
    resizeImage(file).then(function (out) {
      var oldSrc = imgEl.getAttribute("src");
      var base = oldSrc.replace(/^img\//, "").replace(/\.[a-z0-9]+$/i, "").replace(/-\d{8,}$/, "");
      var stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
      var newPath = "img/" + base + "-" + stamp + ".jpg";
      state.images[oldSrc] = { newPath: newPath, base64: out.base64, dataUrl: out.dataUrl };
      imgEl.src = out.dataUrl;
      imgEl.classList.add("pdm-changed");
      refreshCount();
    }).catch(function () { alert("Deze afbeelding kon niet verwerkt worden. Probeer een andere."); });
  });

  function resizeImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var max = 1600, w = im.naturalWidth, h = im.naturalHeight;
        if (w > max) { h = Math.round(h * max / w); w = max; }
        var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(im, 0, 0, w, h);
        URL.revokeObjectURL(url);
        var dataUrl = cv.toDataURL("image/jpeg", 0.82);
        resolve({ dataUrl: dataUrl, base64: dataUrl.split(",")[1] });
      };
      im.onerror = function () { URL.revokeObjectURL(url); reject(); };
      im.src = url;
    });
  }

  /* ---------- instellingen ---------- */
  var DAYS = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];

  function loadConfig() {
    return ghGet(CONFIG_FILE).then(function (f) {
      state.configRaw = f.text;
      var m = f.text.match(/\/\*PDM-DATA-START\*\/([\s\S]*?)\/\*PDM-DATA-END\*\//);
      if (!m) throw new Error("De markeringen in config.js ontbreken.");
      state.configOrig = JSON.parse(m[1]);
      return state.configOrig;
    });
  }

  function fillSettings(c) {
    $("#cfLabel").value = c.phoneLabel || "";
    $("#cfPhone").value = c.phone || "";
    $("#cfMail").value = c.email || "";
    $("#cfApi").value = c.boekingenApi || "";
    $("#cfKey").value = c.boekingenKey || "";
    $("#cfFb").value = (c.links || {}).facebook || "";
    $("#cfIg").value = (c.links || {}).instagram || "";
    $("#cfGg").value = (c.links || {}).google || "";
    var r = c.reservations || {};
    $("#cfOpens").value = r.opensOn || "";
    $("#cfFirst").value = r.firstSlot || "";
    $("#cfStep").value = r.slotStep;
    $("#cfLast").value = r.lastSlotBeforeClose;
    $("#cfTear").value = (r.seats || {}).tearoom;
    $("#cfLoun").value = (r.seats || {}).lounge;
    $("#cfMax").value = r.maxPeople;
    $("#cfAhead").value = r.daysAhead;
    $("#cfClosed").value = (r.closedDates || []).join(", ");

    var rows = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
      var h = (c.hours || {})[d] || (c.hours || {})[String(d)];
      var open = h ? h[0] : "07:00", close = h ? h[1] : "18:00";
      return '<div class="hrow' + (h ? "" : " closed") + '" data-day="' + d + '">' +
        "<b>" + DAYS[d] + "</b>" +
        '<input type="time" class="h-open" value="' + open + '">' +
        '<input type="time" class="h-close" value="' + close + '">' +
        '<label><input type="checkbox" class="h-closed"' + (h ? "" : " checked") + "> gesloten</label>" +
        "</div>";
    }).join("");
    $("#hoursRows").innerHTML = rows;
    $$(".h-closed", $("#hoursRows")).forEach(function (cb) {
      cb.addEventListener("change", function () { cb.closest(".hrow").classList.toggle("closed", cb.checked); });
    });
  }

  function readSettings() {
    var c = JSON.parse(JSON.stringify(state.config || state.configOrig));
    c.phoneLabel = $("#cfLabel").value.trim();
    c.phone = $("#cfPhone").value.trim();
    c.email = $("#cfMail").value.trim();
    c.formEndpoint = c.email ? "https://formsubmit.co/ajax/" + c.email : "";
    c.boekingenApi = $("#cfApi").value.trim();
    c.boekingenKey = $("#cfKey").value.trim();
    c.links = { google: $("#cfGg").value.trim(), facebook: $("#cfFb").value.trim(), instagram: $("#cfIg").value.trim() };
    var hours = {};
    $$(".hrow", $("#hoursRows")).forEach(function (row) {
      var d = row.getAttribute("data-day");
      hours[d] = $(".h-closed", row).checked ? null : [$(".h-open", row).value, $(".h-close", row).value];
    });
    c.hours = hours;
    var r = c.reservations;
    r.opensOn = $("#cfOpens").value.trim();
    r.firstSlot = $("#cfFirst").value.trim() || "08:00";
    r.slotStep = Math.max(5, parseInt($("#cfStep").value, 10) || 30);
    r.lastSlotBeforeClose = Math.max(0, parseInt($("#cfLast").value, 10) || 0);
    r.seats = { tearoom: Math.max(1, parseInt($("#cfTear").value, 10) || 1), lounge: Math.max(1, parseInt($("#cfLoun").value, 10) || 1) };
    r.maxPeople = Math.max(1, parseInt($("#cfMax").value, 10) || 8);
    r.daysAhead = Math.max(1, parseInt($("#cfAhead").value, 10) || 60);
    r.closedDates = $("#cfClosed").value.split(",").map(function (s) { return s.trim(); })
      .filter(function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(s); });
    return c;
  }

  $("#settingsBtn").addEventListener("click", function () {
    setErr($("#setErr"), "");
    var open = function () { fillSettings(state.config || state.configOrig); show($("#settings"), true); };
    if (state.configOrig) open();
    else loadConfig().then(open).catch(function (e) { alert("De instellingen konden niet geladen worden: " + e.message); });
  });
  function closeSettings() { show($("#settings"), false); }
  $("#setClose").addEventListener("click", closeSettings);
  $("#setCancel").addEventListener("click", closeSettings);
  $("#setSave").addEventListener("click", function () {
    var c;
    try { c = readSettings(); } catch (e) { setErr($("#setErr"), "Er staat iets fout ingevuld."); return; }
    var leeg = $$(".hrow", $("#hoursRows")).some(function (row) {
      return !$(".h-closed", row).checked && (!$(".h-open", row).value || !$(".h-close", row).value);
    });
    if (leeg) { setErr($("#setErr"), "Vul bij elke open dag een begin- en einduur in."); return; }
    state.config = c;
    closeSettings(); refreshCount();
    loadPreview();               // openingsuren staan meteen juist in het voorbeeld
  });

  /* ---------- reservaties en berichten ---------- */
  var boek = { items: [], tab: "nieuw", bezig: false };

  function cfg() { return state.config || state.configOrig || {}; }

  function boekApi(body) {
    var c = cfg();
    if (!c.boekingenApi) return Promise.reject(new Error("niet-ingesteld"));
    return fetch(c.boekingenApi, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ sleutel: c.boekingenKey }, body))
    }).then(function () { return { ok: true }; });
  }

  /* De lijst komt binnen via een <script>-tag. Zo omzeilen we de omweg waar browsers over vallen. */
  function haalBoekingen() {
    var c = cfg();
    if (!c.boekingenApi) return Promise.reject(new Error("niet-ingesteld"));
    return new Promise(function (resolve, reject) {
      var naam = "pdmLijst" + Date.now();
      var s = document.createElement("script");
      var klaar = false;
      var timer = setTimeout(function () {
        if (klaar) return; klaar = true; s.remove(); delete window[naam];
        reject(new Error("Google antwoordt niet. Is het script wel geïmplementeerd voor 'Iedereen'?"));
      }, 25000);
      window[naam] = function (d) {
        if (klaar) return; klaar = true; clearTimeout(timer); s.remove(); delete window[naam];
        if (!d || d.ok !== true) {
          reject(new Error(d && d.fout === "sleutel"
            ? "De sleutel klopt niet met die in het Google-script."
            : "De lijst kon niet geladen worden."));
          return;
        }
        boek.items = d.items || [];
        resolve(boek.items);
      };
      s.src = c.boekingenApi + (c.boekingenApi.indexOf("?") > -1 ? "&" : "?") +
        "sleutel=" + encodeURIComponent(c.boekingenKey || "") + "&callback=" + naam + "&t=" + Date.now();
      s.onerror = function () {
        if (klaar) return; klaar = true; clearTimeout(timer); s.remove(); delete window[naam];
        reject(new Error("Google kon niet bereikt worden."));
      };
      document.head.appendChild(s);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m];
    });
  }

  function toonBoekingen() {
    var lijst = $("#boekLijst");
    var items = boek.items.filter(function (it) {
      if (boek.tab === "berichten") return it.soort === "bericht";
      if (boek.tab === "alles") return true;
      if (it.soort === "bericht") return false;
      if (boek.tab === "nieuw") return it.status === "nieuw";
      return it.status === "bevestigd";
    });
    $("#boekBadge").textContent = boek.items.filter(function (it) { return it.status === "nieuw"; }).length;
    show($("#boekBadge"), Number($("#boekBadge").textContent) > 0);

    if (!items.length) {
      lijst.innerHTML = '<p class="leeg">Niets in deze lijst.</p>';
      return;
    }
    lijst.innerHTML = items.map(function (it) {
      var bericht = it.soort === "bericht";
      var kop = bericht
        ? esc(it.onderwerp || "Bericht")
        : esc(it.dag || it.datum) + " om " + esc(it.uur) + " · " + esc(it.personen) +
          (String(it.personen) === "1" ? " persoon" : " personen");
      var det = bericht
        ? esc(it.opmerking)
        : "Plaats: " + esc(it.plaats || "-") +
          (it.gelegenheid && it.gelegenheid !== "-" ? " · " + esc(it.gelegenheid) : "") +
          (it.opmerking && it.opmerking !== "-" ? "<br>Opmerking: " + esc(it.opmerking) : "");
      var acties = bericht ? "" :
        '<button class="btn primary" data-act="bevestigd" data-id="' + esc(it.id) + '">Bevestigen</button>' +
        '<button class="btn ghost" data-act="geannuleerd" data-id="' + esc(it.id) + '">Annuleren</button>';
      return '<article class="kaartje ' + esc(it.status) + '">' +
        '<div class="top"><span class="wanneer">' + kop + '</span>' +
        '<span class="st ' + esc(it.status) + '">' + esc(it.status) + "</span></div>" +
        '<p class="wie" style="margin:4px 0 0">' + esc(it.naam) +
        (it.telefoon && it.telefoon !== "-" ? ' · <a href="tel:' + esc(it.telefoon) + '">' + esc(it.telefoon) + "</a>" : "") +
        (it.email ? ' · <a href="mailto:' + esc(it.email) + '">' + esc(it.email) + "</a>" : "") +
        "</p>" +
        '<p class="det">' + det + "</p>" +
        '<p class="mini" style="margin:8px 0 0">Binnengekomen: ' + esc(it.binnengekomen) + "</p>" +
        (acties ? '<div class="acties">' + acties + "</div>" : "") +
        "</article>";
    }).join("");

    $$("#boekLijst .acties .btn").forEach(function (b) {
      b.addEventListener("click", function () {
        b.classList.add("busy");
        boekApi({ actie: "status", id: b.dataset.id, status: b.dataset.act }).then(function () {
          boek.items.forEach(function (it) { if (it.id === b.dataset.id) it.status = b.dataset.act; });
          toonBoekingen();
          setTimeout(function () { haalBoekingen().then(toonBoekingen).catch(function () {}); }, 2500);
        }).catch(function () {
          b.classList.remove("busy");
          setErr($("#boekErr"), "De status kon niet aangepast worden. Probeer opnieuw.");
        });
      });
    });
  }

  function openBoek() {
    setErr($("#boekErr"), "");
    show($("#boek"), true);
    var c = cfg();
    show($("#boekUitleg"), !c.boekingenApi);
    if (!c.boekingenApi) {
      $("#boekLijst").innerHTML = '<p class="leeg">Nog niet ingesteld.<br>' +
        'Volg punt 5 van het LEESMIJ en vul het adres daarna in bij Instellingen.</p>';
      return;
    }
    $("#boekLijst").innerHTML = '<p class="mini">Laden…</p>';
    haalBoekingen().then(toonBoekingen).catch(function (e) {
      $("#boekLijst").innerHTML = '<p class="leeg">Geen lijst gevonden.</p>';
      setErr($("#boekErr"), e.message === "niet-ingesteld" ? "Nog niet ingesteld." : e.message);
    });
  }

  $("#boekBtn").addEventListener("click", openBoek);
  $("#boekVernieuw").addEventListener("click", openBoek);
  $("#boekClose").addEventListener("click", function () { show($("#boek"), false); });
  $("#boekCancel").addEventListener("click", function () { show($("#boek"), false); });
  $$("#boekTabs .tab").forEach(function (t) {
    t.addEventListener("click", function () {
      $$("#boekTabs .tab").forEach(function (x) { x.classList.toggle("on", x === t); });
      boek.tab = t.dataset.tab;
      toonBoekingen();
    });
  });

  /* teller van nieuwe aanvragen op de achtergrond */
  function telNieuwe() {
    if (!cfg().boekingenApi) return;
    haalBoekingen().then(function () {
      var n = boek.items.filter(function (it) { return it.status === "nieuw"; }).length;
      $("#boekBadge").textContent = n;
      show($("#boekBadge"), n > 0);
    }).catch(function () {});
  }

  /* ---------- teller en terugdraaien ---------- */
  function changeCount() {
    var n = 0;
    Object.keys(state.text).forEach(function (p) { n += Object.keys(state.text[p]).length; });
    n += Object.keys(state.images).length;
    if (state.config && JSON.stringify(state.config) !== JSON.stringify(state.configOrig)) n++;
    return n;
  }
  function refreshCount() {
    var n = changeCount();
    var c = $("#count");
    c.textContent = n + (n === 1 ? " aanpassing" : " aanpassingen");
    show(c, n > 0);
    show($("#resetBtn"), n > 0);
    $("#saveBtn").disabled = n === 0;
  }
  $("#resetBtn").addEventListener("click", function () {
    if (!confirm("Alle niet-gepubliceerde aanpassingen terugdraaien?")) return;
    state.text = {}; state.images = {}; state.config = null;
    refreshCount(); loadPreview();
  });
  window.addEventListener("beforeunload", function (e) {
    if (changeCount()) { e.preventDefault(); e.returnValue = ""; }
  });

  /* ---------- publiceren ---------- */
  var pub = $("#publish"), pubLog = $("#pubLog");
  function logLine(text, cls) {
    var li = document.createElement("li");
    li.textContent = text; if (cls) li.className = cls;
    pubLog.appendChild(li); pubLog.scrollTop = pubLog.scrollHeight;
    return li;
  }

  $("#saveBtn").addEventListener("click", function () {
    pubLog.innerHTML = ""; setErr($("#pubErr"), ""); show($("#pubNote"), false);
    $("#pubTitle").textContent = "Publiceren";
    show($("#pubGo"), true); show($("#pubCancel"), true); show($("#pubClose"), false);
    var lijst = [];
    Object.keys(state.text).forEach(function (p) {
      var n = Object.keys(state.text[p]).length;
      var naam = (PAGES.filter(function (x) { return x.f === p; })[0] || { n: p }).n;
      lijst.push(n + (n === 1 ? " tekst" : " teksten") + " op " + naam);
    });
    var ni = Object.keys(state.images).length;
    if (ni) lijst.push(ni + (ni === 1 ? " foto" : " foto's") + " vervangen");
    if (state.config && JSON.stringify(state.config) !== JSON.stringify(state.configOrig)) lijst.push("instellingen aangepast");
    lijst.forEach(function (t) { logLine(t); });
    show(pub, true);
  });
  function closePub() { show(pub, false); }
  $("#pubCancel").addEventListener("click", closePub);
  $("#pubClose").addEventListener("click", closePub);

  $("#pubGo").addEventListener("click", function () {
    var go = $("#pubGo"), cancel = $("#pubCancel");
    go.classList.add("busy"); cancel.disabled = true;
    pubLog.innerHTML = "";
    publish().then(function () {
      $("#pubTitle").textContent = "Gepubliceerd";
      logLine("Klaar! Alles staat online.", "ok");
      show($("#pubNote"), true);
      state.text = {}; state.images = {};
      if (state.config) { state.configOrig = state.config; state.config = null; }
      refreshCount();
      go.classList.remove("busy"); show(go, false); show(cancel, false); show($("#pubClose"), true);
      setTimeout(loadPreview, 1200);
    }).catch(function (err) {
      logLine(err.message, "bad");
      setErr($("#pubErr"), "Er ging iets mis. Je aanpassingen staan nog in het dashboard, dus je kan het opnieuw proberen.");
      go.classList.remove("busy"); cancel.disabled = false;
    });
  });

  function patchHtml(source, edits) {
    var doc = new DOMParser().parseFromString(source, "text/html");
    Object.keys(edits).forEach(function (id) {
      var el = doc.querySelector('[data-e="' + id + '"]');
      if (!el) return;                       // element bestaat niet meer: overslaan
      var v = edits[id];
      if (v.p1 !== undefined) {
        el.setAttribute("data-p1", v.p1);
        if (v.p2) el.setAttribute("data-p2", v.p2); else el.removeAttribute("data-p2");
        el.textContent = v.p1;
      } else {
        el.innerHTML = v.html;
      }
    });
    return "<!doctype html>\n" + doc.documentElement.outerHTML + "\n";
  }

  function publish() {
    var files = {};                       // pad -> {text, sha, changed}
    var imgs = Object.keys(state.images);
    var chain = Promise.resolve();

    // 1. nieuwe foto's opladen
    imgs.forEach(function (oldPath) {
      var rep = state.images[oldPath];
      chain = chain.then(function () {
        logLine("Foto opladen: " + rep.newPath.replace("img/", ""));
        return ghGetSha(rep.newPath).then(function (sha) {
          return ghPut(rep.newPath, rep.base64, sha, "Foto toegevoegd via dashboard");
        });
      });
    });

    // 2. bestanden ophalen die aangepast moeten worden
    var nodig = Object.keys(state.text);
    if (imgs.length) {
      PAGES.forEach(function (p) { if (nodig.indexOf(p.f) === -1) nodig.push(p.f); });
      nodig.push(CSS_FILE);
    }
    nodig.forEach(function (path) {
      chain = chain.then(function () {
        return ghGet(path).then(function (f) { files[path] = { text: f.text, sha: f.sha, changed: false }; });
      });
    });

    // 3. aanpassingen toepassen
    chain = chain.then(function () {
      Object.keys(state.text).forEach(function (page) {
        var f = files[page];
        if (!f) return;
        var nieuw = patchHtml(f.text, state.text[page]);
        if (nieuw !== f.text) { f.text = nieuw; f.changed = true; }
      });
      imgs.forEach(function (oldPath) {
        var rep = state.images[oldPath];
        Object.keys(files).forEach(function (path) {
          var f = files[path];
          var zoek = path === CSS_FILE ? oldPath.replace("img/", "") : oldPath;
          if (f.text.indexOf(zoek) === -1) return;
          var vervang = path === CSS_FILE ? rep.newPath.replace("img/", "") : rep.newPath;
          f.text = f.text.split(zoek).join(vervang);
          f.changed = true;
        });
      });
    });

    // 4. wegschrijven
    chain = chain.then(function () {
      var seq = Promise.resolve();
      Object.keys(files).forEach(function (path) {
        var f = files[path];
        if (!f.changed) return;
        seq = seq.then(function () {
          logLine("Bewaren: " + path);
          return ghPut(path, b64encode(f.text), f.sha, "Website aangepast via dashboard");
        });
      });
      return seq;
    });

    // 5. instellingen
    if (state.config && JSON.stringify(state.config) !== JSON.stringify(state.configOrig)) {
      chain = chain.then(function () {
        logLine("Bewaren: instellingen");
        return ghGet(CONFIG_FILE).then(function (f) {
          var json = JSON.stringify(state.config, null, 2);
          var nieuw = f.text.replace(/(\/\*PDM-DATA-START\*\/)[\s\S]*?(\/\*PDM-DATA-END\*\/)/, function (_, a, b) {
            return a + json + b;
          });
          return ghPut(CONFIG_FILE, b64encode(nieuw), f.sha, "Instellingen aangepast via dashboard");
        });
      });
    }
    return chain;
  }

  /* ---------- opstarten ---------- */
  if (sessionStorage.getItem("pdm-in") === "1") afterLogin();
  else { show(gate, true); $("#gMail").focus(); }
})();
