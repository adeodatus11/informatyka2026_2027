// Czysta logika symulatora projektu kwerendy (Access, symulacja): parser kryteriów, wykonanie
// kwerendy, podsumowania (Σ), parametry, poglądowy SQL i sprawdzanie zleceń.
// Zbiór danych (tabele, relacje, zlecenia) wybiera aktywność przez data.dataset:
// 'stomatolog' (domyślny, lekcje 11 i 26) albo 'zawody' (lekcja 25). Funkcje przyjmują
// opcjonalny zbiór danych jako ostatni argument; bez niego działają na „Stomatologu”.
import * as S from './stomatolog-data.js';
import {addDays,isValidISODate} from './stomatolog-data.js';
import {zawodyQueries} from './queryDesigner-zawody.js';

export class QueryError extends Error{constructor(message,hint='',where=null){super(message);this.hint=hint;this.where=where;}}
export const SYNTAX='Wyrażenie wpisane zawiera nieprawidłową składnię.';
export const MISMATCH='Niezgodność typów danych w wyrażeniu kryterium.';
export const CRIT_ROWS=3; // Kryteria + 2 × lub
export const totalsOptions=[['group','Grupuj według'],['sum','Suma'],['avg','Średnia'],['min','Min'],['max','Maks'],['count','Policz'],['where','Gdzie']];
const aggNames={sum:'Suma',avg:'Średnia',min:'Min',max:'Maks',count:'Policz'};
const aggSQL={sum:'Sum',avg:'Avg',min:'Min',max:'Max',count:'Count'};

export const allFields=(ds)=>Object.entries(dataset(ds).fieldTypes).flatMap(([t,f])=>Object.keys(f).map(x=>`${t}.${x}`));
export const fieldType=(key,ds)=>{const ft=dataset(ds).fieldTypes;const [t,f]=key.split('.');return ft[t]?.[f]==='autonumber'?'number':ft[t]?.[f];};
export const emptyColumn=()=>({field:'',sort:'',show:true,crit:Array(CRIT_ROWS).fill(''),total:'group'});
export const emptyQuery=()=>({tables:[],cols:[],totals:false});

