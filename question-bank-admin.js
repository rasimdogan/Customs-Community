/* Customs Community — Yönetim Paneli / Soru Bankası
   Bağımsız modül. Testler, Topluluk ve Kütüphane akışına müdahale etmez. */
(function(){
'use strict';
const MODAL_ID='ccqbOverlay';
const TABLE='cc_admin_test_questions';
const LABELS={izahname:'İzahname',gtip:'Yönetici Soruları'};
const $=id=>document.getElementById(id);
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let all=[],editing=null,loading=false;
const isAdmin=()=>window.CC_AUTH?.getProfile?.()?.role==='admin';
async function db(){
 if(!isAdmin())throw new Error('Bu işlem yalnızca yöneticilere açıktır.');
 const client=await window.CC_AUTH?.getClient?.();
 if(!client)throw new Error('Giriş oturumu bulunamadı.');
 return client;
}
const style="\n#ccqbOverlay{position:fixed;inset:0;z-index:100300;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(8,22,40,.7);backdrop-filter:blur(3px)}\n#ccqbOverlay[hidden]{display:none!important}\n#ccqbOverlay *{box-sizing:border-box}\n#ccqbOverlay .ccqb-dialog{width:min(1100px,100%);max-height:92dvh;display:flex;flex-direction:column;overflow:hidden;background:#f7fafd;color:#182d43;border-radius:18px;box-shadow:0 22px 80px #0005;font-family:inherit}\n#ccqbOverlay .ccqb-header{padding:20px 24px;display:flex;justify-content:space-between;gap:15px;background:#173756;color:white}\n#ccqbOverlay .ccqb-header small{font-size:10px;font-weight:800;letter-spacing:1px;color:#aac9df}\n#ccqbOverlay .ccqb-header h2{margin:4px 0 5px;font-size:22px}\n#ccqbOverlay .ccqb-header p{font-size:12px;margin:0;color:#c7d8e5}\n#ccqbOverlay #ccqbClose{align-self:flex-start;background:#ffffff16;border:1px solid #ffffff55;border-radius:9px;padding:8px 12px;color:white;font-weight:700;cursor:pointer}\n#ccqbOverlay .ccqb-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;padding:16px;overflow:auto}\n#ccqbOverlay .ccqb-editor,#ccqbOverlay .ccqb-library{background:white;border:1px solid #d9e5ee;border-radius:13px;padding:18px;min-width:0}\n#ccqbOverlay h3{font-size:16px;margin:0 0 15px}\n#ccqbOverlay form label{display:grid;gap:6px;font-size:12px;color:#38546b;font-weight:700;margin-bottom:13px}\n#ccqbOverlay textarea,#ccqbOverlay input:not([type=checkbox]),#ccqbOverlay select{width:100%;background:#fff;border:1px solid #cbdbe8;border-radius:9px;padding:10px 11px;min-width:0;font:inherit;font-size:13px;color:#1e3a52;outline-color:#6ba6cf}\n#ccqbOverlay textarea{resize:vertical}\n#ccqbOverlay .ccqb-choices h4{font-size:12px;margin:18px 0 9px;color:#38546b}\n#ccqbOverlay .ccqb-choices label{display:flex;align-items:center;gap:11px}\n#ccqbOverlay .ccqb-choices label>b{flex:none;width:27px;height:27px;display:grid;place-items:center;background:#e9f2fa;color:#1d5880;border-radius:7px}\n#ccqbOverlay .ccqb-check{display:flex;gap:9px;align-items:center}\n#ccqbOverlay .ccqb-actions{display:flex;gap:8px;flex-wrap:wrap}\n#ccqbOverlay .ccqb-actions button,#ccqbOverlay .ccqb-row-actions button{border-radius:9px;padding:9px 12px;border:1px solid #caddeb;background:#f5f9fc;color:#285878;font:inherit;font-weight:750;font-size:12px;cursor:pointer}\n#ccqbOverlay .ccqb-actions button.ccqb-primary{background:#236b9b;color:white;border-color:#236b9b}\n#ccqbOverlay .ccqb-actions button:disabled{opacity:.55;cursor:wait}\n#ccqbOverlay #ccqbMessage{font-size:12px;min-height:18px;color:#23744e;margin:12px 0 0}\n#ccqbOverlay #ccqbMessage.ccqb-error{color:#b14444}\n#ccqbOverlay .ccqb-list-head{display:flex;gap:12px;justify-content:space-between;align-items:center;margin-bottom:13px}\n#ccqbOverlay .ccqb-list-head h3{margin:0 0 4px}\n#ccqbOverlay .ccqb-list-head p{margin:0;font-size:11px;color:#688098}\n#ccqbOverlay .ccqb-list-head select{width:auto;max-width:190px}\n#ccqbOverlay .ccqb-record{border-top:1px solid #e0eaf2;padding:14px 0;display:flex;justify-content:space-between;gap:10px}\n#ccqbOverlay .ccqb-record h4{font-size:13px;line-height:1.5;color:#182f46;margin:7px 0;overflow-wrap:anywhere}\n#ccqbOverlay .ccqb-record small,#ccqbOverlay .ccqb-state{color:#72869a;font-size:11px}\n#ccqbOverlay .ccqb-tag{background:#ecf4fa;padding:4px 7px;border-radius:6px;color:#285d86;font-size:10px;font-weight:800}\n#ccqbOverlay .ccqb-row-actions{display:flex;gap:5px;flex-shrink:0;align-items:flex-start}\n#ccqbOverlay .ccqb-row-actions button{padding:6px 8px;font-size:11px}\n#ccqbOverlay .ccqb-empty{font-size:12px;color:#7b8c9d}\n@media(max-width:800px){#ccqbOverlay{padding:0}#ccqbOverlay .ccqb-dialog{height:100dvh;max-height:100dvh;border-radius:0}#ccqbOverlay .ccqb-body{grid-template-columns:1fr}#ccqbOverlay .ccqb-record{flex-direction:column}#ccqbOverlay .ccqb-list-head{flex-wrap:wrap}}\n";
function mount(){
 if(!$('ccqbStyle')){const sheet=document.createElement('style');sheet.id='ccqbStyle';sheet.textContent=style;document.head.appendChild(sheet)}
 const grid=document.querySelector('#view-adminhub .admin-hub-grid');
 if(grid&&!$('ccqbLauncher')){
  const btn=document.createElement('button');btn.id='ccqbLauncher';btn.type='button';btn.className='admin-hub-card';
  btn.innerHTML='<span class="admin-hub-icon">✎</span><span><b>Soru Bankası</b><small>İzahname ve Yönetici Soruları ekle, şıkları ve doğru cevabı düzenle.</small></span><i>→</i>';
  btn.onclick=open;
  grid.insertBefore(btn,grid.firstElementChild);
 }
}
function createModal(){
 if($(MODAL_ID))return;
 const root=document.createElement('div');root.id=MODAL_ID;root.hidden=true;
 root.innerHTML='<section class="ccqb-dialog" role="dialog" aria-modal="true" aria-label="Yönetici soru bankası">'+
 '<header class="ccqb-header"><div><small>YÖNETİM PANELİ</small><h2>Soru Bankası</h2><p>Beş şıklı soruları hazırlayın. Testler sayfası bu aşamada değiştirilmemiştir.</p></div><button type="button" id="ccqbClose" aria-label="Pencereyi kapat">✕</button></header>'+
 '<div class="ccqb-body"><div class="ccqb-editor"><h3 id="ccqbFormTitle">Yeni Soru Oluştur</h3><form id="ccqbForm" autocomplete="off">'+
 '<label>Etiket <select id="ccqbCategory" required><option value="izahname">İzahname</option><option value="gtip">Yönetici Soruları</option></select></label>'+
 '<label>Soru metni <textarea id="ccqbQuestion" rows="4" minlength="5" maxlength="3000" placeholder="Sorunu buraya yaz…" required></textarea></label>'+
 '<div class="ccqb-choices"><h4>Yanıt seçenekleri</h4>'+['A','B','C','D','E'].map((letter,i)=>'<label><b>'+letter+'</b><input type="text" id="ccqbOption'+i+'" required maxlength="1200" placeholder="'+letter+' şıkkını yaz…"></label>').join('')+'</div>'+
 '<label>Doğru cevap <select id="ccqbCorrect" required>'+['A','B','C','D','E'].map((x,i)=>'<option value="'+i+'">'+x+' şıkkı</option>').join('')+'</select></label>'+
 '<label>Çözüm açıklaması (isteğe bağlı) <textarea id="ccqbExplanation" rows="3" placeholder="Doğru cevabın gerekçesi…"></textarea></label>'+
 '<label class="ccqb-check"><input type="checkbox" id="ccqbPublished" checked> Yayımlandı</label>'+
 '<div class="ccqb-actions"><button type="submit" id="ccqbSave" class="ccqb-primary">Soruyu Kaydet</button><button type="button" id="ccqbClear">Yeni Soru</button></div>'+
 '<p id="ccqbMessage" role="status" aria-live="polite"></p></form></div>'+
 '<div class="ccqb-library"><div class="ccqb-list-head"><div><h3>Kayıtlı Sorular</h3><p id="ccqbCount"></p></div><select id="ccqbFilter" aria-label="Etiket filtresi"><option value="">Tüm Etiketler</option><option value="izahname">İzahname</option><option value="gtip">Yönetici Soruları</option></select></div><div id="ccqbResults">Sorular yükleniyor…</div></div></div></section>';
 document.body.appendChild(root);
 root.addEventListener('click',e=>{if(e.target===root)close()});
 $('ccqbClose').onclick=close;
 $('ccqbClear').onclick=clear;
 $('ccqbFilter').onchange=draw;
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
 $('ccqbCorrect').value='0';$('ccqbPublished').checked=true;status('');
}
async function refresh(){
 try{
  const client=await db();
  const r=await client.from(TABLE).select('id,category,question,options,correct_index,explanation,is_published,created_at').order('created_at',{ascending:false});
  if(r.error)throw r.error;
  all=r.data||[];draw();
 }catch(e){const area=$('ccqbResults');if(area)area.textContent='Sorular yüklenemedi: '+(e.message||e)}
}
function draw(){
 const area=$('ccqbResults');if(!area)return;
 const key=$('ccqbFilter').value;
 const rows=all.filter(x=>!key||x.category===key);
 $('ccqbCount').textContent=rows.length+' kayıt';
 area.innerHTML=rows.length?rows.map(row=>
  '<article class="ccqb-record"><div><span class="ccqb-tag">'+html(LABELS[row.category]||row.category)+'</span> <span class="ccqb-state">'+(row.is_published?'Yayında':'Taslak')+'</span>'+
  '<h4>'+html(row.question)+'</h4><small>Doğru cevap: '+String.fromCharCode(65+Number(row.correct_index))+'</small></div>'+
  '<div class="ccqb-row-actions"><button type="button" data-ccqb-edit="'+row.id+'">Düzenle</button><button type="button" data-ccqb-delete="'+row.id+'">Sil</button></div></article>'
 ).join(''):'<p class="ccqb-empty">Henüz soru eklenmemiş.</p>';
 area.querySelectorAll('[data-ccqb-edit]').forEach(b=>b.onclick=()=>edit(Number(b.dataset.ccqbEdit)));
 area.querySelectorAll('[data-ccqb-delete]').forEach(b=>b.onclick=()=>remove(Number(b.dataset.ccqbDelete)));
}
function edit(id){
 const q=all.find(x=>Number(x.id)===id);if(!q)return;
 editing=id;$('ccqbFormTitle').textContent='Soruyu Düzenle #'+id;
 $('ccqbCategory').value=q.category;
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
 const data={category:$('ccqbCategory').value,question,options,correct_index:Number($('ccqbCorrect').value),explanation:$('ccqbExplanation').value.trim(),is_published:$('ccqbPublished').checked,updated_at:new Date().toISOString()};
 loading=true;$('ccqbSave').disabled=true;status('Kaydediliyor…');
 try{
  const client=await db();
  const query=editing?client.from(TABLE).update(data).eq('id',editing):client.from(TABLE).insert(data);
  const result=await query.select('id').single();
  if(result.error)throw result.error;
  clear();await refresh();status('Soru başarıyla kaydedildi ✓');
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
