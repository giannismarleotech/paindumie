# -*- coding: utf-8 -*-
"""Gedeelde onderdelen voor alle pagina's (header, footer, iconen)."""

NAV = [("index.html","Home"),("kaart.html","Kaart"),("over-ons.html","Over ons"),("reserveren.html","Reserveren"),("contact.html","Contact")]

ICONS = """<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20.3s-7.6-4.6-7.6-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.6 2.7c0 5.6-7.6 10.2-7.6 10.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
<symbol id="i-cal" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></g></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-6.3-7-11.5a7 7 0 0 1 14 0C19 14.7 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></g></symbol>
<symbol id="i-left" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-right" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M5 12h14M12 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></g></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.2"/></g></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9L3.4 9.5l6-.8z" fill="currentColor"/></symbol>
<symbol id="i-fb" viewBox="0 0 24 24"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H7.6v3h2.6V21z" fill="currentColor"/></symbol>
<symbol id="i-ig" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></g></symbol>
<symbol id="i-g" viewBox="0 0 24 24"><path d="M20.6 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" fill="currentColor"/><path d="M12 21c2.4 0 4.5-.8 5.9-2.2L15 16.5c-.8.5-1.8.9-3 .9a5.3 5.3 0 0 1-5-3.6H4v2.3A9 9 0 0 0 12 21zM7 13.8a5.4 5.4 0 0 1 0-3.5V8H4a9 9 0 0 0 0 8.1z" fill="currentColor" opacity=".75"/><path d="M12 6.6c1.3 0 2.5.5 3.4 1.3L18 5.4A9 9 0 0 0 4 8l3 2.3a5.3 5.3 0 0 1 5-3.7z" fill="currentColor" opacity=".55"/></symbol>
<symbol id="i-cup" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5c0 1.5 1.5 1.5 1.5 3M12 3.5c0 1.5 1.5 1.5 1.5 3"/></g></symbol>
<symbol id="i-sofa" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 12a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM6 17v2M18 17v2"/></g></symbol>
<symbol id="i-wheat" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M12 21V9"/><path d="M12 9c-2.5-.5-3.5-2.5-3.5-5 2.5.5 3.5 2.5 3.5 5zM12 9c2.5-.5 3.5-2.5 3.5-5-2.5.5-3.5 2.5-3.5 5zM12 14c-2.5-.5-3.5-2.5-3.5-5 2.5.5 3.5 2.5 3.5 5zM12 14c2.5-.5 3.5-2.5 3.5-5-2.5.5-3.5 2.5-3.5 5z"/></g></symbol>
<symbol id="i-kid" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="7" r="3"/><path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/></g></symbol>
<symbol id="i-beer" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M5 7h11v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M16 10h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M5 7a3 3 0 0 1 3-3 3 3 0 0 1 5 0 3 3 0 0 1 3 3M9 11v6M12 11v6"/></g></symbol>
</svg>"""


# ---------- getekende lekkernijen (scherp op elk scherm) ----------
SYRUP_PATH = "M100 8c46 0 84 21 84 47 0 15-11 23-11 36 0 14 12 18 12 31 0 12-10 17-10 27 0 9 7 14 7 22 0 6-5 10-12 10-8 0-12-8-20-8s-11 9-20 9-13-10-22-10-12 11-22 11-13-12-22-12-12 10-21 10c-8 0-13-5-13-12 0-10 8-15 8-25 0-12-11-17-11-30 0-14 12-19 12-33 0-13-10-21-10-36C29 29 54 8 100 8z"

STEAM_SVG = """<svg class="%s" viewBox="0 0 120 140" aria-hidden="true">
      <path style="--sd:0s"   d="M28 132c14-16-12-28 2-44s-8-26 6-42"/>
      <path style="--sd:.7s"  d="M60 132c15-18-12-30 3-47s-8-27 7-44"/>
      <path style="--sd:1.4s" d="M92 132c14-16-12-28 2-44s-8-26 6-42"/>
    </svg>"""

def ring_svg(cls, pid, words="GOOD FOOD &#8226; GOOD MOOD &#8226; GOOD FOOD &#8226; GOOD MOOD &#8226;"):
    return (f'<svg class="{cls}" viewBox="0 0 300 300" aria-hidden="true"><defs>'
            f'<path id="{pid}" d="M150,150 m-126,0 a126,126 0 1,1 252,0 a126,126 0 1,1 -252,0"/></defs>'
            f'<text><textPath href="#{pid}" textLength="770" lengthAdjust="spacing">{words}</textPath></text></svg>')

# een punt taart met drie lagen, room en een kers
CAKE_SVG = """<svg viewBox="0 0 120 120" aria-hidden="true">
  <path d="M16 96 60 20l44 76z" fill="#C98B45"/>
  <path d="M27 77h66l6 10H21z" fill="#FBF3E4"/>
  <path d="M35 60h50l5 9H30z" fill="#9C4A2C"/>
  <path d="M44 43h32l5 9H39z" fill="#FBF3E4"/>
  <path d="M16 96h88l-6 11H22z" fill="#8E5321"/>
  <circle cx="60" cy="20" r="9" fill="#C2334A"/>
  <path d="M60 11c1-5 5-7 9-7" stroke="#5F6443" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>"""

