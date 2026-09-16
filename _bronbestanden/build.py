# -*- coding: utf-8 -*-
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import *
from pages import home, over, reserveren, contact
from kaart import kaart

OUT = os.path.join(os.path.dirname(__file__), "..")

COMPANY = """<div class="card"><p><strong>Pain du Mie BV</strong><br>Kruibekestraat 58, 9150 Bazel (Kruibeke), België<br>Ondernemingsnummer en btw: BE 1010.363.975<br>E-mail: <a href="mailto:paindumie.bazel@gmail.com">paindumie.bazel@gmail.com</a><br>Telefoon: <a href="tel:+32498482256">0498 48 22 56</a></p></div>"""

def legal(page, title, intro, sections):
    toc = "".join(f'<li><a href="#{i}">{t}</a></li>' for i,t,_ in sections)
    body = "".join(f'<h2 id="{i}">{t}</h2>{c}' for i,t,c in sections)
    return head(f"{title} · Pain du Mie", intro, page) + header(page) + f"""
<main id="main" class="legal">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Home</a> / {title}</p>
    <h1>{title}</h1>
    <p class="meta">Laatst bijgewerkt: september 2026</p>
    <div class="legal-grid">
      <nav class="toc" aria-label="Inhoud"><strong>Inhoud</strong><ol>{toc}</ol></nav>
      <article class="prose">{body}</article>
    </div>
  </div>
</main>
""" + footer(page)

AV = [
("identiteit","Wie zijn wij", f"<p>Deze website en de zaak Pain du Mie worden uitgebaat door:</p>{COMPANY}"),
("toepassing","Toepassing", """<p>Deze algemene voorwaarden gelden voor elk bezoek aan Pain du Mie, voor reservaties via de website, telefoon of e-mail, en voor aankopen in onze bakkerij en tearoom. Door een reservatie te maken of een bestelling te plaatsen, aanvaard je deze voorwaarden.</p>
<p>Afwijkende afspraken gelden alleen als we ze schriftelijk (bijvoorbeeld per e-mail) bevestigd hebben.</p>"""),
("reservaties","Reservaties", """<ul>
<li>Een reservatie via de website is een <strong>aanvraag</strong>. Je ontvangt meteen een ontvangstmail. De reservatie is pas definitief nadat wij ze per e-mail of telefoon bevestigd hebben.</li>
<li>Via de website kan je reserveren voor maximaal 8 personen. Voor grotere groepen neem je telefonisch contact met ons op.</li>
<li>Kan je niet komen of kom je met minder personen? Laat het ons zo snel mogelijk weten, bij voorkeur minstens 24 uur op voorhand, via 0498 48 22 56 of paindumie.bazel@gmail.com.</li>
<li>Ben je meer dan 15 minuten te laat zonder bericht, dan mogen we de tafel opnieuw vrijgeven.</li>
<li>Een voorkeur voor tearoom of lounge proberen we altijd te respecteren, maar kunnen we niet garanderen.</li>
<li>Bij herhaaldelijk niet komopdagen zonder verwittiging kunnen we toekomstige reservaties weigeren.</li>
</ul>"""),
("prijzen","Prijzen en betaling", """<p>Alle prijzen op de kaart en op de website zijn uitgedrukt in euro en inclusief btw. We doen ons best om de prijzen op de website actueel te houden. Bij verschil geldt de prijs die in de zaak vermeld wordt. Kennelijke druk- of zetfouten binden ons niet.</p>
<p>Betalen gebeurt ter plaatse, met de betaalmiddelen die in de zaak aanvaard worden.</p>"""),
("bestellingen","Bestellingen in de bakkerij", """<p>Voor taarten, gebak of grotere bestellingen maken we per bestelling afspraken over prijs, afhaalmoment en eventueel voorschot. Zulke bestellingen zijn pas definitief na onze bevestiging.</p>"""),
("allergenen","Allergenen", """<p>Heb je een allergie of voedselintolerantie? Meld het bij je reservatie of bij het bestellen. We geven je graag informatie over de allergenen in onze producten. Omdat we in onze keuken en bakkerij met veel ingrediënten werken, kunnen we sporen van allergenen nooit volledig uitsluiten.</p>"""),
("alcohol","Alcohol", """<p>Volgens de Belgische wet schenken en verkopen we geen alcoholische dranken aan jongeren onder 16 jaar, en geen sterke drank aan jongeren onder 18 jaar. We kunnen daarbij om een identiteitsbewijs vragen.</p>"""),
("huisregels","Huisregels", """<p>We willen dat iedereen zich welkom voelt. We vragen je respect te tonen voor andere gasten, ons team en het interieur. Bij storend gedrag kunnen we de toegang weigeren. Schade die opzettelijk of door nalatigheid wordt aangericht, kan worden aangerekend.</p>"""),
("aansprakelijkheid","Aansprakelijkheid", """<p>We zijn niet aansprakelijk voor verlies, diefstal of beschadiging van persoonlijke bezittingen in de zaak, behalve bij opzet of zware fout van onze kant.</p>
<p>De informatie op deze website (zoals openingsuren, kaart en prijzen) wordt met zorg samengesteld, maar kan onvolledig of tijdelijk verouderd zijn. Daar kunnen geen rechten aan ontleend worden.</p>"""),
("intellectuele-eigendom","Intellectuele eigendom", """<p>Teksten, foto's, logo's en het ontwerp van deze website zijn eigendom van Pain du Mie BV of van de respectieve rechthebbenden. Je mag ze niet zonder toestemming overnemen of gebruiken. De website werd ontworpen en gebouwd door <a href="https://marleo.tech" target="_blank" rel="noopener">Marleo</a>.</p>"""),
("klachten","Klachten", """<p>Niet tevreden? Zeg het ons liefst meteen ter plaatse, dan kunnen we het direct oplossen. Achteraf kan je ons contacteren via paindumie.bazel@gmail.com. We antwoorden zo snel mogelijk.</p>"""),
("recht","Toepasselijk recht", """<p>Op deze voorwaarden is het Belgisch recht van toepassing. Bij een geschil zoeken we eerst samen een oplossing. Lukt dat niet, dan zijn de bevoegde rechtbanken van het gerechtelijk arrondissement Oost-Vlaanderen bevoegd, onverminderd de rechten die je als consument hebt.</p>"""),
]

