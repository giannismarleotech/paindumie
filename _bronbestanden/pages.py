# -*- coding: utf-8 -*-
from common import *

LD = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"CafeOrCoffeeShop","name":"Pain du Mie","description":"Bakkerij en tearoom in Bazel","image":"img/counter.jpg","telephone":"+32498482256","email":"paindumie.bazel@gmail.com","servesCuisine":["Bakkerij","Desserts","Koffie"],"acceptsReservations":"True","menu":"kaart.html","address":{"@type":"PostalAddress","streetAddress":"Kruibekestraat 58","postalCode":"9150","addressLocality":"Bazel","addressCountry":"BE"},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Wednesday","Thursday"],"opens":"07:00","closes":"16:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Friday","Saturday","Sunday"],"opens":"07:00","closes":"18:00"}],"sameAs":["https://www.facebook.com/p/PainduMie-Bakkerij-Tearoom-61587728842605/"]}
</script>
"""

VISIT = """
<section class="visit" id="bezoek">
  <div class="wrap visit-grid">
    <div>
      <h2>Kom langs</h2>
      <div class="contact-list">
        <div><svg aria-hidden="true"><use href="#i-pin"/></svg><span>Kruibekestraat 58<br>9150 Bazel</span></div>
        <div><svg aria-hidden="true"><use href="#i-phone"/></svg><a href="tel:+32498482256">0498 48 22 56</a></div>
        <div><svg aria-hidden="true"><use href="#i-mail"/></svg><a href="mailto:paindumie.bazel@gmail.com">paindumie.bazel@gmail.com</a></div>
      </div>
      <div class="btn-row">
        <a class="btn btn-brick" data-link="google" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg>Route plannen</a>
        <a class="btn btn-line" data-link="facebook" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-fb"/></svg>Facebook</a>
        <a class="btn btn-line" data-link="instagram" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-ig"/></svg>Instagram</a>
      </div>
      <a class="review" data-link="google" href="#" target="_blank" rel="noopener">
        <span><strong>Was het lekker?</strong><small>Laat een review achter op Google</small></span>
        <span class="stars" aria-hidden="true"><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg></span>
      </a>
    </div>
    <div class="map" data-map>
      <div class="map-consent">
        <div>
          <strong>Kruibekestraat 58, Bazel</strong>
          <p>De kaart wordt geladen via Google Maps. Daarbij kan Google cookies plaatsen.</p>
          <button class="btn btn-brick" type="button"><svg aria-hidden="true"><use href="#i-pin"/></svg>Toon de kaart</button>
        </div>
      </div>
    </div>
  </div>
</section>
"""

def home():
    p = "index.html"
    return head("Pain du Mie · Bakkerij en tearoom in Bazel","Bakkerij en tearoom in Bazel. Spring binnen voor je brood, blijf hangen voor een goeie koffie of schuif aan voor ontbijt, lunch of iets zoets.",p,LD) + header(p) + f"""
<main id="main">
<div class="intro" id="intro" aria-hidden="true">
  <div class="pk-stage">
    <div class="pk"></div>
    <div class="pk"></div>
    <div class="pk"></div>
    <div class="pk"></div>
    <div class="pk-top">
      <svg class="pk-syrup" viewBox="0 0 200 200"><path d="{SYRUP_PATH}"/></svg>
      <span class="pk-butter"></span>
    </div>
    {STEAM_SVG % "pk-steam"}
    {ring_svg("pk-ring","pkc")}
  </div>
  <div class="intro-word" id="introWord"><b><span>Meer dan brood</span></b><i>een plek om te genieten</i></div>
  <button class="intro-skip" type="button" id="introSkip">Overslaan</button>
</div>