# een kop koffie
CUP_SVG = """<svg viewBox="0 0 120 120" aria-hidden="true">
  <path d="M40 26c8-6-6-13 2-21M62 26c8-7-6-14 2-22" stroke="#B8712F" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M86 52h7a14 14 0 0 1 0 28h-7" fill="none" stroke="#8E5321" stroke-width="8" stroke-linecap="round"/>
  <path d="M20 44h66v30a26 26 0 0 1-26 26H46a26 26 0 0 1-26-26z" fill="#FBF3E4" stroke="#8E5321" stroke-width="4.5" stroke-linejoin="round"/>
  <ellipse cx="53" cy="47" rx="28" ry="7.5" fill="#8B4A16"/>
  <path d="M16 106h74" stroke="#8E5321" stroke-width="8" stroke-linecap="round"/>
</svg>"""

# een mini stapel pannenkoeken
PANCAKE_SVG = """<svg viewBox="0 0 120 120" aria-hidden="true">
  <ellipse cx="60" cy="92" rx="48" ry="16" fill="#8E5321"/>
  <ellipse cx="60" cy="86" rx="48" ry="16" fill="#C98B45"/>
  <ellipse cx="60" cy="70" rx="44" ry="15" fill="#8E5321"/>
  <ellipse cx="60" cy="65" rx="44" ry="15" fill="#D9954A"/>
  <ellipse cx="60" cy="50" rx="40" ry="14" fill="#8E5321"/>
  <ellipse cx="60" cy="45" rx="40" ry="14" fill="#E7B267"/>
  <path d="M24 43c10 8 22 11 36 11s26-3 36-11c2 7-1 12-6 13-3 7-10 4-14 8-5 4-13 1-18 4-6 3-12-2-17-5-5-3-12 0-14-6-5-2-6-8-3-14z" fill="#8B4A16"/>
  <rect x="52" y="28" width="18" height="11" rx="2" fill="#F4D380" transform="rotate(-8 61 33)"/>
</svg>"""


def head(title, desc, page, extra=""):
    return f"""<!doctype html>
<html lang="nl-BE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#231B17">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pain du Mie">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="img/counter.jpg">
<meta name="author" content="Marleo (marleo.tech)">
<link rel="icon" href="img/mark.png">
<link rel="preload" href="assets/css/style.css" as="style">
<link rel="stylesheet" href="assets/css/style.css">
{extra}</head>
<body class="page-{page.split('.')[0]}">
<a class="skip" href="#main">Naar de inhoud</a>
{ICONS}
"""

def header(page):
    def links(cls=""):
        return "\n".join(f'<a href="{h}"{" aria-current=\"page\"" if h==page else ""}>{t}</a>' for h,t in NAV)
    always = "" if page=="index.html" else ""
    return f"""<header class="hdr" id="hdr">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Pain du Mie, naar de homepagina"><img src="img/logo-head.webp" alt="Pain du Mie" width="360" height="341"></a>
    <nav class="nav" aria-label="Hoofdmenu">
{links()}
    </nav>
    <div class="hdr-cta">
      <a class="btn btn-brick" href="reserveren.html"><svg aria-hidden="true"><use href="#i-cal"/></svg>Reserveer een tafel</a>
      <button class="burger" id="burger" aria-label="Menu openen" aria-expanded="false" aria-controls="drawer"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="drawer wall" id="drawer" aria-hidden="true">
  <nav aria-label="Mobiel menu">
{links()}
  </nav>
  <div class="d-meta"><span>Kruibekestraat 58, Bazel</span><a href="tel:+32498482256">0498 48 22 56</a></div>
</div>
"""

NETLIFY_FORMS = """
<!-- Verborgen formulieren: hierdoor herkent Netlify de reservatie- en contactformulieren.
     Inzendingen verschijnen in het Netlify-dashboard onder "Forms". Niet verwijderen. -->
<div hidden aria-hidden="true">
  <form name="reservatie" method="POST" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="reservatie">
    <input name="bot-field"><input name="Dag"><input name="Datum"><input name="Uur"><input name="Personen">
    <input name="Plaats"><input name="Gelegenheid"><input name="Naam"><input name="Telefoon"><input name="E-mail"><textarea name="Opmerking"></textarea>
  </form>
  <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact">
    <input name="bot-field"><input name="Onderwerp"><input name="Naam"><input name="E-mail"><input name="Telefoon"><textarea name="Bericht"></textarea>
  </form>
</div>
"""

