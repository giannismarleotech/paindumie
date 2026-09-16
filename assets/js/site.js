/* Pain du Mie · gedeelde scripts */
(function(){
const C = window.PDM;
const $ = (s,c=document)=>c.querySelector(s), $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const DAYS = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
const MONTHS = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
const toMin = t=>{const [h,m]=t.split(":").map(Number);return h*60+m;};
const fmt = m=>String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
C.util = {$,$$,DAYS,MONTHS,toMin,fmt,reduced,
  iso:d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),
  esc:s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))
};

/* Formulier versturen. Probeert eerst Netlify Forms, dan FormSubmit. Geeft true/false terug. */
async function post(url, opts){
  const ctrl = new AbortController(); const t = setTimeout(()=>ctrl.abort(), 8000);
  try{ return await fetch(url, Object.assign({method:"POST", signal:ctrl.signal}, opts)); }
  finally{ clearTimeout(t); }
}
/* bewaart de aanvraag in de Google Sheet, zodat ze ook in het dashboard verschijnt */
C.bewaar = async function(soort, velden){
  if(!C.boekingenApi) return false;
  try{
    const ctrl = new AbortController(); const t = setTimeout(()=>ctrl.abort(), 25000);
    // mode "no-cors": de aanvraag komt gewoon aan bij Google, maar de browser hoeft het
    // antwoord niet te lezen. Google stuurt dat namelijk via een omweg die browsers weigeren.
    await fetch(C.boekingenApi, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type": "text/plain;charset=utf-8"},
      body: JSON.stringify(Object.assign({actie:"nieuw", soort:soort}, velden)),
      signal: ctrl.signal
    });
    clearTimeout(t);
    return true;
  }catch(e){ return false; }
};

