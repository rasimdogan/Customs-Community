/* Customs Community — Testler ve Yönetici Soru Bankası */
(function(){
'use strict';
const TYPES={izahname:'İzahname',gtip:'Yönetici GTİP Soruları'};
const el=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const admin=()=>window.CC_AUTH?.getProfile?.()?.role==='admin';
const client=async()=>{const c=await window.CC_AUTH?.getClient?.();if(!c)throw Error('Oturum bulunamadı.');return c};
let mode='position',rows=[],active=null,answers=[],answerIndex=-1,editing=null,renderSerial=0;
function setup(){
 const view=el('view-test'),shell=view?.querySelector('.test-shell');
 if(!view||!shell||el('ccTestSelector'))return;
 const heading=view.querySelector('.test-hero h2');if(heading)heading.textContent='Testler';
 const sub=view.querySelector('.test-hero p');if(sub)sub.textContent='Tarife pozisyonlarını, izahname bilgisini ve yönetici sorularını test et.';
 const bar=document.createElement('div');bar.id='ccTestSelector';bar.className='cct-selector';
 bar.innerHTML='<button type="button" data-cc-test="position" class="active">▤ Pozisyon Testi</button><button type="button" data-cc-test="izahname">📘 İzahname</button><button type="button" data-cc-test="gtip">✓ Yönetici GTİP Soruları</button>';
 shell.before(bar);
 const custom=document.createElement('section');custom.id='ccCustomTests';custom.className='cct-custom';custom.hidden=true;shell.after(custom);
 bar.addEventListener('click',e=>{const b=e.target.closest('[data-cc-test]');if(b)choose(b.dataset.ccTest)});
 const adminView=el('view-testadmin');if(adminView&&!el('cctAdminRoot')){
  const root=document.createElement('div');root.id='cctAdminRoot';adminView.appendChild(root);
 }
}
function open(){setup();choose(mode)}
function choose(next){
 mode=next;setup();const b=el('ccTestSelector');if(!b)return;
 b.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x.dataset.ccTest===next));
 const shell=el('view-test').querySelector('.test-shell');shell.hidden=next!=='position';
 const custom=el('ccCustomTests');custom.hidden=next==='position';
 if(next!=='position')showIntro();
}
async function fetchQuestions(category,all=false){
 const c=await client();
 let q=c.from('cc_admin_test_questions').select('*').order('created_at',{ascending:false});
 if(category)q=q.eq('category',category);
 if(!all)q=q.eq('is_published',true);
 const r=await q;if(r.error)throw r.error;return r.data||[];
}
async function showIntro(){
 const serial=++renderSerial;
 const box=el('ccCustomTests');if(!box)return;
 box.innerHTML='<div class="cct-panel"><p class="cct-note">Sorular yükleniyor…</p></div>';
 try{
  const list=await fetchQuestions(mode,false);if(serial!==renderSerial||mode==='position')return;
  rows=list;
  const label=TYPES[mode]||'Test';
  box.innerHTML='<div class="cct-panel"><div class="cct-head"><div><h3>'+esc(label)+'</h3><p>Yönetici tarafından hazırlanan dört seçenekli soruları çöz. Her sorunun ardından açıklamayı ve doğru cevabı görebilirsin.</p></div><span class="cct-count">'+list.length+' soru</span></div>'+
   '<div class="cct-controls"><label>Soru sayısı <select id="cctCount"><option value="5">5 soru</option><option value="10" selected>10 soru</option><option value="20">20 soru</option><option value="all">Tüm sorular</option></select></label><button type="button" id="cctStart">Testi Başlat</button></div>'+
   (list.length?'':'<div class="cct-empty">Bu test türünde henüz yayımlanmış soru bulunmuyor.</div>')+'</div>';
  el('cctStart').disabled=!list.length;el('cctStart').onclick=start;
 }catch(e){if(serial===renderSerial)box.innerHTML='<div class="cct-panel cct-error">Sorular yüklenemedi: '+esc(e.message)+'</div>'}
}
function start(){
 const size=el('cctCount')?.value||'10';let pool=rows.slice();
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 const n=size==='all'?pool.length:Math.min(Number(size),pool.length);
 active={questions:pool.slice(0,n),index:0,correct:0};answers=[];answerIndex=-1;renderQuestion();
}
function renderQuestion(){
 const q=active?.questions[active.index];if(!q)return;
 const n=active.questions.length,i=active.index;
 el('ccCustomTests').innerHTML='<div class="cct-panel"><div class="cct-head"><div><span class="cct-kicker">'+esc(TYPES[mode])+'</span><h3>Soru '+(i+1)+' / '+n+'</h3></div><span class="cct-count">'+active.correct+' doğru</span></div><div class="cct-progress"><i style="width:'+Math.round(i/n*100)+'%"></i></div><div class="cct-question">'+esc(q.question)+'</div><div class="cct-options">'+q.options.map((o,j)=>'<button type="button" data-cct-option="'+j+'"><b>'+String.fromCharCode(65+j)+'</b><span>'+esc(o)+'</span></button>').join('')+'</div><div id="cctFeedback"></div><div class="cct-footer"><button type="button" class="cct-neutral" id="cctLeave">Test Seçimine Dön</button><button type="button" id="cctNext" disabled>'+(i===n-1?'Sonuçları Gör':'Sonraki Soru')+'</button></div></div>';
 el('cctLeave').onclick=()=>{active=null;showIntro()};
 el('cctNext').onclick=next;
 el('ccCustomTests').querySelectorAll('[data-cct-option]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.cctOption)));
}
function answer(j){
 if(!active||answerIndex!==-1)return;
 answerIndex=j;const q=active.questions[active.index],right=Number(q.correct_index),ok=j===right;
 if(ok)active.correct++;
 answers.push({question:q.question,correct:ok,chosen:j,right});
 el('ccCustomTests').querySelectorAll('[data-cct-option]').forEach(b=>{
  const k=Number(b.dataset.cctOption);b.disabled=true;
  if(k===right)b.classList.add('correct');else if(k===j)b.classList.add('wrong');
 });
 el('cctFeedback').innerHTML='<div class="cct-feedback '+(ok?'good':'bad')+'"><b>'+(ok?'✓ Doğru cevap':'Yanlış cevap · Doğru seçenek '+String.fromCharCode(65+right))+'</b>'+(q.explanation?'<p>'+esc(q.explanation)+'</p>':'')+'</div>';
 el('cctNext').disabled=false;
}
function next(){
 if(!active)return;
 active.index++;answerIndex=-1;
 if(active.index<active.questions.length)renderQuestion();else finish();
}
function finish(){
 const n=active.questions.length,correct=active.correct;
 el('ccCustomTests').innerHTML='<div class="cct-panel cct-finish"><span class="cct-kicker">TEST TAMAMLANDI</span><h3>'+correct+' / '+n+' doğru</h3><p>Başarı oranı: %'+Math.round(100*correct/n)+'</p><div class="cct-finish-actions"><button type="button" id="cctAgain">Yeni Test Çöz</button><button type="button" class="cct-neutral" id="cctHome">Test Seçimine Dön</button></div></div>';
 el('cctAgain').onclick=()=>{active=null;showIntro()};el('cctHome').onclick=()=>{active=null;showIntro()};
}
async function openAdmin(){
 if(!admin()){nav('home');return}
 setup();editing=null;await listAdmin();
}
function adminShell(){
 const root=el('cctAdminRoot');if(!root)return null;
 root.innerHTML='<div class="hero"><div><button type="button" class="admin-page-back" id="cctAdminBack">← Yönetim Paneli</button><h2>Test Soruları Yönetimi</h2><p>İzahname ve Yönetici GTİP Soruları testleri için soru ekle, düzenle, yayımla veya kaldır.</p></div></div>'+
 '<div class="cct-admin-grid"><div class="cct-panel"><h3 id="cctFormTitle">Yeni Soru</h3><p class="cct-note">A–D şıkları zorunlu, E şıkkı isteğe bağlıdır.</p><label>Etiket <select id="cctCategory"><option value="izahname">İzahname</option><option value="gtip">Yönetici GTİP Soruları</option></select></label><label>Soru <textarea id="cctQuestion" rows="4" maxlength="3000" placeholder="Soruyu yazın…" ></textarea></label><div class="cct-choice-fields">'+[0,1,2,3,4].map(i=>'<label>'+String.fromCharCode(65+i)+' şıkkı <input id="cctOption'+i+'" maxlength="1200" placeholder="'+String.fromCharCode(65+i)+' seçeneği"></label>').join('')+'</div><label>Doğru cevap <select id="cctCorrect">'+[0,1,2,3,4].map(i=>'<option value="'+i+'">'+String.fromCharCode(65+i)+' şıkkı</option>').join('')+'</select></label><label>Çözüm açıklaması (isteğe bağlı) <textarea id="cctExplanation" rows="3" placeholder="Doğru cevabın gerekçesi…"></textarea></label><label class="cct-checkbox"><input id="cctPublished" type="checkbox" checked> Yayımla (kullanıcılar çözebilsin)</label><div class="cct-admin-actions"><button type="button" id="cctSave">Soruyu Kaydet</button><button type="button" id="cctReset" class="cct-neutral">Yeni Soru</button></div><p id="cctMessage" aria-live="polite"></p></div><div class="cct-panel"><div class="cct-head"><h3>Kayıtlı Sorular</h3><select id="cctFilter"><option value="">Tüm etiketler</option><option value="izahname">İzahname</option><option value="gtip">Yönetici GTİP Soruları</option></select></div><div id="cctAdminList">Yükleniyor…</div></div></div>';
 el('cctAdminBack').onclick=()=>nav('adminhub');el('cctSave').onclick=saveAdmin;el('cctReset').onclick=resetAdmin;el('cctFilter').onchange=drawAdmin;
 return root;
}
async function listAdmin(){
 const root=adminShell();if(!root)return;
 try{rows=await fetchQuestions(null,true);drawAdmin()}
 catch(e){el('cctAdminList').textContent='Sorular okunamadı: '+e.message}
}
function drawAdmin(){
 const area=el('cctAdminList');if(!area)return;
 const filter=el('cctFilter').value,list=rows.filter(x=>!filter||x.category===filter);
 area.innerHTML=list.length?list.map(x=>'<div class="cct-admin-item"><div><small>'+esc(TYPES[x.category])+' · '+(x.is_published?'Yayında':'Taslak')+'</small><b>'+esc(x.question)+'</b></div><div><button type="button" data-cct-edit="'+x.id+'">Düzenle</button><button type="button" data-cct-delete="'+x.id+'" class="cct-danger">Sil</button></div></div>').join(''):'<p class="cct-note">Bu etiket altında soru bulunmuyor.</p>';
 area.querySelectorAll('[data-cct-edit]').forEach(b=>b.onclick=()=>editAdmin(Number(b.dataset.cctEdit)));
 area.querySelectorAll('[data-cct-delete]').forEach(b=>b.onclick=()=>deleteAdmin(Number(b.dataset.cctDelete)));
}
function resetAdmin(){
 editing=null;el('cctFormTitle').textContent='Yeni Soru';
 el('cctQuestion').value='';el('cctCategory').value='izahname';
 for(let i=0;i<5;i++)el('cctOption'+i).value='';
 el('cctCorrect').value='0';el('cctExplanation').value='';el('cctPublished').checked=true;el('cctMessage').textContent='';
}
function editAdmin(id){
 const q=rows.find(x=>Number(x.id)===id);if(!q)return;
 editing=id;el('cctFormTitle').textContent='Soruyu Düzenle #'+id;
 el('cctCategory').value=q.category;el('cctQuestion').value=q.question;
 for(let i=0;i<5;i++)el('cctOption'+i).value=q.options[i]||'';
 el('cctCorrect').value=String(q.correct_index);
 el('cctExplanation').value=q.explanation||'';el('cctPublished').checked=!!q.is_published;el('cctMessage').textContent='';
 el('cctFormTitle').scrollIntoView({block:'center',behavior:'smooth'});
}
async function saveAdmin(){
 if(!admin())return;
 const question=el('cctQuestion').value.trim(),options=[0,1,2,3,4].map(i=>el('cctOption'+i).value.trim()).filter((x,i)=>i<4||x);
 const message=el('cctMessage');
 if(question.length<5||options.some(x=>!x)||Number(el('cctCorrect').value)>=options.length){message.textContent='Soru en az 5 karakter olmalı; A–D şıkları doldurulmalı ve doğru seçenek mevcut olmalı. E şıkkı isteğe bağlıdır.';return}
 const data={category:el('cctCategory').value,question,options,correct_index:Number(el('cctCorrect').value),explanation:el('cctExplanation').value.trim(),is_published:el('cctPublished').checked,updated_at:new Date().toISOString()};
 if(editing)data.id=editing;
 const btn=el('cctSave');btn.disabled=true;message.textContent='Kaydediliyor…';
 try{const c=await client();const r=await c.from('cc_admin_test_questions').upsert(data).select('id').single();if(r.error)throw r.error;await listAdmin();resetAdmin();el('cctMessage').textContent='Soru kaydedildi ✓'}
 catch(e){message.textContent='Kaydedilemedi: '+e.message}
 finally{const b=el('cctSave');if(b)b.disabled=false}
}
async function deleteAdmin(id){
 if(!admin()||!confirm('Bu soruyu kalıcı olarak silmek istiyor musun?'))return;
 try{const c=await client();const r=await c.from('cc_admin_test_questions').delete().eq('id',id);if(r.error)throw r.error;rows=rows.filter(x=>Number(x.id)!==id);drawAdmin();if(editing===id)resetAdmin()}
 catch(e){alert('Soru silinemedi: '+e.message)}
}
window.CC_TESTS={open,openAdmin,choose};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
