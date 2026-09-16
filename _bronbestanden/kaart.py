# -*- coding: utf-8 -*-
from common import *

def item(name, p, desc="", extra=""):
    s = f"{name} {desc} {extra}".replace('"','').replace("<em>","").replace("</em>","")
    d = f'<span class="d">{desc}</span>' if desc else ""
    return f'<li class="item" data-s="{s}"><span class="n">{name}</span><span class="l" aria-hidden="true"></span><span class="p">€ {p}</span>{d}</li>'

def plain(rows):
    """Lijst zonder prijs, voor wat nog ingevuld moet worden."""
    li = "".join(f'<li class="item noprice" data-s="{n} {d}"><span class="n">{n}</span>{f"<span class=\'d\'>{d}</span>" if d else ""}</li>' for n,d in rows)
    return f'<ul class="items">{li}</ul>'

def items(rows):
    return '<ul class="items">' + "".join(item(*r) for r in rows) + '</ul>'

def group(title, rows, sub="", extra=""):
    t = f'<h3>{title}</h3>' if title else ''
    s = f'<p class="sub">{sub}</p>' if sub else ''
    return f'<div class="group">{t}{s}{extra}{items(rows)}</div>'

def board(inner, cls=""):
    return f'<div class="board {cls}">{inner}</div>'

CATS = [("ontbijt","Ontbijt"),("lunch","Lunch"),("broodjes","Belegde broodjes"),("specials","Specials"),("desserts","Desserts"),("warm","Warme dranken"),("fris","Frisdranken"),("happekes","Happekes"),("bier","Bier"),("wijn","Wijn & apéro")]

CUP = '<div class="cup" aria-hidden="true"><span class="steam"></span><span class="steam"></span><span class="steam"></span><svg viewBox="0 0 62 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h36v12a16 16 0 0 1-16 16h-4A16 16 0 0 1 8 18z"/><path d="M44 10h4a6 6 0 0 1 0 12h-5M4 38h48"/></svg></div>'

