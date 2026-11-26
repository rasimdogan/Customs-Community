/* Customs Community Notlarim v3 — independent full-page notes, folders and rich formatting */
(function(){
'use strict';
if(window.CC_NOTES_BOARD)return;
window.CC_NOTES_BOARD=true;
const $=id=>document.getElementById(id);
const COLORS=['yellow','blue','pink','green'];
const COLORS_TR=['Sarı','Mavi','Pembe','Yeşil'];
const escapeHtml=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentUser=()=>{const s=window.CC_AUTH?.getSession?.();return s?.access_token?s.user?.id||'':''};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let db=null,uid='',notes=[],folders=[],scope='all',filter='all',loaded=false,loading=false,adding=false,active=false;
const pending=new Map(),timers=new Map();
function status(msg){if($('ccNotesStatus'))$('ccNotesStatus').textContent=msg}
function safeMarkup(input){
 const documentData=new DOMParser().parseFromString('<div>'+String(input||'')+'</div>','text/html');
 const whitelist=new Set(['B','STRONG','I','EM','U','BR','P','DIV','UL','OL','LI']);
 function walk(node){
  if(node.nodeType===3)return escapeHtml(node.textContent);
  if(node.nodeType!==1)return '';
  const inner=Array.from(node.childNodes).map(walk).join('');
  if(!whitelist.has(node.tagName))return inner;
  const tag=node.tagName.toLowerCase();
  return tag==='br'?'<br>':'<'+tag+'>'+inner+'</'+tag+'>';
 }
 return Array.from(documentData.body.firstElementChild?.childNodes||[]).map(walk).join('');
}
function noteText(note){return String(note.body||'')}
function css(){
 if($('ccNotesV3Style'))return;
 const s=document.createElement('style');s.id='ccNotesV3Style';
 s.textContent=[
 '#ccNotesOpen{display:inline-flex;gap:7px;align-items:center;justify-content:center;background:#fff4d9;border:1px solid #e2c57c;color:#705327;border-radius:10px;padding:9px 14px;font-family:inherit;font-size:12px;font-weight:700;line-height:1.3;cursor:pointer}',
 '#ccNotesPage[hidden]{display:none!important}',
 '#ccNotesPage{position:fixed;inset:0;z-index:100700;overflow:auto;background:#f6f8fb;color:#253f53;font-family:inherit}',
 '#ccNotesPage *{box-sizing:border-box}',
 '#ccNotesPage button,#ccNotesPage input,#ccNotesPage select{font-family:inherit}',
 '#ccNotesPage button{cursor:pointer;border:1px solid #d5e0e8;background:white;border-radius:9px;color:#31536b;padding:8px 11px;font-weight:700;font-size:12px}',
 '#ccNotesPage button:focus-visible,#ccNotesPage input:focus-visible,#ccNotesPage [contenteditable]:focus-visible{outline:2px solid #4383a7;outline-offset:2px}',
 '#ccNotesPage .ccn-mainhead{padding:23px clamp(18px,3vw,40px);background:#fff;border-bottom:1px solid #e4eaf0;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}',
 '#ccNotesPage .ccn-heading h2{font-size:clamp(22px,2.4vw,30px);font-weight:800;margin:0;letter-spacing:-.5px;color:#1b4056}',
 '#ccNotesPage .ccn-heading p{margin:4px 0 0;color:#7a8d9a;font-size:12px}',
 '#ccNotesPage .ccn-back{background:#f2f7fb!important}',
 '#ccNotesPage .ccn-layout{display:grid;grid-template-columns:236px minmax(0,1fr);max-width:1600px;margin:auto;min-height:calc(100dvh - 95px)}',
 '#ccNotesPage .ccn-side{background:#fff;border-right:1px solid #e3eaf0;padding:22px 12px;min-width:0}',
 '#ccNotesPage .ccn-sidehead{font-size:11px;font-weight:800;color:#7890a2;text-transform:uppercase;letter-spacing:.7px;margin:0 9px 12px}',
 '#ccNotesPage #ccNotesFolders{display:flex;flex-direction:column;gap:4px}',
 '#ccNotesPage .ccn-folder{display:flex;gap:6px;align-items:center;min-width:0;margin:4px 0}',
 '#ccNotesPage .ccn-folder>button:first-child{flex:1;text-align:left;min-width:0;border:0;background:transparent;padding:10px 12px;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
 '#ccNotesPage .ccn-folder.active{background:#e8f3fa;border-radius:10px}',
 '#ccNotesPage .ccn-folder>button[data-act=folder-menu]{padding:6px;border:0;background:transparent;flex:0 0 auto}',
 '#ccNotesPage .ccn-folder.ccn-drop-target{background:#d5eee5!important;outline:2px dashed #398d73;outline-offset:-2px;border-radius:10px;box-shadow:0 0 0 3px #68ae8c20}',
 '#ccNotesPage .ccn-folder.ccn-drop-target>button:first-child{color:#205d4c;font-weight:850}',

 '#ccNotesPage .ccn-card.ccn-dragging{opacity:.48;outline:2px dashed #568ba2;outline-offset:3px}',

 '#ccNotesPage .ccn-newfolder{width:100%;margin:14px 0 0;border:1px dashed #abc9da!important;background:#f7fbfd!important}',
 '#ccNotesPage .ccn-work{padding:26px clamp(13px,2.8vw,38px);min-width:0}',
 '#ccNotesPage .ccn-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:23px}',
 '#ccNotesPage .ccn-create{background:#246a8a!important;border-color:#246a8a!important;color:#fff!important;padding:11px 15px!important}',
 '#ccNotesPage .ccn-filter[aria-pressed=true]{background:#dbeef8;border-color:#accbdb;color:#245571}',
 '#ccNotesPage .ccn-count{font-size:12px;color:#7891a1;margin-left:auto}',
 '#ccNotesPage .ccn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,345px),1fr));align-items:start;gap:19px}',
 '#ccNotesPage .ccn-card{min-height:318px;border:1px solid #00000008;box-shadow:0 6px 20px #12345313;border-radius:15px;display:flex;flex-direction:column;padding:19px;gap:12px;color:#273f51}',
 '#ccNotesPage .ccn-yellow{background:#fff2bd}#ccNotesPage .ccn-blue{background:#dbedff}#ccNotesPage .ccn-pink{background:#f9e0ed}#ccNotesPage .ccn-green{background:#e0f2db}',
 '#ccNotesPage .ccn-cardhead{display:flex;align-items:center;gap:9px;min-height:48px;cursor:grab;user-select:none}',
 '#ccNotesPage .ccn-cardhead:active{cursor:grabbing}',
 '#ccNotesPage .ccn-cardhead .ccn-pin{flex:0 0 46px;width:46px;height:46px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #ffffffaa;background:#ffffffb0;border-radius:13px;font-size:23px;line-height:1;padding:0;transition:background .15s,transform .15s}',
 '#ccNotesPage .ccn-cardhead .ccn-pin[aria-pressed=true]{background:#fff;border-color:#dfc47e;box-shadow:0 2px 8px #79683520}',
 '#ccNotesPage .ccn-cardhead .ccn-pin:active{transform:scale(.96)}',
 '#ccNotesPage .ccn-cardhead .ccn-headspace{flex:1 1 auto;align-self:stretch;min-width:12px;cursor:grab}',
 '#ccNotesPage .ccn-cardhead .ccn-actions{display:flex;align-items:center;gap:8px;flex:0 0 auto}',
 '#ccNotesPage .ccn-cardhead select{height:36px;max-width:98px;border:1px solid #ffffffb0;background:#ffffffa3;border-radius:10px;padding:0 9px;color:#415967;font-size:12px;font-weight:650;cursor:pointer}',
 '#ccNotesPage .ccn-cardhead .ccn-delete{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #ffffff84;border-radius:10px;background:#ffffff65;color:#6b7782;padding:0;font-size:19px;line-height:1}',
 '#ccNotesPage .ccn-cardhead .ccn-delete:hover{background:#ffe0db;border-color:#edb5ab;color:#a73b35}',
 '@media(max-width:420px){#ccNotesPage .ccn-cardhead .ccn-pin{width:43px;height:43px;flex-basis:43px}#ccNotesPage .ccn-cardhead select{max-width:87px}#ccNotesPage .ccn-cardhead .ccn-actions{gap:6px}}',
 '#ccNotesPage .ccn-title{border:0;border-bottom:1px solid #00000015;background:transparent;outline:0;width:100%;padding:6px 1px;font-size:17px;font-weight:800;color:#213d51;line-height:1.4}',
 '#ccNotesPage .ccn-richbar{display:flex;align-items:center;gap:5px}',
 '#ccNotesPage .ccn-richbar button{background:#ffffff81;border:0;padding:5px 9px;font-size:13px}',
 '#ccNotesPage .ccn-richbar button[data-command=bold]{font-weight:900}#ccNotesPage .ccn-richbar button[data-command=italic]{font-style:italic}',
 '#ccNotesPage .ccn-editor{background:#ffffff3b;min-height:102px;max-height:340px;overflow-y:auto;border-radius:6px;font-size:14px;line-height:1.65;padding:8px;overflow-wrap:anywhere;outline-offset:2px}',
 '#ccNotesPage .ccn-editor:empty:before{content:attr(data-placeholder);color:#6c8492;pointer-events:none}',
 '#ccNotesPage .ccn-editor ul,#ccNotesPage .ccn-editor ol{padding-left:22px;margin:7px 0}',
 '#ccNotesPage .ccn-checks{display:flex;flex-direction:column;gap:8px}',
 '#ccNotesPage .ccn-checkrow{display:flex;align-items:center;gap:7px}',
 '#ccNotesPage .ccn-checkrow input[type=checkbox]{height:17px;width:17px;flex:0 0 auto;accent-color:#237b6c;cursor:pointer}',
 '#ccNotesPage .ccn-checkrow input[type=text]{min-width:0;flex:1;background:#ffffff70;border:1px solid #ffffffd0;border-radius:7px;padding:9px 8px;color:#243f51;font-size:13px;line-height:1.4}',
 '#ccNotesPage .ccn-checkrow[data-done=true] input[type=text]{text-decoration:line-through;opacity:.57}',
 '#ccNotesPage .ccn-checkrow button{border:0;background:transparent;padding:4px 7px}',
 '#ccNotesPage .ccn-addline{align-self:flex-start;border:0!important;background:#ffffff83!important;font-size:12px!important}',
 '#ccNotesPage .ccn-opts{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap;font-size:11px;margin-top:7px}',
 '#ccNotesPage .ccn-opts label{display:inline-flex;align-items:center;gap:5px;cursor:pointer;font-weight:700}',
 '#ccNotesPage .ccn-opts input[type=date]{border:1px solid #00000012;border-radius:6px;background:#ffffff90;color:#40586c;padding:6px;max-width:132px;font-size:11px}',
 '#ccNotesPage .ccn-bottom{display:flex;justify-content:space-between;align-items:center;gap:7px;flex-wrap:wrap}',
 '#ccNotesPage .ccn-dest{max-width:165px;width:100%;border:1px solid #00000015;border-radius:7px;background:#ffffff99;color:#40586c;padding:7px;font-size:11px}',
 '#ccNotesPage .ccn-end{opacity:.62}#ccNotesPage .ccn-end .ccn-title{text-decoration:line-through}',
 '#ccNotesPage .ccn-blank{padding:35px;text-align:center;grid-column:1/-1;background:white;border-radius:13px;border:1px dashed #b3c8d7;color:#708999}',
 '#ccNotesPage #ccNotesStatus{padding:12px 3px;font-size:12px;color:#638095;min-height:25px}',
 '@media(max-width:760px){#ccNotesPage #ccNotesFolders{flex-direction:row;gap:6px}#ccNotesPage .ccn-layout{grid-template-columns:1fr}#ccNotesPage .ccn-side{padding:10px 15px;border-right:0;border-bottom:1px solid #e3eaf0;display:flex;align-items:center;overflow-x:auto;gap:6px}#ccNotesPage .ccn-sidehead{display:none}#ccNotesPage .ccn-folder{flex:0 0 auto;white-space:nowrap}#ccNotesPage .ccn-folder>button:first-child{padding:8px 10px}#ccNotesPage .ccn-newfolder{width:auto;white-space:nowrap;margin:0}#ccNotesPage .ccn-work{padding:18px 15px}#ccNotesPage .ccn-grid{grid-template-columns:1fr;gap:14px}}',
 '@media(min-width:761px) and (max-width:1100px){#ccNotesPage .ccn-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'
 ].join('');
 document.head.appendChild(s);
}
function mountButton(){
 const parent=$('ccxCardLibraryPanel');if(!parent)return;
 const header=parent.querySelector('.cckl-head')||parent.querySelector('header')||parent;
 let btn=$('ccNotesOpen');
 if(!btn){btn=document.createElement('button');btn.id='ccNotesOpen';btn.type='button';btn.textContent='🗒️ Notlarım';btn.onclick=open}
 if(btn.parentElement!==header)header.appendChild(btn);
}
function buildPage(){
 if($('ccNotesPage'))return;
 const page=document.createElement('div');page.id='ccNotesPage';page.hidden=true;
 page.setAttribute('role','main');page.setAttribute('aria-label','Notlarım');
 page.innerHTML='<header class="ccn-mainhead"><div class="ccn-heading"><h2>🗒️ Notlarım</h2><p>Kişisel notlar, yapılacaklar ve kontrol listeleri</p></div><button type="button" id="ccNotesClose" class="ccn-back">← Kütüphaneye Dön</button></header><div class="ccn-layout"><aside class="ccn-side"><span class="ccn-sidehead">Klasörler</span><div id="ccNotesFolders"></div><button type="button" id="ccNotesNewFolder" class="ccn-newfolder">＋ Yeni Klasör</button></aside><main class="ccn-work"><div class="ccn-toolbar"><button type="button" id="ccNotesAdd" class="ccn-create">＋ Yeni Not</button><button type="button" class="ccn-filter" data-filter="all">Tüm Notlar</button><button type="button" class="ccn-filter" data-filter="today">Bugün</button><button type="button" class="ccn-filter" data-filter="upcoming">Yaklaşan</button><button type="button" class="ccn-filter" data-filter="done">Tamamlananlar</button><span class="ccn-count" id="ccNotesCount"></span></div><div id="ccNotesGrid" class="ccn-grid"></div><div id="ccNotesStatus" role="status"></div></main></div>';
 document.body.appendChild(page);
 $('ccNotesClose').onclick=close;
 $('ccNotesAdd').onclick=add;
 $('ccNotesNewFolder').onclick=createFolder;
 page.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{flushAll();filter=b.dataset.filter;render()});
}
function countInFolder(id){return notes.filter(n=>id==='all'||(id==='unfiled'?!n.folder_id:n.folder_id===id)).length}
function renderFolders(){
 const root=$('ccNotesFolders');if(!root)return;
 const items=[{id:'all',name:'Tüm Notlar',icon:'📋'},{id:'unfiled',name:'Klasörsüz',icon:'🗒️'},...folders.map(f=>({id:f.id,name:f.name,icon:'📁'}))];
 root.innerHTML=items.map(x=>'<div class="ccn-folder '+(scope===x.id?'active':'')+'"><button type="button" data-act="folder-open" data-folder="'+escapeHtml(x.id)+'" title="'+escapeHtml(x.name)+'">'+x.icon+' '+escapeHtml(x.name)+' ('+countInFolder(x.id)+')</button>'+(x.id!=='all'&&x.id!=='unfiled'?'<button type="button" data-act="folder-menu" data-folder="'+escapeHtml(x.id)+'" aria-label="Klasör işlemleri">⋯</button>':'')+'</div>').join('');
}
function visible(n){
 if(scope==='unfiled'&&n.folder_id)return false;
 if(scope!=='all'&&scope!=='unfiled'&&n.folder_id!==scope)return false;
 if(filter==='done')return n.done;
 if(filter==='today')return !n.done&&(!n.due_date||n.due_date<=today());
 if(filter==='upcoming')return !n.done&&!!n.due_date&&n.due_date>today();
 return true;
}
function ordered(){return notes.filter(visible).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||a.sort_order-b.sort_order||new Date(b.created_at)-new Date(a.created_at))}
function render(){
 renderFolders();
 document.querySelectorAll('#ccNotesPage .ccn-filter').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
 const list=ordered(),grid=$('ccNotesGrid');if(!grid)return;
 $('ccNotesCount').textContent=list.length+' not';
 if(!list.length){grid.innerHTML='<div class="ccn-blank">Bu alanda not yok. <b>＋ Yeni Not</b> ile başlayabilirsin.</div>';return}
 grid.innerHTML=list.map(n=>{
  const color=COLORS.includes(n.color)?n.color:'yellow';
  const checks=Array.isArray(n.checklist)?n.checklist:[];
  const foldersOptions='<option value="">📂 Klasörsüz</option>'+folders.map(f=>'<option value="'+escapeHtml(f.id)+'" '+(n.folder_id===f.id?'selected':'')+'>'+escapeHtml(f.name)+'</option>').join('');
  const lines=checks.map(item=>'<div class="ccn-checkrow" data-item="'+escapeHtml(item.id)+'" data-done="'+!!item.done+'"><input type="checkbox" data-act="check-done" aria-label="Maddeyi tamamla" '+(item.done?'checked':'')+'><input type="text" data-act="check-text" maxlength="250" placeholder="Madde yaz..." value="'+escapeHtml(item.text||'')+'"><button type="button" data-act="check-delete" aria-label="Maddeyi sil">×</button></div>').join('');
  const html=n.body_rich?safeMarkup(n.body_rich):escapeHtml(n.body||'').replace(/\n/g,'<br>');
  return '<article class="ccn-card ccn-'+color+(n.done?' ccn-end':'')+'" data-id="'+escapeHtml(n.id)+'" draggable="true"><div class="ccn-cardhead" title="Boş alandan tutup kartı sürükleyebilirsin"><button type="button" class="ccn-pin" data-act="pin" aria-pressed="'+!!n.pinned+'" aria-label="'+(n.pinned?'Sabitlemeyi kaldır':'Notu başa sabitle')+'" title="'+(n.pinned?'Sabitlemeyi kaldır':'Notu başa sabitle')+'">'+(n.pinned?'📌':'📍')+'</button><span class="ccn-headspace" aria-hidden="true"></span><div class="ccn-actions"><select data-act="color" aria-label="Not rengi">'+COLORS.map((c,i)=>'<option value="'+c+'" '+(color===c?'selected':'')+'>'+COLORS_TR[i]+'</option>').join('')+'</select><button type="button" class="ccn-delete" data-act="delete" aria-label="Notu sil" title="Notu sil">×</button></div></div><input class="ccn-title" data-act="title" type="text" maxlength="140" placeholder="Not başlığı" value="'+escapeHtml(n.title||'')+'"><div class="ccn-richbar" role="toolbar" aria-label="Yazı biçimlendirme"><button type="button" data-command="bold" title="Kalın">B</button><button type="button" data-command="italic" title="İtalik">I</button><button type="button" data-command="underline" title="Altı çizili">U̲</button><button type="button" data-command="insertUnorderedList" title="Madde işaretleri">• Liste</button><button type="button" data-command="insertOrderedList" title="Numaralı liste">1. Liste</button></div><div class="ccn-editor" data-act="body-rich" contenteditable="true" role="textbox" aria-label="Not içeriği" aria-multiline="true" data-placeholder="Notunu yaz...">'+html+'</div><div class="ccn-checks">'+lines+'</div><button type="button" class="ccn-addline" data-act="check-add">＋ Yapılacak madde ekle</button><div class="ccn-opts"><label><input type="checkbox" data-act="done" '+(n.done?'checked':'')+'> Not tamamlandı</label><input type="date" data-act="due_date" aria-label="Bitiş tarihi" value="'+escapeHtml(n.due_date||'')+'"></div><div class="ccn-bottom"><select class="ccn-dest" data-act="folder" aria-label="Notun klasörü">'+foldersOptions+'</select><span><button type="button" data-act="left" title="Sola taşı">←</button><button type="button" data-act="right" title="Sağa taşı">→</button></span></div></article>';
 }).join('');
}
async function open(){
 if(!currentUser()){window.ccToast?.('Notlarım için giriş yapmalısın.','info');return}
 buildPage();$('ccNotesPage').hidden=false;document.body.style.overflow='hidden';active=true;
 if(loaded&&uid===currentUser()){render();return}
 await load();
}
async function load(){
 const id=currentUser();if(!id||loading)return;
 loading=true;uid=id;status('Notlar yükleniyor…');
 try{
  db=await window.CC_AUTH.getClient();
  const [nr,fr]=await Promise.all([
   db.from('cc_personal_sticky_notes').select('id,user_id,title,body,body_rich,checklist,color,done,pinned,due_date,sort_order,created_at,folder_id').eq('user_id',id).order('created_at',{ascending:false}),
   db.from('cc_personal_note_folders').select('id,user_id,name,sort_order,created_at').eq('user_id',id).order('sort_order',{ascending:true})
  ]);
  if(nr.error)throw nr.error;if(fr.error)throw fr.error;
  if(currentUser()!==id)return;
  notes=nr.data||[];folders=fr.data||[];loaded=true;render();status('Notların kaydediliyor ve hesabınla eşitleniyor.');
 }catch(e){loaded=false;status('Notlar alınamadı: '+(e.message||String(e)))}
 finally{loading=false}
}
function close(){
 flushAll();$('ccNotesPage').hidden=true;active=false;document.body.style.overflow='';
}
function schedule(id,field,patch){
 const key=id+':'+field,old=timers.get(key);
 if(old)clearTimeout(old);
 timers.set(key,setTimeout(()=>{timers.delete(key);save(id,patch())},600));
}
function flushAll(){
 for(const [key,handle] of [...timers.entries()]){
  clearTimeout(handle);timers.delete(key);
  const index=key.indexOf(':'),id=key.slice(0,index),field=key.slice(index+1);
  const note=notes.find(n=>n.id===id);if(!note)continue;
  if(field==='title')save(id,{title:note.title||''});
  if(field==='body')save(id,{body:note.body||'',body_rich:note.body_rich||''});
  if(field==='checklist')save(id,{checklist:note.checklist||[]});
 }
}
function save(id,patch){
 if(currentUser()!==uid||!db)return Promise.resolve();
 const prior=pending.get(id)||Promise.resolve();
 const job=prior.catch(()=>{}).then(async()=>{
  if(currentUser()!==uid)return;
  const res=await db.from('cc_personal_sticky_notes').update({...patch,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',uid).select('id').maybeSingle();
  if(res.error||!res.data)throw res.error||new Error('Not kaydedilemedi');
 });
 pending.set(id,job);status('Kaydediliyor…');
 job.then(()=>{if(pending.get(id)===job)status('Kaydedildi ✓')}).catch(e=>status('Kaydetme hatası: '+e.message));
 return job;
}
async function add(){
 if(!db||currentUser()!==uid||adding)return;
 adding=true;
 try{
  const folder_id=scope==='all'||scope==='unfiled'?null:scope;
  const res=await db.from('cc_personal_sticky_notes').insert({user_id:uid,title:'',body:'',body_rich:'',checklist:[],color:COLORS[notes.length%4],folder_id,sort_order:notes.length*10}).select().single();
  if(res.error)throw res.error;
  notes.unshift(res.data);filter='all';render();status('Yeni not eklendi.');
  $('ccNotesGrid')?.querySelector('[data-id="'+res.data.id+'"] [data-act=title]')?.focus();
 }catch(e){status('Not ekleme hatası: '+e.message)}finally{adding=false}
}
async function createFolder(){
 if(!db||currentUser()!==uid)return;
 const name=prompt('Yeni klasör adı:');if(!name||!name.trim())return;
 const clean=name.trim().slice(0,80);
 try{
  const r=await db.from('cc_personal_note_folders').insert({user_id:uid,name:clean,sort_order:folders.length*10}).select().single();
  if(r.error)throw r.error;folders.push(r.data);scope=r.data.id;render();status('Klasör oluşturuldu.');
 }catch(e){status('Klasör oluşturulamadı: '+e.message)}
}
async function folderMenu(id){
 const folder=folders.find(f=>f.id===id);if(!folder)return;
 const action=prompt('Klasör için R = yeniden adlandır, S = sil', 'R');
 if(action===null)return;
 if(action.trim().toLocaleUpperCase('tr-TR')==='R'){
  const name=prompt('Klasör adı:',folder.name);if(!name||!name.trim())return;
  const r=await db.from('cc_personal_note_folders').update({name:name.trim().slice(0,80)}).eq('id',id).eq('user_id',uid).select().single();
  if(r.error){status('Ad değiştirilemedi: '+r.error.message);return}
  folder.name=r.data.name;render();status('Klasör adı güncellendi.');
 }else if(action.trim().toLocaleUpperCase('tr-TR')==='S'){
  if(!confirm('"'+folder.name+'" klasörü silinsin mi? İçindeki notlar Klasörsüz alanına taşınacak.'))return;
  const r=await db.from('cc_personal_note_folders').delete().eq('id',id).eq('user_id',uid).select('id').maybeSingle();
  if(r.error||!r.data){status('Klasör silinemedi: '+(r.error?.message||''));return}
  folders=folders.filter(f=>f.id!==id);notes.forEach(n=>{if(n.folder_id===id)n.folder_id=null});
  scope='unfiled';render();status('Klasör silindi; notların korundu.');
 }
}
function change(note,patch){Object.assign(note,patch);save(note.id,patch)}
function queueChecks(note){
 const patch=()=>({checklist:note.checklist||[]});
 schedule(note.id,'checklist',patch);
}
function addItem(note){
 if(!Array.isArray(note.checklist))note.checklist=[];
 if(note.checklist.length>=100){status('Bir notta en fazla 100 madde olabilir.');return}
 const id=window.crypto?.randomUUID?.()||String(Date.now())+String(Math.random());
 note.checklist.push({id,text:'',done:false});
 queueChecks(note);
 const card=$('ccNotesGrid')?.querySelector('[data-id="'+note.id+'"]');
 if(!card)return;
 const list=card.querySelector('.ccn-checks');
 const row=document.createElement('div');row.className='ccn-checkrow';row.dataset.item=id;row.dataset.done='false';
 row.innerHTML='<input type="checkbox" data-act="check-done" aria-label="Maddeyi tamamla"><input type="text" data-act="check-text" maxlength="250" placeholder="Madde yaz..."><button type="button" data-act="check-delete" aria-label="Maddeyi sil">×</button>';
 list.appendChild(row);
 row.querySelector('[data-act=check-text]').focus();
}
async function removeNote(note){
 if(!confirm('Not silinsin mi?'))return;
 flushAll();
 try{
  await(pending.get(note.id)||Promise.resolve());
  const r=await db.from('cc_personal_sticky_notes').delete().eq('id',note.id).eq('user_id',uid).select('id').maybeSingle();
  if(r.error||!r.data)throw r.error||Error('Silinemedi');
  notes=notes.filter(n=>n.id!==note.id);render();status('Not silindi.');
 }catch(e){status('Silme hatası: '+e.message)}
}
function move(note,direction){
 const list=ordered(),pos=list.findIndex(n=>n.id===note.id),target=list[pos+direction];
 if(!target)return;
 const a=note.sort_order,b=target.sort_order;
 if(a===b){list.forEach((n,i)=>n.sort_order=i*10)}
 const temp=note.sort_order;note.sort_order=target.sort_order;target.sort_order=temp;
 save(note.id,{sort_order:note.sort_order});save(target.id,{sort_order:target.sort_order});render();
}
function init(){
 css();buildPage();mountButton();
 let mountScheduled=false;
 const root=$('ccxCardLibraryPanel')||document.body;
 new MutationObserver(records=>{
  if($('ccNotesOpen')||mountScheduled)return;
  if(!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1)))return;
  mountScheduled=true;setTimeout(()=>{mountScheduled=false;mountButton()},300);
 }).observe(root,{subtree:true,childList:true});
 window.addEventListener('cc-authenticated',()=>{mountButton();if(uid&&uid!==currentUser()){loaded=false;notes=[];folders=[];uid=''}});
 window.addEventListener('cc-logged-out',()=>{
  for(const t of timers.values())clearTimeout(t);timers.clear();
  db=null;uid='';loaded=false;notes=[];folders=[];active=false;$('ccNotesPage').hidden=true;document.body.style.overflow='';
 });
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('#ccNotesPage button[data-act]');
  if(b){
   const action=b.dataset.act;
   if(action==='folder-open'){flushAll();scope=b.dataset.folder;render();return}
   if(action==='folder-menu'){folderMenu(b.dataset.folder);return}
   const card=b.closest('.ccn-card'),n=notes.find(x=>x.id===card?.dataset.id);if(!n)return;
   if(action==='pin'){flushAll();change(n,{pinned:!n.pinned});render()}
   else if(action==='delete')removeNote(n);
   else if(action==='check-add')addItem(n);
   else if(action==='check-delete'){
    const id=b.closest('.ccn-checkrow')?.dataset.item;
    n.checklist=(n.checklist||[]).filter(x=>x.id!==id);queueChecks(n);
    b.closest('.ccn-checkrow')?.remove();renderFolders();status('Madde kaldırıldı.');
   }else if(action==='left'||action==='right'){flushAll();move(n,action==='left'?-1:1)}
   return;
  }
  const fmt=e.target.closest?.('#ccNotesPage .ccn-richbar button[data-command]');
  if(fmt){
   const card=fmt.closest('.ccn-card'),editor=card?.querySelector('.ccn-editor');
   if(!editor)return;
   editor.focus();document.execCommand(fmt.dataset.command,false,null);
   editor.dispatchEvent(new Event('input',{bubbles:true}));
  }
 });
 document.addEventListener('mousedown',e=>{if(e.target.closest?.('#ccNotesPage .ccn-richbar button[data-command]'))e.preventDefault()});
 document.addEventListener('input',e=>{
  const el=e.target,card=el.closest?.('#ccNotesPage .ccn-card');if(!card)return;
  const n=notes.find(x=>x.id===card.dataset.id);if(!n)return;
  if(el.dataset.act==='title'){
   n.title=el.value;
   schedule(n.id,'title',()=>({title:n.title||''}));
  }else if(el.dataset.act==='check-text'){
   const item=(n.checklist||[]).find(x=>x.id===el.closest('.ccn-checkrow')?.dataset.item);if(!item)return;
   item.text=el.value;
   queueChecks(n);
  }else if(el.dataset.act==='body-rich'){
   const plain=el.innerText||'';
   const html=safeMarkup(el.innerHTML);
   if(plain.length>1500||html.length>12000){status('Not metni en fazla 1500 karakter olabilir.');return}
   n.body=plain;n.body_rich=html;
   schedule(n.id,'body',()=>({body:n.body||'',body_rich:n.body_rich||''}));
  }
 });
 document.addEventListener('keydown',e=>{
  const el=e.target;
  if(el.matches?.('#ccNotesPage input[data-act=check-text]')&&e.key==='Enter'){
   e.preventDefault();
   const n=notes.find(x=>x.id===el.closest('.ccn-card')?.dataset.id);
   if(!n)return;
   flushAll();addItem(n);
  }
 });
 document.addEventListener('focusout',e=>{
  const el=e.target,card=el.closest?.('#ccNotesPage .ccn-card');if(!card)return;
  if(['title','check-text','body-rich'].includes(el.dataset.act))flushAll();
 });
 document.addEventListener('change',e=>{
  const el=e.target,card=el.closest?.('#ccNotesPage .ccn-card');if(!card)return;
  const n=notes.find(x=>x.id===card.dataset.id);if(!n)return;
  if(el.dataset.act==='check-done'){
   const item=(n.checklist||[]).find(x=>x.id===el.closest('.ccn-checkrow')?.dataset.item);
   if(!item)return;item.done=el.checked;queueChecks(n);
   el.closest('.ccn-checkrow').dataset.done=String(item.done);return;
  }
  if(el.dataset.act==='color'&&COLORS.includes(el.value)){
   change(n,{color:el.value});
   card.classList.remove(...COLORS.map(x=>'ccn-'+x));card.classList.add('ccn-'+el.value);return;
  }
  if(el.dataset.act==='done'){change(n,{done:el.checked});card.classList.toggle('ccn-end',el.checked);return}
  if(el.dataset.act==='due_date'){change(n,{due_date:el.value||null});return}
  if(el.dataset.act==='folder'){flushAll();change(n,{folder_id:el.value||null});render();return}
 });
 let dragging=null,dropBusy=false;
 const clearDrop=()=>{
  document.querySelectorAll('#ccNotesPage .ccn-drop-target').forEach(x=>x.classList.remove('ccn-drop-target'));
  document.querySelectorAll('#ccNotesPage .ccn-dragging').forEach(x=>x.classList.remove('ccn-dragging'));
 };
 function folderFromElement(el){
  const folderEl=el?.closest?.('#ccNotesPage .ccn-folder');
  if(!folderEl)return null;
  const id=folderEl.querySelector('[data-act=folder-open]')?.dataset.folder;
  if(!id||id==='all')return null;
  if(id!=='unfiled'&&!folders.some(f=>f.id===id))return null;
  return {element:folderEl,id};
 }
 async function moveToFolder(noteId,destination){
  if(dropBusy||currentUser()!==uid||!db)return;
  const note=notes.find(n=>n.id===noteId);
  if(!note)return;
  const folder_id=destination==='unfiled'?null:destination;
  if(folder_id!==null&&!folders.some(f=>f.id===folder_id))return;
  if(note.folder_id===folder_id){status('Not zaten bu klasörde.');return}
  dropBusy=true;
  try{
   flushAll();
   await (pending.get(noteId)||Promise.resolve());
   if(currentUser()!==uid)return;
   status('Not klasöre taşınıyor…');
   const {data,error}=await db.from('cc_personal_sticky_notes')
    .update({folder_id,updated_at:new Date().toISOString()})
    .eq('id',noteId).eq('user_id',uid).select('id,folder_id').maybeSingle();
   if(error||!data)throw error||new Error('Klasör değişikliği kaydedilemedi.');
   if(currentUser()!==uid)return;
   note.folder_id=data.folder_id;
   render();
   status(folder_id===null?'Not Klasörsüz alanına taşındı.':'Not "'+(folders.find(f=>f.id===folder_id)?.name||'Klasör')+'" klasörüne taşındı.');
  }catch(e){status('Not taşınamadı: '+(e?.message||String(e))+'. Not eski klasöründe duruyor.')}
  finally{dropBusy=false}
 }
 document.addEventListener('dragstart',e=>{
  const card=e.target.closest?.('#ccNotesPage .ccn-card');
  if(!card||dropBusy)return;
  // The card and its empty header space are draggable; editor fields and controls are not.
  if(e.target.closest('input,[contenteditable],select,button,textarea')){e.preventDefault();return}
  dragging=card.dataset.id;
  card.classList.add('ccn-dragging');
  if(e.dataTransfer){
   e.dataTransfer.effectAllowed='move';
   e.dataTransfer.setData('text/plain','cc-note:'+dragging);
  }
 });
 document.addEventListener('dragover',e=>{
  if(!dragging||dropBusy)return;
  const target=folderFromElement(e.target);
  const card=e.target.closest?.('#ccNotesPage .ccn-card');
  clearDrop();
  if(target){
   e.preventDefault();
   if(e.dataTransfer)e.dataTransfer.dropEffect='move';
   target.element.classList.add('ccn-drop-target');
  }else if(card){
   e.preventDefault();
   if(e.dataTransfer)e.dataTransfer.dropEffect='move';
  }
 });
 document.addEventListener('drop',e=>{
  if(!dragging||dropBusy)return;
  const noteId=dragging,target=folderFromElement(e.target);
  const card=e.target.closest?.('#ccNotesPage .ccn-card');
  dragging=null;clearDrop();
  if(target){
   e.preventDefault();
   void moveToFolder(noteId,target.id);
   return;
  }
  if(!card)return;
  e.preventDefault();
  const list=ordered(),start=list.findIndex(n=>n.id===noteId),end=list.findIndex(n=>n.id===card.dataset.id);
  if(start<0||end<0||start===end)return;
  flushAll();
  const [item]=list.splice(start,1);list.splice(end,0,item);
  list.forEach((n,i)=>{if(n.sort_order!==i*10){n.sort_order=i*10;save(n.id,{sort_order:n.sort_order})}});
  render();
 });
 document.addEventListener('dragend',()=>{dragging=null;clearDrop()});
 window.CC_NOTES_OPEN=open;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();