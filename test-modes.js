(function(){
'use strict';
const el=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={gtip:'Yönetici Soruları',izahname:'İzahname'};
let mode='position',bank=[],tests=[],selectedTestId=null,round=null,answered=false,request=0,originalStart=null,originalCancel=null,originalNext=null,originalRender=null,originalAnswer=null;
const mix=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function setup(){
 const host=el('view-test'),focus=host?.querySelector('.test-focus');if(!focus||el('ccTestModes'))return;
 const modes=document.createElement('div');modes.id='ccTestModes';
 modes.innerHTML='<button type="button" data-ccmode="gtip">Yönetici Soruları</button><button type="button" data-ccmode="izahname">İzahname</button><button type="button" data-ccmode="position" class="active">Tarife Pozisyon Testi</button>';
 focus.prepend(modes);
 modes.addEventListener('click',e=>{const b=e.target.closest('[data-ccmode]');if(b)setMode(b.dataset.ccmode)});
 const shell=focus.querySelector('.test-shell');
 const choice=document.createElement('div');choice.id='ccProductChoice';
 choice.innerHTML='<strong>Soru biçimi</strong><div><label><input name="ccProductFormat" type="radio" value="full" checked> Tüm Kart Bilgisi</label><label><input name="ccProductFormat" type="radio" value="product"> Ürün Bazlı (Tek Ürün veya Eşya)</label></div>';
 const chapter=el('chapterQuizPanel');(chapter||shell).after(choice);
 const custom=document.createElement('div');custom.id='ccCustomTest';custom.hidden=true;shell.after(custom);
 const intro=focus.querySelector('.test-hero p');if(intro)intro.textContent='İzahname, Yönetici Soruları veya kartlardan oluşturulan 4 haneli tarife testlerini çöz.';
 wrapStart();
 wrapPositionControls();
}
function setMode(value){
 setup();mode=value;request++;round=null;selectedTestId=null;
 const focus=el('view-test')?.querySelector('.test-focus'),shell=focus?.querySelector('.test-shell'),custom=el('ccCustomTest'),product=el('ccProductChoice');if(!shell||!custom)return;
 el('ccTestModes').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.ccmode===value));
 if(value!=='position'&&el('view-test')?.classList.contains('cc-test-running'))window.cancelPositionTest?.();
 shell.hidden=value!=='position';product.hidden=value!=='position';custom.hidden=value==='position';
 if(value!=='position')el('view-test')?.classList.remove('cc-test-running');
 if(value!=='position')loadBank();
}
function products(card){
 const txt=String(card.text||'').replace(/^\s*\d{4}\s*/,'');
 const code=String(card.code||'');if(!/^\d{4}$/.test(code))return [];
 const segments=txt.replace(/[\r\n•]+/g,',').split(/[,;]+/);
 const names=segments.map(s=>s.trim().replace(/^\s*[-–:]+\s*/,'').replace(/\s*\([^)]*\)\s*$/,'').replace(/\s+/g,' ').trim()).filter(s=>s.length>=4&&s.length<=57&&!/[:.]|\d{4}/.test(s)&&!(/^(not|hariç|vb|diğer|boş|istisna|pozisyon|örnek|bunlar|bunların)\b/i.test(s)));
 // Soru adları için kalıcı editoryal ayrımlar: muğlak "Böcekler" sorulmaz.
 const rules=window.CC_PRODUCT_QUESTION_RULES||{};
 const override=rules.byCode?.[code]||{};
 const exactKey=v=>String(v||'').toLocaleLowerCase('tr-TR').trim();
 const blocked=new Set([...(rules.ambiguousNames||[]),...(override.replace||[])].map(exactKey));
 const safe=names.filter(name=>!blocked.has(exactKey(name))&&!/^böcekler ve /i.test(name));
 return [...new Set([...safe,...(override.add||[])])].slice(0,20);
}
function items(pool){
 const candidates=pool.flatMap(card=>products(card).map(name=>({card,name,code:String(card.code)})));
 const byName=new Map();
 for(const p of candidates){const k=p.name.toLocaleLowerCase('tr-TR');if(!byName.has(k))byName.set(k,new Set());byName.get(k).add(p.code)}
 return candidates.filter(p=>byName.get(p.name.toLocaleLowerCase('tr-TR')).size===1);
}
function wrapStart(){
 if(originalStart||typeof window.startTest!=='function')return;
 originalStart=window.startTest;
 window.startTest=function(returnToReview=false){
  if(!el('ccProductChoice')?.querySelector('input[value="product"]')?.checked||returnToReview){
   const host=el('view-test');
   host?.classList.remove('cc-product-question');
   // renderQuestion() çalışırken alttaki ortak düğmeler hazır olmalı.
   if(!returnToReview)host?.classList.add('cc-test-running');
   const result=originalStart.apply(this,arguments);
   if(returnToReview||typeof testState==='undefined'||!testState.questions?.length)host?.classList.remove('cc-test-running');
   return result;
  }
  const pool=getQuizPool(),productsPool=items(pool);
  if(!productsPool.length){alert('Seçilen fasıllarda ayrı bir ürün veya eşya adı belirlenemedi. Tüm Kart Bilgisi seçeneğini kullanabilirsiniz.');return}
  const val=el('testCount').value,count=val==='all'?productsPool.length:Math.min(+val,productsPool.length);
  const codes=[...new Set(CARDS.map(c=>String(c.code)).filter(x=>/^\d{4}$/.test(x)))];
  const qs=mix(productsPool).slice(0,count).map(p=>{
   const same=mix([...new Set(CARDS.filter(c=>Number(c.chapter)===Number(p.card.chapter)).map(c=>String(c.code)).filter(x=>/^\d{4}$/.test(x)&&x!==p.code))]);
   const distractors=same.slice(0,4);
   for(const code of mix(codes)){if(distractors.length===4)break;if(code!==p.code&&!distractors.includes(code))distractors.push(code)}
   if(distractors.length!==4)return null;
   return {card:{...p.card,text:p.name},question:'"'+p.name+'" aşağıdaki hangi tarife pozisyonunda sınıflandırılmıştır?',answer:p.code,options:mix([p.code,...distractors]).map(code=>({code}))};
  }).filter(Boolean);
  if(!qs.length){alert('Şıklar için yeterli tarife pozisyonu yok.');return}
  el('view-test')?.classList.add('cc-product-question','cc-test-running');setTestRunning(true);testState={questions:qs,current:0,correct:0,wrong:0,answered:false,returnToReview:false};renderQuestion();
 };
}
function wrapPositionControls(){
 if(!originalCancel&&typeof window.cancelPositionTest==='function'){
  originalCancel=window.cancelPositionTest;
  window.cancelPositionTest=function(){
   const result=originalCancel.apply(this,arguments);
   el('view-test')?.classList.remove('cc-test-running','cc-product-question');
   return result;
  };
 }
 if(!originalRender&&typeof window.renderQuestion==='function'){
  originalRender=window.renderQuestion;
  window.renderQuestion=function(){
   const result=originalRender.apply(this,arguments);
   const host=el('view-test');
   if(!host?.classList.contains('cc-test-running'))return result;
   const question=el('testArea')?.querySelector('.question');
   if(!question||question.querySelector('.cct-position-actions'))return result;
   const isLast=testState.current===testState.questions.length-1;
   const actions=document.createElement('div');
   actions.className='cct-position-actions';
   actions.innerHTML='<button type="button" class="cct-back">Test Seçimine Dön</button><button type="button" class="cct-forward" disabled>'+(isLast?'Testi Bitir':'Sonraki Soru')+'</button>';
   question.appendChild(actions);
   actions.querySelector('.cct-back').onclick=()=>window.cancelPositionTest();
   actions.querySelector('.cct-forward').onclick=()=>window.nextTest();
   return result;
  };
 }
 if(!originalAnswer&&typeof window.answerTest==='function'){
  originalAnswer=window.answerTest;
  window.answerTest=function(){
   const result=originalAnswer.apply(this,arguments);
   if(el('view-test')?.classList.contains('cc-test-running')){
    const next=el('testArea')?.querySelector('.cct-position-actions .cct-forward');
    if(next&&testState.answered)next.disabled=false;
   }
   return result;
  };
 }
 if(!originalNext&&typeof window.nextTest==='function'){
  originalNext=window.nextTest;
  window.nextTest=function(){
   const finished=typeof testState!=='undefined'&&testState.questions?.length&&testState.current===testState.questions.length-1;
   const result=originalNext.apply(this,arguments);
   if(finished&&el('view-test')?.classList.contains('cc-test-running')){
    const area=el('testArea');
    // Eski sonuç ekranının 'Aynı havuzdan yeni test oluştur' düğmesini kaldır.
    const resultPanel=area?.querySelector('.quizresult')?.closest('.question');
    if(resultPanel){for(const btn of resultPanel.querySelectorAll('button')){if(btn.textContent?.includes('Aynı havuzdan yeni test oluştur'))btn.remove()}}
    if(area&&!el('ccReturnToSelection')){
     const button=document.createElement('button');
     button.type='button';button.id='ccReturnToSelection';button.className='cc-position-return';
     button.textContent='Test Seçimine Dön';
     button.onclick=()=>window.cancelPositionTest();
     area.querySelector('.question')?.appendChild(button);
    }
   }
   return result;
  };
 }
}
async function loadBank(){
 const ticket=++request,box=el('ccCustomTest');if(!box)return;
 box.innerHTML='<p>Testler yükleniyor…</p>';
 try{
  const client=await window.CC_AUTH?.getClient?.();if(!client)throw Error('Oturum bulunamadı');
  const [tr,qr]=await Promise.all([
   client.from('cc_admin_question_tests').select('id,category,name').eq('category',mode).eq('is_published',true).order('created_at',{ascending:true}),
   client.from('cc_admin_test_questions').select('id,test_id,category,question,options,correct_index,explanation').eq('category',mode).eq('is_published',true).order('id',{ascending:true})
  ]);
  if(tr.error)throw tr.error;if(qr.error)throw qr.error;
  if(ticket!==request||mode==='position')return;
  tests=tr.data||[];
  bank=(qr.data||[]).filter(x=>Array.isArray(x.options)&&x.options.length===5&&x.correct_index>=0&&x.correct_index<5);
  renderTestSelection();
 }catch(e){if(ticket===request)box.innerHTML='<p>Testler yüklenemedi: '+esc(e.message)+'</p>'}
}
function renderTestSelection(){
 const box=el('ccCustomTest');if(!box)return;
 const existing=tests.filter(t=>bank.some(q=>q.test_id===t.id));
 if(!existing.some(t=>t.id===selectedTestId))selectedTestId=existing[0]?.id||'';
 const selected=tests.find(t=>t.id===selectedTestId);
 const count=bank.filter(q=>q.test_id===selectedTestId).length;
 box.innerHTML='<div class="cct-head"><div><h3>'+esc(labels[mode])+'</h3><p>Yönetim panelinde hazırlanmış testlerden birini seç ve başlat. Her test en fazla 50 sorudan oluşur.</p></div><span>'+tests.length+' test</span></div>'+
  '<div class="cct-controls"><label>Test Seç <select id="ccCustomTestSelect"><option value="">Bir test seçin…</option>'+tests.map(t=>{
   const n=bank.filter(q=>q.test_id===t.id).length;
   return '<option value="'+esc(t.id)+'" '+(t.id===selectedTestId?'selected':'')+' '+(!n?'disabled':'')+'>'+esc(t.name)+' ('+n+' soru)</option>'
  }).join('')+'</select></label>'+
  '<button type="button" id="ccCustomStart" '+(!count?'disabled':'')+'>Testi Başlat</button></div>'+
  (selected?'<p class="cct-test-selection-note"><b>'+esc(selected.name)+'</b> · '+count+' soru hazır.</p>':'<p class="cct-test-selection-note">Henüz yayımlanmış sorusu olan test bulunmuyor.</p>');
 el('ccCustomTestSelect').onchange=e=>{
  selectedTestId=e.target.value;
  renderTestSelection();
 };
 el('ccCustomStart').onclick=startCustom;
}
function startCustom(){
 const selected=tests.find(t=>t.id===selectedTestId);
 if(!selected)return;
 const qs=bank.filter(q=>q.test_id===selected.id).sort((a,b)=>Number(a.id)-Number(b.id)).slice(0,50);
 if(!qs.length)return;
 round={questions:qs,index:0,correct:0,title:selected.name};showQuestion();
}
function showQuestion(){
 const q=round.questions[round.index],n=round.questions.length;answered=false;
 el('ccCustomTest').innerHTML='<div class="cct-head"><div><h3>'+esc(round.title)+'</h3><p>'+esc(labels[mode])+'</p></div><span>Soru '+(round.index+1)+' / '+n+'</span></div><div class="cct-question">'+esc(q.question)+'</div><div class="cct-options">'+q.options.map((s,i)=>'<button type="button" data-choice="'+i+'"><b>'+String.fromCharCode(65+i)+'</b><span>'+esc(s)+'</span></button>').join('')+'</div><div id="ccCustomFeedback"></div><div class="cct-actions"><button type="button" id="ccCustomBack" class="cct-secondary">Test Seçimine Dön</button><button type="button" id="ccCustomNext" disabled>'+(round.index===n-1?'Testi Bitir':'Sonraki Soru')+'</button></div>';
 el('ccCustomBack').onclick=()=>{round=null;loadBank()};
 el('ccCustomNext').onclick=()=>{round.index++;if(round.index===n)finish();else showQuestion()};
 el('ccCustomTest').querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.choice)));
}
function choose(i){
 if(answered)return;answered=true;
 const q=round.questions[round.index],right=Number(q.correct_index),ok=i===right;if(ok)round.correct++;
 el('ccCustomTest').querySelectorAll('[data-choice]').forEach(b=>{
  const index=Number(b.dataset.choice);b.disabled=true;
  if(index===right)b.classList.add('correct');
  else if(index===i)b.classList.add('wrong');
 });
 el('ccCustomFeedback').innerHTML='<div class="cct-feedback '+(ok?'ok':'bad')+'"><strong>'+(ok?'✓ Doğru işaretlediniz.':'✕ Hatalı işaretlediniz. Doğru cevap: '+String.fromCharCode(65+right))+'</strong>'+(q.explanation?'<p>'+esc(q.explanation)+'</p>':'')+'</div>';
 el('ccCustomNext').disabled=false;
}
function finish(){
 const n=round.questions.length,correct=round.correct,wrong=n-correct,pct=Math.round(correct/n*100);
 el('ccCustomTest').innerHTML='<div class="cct-result"><h3>'+esc(round.title)+' · Test Tamamlandı</h3><div class="cct-stats"><div><span>Toplam</span><strong>'+n+'</strong></div><div><span>Doğru</span><strong class="cct-green">'+correct+'</strong></div><div><span>Yanlış</span><strong class="cct-red">'+wrong+'</strong></div><div><span>Başarı</span><strong>%'+pct+'</strong></div></div><div class="cct-success">Test tamamlandı · Başarı oranı: <strong>%'+pct+'</strong></div><div class="cct-actions"><button type="button" id="ccCustomExit" class="cct-secondary">Test Seçimine Dön</button></div></div>';
 el('ccCustomExit').onclick=()=>{round=null;loadBank()};
}
window.CC_TEST_MODES={setup,setMode,products,items};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();