// ---------- Parser kryteriów (składnia polskiego Accessa) ----------
const KW={'między':'between',between:'between',i:'and',and:'and',lub:'or',or:'or',nie:'not',not:'not',jak:'like',like:'like',jest:'is',is:'is',null:'null'};
function parseDateText(s){
 s=s.trim();let m=/^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
 if(m){const iso=`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;return isValidISODate(iso)?iso:null;}
 m=/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
 if(m){const iso=`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;return isValidISODate(iso)?iso:null;}
 return null;
}
function tokenize(src){
 const out=[];let i=0;
 while(i<src.length){
  const c=src[i];
  if(/\s/.test(c)){i++;continue;}
  if(c==='"'||c==='„'||c==='”'||c==='“'){
   let j=i+1,v='';while(j<src.length&&!'"”“'.includes(src[j]))v+=src[j++];
   if(j>=src.length)throw new QueryError(SYNTAX,'Brakuje zamykającego cudzysłowu. Tekst wpisuj w parze cudzysłowów, np. "Wrocław".');
   out.push({k:'str',v});i=j+1;continue;
  }
  if(c==='#'){
   const j=src.indexOf('#',i+1);if(j<0)throw new QueryError(SYNTAX,'Datę zamknij między dwoma znakami #, np. #2026-10-07#.');
   const d=parseDateText(src.slice(i+1,j));if(!d)throw new QueryError(SYNTAX,`„${src.slice(i+1,j)}” to nie jest poprawna data. Użyj zapisu #RRRR-MM-DD#, np. #2026-10-07#.`);
   out.push({k:'date',v:d});i=j+1;continue;
  }
  if(c==='['){
   const j=src.indexOf(']',i+1);if(j<0)throw new QueryError(SYNTAX,'Parametr zamknij nawiasem kwadratowym, np. [Podaj nazwisko pacjenta:].');
   const v=src.slice(i+1,j).trim();if(!v)throw new QueryError(SYNTAX,'W nawiasie kwadratowym wpisz pytanie, które zobaczy użytkownik, np. [Podaj datę:].');
   out.push({k:'param',v});i=j+1;continue;
  }
  if(c===']')throw new QueryError(SYNTAX,'Nawias ] bez otwierającego [.');
  const op=/^(<=|>=|<>|=|<|>|\(|\)|\+|-|&)/.exec(src.slice(i));
  if(op&&!(op[1]==='-'&&false)){
   if(!/[0-9A-Za-zÀ-ž*?]/.test(c)){out.push({k:'op',v:op[1]});i+=op[1].length;continue;}
  }
  const w=/^[0-9A-Za-zÀ-ž*?.,@_][0-9A-Za-zÀ-ž*?.,@_\-]*/.exec(src.slice(i));
  if(!w)throw new QueryError(SYNTAX,`Nieoczekiwany znak „${c}”.`);
  const word=w[0],low=word.toLowerCase();
  if(KW[low])out.push({k:'kw',v:KW[low],raw:word});
  else if(/^\d+([.,]\d+)?$/.test(word))out.push({k:'num',v:Number(word.replace(',','.'))});
  else if(parseDateText(word))out.push({k:'date',v:parseDateText(word)});
  else out.push({k:'word',v:word});
  i+=word.length;
 }
 return out;
}
export function parseCriterion(src){
 const tokens=tokenize(String(src));let p=0;
 if(!tokens.length)return null;
 const peek=()=>tokens[p],next=()=>tokens[p++];
 const isKw=v=>peek()?.k==='kw'&&peek().v===v;
 const isOp=v=>peek()?.k==='op'&&peek().v===v;
 function value(){
  const parts=[atom()];
  while(isOp('&')){next();parts.push(atom());}
  return parts.length>1?{t:'concat',parts}:parts[0];
 }
 function atom(){
  const t=next();
  if(!t)throw new QueryError(SYNTAX,'Po operatorze brakuje wartości, np. >300.');
  if(t.k==='str')return {t:'str',v:t.v};
  if(t.k==='num')return {t:'num',v:t.v};
  if(t.k==='date')return {t:'date',v:t.v};
  if(t.k==='param')return {t:'param',v:t.v};
  if(t.k==='op'&&t.v==='-'&&peek()?.k==='num')return {t:'num',v:-next().v};
  if(t.k==='word'&&/^date$/i.test(t.v)&&isOp('(')){
   next();if(!isOp(')'))throw new QueryError(SYNTAX,'Funkcja Date() nie ma argumentów — wpisz Date().');next();
   let off=0;if(isOp('+')||isOp('-')){const sign=next().v==='+'?1:-1;const n=next();if(n?.k!=='num')throw new QueryError(SYNTAX,'Po Date()+ wpisz liczbę dni, np. Date()+1.');off=sign*n.v;}
   return {t:'today',off};
  }
  if(t.k==='word')return {t:'word',v:t.v};
  if(t.k==='kw')throw new QueryError(SYNTAX,`Słowo „${t.raw}” stoi w złym miejscu. Przykłady: Między #2026-10-05# I #2026-10-09#, Jak "K*", Jest Null.`);
  throw new QueryError(SYNTAX,`Nieoczekiwany znak „${t.v}”.`);
 }
 function pred(){
  if(isKw('is')){next();let neg=false;if(isKw('not')){next();neg=true;}if(!isKw('null'))throw new QueryError(SYNTAX,'Po „Jest” wpisz Null albo Nie Null, np. Jest Null.');next();return {t:'null',neg};}
  if(isKw('between')){next();const lo=value();if(!isKw('and'))throw new QueryError(SYNTAX,'W „Między” brakuje „I”: Między #2026-10-05# I #2026-10-09#.');next();const hi=value();return {t:'between',lo,hi};}
  if(isKw('like')){next();return {t:'like',v:value()};}
  if(peek()?.k==='op'&&['=','<>','<','>','<=','>='].includes(peek().v)){const op=next().v;return {t:'cmp',op,v:value()};}
  if(isKw('null')){next();return {t:'null',neg:false,eq:true};}
  const v=value();
  if(v.t==='word'&&/[*?]/.test(v.v))return {t:'like',v:{t:'str',v:v.v}}; // Access sam zamienia K* na Jak "K*"
  return {t:'cmp',op:'=',v};
 }
 function not(){if(isKw('not')){next();return {t:'not',a:not()};}return pred();}
 function and(){let a=not();while(isKw('and')){next();a={t:'and',a,b:not()};}return a;}
 function or(){let a=and();while(isKw('or')){next();a={t:'or',a,b:and()};}return a;}
 const ast=or();
 if(p<tokens.length){const t=tokens[p];throw new QueryError(SYNTAX,t.k==='word'||t.k==='str'?'Za dużo wartości w jednym kryterium. Tekst ze spacją wpisz w cudzysłowie, a kilka warunków połącz słowem Lub albo I.':`Nieoczekiwane „${t.raw||t.v}”. Sprawdź kolejność: najpierw operator, potem wartość, np. >300.`);}
 return ast;
}
export function criterionParams(ast,out=[]){
 if(!ast||typeof ast!=='object')return out;
 if(ast.t==='param'&&!out.includes(ast.v))out.push(ast.v);
 for(const k of ['a','b','v','lo','hi'])if(ast[k])criterionParams(ast[k],out);
 if(ast.parts)ast.parts.forEach(x=>criterionParams(x,out));
 return out;
}

