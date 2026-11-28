/* Public library folder navigation and follow label sync. */
(function(){
'use strict';
if(window.CC_SOCIAL_V2)return;
window.CC_SOCIAL_V2=true;
const CC_PRO_TOPICS=[
 {name:'Uygulamadaki Sorunlar',icon:'🛠️',desc:'Beyanname, gümrük uygulaması, operasyon, sistem ve sahada yaşanan problemler'},
 {name:'Mevzuat Sorunu',icon:'⚖️',desc:'Kanun, yönetmelik, tebliğ, genelge ve mevzuat yorumları'},
 {name:'Gümrük Gündemi',icon:'📰',desc:'Yeni düzenlemeler, sektör gelişmeleri ve tartışmalar'},
 {name:'GTİP Sor',icon:'🔎',desc:'Tarife sınıflandırması konusunda görüş alışverişi'}
];
let ccProTopic='Gümrük Gündem',ccProDb=null;
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
  installProfessionalTopics(db);
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

function installProfessionalTopics(client){
 if(!client||client.__ccProTopicsWrapped)return;
 const rpc=client.rpc.bind(client);ccProDb=client;
 client.rpc=function(name,args,options){
  if((name==='cc_community_publish'||name==='cc_community_edit_post')&&args){args={...args,p_topic:ccProTopic};}
  const out=rpc(name,args,options);
  if((name==='cc_community_comments'||name==='cc_community_comments_v2')&&args?.p_post_id){Promise.resolve(out).then(async res=>{if(res?.error)return;try{const st=await rpc('cc_community_solution_status',{p_post_id:args.p_post_id});setTimeout(()=>decorateSolutionComments(args.p_post_id,res.data||[],st.data?.[0]||st.data||{}),80)}catch(_){}})}
  return out;
 };
 client.__ccProTopicsWrapped=true;
 mountProfessionalTopics();
}
function proCss(){if(document.getElementById('ccProTopicCss'))return;const s=document.createElement('style');s.id='ccProTopicCss';s.textContent=`#ccProTopics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0 12px}#ccProTopics button{display:grid;grid-template-columns:25px 1fr;text-align:left;gap:1px 8px;border:1px solid #d4e0ea;background:#f8fbfd;color:#35556d;border-radius:12px;padding:9px 10px;cursor:pointer}#ccProTopics button .i{grid-row:1/3;font-size:17px}#ccProTopics button b{font:800 12px/1.25 inherit;color:#24465f}#ccProTopics button small{font:500 10px/1.35 inherit;color:#6b8192}#ccProTopics button[aria-pressed=true]{background:#e8f3ff;border-color:#77aee5;color:#0b5fa8}#ccProTopics button[aria-pressed=true] b{color:#0b5fa8}.cc-pro-feedtag{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:4px 8px;background:#edf5fb;border:1px solid #cfe0ed;color:#28556f;font-size:10px;font-weight:850;letter-spacing:.03em;margin:0 0 7px}.cc-pro-feedtag.solved{background:#eaf9ef;border-color:#a8dcb7;color:#19723b}.cc-pro-summary{font-size:11px;color:#657b8d;margin-left:7px}@media(max-width:600px){#ccProTopics{grid-template-columns:1fr}}.cc-solution-btn{border:1px solid #9bd9ad;background:#f0fff4;color:#16733a;border-radius:8px;padding:5px 8px;font-weight:750;font-size:11px;cursor:pointer;margin-left:6px}.cc-solution-badge{display:inline-flex;align-items:center;gap:4px;background:#e9fbef;color:#16733a;border:1px solid #9bd9ad;border-radius:999px;padding:4px 8px;font-weight:800;font-size:11px;margin-left:6px}`;document.head.appendChild(s)}
function composerTextarea(){return [...document.querySelectorAll('#view-community textarea,textarea')].find(x=>{const p=x.closest('#view-community')||x.parentElement;return p&&!x.closest('#ccFolderBrowse')&&/paylaş|gönder|aklından|ne düşün/i.test((x.placeholder||'')+' '+(p?.textContent||'').slice(0,900))})}
function mountProfessionalTopics(){proCss();const ta=composerTextarea();if(!ta)return;let bar=document.getElementById('ccProTopics');if(!bar){bar=document.createElement('div');bar.id='ccProTopics';bar.setAttribute('aria-label','Paylaşım türü');bar.innerHTML=CC_PRO_TOPICS.map(x=>`<button type="button" data-pro-topic="${x.name}" title="${esc(x.desc)}"><span class="i">${x.icon}</span><b>${esc(x.name)}</b><small>${esc(x.desc)}</small></button>`).join('');bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{ccProTopic=b.dataset.proTopic;paintProTopics()})}if(!ta.parentElement.contains(bar))ta.insertAdjacentElement('afterend',bar);paintProTopics()}
function paintProTopics(){document.querySelectorAll('#ccProTopics button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.proTopic===ccProTopic)))}
function decorateSolutionComments(postId,rows,status){if(!rows?.length)return;const accepted=Number(status?.accepted_comment_id||0),can=!!status?.can_accept;for(const row of rows){const candidates=[...document.querySelectorAll('#view-community p,#view-community div,#view-community span')].filter(n=>n.children.length===0&&(n.textContent||'').trim()===(row.body||'').trim());for(const n of candidates){let box=n.parentElement;for(let i=0;box&&i<4;i++,box=box.parentElement){if((box.textContent||'').includes(row.display_name||row.username||''))break}if(!box)continue;if(box.querySelector(`[data-solution-comment="${row.id}"]`))break;const el=document.createElement(accepted===Number(row.id)?'span':'button');el.dataset.solutionComment=row.id;if(accepted===Number(row.id)){el.className='cc-solution-badge';el.textContent='✓ Çözüm';}else if(can&&!accepted){el.type='button';el.className='cc-solution-btn';el.textContent='✓ Çözüm olarak işaretle';el.onclick=async()=>{el.disabled=true;const r=await ccProDb.rpc('cc_community_accept_solution',{p_post_id:postId,p_comment_id:row.id});if(r.error){alert(r.error.message||'Çözüm işaretlenemedi.');el.disabled=false;return}decorateSolutionComments(postId,rows,{accepted_comment_id:row.id,can_accept:true})};}else continue;n.insertAdjacentElement('afterend',el);break;}}}
async function decorateFeedKnowledge(){if(!ccProDb)return;const topicNames=CC_PRO_TOPICS.map(x=>x.name);const leaves=[...document.querySelectorAll('#view-community span,#view-community small,#view-community div')].filter(n=>n.children.length===0&&topicNames.includes((n.textContent||'').trim()));for(const node of leaves){if(node.dataset.ccProDecorated)return;let card=node.parentElement;for(let i=0;card&&i<8;i++,card=card.parentElement){if(/\bYorum\b/i.test(card.textContent||'')&&(card.textContent||'').length>40)break}if(!card)continue;const postId=Number(card.dataset?.postId||card.getAttribute?.('data-id')||0);node.dataset.ccProDecorated='1';const info=CC_PRO_TOPICS.find(x=>x.name===node.textContent.trim());node.textContent=(info?.icon||'')+' '+node.textContent.trim().toLocaleUpperCase('tr-TR');node.classList.add('cc-pro-feedtag');if(postId){try{const k=await ccProDb.rpc('cc_community_post_knowledge',{p_post_id:postId});const z=k.data?.[0];if(z){if(z.solved){node.classList.add('solved');node.textContent+=' · ÇÖZÜLDÜ ✓'}const sm=document.createElement('span');sm.className='cc-pro-summary';sm.textContent=z.answer_count+' cevap · '+z.solution_count+' çözüm';node.insertAdjacentElement('afterend',sm)}}catch(_){}}}}
function watchProfessionalTopics(){let q=false;const run=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;mountProfessionalTopics();decorateFeedKnowledge()})};run();new MutationObserver(run).observe(document.getElementById('view-community')||document.body,{subtree:true,childList:true})}

function init(){
 css();setup();watchPostHeaderChips();watchProfessionalTopics();
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