def kaart():
    p = "kaart.html"
    cats = "".join(f'<a href="#{i}">{t}</a>' for i,t in CATS)


    ontbijt = f"""
<div class="boards">
  <div>
  {board(group("Ontbijtjes", [
      ("Standaard ontbijt","20,50","Verzorgd ontbijt met koffie of thee en fruitsap. Inclusief een broodassortiment met mini boterkoekjes, fijne vleeswaren en kaas, verse fruitsalade en zoete lekkernijen zoals home made confituur, Nutella, honing en boter."),
      ("Supplement zalm","3,00"),
      ("Supplement spek","2,50"),
      ("Luxe ontbijt","28,50","Uitgebreid ontbijt met koffie of thee, fruitsap en een glaasje bubbels. Inclusief een broodassortiment met mini boterkoekjes, fijne vleeswaren en kaas, een eitje, skyr met passievrucht en granola, verse fruitsalade en zoete lekkernijen zoals home made confituur, Nutella, honing en boter."),
      ("Kinderontbijt","11,50","Sandwich, mini koffiekoekje, kaas of ham, choco, Fristi of chocomelk en een mini donut."),
      ("Wentelteefje met vers fruit &amp; skyr","16,50","Wentelteefjes met skyr, vers fruit en honing."),
      ("Kinderwentelteefje met suiker","8,90","Wentelteefje met suiker.")]))}
  </div>
  <div>
  {board(group("Kleine honger",[("Koffiekoek","2,00"),("Croissant","2,20"),("Cremekoek","2,50"),("Pistolet met charcuterie","2,50")]))}
  {board(group("Drankje bij het ontbijt",[("Cava","6,50"),("Mimosa","7,00")]))}
  <div class="note-card"><span class="script">Haast?</span><p>Die laten we aan de deur. Neem gerust de tijd.</p></div>
  </div>
</div>"""

    lunch = f"""
<div class="boards">
  {board(group("Lunches", [
      ("Croque Pain du Mie","14,00","Met slaatje."),
      ("Croque madame","16,00","Met slaatje."),
      ("Croque bolognaise","17,00","Met slaatje."),
      ("Croque uit het vuistje","8,50"),
      ("Verse dagsoep","8,50","Met brood."),
      ("Boerenomelet","14,90","Met brood."),
      ("Pain du Mie burger","16,50","Verse burger, echte cheddar, rode ui, spek, burgersaus, krulsla en tomaat. Met slaatje."),
      ("Spaghetti bolognaise","19,00")], "Kijk zeker eens naar ons lunchgerecht van de week!"))}
  <div>
  <div class="combo" data-s="combodeal croque smos kaas ham tas soep">
    <div><span class="badge">Combodeal</span><h3 class="n">Croque of smos kaas/ham + tas soep</h3></div>
    <span class="p">€ 14,50</span>
  </div>
  {board(group("Artisanale kroketten",[
      ("Kaaskroketten (2)","17,50","Met brood en salade."),
      ("Garnaalkroketten (2)","20,50","Met brood en salade."),
      ("Kaas- en garnaalkroketten (2)","18,50","Met brood en salade.")]))}
  <div class="note-card brick"><span class="script">Goesting?</span><p>Geen ingewikkelde toestanden. Gewoon eten waar je blij van wordt.</p></div>
  </div>
</div>"""

    broodjes = f"""
<div class="boards">
  {board(group("Klassiekers en smos", [
      ("Smos kaas","6,50"),("Smos ham","6,70"),("Smos kaas en ham","7,00"),("Smos krab","8,00"),
      ("Smos prepar&eacute;","7,00"),("Smos kip curry","7,00"),("Smos tonijn","7,50"),
      ("Martino","7,00"),("Tonijntino","7,50"),("Supplement ansjovis","1,00")], "Elke dag vers klaargemaakt. Wit of grof brood, jij kiest."))}
  <div>
  {board(group("Specialekes",[
      ("Brie, honing, noten en rucola","8,00"),
      ("Zalm, kruidenkaas en waterkers","8,00"),
      ("Prepar&eacute; of serrano deluxe","8,00")]) + '<div class="week" data-s="broodje van de week"><span class="n">Broodje van de week</span><span class="p2">Prijs op suggestie</span></div>')}
  {board(group("Vegi",[("Avocado, ei, hummus en waterkers","8,50")]))}
  </div>
</div>"""

    toppings = [("Slagroom","1,50"),("Bolletje vanille-ijs","2,50"),("Vers fruit","4,00"),("Warme krieken","4,50")]
    top_html = '<div class="chip-row group"><h3>Toppings <small>voor pannenkoeken en wafels</small></h3><div class="chips-row">' + "".join(
        f'<span class="topping" data-s="topping {n}"><span class="n">{n}</span><b>+ € {pr}</b></span>' for n,pr in toppings) + '</div></div>'

    desserts = f"""
<div class="boards">
  {board(group("Reuzepannenkoeken",[("Met suiker of confituur","6,00"),("2 stuks, met suiker of confituur","9,50")])
         + '<div style="height:26px"></div>'
         + group("Brusselse wafel",[("Brusselse wafel","7,00","Met poedersuiker."),("Brusselse wafel <em>met slagroom</em>","8,00")])
         + '<div style="height:26px"></div>' + top_html)}
  <div>
  {board(group("IJs en gebak",[
      ("Huisbereid gebak van de dag","8,00"),
      ("Warme appeltaart","11,00","Met slagroom en ijs."),
      ("Dame blanche","11,00","Vanille-ijs met warme chocoladesaus en slagroom."),
      ("Coupe Brésilienne","11,50"),
      ("Coupe advocaat","12,50"),
      ("Kinderijsje","5,50"),
      ("Verwenkoffie of verwenthee","12,90","Koffie of thee met een assortiment zoete lekkernijen.")]))}
  <div class="note-card" style="margin-top:16px"><span class="script">Elke dag anders</span><p>Ons gebak van de dag wisselt. Wat het vandaag is, staat aangegeven.</p></div>
  </div>
</div>"""

    warm = f"""
<div class="boards three">
  {board(f'<div class="group"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px"><h3>Koffie</h3>{CUP}</div><div class="ross"><img src="img/ross.jpg" alt="Ross Koffie" loading="lazy" width="54" height="54"><span>In samenwerking met Ross Koffie</span></div>' + items([("Espresso","3,20"),("Koffie","3,50"),("Cappuccino","4,30"),("Latte","4,50")]) + '</div>')}
  {board(group("Thee",[("Kannetje thee","4,00","Keuze uit onze theekaart."),("Verse muntthee","4,50"),("Verse gemberthee","4,50")]) + '<div class="note-card brick" style="margin-top:22px;padding:18px 20px"><p>Alle smaken staan op onze theekaart.</p></div>')}
  {board(group("Specials",[("Verse warme chocolademelk","4,80"),("Latte vanille","5,50"),("Latte karamel","5,50"),("Italiaanse koffie","10,50"),("Irish koffie","10,50"),("Chouffe koffie","8,50")]) + '<div class="milk" data-s="havermelk sojamelk kokosmelk plantaardige melk" style="margin:14px 0 0"><span class="n" style="font:400 .95rem var(--sans)">Havermelk, sojamelk of kokosmelk</span><b>+ € 0,80</b></div>')}
</div>"""

    flav = [("Orange","#E98A1E"),("Lemon & Raspberry","#EC7A74"),("Grapefruit & Pineapple","#F2A33A"),("Blood Orange","#A3141E")]
    ritchie_items = '<ul class="items">' + "".join(
        f'<li class="item" data-s="ritchie limonade {n}"><span class="n flav"><i style="background:{c}"></i>{n}</span><span class="l" aria-hidden="true"></span><span class="p">€ 4,30</span></li>' for n,c in flav) + '</ul>'
    fris = f"""
<div class="boards">
  {board(group("Frisdranken",[("Coca-Cola","3,30"),("Coca-Cola Zero","3,30"),("Fanta Orange","3,30"),("Sprite","3,30"),("Royal Bliss Pink","3,50"),("Ice Tea","3,50"),("Tonic","3,30")])
         + '<div style="height:26px"></div>'
         + group("Sappen en zuivel",[("Appelsiensap","3,40"),("Appelsap","3,40"),("Bru plat of bruis","3,10"),("Fristi of chocomelk","3,40"),("Red Bull","4,30")]))}
  {board(f'<div class="group"><h3>Ritchie limonades</h3><p class="sub">Limonade in vier smaken.</p><div class="ritchie" style="margin-top:14px"><div class="ritchie-img"><img src="img/ritchie.jpg" alt="Vier flesjes Ritchie limonade" loading="lazy"></div>{ritchie_items}</div></div>')}
</div>"""

    happekes = f"""
<div class="boards">
  {board(group("Plankjes en balletjes",[("Kaasplankje","10,50"),("Salamiplankje","10,50"),("Kaas- en salamiplankje","10,50"),("Artisanale kaasballetjes","9,50"),("Artisanale garnaalballetjes","11,50"),("Ambachtelijke bitterballen","8,50","Met mosterd.")]))}
  {board(group("Warm en knapperig",[("Ambachtelijke springrolls","12,50","Extra groot."),("Kibbelingen","13,00","Met verse tartaar.")]) + '<div style="height:26px"></div>' + group("Erbij",[("Zakje chips","2,00"),("Droge worst","2,50")]))}
</div>"""

    bier = f"""
<div class="boards">
  {board(group("Pils en speciaalbier",[("Jupiler of Stella","3,30"),("Duvel","4,70"),("La Chouffe Blond","4,60"),("La Chouffe Cherry","4,60"),("Orval","5,50")]))}
  {board(group("Tripels, fruit en alcoholvrij",[("Tripel Karmeliet","5,20"),("Westmalle Tripel of Dubbel","5,20"),("Liefmans Fruitesse","4,00"),("Liefmans Fruitesse 0.0","3,80","Alcoholvrij."),("Stella 0.0","3,30","Alcoholvrij.")]) + '<div class="beer-note"><svg aria-hidden="true"><use href="#i-beer"/></svg><span>En dan is er nog ons bier van de maand.</span></div>')}
</div>"""

    wijn = f"""
<div class="boards">
  {board('<div class="group"><h3>Huiswijn</h3><div class="wine-house" data-s="huiswijn wit rood rose wijn glas fles"><span class="n">Wit, rood of rosé<small>Onze huiswijn</small></span><span>Glas<b>€ 5,50</b></span><span>Fles<b>€ 24,00</b></span></div>' + items([("Glaasje cava brut","6,50"),("Witte Martini","8,00"),("Home made limoncello","7,50"),("Amaretto","8,00"),("Amaretto Toby Alderweireld","10,00"),("Poldergin met tonic","13,00")]) + '</div>')}
  <div>
  {board(group("Cocktails",[("Cocktail van de maand","13,50"),("Mocktail","10,50","Alcoholvrij.")]))}
  <div class="note-card" style="margin-top:16px"><span class="script">Apéro</span><p>Combineer met een kaas- en salamiplankje of artisanale balletjes uit onze <a href="#happekes" style="color:inherit">happekes</a>.</p></div>
  </div>
</div>"""

    def sec(id, script, title, body, intro="", cls=""):
        i = f'<p>{intro}</p>' if intro else ''
        return f'<section class="k-sec {cls}" id="{id}" aria-labelledby="h-{id}"><div class="wrap"><div class="k-title"><h2 id="h-{id}"><span class="script">{script}</span>{title}</h2>{i}</div>{body}</div></section>'

    specials = f"""
<div class="k-specials-top light">
  {qty_toggle("kSpecials", True)}
</div>
<div class="specials" id="kSpecials">
{special_cards()}
</div>
<div class="kinder" data-s="kinder rolls broodrolletjes kinder chocolade kaneelsuiker extra speciaal">
  <span class="badge">Extra speciaal</span>
  <div><h3 class="n">Kinder Rolls</h3><p>Drie krokant gebakken broodrolletjes gevuld met Kinder-chocolade, afgewerkt met kaneelsuiker.</p></div>
  <span class="p">€ 9,50</span>
</div>"""

    body = f"""
<main id="main">
<section class="k-hero">
  <div class="wrap k-hero-grid">
    <div class="anim-in">
      <p class="crumb"><a href="index.html">Home</a> / Kaart</p>
      <h1>Onze kaart</h1>
      <span class="script">Good food, good mood.</span>
      <p class="lede">Van je dagelijks brood tot een reuzepannenkoek die je best met twee deelt. Alle prijzen in euro, inclusief btw.</p>
    </div>
    <div class="k-plates" aria-hidden="true">
      <div class="plate draw">{PANCAKE_SVG}</div>
      <div class="plate draw">{CAKE_SVG}</div>
      <div class="plate draw">{CUP_SVG}</div>
      <div class="stick"><span><b>Reuzegroot</b> <i>en onweerstaanbaar</i></span></div>
    </div>
  </div>
</section>

<div class="k-bar">
  <div class="wrap">
    <nav class="k-cats" aria-label="Categorieën">{cats}</nav>
    <div class="k-search">
      <svg aria-hidden="true"><use href="#i-search"/></svg>
      <label class="sr" for="kSearch">Zoek op de kaart</label>
      <input id="kSearch" type="search" placeholder="Zoek, bv. latte of wafel" autocomplete="off">
      <button type="button" aria-label="Zoekopdracht wissen"><svg><use href="#i-x"/></svg></button>
    </div>
  </div>
</div>

{sec("ontbijt","Een goeie dag begint aan tafel.","Ontbijt",ontbijt)}
{sec("lunch","Goesting in iets lekkers?","Lunch",lunch)}
{sec("broodjes","Vers belegd. Goed gevuld.","Belegde broodjes",broodjes,"En vooral: gemaakt om goesting van te krijgen. Onze belegde broodjes maken we vers voor je klaar elke dag. Ga voor een goeie klassieker, een smos of &eacute;&eacute;n van onze speciallekes. Kiezen wordt waarschijnlijk het moeilijkste deel.")}
{sec("specials","Groot van formaat. Gevaarlijk lekker.","Reuzepannenkoeken",specials)}
{sec("desserts","Bewaar altijd een plaatsje voor zoet.","Desserts",desserts)}
{sec("warm","Geen honger? Ook welkom.","Warme dranken",warm,"Niet elke koffie heeft een ontbijt nodig. Kom gerust binnen voor gewoon een koffie en een babbel.<span class='nibble'>Bij elk drankje serveren we een klein knabbeltje. <svg class='heart' aria-hidden='true'><use href='#i-heart'/></svg></span>")}
{sec("fris","Lekker fris.","Frisdranken",fris)}
{sec("happekes","Om te delen.","Happekes",happekes,"Bij een glaasje, of gewoon omdat het kan.")}
{sec("bier","Proost!","Bier",bier)}
{sec("wijn","Op je gezondheid.","Wijn & apéro",wijn)}

<div class="k-empty wrap" id="kEmpty" role="status">
  <strong>Niets gevonden voor “<span id="kEmptyQ"></span>”</strong>
  <p>Probeer <button type="button" data-suggest="wafel">wafel</button>, <button type="button" data-suggest="latte">latte</button> of <button type="button" data-suggest="tripel">tripel</button>.</p>
</div>

<div class="wrap">
  <div class="allergy"><svg aria-hidden="true"><use href="#i-info"/></svg><p>Allergie of intolerantie? Vraag ons gerust welke allergenen in een gerecht zitten. Prijzen in euro, inclusief btw. Wijzigingen en zetfouten voorbehouden. We schenken geen alcohol aan jongeren onder 16 jaar, en geen sterke drank onder 18 jaar.</p></div>
</div>

<section class="band" style="margin-top:clamp(50px,6vw,80px)" aria-labelledby="h-band">
  <div><h2 id="h-band">Al honger?</h2><p>Reserveer je tafel en we zetten de koffie alvast klaar.</p></div>
  <a class="btn btn-ghost" href="reserveren.html"><svg aria-hidden="true"><use href="#i-cal"/></svg>Reserveer een tafel</a>
</section>
</main>
"""
    return head("Kaart · Pain du Mie Bazel","De volledige kaart van Pain du Mie in Bazel: reuzepannenkoeken, wafels, desserts, koffie van Ross, frisdranken, happekes, bier, wijn en apéro, met prijzen.",p) + header(p) + body + footer(p, ("kaart.js",))