// ---------- Wartości i porównania ----------
const likeRe=pat=>new RegExp('^'+pat.replace(/[.+^${}()|\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.').replace(/#/g,'\\d')+'$','is');
function mismatch(type,field,ctx){
 if(type==='number'&&ctx?.numberHint)return new QueryError(MISMATCH,ctx.numberHint(field));
 const hints={number:`Pole ${field} jest liczbą — wpisz samą liczbę, np. >300 (bez „zł” i bez cudzysłowu).`,date:`Pole ${field} przechowuje daty — wpisz datę w znakach #, np. #2026-10-07#.`,datetime:`Pole ${field} przechowuje datę i godzinę — wpisz datę w znakach #, np. #2026-10-07#, albo Jak "2026-10-07*".`,text:`Pole ${field} jest tekstem — wpisz tekst, np. "Wrocław".`};
 return new QueryError(MISMATCH,hints[type]||'');
}
function resolve(v,type,field,params,ctx){
 if(v.t==='concat')return v.parts.map(x=>String(resolve(x,'text',field,params,ctx)??'')).join('');
 if(v.t==='param'){
  const raw=params?.[v.v];if(raw==null)throw new QueryError('Brak wartości parametru.',`Kwerenda pyta o „${v.v}” — uruchom ją i wpisz wartość.`);
  if(type==='number'){if(!/^-?\d+([.,]\d+)?$/.test(String(raw).trim()))throw mismatch(type,field,ctx);return Number(String(raw).replace(',','.'));}
  if(type==='date'||type==='datetime'){const d=parseDateText(String(raw));if(!d)throw mismatch(type,field,ctx);return d;}
  return String(raw);
 }
 if(v.t==='today'){if(type!=='date'&&type!=='datetime')throw mismatch(type,field,ctx);return addDays(ctx?.today||S.SIM_TODAY,v.off);}
 if(type==='number'){
  if(v.t==='num')return v.v;
  if((v.t==='str'||v.t==='word')&&/^-?\d+([.,]\d+)?$/.test(v.v))return Number(v.v.replace(',','.'));
  throw mismatch(type,field,ctx);
 }
 if(type==='date'||type==='datetime'){
  if(v.t==='date')return v.v;
  if(v.t==='str'&&parseDateText(v.v))return parseDateText(v.v);
  throw mismatch(type,field,ctx);
 }
 if(v.t==='date')throw mismatch(type,field,ctx);
 return String(v.v);
}
function cmp(a,b,type){
 if(type==='number')return a-b;
 if(type==='datetime')return String(a).slice(0,10).localeCompare(String(b).slice(0,10));
 if(type==='date')return String(a).localeCompare(String(b));
 return String(a).localeCompare(String(b),'pl',{sensitivity:'accent'});
}
export function evalCriterion(ast,value,type,field,params,ctx){
 switch(ast.t){
  case 'or':return evalCriterion(ast.a,value,type,field,params,ctx)||evalCriterion(ast.b,value,type,field,params,ctx);
  case 'and':return evalCriterion(ast.a,value,type,field,params,ctx)&&evalCriterion(ast.b,value,type,field,params,ctx);
  case 'not':return !evalCriterion(ast.a,value,type,field,params,ctx);
  case 'null':return ast.neg?value!=null:value==null;
  case 'between':{const lo=resolve(ast.lo,type,field,params,ctx),hi=resolve(ast.hi,type,field,params,ctx);return value!=null&&cmp(value,lo,type)>=0&&cmp(value,hi,type)<=0;}
  case 'like':{const pat=String(resolve(ast.v,'text',field,params,ctx));return value!=null&&likeRe(pat).test(String(value));}
  case 'cmp':{const b=resolve(ast.v,type,field,params,ctx);if(value==null)return false;const c=cmp(value,b,type);
   return {'=':c===0,'<>':c!==0,'<':c<0,'>':c>0,'<=':c<=0,'>=':c>=0}[ast.op];}
 }
 return false;
}

// ---------- Wykonanie kwerendy ----------
// Łączenie tabel wg relacji (INNER JOIN). Start od tabeli po stronie „wiele” (np. Wizyty, Wyniki),
// do niej dołączamy tabele po stronie „jeden”. Tabele bez relacji — iloczyn kartezjański (jak w Accessie).
function joinPlan(tbls,ds){
 const set=new Set(tbls),rels=ds.relations.filter(r=>set.has(r.one)&&set.has(r.many));
 const manyCount=t=>rels.filter(r=>r.many===t).length;
 const start=[...tbls].sort((a,b)=>manyCount(b)-manyCount(a))[0];
 if(!manyCount(start))return {start:null,steps:[],rest:tbls};
 const joined=new Set([start]),steps=[];
 let added=true;
 while(added){added=false;
  for(const r of rels){
   if(joined.has(r.many)&&!joined.has(r.one)){steps.push({table:r.one,field:r.field,side:'one',with:r.many});joined.add(r.one);added=true;}
   else if(joined.has(r.one)&&!joined.has(r.many)){steps.push({table:r.many,field:r.field,side:'many',with:r.one});joined.add(r.many);added=true;}
  }
 }
 return {start,steps,rest:tbls.filter(t=>!joined.has(t))};
}
function baseRows(tbls,ds){
 const rowsOf=t=>ds.tables[t].map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[`${t}.${k}`,v])));
 const plan=joinPlan(tbls,ds);
 if(plan.start){
  let rows=rowsOf(plan.start);
  for(const st of plan.steps)rows=rows.flatMap(r=>rowsOf(st.table).filter(x=>x[`${st.table}.${st.field}`]===r[`${st.with}.${st.field}`]).map(x=>({...r,...x})));
  return plan.rest.reduce((acc,t)=>acc.flatMap(a=>rowsOf(t).map(r=>({...a,...r}))),rows);
 }
 return tbls.reduce((acc,t)=>acc.flatMap(a=>rowsOf(t).map(r=>({...a,...r}))),[{}]);
}
export function queryParams(q){
 const out=[];
 q.cols.forEach(c=>c.crit.forEach(s=>{if(!s.trim())return;try{criterionParams(parseCriterion(s),out);}catch{}}));
 return out;
}
const colKey=c=>c.field&&(c.total&&!['group','where'].includes(c.total)?`${c.total}:${c.field}`:c.field);
function colLabel(c,cols){
 const [t,f]=c.field.split('.');
 if(c.total&&aggNames[c.total])return `${aggNames[c.total]}${f}`;
 const clash=cols.some(o=>o!==c&&o.field&&o.field!==c.field&&o.field.split('.')[1]===f);
 return clash?`${t}.${f}`:f;
}
export function validateQuery(q){
 if(!q.tables.length)throw new QueryError('Kwerenda nie ma żadnej tabeli.','Kliknij „Pokaż tabelę” i dodaj tabelę, z której chcesz pobrać dane.');
 const used=q.cols.filter(c=>c.field);
 for(const c of used){const t=c.field.split('.')[0];if(!q.tables.includes(t))throw new QueryError(`Tabela ${t} nie jest dodana do projektu.`,'Dodaj ją przyciskiem „Pokaż tabelę” albo usuń kolumnę.');}
 if(!used.some(c=>c.show&&!(q.totals&&c.total==='where')))throw new QueryError('Kwerenda musi mieć co najmniej jedno pole docelowe.','Dodaj pole do siatki i zaznacz w nim „Pokaż”.');
}
function unrelatedWarning(tbls,ds){
 if(tbls.length<2)return null;
 const plan=joinPlan(tbls,ds);
 if(plan.start&&!plan.rest.length)return null;
 const loose=plan.start?[plan.start,...plan.rest]:tbls;
 const [a,b]=loose;
 const hub=ds.order.find(t=>!tbls.includes(t)&&ds.relations.some(r=>r.many===t&&r.one===a)&&ds.relations.some(r=>r.many===t&&r.one===b));
 return `Tabele ${a} i ${b} nie są ze sobą bezpośrednio powiązane — ${hub?`bez tabeli ${hub} `:''}Access łączy każdy rekord z każdym.`;
}
export function runQuery(q,params={},dsArg){
 const ds=dataset(dsArg);
 validateQuery(q);
 const cols=q.cols.filter(c=>c.field).map(c=>({...c,total:q.totals?c.total||'group':null,type:fieldType(c.field,ds)}));
 const parsed=cols.map((c,ci)=>c.crit.map((s,ri)=>{if(!s.trim())return null;try{return parseCriterion(s);}catch(e){e.where={col:q.cols.indexOf(q.cols.filter(x=>x.field)[ci]),row:ri};throw e;}}));
 const isAgg=c=>c.total&&!['group','where'].includes(c.total);
 const test=(row,pick)=>{
  const active=[...Array(CRIT_ROWS).keys()].filter(r=>cols.some((c,ci)=>pick(c)&&parsed[ci][r]));
  if(!active.length)return true;
  return active.some(r=>cols.every((c,ci)=>!pick(c)||!parsed[ci][r]||(()=>{try{return evalCriterion(parsed[ci][r],row[isAgg(c)?`${c.total}:${c.field}`:c.field],isAgg(c)&&c.total==='count'?'number':isAgg(c)&&['sum','avg'].includes(c.total)?'number':c.type,c.field.split('.')[1],params,ds);}catch(e){e.where={col:q.cols.indexOf(q.cols.filter(x=>x.field)[ci]),row:r};throw e;}})()));
 };
 let rows=baseRows(q.tables,ds).filter(r=>test(r,c=>!isAgg(c)));
 let outCols=cols.filter(c=>c.show&&c.total!=='where');
 if(q.totals){
  const groupCols=cols.filter(c=>c.total==='group');
  const groups=new Map();
  for(const r of rows){const k=JSON.stringify(groupCols.map(c=>r[c.field]));if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);}
  if(!groupCols.length&&!groups.size)groups.set('[]',[]);
  rows=[...groups.values()].map(g=>{
   const out={};groupCols.forEach(c=>{out[c.field]=g[0]?.[c.field]??null;});
   cols.filter(isAgg).forEach(c=>{const vals=g.map(r=>r[c.field]).filter(v=>v!=null);const k=`${c.total}:${c.field}`;
    out[k]=c.total==='count'?vals.length:!vals.length?null:c.total==='sum'?vals.reduce((a,b)=>a+b,0):c.total==='avg'?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*100)/100:c.total==='min'?vals.reduce((a,b)=>cmp(a,b,c.type)<=0?a:b):vals.reduce((a,b)=>cmp(a,b,c.type)>=0?a:b);});
   return out;
  }).filter(r=>test(r,isAgg));
 }
 const sorters=cols.filter(c=>c.sort&&!(q.totals&&c.total==='where'));
 if(sorters.length){
  rows=rows.map((r,i)=>({r,i})).sort((A,B)=>{for(const c of sorters){const k=isAgg(c)?`${c.total}:${c.field}`:c.field,a=A.r[k],b=B.r[k];const type=isAgg(c)&&c.total!=='min'&&c.total!=='max'?'number':c.type;
   let d=a==null&&b==null?0:a==null?-1:b==null?1:cmp(a,b,type);if(type==='datetime'&&d===0&&a!=null&&b!=null)d=String(a).localeCompare(String(b));if(d)return c.sort==='desc'?-d:d;}return A.i-B.i;}).map(x=>x.r);
 }
 const warnings=[];
 const w=unrelatedWarning(q.tables,ds);if(w)warnings.push(w);
 return {columns:outCols.map(c=>({key:colKey(c),label:colLabel(c,cols),type:isAgg(c)?'number':c.type})),rows:rows.map(r=>outCols.map(c=>r[colKey(c)]??null)),warnings};
}