PR = [
("wie","Wie verwerkt je gegevens", f"<p>Pain du Mie BV is verantwoordelijk voor de verwerking van je persoonsgegevens via deze website.</p>{COMPANY}<p>We verwerken je gegevens volgens de Algemene Verordening Gegevensbescherming (AVG/GDPR) en de Belgische privacywetgeving.</p>"),
("welke","Welke gegevens we verzamelen", """<div class="table-scroll"><table>
<tr><th>Wanneer</th><th>Welke gegevens</th></tr>
<tr><td>Reservatie</td><td>Naam, telefoonnummer, e-mailadres, datum, uur, aantal personen, voorkeursplaats, gelegenheid en je opmerking (bijvoorbeeld een allergie als je die zelf vermeldt).</td></tr>
<tr><td>Contactformulier</td><td>Naam, e-mailadres, optioneel telefoonnummer, onderwerp en je bericht.</td></tr>
<tr><td>E-mail of telefoon</td><td>De gegevens die je ons zelf bezorgt.</td></tr>
<tr><td>Websitebezoek</td><td>Technische gegevens zoals IP-adres en browsertype, die de hostingprovider tijdelijk bijhoudt om de website veilig te laten werken.</td></tr>
</table></div>
<p>Je hoeft geen gegevens te geven om de website te bekijken. Zonder naam en contactgegevens kunnen we een reservatie of vraag wel niet behandelen.</p>"""),
("waarom","Waarom en op welke basis", """<ul>
<li><strong>Je reservatie of vraag behandelen</strong> en je contacteren om te bevestigen of iets te wijzigen. Rechtsgrond: het uitvoeren van een (pre)contractuele relatie.</li>
<li><strong>Allergie- of dieetinformatie</strong> die je zelf in een opmerking vermeldt, gebruiken we enkel om je bezoek goed voor te bereiden. Rechtsgrond: je uitdrukkelijke toestemming, door die informatie zelf te delen.</li>
<li><strong>De website veilig en werkend houden.</strong> Rechtsgrond: ons gerechtvaardigd belang.</li>
<li><strong>Wettelijke verplichtingen</strong>, bijvoorbeeld boekhouding. Rechtsgrond: wettelijke verplichting.</li>
</ul>
<p>We gebruiken je gegevens niet voor reclame, verkopen ze niet en maken geen profielen.</p>"""),
("bewaren","Hoe lang we ze bewaren", """<ul>
<li>Reservatiegegevens: tot maximaal 12 maanden na de datum van je reservatie.</li>
<li>Berichten via het contactformulier of e-mail: zolang nodig om je vraag te behandelen, en maximaal 2 jaar.</li>
<li>Gegevens die we wettelijk moeten bewaren: zolang de wet dat vereist.</li>
</ul>"""),
("delen","Met wie we ze delen", """<p>We delen je gegevens alleen met dienstverleners die we nodig hebben om de website en reservaties te laten werken:</p>
<ul>
<li><strong>Netlify</strong> (netlify.com): host onze website en ontvangt de ingevulde reservatie- en contactformulieren, die daarna naar ons e-mailadres worden doorgestuurd.</li>
<li><strong>FormSubmit</strong> (formsubmit.co): reserveleverancier die een formulier naar ons e-mailadres doorstuurt als de eerste verzending mislukt.</li>
<li><strong>Google</strong>: onze mailbox (Gmail) waarin reservaties en berichten toekomen, en Google Maps als je de kaart op de website zelf opent.</li>
<li><strong>Onze hostingprovider</strong>, die de website technisch beschikbaar maakt.</li>
<li><strong>Marleo</strong> (marleo.tech), die de website bouwt en onderhoudt, enkel als dat voor technisch onderhoud nodig is.</li>
</ul>
<p>Sommige van deze diensten kunnen gegevens verwerken buiten de Europese Economische Ruimte. In dat geval gebeurt dat met passende waarborgen, zoals de standaardcontractbepalingen van de Europese Commissie of het EU-VS-gegevensprivacykader.</p>
<p>Links naar Facebook, Instagram en Google openen de websites van die partijen. Daar geldt hun eigen privacybeleid.</p>"""),
("cookies","Cookies", """<p>Deze website plaatst zelf <strong>geen</strong> tracking-, advertentie- of analysecookies. De lettertypes worden vanaf onze eigen server geladen, dus er gaat geen verbinding naar Google Fonts.</p>
<p>De kaart van Google Maps wordt pas geladen als je op <em>Toon de kaart</em> klikt. Vanaf dat moment kan Google cookies plaatsen en gegevens verwerken volgens het <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">privacybeleid van Google</a>.</p>"""),
("rechten","Jouw rechten", """<p>Je hebt het recht om:</p>
<ul>
<li>je gegevens in te kijken en een kopie te vragen;</li>
<li>foute gegevens te laten verbeteren;</li>
<li>je gegevens te laten wissen;</li>
<li>de verwerking te laten beperken of er bezwaar tegen te maken;</li>
<li>je gegevens over te dragen;</li>
<li>een gegeven toestemming op elk moment in te trekken.</li>
</ul>
<p>Stuur je vraag naar <a href="mailto:paindumie.bazel@gmail.com">paindumie.bazel@gmail.com</a>. We antwoorden binnen één maand. Om misbruik te vermijden kunnen we je vragen om je identiteit te bevestigen.</p>"""),
("klacht","Klacht indienen", """<p>Ben je niet tevreden over hoe we met je gegevens omgaan? Laat het ons eerst weten, dan zoeken we samen een oplossing. Je kan ook een klacht indienen bij de Gegevensbeschermingsautoriteit:</p>
<div class="card"><p>Gegevensbeschermingsautoriteit<br>Drukpersstraat 35, 1000 Brussel<br><a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener">www.gegevensbeschermingsautoriteit.be</a><br>contact@apd-gba.be</p></div>"""),
("beveiliging","Beveiliging", """<p>De website gebruikt een beveiligde verbinding (https). We nemen redelijke technische en organisatorische maatregelen om je gegevens te beschermen tegen verlies, misbruik en ongeoorloofde toegang.</p>"""),
("minderjarigen","Minderjarigen", """<p>Ben je jonger dan 16 jaar? Vraag dan een ouder of voogd om de reservatie voor je te maken.</p>"""),
("wijzigingen","Wijzigingen", """<p>We kunnen dit privacybeleid aanpassen, bijvoorbeeld als we nieuwe diensten gebruiken. De meest recente versie staat altijd op deze pagina.</p>"""),
]

