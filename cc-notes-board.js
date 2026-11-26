/* Customs Community: personal notes board, isolated from library cards. */
(function(){
'use strict';
if(window.CC_NOTES_BOARD)return;
window.CC_NOTES_BOARD=true;
const $=id=>document.getElementById(id),colors=['yellow','blue','pink','green'];
const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const user=()=>{const s=window.CC_AUTH?.getSession?.();return s?.access_token?s.user?.id||'':''};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let db=null,owner='',notes=[],filter='today',opened=false,busy=false;
const timers=new Map(),queues=new Map();
function style(){
 if($('ccNotesStyle'))return;
 const s=document.createElement('style');s.id='ccNotesStyle';
 s.textContent=[
 '#ccNotesOpen{display:inline-flex;align-items:center;gap:7px;background:#fff1c3;color:#59451c;border:1px solid #e7c96f;padding:9px 13px;border-radius:10px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap}',
 '#ccNotesOverlay{position:fixed;inset:0;z-index:100700;background:#102b3dbb;display:flex;align-items:center;justify-content:center;padding:15px;color:#284358}',
 '#ccNotesOverlay[hidden]{display:none!important}#ccNotesOverlay *{box-sizing:border-box}',
 '#ccNotesOverlay .ccn-shell{width:min(1100px,100%);max-height:94dvh;overflow:auto;background:#f5f8fb;border-radius:20px;padding:23px;box-shadow:0 20px 60px #142c3b55}',
 '#ccNotesOverlay .ccn-head,#ccNotesOverlay .ccn-toolbar,#ccNotesOverlay .ccn-top,#ccNotesOverlay .ccn-bottom{display:flex;align-items:center;justify-content:space-between;gap:9px;flex-wrap:wrap}',
 '#ccNotesOverlay h2{margin:0;color:#193d55;font-size:21px}#ccNotesOverlay .ccn-sub{margin:4px 0 0;font-size:12px;color:#637b8e}',
 '#ccNotesOverlay button{cursor:pointer;border-radius:9px;padding:8px 11px;background:#fff;border:1px solid #c4d6df;font-size:12px;color:#2c5369;font-weight:750}',
 '#ccNotesOverlay .ccn-toolbar{justify-content:flex-start;margin:19px 0 14px}',
 '#ccNotesOverlay .ccn-add{background:#236c8e;color:#fff;border-color:#236c8e}',
 '#ccNotesOverlay .ccn-filter[aria-pressed=true]{background:#d9eaf4;border-color:#84b9d0}',
 '#ccNotesOverlay .ccn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,235px),1fr));align-items:start;gap:13px;min-height:100px}',
 '#ccNotesOverlay .ccn-card{display:flex;flex-direction:column;gap:9px;min-height:222px;border-radius:10px;padding:12px;box-shadow:1px 5px 10px #122e4b17;color:#254258}',
 '#ccNotesOverlay .ccn-yellow{background:#fff0a9}#ccNotesOverlay .ccn-blue{background:#daeeff}#ccNotesOverlay .ccn-pink{background:#f9dcf0}#ccNotesOverlay .ccn-green{background:#dcf0d6}',
 '#ccNotesOverlay .ccn-card button{padding:5px 8px;background:#ffffffa6;border-color:#ffffffa0}',
 '#ccNotesOverlay .ccn-card select{background:#ffffffa6;color:#254258;border-radius:6px;padding:5px;max-width:85px;border:1px solid #a9b9bd;font-size:11px}',
 '#ccNotesOverlay textarea{resize:vertical;flex:1;min-height:105px;border:none;background:transparent;color:#1c4059;font-family:inherit;font-size:14px;line-height:1.5;width:100%;padding:4px;outline-offset:1px}',
 '#ccNotesOverlay .ccn-card[data-done=true]{opacity:.7}#ccNotesOverlay .ccn-card[data-done=true] textarea{text-decoration:line-through}',
 '#ccNotesOverlay .ccn-bottom{font-size:12px}#ccNotesOverlay .ccn-bottom label{display:flex;gap:5px;align-items:center;font-weight:750}',
 '#ccNotesOverlay .ccn-date{padding:5px;border:1px solid #a4b5bb;border-radius:7px;max-width:136px;background:#ffffffa6;color:#244458;font-size:11px}',
 '#ccNotesOverlay .ccn-status{min-height:18px;margin:13px 0 0;font-size:11px;color:#5b7183}',
 '#ccNotesOverlay .ccn-empty{padding:40px 13px;text-align:center;border:1px dashed #bfd3dd;border-radius:11px;color:#577389;grid-column:1/-1}',
 '#ccNotesOverlay button:focus-visible,#ccNotesOpen:focus-visible{outline:3px solid #5d9dbd;outline-offset:2px}',
 '@media(max-width:560px){#ccNotesOverlay{padding:0}#ccNotesOverlay .ccn-shell{max-height:100dvh;min-height:100dvh;border-radius:0;padding:15px}#ccNotesOverlay .ccn-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}#ccNotesOverlay .ccn-card{padding:9px}#ccNotesOverlay textarea{font-size:12px}}',
 '@media(max-width:350px){#ccNotesOverlay .ccn-grid{grid-template-columns:1fr}}'
 ].join('');
 document.head.appendChild(s);
}
function mount(){
 const panel=$('ccxCardLibraryPanel');
 if(!panel)return;
 const head=panel.querySelector('.cckl-head')||panel.querySelector('header')||panel;
 let b=$('ccNotesOpen');
 if(b){if(!panel.contains(b))head.appendChild(b);return;}
 b=document.createElement('button');b.type='button';b.id='ccNotesOpen';
 b.textContent='🗒️ Not Panom';b.setAttribute('aria-label','Kişisel Not Panom ekranını aç');
 b.addEventListener('click',open);head.appendChild(b);
}
function ensure(){
 if($('ccNotesOverlay'))return;
 const root=document.createElement('div');root.id='ccNotesOverlay';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Not Panom');
 root.innerHTML='<section class="ccn-shell"><div class="ccn-head"><div><h2>🗒️ Not Panom</h2><p class="ccn-sub">Günlük yapılacaklar ve sana özel sticker notlar</p></div><button type="button" id="ccNotesClose">← Kütüphaneye Dön</button></div><div class="ccn-toolbar"><button type="button" class="ccn-add" id="ccNotesAdd">＋ Yeni Not</button><button type="button" class="ccn-filter" data-filter="today">Bugün</button><button type="button" class="ccn-filter" data-filter="upcoming">Yaklaşan</button><button type="button" class="ccn-filter" data-filter="all">Tüm Notlar</button><button type="button" class="ccn-filter" data-filter="done">Tamamlananlar</button></div><div class="ccn-grid" id="ccNotesGrid"></div><p class="ccn-status" id="ccNotesStatus" role="status"></p></section>';
 document.body.appendChild(root);
 $('ccNotesClose').onclick=close;$('ccNotesAdd').onclick=add;
 root.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render()}));
 root.addEventListener('click',e=>{if(e.target===root)close()});
 root.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}