C.send = async function(data, formName){
  // 1) Netlify Forms
  if(C.netlifyForms && formName && location.protocol.startsWith("http")){
    try{
      const body = new URLSearchParams({"form-name":formName});
      Object.entries(data).forEach(([k,v])=>{ if(!k.startsWith("_")) body.append(k, v); });
      const r = await post(location.pathname, {headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:body.toString()});
      if(r.ok) return true;
    }catch(e){ /* val terug op FormSubmit */ }
  }
  // 2) FormSubmit
  if(!C.formEndpoint) return false;
  try{
    const r = await post(C.formEndpoint,{headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)});
    if(!r.ok) return false;
    const j = await r.json().catch(()=>({}));
    return j.success===true || j.success==="true";
  }catch(e){ return false; }
};
C.mailto = (subject, body)=>`mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/* links */
$$("[data-link]").forEach(a=>{
  const url = C.links[a.dataset.link];
  if(url) a.href = url; else a.remove();
});
$$("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());

/* telefoon en e-mail overal gelijk houden met de instellingen */
$$('a[href^="tel:"]').forEach(a=>{
  a.href = "tel:" + C.phone;
  if(a.textContent.replace(/\D/g,"").length >= 8) a.textContent = C.phoneLabel;
});
$$('a[href^="mailto:"]').forEach(a=>{
  a.href = "mailto:" + C.email;
  if(a.textContent.indexOf("@") > -1) a.textContent = C.email;
});
$$("[data-phone]").forEach(e=>e.textContent = C.phoneLabel);
$$("[data-mail]").forEach(e=>e.textContent = C.email);

/* header */
const hdr = $("#hdr"), mCta = $("#mCta"); let lastY = scrollY;
const resSec = $("#reserveren");
function onScroll(){
  const y = scrollY;
  hdr.classList.toggle("solid", y > 40);
  const hide = y > 500 && y > lastY && !document.body.classList.contains("menu-open");
  hdr.classList.toggle("hide", hide);
  document.body.classList.toggle("hdr-shown", y > 40 && !hide);
  if(mCta){
    /* de knop verdwijnt bij het reservatieblok en bij de footer, zodat ze niets bedekt */
    let over = false;
    [resSec, document.querySelector(".ftr")].forEach(el=>{
      if(!el) return; const r = el.getBoundingClientRect();
      if(r.top < innerHeight - 40 && r.bottom > 0) over = true;
    });
    /* omhoog scrollen? dan even wegschuiven, zodat je alles kan aantikken */
    const omhoog = y < lastY - 4;
    mCta.classList.toggle("show", y > innerHeight*.7 && !over && !omhoog);
  }
  lastY = y;
}
addEventListener("scroll", onScroll, {passive:true}); onScroll();

const burger = $("#burger"), drawer = $("#drawer");
function setMenu(open){
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open?"Menu sluiten":"Menu openen");
  drawer.setAttribute("aria-hidden", !open);
  document.documentElement.style.overflow = open ? "hidden" : "";
  if(open) hdr.classList.remove("hide");
}
burger?.addEventListener("click", ()=>setMenu(!document.body.classList.contains("menu-open")));
$$("#drawer a").forEach(a=>a.addEventListener("click", ()=>setMenu(false)));
addEventListener("keydown", e=>{ if(e.key==="Escape" && document.body.classList.contains("menu-open")){ setMenu(false); burger.focus(); } });

/* openingsuren + status */
(function(){
  const now = new Date(), d = now.getDay(), nowM = now.getHours()*60+now.getMinutes();
  const order = [1,2,3,4,5,6,0];
  $$("[data-hours]").forEach(dl=>{
    dl.innerHTML = order.map(i=>{
      const h = C.hours[i], cls = (i===d?"is-today ":"")+(h?"":"closed-d");
      return `<dt class="${cls}">${DAYS[i]}</dt><dd class="${cls}">${h?h[0]+" – "+h[1]:"gesloten"}</dd>`;
    }).join("");
  });
  let text = "", open = false; const h = C.hours[d];
  if(h && nowM>=toMin(h[0]) && nowM<toMin(h[1])){ open = true; text = `Nu open, tot ${h[1]}`; }
  else for(let k=0;k<8;k++){
    const dd=(d+k)%7, hh=C.hours[dd];
    if(!hh || (k===0 && nowM>=toMin(hh[0]))) continue;
    text = `Gesloten, we openen ${k===0?"vandaag":k===1?"morgen":DAYS[dd].toLowerCase()} om ${hh[0]}`; break;
  }
  $$("[data-status-text]").forEach(e=>e.textContent=text);
  $$("[data-status-dot]").forEach(e=>e.classList.toggle("closed",!open));
})();

/* reveal */
const rv = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); rv.unobserve(e.target);} }), {threshold:.15});
$$(".reveal,.special").forEach(el=>rv.observe(el));

/* ticker */
const tk = $("#ticker");
if(tk){ const w = tk.dataset.words.split("|"); tk.innerHTML = [...w,...w].map(x=>`<span>${x}</span>`).join(""); }

/* 1 stuk / 2 stuks toggle */
$$("[data-qty]").forEach(group=>{
  const btns = $$("button",group), pill = $(".pill",group);
  const scope = document.getElementById(group.dataset.qty) || document;
  function place(b){ pill.style.width = b.offsetWidth+"px"; pill.style.transform = `translateX(${b.offsetLeft-4}px)`; }
  btns.forEach(b=>b.addEventListener("click",()=>{
    btns.forEach(x=>x.setAttribute("aria-pressed", x===b)); place(b);
    const two = b.dataset.v==="2";
    $$("[data-p1]",scope).forEach(el=>{
      const val = two && el.dataset.p2 ? el.dataset.p2 : el.dataset.p1;
      const lbl = el.parentElement.querySelector("small");
      if(lbl) lbl.textContent = two ? (el.dataset.p2 ? "2 stuks" : "enkel per stuk") : "1 stuk";
      if(el.textContent!==val){ el.textContent = val; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
    });
  }));
  const init = ()=>place(btns.find(b=>b.getAttribute("aria-pressed")==="true"));
  addEventListener("resize", init); document.fonts?.ready.then(init); init();
});

/* dag-tijdlijn */
(function(){
  const moments = $$(".moment"); if(!moments.length) return;
  const figs = $$("#stage figure"), clock = $("#clockTime"), arc = $("#arcDone"), sun = $("#sun");
  const L = arc.getTotalLength(); arc.style.strokeDasharray = L; arc.style.strokeDashoffset = L;
  const s0 = toMin("07:00"), s1 = toMin("18:00"); let cur = 0, shown = s0, raf;
  const setArc = m=>{ const p=Math.min(1,Math.max(0,(m-s0)/(s1-s0))); arc.style.strokeDashoffset=L*(1-p); const pt=arc.getPointAtLength(L*p); sun.setAttribute("cx",pt.x); sun.setAttribute("cy",pt.y); };
  function to(target){
    cancelAnimationFrame(raf); const from=shown, t0=performance.now(), dur=reduced?1:900;
    const step=t=>{ const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3); shown=Math.round(from+(target-from)*e); clock.textContent=fmt(shown); setArc(shown); if(k<1) raf=requestAnimationFrame(step); };
    raf=requestAnimationFrame(step);
  }
  setArc(s0);
  const io = new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return; const i=moments.indexOf(e.target); if(i===cur) return; cur=i;
    moments.forEach((m,j)=>m.classList.toggle("on",j===i)); figs.forEach((f,j)=>f.classList.toggle("on",j===i));
    to(toMin(e.target.dataset.time));
  }), {rootMargin:"-48% 0px -48% 0px"});
  moments.forEach(m=>io.observe(m));
})();

/* Google Maps pas laden na klik (privacy) */
$$("[data-map]").forEach(box=>{
  $("button",box).addEventListener("click",()=>{
    box.innerHTML = `<iframe title="Kaart: Pain du Mie, Kruibekestraat 58, Bazel" src="https://www.google.com/maps?q=Kruibekestraat+58,+9150+Bazel&z=16&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  });
});

