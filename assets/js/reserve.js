/* Pain du Mie · reservatiemodule */
(function(){
const C = window.PDM, R = C.reservations, {$, $$, DAYS, MONTHS, toMin, fmt, iso} = C.util;
if(!$("#booker")) return;

const S = { date:null, time:null, people:2, zone:"Maakt niet uit", occasion:"", step:0, sending:false };
const DUUR = R.durationMinutes || 90;
let BEZET = {};                      // { "2026-10-10": [["10:00", 4, "tearoom"], ...] }

/* bezetting ophalen uit de Google Sheet, zonder namen; lukt het niet, dan blijft alles open */
(function laadBezetting(){
  if(!C.boekingenApi) return;
  const naam = "pdmBezet" + Date.now(), s = document.createElement("script");
  const t = setTimeout(()=>{ s.remove(); delete window[naam]; }, 20000);
  window[naam] = d=>{ clearTimeout(t); s.remove(); delete window[naam];
    if(d && d.ok && d.bezet){ BEZET = d.bezet; if(S.date) renderCal(); if(S.step===1) renderSlots(); if(S.step===2) setPeople(S.people, true); } };
  s.onerror = ()=>{ clearTimeout(t); s.remove(); delete window[naam]; };
  s.src = C.boekingenApi + (C.boekingenApi.indexOf("?")>-1?"&":"?") + "actie=bezetting&callback=" + naam + "&t=" + Date.now();
  document.head.appendChild(s);
})();

/* hoeveel plaatsen zijn er nog vrij in de tearoom op dit uur? */
function vrij(d, t){
  const lijst = BEZET[iso(d)] || [];
  const start = toMin(t), einde = start + DUUR;
  let bezet = 0;
  lijst.forEach(([u, n, zone])=>{
    if(zone === "lounge") return;
    const s2 = toMin(u), e2 = s2 + DUUR;
    if(s2 < einde && e2 > start) bezet += n;     // overlapt met dit slot
  });
  return Math.max(0, (R.seats && R.seats.tearoom || 26) - bezet);
}
const today = new Date(); today.setHours(0,0,0,0);
// vroegst mogelijke dag: vandaag, of de openingsdatum als die nog moet komen
const firstDay = (function(){
  if(!R.opensOn) return today;
  const [y,m,d] = R.opensOn.split("-").map(Number), o = new Date(y, m-1, d);
  return o > today ? o : today;
})();
const maxDate = new Date(firstDay); maxDate.setDate(maxDate.getDate()+R.daysAhead);
let view = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
const panes = $$(".pane"), stepEls = $$("#steps li"), next = $("#nextBtn"), back = $("#backBtn");
const longDate = d => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
const isOpenDay = d => !!C.hours[d.getDay()] && !R.closedDates.includes(iso(d));

function flash(el, txt){ el.textContent = txt; el.classList.remove("empty","flash"); void el.offsetWidth; el.classList.add("flash"); }

function slotsFor(d){
  const h = C.hours[d.getDay()]; if(!h) return [];
  const out = [], o = Math.max(toMin(h[0]), toMin(R.firstSlot)), c = toMin(h[1]) - R.lastSlotBeforeClose;
  const now = new Date(), isToday = +d === +today, limit = now.getHours()*60 + now.getMinutes() + R.minNoticeMinutes;
  for(let m = o; m <= c; m += R.slotStep){
    const t = fmt(m), v = vrij(d, t);
    out.push({ t, m, past: (isToday && m < limit) || v <= 0, vrij: v });
  }
  return out;
}

/* ---- kalender ---- */
function renderCal(){
  $("#calMonth").textContent = MONTHS[view.getMonth()]+" "+view.getFullYear();
  const cal = $("#cal");
  cal.innerHTML = ["ma","di","wo","do","vr","za","zo"].map(d=>`<div class="dow" aria-hidden="true">${d}</div>`).join("");
  const offset = (view.getDay()+6)%7;
  for(let i=0;i<offset;i++) cal.insertAdjacentHTML("beforeend","<span></span>");
  const days = new Date(view.getFullYear(), view.getMonth()+1, 0).getDate();
  for(let n=1;n<=days;n++){
    const d = new Date(view.getFullYear(), view.getMonth(), n), b = document.createElement("button");
    b.type = "button"; b.textContent = n;
    const open = isOpenDay(d), inRange = d >= firstDay && d <= maxDate;
    const full = open && inRange && slotsFor(d).every(s=>s.past);
    b.disabled = !(open && inRange) || full;
    if(!open && inRange) b.classList.add("closed-day");
    if(+d === +today) b.classList.add("today");
    b.setAttribute("aria-label", longDate(d) + (b.disabled ? (open ? ", niet meer beschikbaar" : ", gesloten") : ""));
    b.setAttribute("aria-pressed", !!S.date && +S.date === +d);
    b.addEventListener("click", ()=>{
      S.date = d; S.time = null; renderCal();
      flash($("#tDate"), longDate(d)); $("#tTime").textContent="—"; $("#tTime").classList.add("empty");
      update(); setTimeout(()=>go(1), 260);
    });
    cal.appendChild(b);
  }
  $("#calPrev").disabled = view <= new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
  $("#calNext").disabled = new Date(view.getFullYear(), view.getMonth()+1, 1) > maxDate;
}
$("#calPrev").onclick = ()=>{ view = new Date(view.getFullYear(), view.getMonth()-1, 1); renderCal(); };
// melding tonen zolang de reservaties nog niet open zijn
(function(){                       // melding tonen zolang de reservaties nog niet open zijn
  const n = $("#resSoon"); if(!n) return;
  if(+firstDay > +today){ n.querySelector("b").textContent = longDate(firstDay); n.hidden = false; }
  else n.remove();
})();
$("#calNext").onclick = ()=>{ view = new Date(view.getFullYear(), view.getMonth()+1, 1); renderCal(); };

/* ---- tijdsloten ---- */
function renderSlots(){
  const wrap = $("#slotWrap"); wrap.innerHTML = "";
  if(!S.date){ wrap.innerHTML = '<p class="empty-msg">Kies eerst een dag.</p>'; return; }
  const slots = slotsFor(S.date);
  const groups = [["Voormiddag", s=>s.m<12*60], ["Middag", s=>s.m>=12*60 && s.m<15*60], ["Namiddag en apéro", s=>s.m>=15*60]];
  groups.forEach(([name,f])=>{
    const list = slots.filter(f); if(!list.length) return;
    const g = document.createElement("div"); g.className = "slot-group";
    g.innerHTML = `<h4>${name}</h4><div class="slots" role="group" aria-label="${name}"></div>`;
    list.forEach(s=>{
      const b = document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=s.t; b.disabled=s.past;
      if(s.vrij <= 0) b.title = "Volzet";
      else if(s.vrij <= 6){ b.classList.add("krap"); b.innerHTML = s.t + "<small>nog " + s.vrij + "</small>"; }
      b.setAttribute("aria-pressed", S.time===s.t);
      b.onclick = ()=>{ S.time = s.t; $$(".chip",wrap).forEach(x=>x.setAttribute("aria-pressed", x===b)); flash($("#tTime"), s.t); update(); setTimeout(()=>go(2), 260); };
      $(".slots",g).appendChild(b);
    });
    wrap.appendChild(g);
  });
}

/* ---- gezelschap ---- */
function maxNu(){
  const v = (S.date && S.time) ? vrij(S.date, S.time) : R.maxPeople;
  return Math.max(1, Math.min(R.maxPeople, v));
}
function setPeople(n, silent){
  const max = maxNu();
  S.people = Math.min(max, Math.max(1, n)); $("#pOut").textContent = S.people;
  $("#pMinus").disabled = S.people <= 1; $("#pPlus").disabled = S.people >= max;
  $("#pHint").hidden = S.people < max;
  $("#pHint").innerHTML = max < R.maxPeople
    ? `Op dit uur zijn er nog ${max} ${max===1?"plaats":"plaatsen"} vrij. Met meer? Bel of app naar <a class="text-link" href="tel:${C.phone}">${C.phoneLabel}</a>.`
    : `Met meer? Bel of app naar <a class="text-link" href="tel:${C.phone}">${C.phoneLabel}</a>.`;
  if(typeof syncZones === "function") syncZones();
  const t = S.people + (S.people===1 ? " persoon" : " personen");
  silent ? ($("#tPeople").textContent = t) : flash($("#tPeople"), t);
}
$("#pMinus").onclick = ()=>setPeople(S.people-1);
$("#pPlus").onclick = ()=>setPeople(S.people+1);
/* In de lounge kan enkel iets gedronken worden, en er zijn maar 8 plaatsen. */
const EET = ["Ontbijt","Lunch"];
function syncZones(){
  const eten = EET.includes(S.occasion);
  $$(".zone").forEach(z=>{
    const lounge = z.dataset.zone === "Lounge";
    const teVeel = lounge && S.people > R.seats.lounge;
    const blok = lounge && (eten || teVeel);
    z.disabled = blok;
    z.classList.toggle("off", blok);
    const w = $(".z-warn", z);
    if(w) w.textContent = !lounge ? "" : teVeel ? `Maar ${R.seats.lounge} plaatsen` : eten ? "Niet voor ontbijt of lunch" : "";
    if(blok && S.zone === "Lounge") pickZone($$(".zone").find(x=>x.dataset.zone==="Maakt niet uit"));
  });
  $("#loungeNote").hidden = !(S.zone === "Lounge");
}
function pickZone(z){
  if(!z || z.disabled) return;
  S.zone = z.dataset.zone;
  $$(".zone").forEach(x=>x.setAttribute("aria-pressed", x===z));
  flash($("#tZone"), S.zone);
  syncZones();
}
$$(".zone").forEach(z=>z.onclick = ()=>pickZone(z));
$$("#occ .chip").forEach(c=>c.onclick = ()=>{
  const on = c.getAttribute("aria-pressed")!=="true";
  $$("#occ .chip").forEach(x=>x.setAttribute("aria-pressed", false));
  c.setAttribute("aria-pressed", on); S.occasion = on ? c.textContent.trim() : "";
  syncZones();
});

/* ---- gegevens ---- */
const fields = { fName:v=>v.trim().length>1, fPhone:v=>v.replace(/[^\d]/g,"").length>=9, fMail:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) };
Object.keys(fields).forEach(id=>{
  const el = $("#"+id);
  el.addEventListener("blur", ()=>{ if(el.value) el.parentElement.classList.toggle("bad", !fields[id](el.value)); });
  el.addEventListener("input", ()=>{ if(el.parentElement.classList.contains("bad")) el.parentElement.classList.toggle("bad", !fields[id](el.value)); update(); });
});
$("#fOk").addEventListener("change", update);

function valid(){
  if(S.step===0) return !!S.date;
  if(S.step===1) return !!S.time;
  if(S.step===2) return true;
  if(S.step===3) return Object.keys(fields).every(id=>fields[id]($("#"+id).value)) && $("#fOk").checked;
}
function update(){
  next.disabled = S.sending;
  const labels = [S.date ? "Verder naar uur" : "Kies een dag", S.time ? "Verder" : "Kies een uur", "Verder naar gegevens", "Verstuur reservatie"];
  next.textContent = S.sending ? "Bezig met versturen…" : labels[S.step];
  next.setAttribute("aria-disabled", !valid());
  next.classList.toggle("soft", !valid());
  next.style.opacity = valid() || S.sending ? "" : ".45";
  back.hidden = S.step === 0;
}
function go(n, isBack){
  S.step = n;
  panes.forEach((p,i)=>{ p.classList.toggle("on", i===n); p.classList.toggle("back", !!isBack); });
  stepEls.forEach((li,i)=>{ li.classList.toggle("done", i<n); li.classList.toggle("cur", i===n); });
  if(n===1) renderSlots();
  $("#flowFoot").style.display = n===4 ? "none" : "";
  $("#resErr").classList.remove("show");
  update();
  const h = panes[n].querySelector("h3"); if(h){ h.tabIndex = -1; h.focus({preventScroll:true}); }
  const top = $("#booker").getBoundingClientRect().top;
  if(top < 0) $("#booker").scrollIntoView({behavior:"smooth", block:"start"});
}

next.addEventListener("click", async ()=>{
  if(S.sending) return;
  if(!valid()){
    if(S.step===3){
      Object.keys(fields).forEach(id=>$("#"+id).parentElement.classList.toggle("bad", !fields[id]($("#"+id).value)));
      $("#okErr").classList.toggle("show", !$("#fOk").checked);
      $("#form .bad input")?.focus();
    }
    return;
  }
  if(S.step < 3) return go(S.step+1);
  if($("#fHp").value) return; // spam
  S.sending = true; update();
  const d = {
    dag: longDate(S.date), datum: iso(S.date), uur: S.time, personen: S.people, plaats: S.zone, gelegenheid: S.occasion || "-",
    naam: $("#fName").value.trim(), telefoon: $("#fPhone").value.trim(), email: $("#fMail").value.trim(), opmerking: $("#fNote").value.trim() || "-"
  };
  const subject = `Reservatie ${d.dag} om ${d.uur} · ${d.personen}p · ${d.naam}`;
  const payload = {
    _subject: subject, _template: "table", _replyto: d.email, _captcha: "false",
    _autoresponse: `Hallo ${d.naam}, bedankt voor je reservatie-aanvraag bij Pain du Mie voor ${d.dag.toLowerCase()} om ${d.uur} (${d.personen} ${d.personen===1?"persoon":"personen"}). Dit is nog geen bevestiging: we laten je zo snel mogelijk weten of het lukt. Tot snel! Pain du Mie, Kruibekestraat 58, Bazel, ${C.phoneLabel}`,
    Dag: d.dag, Datum: d.datum, Uur: d.uur, Personen: d.personen, Plaats: d.plaats, Gelegenheid: d.gelegenheid,
    Naam: d.naam, Telefoon: d.telefoon, "E-mail": d.email, Opmerking: d.opmerking
  };
  // 1) in de Google Sheet + dashboard, 2) per e-mail
  // beide tegelijk, zodat de bezoeker niet op de traagste hoeft te wachten
  const [bewaard, gemaild] = await Promise.all([
    C.bewaar("reservatie", {
      dag: d.dag, datum: d.datum, uur: d.uur, personen: d.personen, plaats: d.plaats,
      gelegenheid: d.gelegenheid, naam: d.naam, telefoon: d.telefoon, email: d.email, opmerking: d.opmerking
    }),
    C.send(payload, "reservatie")
  ]);
  const ok = bewaard || gemaild;
  S.sending = false;
  if(ok){
    $("#doneTitle").textContent = "Aanvraag verstuurd";
    $("#doneText").textContent = `Bedankt ${d.naam.split(" ")[0]}! We hebben je aanvraag voor ${d.dag.toLowerCase()} om ${d.uur} ontvangen. We bevestigen zo snel mogelijk op ${d.email} of telefonisch.`;
    go(4);
  } else {
    update();
    const body = Object.entries(payload).filter(([k])=>!k.startsWith("_")).map(([k,v])=>`${k}: ${v}`).join("\n");
    const err = $("#resErr");
    err.innerHTML = `Je reservatie kon niet automatisch verstuurd worden. <a href="${C.mailto(subject, body)}">Verstuur ze via je e-mailprogramma</a> (alles staat al ingevuld) of bel ons op <a href="tel:${C.phone}">${C.phoneLabel}</a>.`;
    err.classList.add("show");
  }
});
back.onclick = ()=>go(Math.max(0, S.step-1), true);

$("#againBtn").onclick = ()=>{
  S.date = null; S.time = null; S.occasion = "";
  ["fName","fPhone","fMail","fNote"].forEach(id=>$("#"+id).value=""); $("#fOk").checked = false;
  $$("#occ .chip").forEach(x=>x.setAttribute("aria-pressed", false));
  $("#tDate").textContent = "Kies een dag"; $("#tDate").classList.add("empty");
  $("#tTime").textContent = "—"; $("#tTime").classList.add("empty");
  renderCal(); go(0, true);
};
$("#icsBtn").onclick = ()=>{
  const [h,m] = S.time.split(":").map(Number), s = new Date(S.date); s.setHours(h,m);
  const e = new Date(s.getTime()+90*60000);
  const f = x=>iso(x).replace(/-/g,"")+"T"+String(x.getHours()).padStart(2,"0")+String(x.getMinutes()).padStart(2,"0")+"00";
  const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Pain du Mie//NL","BEGIN:VEVENT","UID:"+Date.now()+"@paindumie","DTSTAMP:"+f(new Date()),"DTSTART:"+f(s),"DTEND:"+f(e),
    "SUMMARY:Pain du Mie ("+S.people+" pers.)","DESCRIPTION:Reservatie-aanvraag bij Pain du Mie","LOCATION:Kruibekestraat 58\\, 9150 Bazel","END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics],{type:"text/calendar"})); a.download = "pain-du-mie-reservatie.ics"; a.click();
};

renderCal(); setPeople(2, true); syncZones(); update();
})();