<section class="hero" aria-label="Welkom">
  <div class="hero-frame">
    <img src="img/counter.jpg" alt="De toonbank van Pain du Mie met vers brood en gebak" fetchpriority="high">
    <div class="hero-copy">
      <h1><span class="w"><span>Meer</span></span> <span class="w"><span>dan</span></span> <span class="w"><span>brood</span></span></h1>
      <span class="script">een plek om te genieten</span>
      <p class="hero-sub">Spring binnen voor je dagelijkse brood, blijf hangen voor een goeie koffie of schuif gezellig aan voor ontbijt of lunch. Bij Pain du Mie mag het allemaal n&eacute;t wat langer duren. <svg class="heart" aria-hidden="true"><use href="#i-heart"/></svg></p>
      <div class="hero-actions">
        <a class="btn btn-brick" href="kaart.html">Ontdek onze kaart</a>
        <a class="btn btn-ghost" href="reserveren.html">Reserveer je tafel</a>
      </div>
      <p class="hero-tag">Van vroeg ontbijt tot een zoete goesting tussendoor.</p>
    </div>
    <div class="floaties" aria-hidden="true">
      <div class="fl fl-a">{PANCAKE_SVG}</div>
      <div class="fl fl-b">{CUP_SVG}</div>
      <div class="fl fl-c">{CAKE_SVG}</div>
    </div>
    <div class="hero-foot"><span class="status-dot" data-status-dot></span><span data-status-text></span></div>
    <div class="seal" aria-hidden="true">
      <svg class="ring" viewBox="0 0 200 200"><defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs><text><textPath href="#circ" textLength="486" lengthAdjust="spacing">VERSE PRODUCTEN • ZALIGE MOMENTEN •</textPath></text></svg>
      <svg class="heart"><use href="#i-heart"/></svg>
    </div>
  </div>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker-track" id="ticker" data-words="Oreo Madness|Lotus Bomb|Brusselse wafel|Cappuccino|Dame blanche|Bueno Overload|Kinder Rolls|Latte karamel|Warme appeltaart|Verse muntthee"></div></div>

<section class="quick" aria-labelledby="h-quick">
  <div class="wrap">
    <h2 id="h-quick" class="sr">Wat je bij ons vindt</h2>
    <div class="quick-grid">
      <a class="tile" href="kaart.html#ontbijt"><img src="img/zaal-tafels.jpg" alt="" loading="lazy"><span><b>Ontbijt</b>Een goeie dag begint aan tafel</span><svg aria-hidden="true"><use href="#i-right"/></svg></a>
      <a class="tile" href="kaart.html#lunch"><img src="img/zaal-ramen.jpg" alt="" loading="lazy"><span><b>Lunch</b>Eten waar je blij van wordt</span><svg aria-hidden="true"><use href="#i-right"/></svg></a>
      <a class="tile" href="kaart.html#specials"><img src="img/gebakjes.jpg" alt="" loading="lazy"><span><b>Zoet</b>Bewaar altijd een plaatsje</span><svg aria-hidden="true"><use href="#i-right"/></svg></a>
      <a class="tile" href="kaart.html#warm"><img src="img/lounge.jpg" alt="" loading="lazy"><span><b>Iets drinken</b>Geen honger? Ook welkom</span><svg aria-hidden="true"><use href="#i-right"/></svg></a>
    </div>
  </div>
</section>

<section class="crave" id="honger" aria-labelledby="h-crave">
  <div class="wrap">
    <div class="crave-head">
      <div>
        <h2 id="h-crave">Groot van formaat. <span class="script">Gevaarlijk lekker.</span></h2>
        <p style="margin-top:22px">Onze reuzepannenkoeken komen dampend aan tafel, onder een laag warme saus en crumble. Eentje, of toch maar twee?</p>
        <div class="on-dark">{qty_toggle("homeSpecials")}</div>
      </div>
      <div class="stack" id="stack" aria-hidden="true">
        <div class="stack-inner">
          {ring_svg("ring3d","ck-ring")}
          <div class="ck"></div>
          <div class="ck"></div>
          <div class="ck"></div>
          <div class="ck"></div>
          <div class="ck-top">
            <svg class="syr" viewBox="0 0 200 200"><path d="{SYRUP_PATH}"/></svg>
            <span class="ck-butter"></span>
          </div>
          {STEAM_SVG % "ck-steam"}
        </div>
        <span class="tagline">Groter dan je bord.</span>
      </div>
    </div>
    <div class="specials" id="homeSpecials">
{special_cards()}
    </div>
    <div class="crave-foot">
      <p>Ook Brusselse wafels, ijs en onze speciallekes.</p>
      <a class="btn btn-line" href="kaart.html" style="color:var(--cream)">Bekijk de volledige kaart</a>
    </div>
  </div>
</section>