// ---------- Poglądowy SQL (Access zapisuje SQL po angielsku) ----------
function sqlValue(v){
 switch(v.t){case 'str':case 'word':return `"${v.v}"`;case 'num':return String(v.v);case 'date':return `#${v.v}#`;case 'param':return `[${v.v}]`;case 'today':return `Date()${v.off?(v.off>0?'+':'')+v.off:''}`;case 'concat':return v.parts.map(sqlValue).join(' & ');}
 return '?';
}
function sqlCrit(a,F){
 switch(a.t){
  case 'or':return `${sqlCrit(a.a,F)} Or ${sqlCrit(a.b,F)}`;
  case 'and':return `${sqlCrit(a.a,F)} And ${sqlCrit(a.b,F)}`;
  case 'not':return `Not (${sqlCrit(a.a,F)})`;
  case 'null':return `${F} Is ${a.neg?'Not ':''}Null`;
  case 'between':return `${F} Between ${sqlValue(a.lo)} And ${sqlValue(a.hi)}`;
  case 'like':return `${F} Like ${sqlValue(a.v)}`;
  case 'cmp':return `${F}${a.op}${sqlValue(a.v)}`;
 }
 return '';
}
export function fromClause(tbls,dsArg){
 const ds=dataset(dsArg),set=new Set(tbls);let expr=null;const used=new Set();
 for(const r of ds.relations){
  if(!set.has(r.one)||!set.has(r.many))continue;
  const on=`${r.one}.${r.field} = ${r.many}.${r.field}`;
  if(!expr){expr=`${r.one} INNER JOIN ${r.many} ON ${on}`;used.add(r.one);used.add(r.many);}
  else{const add=used.has(r.one)?r.many:r.one;expr=`${add} INNER JOIN (${expr}) ON ${on}`;used.add(add);}
 }
 if(!expr)return tbls.join(', ');
 const rest=tbls.filter(t=>!used.has(t));
 return rest.length?[expr,...rest].join(', '):expr;
}
export function toSQL(q,ds){
 const cols=q.cols.filter(c=>c.field);
 if(!q.tables.length)return 'SELECT\nFROM ;';
 const isAgg=c=>q.totals&&c.total&&!['group','where'].includes(c.total);
 const sel=cols.filter(c=>c.show&&!(q.totals&&c.total==='where')).map(c=>isAgg(c)?`${aggSQL[c.total]}(${c.field}) AS ${aggNames[c.total]}${c.field.split('.')[1]}`:c.field);
 const cond=pick=>{const rows=[];for(let r=0;r<CRIT_ROWS;r++){const parts=cols.filter(pick).map(c=>{const s=c.crit[r];if(!s?.trim())return null;try{const F=isAgg(c)?`${aggSQL[c.total]}(${c.field})`:c.field;return `((${sqlCrit(parseCriterion(s),F)}))`;}catch{return '(/* błąd w kryterium */)';}}).filter(Boolean);if(parts.length)rows.push(parts.join(' AND '));}return rows.length>1?rows.map(x=>`(${x})`).join(' OR '):rows[0]||'';};
 const where=cond(c=>!isAgg(c)),having=cond(isAgg);
 const group=q.totals?cols.filter(c=>c.total==='group').map(c=>c.field):[];
 const order=cols.filter(c=>c.sort&&!(q.totals&&c.total==='where')).map(c=>`${isAgg(c)?`${aggSQL[c.total]}(${c.field})`:c.field}${c.sort==='desc'?' DESC':''}`);
 return [`SELECT ${sel.join(', ')||'*'}`,`FROM ${fromClause(q.tables,ds)}`,where&&`WHERE ${where}`,group.length&&`GROUP BY ${group.join(', ')}`,having&&`HAVING ${having}`,order.length&&`ORDER BY ${order.join(', ')}`].filter(Boolean).join('\n')+';';
}