NOTFOUND = head("Pagina niet gevonden · Pain du Mie","Deze pagina bestaat niet (meer). Ga terug naar de homepagina van Pain du Mie.","404.html",'<meta name="robots" content="noindex">\n') + header("404.html") + """
<main id="main" class="legal" style="min-height:52vh">
  <div class="narrow" style="text-align:center">
    <p class="script" style="font-size:clamp(4rem,12vw,7rem);color:var(--brick);line-height:1">Oeps</p>
    <h1 style="font-size:clamp(2.2rem,5vw,3.4rem)">Deze pagina staat niet op de kaart</h1>
    <p class="lede" style="margin:18px auto 30px">Het adres bestaat niet of is verhuisd. Onze koffie staat nog wel klaar.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn-brick" href="index.html">Naar de homepagina</a>
      <a class="btn btn-line" href="kaart.html">Bekijk de kaart</a>
      <a class="btn btn-line" href="reserveren.html">Reserveer een tafel</a>
    </div>
  </div>
</main>
""" + footer("404.html")

# openingsdatum van de reservaties uit config.js halen, zodat ze ook zonder javascript in de tekst staat
def open_date():
    import re as _re
    cfg = open(os.path.join(OUT,"assets/js/config.js"), encoding="utf-8").read()
    m = _re.search(r'opensOn:\s*"(\d{4})-(\d{2})-(\d{2})"', cfg)
    if not m: return ""
    from datetime import date
    d = date(*map(int, m.groups()))
    dagen = ["Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag","Zondag"]
    maanden = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"]
    return f"{dagen[d.weekday()]} {d.day} {maanden[d.month-1]}"

PAGES = {
  "404.html": NOTFOUND,
  "index.html": home(),
  "kaart.html": kaart(),
  "over-ons.html": over(),
  "reserveren.html": reserveren(),
  "contact.html": contact(),
  "algemene-voorwaarden.html": legal("algemene-voorwaarden.html","Algemene voorwaarden","Algemene voorwaarden van Pain du Mie BV, bakkerij en tearoom in Bazel, onder meer voor reservaties.",AV),
  "privacy.html": legal("privacy.html","Privacybeleid","Hoe Pain du Mie BV omgaat met je persoonsgegevens bij reservaties, contact en websitebezoek.",PR),
}
OD = open_date()
for name, html in PAGES.items():
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(html.replace("{OPEN_DATE}", OD))
    print("ok", name, len(html)//1024, "KB")


