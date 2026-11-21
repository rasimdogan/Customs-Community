// Customs Community · Tarife Atlası | 2026 Gümrük Tarife Cetveli İndeksi (kaynak: kullanıcının 5 sayfalık PDF'si)

(function(){
'use strict';
const SOURCE_SECTIONS=[{"roman":"I","title":"CANLI HAYVANLAR VE HAYVANSAL ÜRÜNLER"},{"roman":"II","title":"BİTKİSEL ÜRÜNLER"},{"roman":"III","title":"HAYVANSAL VE BİTKİSEL KATI VE SIVI YAĞLAR VE BUNLARIN PARÇALANMA ÜRÜNLERİ; HAZIR YEMEKLİK KATI YAĞLAR; HAYVANSAL VE BİTKİSEL MUMLAR"},{"roman":"IV","title":"GIDA SANAYİİ MÜSTAHZARLARI; MEŞRUBAT, ALKOLLÜ İÇKİLER VE SİRKE; TÜTÜN VEYA TÜTÜN YERİNE GEÇEN İŞLENMİŞ MADDELER"},{"roman":"V","title":"MİNERAL MADDELER"},{"roman":"VI","title":"KİMYA SANAYİİ VE BUNA BAĞLI SANAYİİ ÜRÜNLERİ"},{"roman":"VII","title":"PLASTİKLER VE MAMULLERİ; KAUÇUK VE MAMULLERİ"},{"roman":"VIII","title":"HAM POSTLAR VE DERİLER, KÖSELELER, POSTLAR, KÜRKLER VE BU MADDELERDEN MAMUL EŞYA; SARACİYE EŞYASI VE EYER VE KOŞUM TAKIMLARI; SEYAHAT EŞYASI, EL ÇANTALARI VE BENZERİ MAHFAZALAR; HAYVAN BAĞIRSAĞINDAN MAMUL EŞYA (İPEK BÖCEĞİ BAĞIRSAĞI HARİÇ)"},{"roman":"IX","title":"AĞAÇ VE AHŞAP EŞYA; ODUN KÖMÜRÜ; MANTAR VE MANTARDAN MAMUL EŞYA; HASIRDAN, SAZDAN VEYA ÖRÜLMEYE ELVERİŞLİ DİĞER MADDELERDEN MAMULLER; SEPETÇİ VE HASIRCI EŞYASI"},{"roman":"X","title":"ODUN VEYA DİĞER LİFLİ SELÜLOZİK MADDELERİN HAMURLARI VE GERİ KAZANILMIŞ KAĞIT VEYA KARTON (DÖKÜNTÜ, KIRPINTI VE HURDALAR); KAĞIT, KARTON VE MAMULLERİ"},{"roman":"XI","title":"DOKUMAYA ELVERİŞLİ MADDELER VE BUNLARDAN MAMUL EŞYA"},{"roman":"XII","title":"AYAKKABILAR, BAŞLIKLAR, ŞEMSİYELER, GÜNEŞ ŞEMSİYELERİ, BASTONLAR, İSKEMLE BASTONLAR, KEMERLER, KIRBAÇLAR VE BUNLARIN AKSAMI; HAZIRLANMIŞ TÜYLER VE BUNLARDAN MAMUL EŞYA; YAPMA ÇİÇEKLER; İNSAN SAÇINDAN MAMUL EŞYA"},{"roman":"XIII","title":"TAŞ, ALÇI, ÇİMENTO, AMYANT, MİKA VEYA BENZERİ MADDELERDEN EŞYA; SERAMİK MAMULLERİ; CAM VE CAM EŞYA"},{"roman":"XIV","title":"TABİİ VEYA KÜLTÜR İNCİLER, KIYMETLİ VEYA YARI KIYMETLİ TAŞLAR, KIYMETLİ METALLER, KIYMETLİ METALLERLE KAPLAMA METALLER VE BUNLARDAN MAMUL EŞYA; TAKLİT MÜCEVHERCİ EŞYASI; METAL PARALAR"},{"roman":"XV","title":"ADİ METALLER VE ADİ METALLERDEN EŞYA"},{"roman":"XVI","title":"MAKİNALAR VE MEKANİK CİHAZLAR; ELEKTRİK MALZEMELERİ; BUNLARIN AKSAM VE PARÇALARI; SES KAYDEDİCİLER VE KAYDEDİLEN SESİ TEKRAR VERMEYE MAHSUS CİHAZLAR, TELEVİZYON GÖRÜNTÜ VE SES KAYDEDİCİLERİ VE KAYDEDİLEN GÖRÜNTÜ VE SESİ TEKRAR VERMEYE MAHSUS CİHAZLAR; BUNLARIN AKSAM, PARÇA VE TEFERRUATI"},{"roman":"XVII","title":"NAKİL VASITALARI"},{"roman":"XVIII","title":"OPTİK ALET VE CİHAZLAR, FOTOĞRAF, SİNEMA, ÖLÇÜ, KONTROL, AYAR ALET VE CİHAZLARI, TIBBİ VEYA CERRAHİ ALET VE CİHAZLAR; SAATÇİ EŞYASI; MÜZİK ALETLERİ; BUNLARIN AKSAM, PARÇA VE AKSESUARI"},{"roman":"XIX","title":"SİLAHLAR VE MÜHİMMAT; BUNLARIN AKSAM, PARÇA VE AKSESUARI"},{"roman":"XX","title":"MUHTELİF MAMUL EŞYA"},{"roman":"XXI","title":"SANAT ESERLERİ, KOLLEKSİYON EŞYASI VE ANTİKALAR"}];
const SOURCE_CHAPTERS=[{"no":"01","section":"I","title":"Canlı hayvanlar"},{"no":"02","section":"I","title":"Etler ve yenilen sakatat"},{"no":"03","section":"I","title":"Balıklar, kabuklu hayvanlar, yumuşakçalar ve suda yaşayan diğer omurgasız hayvanlar"},{"no":"04","section":"I","title":"Süt ürünleri; kuş ve kümes hayvanlarının yumurtaları; tabii bal; tarifenin başka yerinde belirtilmeyen veya yer almayan yenilebilir hayvansal menşeli ürünler"},{"no":"05","section":"I","title":"Tarifenin başka yerinde belirtilmeyen veya yer almayan hayvansal menşeli ürünler"},{"no":"06","section":"II","title":"Canlı ağaçlar ve diğer bitkiler; yumrular, kökler ve benzerleri; kesme çiçekler ve süs yaprakları"},{"no":"07","section":"II","title":"Yenilen sebzeler ve bazı kök ve yumrular"},{"no":"08","section":"II","title":"Yenilen meyvalar ve yenilen sert kabuklu meyvalar; turunçgillerin ve kavunların ve karpuzların kabukları"},{"no":"09","section":"II","title":"Kahve, çay, paraguay çayı ve baharat"},{"no":"10","section":"II","title":"Hububat"},{"no":"11","section":"II","title":"Değirmencilik ürünleri; malt; nişasta; inülin; buğday gluteni"},{"no":"12","section":"II","title":"Yağlı tohum ve meyvalar; muhtelif tane, tohum ve meyvalar; sanayiide ve tıpta kullanılan bitkiler; saman ve kaba yem"},{"no":"13","section":"II","title":"Lak; sakız, reçine ve diğer bitkisel özsu ve hülasalar"},{"no":"14","section":"II","title":"Örülmeye elverişli bitkisel maddeler; tarifenin başka yerinde belirtilmeyen veya yer almayan bitkisel ürünler"},{"no":"15","section":"III","title":"Hayvansal ve bitkisel katı ve sıvı yağlar ve bunların parçalanma ürünleri; hazır yemeklik katı yağlar; hayvansal ve bitkisel mumlar"},{"no":"16","section":"IV","title":"Et, balık, kabuklu hayvanlar, yumuşakçalar veya diğer su omurgasızlarının müstahzarları"},{"no":"17","section":"IV","title":"Şeker ve şeker mamulleri"},{"no":"18","section":"IV","title":"Kakao ve kakao müstahzarları"},{"no":"19","section":"IV","title":"Hububat, un, nişasta veya süt müstahzarları; pastacılık ürünleri"},{"no":"20","section":"IV","title":"Sebzeler, meyvalar, sert kabuklu meyvalar ve bitkilerin diğer kısımlarından elde edilen müstahzarlar"},{"no":"21","section":"IV","title":"Yenilen çeşitli gıda müstahzarları"},{"no":"22","section":"IV","title":"Meşrubat, alkollü içkiler ve sirke"},{"no":"23","section":"IV","title":"Gıda sanayiinin kalıntı ve döküntüleri; hayvanlar için hazırlanmış kaba yemler"},{"no":"24","section":"IV","title":"Tütün ve tütün yerine geçen işlenmiş maddeler"},{"no":"25","section":"V","title":"Tuz; kükürt; topraklar ve taşlar; alçılar, kireçler ve çimento"},{"no":"26","section":"V","title":"Metal cevherleri, cüruf ve kül"},{"no":"27","section":"V","title":"Mineral yakıtlar, mineral yağlar ve bunların damıtılmasından elde edilen ürünler; bitümenli maddeler; mineral mumlar"},{"no":"28","section":"VI","title":"Anorganik kimyasallar; kıymetli metallerin, radyoaktif elementlerin; nadir toprak metallerinin ve izotoplarının organik veya anorganik bileşikleri"},{"no":"29","section":"VI","title":"Organik kimyasal ürünler"},{"no":"30","section":"VI","title":"Eczacılık ürünleri"},{"no":"31","section":"VI","title":"Gübreler"},{"no":"32","section":"VI","title":"Debagatte ve boyacılıkta kullanılan hülasalar; tanenler ve türevleri; boyalar, pigmentler ve diğer boyayıcı maddeler; müstahzar boyalar ve vernikler; macunlar; mürekkepler"},{"no":"33","section":"VI","title":"Uçucu yağlar ve rezinoitler; parfümeri, kozmetik veya tuvalet müstahzarları"},{"no":"34","section":"VI","title":"Sabunlar, yüzey-aktif organik maddeler, yıkama müstahzarları, yağlama müstahzarları, suni mumlar, müstahzar mumlar, temizleme veya bakım müstahzarları, ışık temini için kullanılan her türlü mumlar ve benzerleri, model yapmaya mahsus her türlü patlar, \"dişçi mumları\" ve alçı esaslı dişçilik müstahzarları"},{"no":"35","section":"VI","title":"Albüminoid maddeler; değişikliğe uğramış nişasta esaslı ürünler; tutkallar; enzimler"},{"no":"36","section":"VI","title":"Barut ve patlayıcı maddeler; pirotekni mamulleri; kibritler; piroforik alaşımlar; ateş alıcı maddeler"},{"no":"37","section":"VI","title":"Fotoğrafçılıkta veya sinemacılıkta kullanılan eşya"},{"no":"38","section":"VI","title":"Muhtelif kimyasal maddeler"},{"no":"39","section":"VII","title":"Plastikler ve mamulleri"},{"no":"40","section":"VII","title":"Kauçuk ve kauçuktan eşya"},{"no":"41","section":"VIII","title":"Ham postlar, deriler (kürkler hariç) ve köseleler"},{"no":"42","section":"VIII","title":"Deri eşya; saraciye eşyası ve eyer ve koşum takımları; seyahat eşyası, el çantaları ve benzeri mahfazalar; hayvan bağırsağından mamul eşya (ipek böceği bağırsağı hariç)"},{"no":"43","section":"VIII","title":"Kürkler ve taklit kürkler; bunların mamulleri"},{"no":"44","section":"IX","title":"Ağaç ve ahşap eşya; odun kömürü"},{"no":"45","section":"IX","title":"Mantar ve mantardan eşya"},{"no":"46","section":"IX","title":"Hasırdan, sazdan veya örülmeye elverişli diğer maddelerden mamuller; sepetçi ve hasırcı eşyası"},{"no":"47","section":"X","title":"Odun veya diğer lifli selülozik maddelerin hamurları; geri kazanılmış kağıt veya karton (döküntü, kırpıntı ve hurdalar)"},{"no":"48","section":"X","title":"Kağıt ve karton; kağıt hamurundan, kağıttan veya kartondan eşya"},{"no":"49","section":"X","title":"Basılı kitaplar, gazeteler, resimler ve baskı sanayiinin diğer mamulleri; el ve makina yazısı metinler ve planlar"},{"no":"50","section":"XI","title":"İpek"},{"no":"51","section":"XI","title":"Yapağı ve yün, ince veya kaba hayvan kılı; at kılından iplik ve dokunmuş mensucat"},{"no":"52","section":"XI","title":"Pamuk"},{"no":"53","section":"XI","title":"Dokumaya elverişli diğer bitkisel lifler; kağıt ipliği ve kağıt ipliğinden dokunmuş mensucat"},{"no":"54","section":"XI","title":"Sentetik ve suni filamentler, şeritler ve benzeri sentetik ve suni dokumaya elverişli maddeler"},{"no":"55","section":"XI","title":"Sentetik ve suni devamsız lifler"},{"no":"56","section":"XI","title":"Vatka, keçe ve dokunmamış mensucat; özel iplikler; sicim, kordon, ip, halat ve bunlardan mamul eşya"},{"no":"57","section":"XI","title":"Halılar ve diğer dokumaya elverişli maddelerden yer kaplamaları"},{"no":"58","section":"XI","title":"Özel dokunmuş mensucat; tufte edilmiş dokumaya elverişli mensucat; dantela; duvar halıları; şeritçi ve kaytancı eşyası; işlemeler"},{"no":"59","section":"XI","title":"Emdirilmiş, sıvanmış, kaplanmış veya lamine edilmiş dokumaya elverişli mensucat; dokumaya elverişli maddelerden teknik eşya"},{"no":"60","section":"XI","title":"Örme veya kroşe eşya"},{"no":"61","section":"XI","title":"Örme veya kroşe giyim eşyası ve aksesuarı"},{"no":"62","section":"XI","title":"Örülmemiş veya krose olmayan giyim eşyası ve aksesuarı"},{"no":"63","section":"XI","title":"Dokumaya elverişli maddelerden diğer hazır eşya; takımlar; kullanılmış giyim eşyası ve dokumaya elverişli maddelerden kullanılmış eşya; paçavralar"},{"no":"64","section":"XII","title":"Ayakkabılar, getrler, tozluklar ve benzeri eşya; bunların aksamı"},{"no":"65","section":"XII","title":"Başlıklar ve aksamı"},{"no":"66","section":"XII","title":"Şemsiyeler, güneş şemsiyeleri, bastonlar, iskemle bastonlar, kamçılar, kırbaçlar ve bunların aksamı"},{"no":"67","section":"XII","title":"Hazırlanmış ince ve kalın kuş tüyleri ve bunlardan eşya; yapma çiçekler; insan saçından eşya"},{"no":"68","section":"XIII","title":"Taş, alçı, çimento, amyant, mika veya benzeri maddelerden eşya"},{"no":"69","section":"XIII","title":"Seramik mamulleri"},{"no":"70","section":"XIII","title":"Cam ve cam eşya"},{"no":"71","section":"XIV","title":"Tabii veya kültür inciler, kıymetli veya yarı kıymetli taşlar, kıymetli metaller, kıymetli metallerle kaplama metaller ve bunlardan mamul eşya; taklit mücevherci eşyası; metal paralar"},{"no":"72","section":"XV","title":"Demir ve çelik"},{"no":"73","section":"XV","title":"Demir veya çelikten eşya"},{"no":"74","section":"XV","title":"Bakır ve bakırdan eşya"},{"no":"75","section":"XV","title":"Nikel ve nikelden eşya"},{"no":"76","section":"XV","title":"Aluminyum ve aluminyumdan eşya"},{"no":"77","section":"XV","title":"(Armonize Sistem Nomanklatürü'nde ileride kullanılmak amacıyla saklı tutulmuştur.)"},{"no":"78","section":"XV","title":"Kurşun ve kurşundan eşya"},{"no":"79","section":"XV","title":"Çinko ve çinkodan eşya"},{"no":"80","section":"XV","title":"Kalay ve kalaydan eşya"},{"no":"81","section":"XV","title":"Diğer adi metaller; sermetler; bunlardan eşya"},{"no":"82","section":"XV","title":"Adi metallerden aletler, bıçakcı eşyası ve sofra takımları; adi metallerden bunların aksam ve parçaları"},{"no":"83","section":"XV","title":"Adi metallerden çeşitli eşya"},{"no":"84","section":"XVI","title":"Nükleer reaktörler, kazanlar, makinalar, mekanik cihazlar ve aletler; bunların aksam ve parçaları"},{"no":"85","section":"XVI","title":"Elektrikli makina ve cihazlar ve bunların aksam ve parçaları; ses kaydetmeye ve kaydedilen sesi tekrar vermeye mahsus cihazlar; televizyon görüntü ve seslerinin kaydedilmesine ve kaydedilen görüntü ve sesin tekrar verilmesine mahsus cihazlar ve bunların aksam, parça ve aksesuarı"},{"no":"86","section":"XVII","title":"Demiryolu ve benzeri hatlara ait taşıtlar ve malzemeler ve bunların aksam ve parçaları; her türlü mekanik (elektro mekanik olanlar dahil) trafik sinyalizasyon cihazları"},{"no":"87","section":"XVII","title":"Motorlu kara taşıtları, traktörler, bisikletler, motosikletler ve diğer kara taşıtları; bunların aksam, parça ve aksesuarı"},{"no":"88","section":"XVII","title":"Hava taşıtları, uzay taşıtları ve bunların aksam ve parçalar"},{"no":"89","section":"XVII","title":"Gemiler ve suda yüzen taşıt ve araçlar"},{"no":"90","section":"XVIII","title":"Optik alet ve cihazlar, fotoğraf, sinema, ölçü, kontrol, ayar alet ve cihazları, tıbbi veya cerrahi alet ve cihazlar; bunların aksam, parça ve aksesuarı"},{"no":"91","section":"XVIII","title":"Saatler ve bunların aksam ve parçaları"},{"no":"92","section":"XVIII","title":"Müzik aletleri; bunların aksam, parça ve aksesuarı"},{"no":"93","section":"XIX","title":"Silahlar ve mühimmat; bunların aksam, parça ve aksesuarı"},{"no":"94","section":"XX","title":"Mobilyalar, tıpta veya cerrahide kullanılan mobilyalar, yatak takımları ve benzeri doldurulmuş eşya; tarifenin başka yerinde belirtilmeyen veya yer almayan aydınlatma cihazları; reklam lambaları, ışıklı tabelalar, ışıklı isim plakaları ve benzerleri; prefabrik yapılar"},{"no":"95","section":"XX","title":"Oyuncaklar, oyun ve spor malzemeleri; bunların aksam, parça ve aksesuarı"},{"no":"96","section":"XX","title":"Çeşitli mamul eşya"},{"no":"97","section":"XXI","title":"Sanat eserleri, kolleksiyon eşyası ve antikalar"},{"no":"99","section":"XXI","title":"Özel amaçlı gümrük tarife istatistik pozisyonlar"}];
const STYLE="\n#ccTarifeAtlas[hidden]{display:none!important}\n#ccTarifeAtlas{--ca-ink:#163047;--ca-muted:#657d91;--ca-blue:#116b82;--ca-border:#dce8ee;--ca-bg:#f7fbfd;color:var(--ca-ink);font-family:inherit;max-width:1400px;margin:0 auto;padding-bottom:35px}\n#ccTarifeAtlas *{box-sizing:border-box}\n#ccTarifeAtlas button,#ccTarifeAtlas input,#ccTarifeAtlas select{font:inherit}\n#ccTarifeAtlas button{cursor:pointer}\n#ccTarifeAtlas button:focus-visible,#ccTarifeAtlas input:focus-visible,#ccTarifeAtlas select:focus-visible{outline:3px solid #27a0b7;outline-offset:2px}\n#ccTarifeAtlas .ca-hero{background:linear-gradient(119deg,#112d46,#18596b 78%,#177b86);color:#fff;border-radius:18px;padding:24px 26px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px}\n#ccTarifeAtlas .ca-kicker{font-size:11px;font-weight:800;letter-spacing:1.2px;opacity:.78}\n#ccTarifeAtlas .ca-hero h2{font-size:26px;margin:6px 0 6px;font-weight:850;line-height:1.2;color:#fff}\n#ccTarifeAtlas .ca-hero p{font-size:13px;line-height:1.65;margin:0;color:#d6e8ed;max-width:700px}\n#ccTarifeAtlas .ca-hero button{background:#fff;color:#173d55;border:0;border-radius:10px;padding:10px 13px;font-size:12px;font-weight:800;white-space:nowrap}\n#ccTarifeAtlas .ca-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:15px 0}\n#ccTarifeAtlas .ca-metric{border:1px solid var(--ca-border);border-radius:13px;background:#fff;padding:14px}\n#ccTarifeAtlas .ca-metric strong{display:block;font-size:23px;font-weight:850;color:#153e53}\n#ccTarifeAtlas .ca-metric small{display:block;margin-top:3px;color:var(--ca-muted);font-size:11px;font-weight:650}\n#ccTarifeAtlas .ca-layout{border:1px solid var(--ca-border);border-radius:16px;background:#fff;overflow:hidden}\n#ccTarifeAtlas .ca-tabs{display:flex;align-items:center;gap:6px;padding:12px 14px;border-bottom:1px solid var(--ca-border);overflow-x:auto;scrollbar-width:thin}\n#ccTarifeAtlas .ca-tabs button{white-space:nowrap;border:1px solid transparent;background:transparent;color:#4d687a;font-size:13px;font-weight:780;padding:10px 14px;border-radius:9px}\n#ccTarifeAtlas .ca-tabs button.active{background:#e6f4f6;border-color:#a9d7dc;color:#075e72}\n#ccTarifeAtlas .ca-inner{padding:17px}\n#ccTarifeAtlas .ca-tools{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:12px}\n#ccTarifeAtlas .ca-tools input{background:#fff;border:1px solid #cfdfe7;border-radius:10px;min-width:210px;flex:2 1 240px;padding:12px;font-size:13px;color:#183c50}\n#ccTarifeAtlas .ca-tools select{background:#fff;border:1px solid #cfdfe7;border-radius:10px;flex:1 1 180px;padding:12px;font-size:13px;color:#183c50}\n#ccTarifeAtlas .ca-note{font-size:12px;color:var(--ca-muted);line-height:1.65;margin:6px 0 14px}\n#ccTarifeAtlas .ca-section{border:1px solid #d8e5ec;border-radius:13px;overflow:hidden;margin-bottom:10px}\n#ccTarifeAtlas .ca-section-head{display:flex;gap:12px;align-items:center;width:100%;padding:14px;background:#f5f9fb;border:0;text-align:left;color:#163c51}\n#ccTarifeAtlas .ca-section-head .ca-num{background:#16344c;color:#fff;border-radius:7px;padding:7px 8px;min-width:61px;text-align:center;font-size:11px;font-weight:850}\n#ccTarifeAtlas .ca-section-head .ca-title{flex:1;min-width:0;font-size:13px;font-weight:750;line-height:1.55}\n#ccTarifeAtlas .ca-section-head .ca-count{font-size:11px;color:#64798c;white-space:nowrap}\n#ccTarifeAtlas .ca-section-open .ca-section-head{background:#eaf5f6}\n#ccTarifeAtlas .ca-rows{padding:5px 10px 10px}\n#ccTarifeAtlas .ca-row{display:grid;grid-template-columns:46px minmax(0,1fr) auto;align-items:center;gap:10px;padding:11px 5px;border-bottom:1px solid #eef2f5}\n#ccTarifeAtlas .ca-row:last-child{border-bottom:0}\n#ccTarifeAtlas .ca-code{display:grid;place-items:center;min-height:39px;border-radius:8px;background:#e7f1f3;color:#086877;font-size:15px;font-weight:850}\n#ccTarifeAtlas .ca-chapter-title{font-size:12.5px;line-height:1.5;color:#28465b}\n#ccTarifeAtlas .ca-status{display:inline-block;font-size:10px;font-weight:800;color:#647b89;margin-top:4px}\n#ccTarifeAtlas .ca-status.is-done{color:#168451}\n#ccTarifeAtlas .ca-status.is-learn{color:#b97917}\n#ccTarifeAtlas .ca-actions{display:flex;align-items:center;flex-wrap:wrap;gap:5px;justify-content:flex-end}\n#ccTarifeAtlas .ca-actions button,#ccTarifeAtlas .ca-btn{border:1px solid #c6dbe5;border-radius:8px;padding:8px 9px;background:#fff;color:#2d6276;font-size:11px;font-weight:750}\n#ccTarifeAtlas .ca-actions button.ca-selected{background:#dff4ea;border-color:#9fdbc1;color:#0b7546}\n#ccTarifeAtlas .ca-actions button.ca-card{background:#16657a;border-color:#16657a;color:#fff}\n#ccTarifeAtlas button:disabled{opacity:.42;cursor:not-allowed}\n#ccTarifeAtlas .ca-special{background:#fcfaf3;color:#7b6844;border-radius:8px;padding:7px 9px;font-size:11px;margin-top:6px}\n#ccTarifeAtlas .ca-practice{max-width:950px;margin:4px auto;padding:4px}\n#ccTarifeAtlas .ca-practice-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:14px}\n#ccTarifeAtlas .ca-practice-head h3{margin:0;font-size:19px;color:#173c50}\n#ccTarifeAtlas .ca-practice-head select{border:1px solid #d0dee6;border-radius:9px;padding:10px;max-width:300px}\n#ccTarifeAtlas .ca-question{background:#f6fafb;padding:18px;border-radius:13px;border:1px solid #dfeaf0}\n#ccTarifeAtlas .ca-question h3{font-size:19px;color:#1a4157;line-height:1.5;margin:0 0 15px}\n#ccTarifeAtlas .ca-options{display:grid;grid-template-columns:1fr 1fr;gap:9px}\n#ccTarifeAtlas .ca-options button{border:1px solid #d4e2e9;border-radius:10px;text-align:left;background:#fff;padding:14px;color:#234f63;font-size:13px;line-height:1.5}\n#ccTarifeAtlas .ca-options button.correct{border-color:#37a777;background:#e4f6eb;color:#117747}\n#ccTarifeAtlas .ca-options button.wrong{border-color:#da7777;background:#fff0f0;color:#a53a3a}\n#ccTarifeAtlas .ca-feedback{margin:12px 0;padding:13px;border-radius:10px;background:#ecf5f8;font-size:13px;line-height:1.6;color:#23506b}\n#ccTarifeAtlas .ca-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:12px}\n#ccTarifeAtlas .ca-footer .ca-primary,#ccTarifeAtlas .ca-primary{border:0;border-radius:9px;background:#116a7f;color:#fff;padding:11px 16px;font-size:12px;font-weight:800}\n#ccTarifeAtlas .ca-match-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}\n#ccTarifeAtlas .ca-match-col{display:flex;flex-direction:column;gap:9px}\n#ccTarifeAtlas .ca-match-col h4{margin:0 0 5px;font-size:13px}\n#ccTarifeAtlas .ca-match-item{display:flex;align-items:center;gap:8px;width:100%;border:1px solid #d1dfe6;background:#fff;border-radius:9px;padding:11px;text-align:left;color:#20495b;font-size:12px;line-height:1.45;min-height:64px}\n#ccTarifeAtlas .ca-match-item.selected{border-color:#148ba6;background:#e7f7f9}\n#ccTarifeAtlas .ca-match-item.matched{border-color:#a0d7be;background:#e9f7ef;color:#16774b}\n#ccTarifeAtlas .ca-match-item strong{font-size:16px;color:#0b7288}\n#ccTarifeAtlas .ca-help{font-size:11px;color:#73879a;margin:10px 0}\n#ccTarifeAtlas .ca-empty{padding:28px;text-align:center;color:#658090}\nbody.dark #ccTarifeAtlas{--ca-ink:#e5f2f8;--ca-muted:#b0c6d2;--ca-border:#34546a;--ca-bg:#0d2335}\nbody.dark #ccTarifeAtlas .ca-metric,body.dark #ccTarifeAtlas .ca-layout,body.dark #ccTarifeAtlas .ca-section,body.dark #ccTarifeAtlas .ca-match-item,body.dark #ccTarifeAtlas .ca-options button{background:#132b3e;color:#d3e7f0;border-color:#335469}\nbody.dark #ccTarifeAtlas .ca-metric strong,body.dark #ccTarifeAtlas .ca-practice-head h3,body.dark #ccTarifeAtlas .ca-question h3,body.dark #ccTarifeAtlas .ca-chapter-title{color:#e0f0f8}\nbody.dark #ccTarifeAtlas .ca-section-head,body.dark #ccTarifeAtlas .ca-section-open .ca-section-head,body.dark #ccTarifeAtlas .ca-question{background:#18394c;color:#d7e9ef;border-color:#335469}\nbody.dark #ccTarifeAtlas .ca-section-head .ca-title{color:#dbeaf0}\nbody.dark #ccTarifeAtlas .ca-row{border-color:#29475a}\nbody.dark #ccTarifeAtlas .ca-tabs button.active{background:#1d4658;color:#b8edf6;border-color:#2d6e82}\nbody.dark #ccTarifeAtlas .ca-tools input,body.dark #ccTarifeAtlas .ca-tools select,body.dark #ccTarifeAtlas .ca-practice-head select{background:#152f43;color:#eff7fa;border-color:#3c5c70}\n@media(max-width:820px){#ccTarifeAtlas .ca-row{grid-template-columns:41px minmax(0,1fr)}#ccTarifeAtlas .ca-actions{grid-column:2;justify-content:flex-start}#ccTarifeAtlas .ca-metrics{grid-template-columns:repeat(2,1fr)}#ccTarifeAtlas .ca-hero{flex-direction:column}#ccTarifeAtlas .ca-hero h2{font-size:23px}}\n@media(max-width:560px){#ccTarifeAtlas .ca-inner{padding:11px}#ccTarifeAtlas .ca-options{grid-template-columns:1fr}#ccTarifeAtlas .ca-match-grid{gap:9px}#ccTarifeAtlas .ca-match-item{font-size:11px;padding:8px;min-height:67px}#ccTarifeAtlas .ca-section-head{padding:11px 8px;gap:8px}#ccTarifeAtlas .ca-section-head .ca-num{min-width:53px}#ccTarifeAtlas .ca-section-head .ca-count{display:none}#ccTarifeAtlas .ca-actions button{padding:8px 7px}}\n/* Tarife Atlası · fasıl durum butonlarının tutarlı hizası, 20.11.2026 */\n#ccTarifeAtlas .ca-row{grid-template-columns:46px minmax(0,1fr) 440px;align-items:center}\n#ccTarifeAtlas .ca-actions{\n display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.22fr);\n gap:8px;width:100%;min-width:0;align-items:stretch;justify-items:stretch;justify-self:end\n}\n#ccTarifeAtlas .ca-actions button{\n box-sizing:border-box;min-width:0;width:100%;min-height:44px;padding:9px 7px;\n display:flex;align-items:center;justify-content:center;text-align:center;\n font-size:12px;font-weight:750;line-height:1.2;white-space:nowrap\n}\n@media(max-width:1140px){\n #ccTarifeAtlas .ca-row{grid-template-columns:46px minmax(0,1fr)}\n #ccTarifeAtlas .ca-actions{grid-column:2;width:min(100%,440px);justify-self:end}\n}\n@media(max-width:620px){\n #ccTarifeAtlas .ca-row{grid-template-columns:41px minmax(0,1fr);gap:8px}\n #ccTarifeAtlas .ca-actions{grid-column:1/-1;justify-self:stretch;width:100%;gap:6px}\n #ccTarifeAtlas .ca-actions button{font-size:clamp(10px,2.7vw,12px);padding:10px 3px;min-height:42px;white-space:normal;overflow-wrap:anywhere}\n}\n\n\n/* Tarife Atlası · bölüm başlıklarını aynı eksende hizala */\n#ccTarifeAtlas .ca-section-head{\n  display:grid;grid-template-columns:150px minmax(0,1fr) auto;\n  align-items:center;gap:16px;width:100%;\n}\n#ccTarifeAtlas .ca-section-head .ca-num{\n  display:flex;align-items:center;justify-content:center;box-sizing:border-box;\n  width:144px;min-width:0;max-width:100%;white-space:nowrap;\n}\n#ccTarifeAtlas .ca-section-head .ca-title{\n  display:block;min-width:0;width:100%;margin:0;\n  text-align:left;overflow-wrap:break-word;line-height:1.55;\n}\n#ccTarifeAtlas .ca-section-head .ca-count{justify-self:end;white-space:nowrap;}\n@media(max-width:760px){\n  #ccTarifeAtlas .ca-section-head{grid-template-columns:114px minmax(0,1fr);gap:10px;}\n  #ccTarifeAtlas .ca-section-head .ca-num{width:108px;max-width:108px;font-size:10px;padding:9px 4px;}\n  #ccTarifeAtlas .ca-section-head .ca-count{display:none;}\n}\n@media(max-width:400px){\n  #ccTarifeAtlas .ca-section-head{grid-template-columns:101px minmax(0,1fr);gap:8px;}\n  #ccTarifeAtlas .ca-section-head .ca-num{width:98px;max-width:98px;font-size:9.5px;}\n}\n\n#ccTarifeAtlas .ca-section.ca-locked .ca-section-head{cursor:not-allowed;opacity:.72;grid-template-columns:150px minmax(0,1fr) auto}\n#ccTarifeAtlas .ca-section.ca-locked .ca-title{filter:blur(2.4px);user-select:none}\n#ccTarifeAtlas .ca-lock-label{font-size:11px;font-weight:800;white-space:nowrap;color:#35758c}\n#ccTarifeAtlas .ca-locked-game{padding:35px 20px;text-align:center;background:#f6fafc;border-radius:12px}\n#ccTarifeAtlas .ca-locked-game h3{font-size:20px;color:#245168}\n#ccTarifeAtlas .ca-locked-game p{font-size:13px;color:#708799;max-width:550px;margin:0 auto 17px;line-height:1.6}\n@media(max-width:760px){#ccTarifeAtlas .ca-section.ca-locked .ca-section-head{grid-template-columns:114px minmax(0,1fr)}#ccTarifeAtlas .ca-lock-label{grid-column:2;justify-self:start}}\n";
const PRACTICE=SOURCE_CHAPTERS.filter(c=>c.no!=='77'&&c.no!=='99');
const allowed=no=>window.CC_ACCESS?.chapterAllowed?.(no)??(Number(no)<=5);
const premium=()=>window.CC_ACCESS?.hasTariff?.()??false;
const eligibleChapters=()=>PRACTICE.filter(c=>allowed(c.no));
const CHAPTER_MAP=new Map(SOURCE_CHAPTERS.map(c=>[c.no,c]));
const SECTIONS=new Map(SOURCE_SECTIONS.map(s=>[s.roman,s]));
const $=id=>document.getElementById(id);
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').trim();
const mix=a=>{let x=a.slice();for(let i=x.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const unique=a=>[...new Set(a)];
let progress={status:{},misses:{}},account='',mode='guide',openSection='I',search='',statusFilter='all',quiz=null,match=null,dragNo='';
function key(){
 let uid='guest';try{uid=window.CC_AUTH?.getSession?.()?.user?.id||'guest'}catch(_){}
 return 'cc_tarife_atlasi_v1_'+uid;
}
function load(){
 let k=key();if(k===account)return;account=k;try{const x=JSON.parse(localStorage.getItem(account)||'{}');progress={status:x.status&&typeof x.status==='object'?x.status:{},misses:x.misses&&typeof x.misses==='object'?x.misses:{}}}catch(_){progress={status:{},misses:{}}}
}
function store(){try{localStorage.setItem(account,JSON.stringify(progress))}catch(_){}}
function listCards(no){
 try{return typeof CARDS!=='undefined'&&Array.isArray(CARDS)?CARDS.filter(c=>Number(c.chapter)===Number(no)):[]}catch(_){return []}
}
function statusLabel(no){
 return progress.status[no]==='done'?'✓ Öğrendim':progress.status[no]==='learn'?'◉ Öğreniyorum':'○ Henüz işaretlenmedi';
}
function metricHTML(){
 const done=PRACTICE.filter(c=>progress.status[c.no]==='done').length;
 const learning=PRACTICE.filter(c=>progress.status[c.no]==='learn').length;
 return [['21','Bölüm'],['98','İndeksteki fasıl'],[done+' / '+PRACTICE.length,'Öğrenilen fasıl'],[learning,'Öğreniyorum']].map(x=>'<div class="ca-metric"><strong>'+x[0]+'</strong><small>'+x[1]+'</small></div>').join('');
}
function mount(){
 if($('ccTarifeAtlas'))return;
 const host=$('view-edu'),panel=host?.querySelector('.edu-panel');
 if(!host||!panel)return;
 let style=document.createElement('style');style.id='ccTarifeAtlasStyle';style.textContent=STYLE;document.head.appendChild(style);
 const root=document.createElement('div');root.id='ccTarifeAtlas';root.hidden=true;
 root.innerHTML='<header class="ca-hero"><div><span class="ca-kicker">EĞİTİM ALANI · 2026 GÜMRÜK TARİFE CETVELİ</span><h2>Tarife Atlası</h2><p>21 bölümü, fasılları ve bunların birbiriyle ilişkisini keşfet. Sonra öğrendiklerini kartlarla ve oyunlarla pekiştir.</p></div><button type="button" data-ca="close">← Kartlara Dön</button></header><div id="caMetrics" class="ca-metrics"></div><div class="ca-layout"><div class="ca-tabs"><button type="button" data-ca="mode" data-mode="guide">▤ Bölüm & Fasıl Rehberi</button><button type="button" data-ca="mode" data-mode="quiz">✓ Ezber Testi</button><button type="button" data-ca="mode" data-mode="match">▦ Eşleştirme Oyunu</button></div><div id="caBody" class="ca-inner"></div></div>';
 host.insertBefore(root,panel);
 const eduTools=host.querySelector('.edu-order-actions');
 if(eduTools&&!$('caEduLaunch')){
   let btn=document.createElement('button');btn.type='button';btn.id='caEduLaunch';btn.textContent='🧭 Tarife Atlası';btn.addEventListener('click',open);eduTools.prepend(btn);
 }
 const homeAtlasSlot=$('homeChapterAtlasSlot')||document.querySelector('#view-home .home-center .panelhead');
 if(homeAtlasSlot&&!$('caHomeLaunch')){
   const btn=document.createElement('button');
   btn.type='button';btn.id='caHomeLaunch';btn.className='cc-fcm-atlas';
   btn.setAttribute('aria-label','Tarife Atlası: 21 bölüm ve fasıl rehberini aç');
   btn.innerHTML='<span class="cc-fcm-atlas-icon" aria-hidden="true">🧭</span><span class="cc-fcm-atlas-copy"><strong>Tarife Atlası</strong><small>21 bölüm · Fasıl rehberi</small></span><span class="cc-fcm-atlas-arrow" aria-hidden="true">↗</span>';
   btn.addEventListener('click',open);
   homeAtlasSlot.appendChild(btn);
 }
 root.addEventListener('click',click);
 root.addEventListener('input',ev=>{if(ev.target.id==='caSearch'){search=ev.target.value;renderSections()}});
 root.addEventListener('change',ev=>{
  if(ev.target.id==='caStatusFilter'){statusFilter=ev.target.value;renderSections()}
  if(ev.target.id==='caQuizScope')startQuiz(ev.target.value);
 });
 root.addEventListener('dragstart',ev=>{const e=ev.target.closest('[data-ca="pick"]');if(e&&!e.disabled){dragNo=e.dataset.no;ev.dataTransfer?.setData('text/plain',dragNo)}});
 root.addEventListener('dragover',ev=>{if(ev.target.closest('[data-ca="drop"]'))ev.preventDefault()});
 root.addEventListener('drop',ev=>{let el=ev.target.closest('[data-ca="drop"]');if(!el)return;ev.preventDefault();const n=ev.dataTransfer?.getData('text/plain')||dragNo;matchPair(n,el.dataset.section)});
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&isOpen())close()});
}
function isOpen(){return !!$('ccTarifeAtlas')&&!$('ccTarifeAtlas').hidden}
function open(){
 mount();load();if(typeof nav==='function')nav('edu');
 const root=$('ccTarifeAtlas'),panel=$('view-edu')?.querySelector('.edu-panel');
 if(!root||!panel)return;panel.style.display='none';root.hidden=false;
 mode='guide';render();root.scrollIntoView({block:'start',behavior:'instant'});
}
function close(){
 const root=$('ccTarifeAtlas'),panel=$('view-edu')?.querySelector('.edu-panel');
 if(root)root.hidden=true;if(panel)panel.style.removeProperty('display');
}
function render(){
 load();const root=$('ccTarifeAtlas');if(!root)return;
 $('caMetrics').innerHTML=metricHTML();
 root.querySelectorAll('.ca-tabs button[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
 if(mode==='guide')renderGuide();
 if(mode==='quiz')renderQuiz();
 if(mode==='match')renderMatch();
}
function renderGuide(){
 const b=$('caBody');if(!b)return;
 b.innerHTML='<div class="ca-tools"><input aria-label="Bölüm veya fasıl ara" id="caSearch" type="search" placeholder="Bölüm, fasıl, numara veya kelime ara…" value="'+escapeHTML(search)+'"><select id="caStatusFilter" aria-label="Öğrenme durumuna göre filtre"><option value="all">Tüm fasıllar</option><option value="learn">Öğreniyorum</option><option value="done">Öğrendim</option><option value="new">Henüz çalışmadıklarım</option></select></div><p class="ca-note">Bir bölümü açarak içindeki fasılları incele. Durumunu işaretle veya doğrudan mevcut Eğitim Alanı kartlarına geç. 77 saklıdır; 99 özel amaçlıdır; 98 bu indekste yoktur. Öğrenme durumun bu cihazda hesabına özel kaydedilir.</p><div id="caSections"></div>';
 $('caStatusFilter').value=statusFilter;renderSections();
}
function renderSections(){
 const box=$('caSections');if(!box)return;
 const q=normalize(search);
 let html='';
 for(const s of SOURCE_SECTIONS){
  if(!premium()&&s.roman!=='I'){
   if(statusFilter==='all'&&(!q||normalize(s.title+' '+s.roman).includes(q))){html+='<section class="ca-section ca-locked"><div class="ca-section-head"><span class="ca-num">BÖLÜM '+s.roman+'</span><span class="ca-title">'+escapeHTML(s.title)+'</span><span class="ca-lock-label">🔒 Tarife Modülü</span></div></section>'}
   continue;
  }
  const children=SOURCE_CHAPTERS.filter(c=>c.section===s.roman);
  const matchSection=q&&normalize(s.title+' '+s.roman+' bölüm '+s.roman).includes(q);
  const visible=children.filter(c=>{
   const st=progress.status[c.no]||'new';
   const statusOK=statusFilter==='all'||(statusFilter==='new'?st==='new':st===statusFilter);
   return statusOK&&(!q||matchSection||normalize(c.no+' '+c.title).includes(q));
  });
  if(!visible.length)continue;
  const expanded=!!q||openSection===s.roman;
  html+='<section class="ca-section '+(expanded?'ca-section-open':'')+'"><button type="button" class="ca-section-head" data-ca="section" data-section="'+s.roman+'" aria-expanded="'+expanded+'"><span class="ca-num">BÖLÜM '+s.roman+'</span><span class="ca-title">'+escapeHTML(s.title)+'</span><span class="ca-count">'+visible.length+' fasıl '+(expanded?'▴':'▾')+'</span></button>';
  if(expanded){
   html+='<div class="ca-rows">';
   for(const c of visible){
    const special=c.no==='77'||c.no==='99',cardN=listCards(c.no).length,st=progress.status[c.no]||'new';
    html+='<div class="ca-row"><span class="ca-code">'+c.no+'</span><div><div class="ca-chapter-title">'+escapeHTML(c.title)+'</div><span class="ca-status '+(st==='done'?'is-done':st==='learn'?'is-learn':'')+'">'+statusLabel(c.no)+'</span>'+(special?'<div class="ca-special">'+(c.no==='77'?'Armonize Sistem Nomanklatürü’nde saklı tutulmuştur.':'Özel amaçlı tarife istatistik pozisyonları; ezber testlerine dahil edilmez.')+'</div>':'')+'</div><div class="ca-actions">';
    if(!special){
     html+='<button type="button" data-ca="mark" data-no="'+c.no+'" data-value="learn" class="'+(st==='learn'?'ca-selected':'')+'">Öğreniyorum</button><button type="button" data-ca="mark" data-no="'+c.no+'" data-value="done" class="'+(st==='done'?'ca-selected':'')+'">✓ Öğrendim</button><button type="button" data-ca="cards" data-no="'+c.no+'" class="ca-card" '+(!cardN?'disabled title="Bu fasıl için henüz kart bulunmuyor"':'')+'>Kartlara Git'+(cardN?' ('+cardN+')':'')+'</button>';
    }
    html+='</div></div>';
   }
   html+='</div>';
  }
  html+='</section>';
 }
 box.innerHTML=html||'<div class="ca-empty">Aramana uygun fasıl bulunamadı.</div>';
}
function setMode(next){mode=next;if(next==='quiz'&&!quiz)startQuiz('all');else if(next==='match'&&!match&&premium())startMatch();else render()}
function mark(no,value){if(!allowed(no)||!CHAPTER_MAP.has(no)||no==='77'||no==='99')return;progress.status[no]=progress.status[no]===value?'new':value;store();render()}
function cards(no){
 if(!allowed(no)||!listCards(no).length)return;
 close();
 if(typeof goChapter==='function')goChapter(String(Number(no)));
 else if(typeof nav==='function')nav('edu');
}
function weightedPool(pool,count){
 let chosen=[],rem=pool.slice();
 while(chosen.length<count&&rem.length){
  const weights=rem.map(c=>1+Math.min(9,Number(progress.misses[c.no]||0)*3)+(progress.status[c.no]==='done'?0:1));
  let total=weights.reduce((a,b)=>a+b,0),r=Math.random()*total,idx=0;
  for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0){idx=i;break}}
  chosen.push(rem.splice(idx,1)[0]);
 }
 return chosen;
}
function pickOther(pool,answer,transform){
 let choices=unique(mix(pool.filter(c=>c.no!==answer.no)).map(transform)).filter(x=>x!==transform(answer));
 return mix([transform(answer),...choices.slice(0,3)]);
}
function buildQuestion(c,i){
 const s=SECTIONS.get(c.section);
 if(i%3===0){
  const candidates=SOURCE_CHAPTERS.filter(x=>x.section===c.section&&allowed(x.no)&&x.no!=='77'&&x.no!=='99');
  const opts=pickOther(candidates.length>=4?candidates:eligibleChapters(),c,x=>x.no);
  return {no:c.no,prompt:c.no+'. Fasıl hangi eşya grubunu kapsar?',options:mix([c.title,...mix(eligibleChapters().filter(x=>x.no!==c.no)).slice(0,3).map(x=>x.title)]),answer:c.title,detail:c.no+'. Fasıl: '+c.title+' · Bölüm '+s.roman};
 }
 if(i%3===1){
  const candidates=SOURCE_CHAPTERS.filter(x=>x.section===c.section&&allowed(x.no)&&x.no!=='77'&&x.no!=='99');
  return {no:c.no,prompt:'“'+c.title+'” hangi fasıldadır?',options:pickOther(candidates.length>=4?candidates:eligibleChapters(),c,x=>x.no),answer:c.no,detail:c.no+'. Fasıl · Bölüm '+s.roman};
 }
 const others=mix(SOURCE_SECTIONS.filter(x=>x.roman!==c.section)).slice(0,3);
 return {no:c.no,prompt:c.no+'. Fasıl hangi bölümde yer alır?',options:mix([c.section,...others.map(x=>x.roman)]).map(x=>'Bölüm '+x),answer:'Bölüm '+c.section,detail:'Bölüm '+s.roman+': '+s.title};
}
function startQuiz(scope='all'){
 load();const pool=scope==='all'?eligibleChapters():eligibleChapters().filter(c=>c.section===scope);
 if(!pool.length)return;
 const picks=weightedPool(pool,Math.min(10,pool.length));
 quiz={scope,questions:picks.map((c,i)=>buildQuestion(c,i)),pos:0,picks:{},correct:0};
 mode='quiz';render();
}
function answerQuiz(i){
 if(!quiz)return;const q=quiz.questions[quiz.pos];
 if(Object.prototype.hasOwnProperty.call(quiz.picks,quiz.pos))return;
 quiz.picks[quiz.pos]=i;if(q.options[i]===q.answer){quiz.correct++}else{progress.misses[q.no]=Math.min(100,(progress.misses[q.no]||0)+1);store()}
 render();
}
function nextQuiz(){
 if(!quiz)return;
 if(quiz.pos<quiz.questions.length-1){quiz.pos++;render()}else{quiz.finished=true;render()}
}
function renderQuiz(){
 const b=$('caBody');if(!b||!quiz)return;
 const scope='<select id="caQuizScope" aria-label="Test için bölüm seç"><option value="all">Tüm Bölümler</option>'+SOURCE_SECTIONS.map(s=>'<option value="'+s.roman+'">Bölüm '+s.roman+' · '+escapeHTML(s.title.length>50?s.title.slice(0,50)+'…':s.title)+'</option>').join('')+'</select>';
 const header='<div class="ca-practice-head"><h3>Çift Yönlü Ezber Testi</h3>'+scope+'</div><p class="ca-note">Numaradan açıklamaya, açıklamadan numaraya ve fasıldan bölüme sorular. Yanlış cevapladığın fasıllar yeni testlerde daha sık sorulur.</p>';
 if(quiz.finished){
  b.innerHTML='<div class="ca-practice">'+header+'<div class="ca-question"><h3>Test tamamlandı!</h3><p>Doğru sayısı: <b>'+quiz.correct+' / '+quiz.questions.length+'</b></p><p>Tekrar etmek için yeni test başlatabilirsin.</p><button type="button" class="ca-primary" data-ca="newquiz">↻ Yeni Test</button></div></div>';
  $('caQuizScope').value=quiz.scope;return;
 }
 const q=quiz.questions[quiz.pos],answered=Object.prototype.hasOwnProperty.call(quiz.picks,quiz.pos),choice=quiz.picks[quiz.pos];
 const options=q.options.map((o,i)=>{
  const cls=answered?(o===q.answer?'correct':choice===i?'wrong':''):'';
  return '<button type="button" data-ca="answer" data-i="'+i+'" class="'+cls+'" '+(answered?'disabled':'')+'><b>'+String.fromCharCode(65+i)+'.</b> '+escapeHTML(o)+'</button>';
 }).join('');
 const feedback=answered?'<div class="ca-feedback"><b>'+(q.options[choice]===q.answer?'✓ Doğru cevap!':'Yanlış cevap')+'</b><div>'+escapeHTML(q.detail)+'</div></div>':'';
 b.innerHTML='<div class="ca-practice">'+header+'<div class="ca-question"><p class="ca-note">Soru '+(quiz.pos+1)+' / '+quiz.questions.length+' · '+quiz.correct+' doğru</p><h3>'+escapeHTML(q.prompt)+'</h3><div class="ca-options">'+options+'</div>'+feedback+'</div><div class="ca-footer"><button class="ca-btn" type="button" data-ca="newquiz">Yeni Test</button><button class="ca-primary" type="button" data-ca="nextquiz" '+(!answered?'disabled':'')+'>'+(quiz.pos===quiz.questions.length-1?'Sonucu Gör':'Sonraki Soru →')+'</button></div></div>';
 $('caQuizScope').value=quiz.scope;
}
function startMatch(){
 if(!premium()){match=null;mode='match';render();return}
 const possible=SOURCE_SECTIONS.filter(s=>PRACTICE.some(c=>c.section===s.roman));
 const picked=mix(possible).slice(0,6);
 const items=picked.map(s=>{let p=PRACTICE.filter(c=>c.section===s.roman);return mix(p)[0]});
 match={items:mix(items),sections:mix(picked),selected:'',solved:[],wrong:'',complete:false};
 mode='match';render();
}
function matchPair(no,section){
 if(!match||!no||match.solved.includes(no))return;
 const actual=CHAPTER_MAP.get(no)?.section;
 if(actual===section){
  match.solved.push(no);match.selected='';match.wrong='';
  if(match.solved.length===match.items.length)match.complete=true;
 }else{match.selected=no;match.wrong=section}
 render();
}
function renderMatch(){
 const b=$('caBody');if(!b)return;
 if(!premium()){b.innerHTML='<div class="ca-practice ca-locked-game"><h3>🔒 Bölüm–Fasıl Eşleştirme</h3><p>Ücretsiz üyeler Bölüm I ve 01–05 fasıllarıyla çalışabilir. Diğer bölümlerin oyunları Tarife Modülü (200 TL/ay) ile açılır.</p><button type="button" class="ca-primary" data-ca="membership">Paketleri Gör</button></div>';return}
 if(!match)return;
 const l=match.items.map(c=>{
  const done=match.solved.includes(c.no),selected=match.selected===c.no;
  return '<button type="button" draggable="'+(!done)+'" data-ca="pick" data-no="'+c.no+'" class="ca-match-item '+(done?'matched':selected?'selected':'')+'" '+(done?'disabled':'')+'><strong>'+c.no+'</strong><span>'+escapeHTML(c.title)+'</span></button>';
 }).join('');
 const r=match.sections.map(s=>{
  const done=match.solved.some(n=>CHAPTER_MAP.get(n)?.section===s.roman);
  return '<button type="button" data-ca="drop" data-section="'+s.roman+'" class="ca-match-item '+(done?'matched':'')+'" '+(done?'disabled':'')+'><strong>'+s.roman+'</strong><span>'+escapeHTML(s.title)+'</span></button>';
 }).join('');
 b.innerHTML='<div class="ca-practice"><div class="ca-practice-head"><h3>Bölüm–Fasıl Eşleştirme</h3><button type="button" class="ca-btn" data-ca="newmatch">↻ Yeni Tur</button></div><p class="ca-note">Soldaki faslı seçip sağdaki doğru bölüme dokun. Bilgisayarda sürükle-bırak da kullanabilirsin.</p><p class="ca-help">'+match.solved.length+' / '+match.items.length+' eşleştirme tamamlandı'+(match.wrong?' · Eşleşme yanlış, tekrar dene.':'')+(match.complete?' · Tebrikler, bütün eşleştirmeler doğru!':'')+'</p><div class="ca-match-grid"><div class="ca-match-col"><h4>Fasıllar</h4>'+l+'</div><div class="ca-match-col"><h4>Bölümler</h4>'+r+'</div></div></div>';
}
function click(ev){
 const b=ev.target.closest('button[data-ca]');if(!b)return;
 const a=b.dataset.ca;
 if(a==='close'){close();return}
 if(a==='membership'){window.CC_ACCESS?.upgrade?.('tariff');return}
 if(a==='mode'){setMode(b.dataset.mode);return}
 if(a==='section'){openSection=openSection===b.dataset.section?'':b.dataset.section;renderSections();return}
 if(a==='mark'){mark(b.dataset.no,b.dataset.value);return}
 if(a==='cards'){cards(b.dataset.no);return}
 if(a==='answer'){answerQuiz(Number(b.dataset.i));return}
 if(a==='nextquiz'){nextQuiz();return}
 if(a==='newquiz'){startQuiz(quiz?.scope||'all');return}
 if(a==='newmatch'){startMatch();return}
 if(a==='pick'){if(match&&!match.solved.includes(b.dataset.no)){match.selected=b.dataset.no;renderMatch()}return}
 if(a==='drop'){if(match&&match.selected)matchPair(match.selected,b.dataset.section);return}
}
function studyChapter(no){open();const c=CHAPTER_MAP.get(String(no).padStart(2,'0'));if(c){openSection=c.section;search=c.no;render()}}
function studySection(roman){open();openSection=roman;render()}
window.GTA_ATLAS={open,close,isOpen,render,studyChapter,studySection};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.addEventListener('cc-content-ready',()=>{if(isOpen())render()});
})();
