/* Nyyo Legal demo UI — vanilla JS, no network calls. */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const E=window.NyyoEngine, CORPUS=window.LEGAL_CORPUS;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const DOCS={}; CORPUS.forEach(d=>DOCS[d.id]=d);
const chunks=[]; CORPUS.forEach(d=>d.sections.forEach(s=>chunks.push({...s,docId:d.id,docShort:d.short,docTitle:d.title})));
const IX=new E.Index(chunks);
let UPIX=null;
const CITES=[]; // registry {docId, ref, hl:[sentences]}
function cite(docId,ref,hl){CITES.push({docId,ref,hl:hl||[]});return CITES.length-1;}
function citeBtn(cid,label){return `<button type="button" class="cite" data-cid="${cid}" aria-label="Open source ${esc(label)}">${esc(label)}</button>`;}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("on"),1800);}
function sec(docId,ref){return (DOCS[docId]||{sections:[]}).sections.find(s=>s.ref===ref);}

/* ---------- Corpus sidebar ---------- */
function icon(d){ if(d.type.startsWith("Statute")) return ["LAW","law"]; if(d.type.startsWith("Internal")) return ["MEMO","memo"]; return [d.id==="lease"?"LSE":d.id.startsWith("nda")?"NDA":d.id==="employment"?"HR":"MSA",""]; }
$("#docCount").textContent=CORPUS.length;
$("#doclist").innerHTML=CORPUS.map(d=>{const [t,c]=icon(d);return `<li><button type="button" data-doc="${d.id}"><span class="ic ${c}">${t}</span><span>${esc(d.title)}<small>${esc(d.type)} · ${d.sections.length} sections</small></span></button></li>`;}).join("");
$("#doclist").addEventListener("click",e=>{const b=e.target.closest("button[data-doc]"); if(b) openDoc(b.dataset.doc,null,[]);});

/* ---------- Source viewer ---------- */
function openDoc(docId,ref,hl,scrollPage){
  const d=docId==="upload"?UPLOAD_DOC:DOCS[docId]; if(!d) return;
  $$("#doclist button").forEach(b=>b.classList.toggle("on",b.dataset.doc===docId));
  $("#viewerHead").innerHTML=`<h4 style="margin:0 0 4px">Source viewer</h4><div class="ttl">${esc(d.title)}</div><div class="meta">${esc(d.parties||"")}</div><div class="path mono">${esc(d.file||"")}</div>`;
  const body=$("#viewerBody");
  body.innerHTML=d.sections.map(s=>{
    let t=esc(s.t);
    if(s.ref===ref&&hl&&hl.length){ hl.forEach(h=>{const eh=esc(h); if(eh&&t.includes(eh)) t=t.replace(eh,`<mark>${eh}</mark>`);}); }
    return `<div class="sec${s.ref===ref?" hit":""}" data-ref="${esc(s.ref)}"><span class="r">${esc(s.ref)}</span><span class="h">${esc(s.h)}</span><div>${t}</div></div>`;
  }).join("");
  const hit=body.querySelector(".sec.hit");
  if(hit){ body.scrollTop=hit.offsetTop-body.offsetTop-12; }
  else body.scrollTop=0;
  if(scrollPage && window.innerWidth<=1100){ const v=$(".viewer"); const r=v.getBoundingClientRect(); if(r.top>window.innerHeight-80||r.top<0) v.scrollIntoView({behavior:"smooth",block:"start"}); }
}
document.addEventListener("click",e=>{const b=e.target.closest(".cite[data-cid]"); if(!b) return; const c=CITES[+b.dataset.cid]; openDoc(c.docId,c.ref,c.hl,true);});

/* ---------- Tabs ---------- */
$$(".tab").forEach(t=>t.addEventListener("click",()=>{ $$(".tab").forEach(x=>{x.classList.toggle("on",x===t);x.setAttribute("aria-selected",x===t);}); $$(".pane").forEach(p=>p.classList.toggle("on",p.id==="pane-"+t.dataset.pane)); }));