/* ---------- 3D: hero-diepte, kantelende kaarten en de schotelstapel ---------- */
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

/* hero: beeld schuift mee met het scrollen */
const heroFrame = $(".hero-frame"), heroImg = $(".hero-frame>img");
if(heroImg && !reduced){
  let t=false;
  addEventListener("scroll",()=>{ if(t) return; t=true; requestAnimationFrame(()=>{
    const y=scrollY; if(y<1200) heroImg.style.setProperty("--sy", (y*.18)+"px"); t=false; }); },{passive:true});
}

/* hero: tekst, beeld en zegel bewegen elk anders met de cursor mee */
if(heroFrame && fine && !reduced){
  let raf;
  heroFrame.addEventListener("pointermove", e=>{
    const r = heroFrame.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      heroImg.style.setProperty("--sx", (-px*26)+"px");
      const copy = $(".hero-copy"), seal = $(".seal");
      if(copy) copy.style.setProperty("--cx", (px*14)+"px");
      if(seal){ seal.style.setProperty("--zx", (-px*34)+"px"); seal.style.setProperty("--zy", (-py*22)+"px"); }
    });
  });
  heroFrame.addEventListener("pointerleave", ()=>{
    heroImg.style.setProperty("--sx","0px");
    [".hero-copy",".seal"].forEach(s=>{ const el=$(s); if(el){ el.style.setProperty("--cx","0px"); el.style.setProperty("--zx","0px"); el.style.setProperty("--zy","0px"); } });
  });
}

/* kaarten kantelen in 3D onder de cursor */
if(fine && !reduced) $$(".special").forEach(card=>{
  card.insertAdjacentHTML("beforeend", '<span class="shine" aria-hidden="true"></span>');
  let raf;
  card.addEventListener("pointermove", e=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      card.classList.add("tilt-on");
      card.style.setProperty("--ty", ((px-.5)*13).toFixed(2));
      card.style.setProperty("--tx", ((.5-py)*10).toFixed(2));
      card.style.setProperty("--mx", (px*100).toFixed(1)+"%");
      card.style.setProperty("--my", (py*100).toFixed(1)+"%");
    });
  });
  card.addEventListener("pointerleave", ()=>{
    cancelAnimationFrame(raf);
    card.classList.remove("tilt-on");
    card.style.setProperty("--tx",0); card.style.setProperty("--ty",0);
  });
});

/* schotelstapel: schuift open tijdens het scrollen, kantelt met de cursor */
const stack = $("#stack");
if(stack){
  const inner = $(".stack-inner", stack);
  if(!reduced && fine){
    let t=false;
    const fan = ()=>{
      const r = stack.getBoundingClientRect(), h = innerHeight;
      const p = Math.min(1, Math.max(0, (h*.92 - r.top) / (h*.62)));
      stack.style.setProperty("--sp", p.toFixed(3));
    };
    addEventListener("scroll",()=>{ if(t) return; t=true; requestAnimationFrame(()=>{ fan(); t=false; }); },{passive:true});
    addEventListener("resize", fan); fan();
  } else stack.style.setProperty("--sp", 1);   // op gsm staan de schoteltjes meteen open
  if(fine && !reduced){
    let raf;
    stack.addEventListener("pointermove", e=>{
      const r = stack.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        inner.style.transition = "none";
        inner.style.setProperty("--ry", (-12 + px*26).toFixed(2));
        inner.style.setProperty("--rx", (5 - py*16).toFixed(2));
      });
    });
    stack.addEventListener("pointerleave", ()=>{
      inner.style.transition = "";
      inner.style.setProperty("--ry", -12); inner.style.setProperty("--rx", 5);
    });
  }
}

