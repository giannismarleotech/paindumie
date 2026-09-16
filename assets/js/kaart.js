/* Pain du Mie · kaart: zoeken + categorie-navigatie */
(function(){
const {$, $$} = window.PDM.util;
const cats = $$(".k-cats a"), secs = $$(".k-sec"), bar = $(".k-cats");

/* scroll-spy */
let lock = false;
function setOn(id){
  cats.forEach(a=>{
    const on = a.getAttribute("href") === "#"+id;
    a.classList.toggle("on", on);
    if(on && !lock){ bar.scrollTo({left: a.offsetLeft - bar.clientWidth/2 + a.offsetWidth/2, behavior:"smooth"}); }
  });
}
const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) setOn(e.target.id); }), {rootMargin:"-30% 0px -65% 0px"});
secs.forEach(s=>io.observe(s));
cats.forEach(a=>a.addEventListener("click", ()=>{ lock = true; setOn(a.getAttribute("href").slice(1)); setTimeout(()=>lock=false, 900); }));

/* zoeken */
const input = $("#kSearch"), wrap = $(".k-search"), empty = $("#kEmpty");
const norm = s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const items = $$("[data-s]");
items.forEach(el=>{ const n = el.querySelector(".n"); if(n) n.dataset.orig = n.innerHTML; });

function run(){
  const q = norm(input.value.trim());
  wrap.classList.toggle("has", !!q);
  items.forEach(el=>{
    const hit = !q || norm(el.dataset.s).includes(q);
    el.classList.toggle("hidden", !hit);
    const n = el.querySelector(".n");
    if(n){
      if(q && hit){
        const txt = n.dataset.orig, plain = norm(txt.replace(/<[^>]+>/g,""));
        const i = plain.indexOf(q);
        n.innerHTML = (i>=0 && !/</.test(txt)) ? txt.slice(0,i)+"<mark>"+txt.slice(i,i+q.length)+"</mark>"+txt.slice(i+q.length) : txt;
      } else n.innerHTML = n.dataset.orig;
    }
  });
  $$(".group, .board, .k-sec, .chip-row").forEach(box=>{
    if(!q){ box.classList.remove("hidden"); return; }
    const any = box.querySelector("[data-s]:not(.hidden)");
    box.classList.toggle("hidden", !any);
  });
  const anyAll = $(".k-sec:not(.hidden)");
  empty.classList.toggle("show", !!q && !anyAll);
  $("#kEmptyQ").textContent = input.value.trim();
  cats.forEach(a=>{ const s = document.getElementById(a.getAttribute("href").slice(1)); a.hidden = !!q && s.classList.contains("hidden"); });
}
input.addEventListener("input", run);
input.addEventListener("keydown", e=>{ if(e.key==="Escape"){ input.value=""; run(); } });
$(".k-search button").addEventListener("click", ()=>{ input.value=""; run(); input.focus(); });
$$("[data-suggest]").forEach(b=>b.addEventListener("click", ()=>{ input.value = b.dataset.suggest; run(); input.focus(); }));
})();
