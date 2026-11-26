/* Public library folder navigation and follow label sync. */
(function(){
'use strict';
if(window.CC_SOCIAL_V2)return;
window.CC_SOCIAL_V2=true;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').toLocaleLowerCase('tr-TR').replace(/\s+/g,' ').trim();
const me=()=>window.CC_AUTH?.getSession?.()?.user?.id;
let db=null, owner=null,folders=[],cards=[];
function css(){
 if(document.getElementById('ccSocialV2Css'))return;
 const s=document.createElement('style');s.id='ccSocialV2Css';
 s.textContent='#ccPublicFolders{display:flex;flex-wrap:wrap;gap:7px;padding:12px 0;margin:9px 0;border-top:1px solid #dce7ef}#ccPublicFolders button{background:#f2f8fc;border:1px solid #c6d8e6;border-radius:10px;padding:9px 11px;color:#254a65;cursor:pointer;font-weight:700;font-size:12px}#ccFolderBrowse{position:fixed;inset:0;z-index:100500;background:#061a2bb8;display:flex;align-items:center;justify-content:center;padding:14px}#ccFolderBrowse[hidden]{display:none!important}#ccFolderBrowse *{box-sizing:border-box}#ccFolderBrowse>section{width:min(820px,100%);max-height:88vh;overflow:auto;background:#f7fafc;color:#253f55;border-radius:18px;padding:20px}#ccFolderBrowse header{display:flex;align-items:center;justify-content:space-between;gap:10px}#ccFolderBrowse h2{font-size:20px;margin:0}#ccFolderBrowse .ccf-grid{display:grid;grid-template-columns:170px 1fr;gap:14px;margin-top:17px}#ccFolderBrowse .ccf-nav{display:flex;flex-direction:column;gap:7px}#ccFolderBrowse button{cursor:pointer;background:#f0f6fa;color:#214963;border:1px solid #c6d9e5;border-radius:9px;padding:9px;font-weight:750}#ccFolderBrowse button[aria-pressed=true]{background:#286a92;color:white}#ccFolderBrowse .ccf-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:10px;align-content:start}#ccFolderBrowse article{border:1px solid #d9e6ef;border-radius:11px;background:#fff;padding:13px;overflow-wrap:anywhere}#ccFolderBrowse article h3{font-size:14px;margin:0 0 7px;color:#203b51}#ccFolderBrowse article p{font-size:12px;line-height:1.6;color:#52687b;white-space:pre-wrap}#ccFolderBrowse article small{color:#58748a}@media(max-width:600px){#ccFolderBrowse .ccf-grid{grid-template-columns:1fr}#ccFolderBrowse .ccf-nav{flex-direction:row;overflow-x:auto}#ccFolderBrowse .ccf-nav button{white-space:nowrap}}';
 document.head.appendChild(s);
}
function header(){
 return [...document.querySelectorAll('h2,h3,h4,strong,span')].find(n=>n.children.length===0&&!n.closest('#ccFolderBrowse,#ccPublicFolders')&&/^(kart kütüphanesi|kart kütüphanem|kütüphanesi|kartları)$/.test(norm(n.textContent)));
}
function mount(){
 if(!owner||owner===me())return;
 const h=header();if(!h)return;
 let bar=document.getElementById('ccPublicFolders');
 if(!bar){bar=document.createElement('nav');bar.id='ccPublicFolders';bar.setAttribute('aria-label','Üyenin kart klasörleri');}
 if(!h.parentElement?.contains(bar))h.insertAdjacentElement('afterend',bar);
 const signature=owner+':'+folders.map(f=>f.folder_id+f.card_count).join(',');
 if(bar.dataset.signature===signature)return;bar.dataset.signature=signature;
 bar.innerHTML='<button type="button" data-ccfolder="all">📚 Tüm kartlar ('+cards.length+')</button>'+
 folders.map(f=>'<button type="button" data-ccfolder="'+esc(f.folder_id)+'">📁 '+esc(f.folder_name)+' ('+f.card_count+')</button>').join('')+
 (cards.some(c=>!c.folder_id)?'<button type="button" data-ccfolder="other">📁 Klasörsüz ('+cards.filter(c=>!c.folder_id).length+')</button>':'');
 bar.querySelectorAll('button').forEach(b=>b.onclick=()=>browse(b.dataset.ccfolder));
}
function browse(selected){
 let root=document.getElementById('ccFolderBrowse');
 if(!root){
  root=document.createElement('div');root.id='ccFolderBrowse';root.hidden=true;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.innerHTML='<section><header><h2>📁 Kart Kütüphanesi</h2><button type="button" id="ccfClose">Kapat ✕</button></header><div class="ccf-grid"><nav class="ccf-nav"></nav><div class="ccf-cards"></div></div></section>';
  document.body.appendChild(root);
  root.querySelector('#ccfClose').onclick=()=>root.hidden=true;
  root.addEventListener('click',e=>{if(e.target===root)root.hidden=true});
  root.addEventListener('keydown',e=>{if(e.key==='Escape')root.hidden=true});
 }
 const options=[{id:'all',name:'Tüm kartlar',count:cards.length},...folders.map(x=>({id:x.folder_id,name:x.folder_name,count:x.card_count}))];
 if(cards.some(x=>!x.folder_id))options.push({id:'other',name:'Klasörsüz',count:cards.filter(x=>!x.folder_id).length});
 root.querySelector('.ccf-nav').innerHTML=options.map(x=>'<button type="button" data-folder="'+esc(x.id)+'" aria-pressed="'+(selected===x.id)+'">'+esc(x.name)+' ('+x.count+')</button>').join('');
 root.querySelectorAll('[data-folder]').forEach(b=>b.onclick=()=>browse(b.dataset.folder));
 const shown=cards.filter(x=>selected==='all'||(selected==='other'?!x.folder_id:x.folder_id===selected));
 root.querySelector('.ccf-cards').innerHTML=shown.length?shown.map(x=>'<article><h3>'+esc(x.title)+'</h3>'+(x.code?'<small>'+esc(x.code)+'</small>':'')+'<p>'+esc(x.body||'Kart açıklaması bulunmuyor.')+'</p></article>').join(''):'<p>Bu klasörde görüntülenebilen kart bulunmuyor.</p>';
 root.hidden=false;
}
async function loadOwner(p_owner){
 if(!db||!p_owner||p_owner===me())return;
 owner=p_owner;
 try{
  const [a,b]=await Promise.all([db.rpc('cc_public_library_folders',{p_owner}),db.rpc('cc_public_library_folder_cards',{p_owner})]);
  if(a.error)throw a.error;if(b.error)throw b.error;
  if(owner!==p_owner)return;
  folders=a.data||[];cards=b.data||[];
  document.getElementById('ccPublicFolders')?.remove();mount();
 }catch(e){console.warn('Klasör bilgileri alınamadı',e)}
}
async function setup(){
 try{
  db=await window.CC_AUTH?.getClient?.();
  if(!db||db.__ccFolderReaderWrapped)return;
  const orig=db.rpc.bind(db);
  // Read-only folder extension. Follow controls are managed directly by CCCommunity.
  db.rpc=function(name,args,options){
   const result=orig(name,args,options);
   if(name==='cc_card_public_library'&&args?.p_owner&&args.p_owner!==me()){
    Promise.resolve(result).then(()=>loadOwner(args.p_owner)).catch(()=>{});
   }
   return result;
  };
  db.__ccFolderReaderWrapped=true;
 }catch(e){console.warn('Klasör bağlantısı kurulamadı',e)}
}

/* Hide post-header category/follow-status chips without changing the feed, follow state or post data. */
function hidePostHeaderChips(){
 const matches=[...document.querySelectorAll('span,small,strong,button,a,div')].filter(node=>
  node.children.length===0 && /^(Genel|Takiptesin)$/i.test((node.textContent||'').trim()));
 for(const node of matches){
  if(node.dataset.ccHiddenPostChip==='1')continue;
  let parent=node.parentElement,card=null;
  for(let depth=0;parent&&depth<9;depth++,parent=parent.parentElement){
   const text=parent.textContent||'';
   if(text.length>7000)break;
   if(/@[^\s]+/.test(text) && /\bYorum\b/i.test(text) && text.length>35){card=parent;break;}
  }
  if(!card)continue;
  const chipRect=node.getBoundingClientRect(),cardRect=card.getBoundingClientRect();
  if(chipRect.top-cardRect.top>230)continue;
  node.dataset.ccHiddenPostChip='1';
  node.style.setProperty('display','none','important');
 }
}
function watchPostHeaderChips(){
 let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;hidePostHeaderChips()})};
 run();
 const main=document.getElementById('view-community')||document.body;
 new MutationObserver(run).observe(main,{subtree:true,childList:true});
 window.addEventListener('cc-authenticated',run);
}

function init(){
 css();setup();watchPostHeaderChips();
 if(!document.getElementById('ccNotesBoardLoader')){
  const script=document.createElement('script');script.id='ccNotesBoardLoader';script.src='cc-notes-board.js?v=20261126-head7';script.defer=true;document.head.appendChild(script);
 }
 const profile=document.getElementById('ccxUserProfilePage');
 if(profile){
  let scheduled=false;
  new MutationObserver(()=>{
   if(scheduled)return;
   scheduled=true;
   setTimeout(()=>{scheduled=false;if(!profile.hidden&&owner)mount()},500);
  }).observe(profile,{childList:true,subtree:true});
 }
 window.addEventListener('cc-authenticated',setup);
 window.addEventListener('cc-logged-out',()=>{
  owner=null;folders=[];cards=[];
  document.getElementById('ccPublicFolders')?.remove();
  document.getElementById('ccFolderBrowse')?.remove();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();