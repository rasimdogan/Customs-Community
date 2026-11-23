/* Customs Community — Yönetim Paneli / Soru Bankası
   Bağımsız modül. Testler, Topluluk ve Kütüphane akışına müdahale etmez. */
(function(){
'use strict';
const MODAL_ID='ccqbOverlay';
const TABLE='cc_admin_test_questions';
const TEST_TABLE='cc_admin_question_tests';
const LABELS={izahname:'İzahname',gtip:'Yönetici Soruları'};
const $=id=>document.getElementById(id);
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let all=[],tests=[],editing=null,loading=false;
const isAdmin=()=>window.CC_AUTH?.getProfile?.()?.role==='admin';
async function db(){
 if(!isAdmin())throw new Error('Bu işlem yalnızca yöneticilere açıktır.');
 const client=await window.CC_AUTH?.getClient?.();
 if(!client)throw new Error('Giriş oturumu bulunamadı.');
 return client;
}
const style="\n#ccqbOverlay{position:fixed;inset:0;z-index:100300;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(8,22,40,.7);backdrop-filter:blur(3px)}\n#ccqbOverlay[hidden]{display:none!important}\n#ccqbOverlay *{box-sizing:border-box}\n#ccqbOverlay .ccqb-dialog{width:min(1100px,100%);max-height:92dvh;display:flex;flex-direction:column;overflow:hidden;background:#f7fafd;color:#182d43;border-radius:18px;box-shadow:0 22px 80px #0005;font-family:inherit}\n#ccqbOverlay .ccqb-header{padding:20px 24px;display:flex;justify-content:space-between;gap:15px;background:#173756;color:white}\n#ccqbOverlay .ccqb-header small{font-size:10px;font-weight:800;letter-spacing:1px;color:#aac9df}\n#ccqbOverlay .ccqb-header h2{margin:4px 0 5px;font-size:22px}\n#ccqbOverlay .ccqb-header p{font-size:12px;margin:0;color:#c7d8e5}\n#ccqbOverlay #ccqbClose{align-self:flex-start;background:#ffffff16;border:1px solid #ffffff55;border-radius:9px;padding:8px 12px;color:white;font-weight:700;cursor:pointer}\n#ccqbOverlay .ccqb-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;padding:16px;overflow:auto}\n#ccqbOverlay .ccqb-editor,#ccqbOverlay .ccqb-library{background:white;border:1px solid #d9e5ee;border-radius:13px;padding:18px;min-width:0}\n#ccqbOverlay h3{font-size:16px;margin:0 0 15px}\n#ccqbOverlay form label{display:grid;gap:6px;font-size:12px;color:#38546b;font-weight:700;margin-bottom:13px}\n#ccqbOverlay textarea,#ccqbOverlay input:not([type=checkbox]),#ccqbOverlay select{width:100%;background:#fff;border:1px solid #cbdbe8;border-radius:9px;padding:10px 11px;min-width:0;font:inherit;font-size:13px;color:#1e3a52;outline-color:#6ba6cf}\n#ccqbOverlay textarea{resize:vertical}\n#ccqbOverlay .ccqb-choices h4{font-size:12px;margin:18px 0 9px;color:#38546b}\n#ccqbOverlay .ccqb-choices label{display:flex;align-items:center;gap:11px}\n#ccqbOverlay .ccqb-choices label>b{flex:none;width:27px;height:27px;display:grid;place-items:center;background:#e9f2fa;color:#1d5880;border-radius:7px}\n#ccqbOverlay .ccqb-check{display:flex;gap:9px;align-items:center}\n#ccqbOverlay .ccqb-actions{display:flex;gap:8px;flex-wrap:wrap}\n#ccqbOverlay .ccqb-actions button,#ccqbOverlay .ccqb-row-actions button{border-radius:9px;padding:9px 12px;border:1px solid #caddeb;background:#f5f9fc;color:#285878;font:inherit;font-weight:750;font-size:12px;cursor:pointer}\n#ccqbOverlay .ccqb-actions button.ccqb-primary{background:#236b9b;color:white;border-color:#236b9b}\n#ccqbOverlay .ccqb-actions button:disabled{opacity:.55;cursor:wait}\n#ccqbOverlay #ccqbMessage{font-size:12px;min-height:18px;color:#23744e;margin:12px 0 0}\n#ccqbOverlay #ccqbMessage.ccqb-error{color:#b14444}\n#ccqbOverlay .ccqb-list-head{display:flex;gap:12px;justify-content:space-between;align-items:center;margin-bottom:13px}\n#ccqbOverlay .ccqb-list-head h3{margin:0 0 4px}\n#ccqbOverlay .ccqb-list-head p{margin:0;font-size:11px;color:#688098}\n#ccqbOverlay .ccqb-list-head select{width:auto;max-width:190px}\n#ccqbOverlay .ccqb-record{border-top:1px solid #e0eaf2;padding:14px 0;display:flex;justify-content:space-between;gap:10px}\n#ccqbOverlay .ccqb-record h4{font-size:13px;line-height:1.5;color:#182f46;margin:7px 0;overflow-wrap:anywhere}\n#ccqbOverlay .ccqb-record small,#ccqbOverlay .ccqb-state{color:#72869a;font-size:11px}\n#ccqbOverlay .ccqb-tag{background:#ecf4fa;padding:4px 7px;border-radius:6px;color:#285d86;font-size:10px;font-weight:800}\n#ccqbOverlay .ccqb-row-actions{display:flex;gap:5px;flex-shrink:0;align-items:flex-start}\n#ccqbOverlay .ccqb-row-actions button{padding:6px 8px;font-size:11px}\n#ccqbOverlay .ccqb-empty{font-size:12px;color:#7b8c9d}\n#ccqbOverlay .ccqb-record>div:first-child{min-width:0;flex:1}\n#ccqbOverlay .ccqb-answer-details{margin-top:10px;border:1px solid #d7e5f0;border-radius:10px;background:#f8fbfe;overflow:hidden}\n#ccqbOverlay .ccqb-answer-details>summary{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 13px;cursor:pointer;color:#286185;font-size:12px;font-weight:800;list-style:none;user-select:none}\n#ccqbOverlay .ccqb-answer-details>summary::-webkit-details-marker{display:none}\n#ccqbOverlay .ccqb-answer-details[open]>summary{background:#eaf3fa;border-bottom:1px solid #d7e5f0}\n#ccqbOverlay .ccqb-answer-details[open]>summary span{transform:rotate(180deg)}\n#ccqbOverlay .ccqb-answer-details ol{margin:0;padding:8px 16px 10px 42px;display:grid;gap:5px}\n#ccqbOverlay .ccqb-answer-details li{font-size:12px;line-height:1.5;padding:7px 9px;border-radius:7px;color:#314c62;overflow-wrap:anywhere}\n#ccqbOverlay .ccqb-answer-details li::marker{font-weight:800;color:#456982}\n#ccqbOverlay .ccqb-answer-details li.ccqb-answer-correct{background:#e9f7ee;color:#18623b}\n#ccqbOverlay .ccqb-answer-details li strong{display:inline-block;color:#197142;font-size:10px;margin-left:8px}\n#ccqbOverlay .ccqb-answer-explanation{padding:10px 14px;margin:0;border-top:1px solid #d9e6ee;font-size:12px;line-height:1.6;color:#3f5b6e}\n\n@media(max-width:800px){#ccqbOverlay{padding:0}#ccqbOverlay .ccqb-dialog{height:100dvh;max-height:100dvh;border-radius:0}#ccqbOverlay .ccqb-body{grid-template-columns:1fr}#ccqbOverlay .ccqb-record{flex-direction:column}#ccqbOverlay .ccqb-list-head{flex-wrap:wrap}}\n#ccqbOverlay .ccqb-test-manager{background:#f0f6fa;border:1px solid #d6e6f0;border-radius:12px;padding:13px;margin:0 0 19px}\n#ccqbOverlay .ccqb-test-manager h3{margin:0 0 7px}\n#ccqbOverlay .ccqb-test-manager small{color:#607d91;font-size:11px}\n#ccqbOverlay .ccqb-test-controls{display:grid;grid-template-columns:1fr 1.6fr auto;gap:8px;align-items:end;margin-top:11px}\n#ccqbOverlay .ccqb-test-controls>button{border:0;border-radius:9px;padding:11px;background:#216b98;color:white;font-weight:800;cursor:pointer}\n#ccqbOverlay .ccqb-test-list{display:grid;gap:7px;max-height:240px;overflow-y:auto;margin-top:12px}\n#ccqbOverlay .ccqb-test-row{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;border:1px solid #d9e6f0;padding:9px;border-radius:10px}\n#ccqbOverlay .ccqb-test-row b{font-size:12px;color:#254c68;overflow-wrap:anywhere}\n#ccqbOverlay .ccqb-test-row small{display:block;font-size:10px;margin-top:3px}\n#ccqbOverlay .ccqb-test-tools{display:flex;gap:4px;flex-wrap:wrap;justify-content:end}\n#ccqbOverlay .ccqb-test-tools button{border:1px solid #cbdce7;background:#f5f9fd;border-radius:8px;padding:6px 7px;font-size:11px;cursor:pointer;color:#24587b}\n#ccqbOverlay .ccqb-test-tools button:disabled{opacity:.45;cursor:not-allowed}\n#ccqbOverlay .ccqb-test-warning{font-size:11px;color:#9e591b;margin:5px 0 0}\n#ccqbOverlay .ccqb-editor .ccqb-secondary-head{margin-top:15px;border-top:1px solid #dbe7ef;padding-top:16px}\n#ccqbOverlay .ccqb-list-head>select{max-width:none;width:100%}\n#ccqbOverlay .ccqb-list-head{display:grid;grid-template-columns:1fr minmax(125px,170px) minmax(125px,170px)}\n@media(max-width:800px){#ccqbOverlay .ccqb-test-controls{grid-template-columns:1fr}#ccqbOverlay .ccqb-list-head{grid-template-columns:1fr 1fr}#ccqbOverlay .ccqb-list-head>div{grid-column:1/-1}}\n";
function mount(){
 if(!$('ccqbStyle')){const sheet=document.createElement('style');sheet.id='ccqbStyle';sheet.textContent=style;document.head.appendChild(sheet)}
 const grid=document.querySelector('#view-adminhub .admin-hub-grid');
 if(grid&&!$('ccqbLauncher')){
  const btn=document.createElement('button');btn.id='ccqbLauncher';btn.type='button';btn.className='admin-hub-card';
  btn.innerHTML='<span class="admin-hub-icon">✎</span><span><b>Soru Bankası</b><small>İsimlendirilmiş testler oluştur, soruları testlere ayır ve yönet.</small></span><i>→</i>';
  btn.onclick=open;
  grid.insertBefore(btn,grid.firstElementChild);
 }
}
function createModal(){
 if($(MODAL_ID))return;
 const root=document.createElement('div');root.id=MODAL_ID;root.hidden=true;
 root.innerHTML='<section class="ccqb-dialog" role="dialog" aria-modal="true" aria-label="Yönetici soru bankası">'+
 '<header class="ccqb-header"><div><small>YÖNETİM PANELİ</small><h2>Soru Bankası</h2><p>İki kategoride isimlendirilmiş testler oluşturun. Her test en fazla 50 soru içerebilir.</p></div><button type="button" id="ccqbClose" aria-label="Pencereyi kapat">✕</button></header>'+
 '<div class="ccqb-body"><div class="ccqb-editor"><section class="ccqb-test-manager"><h3>Testleri Yönet</h3><small>Önce kategori seçerek adını belirlediğin bir test oluştur. Her test en fazla 50 soru içerebilir.</small>'+
 '<div class="ccqb-test-controls"><select id="ccqbNewTestCategory" aria-label="Yeni testin kategorisi"><option value="gtip">Yönetici Soruları</option><option value="izahname">İzahname Soruları</option></select><input id="ccqbNewTestName" type="text" maxlength="120" placeholder="Ör. Yönetici Testi 1" aria-label="Yeni test adı"><button type="button" id="ccqbNewTestCreate">+ Test Oluştur</button></div><div id="ccqbTestList" class="ccqb-test-list"></div></section>'+
 '<h3 id="ccqbFormTitle" class="ccqb-secondary-head">Yeni Soru Oluştur</h3><form id="ccqbForm" autocomplete="off">'+
 '<label>Etiket <select id="ccqbCategory" required><option value="izahname">İzahname Soruları</option><option value="gtip">Yönetici Soruları</option></select></label>'+
 '<label>Test <select id="ccqbTestId" required></select><small id="ccqbTestCapacity" class="ccqb-test-warning"></small></label>'+
 '<label>Soru metni <textarea id="ccqbQuestion" rows="4" minlength="5" maxlength="3000" placeholder="Sorunu buraya yaz…" required></textarea></label>'+
 '<div class="ccqb-choices"><h4>Yanıt seçenekleri</h4>'+['A','B','C','D','E'].map((letter,i)=>'<label><b>'+letter+'</b><input type="text" id="ccqbOption'+i+'" required maxlength="1200" placeholder="'+letter+' şıkkını yaz…"></label>').join('')+'</div>'+
 '<label>Doğru cevap <select id="ccqbCorrect" required>'+['A','B','C','D','E'].map((x,i)=>'<option value="'+i+'">'+x+' şıkkı</option>').join('')+'</select></label>'+
 '<label>Çözüm açıklaması (isteğe bağlı) <textarea id="ccqbExplanation" rows="3" placeholder="Doğru cevabın gerekçesi…"></textarea></label>'+
 '<label class="ccqb-check"><input type="checkbox" id="ccqbPublished" checked> Yayımlandı</label>'+
 '<div class="ccqb-actions"><button type="submit" id="ccqbSave" class="ccqb-primary">Soruyu Kaydet</button><button type="button" id="ccqbClear">Yeni Soru</button></div>'+
 '<p id="ccqbMessage" role="status" aria-live="polite"></p></form></div>'+
 '<div class="ccqb-library"><div class="ccqb-list-head"><div><h3>Kayıtlı Sorular</h3><p id="ccqbCount"></p></div><select id="ccqbFilter" aria-label="Etiket filtresi"><option value="">Tüm Etiketler</option><option value="izahname">İzahname</option><option value="gtip">Yönetici Soruları</option></select><select id="ccqbTestFilter" aria-label="Test filtresi"><option value="">Tüm Testler</option></select></div><div id="ccqbResults">Sorular yükleniyor…</div></div></div></section>';
 document.body.appendChild(root);
 root.addEventListener('click',e=>{if(e.target===root)close()});
 $('ccqbClose').onclick=close;
 $('ccqbClear').onclick=clear;
 $('ccqbFilter').onchange=()=>{populateFilterTests();draw()};
 $('ccqbTestFilter').onchange=draw;
 $('ccqbCategory').onchange=()=>populateQuestionTests();
 $('ccqbTestId').onchange=updateTestCapacity;
 $('ccqbNewTestCategory').onchange=drawTestManager;
 $('ccqbNewTestCreate').onclick=createTest;
 $('ccqbNewTestName').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();createTest()}});
 $('ccqbTestList').addEventListener('click',e=>{
  const button=e.target.closest('button[data-test-action]');if(!button)return;
  const action=button.dataset.testAction,id=button.dataset.testId;
  if(action==='rename')renameTest(id);
  if(action==='publish')toggleTest(id);
  if(action==='delete')deleteTest(id);
 });
 $('ccqbForm').addEventListener('submit',e=>{e.preventDefault();save()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close()});
}
function close(){const root=$(MODAL_ID);if(root)root.hidden=true}
async function open(){
 if(!isAdmin())return;
 mount();createModal();
 $(MODAL_ID).hidden=false;clear();await refresh();
}
function status(msg,problem=false){const label=$('ccqbMessage');if(label){label.textContent=msg;label.classList.toggle('ccqb-error',problem)}}
function clear(){
 editing=null;
 if(!$('ccqbForm'))return;
 $('ccqbForm').reset();$('ccqbFormTitle').textContent='Yeni Soru Oluştur';
 $('ccqbCorrect').value='0';$('ccqbPublished').checked=true;
 populateQuestionTests();status('');
}
async function refresh(){
 try{
  const client=await db();
  const [testResult,questionResult]=await Promise.all([
   client.from(TEST_TABLE).select('id,category,name,is_published,created_at').order('created_at',{ascending:true}),
   client.from(TABLE).select('id,test_id,category,question,options,correct_index,explanation,is_published,created_at').order('created_at',{ascending:false})
  ]);
  if(testResult.error)throw testResult.error;
  if(questionResult.error)throw questionResult.error;
  tests=testResult.data||[];all=questionResult.data||[];
  populateQuestionTests();populateFilterTests();drawTestManager();draw();
 }catch(e){
  const area=$('ccqbResults');if(area)area.textContent='Sorular yüklenemedi: '+(e.message||e);
  status('Soru bankası yüklenemedi: '+(e.message||e),true);
 }
}
function populateQuestionTests(preferred){
 const cat=$('ccqbCategory')?.value,sel=$('ccqbTestId');if(!sel)return;
 const previous=preferred||sel.value;
 const available=tests.filter(t=>t.category===cat);
 sel.innerHTML=available.map(t=>'<option value="'+html(t.id)+'">'+html(t.name)+(t.is_published?'':' (Taslak)')+'</option>').join('');
 if(available.some(t=>t.id===previous))sel.value=previous;
 updateTestCapacity();
}
function updateTestCapacity(){
 const id=$('ccqbTestId')?.value,area=$('ccqbTestCapacity');if(!area)return;
 const count=all.filter(q=>q.test_id===id&&q.id!==editing).length;
 area.textContent=id?(count>=50?'Bu test dolu (50/50). Başka bir test seç.':'Bu testte '+count+' soru var · En fazla 50 soru.'): 'Bu kategoride test yok. Yukarıdan yeni test oluştur.';
}
function populateFilterTests(){
 const sel=$('ccqbTestFilter');if(!sel)return;
 const current=sel.value,cat=$('ccqbFilter')?.value;
 const available=tests.filter(t=>!cat||t.category===cat);
 sel.innerHTML='<option value="">Tüm Testler</option>'+available.map(t=>'<option value="'+html(t.id)+'">'+html(t.name)+'</option>').join('');
 if(available.some(t=>t.id===current))sel.value=current;
}
function drawTestManager(){
 const area=$('ccqbTestList');if(!area)return;
 const category=$('ccqbNewTestCategory').value;
 const rows=tests.filter(t=>t.category===category);
 area.innerHTML=rows.length?rows.map(t=>{
  const count=all.filter(q=>q.test_id===t.id).length;
  return '<div class="ccqb-test-row"><div><b>'+html(t.name)+'</b><small>'+count+' / 50 soru · '+(t.is_published?'Yayında':'Taslak')+'</small></div><div class="ccqb-test-tools">'+
  '<button type="button" data-test-action="rename" data-test-id="'+html(t.id)+'">Adı Düzenle</button>'+
  '<button type="button" data-test-action="publish" data-test-id="'+html(t.id)+'">'+(t.is_published?'Taslağa Al':'Yayımla')+'</button>'+
  '<button type="button" data-test-action="delete" data-test-id="'+html(t.id)+'" '+(count?'disabled title="Soruları olan test silinemez"':'')+'>Sil</button></div></div>'
 }).join(''):'<p class="ccqb-empty">Bu kategoride henüz test bulunmuyor.</p>';
}
async function createTest(){
 if(!isAdmin()||loading)return;
 const category=$('ccqbNewTestCategory').value,name=$('ccqbNewTestName').value.trim();
 if(!name||name.length>120){status('Test adı 1–120 karakter olmalı.',true);return}
 loading=true;const btn=$('ccqbNewTestCreate');btn.disabled=true;
 try{
  const client=await db();
  const r=await client.from(TEST_TABLE).insert({category,name}).select('id').single();
  if(r.error)throw r.error;
  $('ccqbNewTestName').value='';$('ccqbCategory').value=category;
  await refresh();populateQuestionTests(r.data.id);
  status('"'+name+'" testi oluşturuldu. Şimdi bu teste soru ekleyebilirsin.');
 }catch(e){status('Test oluşturulamadı: '+(e.message||e),true)}
 finally{loading=false;btn.disabled=false}
}
async function renameTest(id){
 const t=tests.find(x=>x.id===id);if(!t)return;
 const name=window.prompt('Testin yeni adını yaz:',t.name);
 if(name===null)return;
 const next=name.trim();if(!next||next.length>120){status('Test adı 1–120 karakter olmalı.',true);return}
 try{
  const client=await db(),r=await client.from(TEST_TABLE).update({name:next,updated_at:new Date().toISOString()}).eq('id',id).select('id').single();
  if(r.error)throw r.error;
  await refresh();status('Testin adı güncellendi.');
 }catch(e){status('Test adı güncellenemedi: '+(e.message||e),true)}
}
async function toggleTest(id){
 const t=tests.find(x=>x.id===id);if(!t)return;
 try{
  const client=await db(),r=await client.from(TEST_TABLE).update({is_published:!t.is_published,updated_at:new Date().toISOString()}).eq('id',id).select('id').single();
  if(r.error)throw r.error;
  await refresh();status(t.is_published?'Test taslağa alındı.':'Test yayımlandı.');
 }catch(e){status('Test durumu güncellenemedi: '+(e.message||e),true)}
}
async function deleteTest(id){
 const t=tests.find(x=>x.id===id);if(!t)return;
 if(all.some(q=>q.test_id===id))return status('Soruları bulunan test silinemez. Soruları başka bir teste taşı veya önce sil.',true);
 if(!confirm('"'+t.name+'" adlı boş test silinsin mi?'))return;
 try{
  const client=await db(),r=await client.from(TEST_TABLE).delete().eq('id',id).select('id');
  if(r.error)throw r.error;
  if(!r.data?.length)throw Error('Silme işlemi doğrulanamadı.');
  await refresh();status('Boş test silindi.');
 }catch(e){status('Test silinemedi: '+(e.message||e),true)}
}

