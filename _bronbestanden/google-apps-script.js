/**
 * PAIN DU MIE — reservaties en berichten bewaren
 * ------------------------------------------------------------------
 * Dit script hoort in Google Apps Script, niet op de website.
 * Het bewaart elke reservatie en elk contactbericht in een Google Sheet,
 * stuurt een e-mail naar de zaak, en levert de lijst aan het dashboard.
 *
 * INSTALLEREN (eenmalig, ongeveer vijf minuten)
 *  1. Ga naar https://sheets.new en geef het blad een naam,
 *     bijvoorbeeld "Pain du Mie — reservaties".
 *  2. Menu Extensions (Extensies) > Apps Script.
 *  3. Verwijder alles wat er staat en plak deze volledige tekst erin.
 *  4. Pas hieronder MAIL en SLEUTEL aan.
 *  5. Klik op Deploy (Implementeren) > New deployment (Nieuwe implementatie).
 *     - Type: Web app (Web-app)
 *     - Execute as (Uitvoeren als): Me (Ikzelf)
 *     - Who has access (Wie heeft toegang): Anyone (Iedereen)
 *     - Deploy, en geef toestemming wanneer Google dat vraagt.
 *  6. Kopieer het adres dat eindigt op /exec.
 *  7. Zet dat adres en dezelfde sleutel in assets/js/config.js bij
 *     "boekingenApi" en "boekingenKey", of vul ze in via het dashboard.
 *
 * Pas je dit script later aan? Kies dan Deploy > Manage deployments >
 * potloodje > Version: New version > Deploy. Het adres blijft hetzelfde.
 */

var MAIL    = "paindumie.bazel@gmail.com";   // hierheen gaan de meldingen
var ZAAK    = "Pain du Mie";                 // afzender van de mails naar klanten
var ONDERTEKENING = "\n\nTot snel!\nPain du Mie\nKruibekestraat 58, 9150 Bazel\n0498 48 22 56";
var SLEUTEL = "paindumie-2026";              // zelfde woord als in config.js
var BLAD    = "Reservaties";

var KOLOMMEN = ["id", "binnengekomen", "soort", "status", "dag", "datum", "uur",
                "personen", "plaats", "gelegenheid", "naam", "telefoon", "email",
                "onderwerp", "opmerking", "notitie"];

function blad_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(BLAD);
  if (!sh) {
    sh = ss.insertSheet(BLAD);
    sh.appendRow(KOLOMMEN);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, KOLOMMEN.length).setFontWeight("bold");
  }
  return sh;
}

