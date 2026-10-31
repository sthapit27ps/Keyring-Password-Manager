const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

const G='<svg viewBox="0 0 16 16" fill="#fff"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
const IG='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="#fff" stroke="none"/></svg>';
const LI='<svg viewBox="0 0 24 24" fill="#fff"><rect x="3" y="9" width="4" height="12" rx=".5"/><circle cx="5" cy="5" r="2.2"/><path d="M10 9h3.8v1.8c.7-1.2 2-2.1 3.9-2.1 3.3 0 4.3 2.1 4.3 5.2V21h-4v-6.2c0-1.5-.4-2.5-1.8-2.5-1.5 0-2.2 1-2.2 2.6V21h-4z"/></svg>';
const KEY='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/></svg>';
const SV={
 instagram:{n:'Instagram',bg:'linear-gradient(45deg,#f9a83a,#e1306c,#6a3ed1)',i:IG,c:'Social'},
 linkedin:{n:'LinkedIn',bg:'#0a66c2',i:LI,c:'Work'},
 github:{n:'GitHub',bg:'#24292f',i:G,c:'Work'},
 facebook:{n:'Facebook',bg:'#1877f2',t:'f',c:'Social'},
 x:{n:'X (Twitter)',bg:'#111',t:'𝕏',c:'Social'},
 snapchat:{n:'Snapchat',bg:'#f5c800',t:'Sc',c:'Social'},
 whatsapp:{n:'WhatsApp',bg:'#25d366',t:'W',c:'Social'},
 google:{n:'Google',bg:'#ea4335',t:'G',c:'Email'},
 outlook:{n:'Outlook',bg:'#0a64ad',t:'O',c:'Email'},
 netflix:{n:'Netflix',bg:'#c8101a',t:'N',c:'Entertainment'},
 spotify:{n:'Spotify',bg:'#1db954',t:'S',c:'Entertainment'},
 youtube:{n:'YouTube',bg:'#ff0000',t:'▶',c:'Entertainment'},
 amazon:{n:'Amazon',bg:'#f08a00',t:'a',c:'Shopping'},
 paypal:{n:'PayPal',bg:'#173c8f',t:'P',c:'Finance'},
 other:{n:'Other…',bg:'#6a6a66',i:KEY,c:'Other'}
};
const CATS=['Social','Work','Email','Finance','Shopping','Entertainment','Other'];
const ic=(k,sz)=>{const s=SV[k]||SV.other;return `<div class="ic" style="background:${s.bg}${sz?`;width:${sz}px;height:${sz}px`:''}">${s.i||esc(s.t)}</div>`};

