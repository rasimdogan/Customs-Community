
/* Customs Community · Membership access and admin management · 2026-11-21 */
(function(){
'use strict';
const PACKAGES={
 free:{name:'Ücretsiz',price:0,limit:10,tariff:false,host:false},
 cards:{name:'Kart Plus',price:100,limit:Infinity,tariff:false,host:false},
 tariff:{name:'Tarife Modülü',price:200,limit:Infinity,tariff:true,host:false},
 full:{name:'Tam Erişim',price:300,limit:Infinity,tariff:true,host:true}
};
let plan='free', cardCount=0, refreshBusy=false, planLoading=null;
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const profile=()=>window.CC_AUTH?.getProfile?.();
const logged=()=>!!window.CC_AUTH?.getSession?.()?.access_token;
function currentPlan(){
 const p=profile();
 if(p?.role==='admin')return 'full';
 const val=p?.membership_plan||plan;
 return Object.hasOwn(PACKAGES,val)?val:'free';
}
function hasTariff(){return !!PACKAGES[currentPlan()].tariff}
function canHost(){return !!PACKAGES[currentPlan()].host}
function chapterAllowed(n){return hasTariff()||(Number(n)>=1&&Number(n)<=5)}
function notify(message){
 if(window.ccToast)window.ccToast(message,'info',4500);else window.alert(message);
}
function upgrade(type){
 const target=type==='host'?'Tam Erişim (300 TL/ay)':'Tarife Modülü (200 TL/ay)';
 notify('Bu özellik için '+target+' gereklidir. Paketi yöneticinizden yükseltmesini isteyin.');
 try{window.CC_MEMBERSHIP?.open?.('plans')}catch(_){}
}
async function refresh(){
 if(!logged())return plan;
 if(refreshBusy)return planLoading||plan;
 refreshBusy=true;
 planLoading=(async()=>{
  try{
   const db=await window.CC_AUTH.getClient(),u=window.CC_AUTH.getSession().user.id;
   const [row,count]=await Promise.all([
    db.from('profiles').select('membership_plan,role').eq('user_id',u).single(),
    db.rpc('cc_my_card_quota')
   ]);
   if(row.error)throw row.error;
   const p=profile();if(p){p.membership_plan=row.data.membership_plan;p.role=row.data.role}
   plan=row.data.role==='admin'?'full':(PACKAGES[row.data.membership_plan]?row.data.membership_plan:'free');
   if(!count.error)cardCount=Number(count.data?.used||0);
   updateIndicators();window.dispatchEvent(new CustomEvent('cc-plan-updated',{detail:{plan,count:cardCount}}));
  }catch(e){console.warn('Üyelik bilgisi güncellenemedi',e)}
  finally{refreshBusy=false;planLoading=null}
  return plan;
 })();
 return planLoading;
}

function installStyles(){
 if($('ccMembershipAccessStyle'))return;
 const st=document.createElement('style');st.id='ccMembershipAccessStyle';
 st.textContent="\n#view-home .cc-membership-shortline{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px;align-items:center}\n#view-home .cc-membership-shortline span{display:inline-flex;align-items:center;border:1px solid rgba(211,239,247,.28);background:rgba(255,255,255,.12);color:#e8f6fb;border-radius:20px;padding:6px 11px;font-size:11px;font-weight:750}\n#ccPackageAdmin{margin-top:18px;border:1px solid #d6e5ec;border-radius:15px;background:#fff;padding:18px;box-shadow:0 5px 17px #203b5510}\n#ccPackageAdmin .cc-package-admin-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px;flex-wrap:wrap}\n#ccPackageAdmin h3{font-size:17px;font-weight:850;color:#1b455d;margin:0 0 3px}\n#ccPackageAdmin p{font-size:12px;color:#6c8192;line-height:1.6;margin:0}\n#ccPackageAdmin button{border:1px solid #b8d2dd;background:#eff8fb;color:#25627a;border-radius:9px;padding:9px 12px;font-weight:750}\n#ccPackageAdminStatus{font-size:12px;color:#4d7083;line-height:1.5;margin:6px 0 11px}\n#ccPackageAdminRows{display:grid;gap:9px}\n#ccPackageAdmin .cc-package-admin-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(185px,270px);gap:14px;align-items:center;border:1px solid #e0ebf1;border-radius:11px;background:#f8fbfd;padding:12px 14px;min-width:0}\n#ccPackageAdmin .cc-package-user{display:flex;flex-direction:column;gap:4px;min-width:0}\n#ccPackageAdmin .cc-package-user strong{font-size:13px;color:#1d4358;overflow-wrap:anywhere}\n#ccPackageAdmin .cc-package-user small{font-size:11px;color:#718494}\n#ccPackageAdmin label{display:flex;flex-direction:column;gap:6px;min-width:0}\n#ccPackageAdmin label>span{font-size:10.5px;color:#6a8291;font-weight:800}\n#ccPackageAdmin select{width:100%;border:1px solid #bfd5df;border-radius:9px;background:#fff;color:#1d4b63;padding:10px;font-size:12px;font-weight:720;min-width:0}\n#ccPackageAdmin select:disabled{opacity:.55}\n#ccBookMembershipNotice{position:fixed;left:18px;bottom:12px;right:18px;z-index:2147482100;display:flex;align-items:center;justify-content:center;gap:9px;flex-wrap:wrap;pointer-events:none;text-align:center}\n#ccBookMembershipNotice[hidden]{display:none!important}\n#ccBookMembershipNotice span{padding:6px 10px;border-radius:16px;background:#153b57e8;color:#fff;font-size:11px;font-weight:750}\n#ccBookMembershipNotice .cc-book-locked{background:#4b647be8}\n#ccxCardLibraryPanel #ccCardLibraryQuota,#ccxCardLibraryPanel .cc-library-quota{display:none!important}\nbody.dark #ccPackageAdmin{background:#142b3e;border-color:#34546a}\nbody.dark #ccPackageAdmin .cc-package-admin-row{background:#1a3549;border-color:#38566b}\nbody.dark #ccPackageAdmin h3,body.dark #ccPackageAdmin .cc-package-user strong{color:#e4f4fc}\nbody.dark #ccPackageAdmin select{background:#162e42;color:#e6f4fa;border-color:#385d70}\n@media(max-width:650px){#ccPackageAdmin{padding:13px}#ccPackageAdmin .cc-package-admin-row{grid-template-columns:1fr;gap:9px}#ccBookMembershipNotice{bottom:7px;left:8px;right:8px}#ccBookMembershipNotice span{font-size:9px}}\n";
 document.head.appendChild(st);
}

function updateIndicators(){
 const badge=$('ccCurrentMembershipBadge');
 if(badge)badge.textContent='Aktif paket: '+PACKAGES[currentPlan()].name;
 const quota=$('ccCardQuotaText');
 if(quota)quota.textContent=currentPlan()==='free'?'Ücretsiz kart hakkı: '+Math.min(cardCount,10)+' / 10': 'Kart oluşturma: sınırsız';
 document.body.dataset.ccPlan=currentPlan();
 // Keep plan entitlements unchanged; the redundant library-header label is not shown.
 document.querySelectorAll('#ccxCardLibraryPanel .cc-library-quota, #ccCardLibraryQuota').forEach(el=>el.remove());
}
function createMemberSummary(){
 if($('ccCurrentMembershipBadge'))return;
 const banner=document.querySelector('#view-home .home-command-copy');
 if(!banner)return;
 const b=document.createElement('div');
 b.className='cc-membership-shortline';
 b.innerHTML='<span id="ccCurrentMembershipBadge">Aktif paket: Ücretsiz</span><span id="ccCardQuotaText">Ücretsiz kart hakkı: 0 / 10</span>';
 banner.appendChild(b);updateIndicators();
}
function renderAdminShell(){
 const list=$('ccUserList');
 if(!list||$('ccPackageAdmin'))return;
 const host=document.createElement('section');host.id='ccPackageAdmin';
 host.innerHTML='<div class="cc-package-admin-heading"><div><h3>Üyelik Paketleri ve Yetkiler</h3><p>Google ile kaydolanlar ücretsiz başlar. Paket değişikliği yalnızca yöneticiler tarafından yapılır.</p></div><button type="button" id="ccPackageRefresh">↻ Güncelle</button></div><div id="ccPackageAdminStatus" role="status"></div><div id="ccPackageAdminRows"></div>';
 list.insertAdjacentElement('afterend',host);
 $('ccPackageRefresh').addEventListener('click',loadAdmin);
 host.addEventListener('change',ev=>{
  const s=ev.target.closest('select[data-cc-member]');
  if(s)savePlan(s.dataset.ccMember,s.value,s);
 });
}
let adminLoading=false;
async function loadAdmin(){
 if(profile()?.role!=='admin'||!logged())return;
 renderAdminShell();if(adminLoading)return;
 adminLoading=true;
 const status=$('ccPackageAdminStatus'),rows=$('ccPackageAdminRows');
 if(status)status.textContent='Paket bilgileri yükleniyor…';
 try{
  const db=await window.CC_AUTH.getClient();
  const {data,error}=await db.rpc('cc_admin_memberships');
  if(error)throw error;
  rows.innerHTML=(data||[]).map(x=>{
   const options=Object.entries(PACKAGES).map(([k,val])=>'<option value="'+k+'" '+((x.role==='admin'?'full':x.membership_plan)===k?'selected':'')+'>'+esc(val.name)+' · '+val.price+' TL/ay</option>').join('');
   return '<div class="cc-package-admin-row"><div class="cc-package-user"><strong>'+esc(x.display_name||x.username)+'</strong><small>@'+esc(x.username)+(x.role==='admin'?' · Yönetici':'')+'</small></div><label><span>Üyelik paketi</span><select data-cc-member="'+esc(x.user_id)+'" '+(x.role==='admin'?'disabled title="Yönetici tüm özelliklere erişir"':'')+'>'+options+'</select></label></div>';
  }).join('')||'<p>Henüz kullanıcı bulunamadı.</p>';
  status.textContent='Paket değişiklikleri kaydedildiğinde anında geçerli olur.';
 }catch(e){status.textContent='Paket bilgileri yüklenemedi: '+(e.message||e)}
 finally{adminLoading=false}
}
async function savePlan(userId,next,select){
 if(!PACKAGES[next])return;
 select.disabled=true;const status=$('ccPackageAdminStatus');status.textContent='Paket güncelleniyor…';
 try{
  const db=await window.CC_AUTH.getClient();
  const {data,error}=await db.rpc('cc_admin_set_membership',{p_user_id:userId,p_plan:next});
  if(error)throw error;
  status.textContent='✓ Paket '+PACKAGES[next].name+' olarak güncellendi. Kullanıcının bir sonraki içerik yüklemesinde yeni yetkiler uygulanır.';
  notify('Üyelik paketi güncellendi: '+PACKAGES[next].name);
 }catch(e){
  status.textContent='Paket güncellenemedi: '+(e.message||e);
  await loadAdmin();
 }finally{select.disabled=false}
}

function protectEducationNavigation(){
 /* Eğitim oyunları bütün aktif üyelere açık; soru havuzu ve sahneler paket gereği sınırlandırılır. */
}

function guardClassOpen(){
 /* Sınıf ekranını açmak, mevcut sınıflara katılmak ve yayını izlemek ücretsizdir.
    Yetki kontrolü yalnızca yeni sınıf/webinar oluşturma eyleminde yapılır. */
}
function installClickGuards(){
 document.addEventListener('click',e=>{
  if(!logged())return;
  const target=e.target?.closest?.('button,a,[role="button"],[data-chapter],[data-fasil],[data-scene-index],[data-scene-order]');
  if(!target)return;
  const label=(target.textContent||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('tr-TR');
  const action=String(target.dataset.action||target.dataset.ccAction||'').toLocaleLowerCase('tr-TR');
  /* Katıl/izle/takvime ekle işlemleri her kayıtlı kullanıcıya açıktır. */
  if(!canHost() && (/^(sınıf oluştur|yeni sınıf|webinar oluştur|yeni webinar|webinar planla|canlı sınıf oluştur)$/.test(label)||/^(create-class|create-webinar|new-class|new-webinar)$/.test(action))){
   e.preventDefault();e.stopImmediatePropagation();upgrade('host');return;
  }
  /* Oyunlara giriş açık, kilitli fasıl ve sahne seçimleri kısıtlı. */
  if(hasTariff())return;
  const ch=target.dataset.chapter??target.dataset.fasil??target.dataset.chapterNumber;
  if(ch!==undefined && /^\d{1,2}$/.test(String(ch)) && !chapterAllowed(ch)){
   e.preventDefault();e.stopImmediatePropagation();upgrade('tariff');return;
  }
  const scene=target.dataset.sceneIndex??target.dataset.sceneOrder;
  if(scene!==undefined && /^\d+$/.test(String(scene)) && Number(scene)>(target.dataset.sceneIndex!==undefined?4:5)){
   e.preventDefault();e.stopImmediatePropagation();upgrade('tariff');return;
  }
 },true);
}
function updateBookNotice(){
 const overlay=$('bkOverlay');if(!overlay)return;
 let notice=$('ccBookMembershipNotice');
 if(!notice){notice=document.createElement('div');notice.id='ccBookMembershipNotice';overlay.appendChild(notice)}
 const locked=!hasTariff();
 notice.hidden=!locked;
 if(locked)notice.innerHTML='<span>📖 Bölüm I · 01–05 fasıllar açık</span><span class="cc-book-locked">🔒 Bölüm II–XXI ve diğer fasıllar Tarife Modülü ile açılır.</span>';
}
function removeWelcomePostExplanation(){
 const phrase='İlk üyelik kaydın tamamlandığında hesabından';
 const suffix='Bu gönderiyi daha sonra silebilirsin.';
 document.querySelectorAll('p,small,span,div,label').forEach(el=>{
  if(el.children.length>0)return;
  const value=(el.textContent||'').trim();
  if(value.includes(phrase)&&value.includes(suffix))el.remove();
 });
}
function installBookPointerCursor(){
 /* Kitap kartlarının mevcut büyütme/öne gelme davranışına dokunmadan büyüteç imlecini kaldır. */
 if(!$('ccBookPointerCursorStyle')){
  const style=document.createElement('style');
  style.id='ccBookPointerCursorStyle';
  style.textContent='#bkOverlay [style*="zoom-in"],#bkOverlay [style*="zoom_out"],#bkOverlay [style*="zoom-out"],#bkOverlay [style*="zoom_in"]{cursor:pointer!important}';
  document.head.appendChild(style);
 }
 document.addEventListener('pointerover',event=>{
  const overlay=$('bkOverlay');
  if(!overlay||!overlay.contains(event.target))return;
  let node=event.target;
  while(node&&node!==overlay){
   if(node.nodeType===1&&['zoom-in','zoom-out'].includes(getComputedStyle(node).cursor)){
    node.style.setProperty('cursor','pointer','important');
   }
   node=node.parentElement;
  }
 },{passive:true});
}
function installBookNotice(){
 document.addEventListener('click',e=>{if(e.target?.closest?.('[onclick*="BOOK.open"],#bookFloatLauncher'))setTimeout(updateBookNotice,50)},true);
 document.addEventListener('cc-book-page',updateBookNotice);
}

function installCommunityLogout(){
 if($('ccCommunityLogoutStyle'))return;
 const style=document.createElement('style');
 style.id='ccCommunityLogoutStyle';
 style.textContent='#ccCommunityLogout[hidden]{display:none!important}#ccxOverlay #ccCommunityLogout{position:absolute;right:18px;bottom:18px;z-index:10050;display:inline-flex;align-items:center;gap:8px;padding:10px 15px;border:1px solid #cbdbe6;border-radius:10px;background:#fff;color:#2c4d62;font-family:inherit;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 4px 15px #173b521c}#ccCommunityLogout:focus-visible{outline:3px solid #2685b6;outline-offset:2px}#ccCommunityLogout[disabled]{opacity:.65;cursor:wait}@media(max-width:640px){#ccxOverlay #ccCommunityLogout{right:12px;bottom:12px;padding:9px 12px;font-size:12px}}';
 document.head.appendChild(style);
 const sync=()=>{
  const hub=$('ccxOverlay');
  if(!hub)return;
  let btn=$('ccCommunityLogout');
  if(!btn){
   btn=document.createElement('button');
   btn.type='button';btn.id='ccCommunityLogout';
   btn.setAttribute('aria-label','Hesaptan çıkış yap');
   btn.innerHTML='<span aria-hidden="true">⇥</span> Çıkış Yap';
   btn.addEventListener('click',async()=>{
    if(btn.disabled)return;
    btn.disabled=true;
    try{
     /* Öncelikle eğitim alanının mevcut çıkış akışını kullan. */
     const candidates=[...document.querySelectorAll('button,a,[role="button"]')].filter(el=>el!==btn&&!hub.contains(el));
     const existing=candidates.find(el=>/^(çıkış yap|çıkış|oturumu kapat)$/i.test((el.textContent||'').trim())||/logout|signout|sign-out/i.test(el.id||''));
     if(existing){existing.click();return}
     if(typeof window.CC_AUTH?.signOut==='function'){
      await window.CC_AUTH.signOut();
     }else if(typeof window.CC_AUTH?.logout==='function'){
      await window.CC_AUTH.logout();
     }else{
      const client=await window.CC_AUTH?.getClient?.();
      if(!client?.auth?.signOut)throw new Error('Oturum kapatma işlevine ulaşılamadı.');
      const result=await client.auth.signOut();
      if(result?.error)throw result.error;
     }
     window.location.reload();
    }catch(error){
     btn.disabled=false;
     notify('Çıkış yapılamadı: '+(error?.message||'Lütfen yeniden deneyin.'));
    }
   });
  }
  if(btn.parentElement!==hub)hub.appendChild(btn);
  btn.hidden=!logged();
 };
 sync();
 // The button belongs to the community overlay; unrelated page mutations do not require rescanning.
 const hub=$('ccxOverlay');
 if(hub){
  let scheduled=false;
  const observer=new MutationObserver(()=>{
   if(scheduled)return;
   scheduled=true;
   setTimeout(()=>{scheduled=false;sync()},200);
  });
  observer.observe(hub,{childList:true,subtree:false});
 }
 window.addEventListener('cc-authenticated',sync);
 window.addEventListener('cc-logged-out',sync);
}
function installObserver(){
 const adminView=$('view-useradmin');
 if(adminView){
  const observer=new MutationObserver(()=>{
   if(!adminView.classList.contains('hidden'))loadAdmin();
  });
  observer.observe(adminView,{attributes:true,attributeFilter:['class']});
  if(!adminView.classList.contains('hidden'))loadAdmin();
 }
}
function init(){
 installStyles();createMemberSummary();guardClassOpen();protectEducationNavigation();installClickGuards();installBookPointerCursor();installBookNotice();installCommunityLogout();installObserver();removeWelcomePostExplanation();
 // Avoid scanning thousands of card nodes on every feed/DOM mutation.
 const welcomeObserver=new MutationObserver((records)=>{
  if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&n.textContent?.includes('İlk üyelik kaydın tamamlandığında hesabından')))){
   removeWelcomePostExplanation();
  }
 });
 const community=$('ccxOverlay');
 if(community)welcomeObserver.observe(community,{childList:true,subtree:true});
 setTimeout(protectEducationNavigation,200);
 window.addEventListener('cc-authenticated',()=>{createMemberSummary();protectEducationNavigation();refresh()});
 window.addEventListener('cc-plan-updated',()=>{updateBookNotice();try{window.GTA_ATLAS?.render?.()}catch(_){}});
 window.addEventListener('focus',()=>{if(logged())refresh()});
 window.addEventListener('cc-content-ready',createMemberSummary);
 if(logged())refresh();
}
window.CC_ACCESS={PACKAGES,refresh,currentPlan,hasTariff,canHost,chapterAllowed,sceneAllowed:n=>hasTariff()||(Number(n)>=1&&Number(n)<=5),upgrade,loadAdmin,cardCount:()=>cardCount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Load live classroom indicators and readable upcoming lesson styles. */
(function(){
 if(document.getElementById('ccLiveUiLoader'))return;
 const script=document.createElement('script');
 script.id='ccLiveUiLoader';
 script.src='cc-live-ui.js?v=20261123g';
 script.defer=true;
 script.onerror=()=>console.warn('Canlı sınıf arayüz modülü yüklenemedi');
 document.head.appendChild(script);
})();



/* Load the private notes board independently from the social feed module. */
(function(){
 if(document.getElementById('ccNotesBoardLoader'))return;
 const script=document.createElement('script');
 script.id='ccNotesBoardLoader';
 script.src='cc-notes-board.js?v=20261126-icononly5';
 script.defer=true;
 script.onerror=()=>{console.warn('Not Panom arayüzü yüklenemedi');script.remove()};
 document.head.appendChild(script);
})();
