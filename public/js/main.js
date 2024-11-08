let lawInfo = {};
let contentText = '';

let unitPublish = [];
let lawDaySign ='';
let nameSign = [];
let roleSign = []
let lawDayActive = '';
let lawDescription = ''
let lawNumber = ''
let lawRelated = []
let lawKind = ''
let lawNameDisplay = ''


function getLawDayActive(text,daySign,lawKind) {
 let lawDayActive
  if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*(Hiệu lực|thi hành|thực hiện).*\n).*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực).* từ ngày k/im
      new RegExp(`${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)\.* từ ngày k`,'im')
    )
  ) {
    lawDayActive = daySign;
  } else if (
    text.match(new RegExp(`(?<=${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\\d]+)(ngày|ngày)\\s*\\d*\\s*(tháng|tháng)\\s*\\d*\\s*năm\\s*\\d*`,'im')
      // /(?<=^(Điều|Ðiều|Điều) \d.{0,15}(Hiệu lực|thi hành|thực hiện).*(\n.*)*.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]+)(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/im
    )
  ) {
    let lawDayActiveDemo = text.match(
      new RegExp(`(?<=${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\\d]+)(ngày|ngày)\\s*\\d*\\s*(tháng|tháng)\\s*\\d*\\s*năm\\s*\\d*`,'im')    
    )[0];
    let RemoveDay = lawDayActiveDemo.replace(/(ngày|ngày) */im, "");
    let RemoveMonth = RemoveDay.replace(/ *(tháng|tháng) */im, "/");
    lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
  } else if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*(Hiệu lực|thi hành|thực hiện).*(\n.*)*.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]+)\d+\/\d+\/\d+/im
      new RegExp(`(?<=${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\\d]+)\\d+\\/\\d+\\/\\d+`,'im')
    )
  ) {
    lawDayActive = text.match(
      new RegExp(`(?<=${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\\d]+)\\d+\\/\\d+\\/\\d+`,'im')
    )[0];
  } else if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*\n.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
      new RegExp(`(?<=${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \\d* ngày`,'im')
    )
  ) {
    lawDayActive = text.match(
      new RegExp(`(?<=${lawKind} này\.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \\d* ngày`,'im')
    )[0];
  } else {
    lawDayActive = null;
  }

  return lawDayActive
}

function getLawRelated(text) {
  function uniqueArray(orinalArray) {
    let noDuplicate = orinalArray.filter((elem, position, arr) => {
      return arr.indexOf(elem) == position && elem != lawNumber;
    });
  
    let removeDayMonth = noDuplicate.map((value, index) => {
      return value.replace(/ngày.*tháng.*(?=năm)/gim, "");
    });
  
    return removeDayMonth;
  }
  

  let lawRelatedDemo = text.match(
    /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\}|”)]+/gi
  );
  let lawRelatedDemo2 = lawRelatedDemo
    ? lawRelatedDemo.map(function (item) {
        return item.replace(/ */g, "");
      })
    : [];
  // if (b13.match(/(?<=(căn cứ |; |và ))(luật|bộ luật)[^ số][^;]+năm \d+ (?=((và luật sửa đổi)|;))/gi)) {
  if (text.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)) {
    for (
      let y = 0;
      y <
      text.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi).length;
      y++
    ) {
      if (
        !text
          .match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)
          [y].match(/(?<=năm \d+) và (?=luật sửa)/gi)
      ) {
        let lawRelatedString = text
          .match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)
          [y].replace(/ số \d+[^( |,)]+/gim, "");
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+\/\d+\/\d+/gim,
          ""
        );
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+ *\d+ *\d+/gim,
          ""
        );
        lawRelatedString = lawRelatedString.replace(
          / (ngày|ngày) *\d+ *(tháng|tháng) *\d+/gim,
          ""
        );

        lawRelatedDemo2 = [...lawRelatedDemo2, lawRelatedString];
      } else {
        let lawRelatedString = text
          .match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)
          [y].replace(/ số \d+[^( |,)]+/gim, "");
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+\/\d+\/\d+/gim,
          ""
        );
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+ *\d+ *\d+/gim,
          ""
        );
        lawRelatedString = lawRelatedString.replace(
          / (ngày|ngày) *\d+ *(tháng|tháng) *\d+/gim,
          ""
        );
        lawRelatedDemo2 = [
          ...lawRelatedDemo2,
          ...lawRelatedString.split(/(?<=năm \d+) và (?=luật sửa)/gi),
        ];
      }
    }
  }
  if (text.match(/(?<=(căn cứ |; |vào ))(hiến pháp)[^(;|\n)]+/gi)) {
    // let lawRelatedString = lawRelatedString.match(/(?<=(căn cứ |; |vào ))(hiến pháp)[^;]+/gi).replace(/ số \d+[^( |,)]+/igm,'')
    // lawRelatedString = lawRelatedString.replace(/ ngày \d+\/\d+\/\d+/igm,'')

    lawRelatedDemo2 = [
      ...lawRelatedDemo2,
      ...text.match(/(?<=(căn cứ |; |vào ))(hiến pháp)[^(;|\n)]+/gi),
    ];
  }
  lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
    return item.replace(/ ngày ?\d+ ?tháng ?\d+/gim, "");
  });

 let lawRelated = uniqueArray(lawRelatedDemo2);

return lawRelated
}

function getInfo(){
  if(document.querySelector("#roleSign").value){
    getNormalTextInfo()
  }else{
    convertBareTextInfo('plain')
  }
}