function status(v){if($('ccNotesStatus'))$('ccNotesStatus').textContent=v}
function visible(n){
 if(filter==='all')return true;
 if(filter==='done')return n.done;
 if(filter==='upcoming')return !n.done&&n.due_date&&n.due_date>today();
 return !n.done&&(!n.due_date||n.due_date<=today());
}
const ordered=()=>notes.filter(visible).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||a.sort_order-b.sort_order||new Date(b.created_at)-new Date(a.created_at));
function render(){
 const grid=$('ccNotesGrid');if(!grid)return;
 document.querySelectorAll('#ccNotesOverlay [data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
 const list=ordered();
 if(!list.length){grid.innerHTML='<div class="ccn-empty">Burada henüz notun yok. <b>＋ Yeni Not</b> ile başlayabilirsin.</div>';return}
 grid.innerHTML=list.map(n=>{
  const col=colors.includes(n.color)?n.color:'yellow';
  return '<article class="ccn-card ccn-'+col+'" data-id="'+escapeText(n.id)+'" data-done="'+n.done+'" draggable="true"><div class="ccn-top"><button type="button" data-action="pin" title="Sabitle" aria-pressed="'+n.pinned+'">'+(n.pinned?'📌':'📍')+'</button><select aria-label="Sticker rengi" data-action="color">'+colors.map((c,i)=>'<option value="'+c+'" '+(col===c?'selected':'')+'>'+['Sarı','Mavi','Pembe','Yeşil'][i]+'</option>').join('')+'</select><button type="button" data-action="delete" title="Notu sil">✕</button></div><textarea maxlength="1500" data-action="body" placeholder="Buraya yaz...">'+escapeText(n.body)+'</textarea><div class="ccn-bottom"><label><input type="checkbox" data-action="done" '+(n.done?'checked':'')+'> Tamamlandı</label><input class="ccn-date" aria-label="Bitiş tarihi" type="date" data-action="due_date" value="'+escapeText(n.due_date||'')+'"></div><div class="ccn-bottom"><small>↕ Sırala</small><span><button data-action="left" title="Öne al">←</button><button data-action="right" title="Sonraya al">→</button></span></div></article>';
 }).join('');
}
async function open(){
 const id=user();if(!id){window.ccToast?.('Not Panom için giriş yapmalısın.','info');return}
 ensure();$('ccNotesOverlay').hidden=false;document.body.style.overflow='hidden';
 if(opened&&owner===id){render();return}
 owner=id;opened=true;notes=[];render();status('Notlar yükleniyor…');
 try{
  db=await window.CC_AUTH.getClient();
  const r=await db.from('cc_personal_sticky_notes').select('id,user_id,body,color,done,pinned,due_date,sort_order,created_at').eq('user_id',id).order('created_at',{ascending:false});
  if(r.error)throw r.error;if(user()!==id)return;
  notes=r.data||[];render();status('Notların hesabına özel olarak saklanır.');
 }catch(e){opened=false;status('Notlar yüklenemedi: '+e.message+' — paneli yeniden açıp deneyebilirsin.')}
}
function close(){
 for(const id of [...timers.keys()])flush(id);
 $('ccNotesOverlay').hidden=true;document.body.style.overflow='';
}
async function add(){
 if(busy||!db||user()!==owner)return;busy=true;status('Yeni not kaydediliyor…');
 try{
  const r=await db.from('cc_personal_sticky_notes').insert({user_id:owner,body:'',color:colors[notes.length%4],sort_order:notes.length*10}).select().single();
  if(r.error)throw r.error;
  notes.unshift(r.data);filter='all';render();status('Yeni not eklendi.');
  $('ccNotesGrid').querySelector('[data-id="'+r.data.id+'"] textarea')?.focus();
 }catch(e){status('Not eklenemedi: '+e.message)}
 finally{busy=false}
}
function save(id,patch){
 if(user()!==owner||!db)return;
 const previous=queues.get(id)||Promise.resolve();
 const q=previous.catch(()=>{}).then(async()=>{
  if(user()!==owner)return;
  const r=await db.from('cc_personal_sticky_notes').update({...patch,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',owner).select('id').maybeSingle();
  if(r.error||!r.data)throw r.error||new Error('Kayıt bulunamadı');
 });
 queues.set(id,q);status('Kaydediliyor…');
 q.then(()=>{if(queues.get(id)===q)status('Kaydedildi ✓')}).catch(e=>status('Kaydetme hatası: '+e.message));
}
function flush(id){
 const t=timers.get(id);if(t)clearTimeout(t);timers.delete(id);
 const n=notes.find(x=>x.id===id);if(n)save(id,{body:n.body});
}
function edit(n,patch){Object.assign(n,patch);save(n.id,patch)}
async function remove(n){
 if(!confirm('Bu sticker notu silinsin mi?'))return;
 if(timers.has(n.id))flush(n.id);
 try{
  await(queues.get(n.id)||Promise.resolve());
  const r=await db.from('cc_personal_sticky_notes').delete().eq('id',n.id).eq('user_id',owner).select('id').maybeSingle();
  if(r.error||!r.data)throw r.error||new Error('Silme başarısız');
  notes=notes.filter(x=>x.id!==n.id);render();status('Not silindi.');
 }catch(e){status('Silinemedi: '+e.message)}
}
function move(id,direction){
 const list=ordered(),index=list.findIndex(x=>x.id===id),adjacent=list[index+direction];if(!adjacent)return;
 const item=list[index];if(item.sort_order===adjacent.sort_order){notes.forEach((x,i)=>x.sort_order=i*10)}
 const before=item.sort_order;item.sort_order=adjacent.sort_order;adjacent.sort_order=before;
 save(item.id,{sort_order:item.sort_order});save(adjacent.id,{sort_order:adjacent.sort_order});render();
}
function init(){
 style();ensure();mount();
 const root=document.body;let scheduled=false;
 new MutationObserver(records=>{if(scheduled||$('ccNotesOpen'))return;if(!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.id==='ccxCardLibraryPanel'||n.querySelector?.('#ccxCardLibraryPanel')))))return;scheduled=true;setTimeout(()=>{scheduled=false;mount()},250)}).observe(root,{subtree:true,childList:true});
 window.addEventListener('cc-authenticated',mount);
 document.addEventListener('click',e=>{if(e.target.closest?.('#ccxTabLibrary,#ccxCardLibraryPanel,[data-cc-library]'))setTimeout(mount,250)},true);
 document.addEventListener('input',e=>{
  const t=e.target;if(!t.matches?.('#ccNotesOverlay textarea[data-action="body"]'))return;
  const n=notes.find(x=>x.id===t.closest('[data-id]')?.dataset.id);if(!n)return;
  n.body=t.value;if(timers.has(n.id))clearTimeout(timers.get(n.id));
  timers.set(n.id,setTimeout(()=>flush(n.id),650));status('Kaydedilecek…');
 });
 document.addEventListener('focusout',e=>{const t=e.target;if(!t.matches?.('#ccNotesOverlay textarea[data-action="body"]'))return;const id=t.closest('[data-id]')?.dataset.id;if(timers.has(id))flush(id)});
 document.addEventListener('change',e=>{
  const t=e.target,card=t.closest?.('#ccNotesOverlay .ccn-card');if(!card)return;
  const n=notes.find(x=>x.id===card.dataset.id);if(!n)return;
  if(t.dataset.action==='color'&&colors.includes(t.value)){edit(n,{color:t.value});render()}
  if(t.dataset.action==='done'){edit(n,{done:t.checked});render()}
  if(t.dataset.action==='due_date'){edit(n,{due_date:t.value||null});render()}
 });
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('#ccNotesOverlay button[data-action]');if(!b)return;
  const n=notes.find(x=>x.id===b.closest('[data-id]')?.dataset.id);if(!n)return;
  if(b.dataset.action==='pin'){edit(n,{pinned:!n.pinned});render()}
  if(b.dataset.action==='delete')remove(n);
  if(b.dataset.action==='left')move(n.id,-1);
  if(b.dataset.action==='right')move(n.id,1);
 });
 let dragging='';
 document.addEventListener('dragstart',e=>{const card=e.target.closest?.('#ccNotesOverlay .ccn-card');if(card)dragging=card.dataset.id});
 document.addEventListener('dragover',e=>{if(dragging&&e.target.closest?.('#ccNotesOverlay .ccn-card'))e.preventDefault()});
 document.addEventListener('drop',e=>{
  const target=e.target.closest?.('#ccNotesOverlay .ccn-card');if(!dragging||!target)return;
  e.preventDefault();const list=ordered(),from=list.findIndex(n=>n.id===dragging),to=list.findIndex(n=>n.id===target.dataset.id);
  dragging='';if(from<0||to<0)return;
  const [item]=list.splice(from,1);list.splice(to,0,item);
  list.forEach((n,i)=>{if(n.sort_order!==i*10){n.sort_order=i*10;save(n.id,{sort_order:n.sort_order})}});render();
 });
 document.addEventListener('dragend',()=>dragging='');
 window.addEventListener('cc-logged-out',()=>{for(const t of timers.values())clearTimeout(t);timers.clear();notes=[];db=null;owner='';opened=false;$('ccNotesOverlay').hidden=true;document.body.style.overflow=''});
 window.addEventListener('cc-authenticated',()=>{if(owner&&owner!==user()){notes=[];db=null;owner='';opened=false}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();