<section class="info" id="welkom" aria-labelledby="h-info">
  <div class="wrap info-grid">
    <div>
      <h2 id="h-info"><span class="script">Pain du Mie, da's een beetje van ons</span></h2>
      <p class="lede">Lekker eten, goeie koffie, gezelligheid en vooral: iedereen welkom. Met of zonder reservatie.</p>
      <div class="btn-row">
        <a class="btn btn-line" href="over-ons.html">Leer ons kennen</a>
        <a class="btn btn-brick" href="reserveren.html"><svg aria-hidden="true"><use href="#i-cal"/></svg>Reserveer je tafel</a>
      </div>
      <div class="contact-list" style="margin-top:34px">
        <div><svg aria-hidden="true"><use href="#i-pin"/></svg><span>Kruibekestraat 58, 9150 Bazel<br><a data-link="google" href="#" target="_blank" rel="noopener">Route plannen</a></span></div>
        <div><svg aria-hidden="true"><use href="#i-phone"/></svg><a href="tel:+32498482256">0498 48 22 56</a></div>
      </div>
    </div>
    <aside class="hours" aria-labelledby="h-hours">
      <h3 id="h-hours">Openingsuren</h3>
      <div class="today"><span class="status-dot" data-status-dot></span><span data-status-text></span></div>
      <dl data-hours></dl>
      <address><span>Tot snel!</span><span class="tot script">&#9825;</span></address>
    </aside>
  </div>
</section>
</main>
""" + footer(p)

def over():
    p = "over-ons.html"
    return head("Over ons · Pain du Mie Bazel","Pain du Mie in Bazel is de zaak van Mieke en Steve: bakkerij, ontbijt, lunch en iets zoets.",p) + header(p) + f"""
<main id="main">
<section class="phero">
  <div class="wrap phero-grid">
    <div class="anim-in">
      <p class="crumb"><a href="index.html">Home</a> / Over ons</p>
      <h1>Pain du Mie, <span class="script">da's een beetje van ons</span></h1>
      <p class="lede">Wat begon als een bakkerij, groeide uit tot iets waar we al lang van droomden: een plek waar je niet alleen binnenloopt voor je brood, maar waar je ook even kunt blijven.</p>
    </div>
    <figure class="photo reveal"><img src="img/zaal.jpg" alt="De zaal van Pain du Mie met tafels, banken en de toonbank"></figure>
  </div>
</section>

<section class="story">
  <div class="wrap">
    <div class="split">
      <figure class="photo reveal"><img src="img/lounge.jpg" alt="De lounge met fluwelen zetels" loading="lazy" style="object-position:55% 60%"></figure>
      <div>
        <h2>Iedereen welkom</h2>
        <p>Pain du Mie staat voor lekker eten, goeie koffie, gezelligheid en vooral: iedereen welkom. Met of zonder reservatie.</p>
        <p>En onze belegde broodjes maken we elke dag klaar. Om mee te nemen, of om hier rustig op te eten.</p>
      </div>
    </div>

    <div class="split flip">
      <figure class="photo reveal"><img src="img/counter.jpg" alt="De toonbank van Pain du Mie" loading="lazy" style="object-position:50% 62%"></figure>
      <div>
        <h2>Waarom Pain du Mie?</h2>
        <p class="lede" style="margin-bottom:18px">Een naam met een knipoog.</p>
        <p>Pain de mie is Frans voor zacht brood, maar bij ons kreeg het n&eacute;t een andere draai. De &ldquo;Mie&rdquo; verwijst natuurlijk naar Mieke. <svg class="heart" aria-hidden="true" style="color:var(--brick)"><use href="#i-heart"/></svg></p>
        <p>Een naam die begon bij de bakkerij, maar ondertussen voor zoveel meer staat: brood en lekkers om mee te nemen, gezellig ontbijten of lunchen, koffie drinken en vooral&hellip; graag wat langer blijven hangen.</p>
        <p>Pain du Mie is intussen niet alleen een naam. Het is helemaal ons. <svg class="heart" aria-hidden="true" style="color:var(--brick)"><use href="#i-heart"/></svg></p>
      </div>
    </div>

    <div class="split">
      <figure class="photo reveal"><img src="img/mieke-steve.jpg" alt="Mieke en Steve van Pain du Mie" loading="lazy" style="object-position:50% 26%"></figure>
      <div>
        <h2>En dan is er Steve</h2>
        <p>Mijn echtgenoot, mijn rechterhand, baas van de keuken en degene die meestal n&eacute;t iets rustiger blijft wanneer ik alweer tien dingen tegelijk wil doen.</p>
        <p>En ikzelf? Ik zorg dat alles in de zaal en de bakkerij vlotjes verloopt.</p>
        <p>Samen maken we van Pain du Mie niet alleen m&iacute;jn droom, maar echt <em>&oacute;nze</em> zaak.</p>
        <div class="btn-row" style="margin-top:24px">
          <a class="btn btn-brick" href="kaart.html">Ontdek onze kaart</a>
          <a class="btn btn-line" href="reserveren.html">Reserveer je tafel</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="quote wall" style="border-radius:36px;margin-bottom:clamp(60px,8vw,110px)">
  <div class="wrap">
    <p>Wij zorgen voor het lekkers, jullie voor de gezelligheid.</p>
    <span class="script">Tot snel bij Pain du Mie <svg class="heart" aria-hidden="true" style="color:var(--wheat);width:.7em;height:.7em"><use href="#i-heart"/></svg></span>
  </div>
