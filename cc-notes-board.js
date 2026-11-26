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
const timers=new Map(),titleTimers=new Map(),checkTimers=new Map(),queues=new Map();
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
 '@media(max-width:460px){#ccNotesOverlay .ccn-grid{grid-template-columns:1fr}#ccNotesOverlay .ccn-date{max-width:100%}}'
 ].join('');

 s.textContent += [
 '#ccNotesOverlay{position:fixed!important;inset:0!important;padding:0!important;background:#f4f7fa!important;align-items:stretch!important;justify-content:stretch!important;overflow-y:auto!important}',
 '#ccNotesOverlay .ccn-shell{width:100%!important;max-width:none!important;max-height:none!important;min-height:100dvh!important;overflow:visible!important;border-radius:0!important;box-shadow:none!important;padding:clamp(20px,3vw,48px)!important}',
 '#ccNotesOverlay .ccn-head{max-width:1480px;margin:0 auto;padding-bottom:18px;border-bottom:1px solid #dde6eb}',
 '#ccNotesOverlay h2{font-size:clamp(24px,3vw,33px)!important}',
 '#ccNotesOverlay .ccn-toolbar{max-width:1480px;margin:20px auto 22px}',
 '#ccNotesOverlay .ccn-grid{max-width:1480px;margin:0 auto;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))!important;gap:20px!important}',
 '#ccNotesOverlay .ccn-card{min-height:320px!important;padding:21px!important;border:1px solid #0000000b;border-radius:17px!important;gap:13px!important;box-shadow:0 6px 18px #1b3c5217!important}',
 '#ccNotesOverlay .ccn-card-title{width:100%;padding:6px 3px;background:transparent;border:0;border-bottom:1px solid #00000019;font-family:inherit;font-size:17px;line-height:1.5;font-weight:800;color:#233f50;min-width:0}',
 '#ccNotesOverlay .ccn-card-title:focus{outline:2px solid #568da5;border-radius:5px}',
 '#ccNotesOverlay textarea{min-height:125px!important;font-size:15px!important;line-height:1.55!important}',
 '#ccNotesOverlay .ccn-list{display:flex;flex-direction:column;gap:8px;margin:0 0 4px}',
 '#ccNotesOverlay .ccn-listrow{display:flex;align-items:center;gap:8px;min-height:32px}',
 '#ccNotesOverlay .ccn-listrow>input[type=checkbox]{width:18px;height:18px;accent-color:#2d806a;flex:0 0 auto}',
 '#ccNotesOverlay .ccn-listrow>input[type=text]{flex:1;min-width:0;background:#ffffff80;border:1px solid #ffffffaa;border-radius:7px;padding:8px 9px;color:#213e51;font-family:inherit;font-size:13px;line-height:1.3}',
 '#ccNotesOverlay .ccn-listrow[data-checked=true]>input[type=text]{text-decoration:line-through;opacity:.55}',
 '#ccNotesOverlay .ccn-listrow button{padding:5px 8px!important}',
 '#ccNotesOverlay .ccn-additem{align-self:flex-start;background:#ffffff90!important}',
 '#ccNotesOverlay .ccn-card[data-done=true] .ccn-card-title{text-decoration:line-through;opacity:.7}',
 '#ccNotesOverlay .ccn-status{max-width:1480px;margin:18px auto}',
 '@media(max-width:700px){#ccNotesOverlay .ccn-shell{padding:17px!important}#ccNotesOverlay .ccn-grid{grid-template-columns:1fr!important;gap:14px!important}#ccNotesOverlay .ccn-card{min-height:280px!important;padding:17px!important}}'
 ].join('');

 document.head.appendChild(s);
}
function mount(){
 const panel=$('ccxCardLibraryPanel');
 if(!panel)return;
 const head=panel.querySelector('.cckl-head')||panel.querySelector('header')||panel;
 let b=$('ccNotesOpen');
 if(b){if(b.parentElement!==head)head.appendChild(b);return;}
 b=document.createElement('button');b.type='button';b.id='ccNotesOpen';
 b.textContent='🗒️ Notlarım';b.setAttribute('aria-label','Kişisel Not Panom ekranını aç');
 b.addEventListener('click',open);head.appendChild(b);
}
function ensure(){
 if($('ccNotesOverlay'))return;
 const root=document.createElement('div');root.id='ccNotesOverlay';root.hidden=true;root.setAttribute('role','main');root.setAttribute('aria-label','Notlarım sayfası');
 root.innerHTML='<section class="ccn-shell"><div class="ccn-head"><div><h2>🗒️ Notlarım</h2><p class="ccn-sub">Notlarını düzenle, maddeleri işaretle ve yapılacaklarını takip et</p></div><button type="button" id="ccNotesClose">← Kütüphaneye Dön</button></div><div class="ccn-toolbar"><button type="button" class="ccn-add" id="ccNotesAdd">＋ Yeni Not</button><button type="button" class="ccn-filter" data-filter="today">Bugün</button><button type="button" class="ccn-filter" data-filter="upcoming">Yaklaşan</button><button type="button" class="ccn-filter" data-filter="all">Tüm Notlar</button><button type="button" class="ccn-filter" data-filter="done">Tamamlananlar</button></div><div class="ccn-grid" id="ccNotesGrid"></div><p class="ccn-status" id="ccNotesStatus" role="status"></p></section>';
 document.body.appendChild(root);
 $('ccNotesClose').onclick=close;$('ccNotesAdd').onclick=add;
 root.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render()}));
 
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
  const checks=Array.isArray(n.checklist)?n.checklist:[];
  const rows=checks.map(item=>{
   const id=escapeText(item.id||'');
   return '<div class="ccn-listrow" data-item="'+id+'" data-checked="'+!!item.done+'"><input type="checkbox" data-action="item-done" aria-label="Madde tamamlandı" '+(item.done?'checked':'')+'><input type="text" data-action="item-text" maxlength="250" placeholder="Yapılacak madde" value="'+escapeText(item.text||'')+'"><button type="button" data-action="item-remove" title="Maddeyi sil">×</button></div>';
  }).join('');
  return '<article class="ccn-card ccn-'+col+'" data-id="'+escapeText(n.id)+'" data-done="'+n.done+'" draggable="true"><div class="ccn-top"><button type="button" data-action="pin" title="Sabitle" aria-pressed="'+n.pinned+'">'+(n.pinned?'📌':'📍')+'</button><select aria-label="Sticker rengi" data-action="color">'+colors.map((c,i)=>'<option value="'+c+'" '+(col===c?'selected':'')+'>'+['Sarı','Mavi','Pembe','Yeşil'][i]+'</option>').join('')+'</select><button type="button" data-action="delete" title="Notu sil">✕</button></div><input class="ccn-card-title" type="text" data-action="title" maxlength="140" placeholder="Başlık" value="'+escapeText(n.title||'')+'"><textarea maxlength="1500" data-action="body" placeholder="Notunu yaz...">'+escapeText(n.body)+'</textarea><div class="ccn-list">'+rows+'</div><button type="button" class="ccn-additem" data-action="item-add">＋ Liste maddesi ekle</button><div class="ccn-bottom"><label><input type="checkbox" data-action="done" '+(n.done?'checked':'')+'> Not tamamlandı</label><input class="ccn-date" aria-label="Bitiş tarihi" type="date" data-action="due_date" value="'+escapeText(n.due_date||'')+'"></div><div class="ccn-bottom"><small>↕ Notu sırala</small><span><button type="button" data-action="left" title="Öne al">←</button><button type="button" data-action="right" title="Sonraya al">→</button></span></div></article>';
 }).join('');
}
async function open(){
 const id=user();if(!id){window.ccToast?.('Not Panom için giriş yapmalısın.','info');return}
 ensure();$('ccNotesOverlay').hidden=false;document.body.style.overflow='hidden';
 if(opened&&owner===id){render();return}
 owner=id;opened=true;notes=[];render();status('Notlar yükleniyor…');
 try{
  db=await window.CC_AUTH.getClient();
  const r=await db.from('cc_personal_sticky_notes').select('id,user_id,title,body,checklist,color,done,pinned,due_date,sort_order,created_at').eq('user_id',id).order('created_at',{ascending:false});
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
  const r=await db.from('cc_personal_sticky_notes').insert({user_id:owner,title:'',body:'',checklist:[],color:colors[notes.length%4],sort_order:notes.length*10}).select().single();
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
function flushTitle(id){
 const t=titleTimers.get(id);if(t)clearTimeout(t);titleTimers.delete(id);
 const n=notes.find(x=>x.id===id);if(n)save(id,{title:n.title||''});
}
function flushChecklist(id){
 const t=checkTimers.get(id);if(t)clearTimeout(t);checkTimers.delete(id);
 const n=notes.find(x=>x.id===id);if(n)save(id,{checklist:n.checklist||[]});
}
function listItem(note,itemId){
 return (Array.isArray(note.checklist)?note.checklist:[]).find(x=>x.id===itemId);
}
function edit(n,patch){Object.assign(n,patch);save(n.id,patch)}
async function remove(n){
 if(!confirm('Bu sticker notu silinsin mi?'))return;
 if(timers.has(n.id))flush(n.id);
 if(titleTimers.has(n.id))flushTitle(n.id);
 if(checkTimers.has(n.id))flushChecklist(n.id);
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
 const root=$('ccxCardLibraryPanel')||document.body;let scheduled=false;
 new MutationObserver(()=>{if(scheduled||$('ccNotesOpen'))return;scheduled=true;setTimeout(()=>{scheduled=false;mount()},100)}).observe(root,{subtree:true,childList:true});
 window.addEventListener('cc-authenticated',mount);
 document.addEventListener('click',e=>{if(e.target.closest?.('#ccxTabCards,#ccxCardLibraryPanel,[data-cc-library]'))setTimeout(mount,250)},true);
 document.addEventListener('input',e=>{
  const t=e.target;if(!t.matches?.('#ccNotesOverlay textarea[data-action="body"]'))return;
  const n=notes.find(x=>x.id===t.closest('[data-id]')?.dataset.id);if(!n)return;
  n.body=t.value;if(timers.has(n.id))clearTimeout(timers.get(n.id));
  timers.set(n.id,setTimeout(()=>flush(n.id),650));status('Kaydedilecek…');
 });
 document.addEventListener('input',e=>{
  const el=e.target,card=el.closest?.('#ccNotesOverlay .ccn-card');
  if(!card||!['title','item-text'].includes(el.dataset.action))return;
  const n=notes.find(x=>x.id===card.dataset.id);if(!n)return;
  if(el.dataset.action==='title'){
   n.title=el.value.slice(0,140);
   if(titleTimers.has(n.id))clearTimeout(titleTimers.get(n.id));
   titleTimers.set(n.id,setTimeout(()=>flushTitle(n.id),550));
  } else {
   const item=listItem(n,el.closest('[data-item]')?.dataset.item);
   if(!item)return;item.text=el.value.slice(0,250);
   if(checkTimers.has(n.id))clearTimeout(checkTimers.get(n.id));
   checkTimers.set(n.id,setTimeout(()=>flushChecklist(n.id),550));
  }
  status('Kaydedilecek…');
 });
 document.addEventListener('focusout',e=>{const t=e.target;const card=t.closest?.('#ccNotesOverlay .ccn-card');if(!card)return;const id=card.dataset.id;if(t.dataset.action==='body'&&timers.has(id))flush(id);if(t.dataset.action==='title'&&titleTimers.has(id))flushTitle(id);if(t.dataset.action==='item-text'&&checkTimers.has(id))flushChecklist(id)});
 document.addEventListener('change',e=>{
  const t=e.target,card=t.closest?.('#ccNotesOverlay .ccn-card');if(!card)return;
  const n=notes.find(x=>x.id===card.dataset.id);if(!n)return;
  if(t.dataset.action==='color'&&colors.includes(t.value)){edit(n,{color:t.value});render()}
  if(t.dataset.action==='done'){edit(n,{done:t.checked});render()}
  if(t.dataset.action==='item-done'){const item=listItem(n,t.closest('[data-item]')?.dataset.item);if(item){if(checkTimers.has(n.id))flushChecklist(n.id);item.done=t.checked;edit(n,{checklist:n.checklist});render()}}
  if(t.dataset.action==='due_date'){edit(n,{due_date:t.value||null});render()}
 });
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('#ccNotesOverlay button[data-action]');if(!b)return;
  const n=notes.find(x=>x.id===b.closest('[data-id]')?.dataset.id);if(!n)return;
  if(b.dataset.action==='pin'){edit(n,{pinned:!n.pinned});render()}
  if(b.dataset.action==='item-add'){if(!Array.isArray(n.checklist))n.checklist=[];if(n.checklist.length>=100){status('Bir notta en fazla 100 madde olabilir.');return}if(checkTimers.has(n.id))flushChecklist(n.id);n.checklist.push({id:window.crypto?.randomUUID?.()||String(Date.now())+Math.random(),text:'',done:false});edit(n,{checklist:n.checklist});render();$('ccNotesGrid')?.querySelector('[data-id="'+n.id+'"] .ccn-listrow:last-child input[type=text]')?.focus()}
  if(b.dataset.action==='item-remove'){const itemId=b.closest('[data-item]')?.dataset.item;if(checkTimers.has(n.id))flushChecklist(n.id);n.checklist=(n.checklist||[]).filter(x=>x.id!==itemId);edit(n,{checklist:n.checklist});render()}
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
 window.addEventListener('cc-logged-out',()=>{for(const t of [...timers.values(),...titleTimers.values(),...checkTimers.values()])clearTimeout(t);timers.clear();titleTimers.clear();checkTimers.clear();notes=[];db=null;owner='';opened=false;$('ccNotesOverlay').hidden=true;document.body.style.overflow=''});
 window.addEventListener('cc-authenticated',()=>{if(owner&&owner!==user()){notes=[];db=null;owner='';opened=false}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();