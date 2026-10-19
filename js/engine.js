/* Nyyo Legal — tiny closed-corpus retrieval engine (BM25 + extractive answers). No network. */
(function(){
const STOP=new Set("a an the of to in on for and or is are was be by with as at from that this it its what which who whom when where how does do did can could may might shall should will would there their our your my any all each under than then into about after before between up out not no if per vs versus please tell me show list give us we they them".split(" "));
const SYN={terminat:["end","cancel","notic"],end:["terminat"],cancel:["terminat"],quit:["terminat","break"],break:["terminat","break"],renew:["renew","automat","non-renew"],automat:["renew"],cap:["cap","limit","liabil"],liabil:["liabil","cap"],limit:["cap","liabil"],late:["late","interest","overdu"],overdu:["late"],interest:["interest","late"],breach:["breach","notif"],notif:["notifi","breach"],"non-compet":["non-compet","compet"],noncompet:["non-compet","compet"],compet:["non-compet","compet"],enforc:["valid","limit"],valid:["valid","enforc"],confidenti:["confidenti","durat"],durat:["durat","last","year"],long:["durat","last","year","month"],last:["durat","year","month"],rent:["rent"],deposit:["deposit"],leav:["leav","holiday"],holiday:["leav"],remot:["remot"],law:["govern","law"],jurisdict:["govern","court"],govern:["govern","law"],assign:["assign"],indemn:["indemn"],subprocessor:["sub-processor","processor"],"sub-processor":["sub-processor"],gdpr:["data","personal","processor"],"72":["72"],notice:["notic"],notic:["notic"],playbook:["playbook","posit"],price:["price","prices"],pay:["payment","payabl"],payment:["payment","payabl"]};
function stem(w){
  w=w.toLowerCase();
  if(/^\d/.test(w)) return w;
  const rules=[["ational","at"],["izations","iz"],["ization","iz"],["ations","at"],["ation","at"],["ities","iti"],["ity","iti"],["ments","ment"],["ness",""],["ings",""],["ing",""],["ies","i"],["ied","i"],["edly",""],["ed",""],["es","e"],["s",""],["ly",""],["e",""]];
  for(const [suf,rep] of rules){ if(w.length>suf.length+2 && w.endsWith(suf)){ w=w.slice(0,-suf.length)+rep; break; } }
  if(w.startsWith("terminat")) return "terminat";
  if(w.startsWith("confidenti")) return "confidenti";
  if(w.startsWith("notic")) return "notic";
  if(w.startsWith("notif")) return "notif";
  if(w.startsWith("liabil")) return "liabil";
  if(w.startsWith("indemn")) return "indemn";
  if(w.startsWith("automat")) return "automat";
  if(w.startsWith("renew")) return "renew";
  if(w.startsWith("compet")) return "compet";
  if(w.startsWith("enforc")) return "enforc";
  if(w.startsWith("assign")) return "assign";
  if(w.startsWith("govern")) return "govern";
  if(w.startsWith("payabl")) return "payabl";
  return w;
}
function tokens(text){
  return (text.toLowerCase().replace(/non[\s-]compete?s?/g," non-compet ").replace(/sub[\s-]processors?/g," sub-processor ").match(/[a-z0-9][a-z0-9\-]*/g)||[]).filter(t=>!STOP.has(t)&&t.length>1||/^\d+$/.test(t)).map(stem);
}
function sentences(t){ return t.split(/(?<=[.!?])\s+(?=[A-Z0-9(])/).map(s=>s.trim()).filter(Boolean); }

class Index{
  constructor(chunks){
    this.chunks=chunks; this.N=chunks.length; this.df={}; this.len=[];
    this.tf=chunks.map(c=>{const tk=tokens(c.h+" "+c.h+" "+c.t+" "+(c.docShort||"")); this.len.push(tk.length); const m={}; tk.forEach(x=>m[x]=(m[x]||0)+1); Object.keys(m).forEach(k=>this.df[k]=(this.df[k]||0)+1); return m;});
    this.avg=this.len.reduce((a,b)=>a+b,0)/Math.max(1,this.N);
  }
  expand(q){
    const base=tokens(q); const out=new Map();
    base.forEach(t=>{out.set(t,Math.max(out.get(t)||0,1)); (SYN[t]||[]).forEach(s=>{const st=stem(s); if(!out.has(st)) out.set(st,.45);});});
    return out;
  }
  search(q,boost){
    const terms=this.expand(q), k1=1.4, b=.72;
    return this.chunks.map((c,i)=>{
      let s=0;
      terms.forEach((w,t)=>{const f=this.tf[i][t]; if(!f) return; const idf=Math.log(1+(this.N-(this.df[t]||0)+.5)/((this.df[t]||0)+.5)); s+=w*idf*(f*(k1+1))/(f+k1*(1-b+b*this.len[i]/this.avg));});
      if(boost&&boost[c.docId]) s*=boost[c.docId];
      return {c,i,s};
    }).sort((a,b)=>b.s-a.s);
  }
}
function bestSentences(text,q,max){
  const qt=new Set(tokens(q)); const ex=new Set(); qt.forEach(t=>(SYN[t]||[]).forEach(s=>ex.add(stem(s))));
  const ss=sentences(text).map((s,i)=>{const tk=tokens(s); let sc=0; tk.forEach(t=>{if(qt.has(t))sc+=1;else if(ex.has(t))sc+=.4;}); if(/\d/.test(s)) sc+=.25; return {s,i,sc};});
  const top=ss.slice().sort((a,b)=>b.sc-a.sc).slice(0,max).filter((x,j)=>j===0||x.sc>=1).sort((a,b)=>a.i-b.i);
  return top.map(x=>x.s);
}
function facts(s){
  const out=[]; const re=/(\d+(?:[.,]\d+)?\s?(?:%|percent(?:age points)?|(?:working )?days?'?|weeks?'?|months?'?|years?|hours?))|(\b\d{1,3}(?:,\d{3})+\b)/gi; let m;
  while((m=re.exec(s))) out.push(m[0].replace(/'$/,""));
  return [...new Set(out)].slice(0,4);
}
function docBoost(q){
  const b={}; const ql=q.toLowerCase();
  if(/nda\s*a\b|mutual nda/.test(ql)) b["nda-a"]=1.8;
  if(/nda\s*b\b|one-way nda/.test(ql)) b["nda-b"]=1.8;
  if(/\bndas?\b/.test(ql)&&!b["nda-a"]&&!b["nda-b"]){b["nda-a"]=1.5;b["nda-b"]=1.5;}
  if(/\bmsa\b|services agreement|master services/.test(ql)) b["msa"]=1.8;
  if(/\blease|tenant|landlord|rent\b/.test(ql)) b["lease"]=1.8;
  if(/employ|employee|engineer|probation/.test(ql)) {b["employment"]=1.6;}
  if(/statute|\bact\b|\blaw\b|legal|enforceable|valid/.test(ql)) {b["act-employment"]=1.5;b["act-commercial"]=1.5;}
  if(/playbook|our position|we accept/.test(ql)) b["playbook"]=2.2;
  if(/checklist|dpa\b|data processing/.test(ql)) b["dpa-memo"]=1.6;
  return b;
}
function answer(index,q,opts){
  opts=opts||{}; const maxDocs=opts.maxDocs||3;
  const res=index.search(q,opts.noBoost?null:docBoost(q));
  const top=res[0]; const MIN=opts.min||4;
  const base=[...new Set(tokens(q))];
  let cov=0;
  if(top){ const tf=index.tf[top.i]; let hit=0; base.forEach(t=>{ if(tf[t]||(SYN[t]||[]).some(x=>tf[stem(x)])) hit++; }); cov=base.length?hit/base.length:0; }
  if(!top||top.s<MIN||cov<(opts.cov||.4)) return {refused:true,items:[],top:top?top.s:0,cov};
  const picked=[]; const seen=new Set();
  for(const r of res){ if(r.s<top.s*(opts.ratio||.5)) break; if(seen.has(r.c.docId)) continue; seen.add(r.c.docId); picked.push(r); if(picked.length>=maxDocs) break; }
  const items=picked.map(r=>{const sents=bestSentences(r.c.t,q,2); return {chunk:r.c,score:r.s,sentences:sents,facts:facts(sents.join(" "))};});
  return {refused:false,items,top:top.s,cov};
}
window.NyyoEngine={Index,answer,tokens,sentences,facts,bestSentences};
})();
