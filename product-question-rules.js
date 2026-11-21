/* Customs Community · Ürün bazlı soru ayrımları
   Kullanıcının verdiği kesin soru adları. Yeni ayrımlar bu dosyaya eklenir.
   Yalnızca soru oluşturma katmanında kullanılır; tarife kartlarını değiştirmez. */
window.CC_PRODUCT_QUESTION_RULES={
  version:1,
  ambiguousNames:["Böcekler","Böcek"],
  byCode:{
    "0106":{replace:["Böcekler","Böcek"],add:["Canlı böcekler"]},
    "0410":{replace:["Böcekler","Böcek","İnsan tüketimine uygun böcekler"],add:["Yenilebilen böcekler"]},
    "0511":{replace:["Böcekler","Böcek","Yenilemeyen diğer yumurtalar ve böcekler"],add:["Yenilemeyen böcekler"]}
  },
  editorialNotes:[
    {topic:"Böceklerin tarife pozisyonu",distinctions:[
      {code:"0106",questionName:"Canlı böcekler"},
      {code:"0410",questionName:"Yenilebilen böcekler"},
      {code:"0511",questionName:"Yenilemeyen böcekler"}
    ],reason:"Tek başına Böcekler denirse eşyanın niteliği belirsiz kalır."}
  ]
};