/* ---------- Ask ---------- */
const ASK_CHIPS=[
 "What is the notice period to terminate the services agreement for convenience?",
 "Does the MSA renew automatically?",
 "What is the liability cap in the MSA?",
 "Compare NDA A and NDA B: how long does confidentiality last?",
 "Is the employee non-compete enforceable under the statute?",
 "When can the tenant break the lease?",
 "What late payment interest applies?",
 "Which documents require breach notification within 72 hours?",
 "What does our playbook say about liability caps?"
];
const OFF_CHIP="What was the latest Supreme Court ruling on AI?";
function renderChips(el,list,off,handler){ el.innerHTML=list.map(q=>`<button type="button" data-q="${esc(q)}">${esc(q)}</button>`).join("")+(off?`<button type="button" class="off" data-q="${esc(off)}" title="Shows how it refuses questions outside the corpus">Off-corpus test: ${esc(off)}</button>`:""); el.addEventListener("click",e=>{const b=e.target.closest("button[data-q]"); if(b) handler(b.dataset.q);}); }
renderChips($("#askChips"),ASK_CHIPS,OFF_CHIP,q=>ask(q,"#thread",IX,false));
$("#askForm").addEventListener("submit",e=>{e.preventDefault();const q=$("#askInput").value.trim(); if(q){ask(q,"#thread",IX,false);$("#askInput").value="";}});

function addMsg(sel,cls,html){const m=document.createElement("div");m.className="msg "+cls;m.innerHTML=html;$(sel).appendChild(m);$(sel).scrollTop=$(sel).scrollHeight;return m;}
function ask(q,sel,index,isUpload){
  addMsg(sel,"user",`<div class="who">You</div><p>${esc(q)}</p>`);
  const t0=performance.now();
  const typing=addMsg(sel,"bot",`<div class="who">Nyyo Legal</div><div class="typing"><span></span><span></span><span></span></div>`);
  const res=E.answer(index,q,isUpload?{noBoost:true,min:2,maxDocs:2,ratio:.55}:{});
  setTimeout(()=>{ typing.innerHTML=renderAnswer(q,res,isUpload,performance.now()-t0); $(sel).scrollTop=typing.offsetTop-12; if(!res.refused){const it=res.items[0]; openDoc(it.chunk.docId,it.chunk.ref,it.sentences,false);} },520);
}
function renderAnswer(q,res,isUpload,ms){
  const head=`<div class="who">Nyyo Legal <span class="t">· searched ${isUpload?"this document":"9 files"} · 0 web sources</span></div>`;
  if(res.refused){
    return head+`<div class="ans-item refuse"><p><b>Not found in ${isUpload?"this document":"your corpus"}.</b> ${isUpload?"No passage of the document matches — the clause may be missing (see the risk table above).":"Closed corpus: I don't search the open web, so I won't guess an answer."}</p></div><div class="note">Try a suggested question, or add the relevant document to the corpus.</div>`;
  }
  let n=0;
  const items=res.items.map(it=>{ n++; const c=it.chunk; const cid=cite(c.docId,c.ref,it.sentences); const short=(isUpload?"Doc":(DOCS[c.docId]||{}).short)+" "+c.ref;
    return `<div class="ans-item"><p>${esc(it.sentences.join(" "))} ${citeBtn(cid,"["+n+"] "+short)}</p><div class="src">${esc(c.docTitle||"")} · ${esc(c.ref)} ${esc(c.h)}</div>${it.facts.length?`<div class="facts">${it.facts.map(f=>`<span class="fact">${esc(f)}</span>`).join("")}</div>`:""}</div>`;}).join("");
  const lead=`<p>Found in <b>${res.items.length}</b> ${res.items.length>1?"sources":"source"} of ${isUpload?"the document":"your corpus"}${res.items.length>1?" — each passage is cited":""}:</p>`;
  return head+lead+items+checks(q,res)+`<div class="note">Extractive demo answer (exact passages) · ${Math.max(1,Math.round(ms))} ms in your browser · human review required.</div>`;
}
function num(re,s){const m=s.match(re);return m?parseFloat(m[1].replace(",","")):null;}
function checks(q,res){
  const ids=res.items.map(i=>i.chunk.docId+"|"+i.chunk.ref);
  if(ids.includes("employment|§12")&&ids.includes("act-employment|Sec. 18")){
    const nc=sec("employment","§12").t, law=sec("act-employment","Sec. 18").t;
    const dur=num(/For (\d+) months/,nc), maxDur=num(/no more than (\d+) months/,law), comp=num(/equal to (\d+)%/,nc), minComp=num(/at least (\d+)%/,law);
    const ok=(b)=>b?"✅":"⚠️";
    return `<div class="check"><b>Cross-check: contract §12 vs Act Sec. 18</b><ul>
      <li>${ok(dur<=maxDur)} Duration ${dur} months ≤ ${maxDur} months maximum</li>
      <li>${ok(comp>=minComp)} Compensation ${comp}% ≥ ${minComp}% minimum</li>
      <li>✅ Defined area: “within the Westmark region”</li>
      <li>✅ In writing (employment contract)</li>
      <li>⚠️ “Legitimate business interest” must be assessed by a professional</li></ul>
      Result: consistent with Sec. 18 on the measurable criteria.</div>`;
  }
  if(/compare| vs |versus|which documents|what late/i.test(q)&&res.items.length>1){
    return `<div class="check"><b>At a glance</b><ul>${res.items.map(i=>`<li><b>${esc((DOCS[i.chunk.docId]||{}).short||"")} ${esc(i.chunk.ref)}</b>: ${esc(i.facts.join(" · ")||i.chunk.h)}</li>`).join("")}</ul></div>`;
  }
  return "";
}