// ---------- Zlecenia recepcji (Stomatolog) ----------
const col=(field,extra={})=>({...emptyColumn(),field,...extra});
const crit=(first,...rest)=>[first,...rest,'',''].slice(0,CRIT_ROWS);
export const tasks=[
 {id:'1a',level:1,title:'Telefony: pacjenci z Wrocławia',brief:'Recepcja dzwoni do pacjentów z Wrocławia w sprawie nowych godzin otwarcia. Potrzebuje: imie, nazwisko, telefon — alfabetycznie po nazwisku (A–Z).',
  need:[{key:'Pacjenci.imie',label:'imie'},{key:'Pacjenci.nazwisko',label:'nazwisko'},{key:'Pacjenci.telefon',label:'telefon'}],order:'Pacjenci.nazwisko',
  hints:{tooMany:'Sprawdź kryterium miasta: w kolumnie miasto wpisz "Wrocław" (i odznacz tam Pokaż).',tooFew:'Za mało osób — czy kryterium nie jest w złej kolumnie albo z literówką?',wrong:'Kryterium powinno stać w kolumnie miasto.',order:'W kolumnie nazwisko ustaw Sortuj: Rosnąco.'},
  solution:{tables:['Pacjenci'],totals:false,cols:[col('Pacjenci.imie'),col('Pacjenci.nazwisko',{sort:'asc'}),col('Pacjenci.telefon'),col('Pacjenci.miasto',{show:false,crit:crit('"Wrocław"')})]}},
 {id:'1b',level:1,title:'Bez e-maila = telefon',brief:'Przypomnienia idą e-mailem. Kto NIE ma e-maila? Do tych osób recepcja zadzwoni. Potrzebne: imie, nazwisko, telefon.',
  need:[{key:'Pacjenci.imie',label:'imie'},{key:'Pacjenci.nazwisko',label:'nazwisko'},{key:'Pacjenci.telefon',label:'telefon'}],
  hints:{tooMany:'Puste pole to w bazie Null. W kolumnie email wpisz kryterium Jest Null.',tooFew:'Jest Null (nie „Nie jest Null”) wybiera osoby bez e-maila.',wrong:'Kryterium Jest Null wpisz w kolumnie email.'},
  solution:{tables:['Pacjenci'],totals:false,cols:[col('Pacjenci.imie'),col('Pacjenci.nazwisko'),col('Pacjenci.telefon'),col('Pacjenci.email',{show:false,crit:crit('Jest Null')})]}},
 {id:'1c',level:1,title:'Segregator „K” do wymiany',brief:'Zalało segregator z kartami na literę K. Trzeba wydrukować karty od nowa: imie, nazwisko, data_urodzenia pacjentów, których nazwisko zaczyna się na K.',
  need:[{key:'Pacjenci.imie',label:'imie'},{key:'Pacjenci.nazwisko',label:'nazwisko'},{key:'Pacjenci.data_urodzenia',label:'data_urodzenia'}],
  hints:{tooMany:'Użyj wzorca: Jak "K*" w kolumnie nazwisko. Gwiazdka = dowolne dalsze znaki.',tooFew:'Samo "K" szuka nazwiska „K”. Potrzebny wzorzec: Jak "K*".',wrong:'Wzorzec wpisz w kolumnie nazwisko: Jak "K*".'},
  solution:{tables:['Pacjenci'],totals:false,cols:[col('Pacjenci.imie'),col('Pacjenci.nazwisko',{crit:crit('Jak "K*"')}),col('Pacjenci.data_urodzenia')]}},
 {id:'2a',level:2,title:'Przypomnienia SMS na jutro',brief:'Jutro (7 października) przychodzi 6 osób. Do SMS-ów potrzebne: imie, nazwisko, telefon i termin — od najwcześniejszej wizyty.',
  need:[{key:'Pacjenci.imie',label:'imie'},{key:'Pacjenci.nazwisko',label:'nazwisko'},{key:'Pacjenci.telefon',label:'telefon'},{key:'Wizyty.termin',label:'termin'}],order:'Wizyty.termin',
  hints:{tooMany:'Ogranicz termin do jednego dnia: #2026-10-07# albo Jak "2026-10-07*" w kolumnie termin.',tooFew:'Sprawdź datę: 7 października 2026 to #2026-10-07#.',wrong:'Kryterium daty wpisz w kolumnie termin (tabela Wizyty).',order:'W kolumnie termin ustaw Sortuj: Rosnąco.'},
  solution:{tables:['Pacjenci','Wizyty'],totals:false,cols:[col('Pacjenci.imie'),col('Pacjenci.nazwisko'),col('Pacjenci.telefon'),col('Wizyty.termin',{sort:'asc',crit:crit('#2026-10-07#')})]}},
 {id:'2b',level:2,title:'Grafik dr. Korony',brief:'Dr Piotr Korona prosi o swoje wizyty od 5 do 9 października (włącznie): termin, imie i nazwisko pacjenta, cel.',
  need:[{key:'Wizyty.termin',label:'termin'},{key:'Pacjenci.imie',label:'imie'},{key:'Pacjenci.nazwisko',label:'nazwisko (pacjenta)'},{key:'Wizyty.cel',label:'cel'}],
  hints:{tooMany:'Potrzebne są DWA warunki w tym samym wierszu Kryteria (czyli I): lekarz = Korona oraz termin Między #2026-10-05# I #2026-10-09#.',tooFew:'Warunki w różnych wierszach (Kryteria i lub) oznaczają LUB. Czy zakres dat obejmuje 9 października?',wrong:'Nazwisko lekarza jest w tabeli Lekarze — dodaj ją i wpisz "Korona" w kolumnie Lekarze.nazwisko (bez Pokaż).'},
  solution:{tables:['Pacjenci','Wizyty','Lekarze'],totals:false,cols:[col('Wizyty.termin',{crit:crit('Między #2026-10-05# I #2026-10-09#')}),col('Pacjenci.imie'),col('Pacjenci.nazwisko'),col('Wizyty.cel'),col('Lekarze.nazwisko',{show:false,crit:crit('"Korona"')})]}},
 {id:'2c',level:2,title:'Wizyty powyżej 300 zł',brief:'Kierowniczka sprawdza droższe wizyty (koszt powyżej 300 zł): nazwisko pacjenta, termin, koszt.',
  need:[{key:'Pacjenci.nazwisko',label:'nazwisko'},{key:'Wizyty.termin',label:'termin'},{key:'Wizyty.koszt',label:'koszt'}],
  hints:{tooMany:'„Powyżej 300” to >300. Znak >= dołączyłby też wizyty za dokładnie 300 zł.',tooFew:'Sprawdź znak: >300 wybiera wizyty droższe niż 300 zł.',wrong:'Kryterium >300 wpisz w kolumnie koszt.'},
  solution:{tables:['Pacjenci','Wizyty'],totals:false,cols:[col('Pacjenci.nazwisko'),col('Wizyty.termin'),col('Wizyty.koszt',{crit:crit('>300')})]}},
 {id:'3a',level:3,title:'Ile wizyt ma każdy lekarz?',brief:'Kierowniczka układa grafik na listopad. Chce wiedzieć, ile wizyt w bazie ma każdy lekarz: nazwisko lekarza i liczba wizyt.',
  need:[{key:'Lekarze.nazwisko',label:'nazwisko lekarza (Grupuj według)'},{key:'count:Wizyty.*',label:'liczba wizyt (Policz)'}],
  hints:{tooMany:'Grupuj tylko według nazwiska lekarza. Każda dodatkowa kolumna z „Grupuj według” dzieli grupy na mniejsze.',tooFew:'Usuń kryteria — liczymy wszystkie wizyty.',wrong:'Włącz Sumy (Σ). Lekarze.nazwisko: Grupuj według, Wizyty.id_wizyty: Policz.'},
  solution:{tables:['Wizyty','Lekarze'],totals:true,cols:[col('Lekarze.nazwisko',{total:'group'}),col('Wizyty.id_wizyty',{total:'count'})]}},
 {id:'3b',level:3,title:'Utarg według celu wizyty',brief:'Ile gabinet zarobi na każdym rodzaju wizyty (przegląd, leczenie…)? Potrzebne: cel i suma kosztów.',
  need:[{key:'Wizyty.cel',label:'cel (Grupuj według)'},{key:'sum:Wizyty.koszt',label:'suma kosztów (Suma)'}],
  hints:{tooMany:'Grupuj tylko według celu. Pole koszt ma mieć w wierszu Podsumowanie: Suma.',tooFew:'Usuń kryteria — liczymy utarg ze wszystkich wizyt.',wrong:'Pole koszt: Suma (nie Policz — Policz liczy wizyty, a nie złotówki).'},
  solution:{tables:['Wizyty'],totals:true,cols:[col('Wizyty.cel',{total:'group'}),col('Wizyty.koszt',{total:'sum'})]}},
 {id:'3c',level:3,title:'Kwerenda z pytaniem',brief:'Recepcja chce jedną kwerendę na wszystkich: po uruchomieniu pyta „Podaj nazwisko pacjenta:” i pokazuje nazwisko, termin i cel wszystkich wizyt tej osoby. Sprawdzimy ją dla nazwiska Wiśniewska (i drugiego, tajnego).',
  need:[{key:'Pacjenci.nazwisko',label:'nazwisko'},{key:'Wizyty.termin',label:'termin'},{key:'Wizyty.cel',label:'cel'}],param:'Wiśniewska',altParam:'Testowa',
  hints:{tooMany:'Parametr wpisz jako kryterium w kolumnie nazwisko: [Podaj nazwisko pacjenta:].',tooFew:'Parametr musi stać w kolumnie nazwisko (Pacjenci), a nie w innej.',wrong:'Parametr wpisz jako kryterium w kolumnie nazwisko: [Podaj nazwisko pacjenta:].'},
  solution:{tables:['Pacjenci','Wizyty'],totals:false,cols:[col('Pacjenci.nazwisko',{crit:crit('[Podaj nazwisko pacjenta:]')}),col('Wizyty.termin'),col('Wizyty.cel')]}}
];