function antwoord_(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^[\w$]+$/.test(callback)) {          // JSONP: voor het dashboard
    return ContentService.createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- binnenkomende aanvragen ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents || "{}");

    if (d.actie === "status") {
      if (d.sleutel !== SLEUTEL) return antwoord_({ ok: false, fout: "sleutel" });
      return antwoord_(zetStatus_(d.id, d.status, d.notitie));
    }

    var sh = blad_();
    var id = "R" + new Date().getTime();
    var rij = {
      id: id,
      binnengekomen: new Date(),
      soort: d.soort === "bericht" ? "bericht" : "reservatie",
      status: "nieuw",
      dag: d.dag || "", datum: d.datum || "", uur: d.uur || "",
      personen: d.personen || "", plaats: d.plaats || "", gelegenheid: d.gelegenheid || "",
      naam: d.naam || "", telefoon: d.telefoon || "", email: d.email || "",
      onderwerp: d.onderwerp || "", opmerking: d.opmerking || d.bericht || "", notitie: ""
    };
    // als tekst wegschrijven, anders maakt Sheets van "08:00" een tijd en van "0498…" een getal
    var nieuweRij = sh.getLastRow() + 1;
    var bereik = sh.getRange(nieuweRij, 1, 1, KOLOMMEN.length);
    bereik.setNumberFormat("@");
    bereik.setValues([KOLOMMEN.map(function (k) {
      var v = rij[k];
      return (v instanceof Date) ? Utilities.formatDate(v, "Europe/Brussels", "yyyy-MM-dd HH:mm") : String(v);
    })]);
    stuurMail_(rij);
    stuurOntvangst_(rij);
    return antwoord_({ ok: true, id: id });
  } catch (err) {
    return antwoord_({ ok: false, fout: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/* ---------- lijst voor het dashboard ---------- */
function doGet(e) {
  var p = e.parameter || {};
  if (p.sleutel !== SLEUTEL) return antwoord_({ ok: false, fout: "sleutel" }, p.callback);
  var sh = blad_();
  var waarden = sh.getDataRange().getValues();
  var koppen = waarden.shift() || [];
  var DAGEN = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  var MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  function isDatum(v) { return Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v); }
  var items = waarden.map(function (r) {
    var o = {};
    koppen.forEach(function (k, i) {
      var v = r[i];
      if (isDatum(v)) {                                    // oudere rijen die Sheets zelf omzette
        if (k === "uur") v = Utilities.formatDate(v, "Europe/Brussels", "HH:mm");
        else if (k === "datum") v = Utilities.formatDate(v, "Europe/Brussels", "yyyy-MM-dd");
        else if (k === "dag") v = DAGEN[v.getDay()] + " " + v.getDate() + " " + MAANDEN[v.getMonth()];
        else v = Utilities.formatDate(v, "Europe/Brussels", "yyyy-MM-dd HH:mm");
      } else if (k === "telefoon" && typeof v === "number") {
        v = "0" + v;                                       // verloren nul terugzetten
      }
      o[k] = v;
    });
    return o;
  }).filter(function (o) { return o.id; });
  items.reverse();                                  // nieuwste eerst
  return antwoord_({ ok: true, items: items.slice(0, 500) }, p.callback);
}

function zetStatus_(id, status, notitie) {
  var sh = blad_();
  var waarden = sh.getDataRange().getValues();
  var koppen = waarden[0];
  var kId = koppen.indexOf("id"), kSt = koppen.indexOf("status"), kNo = koppen.indexOf("notitie");
  for (var i = 1; i < waarden.length; i++) {
    if (String(waarden[i][kId]) === String(id)) {
      if (status) sh.getRange(i + 1, kSt + 1).setValue(status);
      if (notitie !== undefined && notitie !== null) sh.getRange(i + 1, kNo + 1).setValue(notitie);
      var rij = {};
      koppen.forEach(function (k, j) { rij[k] = waarden[i][j]; });
      if (status === "bevestigd" || status === "geannuleerd") stuurBeslissing_(rij, status, notitie);
      return { ok: true };
    }
  }
  return { ok: false, fout: "niet gevonden" };
}

/* ontvangstmail naar de klant, meteen na de aanvraag */
function stuurOntvangst_(r) {
  if (!r.email || r.email.indexOf("@") < 0) return;
  try {
    var titel, tekst;
    if (r.soort === "bericht") {
      titel = "We hebben je bericht ontvangen";
      tekst = "Dag " + voornaam_(r.naam) + ",\n\nBedankt voor je bericht. We antwoorden zo snel mogelijk." + ONDERTEKENING;
    } else {
      titel = "Je aanvraag bij Pain du Mie";
      tekst = "Dag " + voornaam_(r.naam) + ",\n\nBedankt voor je aanvraag voor " + r.dag.toLowerCase() + " om " + r.uur +
        " met " + r.personen + " " + (String(r.personen) === "1" ? "persoon" : "personen") + "." +
        "\n\nDit is nog geen bevestiging: we laten je zo snel mogelijk weten of het lukt." + ONDERTEKENING;
    }
    MailApp.sendEmail({ to: r.email, subject: titel, body: tekst, name: ZAAK, replyTo: MAIL });
  } catch (err) {}
}

/* mail naar de klant zodra er in het dashboard op Bevestigen of Annuleren geklikt is */
function stuurBeslissing_(r, status, notitie) {
  if (!r.email || String(r.email).indexOf("@") < 0 || r.soort === "bericht") return;
  try {
    var dag = r.dag, uur = r.uur;
    if (Object.prototype.toString.call(dag) === "[object Date]") dag = Utilities.formatDate(dag, "Europe/Brussels", "d MMMM");
    if (Object.prototype.toString.call(uur) === "[object Date]") uur = Utilities.formatDate(uur, "Europe/Brussels", "HH:mm");
    var titel, tekst;
    if (status === "bevestigd") {
      titel = "Je tafel is bevestigd";
      tekst = "Dag " + voornaam_(r.naam) + ",\n\nGoed nieuws: je tafel op " + String(dag).toLowerCase() + " om " + uur +
        " voor " + r.personen + " " + (String(r.personen) === "1" ? "persoon" : "personen") + " is bevestigd." +
        "\n\nKom je toch niet, laat het ons dan even weten." + ONDERTEKENING;
    } else {
      titel = "Je aanvraag bij Pain du Mie";
      tekst = "Dag " + voornaam_(r.naam) + ",\n\nHelaas lukt het niet op " + String(dag).toLowerCase() + " om " + uur + "." +
        (notitie ? "\n\n" + notitie : "") +
        "\n\nBel of app ons gerust op 0498 48 22 56, dan zoeken we samen een ander moment." + ONDERTEKENING;
    }
    MailApp.sendEmail({ to: r.email, subject: titel, body: tekst, name: ZAAK, replyTo: MAIL });
  } catch (err) {}
}

function voornaam_(naam) {
  var v = String(naam || "").trim().split(" ")[0];
  return v || "daar";
}

function stuurMail_(r) {
  try {
    var titel, tekst;
    if (r.soort === "bericht") {
      titel = "Nieuw bericht via de website — " + r.naam;
      tekst = "Onderwerp: " + r.onderwerp +
        "\nNaam: " + r.naam + "\nE-mail: " + r.email + "\nTelefoon: " + r.telefoon +
        "\n\n" + r.opmerking;
    } else {
      titel = "Reservatie " + r.dag + " om " + r.uur + " — " + r.personen + "p — " + r.naam;
      tekst = "Dag: " + r.dag + " (" + r.datum + ")\nUur: " + r.uur +
        "\nPersonen: " + r.personen + "\nPlaats: " + r.plaats +
        "\nGelegenheid: " + (r.gelegenheid || "-") +
        "\n\nNaam: " + r.naam + "\nTelefoon: " + r.telefoon + "\nE-mail: " + r.email +
        "\nOpmerking: " + (r.opmerking || "-");
    }
    tekst += "\n\n— Deze aanvraag staat ook in het dashboard op je website.";
    MailApp.sendEmail({ to: MAIL, subject: titel, body: tekst, replyTo: r.email || MAIL });
  } catch (err) { /* mail mislukt: de aanvraag staat wel in het blad */ }
}
