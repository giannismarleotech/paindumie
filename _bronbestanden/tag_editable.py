# -*- coding: utf-8 -*-
"""Zet data-e (tekst) en data-img (foto) op alles wat via het dashboard bewerkbaar is."""
import re, sys, glob, os
from bs4 import BeautifulSoup

TEXT_TAGS = {"h1","h2","h3","h4","p","li","span","small","b","i","em","time","figcaption","strong","dd","dt","td","th"}
# niet bewerkbaar: alles wat de site laat werken of door javascript gevuld wordt
SKIP_ANCESTORS = [
    {"id": "intro"}, {"class": "pagefx"}, {"class": "intro"},
    {"class": "k-cats"}, {"class": "nav"}, {"class": "drawer"}, {"class": "hdr"},
    {"class": "ticker"}, {"class": "seal"}, {"class": "floaties"},
    {"class": "stack"}, {"class": "pk-stage"}, {"class": "steps"}, {"class": "cal"},
    {"class": "booker"}, {"class": "ftr"}, {"class": "k-search"}, {"class": "k-empty"},
    {"class": "map"}, {"class": "qty"}, {"class": "toc"},
]
SKIP_TAGS = {"script","style","svg","button","select","option","textarea","input","label","nav","form"}
SKIP_CLASSES = {"sr","dow","status-dot","tab-pill","shine","crumbs","drip","ck","pk","plate3d","fx-disc","hp"}
SKIP_ATTRS = ["data-hours","data-status-text","data-year"]


def skippable(el):
    for p in el.parents:
        if p.name in SKIP_TAGS:
            return True
        cls = set(p.get("class") or [])
        if p.get("id") == "intro" or p.get("aria-hidden") == "true":
            return True
        for rule in SKIP_ANCESTORS:
            if "class" in rule and rule["class"] in cls:
                return True
            if "id" in rule and p.get("id") == rule["id"]:
                return True
    cls = set(el.get("class") or [])
    if cls & SKIP_CLASSES:
        return True
    for a in SKIP_ATTRS:
        if el.has_attr(a):
            return True
    if el.get("aria-hidden") == "true":
        return True
    return False


def tag_file(path):
    html = open(path, encoding="utf-8").read()
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    if not main:
        return 0, 0
    n_text = n_img = 0

    # teksten: enkel bladeren, zodat je nooit een blok in een blok bewerkt
    for el in main.find_all(list(TEXT_TAGS)):
        if skippable(el):
            continue
        if el.find(list(TEXT_TAGS)):          # bevat zelf nog een bewerkbaar blok
            continue
        if not el.get_text(strip=True):
            continue
        n_text += 1
        el["data-e"] = f"t{n_text}"

    # foto's
    for img in main.find_all("img"):
        if skippable(img) or not img.get("src", "").startswith("img/"):
            continue
        n_img += 1
        img["data-img"] = f"i{n_img}"

    open(path, "w", encoding="utf-8").write(str(soup))
    return n_text, n_img


if __name__ == "__main__":
    base = os.path.join(os.path.dirname(__file__), "..")
    for f in sorted(glob.glob(os.path.join(base, "*.html"))):
        t, i = tag_file(f)
        print(f"{os.path.basename(f):28} {t:3} teksten, {i:2} foto's")