// ---------- Zbiory danych ----------
const stomatolog={
 id:'stomatolog',title:'Stomatolog',tables:S.tables,fieldTypes:S.fieldTypes,order:['Pacjenci','Wizyty','Lekarze'],relations:S.relations,today:S.SIM_TODAY,tasks,levels:3,
 labels:{tasks:'Zlecenia recepcji',brief:'Zlecenie z recepcji',client:'recepcja',clientCap:'Recepcja',tablesHint:'przy danych pacjenta i wizyty potrzebne są obie tabele',
  paramMissing:{msg:'To ma być kwerenda parametryczna — Access ma zapytać o nazwisko.',hint:'W kolumnie nazwisko, w wierszu Kryteria, wpisz pytanie w nawiasie kwadratowym: [Podaj nazwisko pacjenta:].'},
  paramOne:'Zostaw jeden parametr w kolumnie nazwisko.',altWord:'nazwiska'},
 manyNotes:{Wizyty:' W projekcie jest tabela Wizyty — każdy pacjent pojawia się tyle razy, ile ma wizyt. Usuń zbędną tabelę (×).'},
 cheat:[['"Wrocław" lub Wrocław','równe tekstowi (wielkość liter bez znaczenia)'],['>300 · <=100 · <>0','porównania liczb'],['Między #2026-10-05# I #2026-10-09#','zakres (z końcami)'],['#2026-10-07# · Jak "2026-10-07*"','jeden dzień w polu termin'],['Jak "K*" · Jak "?a*"','wzorzec: * dowolne znaki, ? jeden znak'],['Jest Null · Nie jest Null','puste / niepuste pole'],['[Podaj nazwisko pacjenta:]','parametr — Access zapyta przy uruchomieniu'],['Date()+1','jutro (w symulacji „dziś” to 2026-10-06)']],
 cheatNote:'Uproszczenie symulacji: w polu termin porównywana jest sama data. W prawdziwym Accessie #2026-10-09# oznacza północ, więc wizyta 9.10 o 11:30 jest już „po” tej dacie — bezpieczniej wpisać >=#2026-10-05# I <#2026-10-10#.'
};
const zawody={id:'zawody',...zawodyQueries};
export const datasets={stomatolog,zawody};
// Zbiór danych: obiekt, identyfikator ('zawody') albo nic (Stomatolog).
export function dataset(x){if(x&&typeof x==='object')return x;return datasets[x]||stomatolog;}
const taskDs=task=>dataset(task?.dataset);