</section>
</main>
""" + footer(p)

def reserveren():
    p = "reserveren.html"
    return head("Reserveer een tafel · Pain du Mie Bazel","Reserveer je tafel bij Pain du Mie in Bazel. Kies je dag, je uur en met hoeveel je komt.",p) + header(p) + """
<main id="main">
<section class="res res-page wall" id="reserveren" style="border-radius:0 0 36px 36px">
  <div class="wrap">
    <div class="res-head anim-in">
      <h1>Reserveer je tafel</h1>
      <p>Kies je dag en je uur, laat ons weten met hoeveel je komt, en wij zetten een tafel klaar.</p>
      <p class="res-soon" id="resSoon" hidden>Reserveren kan vanaf <b>{OPEN_DATE}</b>. Daarv&oacute;&oacute;r ben je uiteraard ook welkom, gewoon binnenspringen mag altijd.</p>
    </div>

    <div class="booker" id="booker">
      <aside class="ticket" aria-live="polite">
        <img src="img/logo.webp" alt="" width="640" height="560">
        <dl>
          <div><dt>Dag</dt><dd id="tDate" class="empty">Kies een dag</dd></div>
          <div><dt>Uur</dt><dd id="tTime" class="empty">—</dd></div>
          <div><dt>Personen</dt><dd id="tPeople">2 personen</dd></div>
          <div><dt>Plaats</dt><dd id="tZone">Maakt niet uit</dd></div>
        </dl>
        <p class="t-foot">We hebben 26 plaatsen aan tafel en 8 in de lounge. Met een grotere groep? Bel of app gerust naar <a href="tel:+32498482256">0498 48 22 56</a>, dan zoeken we samen een plekje.</p>
      </aside>

      <div class="flow">
        <ol class="steps" id="steps" aria-label="Stappen">
          <li class="cur"><span>Dag</span></li><li><span>Uur</span></li><li><span>Gezelschap</span></li><li><span>Gegevens</span></li>
        </ol>

        <div class="pane on" data-pane="0">
          <h3>Wanneer wil jij komen genieten?</h3>
          <div class="cal-head">
            <strong id="calMonth" aria-live="polite"></strong>
            <div class="cal-nav">
              <button type="button" class="icon-btn" id="calPrev" aria-label="Vorige maand"><svg><use href="#i-left"/></svg></button>
              <button type="button" class="icon-btn" id="calNext" aria-label="Volgende maand"><svg><use href="#i-right"/></svg></button>
            </div>
          </div>
          <div class="cal" id="cal"></div>
          <p class="cal-legend">Op maandag en dinsdag zijn we gesloten. Doorstreepte dagen kunnen niet.</p>
        </div>

        <div class="pane" data-pane="1">
          <h3>En hoe laat?</h3>
          <div id="slotWrap"></div>
        </div>

        <div class="pane" data-pane="2">
          <h3>Met hoeveel zijn jullie?</h3>
          <span class="field-label" id="lblPeople">Aantal personen</span>
          <div class="stepper" role="group" aria-labelledby="lblPeople">
            <button type="button" class="icon-btn" id="pMinus" aria-label="Eén persoon minder"><svg><use href="#i-minus"/></svg></button>
            <output id="pOut" aria-live="polite">2</output>
            <button type="button" class="icon-btn" id="pPlus" aria-label="Eén persoon meer"><svg><use href="#i-plus"/></svg></button>
            <span class="hint" id="pHint" hidden>Met meer? Bel of app naar <a class="text-link" href="tel:+32498482256">0498 48 22 56</a>.</span>
          </div>
          <span class="field-label">Waar zit je het liefst?</span>
          <div class="zones">
            <button type="button" class="zone" data-zone="Tearoom" aria-pressed="false"><img src="img/zaal-tafels.jpg" alt=""><span>Tearoom<small>Aan tafel, voor ontbijt en lunch</small><small class="z-warn"></small></span></button>
            <button type="button" class="zone" data-zone="Lounge" aria-pressed="false"><img src="img/chairs.jpg" alt=""><span>Lounge<small>In de zetels, enkel iets drinken</small><small class="z-warn"></small></span></button>
            <button type="button" class="zone" data-zone="Maakt niet uit" aria-pressed="true"><div class="z-any">Verras me</div><span>Maakt niet uit<small>Wij kiezen de beste plek</small><small class="z-warn"></small></span></button>
          </div>
          <p class="zone-note" id="loungeNote" hidden>In de lounge kan je enkel iets drinken. Kom je eten, kies dan de tearoom.</p>
          <span class="field-label">Waarvoor kom je? (mag je ook openlaten)</span>
          <div class="occ" id="occ">
            <button type="button" class="chip" aria-pressed="false">Ontbijt</button>
            <button type="button" class="chip" aria-pressed="false">Lunch</button>
            <button type="button" class="chip" aria-pressed="false">Iets zoets</button>
          </div>
        </div>

        <div class="pane" data-pane="3">
          <h3>Op wiens naam zetten we het?</h3>
          <div class="form-grid" id="form">
            <div class="fld full"><input id="fName" placeholder=" " autocomplete="name" required><label for="fName">Naam</label><div class="err">Vul je naam in.</div></div>
            <div class="fld"><input id="fPhone" type="tel" inputmode="tel" placeholder=" " autocomplete="tel" required><label for="fPhone">Telefoon</label><div class="err">Vul een geldig telefoonnummer in.</div></div>
            <div class="fld"><input id="fMail" type="email" inputmode="email" placeholder=" " autocomplete="email" required><label for="fMail">E-mail</label><div class="err">Vul een geldig e-mailadres in.</div></div>
            <div class="fld full"><textarea id="fNote" placeholder=" "></textarea><label for="fNote">Opmerking, bv. kinderstoel of allergie (optioneel)</label></div>
            <input class="hp" id="fHp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label class="check full"><input type="checkbox" id="fOk"> <span>Ik ga akkoord met de <a href="algemene-voorwaarden.html#reservaties" target="_blank">voorwaarden</a> en het <a href="privacy.html" target="_blank">privacybeleid</a>.</span></label>
            <div class="form-error full" id="okErr">Vink het vakje aan om je reservatie te versturen.</div>
          </div>
        </div>

        <div class="pane done-pane" data-pane="4">
          <svg class="check-anim" viewBox="0 0 88 88" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="44" cy="44" r="40"/><path d="M28 45l11 11 21-23"/></svg>
          <h3 id="doneTitle">Aanvraag verstuurd</h3>
          <p id="doneText"></p>
          <div class="btn-row">
            <button type="button" class="btn btn-brick" id="icsBtn"><svg aria-hidden="true"><use href="#i-cal"/></svg>Zet in je agenda</button>
            <button type="button" class="btn btn-line" id="againBtn">Nieuwe reservatie</button>
          </div>
        </div>

        <div class="form-error" id="resErr" role="alert"></div>
        <div class="flow-foot" id="flowFoot">
          <button type="button" class="link-back" id="backBtn" hidden>Vorige</button>
          <button type="button" class="btn btn-brick" id="nextBtn">Kies een dag</button>
        </div>
      </div>
    </div>

    <div class="res-info">
      <div><h3>Even geduld</h3><p>Je aanvraag komt meteen bij ons toe. We laten zo snel mogelijk weten of het lukt, per mail of telefoon.</p></div>
      <div><h3>Toch iets veranderd?</h3><p>Laat het ons gerust weten via <a href="tel:+32498482256">0498 48 22 56</a> of <a href="mailto:paindumie.bazel@gmail.com">e-mail</a>. Geen probleem.</p></div>
      <div><h3>Liever gewoon binnenspringen?</h3><p>Ook goed. Is er plaats, dan zetten we je met plezier aan een tafel.</p></div>
    </div>
  </div>
