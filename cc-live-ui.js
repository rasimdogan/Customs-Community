/* Customs Community — live class UI and accessibility, 2026-11-23 */
(function(){
'use strict';
if(window.__ccLiveUiInstalled)return;
window.__ccLiveUiInstalled=true;
const $=id=>document.getElementById(id);
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let classes=[],alerts=[],busy=false,uid='',lastRun=0,toastSeen=new Set(),initialized=false,cardSignature='',toastTimer=null,toastDeadline=0;
function auth(){return window.CC_AUTH?.getSession?.()?.user?.id||''}
function style(){
 if($('ccLiveUiStyle'))return;
 const el=document.createElement('style');el.id='ccLiveUiStyle';
 el.textContent=`
 /* Empty upcoming classes text must remain readable on white cards */
 #ccxOverlay .cc-upcoming-empty, #view-home .cc-upcoming-empty{color:#536579!important;opacity:1!important}
 #ccLiveClassesCard{margin-top:14px;padding:17px 18px;border:1px solid #d9e4ee;border-radius:17px;background:#fff;color:#203448;box-shadow:0 3px 14px #142d440d}
 #ccLiveClassesCard h3{margin:0 0 12px;display:flex;align-items:center;gap:9px;font-size:18px;color:#203448}
 #ccLiveClassesCard .cc-live-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 0;border-top:1px solid #e6edf3}
 #ccLiveClassesCard .cc-live-row strong{display:block;font-size:13px;line-height:1.4;color:#203448}
 #ccLiveClassesCard .cc-live-row small{font-size:11px;color:#61778b}
 #ccLiveClassesCard button,#ccLiveNoticePanel button{font:inherit;font-size:12px;font-weight:750;border-radius:9px;border:1px solid #bcd6e7;background:#eaf5fc;color:#225878;padding:8px 11px;cursor:pointer;flex-shrink:0}
 #ccLiveClassesCard .cc-live-empty{font-size:13px;color:#586b7d;line-height:1.5;margin:4px 0}
 .cc-live-indicator{display:inline-flex!important;align-items:center;vertical-align:middle;gap:3px;white-space:nowrap;background:#cf2344!important;color:#fff!important;font-size:10px!important;font-weight:850!important;letter-spacing:.15px;border-radius:6px;padding:3px 7px;margin-left:7px;line-height:1.2}
 .cc-live-indicator[hidden]{display:none!important}
 #ccLiveNoticeLauncher{position:fixed;right:22px;bottom:24px;z-index:100320;border:1px solid #c3d6e5;background:#fff;border-radius:100px;color:#29455d;box-shadow:0 6px 20px #152c4430;padding:10px 15px;font:750 12px inherit;cursor:pointer;display:flex;align-items:center;gap:8px}
 #ccLiveNoticeLauncher[hidden],#ccLiveNoticePanel[hidden]{display:none!important}
 #ccLiveNoticeLauncher .cc-count{background:#c92241;color:white;border-radius:30px;padding:2px 6px;font-size:10px}
 #ccLiveNoticePanel{position:fixed;right:20px;bottom:76px;z-index:100321;width:min(350px,calc(100vw - 30px));max-height:55vh;overflow:auto;background:white;border:1px solid #cbdbe8;border-radius:14px;box-shadow:0 16px 50px #142b4840;padding:15px;color:#223e55}
 #ccLiveNoticePanel h3{font-size:16px;margin:0 0 11px;color:#223e55}
 #ccLiveNoticePanel article{padding:10px 0;border-top:1px solid #e5edf4;font-size:12px;line-height:1.5}
 #ccLiveNoticePanel small{display:block;color:#697d8e;margin-top:3px}
 #ccLiveToast{position:fixed;z-index:100322;top:75px;right:18px;max-width:min(365px,calc(100vw - 36px));background:#193b51;color:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 9px 32px #10283a4d;font-size:13px;font-weight:750;cursor:pointer;transition:width .22s ease,height .22s ease,background-color .22s ease,border-radius .22s ease,padding .22s ease;line-height:1.5}
 #ccLiveToast.cc-live-dot{width:18px;height:18px;min-width:18px;min-height:18px;padding:0;border-radius:50%;background:#db2346;box-shadow:0 0 0 4px #db234625,0 4px 14px #ad193c55;overflow:hidden;font-size:0;white-space:nowrap;max-width:none}
 #ccLiveToast.cc-live-dot:focus-visible{outline:3px solid #267fc4;outline-offset:4px}
 #ccLiveToast.cc-live-dot:hover,#ccLiveToast.cc-live-dot:focus-visible,#ccLiveToast.cc-live-dot.cc-live-peek{width:auto;height:auto;min-width:0;min-height:0;max-width:min(365px,calc(100vw - 36px));padding:14px 16px;border-radius:12px;background:#193b51;font-size:13px;white-space:normal;overflow:visible;box-shadow:0 9px 32px #10283a4d}
 @media(max-width:650px){#ccLiveNoticeLauncher{right:12px;bottom:15px}#ccLiveNoticePanel{right:10px;bottom:66px}#ccLiveClassesCard{padding:13px 14px}}
 `;
 document.head.appendChild(el);
}
function nearestCard(heading){
 let node=heading;
 for(let i=0;node&&i<5;i++,node=node.parentElement){
  if(node===document.body)break;
  const cls=String(node.className||'');
  if(/card|widget|panel|sidebar|upcoming/i.test(cls)&&node!==heading)return node;
 }
 return heading.parentElement?.parentElement||heading.parentElement;
}
function labelNodes(text){
 return [...document.querySelectorAll('h2,h3,h4,strong,b,span,a,button')].filter(n=>n.children.length===0&&(n.textContent||'').trim().toLocaleLowerCase('tr-TR')===text.toLocaleLowerCase('tr-TR'));
}
function repairUpcoming(){
 for(const heading of labelNodes('Yaklaşan dersler')){
  const card=nearestCard(heading);
  if(!card)continue;
  [...card.querySelectorAll('p,span,div,small')].filter(n=>n.children.length===0&&/yaklaşan ders bulunmuyor/i.test(n.textContent||'')).forEach(n=>{
   n.classList.add('cc-upcoming-empty');n.style.setProperty('color','#536579','important');
   n.style.setProperty('opacity','1','important');n.style.setProperty('-webkit-text-fill-color','#536579','important');
  });
 }
}
function hostCard(){
 const heading=labelNodes('Yaklaşan dersler')[0]||labelNodes('Haberler')[0];
 if(!heading)return null;
 const card=nearestCard(heading);
 if(!card||!card.parentElement)return null;
 let out=$('ccLiveClassesCard');
 if(!out){out=document.createElement('section');out.id='ccLiveClassesCard';out.setAttribute('aria-label','Canlı sınıflarım');out.innerHTML='<h3>🔴 Canlı sınıflarım</h3><div id="ccLiveClassesBody"></div>';}
 if(out.parentElement!==card.parentElement||out.previousElementSibling!==card)card.insertAdjacentElement('afterend',out);
 return out;
}
function navigateToClasses(){
 const links=[...document.querySelectorAll('a,button,[role="button"]')];
 const target=links.find(n=>!n.closest('#ccLiveClassesCard')&&/^(sınıflar)(\s*canlı)?$/i.test((n.textContent||'').replace(/\s+/g,' ').trim()));
 if(target)target.click();else window.CC_COMMUNITY?.openClasses?.();
}
function renderCard(){
 const host=hostCard();
 if(!host)return;
 host.hidden=!uid;
 const body=$('ccLiveClassesBody');if(!body)return;
 const live=classes.filter(c=>c.is_live);
 const signature=uid+'|'+live.map(x=>x.id+':'+x.title).join(',');
 if(cardSignature===signature)return;
 cardSignature=signature;
 body.innerHTML=live.length?live.map(c=>'<div class="cc-live-row"><div><strong>'+escape(c.title)+'</strong><small>🔴 Yayın devam ediyor</small></div><button type="button" data-live-class="'+escape(c.id)+'">Derse katıl</button></div>').join(''):'<p class="cc-live-empty">Şu anda kayıtlı olduğunuz sınıflarda canlı yayın yok.</p>';
 body.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',navigateToClasses));
}
function renderBadges(){
 const any=classes.some(c=>c.is_live);
 for(const nav of labelNodes('Sınıflar')){
  if(nav.closest('#ccLiveClassesCard'))continue;
  const parent=nav.closest('a,button,[role="tab"]')||nav;
  let badge=parent.querySelector('.cc-live-indicator');
  if(!badge){badge=document.createElement('span');badge.className='cc-live-indicator';badge.textContent='Canlı';badge.setAttribute('aria-label','Canlı ders var');parent.appendChild(badge);}
  badge.hidden=!any;
 }
}
function notices(){
 let launcher=$('ccLiveNoticeLauncher');
 if(!launcher){
  launcher=document.createElement('button');launcher.type='button';launcher.id='ccLiveNoticeLauncher';
  launcher.setAttribute('aria-label','Canlı ders bildirimleri');
  launcher.addEventListener('click',()=>{const p=$('ccLiveNoticePanel');p.hidden=!p.hidden;});
  document.body.appendChild(launcher);
 }
 launcher.hidden=!uid;
 const unread=alerts.filter(x=>!x.read_at);
 launcher.innerHTML='🔔 Ders Bildirimleri'+(unread.length?'<span class="cc-count">'+unread.length+'</span>':'');
 let panel=$('ccLiveNoticePanel');
 if(!panel){panel=document.createElement('section');panel.id='ccLiveNoticePanel';panel.hidden=true;document.body.appendChild(panel);}
 panel.innerHTML='<h3>Canlı ders bildirimleri</h3>'+(alerts.length?alerts.slice(0,15).map(x=>{
  const title=classes.find(c=>c.id===x.class_id)?.title||'Kayıtlı olduğunuz sınıf';
  return '<article><b>'+escape(title)+'</b><div>Canlı ders başladı.</div><small>'+new Date(x.started_at).toLocaleString('tr-TR')+'</small></article>';
 }).join(''):'<p>Henüz ders bildirimi bulunmuyor.</p>')+'<button id="ccLiveNoticeRead" type="button">Okundu olarak işaretle</button>';
 $('ccLiveNoticeRead')?.addEventListener('click',async()=>{
  try{
   const db=await window.CC_AUTH.getClient();
   const ids=alerts.filter(x=>!x.read_at).map(x=>x.id);
   if(ids.length){const r=await db.from('cc_class_live_notifications').update({read_at:new Date().toISOString()}).in('id',ids);if(r.error)throw r.error;}
   alerts=alerts.map(x=>({...x,read_at:x.read_at||new Date().toISOString()}));notices();
  }catch(err){console.warn('Canlı ders bildirimi işaretlenemedi',err)}
 });
}
function popup(text){
 let node=$('ccLiveToast');
 if(!node){
  node=document.createElement('div');node.id='ccLiveToast';
  node.setAttribute('role','status');node.setAttribute('tabindex','0');
  node.setAttribute('aria-label','Canlı ders bildirimi, ayrıntıları görmek için üzerine gelin');
  node.title='Canlı ders bildirimini göster';
  node.addEventListener('click',()=>{if(node.classList.contains('cc-live-dot'))node.classList.toggle('cc-live-peek');});
  node.addEventListener('mouseleave',()=>node.classList.remove('cc-live-peek'));
  node.addEventListener('keydown',e=>{if(e.key==='Escape')node.classList.remove('cc-live-peek');});
  document.body.appendChild(node);
 }
 node.textContent=text;
 node.classList.remove('cc-live-dot','cc-live-peek');
 toastDeadline=Date.now()+30000;
 if(toastTimer)clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>{
  toastTimer=null;
  if(node.isConnected&&Date.now()>=toastDeadline)node.classList.add('cc-live-dot');
 },30000);
}
function clearPopup(){
 if(toastTimer)clearTimeout(toastTimer);
 toastTimer=null;toastDeadline=0;
 $('ccLiveToast')?.remove();
}
async function refresh(){
 const now=Date.now(),id=auth();
 if(!id){uid='';classes=[];alerts=[];clearPopup();renderCard();renderBadges();notices();return;}
 if(busy||now-lastRun<5000)return;
 busy=true;uid=id;lastRun=now;
 try{
  const db=await window.CC_AUTH.getClient();
  const [a,b]=await Promise.all([
   db.from('cc_my_live_classes').select('id,title,is_live').eq('user_id',id),
   db.from('cc_class_live_notifications').select('id,class_id,started_at,created_at,read_at').eq('user_id',id).order('created_at',{ascending:false}).limit(30)
  ]);
  if(a.error)throw a.error;
  if(b.error)console.warn('Canlı bildirim sorgusu',b.error);
  classes=a.data||[];alerts=b.error?[]:(b.data||[]);
  for(const item of alerts){
   if(!item.read_at&&!toastSeen.has(item.id)){
    toastSeen.add(item.id);
    if(Date.now()-new Date(item.created_at).getTime()<120000)popup('🔴 Canlı ders başladı: '+(classes.find(c=>c.id===item.class_id)?.title||'Sınıfınız'));
   }
  }
  renderCard();renderBadges();notices();
 }catch(err){console.warn('Canlı sınıflarım yüklenemedi',err)}
 finally{busy=false;}
}
function init(){
 if(initialized)return;initialized=true;
 style();repairUpcoming();renderCard();renderBadges();notices();refresh();
 window.setInterval(()=>{if(!document.hidden)refresh()},12000);
 window.addEventListener('cc-authenticated',()=>{lastRun=0;refresh()});
 window.addEventListener('cc-logged-out',()=>{uid='';classes=[];alerts=[];clearPopup();renderCard();renderBadges();notices()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastRun=0;refresh()}});
 window.addEventListener('focus',()=>{lastRun=0;refresh()});
 let mutationTimer=null;
 const obs=new MutationObserver(()=>{
  if(mutationTimer)return;
  mutationTimer=setTimeout(()=>{mutationTimer=null;repairUpcoming();renderCard();renderBadges()},350);
 });
 obs.observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();