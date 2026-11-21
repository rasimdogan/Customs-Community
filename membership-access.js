
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
 st.textContent="\n#view-home .cc-membership-shortline{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px;align-items:center}\n#view-home .cc-membership-shortline span{display:inline-flex;align-items:center;border:1px solid rgba(211,239,247,.28);background:rgba(255,255,255,.12);color:#e8f6fb;border-radius:20px;padding:6px 11px;font-size:11px;font-weight:750}\n#ccPackageAdmin{margin-top:18px;border:1px solid #d6e5ec;border-radius:15px;background:#fff;padding:18px;box-shadow:0 5px 17px #203b5510}\n#ccPackageAdmin .cc-package-admin-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px;flex-wrap:wrap}\n#ccPackageAdmin h3{font-size:17px;font-weight:850;color:#1b455d;margin:0 0 3px}\n#ccPackageAdmin p{font-size:12px;color:#6c8192;line-height:1.6;margin:0}\n#ccPackageAdmin button{border:1px solid #b8d2dd;background:#eff8fb;color:#25627a;border-radius:9px;padding:9px 12px;font-weight:750}\n#ccPackageAdminStatus{font-size:12px;color:#4d7083;line-height:1.5;margin:6px 0 11px}\n#ccPackageAdminRows{display:grid;gap:9px}\n#ccPackageAdmin .cc-package-admin-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(185px,270px);gap:14px;align-items:center;border:1px solid #e0ebf1;border-radius:11px;background:#f8fbfd;padding:12px 14px;min-width:0}\n#ccPackageAdmin .cc-package-user{display:flex;flex-direction:column;gap:4px;min-width:0}\n#ccPackageAdmin .cc-package-user strong{font-size:13px;color:#1d4358;overflow-wrap:anywhere}\n#ccPackageAdmin .cc-package-user small{font-size:11px;color:#718494}\n#ccPackageAdmin label{display:flex;flex-direction:column;gap:6px;min-width:0}\n#ccPackageAdmin label>span{font-size:10.5px;color:#6a8291;font-weight:800}\n#ccPackageAdmin select{width:100%;border:1px solid #bfd5df;border-radius:9px;background:#fff;color:#1d4b63;padding:10px;font-size:12px;font-weight:720;min-width:0}\n#ccPackageAdmin select:disabled{opacity:.55}\n#ccBookMembershipNotice{position:fixed;left:18px;bottom:12px;right:18px;z-index:2147482100;display:flex;align-items:center;justify-content:center;gap:9px;flex-wrap:wrap;pointer-events:none;text-align:center}\n#ccBookMembershipNotice[hidden]{display:none!important}\n#ccBookMembershipNotice span{padding:6px 10px;border-radius:16px;background:#153b57e8;color:#fff;font-size:11px;font-weight:750}\n#ccBookMembershipNotice .cc-book-locked{background:#4b647be8}\n#ccxCardLibraryPanel .cc-library-quota{font-size:11px;font-weight:770;color:#2e7386;margin-left:auto;white-space:nowrap}\nbody.dark #ccPackageAdmin{background:#142b3e;border-color:#34546a}\nbody.dark #ccPackageAdmin .cc-package-admin-row{background:#1a3549;border-color:#38566b}\nbody.dark #ccPackageAdmin h3,body.dark #ccPackageAdmin .cc-package-user strong{color:#e4f4fc}\nbody.dark #ccPackageAdmin select{background:#162e42;color:#e6f4fa;border-color:#385d70}\n@media(max-width:650px){#ccPackageAdmin{padding:13px}#ccPackageAdmin .cc-package-admin-row{grid-template-columns:1fr;gap:9px}#ccBookMembershipNotice{bottom:7px;left:8px;right:8px}#ccBookMembershipNotice span{font-size:9px}}\n";
 document.head.appendChild(st);
}

function updateIndicators(){
 const badge=$('ccCurrentMembershipBadge');
 if(badge)badge.textContent='Aktif paket: '+PACKAGES[currentPlan()].name;
 const quota=$('ccCardQuotaText');
 if(quota)quota.textContent=currentPlan()==='free'?'Ücretsiz kart hakkı: '+Math.min(cardCount,10)+' / 10': 'Kart oluşturma: sınırsız';
 document.body.dataset.ccPlan=currentPlan();
 let b=$('ccCardLibraryQuota');
 const header=document.querySelector('#ccxCardLibraryPanel .cckl-head');
 if(header&&!b){b=document.createElement('span');b.id='ccCardLibraryQuota';b.className='cc-library-quota';header.appendChild(b)}
 if(b)b.textContent=currentPlan()==='free'?Math.min(cardCount,10)+'/10 kart oluşturuldu':PACKAGES[currentPlan()].name+' · sınırsız kart';
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
 const base=window.nav;
 if(typeof base!=='function'||base.__ccAccessWrapped)return;
 const blocked=new Set(['games','detective','spy','scene','fasil-savas','mpconquest','mpduel','puzzle']);
 const wrapped=function(view,...args){
  if(logged()&&!hasTariff()&&blocked.has(view)){upgrade('tariff');return}
  return base.call(this,view,...args)
 };
 wrapped.__ccAccessWrapped=true;
 window.nav=wrapped;
 const challenge=window.GTA_CHALLENGE;
 if(challenge&&typeof challenge.open==='function'&&!challenge.__ccAccessWrapped){
  const original=challenge.open;
  challenge.open=function(...args){if(logged()&&!hasTariff()){upgrade('tariff');return}return original.apply(this,args)};
  challenge.__ccAccessWrapped=true;
 }
}

function guardClassOpen(){
 const obj=window.CCClassDemo;if(!obj||obj.__ccPlanProtected)return;
 const open=obj.open;if(typeof open!=='function')return;
 obj.open=function(...args){if(!canHost()){upgrade('host');return}return open.apply(this,args)};
 obj.__ccPlanProtected=true;
}
function installClickGuards(){
 document.addEventListener('click',e=>{
  if(!logged())return;
  const webinar=e.target?.closest?.('#ccxTabWebinars, #ccxOverlay [data-hub-view="webinars"]');
  if(webinar&&!canHost()){
   e.preventDefault();e.stopImmediatePropagation();upgrade('host');return;
  }
  const unlicensedGame=e.target?.closest?.('.nav button[data-view="games"], .nav button[data-view="puzzle"], .nav button[data-view="scene"]');
  if(unlicensedGame&&!hasTariff()){
   e.preventDefault();e.stopImmediatePropagation();upgrade('tariff');
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
function installBookNotice(){
 document.addEventListener('click',e=>{if(e.target?.closest?.('[onclick*="BOOK.open"],#bookFloatLauncher'))setTimeout(updateBookNotice,50)},true);
 document.addEventListener('cc-book-page',updateBookNotice);
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
 installStyles();createMemberSummary();guardClassOpen();protectEducationNavigation();installClickGuards();installBookNotice();installObserver();setTimeout(protectEducationNavigation,200);
 window.addEventListener('cc-authenticated',()=>{createMemberSummary();protectEducationNavigation();refresh()});
 window.addEventListener('cc-plan-updated',()=>{updateBookNotice();try{window.GTA_ATLAS?.render?.()}catch(_){}});
 window.addEventListener('focus',()=>{if(logged())refresh()});
 window.addEventListener('cc-content-ready',createMemberSummary);
 if(logged())refresh();
}
window.CC_ACCESS={PACKAGES,refresh,currentPlan,hasTariff,canHost,chapterAllowed,upgrade,loadAdmin,cardCount:()=>cardCount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