</section>
</main>
""" + footer(p, ("reserve.js",))


def contact():
    p = "contact.html"
    return head("Contact · Pain du Mie Bazel","Contacteer Pain du Mie, Kruibekestraat 58 in Bazel. Telefoon 0498 48 22 56, e-mail paindumie.bazel@gmail.com.",p) + header(p) + """
<main id="main">
<section class="phero">
  <div class="wrap anim-in">
    <p class="crumb"><a href="index.html">Home</a> / Contact</p>
    <h1>Contact<span class="script">we horen graag van je</span></h1>
    <p class="lede">Een vraag over een taart, een feestje of je reservatie? Bel ons, mail ons of stuur hieronder een bericht.</p>
  </div>
</section>
<section>
  <div class="wrap contact-grid">
    <div class="info-stack">
      <div class="contact-list" style="margin:0">
        <div><svg aria-hidden="true"><use href="#i-pin"/></svg><span>Pain du Mie<br>Kruibekestraat 58, 9150 Bazel</span></div>
        <div><svg aria-hidden="true"><use href="#i-phone"/></svg><a href="tel:+32498482256">0498 48 22 56</a></div>
        <div><svg aria-hidden="true"><use href="#i-mail"/></svg><a href="mailto:paindumie.bazel@gmail.com">paindumie.bazel@gmail.com</a></div>
      </div>
      <div class="socials-row">
        <a class="soc" data-link="facebook" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-fb"/></svg>Facebook</a>
        <a class="soc" data-link="instagram" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-ig"/></svg>Instagram</a>
        <a class="soc" data-link="google" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-g"/></svg>Google</a>
      </div>
      <aside class="hours" aria-labelledby="h-hours">
        <h3 id="h-hours">Openingsuren</h3>
        <div class="today"><span class="status-dot" data-status-dot></span><span data-status-text></span></div>
        <dl data-hours></dl>
      </aside>
    </div>
    <div class="form-card">
      <form id="contactForm" novalidate>
        <h2>Stuur ons een bericht</h2>
        <p>We antwoorden meestal binnen één werkdag. Voor een tafel gebruik je best de <a class="text-link" href="reserveren.html">reservatiepagina</a>.</p>
        <div class="form-grid">
          <div class="fld full"><select id="cTopic"><option>Algemene vraag</option><option>Bestelling taart of gebak</option><option>Groep of feestje</option><option>Vraag over mijn reservatie</option><option>Andere</option></select><label for="cTopic">Onderwerp</label></div>
          <div class="fld"><input id="cName" placeholder=" " autocomplete="name" required><label for="cName">Naam</label><div class="err">Vul je naam in.</div></div>
          <div class="fld"><input id="cPhone" type="tel" placeholder=" " autocomplete="tel"><label for="cPhone">Telefoon (optioneel)</label></div>
          <div class="fld full"><input id="cMail" type="email" placeholder=" " autocomplete="email" required><label for="cMail">E-mail</label><div class="err">Vul een geldig e-mailadres in.</div></div>
          <div class="fld full"><textarea id="cMsg" placeholder=" " required></textarea><label for="cMsg">Je bericht</label><div class="err">Schrijf een kort bericht.</div></div>
          <input class="hp" id="cHp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <label class="check full"><input type="checkbox" id="cOk"> <span>Ik ga akkoord met het <a href="privacy.html" target="_blank">privacybeleid</a>.</span></label>
          <div class="form-error full" id="cOkErr">Vink het vakje aan om je bericht te versturen.</div>
        </div>
        <button class="btn btn-brick" type="submit">Verstuur bericht</button>
        <div class="form-error" id="cErr" role="alert"></div>
      </form>
      <div class="form-sent" id="formSent" role="status">
        <svg class="check-anim" viewBox="0 0 88 88" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin:0 auto"><circle cx="44" cy="44" r="40"/><path d="M28 45l11 11 21-23"/></svg>
        <h3 tabindex="-1">Bericht verstuurd</h3>
        <p>Bedankt! We laten zo snel mogelijk iets weten.</p>
      </div>
    </div>
  </div>
</section>
""" + """
<section class="visit" style="padding-top:0"><div class="wrap">
  <div class="map" data-map style="min-height:420px"><div class="map-consent"><div><strong>Kruibekestraat 58, Bazel</strong><p>De kaart wordt geladen via Google Maps. Daarbij kan Google cookies plaatsen.</p><button class="btn btn-brick" type="button"><svg aria-hidden="true"><use href="#i-pin"/></svg>Toon de kaart</button></div></div></div>
  <div class="btn-row" style="margin-top:16px"><a class="btn btn-brick" data-link="google" href="#" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-pin"/></svg>Route plannen</a></div>
</div></section>
</main>
""" + footer(p)