def footer(page, scripts=()):
    pages = "\n".join(f'<li><a href="{h}">{t}</a></li>' for h,t in NAV)
    js = "\n".join(f'<script src="assets/js/{s}" defer></script>' for s in ("config.js","site.js")+tuple(scripts))
    forms = NETLIFY_FORMS if page in ("reserveren.html","contact.html") else ""
    fx = """<div class="pagefx" id="pagefx" aria-hidden="true">
  <div class="fx-layer">
    <svg class="fx-drip" viewBox="0 0 1200 120" preserveAspectRatio="none"><path fill="#FBF3E4" d="M0 120V44c40 0 52-26 92-26s44 30 86 30 46-34 88-34 48 38 90 38 46-30 88-30 48 32 90 32 46-34 88-34 48 36 90 36 46-28 88-28 50 24 92 24 44-22 88-22v90z"/></svg>
    <div class="fx-mid">
      %s
      <span>Pain du Mie</span>
    </div>
  </div>
</div>""" % CAKE_SVG
    cta = '' if page=="reserveren.html" else '<a class="btn btn-brick m-cta" id="mCta" href="reserveren.html"><svg aria-hidden="true"><use href="#i-cal"/></svg>Reserveer een tafel</a>'
    return f"""
<footer class="ftr wall">
  <div class="wrap">
    <div class="ftr-top">
      <div class="disc"><img src="img/logo.webp" alt="Pain du Mie" width="640" height="560" loading="lazy"></div>
      <p class="big script">Good food, brighter days</p>
      <div class="socials">
        <a data-link="facebook" href="#" target="_blank" rel="noopener" aria-label="Pain du Mie op Facebook"><svg><use href="#i-fb"/></svg></a>
        <a data-link="instagram" href="#" target="_blank" rel="noopener" aria-label="Pain du Mie op Instagram"><svg><use href="#i-ig"/></svg></a>
        <a data-link="google" href="#" target="_blank" rel="noopener" aria-label="Pain du Mie op Google"><svg><use href="#i-g"/></svg></a>
      </div>
    </div>
    <div class="ftr-cols">
      <div><h4>Pain du Mie</h4><ul>{pages}</ul></div>
      <div><h4>Bezoek</h4><p>Kruibekestraat 58<br>9150 Bazel</p><p style="margin-top:10px"><a href="tel:+32498482256">0498 48 22 56</a><br><a href="mailto:paindumie.bazel@gmail.com">paindumie.bazel@gmail.com</a></p></div>
      <div><h4>Openingsuren</h4><dl class="ftr-hours" data-hours></dl></div>
      <div><h4>Info</h4><ul><li><a href="algemene-voorwaarden.html">Algemene voorwaarden</a></li><li><a href="privacy.html">Privacybeleid</a></li><li><a href="kaart.html#desserts">Allergenen: vraag het ons</a></li></ul></div>
    </div>
    <div class="ftr-bot">
      <span>© <span data-year></span> Pain du Mie BV, BTW BE 1010.363.975</span>
      <a href="https://marleo.tech" target="_blank" rel="noopener">Website gemaakt door Marleo</a>
    </div>
  </div>
</footer>
{forms}{fx}{cta}
{js}
</body>
</html>
"""

def price(p):
    return p

DRIP = '<svg class="drip" viewBox="0 0 300 92" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 0H300V34C290 34 288 52 280 52C272 52 272 30 262 30C250 30 252 70 240 70C228 70 232 36 218 36C206 36 206 48 196 48C186 48 188 28 176 28C164 28 166 82 152 82C138 82 142 38 128 38C116 38 116 54 106 54C96 54 98 30 86 30C74 30 76 62 64 62C52 62 54 34 42 34C30 34 32 50 22 50C12 50 12 32 0 32Z"/></svg>'

SPECIALS = [
  ("oreo","Oreo Madness","Warme chocoladesaus en Oreo crumble.","9,00","12,50",""),
  ("bueno","Bueno Overload","Warme Bueno-saus en Bueno crumble.","9,00","12,50",""),
  ("lotus","Lotus Bomb","Warme Biscoff, speculaascrumble en vanille-ijs.","11,00","14,50",""),
  ("pasta","Pancake Pasta","Onze reuzepannenkoek in dikke pastaslierten, met vers fruit en warme Kinder-saus.","10,50","",""),
]

def special_cards():
    out = []
    for key,name,desc,p1,p2,tag in SPECIALS:
        t = f'<span class="tag">{tag}</span>' if tag else ''
        out.append(f"""<article class="special {key}" data-s="{name} reuzepannenkoek pannenkoek {desc}">{DRIP}<span class="crumbs" aria-hidden="true"></span>{t}
  <h3 class="n">{name}</h3><p>{desc}</p>
  <div class="price"><small>1 stuk</small><b data-p1="{p1}"{f' data-p2="{p2}"' if p2 else ''}>{p1}</b></div>
</article>""")
    return "\n".join(out)

def qty_toggle(target, light=False):
    return f"""<div class="qty" data-qty="{target}" role="group" aria-label="Aantal pannenkoeken">
  <span class="pill" aria-hidden="true"></span>
  <button type="button" data-v="1" aria-pressed="true">1 stuk</button>
  <button type="button" data-v="2" aria-pressed="false">2 stuks</button>
</div>"""