async function convertBareTextInfo(kind) {
  // có thể bị lỗi:
  // nếu Lawname nhiều hơn 2 dòng
  // nếu dòng signRole có 2 dòng thì gộp 1 thôi
  // bỏ hàng cuối cùng nếu có sau tên
  // trong unitPublish chỉ cho phép cơ quan chứ không cho phép cá nhân
  // phải có chữ "ban hành"
  // đối với liên tịch phải có ./. ở cuối

  // văn bản hợp nhất thì ghi VBHN chứ không phải NĐ hay Thông tư
  // đôi khi không nhận diện được lawKind thì cần tách Thông tư với nội dung miêu tả ra 1 dòng tách biệt

  let b = document.querySelector("#content_input").value;
  addendum = undefined;

  let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  let b2 = b1.replace(/\(đã ký\)/gim, "");

  let b3 = b2.replace(/\n+\s+$/gim, "");
  let b4 = b3.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
  let b5 = b4.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
  let b6 = b5.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
  // let b7 = b6.replace(/^(nơi nhận|Nơi nhận).*/gim, "");
  let b7 = b6
  let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
  let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
  let b10
  if(b9.match(/^Nơi nhận/mi)){    // bỏ phụ lục, danh mục các thư
    b10 = b9.replace(
      /(?<=^(Nơi nhận|Nơi Nhận).*(\n.*)*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|MỤC LỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ|Mẫu|MẪU|BIỂU KHUNG|QCVN|QCVN|ĐỊNH MỨC|HỆ THỐNG|QUY ĐỊNH|CHƯƠNG TRÌNH).*(\n.*)*/gm,
      ""
    ); // bỏ Phụ lục,danh mục

  }else{
    b10 = b9.replace(
      /(?<!^(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Điều|Ðiều|Điều|Chương|CHƯƠNG|Phần thứ|PHẦN THỨ|MỤC|Mục|Mục|Mẫu số).*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ|Mẫu|MẪU|BIỂU KHUNG|QCVN|QCVN|ĐỊNH MỨC|HỆ THỐNG|QUY ĐỊNH|CHƯƠNG TRÌNH).*(\n.*)*/gm,
      ""
    ); // bỏ Phụ lục,danh mục
    }


  // b10 = b10.replace(/^(nơi nhận|Nơi nhận).*(\n.*)*/gim, "");

  // b10 = b10.replace(
  //   /(?<!(Điều|Ðiều|Điều|chương|Phần thứ|Mục|Mục) (\d|II|V|X)+\:*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ).*(\n.*)*/gim,
  //   ""
  // ); // bỏ Phụ lục,danh mục
  let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
  // let b12 = b11.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN
  let b12 = b11.replace(/(?<=^Chương.*)l(?=.*)/gim, "I"); // đôi khi số la mã 'I' bị chuyển thành 'l' nên đổi lại
  let b13 = b12.replace(/  +/gim, " "); // bỏ khoảng cách 2 space




  
  let unitPublishString = document.querySelector("#unitPublish").value;
  unitPublish = unitPublishString.split("; ");

  lawKind = document.querySelector("#lawKind").value;

  lawDaySign = document.querySelector("#lawDaySign").value;


  lawNumber = document.querySelector("#lawNumber").value;

  let nameSignString = document.querySelector("#nameSign").value;
  let nameSignArrayDemo = nameSignString.split("; ");


  lawDescription = document.querySelector("#lawDescription").value;

  lawNameDisplay = lawDescription
  if(lawKind.match(/^(luật|bộ luật)/i)){
    lawNameDisplay = lawDescription.replace(/ của Quốc hội.*số.*/i,'')
    lawNameDisplay = lawNameDisplay.replace(/ số.*của Quốc hội.*/i,'')
    lawNameDisplay = lawNameDisplay+' năm '+lawDaySign.match(/\d+$/i)[0]
  }else{
    lawNameDisplay = lawKind+' số '+lawNumber
  }





  let roleSign = "";
  let nameSign = [];

  if (kind == "TTLT") {


    

    let a0 = b13.match(/(?<=.*\.\/\.)(\n.*)*/gim)[0];
    let ppArray = a0.match(/(?<=KT\. ?)\w+.*/gim); // pp là KT.
    ppArray = ppArray && ppArray.map((pp) => pp.replace(/  /gm, " "));
    let ppString;
    let roleSignDemo = [];
    let orderedUnitPublish = [];

    if (ppArray) {
      //nếu có ký thay (KT)
      ppArray.map((unit) => {
        for (let n = 0; n < unitPublish.length; n++) {
          let y = new RegExp(unitPublish[n], "img");
          let exist = ppArray.some((key) => {
            return key.match(y);
          });
          if (exist) {
            // nếu có chữ ban ngành trong đó

            if (unit.match(new RegExp(`.*${unitPublish[n]} `, "img"))) {
              ppString = unit
                .replace(new RegExp(`.*${unitPublish[n]} `, "img"), "")
                .toLowerCase();

              orderedUnitPublish.push(unitPublish[n]);

              let ppSeparate = ppString.split(" ");
              ppSeparate = ppSeparate.map((key, i) => {
                if (i < ppSeparate.length) {
                  return key.charAt(0).toUpperCase() + key.slice(1);
                } else {
                  return key;
                }
              });
              roleSignDemo.push(ppSeparate.join(" "));

              break;
            }
          } else {
            // nếu k có chữ ban ngành nào trong đó VD:'Chính phủ
            ppString = unit.match(/phó.*/gim)
              ? unit.match(/phó.*/gim)[0].toLowerCase()
              : unit.match(/\S*\s+\S+$/gim)[0].toLowerCase();
            let ppStringSeparate = ppString.split(" ");

            ppStringSeparate = ppStringSeparate.map((key, i) => {
              if (i < ppStringSeparate.length) {
                return key.charAt(0).toUpperCase() + key.slice(1);
              } else {
                return key;
              }
            });
            roleSignDemo = [ppStringSeparate.join(" ")];
          }
        }
      });
    } else {
      //nếu không có KT vd:bộ trưởng
      let noPP = a0.match(/(?<=\n).*(?=\n.*$)/gim)[0];

      noPP = noPP.match(/\S*\s+\S+$/)[0].toLowerCase();
      roleSignDemo = [noPP.charAt(0).toUpperCase() + noPP.slice(1)];
    }

    unitPublish = orderedUnitPublish.length ? orderedUnitPublish : unitPublish;

    let representative = a0.match(/(?<=TM\. ?)\w+.*/gim);
    if (ppArray) {
      for (let g = 0; g < ppArray.length; g++) {
        nameSign.push(
          a0.match(
            new RegExp(`.*(?=(\n.*){${(ppArray.length - 1 - g) * 2}}$)`, "g")
          )[0]
        );
      }
    } else if (representative) {
      for (let g = 0; g < representative.length; g++) {
        nameSign.push(
          a0.match(
            new RegExp(
              `.*(?=(\n.*){${(representative.length - 1 - g) * 2}}$)`,
              "g"
            )
          )[0]
        );
      }
    } else {
      nameSign = a0.match(/.*$/);
    }
  } else {
    // nếu không là TTLT


    let roleSignDemo = b13.match(/.*(?=\n.*$)/)[0].toLowerCase();

    roleSign = roleSignDemo;
    if (roleSign.match(/chính/gim)) {
      roleSign = roleSignDemo.replace(/chính/gim, "Chính");
    } else if (roleSign.match(/quốc/gim)) {
      roleSign = roleSignDemo.replace(/quốc/gim, "Quốc");
    } else if (roleSignDemo.match(/thủ/gim)) {
      roleSign = roleSignDemo.replace(/thủ/gim, "Thủ");
    } else if (roleSignDemo.match(/phó chánh án/gim)) {
      roleSign = "Phó Chánh án Tòa án nhân dân tối cao";
    } else if (roleSignDemo.match(/chánh án/gim)) {
      roleSign = "Chánh án Tòa án nhân dân tối cao";
    } else if (roleSignDemo.match(/Chủ nhiệm/gim)) {
      roleSign = roleSignDemo.match(/(phó )*Chủ nhiệm/gim)[0];
    }
    roleSign = roleSign.charAt(0).toUpperCase() + roleSign.slice(1);




  }

  
  let lawDayActive = getLawDayActive(b13,lawDaySign,lawKind)

  
  let lawRelated =  getLawRelated(b13)

  if (lawKind.match(/nghị quyết/i)) {// bỏ phần đầu
    b14 = b13.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, ""); 
  } else if(b13.match(/^(Phần|PHẦN) (THỨ|I|l|1)/img)){
    
    let firstSection = b13.match(/^(Phần|PHẦN) (THỨ|I|l|1).*/im)[0]

    b14 = b13.replace(new RegExp(`(.*\n)*(?=${firstSection})`,'img'),'')
  }else if(b13.match(/^(Chương|CHƯƠNG) (I|l|1)/img)){
    
    let firstChapter = b13.match(/^(Chương|CHƯƠNG) (I|l|1).*/im)[0]

    b14 = b13.replace(new RegExp(`(.*\n)*(?=${firstChapter})`,'img'),'')
  }else if(b13.match(/^(Điều|Ðiều|Điều) (I|l|1)/img)){
    
    let firstArticle = b13.match(/^(Điều|Ðiều|Điều) (I|l|1).*/im)[0]

    b14 = b13.replace(new RegExp(`(.*\n)*(?=${firstArticle})`,'img'),'')
  }else{
    b14 = b13.replace(
      /^(.*\n)*.+(ban hành|ban hành|quy định|hướng dẫn|công bố)[^\n]+\n(?=(Chương (I|l|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
      ""
    ); 

  }

  let b15 = b14;
    if (b14.match(/(?<=.*\.\/\.)(\n.*)*/gim)) {
      b15 = b14.replace(/(?<=.*\.\/\.)(\n.*)*/gim, ""); //  bỏ tất cả sau ./.
    } else {
      b15 = b14.match(/(.*\n)*(?=.*\n.*$)/gim)[0]; // bỏ 2 hàng cuối
    }
  
  b15 = b15.replace(/\.+\/+\.*/gim, ""); // bỏ ./. ở sau cùng
  b15 = b15.replace(/^(nơi nhận|Nơi nhận).*(\n.*)*/gim, "");
  let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối














  lawInfo["lawDescription"] = lawDescription;
  lawInfo["lawNumber"] = lawNumber;
  lawInfo["unitPublish"] = unitPublish;
  lawInfo["lawKind"] = lawKind;
  lawInfo["lawDaySign"] = lawDaySign;
  lawInfo["lawDayActive"] = lawDayActive;
  lawInfo["lawNameDisplay"] = lawNameDisplay;
  lawInfo["lawRelated"] = lawRelated;
  lawInfo["nameSign"] = nameSignArrayDemo;

    if (roleSign.match(/phó thủ tướng/gim)) {
      lawInfo["roleSign"] = ["Phó Thủ Tướng"];
    } else if (
      roleSign.match(/quyền thủ tướng/gim) ||
      roleSign.match(/q.* thủ tướng/gim)
    ) {
      lawInfo["roleSign"] = ["Quyền Thủ Tướng"];
    } else if (roleSign.match(/thủ tướng|thủ tướng|thủ tướng|thủ tưởng/gim)) {
      lawInfo["roleSign"] = ["Thủ Tướng"];
    } else if (roleSign.match(/Thứ trưởng/gim)) {
      lawInfo["roleSign"] = ["Thứ trưởng"];
    } else {
      lawInfo["roleSign"] = [roleSign];
    }

  console.log("lawDescription", lawInfo["lawDescription"]);
  console.log("lawNumber", lawInfo["lawNumber"]);
  console.log("lawKind", lawInfo["lawKind"]);
  console.log("lawDaySign", lawInfo["lawDaySign"]);
  console.log("lawDayActive", lawInfo["lawDayActive"]);
  console.log("lawNameDisplay", lawInfo["lawNameDisplay"]);
  console.log("lawRelated", lawInfo["lawRelated"]);
  console.log("unitPublish", lawInfo["unitPublish"]);
  console.log("nameSign", lawInfo["nameSign"]);
  console.log("roleSign", lawInfo["roleSign"]);

  document.querySelector(".output").value = b16;
  return { lawInfo, addendum };
}


function getNormalTextInfo() {
  
  let unitPublishString = document.querySelector("#unitPublish").value;
  unitPublish = unitPublishString.split("; ");

  lawKind = document.querySelector("#lawKind").value;

  lawDaySign = document.querySelector("#lawDaySign").value;


  lawNumber = document.querySelector("#lawNumber").value;

  let nameSignString = document.querySelector("#nameSign").value;
  let nameSignArrayDemo = nameSignString.split("; ");


  lawDescription = document.querySelector("#lawDescription").value;

  lawNameDisplay = lawDescription
  if(lawKind.match(/^(luật|bộ luật)/i)){
    lawNameDisplay = lawDescription.replace(/ của Quốc hội.*số.*/i,'')
    lawNameDisplay = lawNameDisplay.replace(/ số.*của Quốc hội.*/i,'')
    lawNameDisplay = lawNameDisplay+' năm '+lawDaySign.match(/\d+$/i)[0]
  }else{
    lawNameDisplay = lawKind+' số '+lawNumber
  }



  let roleSignString = document.querySelector("#roleSign").value;
  let unitPbDemo = unitPublish
  for(let a = 0;a<nameSignArrayDemo.length;a++){

    let nameSignString = roleSignString.match(new RegExp(`.*${nameSignArrayDemo[a]}.*`,'img'))[0]
    nameSign.push(nameSignString)
   let nameSignStringEffectArea = roleSignString.match(new RegExp(`${roleSignString.match(new RegExp(`(\.*\\n){0,3}\.*${nameSignArrayDemo[a]}\.*`,'img'))[0]  }`,'img'))[0]
   
   if(lawKind.match(/liên tịch/i)){
     for(let b = 0;b<unitPublish.length;b++){

       if(nameSignStringEffectArea.match(new RegExp(`${unitPublish[b]}`,'igm'))){
         unitPbDemo[a] = unitPublish[b]         
       }
     }
    }
  }
  unitPublish = unitPbDemo


  let contentRoleSign = document.querySelector("#roleSign").value;
  for (let a = 0; a < nameSign.length; a++) {
    // console.log('nameSign',nameSign);
    // console.log('contentRoleSign',contentRoleSign);
    let roleSignString = contentRoleSign.match(
      new RegExp(`.*(?=\n.*${nameSign[a]})`, "img")
    )[0].toLowerCase();//key.charAt(0).toUpperCase() + key.slice(1);

    roleSignString = roleSignString.charAt(0).toUpperCase() + roleSignString.slice(1);
    if(roleSignString.match(/^phó/i)){
      roleSignString = 'Phó '+roleSignString.charAt(4).toUpperCase() + roleSignString.slice(5);
    }else if(roleSignString.match(/quốc hội/i)){
      roleSignString = roleSignString.replace(/quốc hội/i,'Quốc hội')
    }
    roleSign.push(roleSignString);
  }



  contentText = document.querySelector("#content_input").value;
  let content = contentText

  lawDayActive = getLawDayActive(content,lawDaySign,lawKind)

  let introduceString = document.querySelector("#lawRelated").value;

  lawRelated =  getLawRelated(introduceString)



  document.querySelector(".output").value = document.querySelector("#content_input").value
   

  lawInfo = {unitPublish,lawDaySign,nameSign,roleSign,lawDayActive,lawDescription,lawNumber,lawRelated,lawKind,lawNameDisplay};

  console.log('lawInfo',lawInfo);
  
}


let data = [];
async function convertContent() {
  data = [];


  let input = document.querySelector(".output").value;

  let i0 = input.replace(/^(Điều|Ðiều|Điều) (\d+\w?)\.(.*)/gim, "Điều $2:$3");
  // điều . thành điều:

  let i1 = i0.replace(/^(Điều|Ðiều|Điều) (\d+\w?)\.(.*)/gim, "Điều $2:$3");

  let i2 = i1.replace(/^(Điều|Ðiều|Điều) (.*)\./gim, "Điều $2");
  // Bỏ . ở cuối hàng trong Điều

  // let i2 = i1.replace(/^(\s)*(.*)/gm, "$2");
  // // đề phòng có khoảng trống đầu hàng, cut it

  // let i3 = i2.replace(/^\n+/gm, "");
  // // bỏ khoảng trống giữa các row

  let i3 = i2

  let i4;
  // i6 = i5.replace(/^Chương (.*)\n(.*)/gim, "Chương $1: $2");

  let i4a = [];
  let initial = 4; // số dòng tối đa mặc định có thể bị xuống dòng làm cho phần 'chương' không được gộp
  // thành 1 dòng (có thể thay đổi để phù hợp tình hình)

  for (let b = 0; b < initial; b++) {
    if (!b) {
      i4a[b] = i3.replace(/(?<=^Mục .*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim, ": ");
    } else {
      i4a[b] = i4a[b - 1].replace(
        /(?<=^Mục .*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
        " "
      );

      // kết nối "mục với nội dung "mục", trường hợp bị tách 2 hàng
    }
  }

  i4 = i4a[initial - 1];

  let i5 = i4.replace(/^(Mục|Mục)(.*)\n/gim, ""); // bỏ mục đi

  let i6 = i5.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục

  let i7 =i6.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,': ')

  // let i7a = [];

  // for (let b = 0; b < initial; b++) {
  //   if (!b) {
  //     i7a[b] = i6.replace(
  //       /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
  //       ": "
  //     );
  //   } else {
  //     i7a[b] = i7a[b - 1].replace(
  //       /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
  //       " "
  //     );
  //   }
  // }

  // i7 = i7a[initial - 1];

  let i8 = i7

  let i9;

  let i9a = []; // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

  for (let c = 0; c < initial; c++) {
    if (!c) {
      i9a[c] = i8.replace(
        /(?<=^Phần thứ.*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        ": "
      );
    } else {
      i9a[c] = i9a[c - 1].replace(
        /(?<=^Phần thứ.*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        " "
      );
    }
  }
  // i9= i9a[initial-1]
  i9 = i9a[initial - 1];

  // let i10 = i9.replace(/(?<=\w)\/(?=\w)/gim, "\\"); // loại dấu division spla sh bằng dấu \
  let i10 = i9


  document.querySelector(".output").value = i10;

  if (i10.match(/^CHƯƠNG.*/i)) {
    // nếu có chương ...

    let chapterArray; // lấy riêng lẻ từng chương thành 1 array
    if (i10.match(/^Chương (V|I|X|\d).*$/gim)) {
      chapterArray = i10.match(/^Chương (V|I|X|\d).*$/gim);
    } else {
      chapterArray = null;
    }

    let articleArray; // lấy khoảng giữa các chương
    let allArticle = []; // lấy riêng lẻ các điều
    let point = [];
    let d = -1;

    for (var a = 0; a < chapterArray.length; a++) {
      articleArray = [];

      if (a < chapterArray.length - 1) {
        let chapterArrayA = chapterArray[a].replace(/\\/gim, "\\\\");
        chapterArrayA = chapterArrayA.replace(/\(/gim, "\\(");
        chapterArrayA = chapterArrayA.replace(/\)/gim, "\\)");

        let chapterArrayB = chapterArray[a + 1].replace(/\\/gim, "\\\\");
        chapterArrayB = chapterArrayB.replace(/\(/gim, "\\(");
        chapterArrayB = chapterArrayB.replace(/\)/gim, "\\)");

        let replace = `(?<=${chapterArrayA}\n)(.*\n)*(?=${chapterArrayB})`;
        let re = new RegExp(replace, "gim");
        articleArray = i10.match(re);
      } else {
        let chapterArrayA = chapterArray[a].replace(/\(/gim, "\\(");
        chapterArrayA = chapterArrayA.replace(/\)/gim, "\\)");
        chapterArrayA = chapterArrayA.replace(/\\/gim, "\\\\");

        let replace = `((?<=${chapterArrayA}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        articleArray = i10.match(re);
      }

      if (articleArray[0].match(/^(Điều|Điều) \d+(.*)$/gim)) {
        data[a] = { [chapterArray[a]]: [] };
        allArticle.push(articleArray[0].match(/^(Điều|Điều) \d+(.*)$/gim));
      } else {
      }

      let countArticle = allArticle[a].length;

      for (let b = 0; b < countArticle; b++) {
        let TemRexgexArticleA = allArticle[a][b];

        TemRexgexArticleA = allArticle[a][b].replace(/\\/gm, "\\\\");
        TemRexgexArticleA = TemRexgexArticleA.replace(/\(/, "\\(");
        TemRexgexArticleA = TemRexgexArticleA.replace(/\)/, "\\)");
        TemRexgexArticleA = TemRexgexArticleA.replace(/\./, "\\.");

        if (b < countArticle - 1) {
          let TemRexgexArticleB = allArticle[a][b + 1];

          TemRexgexArticleB = allArticle[a][b + 1].replace(/\\/gm, "\\\\");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");

          let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
          let re = new RegExp(replace, "gim");

          if (articleArray[0].match(re)) {
            let e = articleArray[0].match(re)[0];
            e = articleArray[0].match(re)[0].replace(/\n+$/, "");
            e = e.replace(/^\n+/, "");

            point.push(e);
          } else {
            point.push([""]);
          }
        } else {
          let TemRexgexArticleB = allArticle[a][b];

          TemRexgexArticleB = allArticle[a][b].replace(/\\/gm, "\\\\");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");

          let replace = `(?<=${TemRexgexArticleB}\n)(.*\n)*.*$`;
          let re = new RegExp(replace, "im");

          if (articleArray[0].match(re)) {
            let e = articleArray[0].match(re)[0];
            e = articleArray[0].match(re)[0].replace(/\n+$/, "");
            e = e.replace(/^\n+/, "");

            point.push(e);
          } else {
            point.push([""]);
          }
        }

        for (let c = 0; c < 1; c++) {
          d++;

          data[a][chapterArray[a]][b] = { [allArticle[a][b]]: point[d] };
        }
      }
    }
  } else if (i10.match(/^phần thứ.*/i)) {
    //////////////////////////////////////////////////////////////////////////////////////////////  // nếu có phần thứ ...

    let sectionArray;

    if (i10.match(/^phần thứ.*$/gim)) {
      sectionArray = i10.match(/^phần thứ.*$/gim);
    } else {
      sectionArray = null;
    }

    let ContentInEachSection; // lấy khoảng giữa các phần
    data = [];
    let point = [];

    for (var a = 0; a < sectionArray.length; a++) {
      ContentInEachSection = [];
      if (a < sectionArray.length - 1) {
        let replace = `(?<=${sectionArray[a]}\n)(.*\n)*(?=${
          sectionArray[a + 1]
        })`;
        let re = new RegExp(replace, "gim");
        ContentInEachSection = i10.match(re);
      } else {
        let replace = `((?<=${sectionArray[a]}))((\n.*)*)$`;
        let re = new RegExp(replace, "gim");
        ContentInEachSection = i10.match(re);
      }

      let chapterArray = []; // mảng có từng chapter riêng lẻ
      let articleArray = []; // mảng có từng Điều riêng lẻ

      if (ContentInEachSection[0].match(/^Chương.*$/gim)) {
        // nếu mà trong 'phần thứ...' có chương

        chapterArray = ContentInEachSection[0].match(/^Chương.*$/gim);
        data[a] = {};
        data[a][sectionArray[a]] = [];

        let ContentInEachChapter = [];
        for (let b = 0; b < chapterArray.length; b++) {
          if (b < chapterArray.length - 1) {
            let chapterArrayA = chapterArray[b].replace(/\(/gim, "\\(");
            chapterArrayA = chapterArrayA.replace(/\)/gim, "\\)");

            let chapterArrayB = chapterArray[b + 1].replace(/\(/gim, "\\(");
            chapterArrayB = chapterArrayB.replace(/\)/gim, "\\)");

            let replace = `(?<=${chapterArrayA}\n)(.*\n)*(?=${chapterArrayB})`;
            let re = new RegExp(replace, "gim");
            ContentInEachChapter = ContentInEachSection[0].match(re);
          } else {
            let chapterArrayA = chapterArray[b].replace(/\(/gim, "\\(");
            chapterArrayA = chapterArrayA.replace(/\)/gim, "\\)");

            let replace = `((?<=${chapterArrayA}))((\n.*)*)$`;
            let re = new RegExp(replace, "gim");
            ContentInEachChapter = ContentInEachSection[0].match(re);
          }
          articleArray = ContentInEachChapter[0].match(
            /^(Điều|Điều) \d+(.*)$/gim
          );
          data[a][sectionArray[a]][b] = {};
          data[a][sectionArray[a]][b][chapterArray[b]] = [];
          for (let c = 0; c < articleArray.length; c++) {
            let TemRexgexArticleA = articleArray[c];

            TemRexgexArticleA = articleArray[c].replace(/\\/gm, "\\\\");
            TemRexgexArticleA = TemRexgexArticleA.replace(/\(/, "\\(");
            TemRexgexArticleA = TemRexgexArticleA.replace(/\)/, "\\)");
            TemRexgexArticleA = TemRexgexArticleA.replace(/\./, "\\.");
            if (c < articleArray.length - 1) {
              let TemRexgexArticleB = articleArray[c + 1];

              TemRexgexArticleB = articleArray[c + 1].replace(/\\/gm, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");
              let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
              let re = new RegExp(replace, "gim");
              point = ContentInEachChapter[0].match(re);
            } else {
              let TemRexgexArticleB = articleArray[c];

              TemRexgexArticleB = articleArray[c].replace(/\\/gm, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");
              let replace = `((?<=${TemRexgexArticleB}))((\n.*)*)$`;
              let re = new RegExp(replace, "gim");
              point = ContentInEachChapter[0].match(re);
            }
            let e;
            if (point) {
              e = point[0].replace(/\n+$/, "");
              e = e.replace(/^\n+/, "");
            } else {
              e = "";
            }

            data[a][sectionArray[a]][b][chapterArray[b]].push({
              [articleArray[c]]: e,
            });
          }
        }
      } else {
        // nếu mà trong 'phần thứ...' không có chương

        articleArray = ContentInEachSection[0].match(
          /^(Điều|Điều) \d+(.*)$/gim
        );

        data[a] = {};
        data[a][sectionArray[a]] = [];
        for (let b = 0; b < articleArray.length; b++) {
          // lỡ mà trong 'Điều ...' có dấu ngoặc ),( thì phải thêm \),\(
          // nếu không vì khi lấy nội dung của khoản sẽ bị lỗi

          let TemRexgexArticleA = articleArray[b];

          TemRexgexArticleA = articleArray[b].replace(/\\/gm, "\\\\");
          TemRexgexArticleA = TemRexgexArticleA.replace(/\(/, "\\(");
          TemRexgexArticleA = TemRexgexArticleA.replace(/\)/, "\\)");
          TemRexgexArticleA = TemRexgexArticleA.replace(/\./, "\\.");
          if (b < articleArray.length - 1) {
            let TemRexgexArticleB = articleArray[b + 1];

            TemRexgexArticleB = articleArray[b + 1].replace(/\\/gm, "\\\\");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");

            let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
            let re = new RegExp(replace, "gim");
            point = ContentInEachSection[0].match(re);
          } else {
            let TemRexgexArticleB = articleArray[b];
            if (articleArray[b].match(/\(/gim)) {
              TemRexgexArticleB = articleArray[b].replace(/\\/gm, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");
            }

            let replace = `(?<=${TemRexgexArticleB}\n)(.*\n)*.*$`;
            let re = new RegExp(replace, "igm");
            point = ContentInEachSection[0].match(re);
          }

          let e;

          if (point) {
            e = point[0].replace(/\n+$/, "");
            e = e.replace(/^\n+/, "");
          } else {
            e = "";
          }

          data[a][sectionArray[a]][b] = [];

          data[a][sectionArray[a]][b] = { [articleArray[b]]: e };
        }
      }
    }
  } else if (i10.match(/^(Điều|Điều).*/i)) {
    /////////////////////////////////////////  // nếu chỉ có Điều ...

    let articleArray = i10.match(/^(Điều|Điều) \d+(.*)$/gim);

    function RemoveNoOrder(array) {
      let prev;
      for (let l = 0; l < array.length; l++) {
        if (l == 0) {
          prev = 1;
        }

        let current = parseInt(array[l].match(/(?<=(Điều|Điều) )\d+/gim)[0]);
        if (current == prev || current == prev + 1) {
          prev = parseInt(array[l].match(/(?<=(Điều|Điều) )\d+/gim)[0]);
        } else {
          delete array[l];
        }
      }
      let arr = [];
      array.map((key, i) => {
        key ? arr.push(key) : "";
      });
      return arr;
    }

    articleArray = RemoveNoOrder(articleArray);

    for (let c = 0; c < articleArray.length; c++) {
      let TemRexgexArticleA = articleArray[c];
      TemRexgexArticleA = articleArray[c].replace(/\\/gm, "\\\\");
      TemRexgexArticleA = TemRexgexArticleA.replace(/\(/gm, "\\(");
      TemRexgexArticleA = TemRexgexArticleA.replace(/\)/gm, "\\)");
      TemRexgexArticleA = TemRexgexArticleA.replace(/\./, "\\.");

      if (c < articleArray.length - 1) {
        let TemRexgexArticleB = articleArray[c + 1];

        TemRexgexArticleB = articleArray[c + 1].replace(/\\/gm, "\\\\");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gm, "\\(");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gm, "\\)");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");

        let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
        let re = new RegExp(replace, "gim");
        point = i10.match(re);
      } else {
        let TemRexgexArticleB = articleArray[c];

        if (articleArray[c].match(/\(/gim)) {
          // mới thêm sau này xem có chạy được không
          TemRexgexArticleB = articleArray[c].replace(/\\/gm, "\\\\");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\./, "\\.");
        }

        let replace = `(?<=${TemRexgexArticleB}\n)(.*\n)*.*$`;
        let re = new RegExp(replace, "gim");
        point = i10.match(re);
      }
      let e;
      if (point) {
        e = point[0].replace(/\n+$/, "");
        e = e.replace(/^\n+/, "");
      } else {
        e = "";
      }

      data[c] = { [articleArray[c]]: e };
    }
  }

  console.table("data", data);
  return data;
}

function Push() {
  let lawNumberForPush =
    lawInfo["lawNumber"] +
    (lawInfo["lawNumber"].match(/VBHN/gim)
      ? "(" + lawInfo["lawDaySign"].match(/\d+$/gim)[0] + ")"
      : "");
  fetch("http://localhost:5000/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataLaw: data,
      lawInfo: lawInfo,
      lawNumber: lawNumberForPush,
      contentText
    }),
  })
    .then((res) => {
      res.text();
      console.log("success");
    })
    .then((data) => console.log(123));
  console.log(lawNumberForPush);
}

async function Compare() {
  // so sánh có law nào thiếu hay thừa ở LawContent và LawInfo không
  let infoTitle = [];
  let contentTitle = [];
  await fetch("http://localhost:5000/retriveInfo", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (infoTitle = Object.keys(data)));

  await fetch("http://localhost:5000/retriveContent", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (contentTitle = Object.keys(data)));

  var infoTitleHas = infoTitle.filter(function (n) {
    return !this.has(n);
  }, new Set(contentTitle));
  var contentTitleHas = contentTitle.filter(function (n) {
    return !this.has(n);
  }, new Set(infoTitle));

  console.log("contentTitleHas", contentTitleHas);
  console.log("infoTitleHas", infoTitleHas);
}

async function FixLawRelated() {
  let infoLaw = {};
  await fetch("http://localhost:5000/retriveInfo", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (infoLaw = data));

  let keyValInfo = {};
  Object.keys(infoLaw).map((key, i) => {
    keyValInfo[infoLaw[key]["lawNumber"]] = infoLaw[key]["lawNameDisplay"];
  });

  Object.keys(infoLaw).map((key, i) => {
    if (infoLaw[key].hasOwnProperty("lawRelated")) {
      infoLaw[key]["lawRelated"].map((key1, i1) => {
        let lawHaved;
        let noLawHaved;
        if (key1.match(/ /gim)) {
          for (let a = 0; a < Object.keys(keyValInfo).length; a++) {
            if (
              // nếu như luật trong related không có sẵn trong data
              key1
                .replace(/(\,| và| tại| của)/gim, "")
                .match(
                  new RegExp(
                    `${keyValInfo[Object.keys(keyValInfo)[a]].replace(
                      /(\,| và| tại| của)/gim,
                      ""
                    )}`,
                    "img"
                  )
                )
            ) {
              infoLaw[key]["lawRelated"][i1] = Object.keys(keyValInfo)[a];
              lawHaved = Object.keys(keyValInfo)[a];
              // console.log(Object.keys(keyValInfo)[a]);

              break;
            } else {
              noLawHaved = `${key1}:${key}`;
              // console.log('Luật chưa có',key1);
            }
          }

          if (lawHaved) {
            // console.log("lawHaved", lawHaved);
          } else {
            console.log("noLawHaved", noLawHaved);
          }
        } else {
          // console.log('VB chưa có',key1);
        }
      });
    }
  });

  console.log("infoLaw", infoLaw);
}

async function findMissingField() {
  // tìm các trường thông tin mà không có trong 1 bộ tiêu chuẩn
  let infoLaw = {};
  await fetch("http://localhost:5000/retriveInfo", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (infoLaw = data));
  // console.log(infoLaw);

  if (infoLaw) {
    Object.keys(infoLaw).map((key, i) => {
      // if( (!Object.keys(infoLaw[key]).includes('lawRelated')  ))      {
      if (
        JSON.stringify(Object.keys(infoLaw[key])) !=
        JSON.stringify([
          "lawDayActive",
          "lawDaySign",
          "lawDescription",
          "lawKind",
          "lawNameDisplay",
          "lawNumber",
          "lawRelated",
          "nameSign",
          "roleSign",
          "unitPublish",
        ])
      ) {
        // if( (Object.keys(infoLaw[key])).length != 10 ){

        console.log(key);
      }
    });
  } else {
    console.log("no infoLaw");
  }
}

async function getLawNoExist() {
  // các luật nào nếu đã có link (đã tồn tại) thì sẽ không xuất hiện dưới dạng chữ mà chỉ xuất hiện dưới dạng LawNumber
  // (do đã xử lý ở fn FixLawRelated)
  // cái fn này dùng để tìm các law ở dạng chữ ( có \s trong những lawRelated)
  let infoLaw = {};
  await fetch("http://localhost:5000/retriveInfo", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (infoLaw = data));

  let keyValInfo = {};
  Object.keys(infoLaw).map((key, i) => {
    keyValInfo[infoLaw[key]["lawNumber"]] = infoLaw[key]["lawNameDisplay"];
  });

  let noExistLaw = [];
  Object.keys(infoLaw).map((key, i) => {
    if (infoLaw[key].hasOwnProperty("lawRelated")) {
      infoLaw[key]["lawRelated"].map((key1, i1) => {
        // if (key1.match(/ /gim)) {
        // for (let a = 0; a <= Object.keys(keyValInfo).length; a++) {
        if (key1.match(/ /gim)) {
          console.log("Luật chính có lawRelated thiếu", key);
          noExistLaw.push(key);
          // }
          // }
        }
      });
    }
  });

  console.log("noExistLaw", noExistLaw);
}

async function findError(pass) {
  // tìm các trường bị sai thông tin VD như nhầm RoleSign thành các 1 dòng nào đó dài
  // chỉ áp dụng với các trường là array
  let infoLaw = {};
  await fetch("http://localhost:5000/retriveInfo", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (infoLaw = data));

  let keyValInfo = {};
  Object.keys(infoLaw).map((key, i) => {
    keyValInfo[infoLaw[key]["lawNumber"]] = infoLaw[key]["lawNameDisplay"];
  });

  let noExistLaw = [];
  Object.keys(infoLaw).map((key, i) => {
    if (infoLaw[key].hasOwnProperty(pass)) {
      if (Array.isArray(infoLaw[key][pass])) {
        infoLaw[key][pass].map((key1, i1) => {
          console.log(key);

          if (
            // !key1.match(/^(Viện|Bộ|Thủ|Thứ|Chánh|Thống|Chủ|Phó)/gim)  // KT RoleSign

            key1.match(/ /gim).length > 5 // kiểm tra tên, unitPublish
          ) {
            // đoạn chính
            console.log(key);
            noExistLaw.push(key);
          }
        });
      }
    }
  });

  console.log("noExistLaw", noExistLaw);
}

async function Delete() {
  await fetch("http://localhost:5000/delete", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => (infoLaw = data));
}

function NaviNext() {
  let URI = window.location.href;
  if (URI.match(/(?<=AllURL\/).*(?=\?URL)/g)) {
    let currentIndex = parseInt(URI.match(/(?<=AllURL\/).*(?=\?URL)/g)[0]);
    let nextURI;

    if (currentIndex < 19) {
      nextURI = URI.replace(/(?<=AllURL\/).*(?=\?URL)/g, `${currentIndex + 1}`);
    } else {
      let nextPage = parseInt(URI.match(/(?<=\%26page\%3D).*/gim)[0]) + 1;
      nextURI = URI.replace(/(?<=\%26page\%3D).*/gim, nextPage);
      nextURI = nextURI.replace(/(?<=AllURL\/).*(?=\?URL)/g, 0);
    }
    window.location.href = nextURI;
  } else {
    console.log('none URI "AllURL"');
  }
}

function NaviHome() {
  window.location.href = "http://localhost:5000";
}

async function pasteContent() {
  const text = await navigator.clipboard.readText();
  document.querySelector("#each").value = text;
}

async function pasteContentAll() {
  const text = await navigator.clipboard.readText();
  document.querySelector("#all").value = text;
}

function goToStartInput() {
  document.querySelector("#content_input").focus();
  document.querySelector("#content_input").setSelectionRange(0, 0);
}

function goToEndInput() {
  document.querySelector("#content_input").focus();
  document
    .querySelector("#content_input")
    .setSelectionRange(
      document.querySelector("#content_input").value.length,
      document.querySelector("#content_input").value.length
    );
}

function goToStartOutput() {
  document.querySelector(".output").focus();
  document.querySelector(".output").setSelectionRange(0, 0);
}

function goToEndOutput() {
  document.querySelector(".output").focus();
  document
    .querySelector(".output")
    .setSelectionRange(
      document.querySelector(".output").value.length,
      document.querySelector(".output").value.length
    );
}

if (
  window.location.href.match(/AllURL\//g)
  //||window.location.href.match(/URL\?URL/g)
) {
  convertInfo("main")
    .then((t) => {
      goToEndInput(), goToEndOutput(), convertContent(false);
    })
    .then((r) => {
      if (
        data.length &&
        lawInfo["lawDayActive"] &&
        lawInfo["unitPublish"][0] &&
        lawInfo["nameSign"][0]
      ) {
        if (
          parseInt(lawInfo["lawDayActive"].match(/\d+$/)) ==
          parseInt(lawInfo["lawDaySign"].match(/\d+$/))
        ) {
          if (
            parseInt(lawInfo["lawDayActive"].match(/(?<=\/)\d+(?=\/)/)) >=
            parseInt(lawInfo["lawDaySign"].match(/(?<=\/)\d+(?=\/)/))
          ) {
            Push();
            NaviNext();
          } else {
            console.warn("lawDayActive sai tháng");
          }
        } else if (
          parseInt(lawInfo["lawDayActive"].match(/\d+$/)) >
          parseInt(lawInfo["lawDaySign"].match(/\d+$/))
        ) {
          Push();
          NaviNext();
        } else {
          console.warn("lawDayActive sai năm");
        }
      } else {
        console.warn("bị rỗng");
      }
    });
}