/* contactformulier */
const cf = $("#contactForm");
if(cf){
  const v = { cName:x=>x.trim().length>1, cMail:x=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x.trim()), cMsg:x=>x.trim().length>4 };
  const check = id=>{ const el=$("#"+id), ok=v[id](el.value); el.parentElement.classList.toggle("bad",!ok); return ok; };
  Object.keys(v).forEach(id=>$("#"+id).addEventListener("blur",()=>check(id)));
  cf.addEventListener("submit", async e=>{
    e.preventDefault();
    const allOk = Object.keys(v).map(check).every(Boolean);
    const ok2 = $("#cOk").checked; $("#cOkErr").classList.toggle("show",!ok2);
    if(!allOk || !ok2){ $(".bad input, .bad textarea",cf)?.focus(); return; }
    if($("#cHp").value) return;
    const btn = $("button[type=submit]",cf); btn.classList.add("busy"); btn.textContent="Bezig met versturen…";
    const data = { _subject:`Contact via website: ${$("#cTopic").value}`, _template:"table", _replyto:$("#cMail").value.trim(), _captcha:"false",
      Onderwerp:$("#cTopic").value, Naam:$("#cName").value.trim(), "E-mail":$("#cMail").value.trim(), Telefoon:$("#cPhone").value.trim()||"-", Bericht:$("#cMsg").value.trim() };
    const [bewaard, gemaild] = await Promise.all([
      C.bewaar("bericht", {
        onderwerp: $("#cTopic").value, naam: $("#cName").value.trim(),
        email: $("#cMail").value.trim(), telefoon: $("#cPhone").value.trim() || "-",
        bericht: $("#cMsg").value.trim()
      }),
      C.send(data, "contact")
    ]);
    const sent = bewaard || gemaild;
    btn.classList.remove("busy"); btn.textContent="Verstuur bericht";
    if(sent){ cf.hidden = true; $("#formSent").classList.add("show"); $("#formSent h3").focus(); }
    else{
      const body = Object.entries(data).filter(([k])=>!k.startsWith("_")).map(([k,x])=>`${k}: ${x}`).join("\n");
      const err = $("#cErr"); err.innerHTML = `Het bericht kon niet automatisch verstuurd worden. <a href="${C.mailto(data._subject,body)}">Open het in je e-mailprogramma</a> of bel ons op <a href="tel:${C.phone}">${C.phoneLabel}</a>.`; err.classList.add("show");
    }
  });
}

/* inhoudstafel legal */
const toc = $$(".toc a");
if(toc.length){
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) toc.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id)); }),{rootMargin:"-20% 0px -70% 0px"});
  $$(".prose h2[id]").forEach(h=>io.observe(h));
}
})();

/* ---------- 3D-intro ---------- */
(function(){
  const intro = document.getElementById("intro");
  if(!intro) return;
  const stil = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = (()=>{ try{ return sessionStorage.getItem("pdm-intro") === "1"; }catch(e){ return false; } })();
  const andereStart = location.hash.startsWith("#/") && !location.hash.startsWith("#/home");
  if(seen || stil || andereStart){ intro.remove(); return; }
  try{ sessionStorage.setItem("pdm-intro","1"); }catch(e){}

  document.body.classList.add("intro-running");
  let done = false;
  function finish(fast){
    if(done) return; done = true;
    document.getElementById("introWord")?.classList.add("out");
    intro.classList.add("gone");
    setTimeout(()=>{
      document.body.classList.remove("intro-running");
      intro.remove();
    }, fast ? 400 : 600);
  }
  document.getElementById("introSkip").addEventListener("click", ()=>finish(true));
  intro.addEventListener("click", e=>{ if(e.target.id !== "introSkip") finish(true); });
  addEventListener("keydown", e=>{ if(e.key === "Escape") finish(true); }, {once:true});
  setTimeout(()=>finish(false), 2400);
})();

/* ---------- paginawissel: de schijf komt even voorbij ---------- */
window.PDMfx = (function(){
  const fx = document.getElementById("pagefx");
  const stil = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!fx || stil) return { cover: cb=>cb && cb(), reveal(){} };
  return {
    /* dekt het scherm af, roept dan de wissel op en veegt weer open */
    cover(swap){
      fx.classList.remove("reveal"); fx.classList.add("cover");
      setTimeout(()=>{
        if(swap) swap();
        fx.classList.remove("cover"); fx.classList.add("reveal");
        setTimeout(()=>fx.classList.remove("reveal"), 620);
      }, 450);
    },
    reveal(){ fx.classList.add("reveal"); setTimeout(()=>fx.classList.remove("reveal"), 620); }
  };
})();
/* bij een gewone paginalading veegt de schijf open, behalve als de intro loopt */
if(!document.getElementById("intro") && !document.body.classList.contains("intro-running")) window.PDMfx.reveal();