let items=store.get('kr_items',[]),cat='All',editId=null,shown={};
const save=()=>store.set('kr_items',items);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),1600)}
async function copy(txt){try{await navigator.clipboard.writeText(txt);toast('Copied')}catch(e){const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Copied')}catch(_){toast('Copy failed')}a.remove()}}

/* ---------- strength ---------- */
const COMMON=['password','qwerty','letmein','welcome','admin','login','iloveyou','monkey','dragon','abc123','123456','football','111111','master'];
function analyze(p){
  const c={len:p.length>=12,up:/[A-Z]/.test(p),lo:/[a-z]/.test(p),num:/\d/.test(p),sym:/[^A-Za-z0-9]/.test(p),long:p.length>=16};
  let pool=(c.lo?26:0)+(c.up?26:0)+(c.num?10:0)+(c.sym?33:0);
  let e=p.length&&pool?p.length*Math.log2(pool):0;
  const low=p.toLowerCase(),tips=[];
  if(COMMON.some(w=>low.includes(w))){e*=.4;tips.push('Contains a very common word or pattern.')}
  if(/(.)\1{2,}/.test(p)){e*=.75;tips.push('Repeated characters (like “aaa”) are easy to guess.')}
  if(/(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|asdf)/.test(low)){e*=.7;tips.push('Sequences like “1234” or “abcd” are cracked first.')}
  if(/^[a-zA-Z]+\d{1,4}$/.test(p)){e*=.8;tips.push('Word followed by a few digits is a very common shape.')}
  if(!c.len)tips.push('Aim for at least 12 characters.');
  if(!(c.up&&c.lo))tips.push('Mix upper and lower case letters.');
  if(!c.num)tips.push('Add some numbers.');
  if(!c.sym)tips.push('Add a symbol or two.');
  let lvl=e<28?0:e<40?1:e<60?2:e<80?3:4;
  if(!p)lvl=-1;
  const sec=Math.pow(2,e)/1e10;
  return{c,e,lvl,tips,time:fmt(sec)};
}
function fmt(s){if(s<1)return'instantly';const u=[[31536000*1e3,'millennia'],[31536000,'years'],[86400,'days'],[3600,'hours'],[60,'minutes'],[1,'seconds']];
  if(s>31536000*1e9)return'longer than the age of the universe';
  for(const[v,n]of u)if(s>=v){const x=Math.round(s/v);return x.toLocaleString()+' '+n}return'instantly'}
const LV=[['Very weak','#c4452f',12],['Weak','#e0652b',30],['Fair','#d98a1c',55],['Strong','#5da36b',80],['Excellent','#2f8f5b',100]];
function paint(r,bar,lab,time){
  const m=LV[r.lvl]||['','#999',0];
  $(bar).style.width=(r.lvl<0?0:m[2])+'%';$(bar).style.background=m[1];
  if(lab){$(lab).textContent=r.lvl<0?'—':m[0];$(lab).style.color=m[1]}
  if(time)$(time).textContent=r.lvl<0?'':'Cracked in about '+r.time;
}

/* ---------- generator ---------- */
function rnd(n){const a=new Uint32Array(1),lim=Math.floor(4294967296/n)*n;let x;do{crypto.getRandomValues(a);x=a[0]}while(x>=lim);return x%n}
function makePw(len,o){
  o=o||{U:1,L:1,N:1,S:1,A:0};
  let sets=[];
  const strip=s=>o.A?s.replace(/[0OIl1o]/g,''):s;
  if(o.L)sets.push(strip('abcdefghijklmnopqrstuvwxyz'));
  if(o.U)sets.push(strip('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
  if(o.N)sets.push(strip('0123456789'));
  if(o.S)sets.push('!@#$%^&*()-_=+[]{};:,.?');
  if(!sets.length)sets=[strip('abcdefghijklmnopqrstuvwxyz')];
  const all=sets.join('');let out=sets.map(s=>s[rnd(s.length)]);
  while(out.length<len)out.push(all[rnd(all.length)]);
  out=out.slice(0,len);
  for(let i=out.length-1;i>0;i--){const j=rnd(i+1);[out[i],out[j]]=[out[j],out[i]]}
  return out.join('');
}
let cur='';
function gen(){
  const o={U:$('#oU').checked,L:$('#oL').checked,N:$('#oN').checked,S:$('#oS').checked,A:$('#oA').checked};
  cur=makePw(+$('#len').value,o);$('#gout').textContent=cur;$('#glen').textContent=$('#len').value;
  paint(analyze(cur),'#gm','#gl','#gt');
}
['#len','#oU','#oL','#oN','#oS','#oA'].forEach(s=>$(s).addEventListener('input',gen));
$('#regen').onclick=gen;$('#gcopy').onclick=()=>copy(cur);
$('#gcheck').onclick=()=>{go('ana');$('#ain').value=cur;runA()};
$('#gsave').onclick=()=>openDlg(null,cur);

/* ---------- analyzer ---------- */
const CL=[['len','12+ characters'],['long','16+ characters'],['up','Uppercase letter'],['lo','Lowercase letter'],['num','Number'],['sym','Symbol']];
function runA(){
  const p=$('#ain').value,r=analyze(p);paint(r,'#am','#al','#at');
  $('#achk').innerHTML=CL.map(([k,t])=>`<div class="${r.c[k]&&p?'y':''}">${t}</div>`).join('');
  $('#atips').innerHTML=p?(r.tips.length?r.tips.map(t=>'• '+esc(t)).join('<br>'):'Nice work. This one would hold up well. Use it for only one account.'):'';
}
$('#ain').oninput=runA;
$('#ashow').onclick=()=>{const i=$('#ain');const h=i.type==='password';i.type=h?'text':'password';$('#ashow').textContent=h?'Hide':'Show'};

/* ---------- vault ---------- */
function render(){
  const q=$('#q').value.toLowerCase();
  const counts={All:items.length};CATS.forEach(c=>counts[c]=items.filter(i=>i.cat===c).length);
  $('#chips').innerHTML=['All',...CATS].filter(c=>c==='All'||counts[c]||c===cat).map(c=>`<button class="chip ${c===cat?'on':''}" data-c="${c}">${c} · ${counts[c]}</button>`).join('');
  const list=items.filter(i=>(cat==='All'||i.cat===cat)&&(i.name+i.user+i.note).toLowerCase().includes(q));
  $('#list').innerHTML=list.length?list.map(i=>`<div class="entry"><span>${ic(i.svc)}</span>
   <div class="meta"><b>${esc(i.name)} <span class="tag" style="display:inline">${esc(i.cat)}</span></b><span>${esc(i.user)}</span><span class="pw">${shown[i.id]?esc(i.pw):'•'.repeat(Math.min(i.pw.length,14))}</span></div>
   <div class="acts"><button class="btn sm" data-a="show" data-i="${i.id}">${shown[i.id]?'Hide':'Show'}</button><button class="btn sm" data-a="copy" data-i="${i.id}">Copy</button><button class="btn sm" data-a="edit" data-i="${i.id}">Edit</button><button class="btn sm d" data-a="del" data-i="${i.id}">Delete</button></div></div>`).join('')
   :`<div class="empty card">${items.length?'Nothing matches that.':'Your vault is empty. Add your first password and pick where it belongs.'}</div>`;
  $('#cnt').textContent=items.length;$('#weak').textContent=items.filter(i=>analyze(i.pw).lvl<=1).length;
}
$('#chips').onclick=e=>{const b=e.target.closest('.chip');if(b){cat=b.dataset.c;render()}};
$('#q').oninput=render;
$('#list').onclick=e=>{const b=e.target.closest('button');if(!b)return;const id=b.dataset.i,it=items.find(x=>x.id===id);
  if(b.dataset.a==='show'){shown[id]=!shown[id];render()}
  if(b.dataset.a==='copy')copy(it.pw);
  if(b.dataset.a==='edit')openDlg(it);
  if(b.dataset.a==='del'&&confirm('Delete '+it.name+'?')){items=items.filter(x=>x.id!==id);save();render()}};

$('#fS').innerHTML=Object.entries(SV).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join('');
$('#fK').innerHTML=CATS.map(c=>`<option>${c}</option>`).join('');
$('#fS').onchange=()=>{$('#cw').classList.toggle('hide',$('#fS').value!=='other');$('#fK').value=SV[$('#fS').value].c};
$('#fP').oninput=()=>{const r=analyze($('#fP').value);paint(r,'#fM',null,null);$('#fL').textContent=r.lvl<0?'':LV[r.lvl][0]};
$('#fG').onclick=()=>{$('#fP').value=makePw(18);$('#fP').oninput()};
function openDlg(it,pw){
  editId=it?it.id:null;$('#dt').textContent=it?'Edit password':'Add a password';
  $('#fS').value=it?it.svc:'instagram';$('#fS').onchange();
  $('#fC').value=it&&it.svc==='other'?it.name:'';$('#fU').value=it?it.user:'';$('#fP').value=it?it.pw:(pw||'');
  if(it)$('#fK').value=it.cat;$('#fN').value=it?it.note:'';$('#fP').oninput();
  if(!$('#dlg').open)$('#dlg').showModal();
}
$('#add').onclick=()=>openDlg();
$('#fX').onclick=()=>$('#dlg').close();
$('#fOk').onclick=()=>{
  const svc=$('#fS').value,name=svc==='other'?($('#fC').value.trim()||'Other'):SV[svc].n,user=$('#fU').value.trim(),pw=$('#fP').value;
  if(!pw){toast('Enter a password first');return}
  const rec={id:editId||String(Date.now()),svc,name,user,pw,cat:$('#fK').value,note:$('#fN').value.trim()};
  items=editId?items.map(x=>x.id===editId?rec:x):[rec,...items];save();$('#dlg').close();render();toast('Saved');
};

$('#liA').innerHTML=LI;$('#ghA').innerHTML=G;

/* ---------- tabs & theme ---------- */
function go(t){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));['vault','gen','ana'].forEach(s=>$('#'+s).classList.toggle('hide',s!==t));if(t==='gen'&&!cur)gen()}
$('#tabs').onclick=e=>{const b=e.target.closest('.tab');if(b)go(b.dataset.t)};
$('#theme').onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.theme=dark?'light':'dark'};

render();runA();