function draw(){
 const area=$('ccqbResults');if(!area)return;
 const key=$('ccqbFilter').value,testFilter=$('ccqbTestFilter').value;
 const rows=all.filter(x=>(!key||x.category===key)&&(!testFilter||x.test_id===testFilter));
 $('ccqbCount').textContent=rows.length+' kayıt';
 area.innerHTML=rows.length?rows.map(row=>
  '<article class="ccqb-record"><div><span class="ccqb-tag">'+html(LABELS[row.category]||row.category)+'</span> <span class="ccqb-tag">'+html(tests.find(t=>t.id===row.test_id)?.name||'Testsiz')+'</span> <span class="ccqb-state">'+(row.is_published?'Yayında':'Taslak')+'</span>'+
  '<h4>'+html(row.question)+'</h4><details class="ccqb-answer-details"><summary>Şıkları göster <span aria-hidden="true">▾</span></summary><ol type="A">'+(Array.isArray(row.options)?row.options:[]).map((option,i)=>'<li class="'+(i===Number(row.correct_index)?'ccqb-answer-correct':'')+'"><span>'+html(option)+'</span>'+(i===Number(row.correct_index)?'<strong>✓ Doğru cevap</strong>':'')+'</li>').join('')+'</ol>'+(row.explanation?'<p class="ccqb-answer-explanation"><b>Çözüm:</b> '+html(row.explanation)+'</p>':'')+'</details></div>'+
  '<div class="ccqb-row-actions"><button type="button" data-ccqb-edit="'+row.id+'">Düzenle</button><button type="button" data-ccqb-delete="'+row.id+'">Sil</button></div></article>'
 ).join(''):'<p class="ccqb-empty">Henüz soru eklenmemiş.</p>';
 area.querySelectorAll('[data-ccqb-edit]').forEach(b=>b.onclick=()=>edit(Number(b.dataset.ccqbEdit)));
 area.querySelectorAll('[data-ccqb-delete]').forEach(b=>b.onclick=()=>remove(Number(b.dataset.ccqbDelete)));
}
function edit(id){
 const q=all.find(x=>Number(x.id)===id);if(!q)return;
 editing=id;$('ccqbFormTitle').textContent='Soruyu Düzenle #'+id;
 $('ccqbCategory').value=q.category;
 populateQuestionTests(q.test_id);
 $('ccqbQuestion').value=q.question;
 for(let i=0;i<5;i++)$('ccqbOption'+i).value=q.options[i]||'';
 $('ccqbCorrect').value=String(q.correct_index);
 $('ccqbExplanation').value=q.explanation||'';
 $('ccqbPublished').checked=!!q.is_published;status('');
 $('ccqbFormTitle').scrollIntoView({block:'nearest',behavior:'smooth'});
}
async function save(){
 if(!isAdmin()||loading)return;
 const options=Array.from({length:5},(_,i)=>$('ccqbOption'+i).value.trim());
 const question=$('ccqbQuestion').value.trim();
 if(question.length<5||options.some(x=>!x)){status('Soru ve beş şıkkın tamamı doldurulmalı.',true);return}
 const testId=$('ccqbTestId').value,category=$('ccqbCategory').value;
 const selectedTest=tests.find(t=>t.id===testId&&t.category===category);
 if(!selectedTest){status('Önce bu kategoriye ait bir test seç.',true);return}
 if(all.filter(q=>q.test_id===testId&&q.id!==editing).length>=50){status('Seçtiğin test 50 soruya ulaştı. Başka bir test oluştur.',true);return}
 const data={category,test_id:testId,question,options,correct_index:Number($('ccqbCorrect').value),explanation:$('ccqbExplanation').value.trim(),is_published:$('ccqbPublished').checked,updated_at:new Date().toISOString()};
 loading=true;$('ccqbSave').disabled=true;status('Kaydediliyor…');
 try{
  const client=await db();
  const query=editing?client.from(TABLE).update(data).eq('id',editing):client.from(TABLE).insert(data);
  const result=await query.select('id').single();
  if(result.error)throw result.error;
  const keepCategory=category,keepTest=testId;
  clear();$('ccqbCategory').value=keepCategory;
  await refresh();populateQuestionTests(keepTest);status('Soru başarıyla kaydedildi ✓');
 }catch(e){status('Kaydedilemedi: '+(e.message||e),true)}
 finally{loading=false;$('ccqbSave').disabled=false}
}
async function remove(id){
 if(!isAdmin()||!confirm('Seçili soruyu kalıcı olarak silmek istiyor musun?'))return;
 try{
  const client=await db();
  const r=await client.from(TABLE).delete().eq('id',id).select('id');
  if(r.error)throw r.error;
  if(!r.data?.length)throw new Error('Silme işlemi doğrulanamadı.');
  if(editing===id)clear();
  await refresh();status('Soru silindi ✓');
 }catch(e){status('Silinemedi: '+(e.message||e),true)}
}
window.CC_QUESTION_BANK={open};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