export const levelTasks=(level,ds)=>dataset(ds).tasks.filter(t=>t.level===level);
export const LEVEL_MAX=6,PASS_MIN=2;

const matchKey=(need,key)=>need.endsWith('*')?key.startsWith(need.slice(0,-1))&&key.includes(':')===need.includes(':'):need===key;
function project(result,need){
 const idx=need.map(n=>result.columns.findIndex(c=>matchKey(n.key,c.key)));
 return result.rows.map(r=>idx.map(i=>r[i]));
}
function runWith(q,task,value){
 const ps=queryParams(q);const params=Object.fromEntries(ps.map(p=>[p,value]));
 return runQuery(q,params,taskDs(task));
}
export function expectedRows(task,value=task.param){return project(runWith(task.solution,task,value),task.need);}
const aggLabel={count:'Policz',sum:'Suma',min:'Min',max:'Maks',avg:'Średnia'};

// Sprawdza kwerendę ucznia względem zlecenia. Zwraca {ok, msg, hint}.
export function checkTask(task,q){
 let res;
 const ds=taskDs(task),L=ds.labels;
 const ps=queryParams(q);
 if(task.param&&!ps.length)return {ok:false,msg:L.paramMissing.msg,hint:L.paramMissing.hint};
 if(ps.length>1)return {ok:false,msg:`Kwerenda zadaje kilka pytań, a ${L.client} chce jedno.`,hint:L.paramOne};
 if(!task.param&&ps.length)return {ok:false,msg:`To zlecenie nie wymaga parametru — ${L.client} nie chce odpowiadać na pytania.`,hint:'Zamiast [ ... ] wpisz konkretną wartość kryterium.'};
 try{res=runWith(q,task,task.param);}catch(e){return {ok:false,msg:e.message,hint:e.hint};}
 const shown=res.columns;
 const missing=task.need.filter(n=>!shown.some(c=>matchKey(n.key,c.key)));
 if(missing.length){const m=missing[0];const agg=m.key.includes(':');
  return {ok:false,msg:`Brakuje kolumny: ${missing.map(x=>x.label).join(', ')}.`,hint:agg?`Włącz „Sumy (Σ)” i w wierszu Podsumowanie wybierz ${aggLabel[m.key.split(':')[0]]||'Suma'}.`:q.cols.some(c=>c.field===m.key)?'Pole jest w siatce, ale ma odznaczone „Pokaż”.':`Dodaj pole ${m.key} do siatki (kliknij je w okienku tabeli).`};}
 const extra=shown.filter(c=>!task.need.some(n=>matchKey(n.key,c.key)));
 if(extra.length)return {ok:false,msg:`Zbędna kolumna w wyniku: ${extra.map(c=>c.label).join(', ')}.`,hint:`${L.clientCap} prosi tylko o wymienione kolumny. Pole z kryterium może zostać w siatce — odznacz w nim „Pokaż”.`};
 const got=project(res,task.need),exp=expectedRows(task);
 const bag=rows=>rows.map(r=>JSON.stringify(r)).sort();
 const extraTables=q.tables.filter(t=>!task.solution.tables.includes(t)&&!(task.optionalTables||[]).includes(t));
 const tableNote=extraTables.map(t=>ds.manyNotes?.[t]).find(Boolean)||'';
 if(got.length!==exp.length){const d=got.length-exp.length;
  return {ok:false,msg:d>0?`Masz ${d} ${plural(d,'wiersz','wiersze','wierszy')} za dużo (${got.length} zamiast ${exp.length}).`:`Brakuje ${-d} ${plural(-d,'wiersza','wierszy','wierszy')} (${got.length} zamiast ${exp.length}).`,hint:(d>0?task.hints.tooMany:task.hints.tooFew)+tableNote};}
 const a=bag(got),b=bag(exp);
 if(a.some((x,i)=>x!==b[i]))return {ok:false,msg:`Liczba wierszy się zgadza (${got.length}), ale to nie te same rekordy.`,hint:task.hints.wrong};
 if(task.order){const i=task.need.findIndex(n=>n.key===task.order);
  if(got.map(r=>JSON.stringify(r[i])).join()!==exp.map(r=>JSON.stringify(r[i])).join())return {ok:false,msg:'Wiersze są dobre, ale kolejność nie ta.',hint:task.hints.order};}
 if(task.altParam){
  try{const g2=project(runWith(q,task,task.altParam),task.need),e2=expectedRows(task,task.altParam);
   if(bag(g2).join()!==bag(e2).join())return {ok:false,msg:`Dla „${task.param}” działa, ale dla innego ${L.altWord} — nie.`,hint:task.hints.wrong};
  }catch(e){return {ok:false,msg:e.message,hint:e.hint};}
 }
 return {ok:true,msg:`Zlecenie wykonane: ${exp.length} ${plural(exp.length,'wiersz','wiersze','wierszy')}, właściwe kolumny${task.order?' i kolejność':''}.`};
}
export function plural(n,one,few,many){n=Math.abs(n);if(n===1)return one;const d=n%10,t=n%100;return d>=2&&d<=4&&(t<12||t>14)?few:many;}