/* ---------- Analyze ---------- */
let UPLOAD_DOC=null;
const drop=$("#drop");
["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over");}));
["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over");}));
drop.addEventListener("drop",e=>{const f=e.dataTransfer.files[0]; if(f) readFile(f);});
$("#fileIn").addEventListener("change",e=>{const f=e.target.files[0]; if(f) readFile(f);});
$("#useSample").addEventListener("click",()=>loadText(window.SAMPLE_UPLOAD.name,window.SAMPLE_UPLOAD.text));
async function readFile(f){
  if(f.size>15*1024*1024){toast("File too large for the demo (max 15 MB)");return;}
  $("#anOut").innerHTML=`<div class="viewer-empty">Reading ${esc(f.name)} locally…</div>`;
  try{
    if(/\.pdf$/i.test(f.name)||f.type==="application/pdf"){
      if(!window.pdfjsLib) throw new Error("PDF reader not loaded");
      pdfjsLib.GlobalWorkerOptions.workerSrc="./vendor/pdf.worker.min.js";
      const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;
      let text=""; for(let p=1;p<=Math.min(pdf.numPages,60);p++){const pg=await pdf.getPage(p); const c=await pg.getTextContent(); let line="",lastY=null; c.items.forEach(it=>{const y=it.transform[5]; if(lastY!==null&&Math.abs(y-lastY)>2){text+=line+"\n";line="";} line+=it.str; lastY=y;}); text+=line+"\n\n";}
      if(text.replace(/\s/g,"").length<40){$("#anOut").innerHTML=`<div class="viewer-empty">No selectable text found — this looks like a scanned PDF. The delivered tool includes local OCR; this browser demo doesn't.</div>`;return;}
      loadText(f.name,text);
    } else loadText(f.name,await f.text());
  }catch(err){$("#anOut").innerHTML=`<div class="viewer-empty">Could not read this file (${esc(err.message)}). Try a .txt or a text-based PDF.</div>`;}
}
function chunkText(text){
  text=text.replace(/\r/g,"");
  let parts=text.split(/\n(?=\s*(?:\d{1,2}(?:\.\d+)?[.)]|Article\s+\d+|Section\s+\d+|Clause\s+\d+)\s)/i).map(s=>s.trim()).filter(Boolean);
  if(parts.length<3) parts=text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  if(parts.length<3){ const ss=E.sentences(text.replace(/\s+/g," ")); parts=[]; for(let i=0;i<ss.length;i+=3) parts.push(ss.slice(i,i+3).join(" ")); }
  return parts.slice(0,400).map((p,i)=>{ p=p.replace(/\s*\n\s*/g," "); const m=p.match(/^\s*((?:\d{1,2}(?:\.\d+)?)|Article\s+\d+|Section\s+\d+|Clause\s+\d+)[.)]?\s+([^.]{1,60})\.\s*(.*)$/i);
    if(m) return {ref:/^\d/.test(m[1])?"Cl. "+m[1]:m[1],h:m[2],t:m[3]||m[2]};
    return {ref:"¶"+(i+1),h:i===0?"Heading":"",t:p}; });
}
const RULES=[
 {k:"Auto-renewal",re:/renews?\s+automatically|automatic(?:ally)?\s+renew/i,f:s=>{const d=num(/(\d+)\s+days/i,s);return {lvl:d&&d>90?"high":"med",msg:`Automatic renewal${d?` · non-renewal notice ${d} days`:""}${d&&d>90?" — above the 90-day playbook limit":""}`,pb:["playbook","P2"]};}},
 {k:"Exclusivity",re:/exclusiv/i,f:()=>({lvl:"high",msg:"Exclusive purchasing obligation for the whole term"})},
 {k:"Unilateral price change",re:/(change|increase)\s+(its\s+)?prices?[^.]*(at any time|without)|may not refuse/i,f:s=>({lvl:"high",msg:`One party can change prices unilaterally${num(/(\d+)\s+days/,s)?` on ${num(/(\d+)\s+days/,s)} days' notice`:""}`})},
 {k:"Late payment interest",re:/interest at\s+[\d.]+%\s+per\s+month/i,f:s=>{const r=num(/interest at\s+([\d.]+)%/i,s);return {lvl:r>1.5?"med":"low",msg:`Late interest ${r}% per month (≈${Math.round(r*12)}% per year)`};}},
 {k:"Unlimited liability",re:/liabilit[^.]*unlimited|unlimited\s+liabilit/i,f:()=>({lvl:"high",msg:"Unlimited liability on your side — playbook rejects this",pb:["playbook","P1"]})},
 {k:"Uncapped indemnity",re:/indemnif[^.]*(without limit|all claims)/i,f:()=>({lvl:"high",msg:"Indemnity without any cap — playbook rejects uncapped indemnities",pb:["playbook","P4"]})},
 {k:"Asymmetric termination",re:/may terminate[^.]*at any time/i,f:s=>({lvl:"high",msg:`Other party can terminate at any time${num(/(\d+)\s+days/,s)?` on ${num(/(\d+)\s+days/,s)} days' notice`:""}; your exit is restricted`})},
 {k:"Assignment without consent",re:/assign[^.]*without[^.]*consent/i,f:()=>({lvl:"med",msg:"Contract can be assigned to a third party without your consent"})},
 {k:"International data transfer",re:/transfer[^.]*any country/i,f:()=>({lvl:"high",msg:"Personal data may be transferred to any country — checklist requires prior approval",pb:["dpa-memo","D3"]})},
 {k:"Confidentiality",re:/confidential/i,f:s=>{const y=num(/(\d+)\s+years?/,s);return {lvl:"low",msg:`Confidentiality${y?` for ${y} years`:" clause present"}`};}}
];
function analyze(doc){
  const found=[]; const full=doc.sections.map(s=>s.t+" "+s.h).join(" ");
  RULES.forEach(r=>{ const s=doc.sections.find(x=>r.re.test(x.h+". "+x.t)); if(s){ const sent=E.sentences(s.t).find(x=>r.re.test(x))||E.sentences(s.t)[0]; const o=r.f(s.t); found.push({k:r.k,sec:s,sent,...o}); }});
  if(!/governed by|governing law|jurisdiction/i.test(full)) found.push({k:"Governing law",sec:null,lvl:"med",msg:"Missing — no governing law or jurisdiction clause found",pb:["playbook","P3"]});
  if(/personal data/i.test(full)&&!/breach/i.test(full)) found.push({k:"Breach notification",sec:null,lvl:"med",msg:"Missing — personal data is processed but no breach notification duty (checklist requires 72 hours)",pb:["dpa-memo","D1"]});
  if(!/liabilit/i.test(full)) found.push({k:"Liability cap",sec:null,lvl:"med",msg:"Missing — no limitation of liability clause found",pb:["playbook","P1"]});
  const ord={high:0,med:1,low:2}; return found.sort((a,b)=>ord[a.lvl]-ord[b.lvl]);
}
function loadText(name,text){
  const sections=chunkText(text);
  UPLOAD_DOC={id:"upload",title:name,parties:"Your uploaded file · read locally, never uploaded",file:"local://"+name,type:"Uploaded",sections};
  UPIX=new E.Index(sections.map(s=>({...s,docId:"upload",docShort:"Doc",docTitle:name})));
  const f=analyze(UPLOAD_DOC); const cnt=l=>f.filter(x=>x.lvl===l).length;
  $("#anOut").innerHTML=`<div class="an-head"><div><b>${esc(name)}</b><div class="note" style="margin:2px 0 0">${sections.length} clauses detected · ${f.length} findings · analysed in your browser</div></div><div class="score"><span class="risk high">${cnt("high")} high</span><span class="risk med">${cnt("med")} medium</span><span class="risk low">${cnt("low")} low</span></div></div>
  <table class="cl-table"><thead><tr><th>Clause</th><th>Finding</th><th>Risk</th></tr></thead><tbody>${f.map((x,i)=>{const cid=x.sec?cite("upload",x.sec.ref,[x.sent]):null; const pb=x.pb?cite(x.pb[0],x.pb[1],[]):null;
    return `<tr data-cid="${cid===null?"":cid}"><td><b>${esc(x.k)}</b><div class="ex">${x.sec?esc(x.sec.ref):"—"}</div></td><td>${esc(x.msg)}${x.sent?`<div class="ex">“${esc(x.sent.slice(0,140))}${x.sent.length>140?"…":""}”</div>`:""}${pb!==null?`<div style="margin-top:4px">${citeBtn(pb,"Rule: "+DOCS[x.pb[0]].short+" "+x.pb[1])}</div>`:""}</td><td><span class="risk ${x.lvl}">${x.lvl==="med"?"medium":x.lvl}</span></td></tr>`;}).join("")}</tbody></table>
  <div class="draft-actions"><button class="btn btn-ghost btn-sm" type="button" id="dlReport">Download risk report (.txt)</button></div>`;
  $$("#anOut tr[data-cid]").forEach(tr=>tr.addEventListener("click",e=>{ if(e.target.closest(".cite")) return; const c=tr.dataset.cid; if(c!==""){const r=CITES[+c]; openDoc(r.docId,r.ref,r.hl,true);} }));
  $("#dlReport").addEventListener("click",()=>download(name.replace(/\.\w+$/,"")+"-risk-report.txt",`Risk report — ${name}\nGenerated locally by Nyyo Legal demo. Not legal advice; human review required.\n\n`+f.map(x=>`[${x.lvl.toUpperCase()}] ${x.k}${x.sec?" ("+x.sec.ref+")":""}: ${x.msg}${x.sent?"\n    \""+x.sent+"\"":""}`).join("\n\n"),"text/plain"));
  const chips=$("#anChips"); chips.hidden=false; $("#anThread").hidden=false; $("#anForm").hidden=false; $("#anThread").innerHTML="";
  if(!chips.dataset.bound){ chips.dataset.bound=1; chips.addEventListener("click",e=>{const b=e.target.closest("button[data-q]"); if(b) ask(b.dataset.q,"#anThread",UPIX,true);}); }
  const qs=name===window.SAMPLE_UPLOAD.name?["How much notice does the supplier need to terminate?","Can the supplier change its prices?","How long does confidentiality last?","Which law governs this agreement?"]:["What is the termination notice?","Is there a liability cap?","How long does confidentiality last?","Which law governs this agreement?"];
  chips.innerHTML=qs.map(q=>`<button type="button" data-q="${esc(q)}">${esc(q)}</button>`).join("");
  openDoc("upload",f[0]&&f[0].sec?f[0].sec.ref:null,f[0]&&f[0].sent?[f[0].sent]:[],false);
}
$("#anForm").addEventListener("submit",e=>{e.preventDefault();const q=$("#anInput").value.trim(); if(q&&UPIX){ask(q,"#anThread",UPIX,true);$("#anInput").value="";}});

/* ---------- Draft ---------- */
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmt=d=>`${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const iso=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const pd=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const addDays=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
const addMonths=(d,n)=>new Date(d.getFullYear(),d.getMonth()+n,d.getDate());
const today=new Date(); today.setHours(0,0,0,0);
function parseDateText(s){const m=s.match(/(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/);return m?new Date(+m[3],MONTHS.indexOf(m[2]),+m[1]):null;}
function C(docId,ref,phrase){const s=sec(docId,ref); const hl=phrase?E.sentences(s.t).filter(x=>x.toLowerCase().includes(phrase.toLowerCase())):[]; return {cid:cite(docId,ref,hl.length?hl:E.sentences(s.t).slice(0,1)),label:DOCS[docId].short+" "+ref};}
const TPL=[
 {id:"term",t:"Termination notice",s:"MSA · for convenience",fields:[["date","Date of notice","date",iso(today)],["from","Sender","text","Brightfield Retail Group"],["sign","Signatory","text","[Name], General Counsel"]],
  build(v){const s91=sec("msa","§9.1").t; const days=num(/(\d+) days/,s91); const d=pd(v.date); const eff=addDays(d,days); const a=C("msa","§9.1","convenience"),b=C("msa","§14.2","registered mail"),c=C("msa","§11.3","processor"),f=C("msa","§9.1","payable");
   return {checks:[["ok",`Notice period extracted from MSA §9.1: ${days} days → end date ${fmt(eff)}`],["ok","Delivery method extracted from MSA §14.2"]],
   body:`${esc(v.from)}\n${fmt(d)}\n\nTo: Aldermoor Systems Ltd — legal@aldermoor.example\nSent by registered mail and by email ${R(b)}\n\nSubject: Notice of termination for convenience — Master Services Agreement\n\nDear Sir or Madam,\n\nIn accordance with section 9.1 of the Master Services Agreement ${R(a)}, ${esc(v.from)} hereby gives you ${days} days' written notice of termination for convenience. The Agreement will therefore end on ${fmt(eff)}.\n\nFees for Services performed up to that date remain payable ${R(f)}. Please send your final invoice after the termination date.\n\nAs processor of our personal data under Annex 2 ${R(c)}, please confirm how Client personal data will be returned or deleted at the end of the Agreement.\n\nYours faithfully,\n\n${esc(v.sign)}\n${esc(v.from)}`};}},
 {id:"nonrenew",t:"Non-renewal notice",s:"MSA · stop auto-renewal",fields:[["start","MSA effective date","date","2025-03-01"],["date","Date of notice","date",iso(today)],["sign","Signatory","text","[Name], General Counsel"]],
  build(v){const s=sec("msa","§3.1").t; const term=num(/initial term of (\d+) months/,s), nd=num(/at least (\d+) days/,s); const st=pd(v.start), nd0=pd(v.date); let end=addDays(addMonths(st,term),-1); let g=0; while(addDays(end,-nd)<nd0&&g++<10) end=addDays(addMonths(addDays(end,1),12),-1); const firstEnd=addDays(addMonths(st,term),-1); const rolled=end>firstEnd; const dl=addDays(end,-nd); const ok=nd0<=dl; const a=C("msa","§3.1","non-renewal"),b=C("msa","§14.2","registered mail"),p=C("playbook","P2","Diarise");
   return {checks:[[ok?"ok":"ko",`Initial term ${term} months (MSA §3.1) · term ending ${fmt(end)} · notice deadline (${nd} days before): ${fmt(dl)} — ${ok?"notice is in time":"too late"}`]].concat(rolled?[["warn",`The deadline for the initial term (${fmt(addDays(firstEnd,-nd))}) has passed: the MSA renews for 12 months, so this notice ends it on ${fmt(end)}`]]:[]),
   body:`Brightfield Retail Group\n${fmt(pd(v.date))}\n\nTo: Aldermoor Systems Ltd — legal@aldermoor.example ${R(b)}\n\nSubject: Notice of non-renewal — Master Services Agreement\n\nDear Sir or Madam,\n\nUnder section 3.1 of the Master Services Agreement ${R(a)}, the Agreement renews automatically unless either party gives written notice of non-renewal at least ${nd} days before the end of the current term.\n\nWe hereby give notice that we do not wish to renew the Agreement. It will therefore end at the close of the current term on ${fmt(end)}.\n\nInternal note (remove before sending): deadline diarised per playbook P2 ${R(p)}.\n\nYours faithfully,\n\n${esc(v.sign)}`};}},
 {id:"lease",t:"Lease break notice",s:"Lease · tenant break option",fields:[["date","Date of notice","date",iso(today)],["sign","Signatory","text","[Name], Director"]],
  build(v){const s=sec("lease","§9").t; const brk=parseDateText(s); const m=num(/at least (\d+) months/,s); const dl=addMonths(brk,-m); const ok=pd(v.date)<=dl; const a=C("lease","§9","break"),r=C("lease","§4.1","payable"),dep=C("lease","§5","returns");
   return {checks:[[ok?"ok":"ko",`Break date ${fmt(brk)} · notice needed at least ${m} months before → latest ${fmt(dl)} — ${ok?"in time":"too late for this break date"}`],["warn","Condition: rent must be fully paid on the break date"]],
   body:`Aldermoor Systems Ltd\n${fmt(pd(v.date))}\n\nTo: Orchard Estates Ltd (Landlord)\n\nSubject: Exercise of tenant break option — Unit 4B, Harbour Point Business Park\n\nDear Sir or Madam,\n\nUnder section 9 of the lease ${R(a)}, we hereby give you notice that we will end the lease on ${fmt(brk)}, at the end of the third year. This notice is given at least ${m} months before that date.\n\nWe confirm that rent will be fully paid up to the break date ${R(r)}. We look forward to the return of the security deposit within 2 months after we leave the premises ${R(dep)}.\n\nYours faithfully,\n\n${esc(v.sign)}\nAldermoor Systems Ltd`};}},
 {id:"nc",t:"Non-compete clause",s:"Checked against the Act",fields:[["months","Duration (months)","number","6"],["pct","Compensation (% of salary)","number","50"],["area","Geographic area","text","the Westmark region"]],
  build(v){const law=sec("act-employment","Sec. 18").t; const max=num(/no more than (\d+) months/,law), min=num(/at least (\d+)%/,law); const mo=+v.months, pc=+v.pct; const a=C("act-employment","Sec. 18","valid only"),e=C("employment","§12","compensation");
   return {checks:[[mo<=max&&mo>0?"ok":"ko",`Duration ${mo} months ${mo<=max?"≤":">"} ${max}-month maximum (Act Sec. 18)`],[pc>=min?"ok":"ko",`Compensation ${pc}% ${pc>=min?"≥":"<"} ${min}% minimum (Act Sec. 18)`],[v.area.trim()?"ok":"ko","Geographic area defined"]],
   body:`Non-compete\n\n1. For ${mo} months after the employment ends, the Employee will not work, directly or indirectly, for a direct competitor of the Employer within ${esc(v.area)} ${R(a)}.\n\n2. This restriction protects the Employer's legitimate business interest in its client relationships and confidential methods [to be described].\n\n3. During this period the Employer pays the Employee a monthly compensation equal to ${pc}% of the Employee's last gross monthly salary ${R(e)}.\n\n4. The Employer may waive this clause in writing at the latest on the Employee's last working day, in which case no compensation is due ${R(e)}.`};}},
 {id:"liab",t:"Limitation of liability",s:"Aligned with our playbook",fields:[["months","Cap (months of fees)","number","12"]],
  build(v){const m=+v.months; const p=C("playbook","P1","cap"),a=C("msa","§8.1","capped"),ex=C("msa","§8.1","does not apply");
   const lvl=m>=12?["ok",`Cap of ${m} months meets the playbook position (≥ 12 months)`]:m>=6?["warn",`Cap of ${m} months is below the 12-month position — needs partner approval`]:["ko",`Cap of ${m} months is below the 6-month floor — playbook says never accept`];
   return {checks:[lvl],body:`Limitation of liability\n\n1. Each party's total liability under this Agreement is capped at the total fees paid by the Client in the ${m} months before the event giving rise to the claim ${R(a)} ${R(p)}.\n\n2. The cap does not apply to gross negligence, wilful misconduct, breach of confidentiality or the Client's payment obligations ${R(ex)}.\n\n3. Neither party is liable for indirect or consequential loss, including lost profits ${R(ex)}.`};}},
 {id:"late",t:"Late payment reminder",s:"MSA · interest computed",fields:[["inv","Invoice no.","text","INV-2026-118"],["amount","Amount","number","12500"],["due","Due date","date",iso(addDays(today,-40))]],
  build(v){const s=sec("msa","§5.2").t; const rate=num(/interest at ([\d.]+)%/,s), susp=num(/unpaid (\d+) days/,s); const days=Math.max(0,Math.round((today-pd(v.due))/864e5)); const amt=+v.amount; const intr=amt*rate/100*days/30; const a=C("msa","§5.2","Late payments"),b=C("msa","§5.2","suspend"),st=C("act-commercial","Art. 21","recovery fee");
   return {checks:[["ok",`${days} days late · interest ${rate}% per month (MSA §5.2) ≈ ${intr.toFixed(2)}`],[days>susp?"warn":"ok",days>susp?`More than ${susp} days late: suspension right under §5.2 is available (mention only if intended)`:`Suspension right starts after ${susp} days late`]],
   body:`Aldermoor Systems Ltd\n${fmt(today)}\n\nTo: Brightfield Retail Group — Accounts Payable\n\nSubject: Payment reminder — invoice ${esc(v.inv)}\n\nDear Sir or Madam,\n\nOur invoice ${esc(v.inv)} for ${amt.toLocaleString("en-US",{minimumFractionDigits:2})} was due on ${fmt(pd(v.due))} and remains unpaid (${days} days late).\n\nUnder section 5.2 of the Master Services Agreement, late payments bear interest at ${rate}% per month from the due date until payment in full ${R(a)}. Accrued interest to date is approximately ${intr.toFixed(2)}.${days>susp?`\n\nWe also remind you that the Services may be suspended if an undisputed invoice remains unpaid ${susp} days after the due date ${R(b)}.`:""}\n\nThe contract rate applies instead of the statutory rate, which only applies where the contract does not set a higher rate ${R(st)}.\n\nPlease arrange payment within 8 days.\n\nYours faithfully,\n\nAccounts Receivable\nAldermoor Systems Ltd`};}}
];
let ACTIVE=null, LAST="";
function R(c){return citeBtn(c.cid,"["+c.label+"]");}
$("#tplGrid").innerHTML=TPL.map(t=>`<button type="button" class="tpl" data-t="${t.id}">${esc(t.t)}<small>${esc(t.s)}</small></button>`).join("");
$("#tplGrid").addEventListener("click",e=>{const b=e.target.closest(".tpl"); if(b) pickTpl(b.dataset.t);});
function pickTpl(id){
  ACTIVE=TPL.find(t=>t.id===id); $$(".tpl").forEach(b=>b.classList.toggle("on",b.dataset.t===id));
  $("#draftArea").innerHTML=`<div class="fields">${ACTIVE.fields.map(([k,l,ty,d])=>`<label>${esc(l)}<input data-k="${k}" type="${ty}" value="${esc(d)}" ${ty==="number"?'min="0"':""}></label>`).join("")}</div><div class="validation" id="valid"></div><div class="doc-out" id="docOut" aria-live="polite"></div><div class="draft-actions"><button class="btn btn-primary btn-sm" type="button" id="cp">Copy</button><button class="btn btn-ghost btn-sm" type="button" id="dlDoc">Download .doc</button><button class="btn btn-ghost btn-sm" type="button" id="dlTxt">Download .txt</button></div><div class="note">Built only from the cited passages of your corpus. Draft for review by a qualified professional — not legal advice.</div>`;
  $$("#draftArea input").forEach(i=>i.addEventListener("input",renderDraft));
  $("#cp").addEventListener("click",()=>{navigator.clipboard&&navigator.clipboard.writeText(LAST).then(()=>toast("Copied")).catch(()=>toast("Copy blocked by browser"));});
  $("#dlTxt").addEventListener("click",()=>download(ACTIVE.id+"-draft.txt",LAST,"text/plain"));
  $("#dlDoc").addEventListener("click",()=>download(ACTIVE.id+"-draft.doc",`<html><head><meta charset="utf-8"></head><body style="font-family:Georgia,serif;white-space:pre-wrap">${esc(LAST)}</body></html>`,"application/msword"));
  renderDraft();
}
function renderDraft(){
  const v={}; $$("#draftArea input").forEach(i=>v[i.dataset.k]=i.value||"");
  let out; try{ out=ACTIVE.build(v);}catch(e){ $("#docOut").textContent="Please fill all fields."; return; }
  $("#valid").innerHTML=out.checks.map(([k,m])=>`<div class="${k==="ok"?"ok":k==="ko"?"ko":""}">${k==="ok"?"✅":k==="ko"?"⛔":"⚠️"} ${esc(m)}</div>`).join("");
  $("#docOut").innerHTML=out.body;
  const tmp=document.createElement("div"); tmp.innerHTML=out.body.replace(/<button[^>]*>(\[[^\]]+\])<\/button>/g,"$1"); LAST=tmp.textContent;
}
function download(name,content,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
pickTpl("term");

/* ---------- Intro + reveal ---------- */
const io="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.12}):null;
$$(".reveal").forEach(el=>io?io.observe(el):el.classList.add("in"));
addMsg("#thread","bot",`<div class="who">Nyyo Legal <span class="t">· closed corpus ready · 9 files · ${chunks.length} sections indexed</span></div><p>Ask anything about the sample contracts, memos and model laws. I answer <b>only</b> from these files and cite the exact clause — click a citation to open it on the right.</p>`);
window.NYYO_TEST={ask:(q)=>E.answer(IX,q,{}),chips:ASK_CHIPS,off:OFF_CHIP};
})();
