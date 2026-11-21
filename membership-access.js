
/* Customs Community · Membership access and admin management · 2026-11-21 */
(function(){
'use strict';
const PACKAGES={
 free:{name:'Ücretsiz',price:0,limit:10,tariff:false,host:false},
 cards:{name:'Kart Üyeliği',price:100,limit:Infinity,tariff:false,host:false},
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
    db.from('community_cards').select('id',{count:'exact',head:true}).eq('owner_id',u)
   ]);
   if(row.error)throw row.error;
   const p=profile();if(p){p.membership_plan=row.data.membership_plan;p.role=row.data.role}
   plan=row.data.role==='admin'?'full':(PACKAGES[row.data.membership_plan]?row.data.membership_plan:'free');
   if(!count.error)cardCount=Number(count.count||0);
   updateIndicators();window.dispatchEvent(new CustomEvent('cc-plan-updated',{detail:{plan,count:cardCount}}));
  }catch(e){console.warn('Üyelik bilgisi güncellenemedi',e)}
  finally{refreshBusy=false;planLoading=null}
  return plan;
 })();
 return planLoading;
}
function updateIndicators(){
 const badge=$('ccCurrentMembershipBadge');
 if(badge)badge.textContent='Aktif paket: '+PACKAGES[currentPlan()].name;
 const quota=$('ccCardQuotaText');
 if(quota)quota.textContent=currentPlan()==='free'?'Ücretsiz kart hakkı: '+Math.min(cardCount,10)+' / 10': 'Kart oluşturma: sınırsız';
 document.body.dataset.ccPlan=currentPlan();
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
   const options=Object.entries(PACKAGES).map(([k,val])=>'<option value="'+k+'" '+(x.membership_plan===k?'selected':'')+'>'+esc(val.name)+' · '+val.price+' TL/ay</option>').join('');
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
 createMemberSummary();guardClassOpen();installClickGuards();installBookNotice();installObserver();
 window.addEventListener('cc-authenticated',()=>{createMemberSummary();refresh()});
 window.addEventListener('cc-plan-updated',()=>{updateBookNotice();try{window.GTA_ATLAS?.render?.()}catch(_){}});
 window.addEventListener('focus',()=>{if(logged())refresh()});
 window.addEventListener('cc-content-ready',createMemberSummary);
 if(logged())refresh();
}
window.CC_ACCESS={PACKAGES,refresh,currentPlan,hasTariff,canHost,chapterAllowed,upgrade,loadAdmin,cardCount:()=>cardCount};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