// Punkty poziomu: 2 za zaliczenie przy 1. sprawdzeniu, 1 po poprawce.
export function levelResult(level,state={},ds){
 const ts=levelTasks(level,ds),st=state.tasks||{};
 const passed=ts.filter(t=>st[t.id]?.passed);
 const score=ts.reduce((s,t)=>s+(st[t.id]?.passed?(st[t.id].firstTry?2:1):0),0);
 const d=dataset(ds);
 return {done:passed.length>=PASS_MIN,score,max:LEVEL_MAX,passed:passed.length,summary:d.levelSummary?d.levelSummary(level,passed.length):`Poziom ${level}: ${passed.length}/3 zleceń`};
}
export function levelUnlocked(level,state={},ds){return level===1||levelResult(level-1,state,ds).passed>=PASS_MIN;}
export function recordCheck(state={},task,q){
 const ds=taskDs(task);
 const r=checkTask(task,q);const prev=state.tasks?.[task.id]||{attempts:0};
 if(prev.passed)return {state,result:r};
 const t={...prev,attempts:prev.attempts+1,passed:r.ok,firstTry:r.ok&&prev.attempts===0};
 const next={...state,tasks:{...state.tasks,[task.id]:t}};
 const modes={...next.modes};
 for(let l=1;l<=(ds.levels||3);l++)modes[`l${l}`]=levelResult(l,next,ds);
 return {state:{...next,modes},result:r};
}
