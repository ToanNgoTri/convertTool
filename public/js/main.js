function beep() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Tạo một oscillator (dao động) để phát âm thanh
  const oscillator = audioContext.createOscillator();
  
  // Cài đặt tần số của âm thanh
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Tần số 440 Hz (A4)
  
  // Kết nối oscillator đến output (loa)
  oscillator.connect(audioContext.destination);
  
  // Bắt đầu phát âm thanh
  oscillator.start();

  oscillator.stop(audioContext.currentTime + 1);

}


  let lawInfo = {};
let contentText = '';

let roleSign = []

let lawDayActive
let unitPublishString
let unitPublish
let lawDaySign
let nameSignString
let nameSignArrayDemo
let nameSign
let lawDescription
let lawNumber
let lawRelated
let lawKind
let lawNameDisplay

function getValueinArea() {
  unitPublishString = document.querySelector("#unitPublish").value;
  unitPublish = unitPublishString.split("; ");
  lawDaySign = document.querySelector("#lawDaySign").value;
  
  
  nameSignString = document.querySelector("#nameSign").value;
  nameSignArrayDemo  = nameSignString.split("; ");
  nameSign  = []
  
  lawDescription = document.querySelector("#lawDescription").value;
  lawNumber = document.querySelector("#lawNumber").value;
  lawRelated = []
  
  lawKind = document.querySelector("#lawKind").value;
  
  lawNameDisplay = lawDescription
  if(lawKind.match(/^(luật|bộ luật)/i)){
    lawNameDisplay = lawDescription.replace(/,* của Quốc hội.*số.*/i,'')
    lawNameDisplay = lawNameDisplay.replace(/,* số \d.*của Quốc hội.*/i,'')
    lawNameDisplay = lawNameDisplay+' năm '+lawDaySign.match(/\d+$/i)[0]
  }else{
    lawNameDisplay = lawKind+' số '+lawNumber
  }

  contentText = document.querySelector("#content_input").value;
  contentText = contentText.replace(/(^\s*|\s*$)/img,'');   // bỏ các khoảng trắng đầu và cuối nếu có

}

function addDaysToDate(dateStr, daysToAdd) {
  // Tách chuỗi dd/mm/yyyy thành các phần (ngày, tháng, năm)
  let parts = dateStr.split("/");  // parts[0] là ngày, parts[1] là tháng, parts[2] là năm
  
  // Tạo đối tượng Date từ ngày tháng năm (lưu ý tháng trong JavaScript bắt đầu từ 0)
  let date = new Date(parts[2], parts[1] - 1, parts[0]);
  
  // Cộng thêm số ngày vào đối tượng Date
  date.setDate(date.getDate() + daysToAdd);
  
  // Trả về ngày mới sau khi cộng thêm
  return date;
}


function getRoleSign(contentRoleSign,nameSign) {

  contentRoleSign = contentRoleSign.replace(/\n\(*đã k(ý|í)\)*/gim, "");
  contentRoleSign = contentRoleSign.replace(/\n\[daky\]/gim, "");

  let roleSign = []
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
    roleSignString = roleSignString.replace(/\s/gm,' ')
    roleSign.push(roleSignString);
  }
return roleSign
}

function getArrangeUnitPublic(roleSignString,nameSignArrayDemo,lawKind,unitPublish) {
  let nameSign = []
  let unitPbDemo = []
  // console.log('nameSignArrayDemo',nameSignArrayDemo);
  // console.log('roleSignString',roleSignString);
  // console.log('unitPublish',unitPublish);
  
  nameSignArrayDemo.map( (nameSignDemo,i) => {
    let nameSignString = roleSignString.match(new RegExp(`.*${nameSignDemo}.*`,'img'))[0]
    
    nameSign.push(nameSignString)
   let nameSignStringEffectArea = roleSignString.match(new RegExp(`(\.*\\n){0,3}\.*${nameSignDemo}\.*`,'img'))[0]  
   //    let nameSignStringEffectArea = roleSignString.match(new RegExp(`${roleSignString.match(new RegExp(`(\.*\\n){0,3}\.*${nameSignDemo}\.*`,'img'))[0]  }`,'img'))[0]
   nameSignStringEffectArea = nameSignStringEffectArea.replace(/\n/gmi,' ')
   if(lawKind.match(/liên tịch/i)){

     for(let b = 0;b<unitPublish.length;b++){      
      // console.log(unitPublish[b]);
      
       if(nameSignStringEffectArea.match(new RegExp(`${unitPublish[b].slice(0,6)}`,'igm'))
      && nameSignStringEffectArea.match(new RegExp(`${unitPublish[b].slice(unitPublish[b].length-6,unitPublish[b].length)}`,'igm'))){
         unitPbDemo[i] = unitPublish[b]    
         break
       }
     }
    }else{
      unitPbDemo = unitPublish
    }
  })
return {unitPbDemo,nameSign}
}

function getLawDayActive(text,daySign) {
 let lawDayActive
 if (
  text.match(
    // /(?<=^(Điều|Ðiều|Điều) \d.*\n.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
    /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
  )
) {
     lawDayActive = text.match(
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
    )[0];
  countDaysAfter = lawDayActive.match(/\d+/img)[0]
  lawDayActive = addDaysToDate(daySign,parseInt(countDaysAfter))
  console.log(3);
}else if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*(Hiệu lực|thi hành|thực hiện).*\n).*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực).* từ ngày k/im
      /(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực).{0,19}từ ngày (k|ban hành)/im
    )
  ) {
       console.log(1);
       
    lawDayActive = addDaysToDate(daySign,0);
  } else if (
    text.match(/(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Quy chuẩn kỹ thuật|Định mức)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19})(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/im
      // /(?<=^(Điều|Ðiều|Điều) \d.{0,15}(Hiệu lực|thi hành|thực hiện).*(\n.*)*.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]+)(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/im
    )
  ) {
       let lawDayActiveDemo = text.match(
/(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Quy chuẩn kỹ thuật|Định mức)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19})(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/img
    )[text.match(
/(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Quy chuẩn kỹ thuật|Định mức)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19})(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/img
    ).length-1];
    console.log(2);
    let RemoveDay = lawDayActiveDemo.replace(/(ngày|ngày) */im, "");
    let RemoveMonth = RemoveDay.replace(/ *(tháng|tháng) */im, "/");
    lawDayActive = addDaysToDate(RemoveMonth.replace(/ *năm */im, "/"),0)
  } else if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*(Hiệu lực|thi hành|thực hiện).*(\n.*)*.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]+)\d+\/\d+\/\d+/im
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19}ngày\s)\d+(\/|\-)\d+(\/|\-)\d+/im
    )
  ) {
    
    lawDayActive = text.match(
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19}ngày\s)\d+(\/|\-)\d+(\/|\-)\d+/im
    )[0]
    lawDayActive = lawDayActive.replace(/-/img,'/')
    console.log('lawDayActive',lawDayActive);
    
    lawDayActive = addDaysToDate(lawDayActive,0)
  }  else {
    console.log(4);
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
  
  text = text.replace(/\s/img,' ' )
  // console.log('text',text);
  
  let lawRelatedDemo = text.match(
    /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\}|”)]+/gi
  );
  let lawRelatedDemo2 = lawRelatedDemo
    ? lawRelatedDemo.map(function (item) {
        return item.replace(/ */g, "");
      })
    : [];

  // if (b13.match(/(?<=(căn cứ |; |và ))(luật|bộ luật)[^ số][^;]+năm \d+ (?=((và luật sửa đổi)|;))/gi)) {
  if (text.match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi)) {
      

    for (
      let y = 0;
      y <
      text.match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi).length;
      y++
    ) {
            
      if (
        !text
          .match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi)
          [y].match(/(?<=năm \d+) và (?=luật sửa)/gi)
      ) {
        let lawRelatedString = text
          .match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi)
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
          .match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi)
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
  }else if (text.match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi)) {
      

    for (
      let y = 0;
      y <
      text.match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi).length;
      y++
    ) {
      
      if (
        !text
          .match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi)
          [y].match(/(?<=ngày \d+\/+\d+\/\d+) và (?=luật sửa)/gi)
      ) {
        let lawRelatedString = text
          .match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi)
          [y].replace(/ số \d+[^( |,)]+/gim, "");
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+\/\d+\/(\d+)/gim,
          " năm $1"
        );

        lawRelatedDemo2 = [...lawRelatedDemo2, lawRelatedString];
      } else {
        let lawRelatedString = text
          .match(/(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi)
          [y].replace(/ số \d+[^( |,)]+/gim, "");
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+\/\d+\/(\d+)/gim,
          " năm $1"
        );
        lawRelatedDemo2 = [
          ...lawRelatedDemo2,
          ...lawRelatedString.split(/(?<=ngày \d+\/+\d+\/\d+) và (?=luật sửa)/gi),
        ];
      }
    }
  }

//   if (text.match(/(?<=(căn cứ |; ))Pháp lệnh[^(;|\n)]+năm \d+/gi)) {


// for (
// let y = 0;
// y <
// text.match(/(?<=(căn cứ |; ))Pháp lệnh[^(;|\n)]+năm \d+/gi).length;
// y++
// ) {
// if (
//   !text
//     .match(/(?<=(căn cứ |; ))Pháp lệnh[^(;|\n)]+năm \d+/gi)
//     [y].match(/(?<=năm \d+) và (?=luật sửa)/gi)
// ) {
//   let lawRelatedString = text
//     .match(/(?<=(căn cứ |; ))Pháp lệnh[^(;|\n)]+năm \d+/gi)
//     [y].replace(/ số \d+[^( |,)]+/gim, "");
//   lawRelatedString = lawRelatedString.replace(
//     / ngày \d+\/\d+\/\d+/gim,
//     ""
//   );
//   lawRelatedString = lawRelatedString.replace(
//     / ngày \d+ *\d+ *\d+/gim,
//     ""
//   );
//   lawRelatedString = lawRelatedString.replace(
//     / (ngày|ngày) *\d+ *(tháng|tháng) *\d+/gim,
//     ""
//   );

//   lawRelatedDemo2 = [...lawRelatedDemo2, lawRelatedString];
// } else {
//   let lawRelatedString = text
//     .match(/(?<=(căn cứ |; ))Pháp lệnh[^(;|\n)]+năm \d+/gi)
//     [y].replace(/ số \d+[^( |,)]+/gim, "");
//   lawRelatedString = lawRelatedString.replace(
//     / ngày \d+\/\d+\/\d+/gim,
//     ""
//   );
//   lawRelatedString = lawRelatedString.replace(
//     / ngày \d+ *\d+ *\d+/gim,
//     ""
//   );
//   lawRelatedString = lawRelatedString.replace(
//     / (ngày|ngày) *\d+ *(tháng|tháng) *\d+/gim,
//     ""
//   );
//   lawRelatedDemo2 = [
//     ...lawRelatedDemo2,
//     ...lawRelatedString.split(/(?<=năm \d+) và (?=luật sửa)/gi),
//   ];
// }
// }
// }

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

 lawRelated = lawRelated.filter( law=> !law.match(/^luật năm/i) )

return lawRelated
}

function RemoveNoOrder(array) {
  let prev;
  for (let l = 0; l < array.length; l++) {
    if (l == 0) {
      prev = parseInt(array[l].match(/(?<=(Điều|Điều)\s)\d+/gim)[0]);
    }

    let current = parseInt(array[l].match(/(?<=(Điều|Điều)\s)\d+/gim)[0]);
    if (current == prev || current == prev + 1) {
      prev = parseInt(array[l].match(/(?<=(Điều|Điều)\s)\d+/gim)[0]);
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


async function getInfo(){
  try{
    getValueinArea()
    let result
    if(document.querySelector("#roleSign").value && document.querySelector("#lawRelated").value){
      result=  await getNormalTextInfo()
    }else{
      result=  await convertBareTextInfo()
    }
    return result
  
  }catch(e){
    beep()
    console.log(e);
    
  }
}

async function convertBareTextInfo() {
  console.log('convertBareTextInfo');
  
  let b = document.querySelector("#content_input").value;
  let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  let b2 = b1.replace(/\(*đã k(ý|í)\)*/gim, "");
  b2 = b2.replace(/\[daky\]/gim, "");
  let b3 = b2.replace(/^\s*nơi nhận.*\n([^\s].*\n)*/img,'')
  // b3 = b3.replace(/^nơi nhận.*\n([^\s].*\n)*/gim, ""); 

  let b4 = b3.replace(/\n+\s+$/gim, "");
  let b5 = b4.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
  // let b6 = b5
  let b6 = b5.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
  let b7 = b6.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
  let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
  let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
  // let b10 = b9
  let b10;

  let b10a = []; // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

  for (let c = 0; c < 5; c++) {
    if (!c) {
      b10a[c] = b9.replace(
        /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        ": "
      );
    } else {
      b10a[c] = b10a[c - 1].replace(
        /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        " "
      );
    }
  }
  b10 = b10a[4];

  // if(b9.match(/^Nơi nhận/mi)){    // bỏ phụ lục, danh mục các thư
  //   b10 = b9.replace(
  //     /(?<=^(Nơi nhận|Nơi Nhận).*(\n.*)*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|MỤC LỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ|Mẫu|MẪU|BIỂU KHUNG|QCVN|QCVN|ĐỊNH MỨC|HỆ THỐNG|CHƯƠNG TRÌNH).*(\n.*)*/gm,
  //     ""
  //   ); // bỏ Phụ lục,danh mục

  // }else{
  //   b10 = b9.replace(
  //     /(?<!^(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Điều|Ðiều|Điều|Chương|CHƯƠNG|Phần thứ|PHẦN THỨ|MỤC|Mục|Mục|Mẫu số).*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ|Mẫu|MẪU|BIỂU KHUNG|QCVN|QCVN|ĐỊNH MỨC|HỆ THỐNG|CHƯƠNG TRÌNH).*(\n.*)*/gm,
  //     ""
  //   ); // bỏ Phụ lục,danh mục
  //   }


  // b10 = b10.replace(/^(nơi nhận|Nơi nhận).*(\n.*)*/gim, "");

  // b10 = b10.replace(
  //   /(?<!(Điều|Ðiều|Điều|chương|Phần thứ|Mục|Mục) (\d|II|V|X)+\:*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ).*(\n.*)*/gim,
  //   ""
  // ); // bỏ Phụ lục,danh mục
  let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
  // let b12 = b11.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN  
  // let b12 = b11.replace(/(?<=^CHƯƠNG.*)\W*$/img, ""); 
  let b12 = b11.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,' ')
  let b13 = b12.replace(/  +/gim, " "); // bỏ khoảng cách 2 space




  

  // document.querySelector(".output").value = b9;


  nameSign = nameSignArrayDemo
roleSign = getRoleSign(b13,nameSign)

nameSign = getArrangeUnitPublic(b13,nameSignArrayDemo,lawKind,unitPublish)['nameSign']
  unitPublish = getArrangeUnitPublic(b13,nameSignArrayDemo,lawKind,unitPublish)['unitPbDemo']
  
  lawDayActive = getLawDayActive(b13,lawDaySign)

  if(document.querySelector("#lawRelated").value){
    lawRelated =  getLawRelated(document.querySelector("#lawRelated").value)

  }else{
    lawRelated =  getLawRelated(b13)

  }

  // document.querySelector(".output").value = b13;
  
  let b14=''
  for(let t = 0;t<=30;t++){
    let clause
    clause = b13.match(`(?<=(\n.*){${t}}).*`,'im')[0]
  // console.log('clause',clause);
  
  if (lawKind.match(/nghị quyết/i)) {// bỏ phần đầu
    b14 = b13.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, ""); 
    break
  } else if(clause.match(/^(Phần|PHẦN)\s(THỨ|I|l|1)/img)){

    let firstSection = b13.match(/^(Phần|PHẦN)\s(THỨ|I|l|1).*/im)[0]

    b14 = b13.replace(new RegExp(`(.*\\n)*(?=${firstSection})\\b`,'img'),'')
    break
  }else if(clause.match(/^(Chương|CHƯƠNG)\s(I|l|1)/img)){

    let firstChapter = b13.match(/^(Chương|CHƯƠNG)\s(I|l|1).{0,10}/im)[0]

    b14 = b13.replace(new RegExp(`(.*\\n)*(?=${firstChapter})`,'img'),'')
    break
  }else if(clause.match(/^(Điều|Ðiều|Điều)\s(I|l|1)/img)){
    
    let firstArticle = b13.match(/^(Điều|Ðiều|Điều)\s(I|l|1).{0,10}/im)[0]   // lấy 10 ký tự thôi cho chắc
    b14 = b13.replace(new RegExp(`(.*\\n)*(?=${firstArticle})`,'img'),'')
    break
  }
  }

  if(!b14){
      b14 = b13.replace(
        /^(.*\n)*.+(ban hành|ban hành|quy định|hướng dẫn|công bố)[^\n]+\n(?=(Chương (I|l|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
        ""
      ); 
    }



  let b15 = b14;
    if (b14.match(/(?<=.*\.\/\.)(\n.*)*/gim)) {
      
      b15 = b14.replace(/(?<=.*\.\/\.)(\n.*)*/gim, ""); //  bỏ tất cả sau ./.
    }
    
    if(b14.match(/^TM ?\./m)){
      // b15 = b14.match(/(^[^T][^M].*\n)*(?=^(KT|TM|Xác thực|XÁC THỰC|CHỦ NHIỆM|CHỦ TỊCH))/m)[0]; 
      b15 = b14.replace(/TM.*(\n.*)*/m,''); 
    }else if(b14.match(/^KT ?\./m)){
      b15 = b14.replace(/KT.*(\n.*)*/m,''); 
    } else {
      for(let k = 0;k<nameSign.length;k++){
        
        b15 = b14.replace(new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n)*)*`,'img'),''); // bỏ 2 hàng cuối

      }
    }
  
  b15 = b15.replace(/\.+\/+\.*/gim, ""); // bỏ ./. ở sau cùng
  let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối












  lawDaySign = addDaysToDate(lawDaySign,0)

  lawInfo["lawDescription"] = lawDescription;
  lawInfo["lawNumber"] = lawNumber;
  lawInfo["unitPublish"] = unitPublish;
  lawInfo["lawKind"] = lawKind;
  lawInfo["lawDaySign"] = lawDaySign;
  lawInfo["lawDayActive"] = lawDayActive;
  lawInfo["lawNameDisplay"] = lawNameDisplay;
  lawInfo["lawRelated"] = lawRelated;
  lawInfo["nameSign"] = nameSign;
  lawInfo["roleSign"] = roleSign;

    // if (roleSign.match(/phó thủ tướng/gim)) {
    //   lawInfo["roleSign"] = ["Phó Thủ Tướng"];
    // } else if (
    //   roleSign.match(/quyền thủ tướng/gim) ||
    //   roleSign.match(/q.* thủ tướng/gim)
    // ) {
    //   lawInfo["roleSign"] = ["Quyền Thủ Tướng"];
    // } else if (roleSign.match(/thủ tướng|thủ tướng|thủ tướng|thủ tưởng/gim)) {
    //   lawInfo["roleSign"] = ["Thủ Tướng"];
    // } else if (roleSign.match(/Thứ trưởng/gim)) {
    //   lawInfo["roleSign"] = ["Thứ trưởng"];
    // } else {
    //   lawInfo["roleSign"] = [roleSign];
    // }

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
  // console.log("year", parseInt(lawInfo["lawDaySign"].getYear())+1900);

  // console.log('lawInfo',lawInfo);
  
  document.querySelector(".output").value = b16;
  return { lawInfo };
}


async function getNormalTextInfo() {
console.log('getNormalTextInfo');


  let roleSignString = document.querySelector("#roleSign").value;

  nameSign = getArrangeUnitPublic(roleSignString,nameSignArrayDemo,lawKind,unitPublish)['nameSign']
  unitPublish = getArrangeUnitPublic(roleSignString,nameSignArrayDemo,lawKind,unitPublish)['unitPbDemo']

  let contentRoleSign = document.querySelector("#roleSign").value;
  roleSign = getRoleSign(contentRoleSign,nameSign)



  lawDayActive = getLawDayActive(contentText,lawDaySign)

  let introduceString = document.querySelector("#lawRelated").value;
  lawRelated =  getLawRelated(introduceString)



  document.querySelector(".output").value = contentText
   
  lawDaySign = addDaysToDate(lawDaySign,0)

  lawInfo = {unitPublish,lawDaySign,nameSign,roleSign,lawDayActive,lawDescription,lawNumber,lawRelated,lawKind,lawNameDisplay};


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

  // console.log('lawInfo',lawInfo);
  
}


let data = [];
async function convertContent() {
  data = [];


  let input = document.querySelector(".output").value;

  let i0 = input.replace(/^(Điều|Ðiều|Điều)( |\u00A0)+(\d+\w?)\.(.*)/gim, "Điều $3:$4");
  // điều . thành điều:

  let i1 = i0.replace(/^(Điều|Ðiều|Điều)( |\u00A0)+(\d+\w?)\.(.*)/gim, "Điều $3:$4");

  let i2 = i1.replace(/­/gm, "");
  // let i2 = i1
  // Bỏ . ở cuối hàng trong Điều

  // let i2 = i1.replace(/^(\s)*(.*)/gm, "$2");
  // đề phòng có khoảng trống đầu hàng, cut it

  // let i3 = i2.replace(/^\n+/gm, "");
  // // bỏ khoảng trống giữa các row

  // let i3 = i2.replace(/(?<=^CHƯƠNG.*)\W*$/img, "")
  let i3 = i2.replace(/(?<=^Chương (V|I|X|\d)*)\s/gim,': ')
  i3 = i3.replace(/(?<=^Chương.{0,5})l/gim,'I')

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

  let i7 = i6.replace(/\u00A0/img,' ')

  // let i8 =i7.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,' ')
  let i8 =i7

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


  let i9 = i8.replace(/(?<=^(Phần|PHẦN)\s(THỨ|I|l|\d)+[^\.]*)\./im,'')      // bỏ dấu chấm cuối chữ phần thứ ...

  let i10
  let i10a = []; // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

  for (let c = 0; c < initial; c++) {
    if (!c) {
      i10a[c] = i9.replace(
        /(?<=^(Phần|PHẦN)\s(THỨ|I|l|\d)+)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        ": "
      );
    } else {
      i10a[c] = i10a[c - 1].replace(
        /(?<=^(Phần|PHẦN)\s(THỨ|I|l|\d)+)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        " "
      );
    }
  }

  i10 = i10a[initial - 1];

  // let i10 = i9.replace(/(?<=\w)\/(?=\w)/gim, "\\"); // loại dấu division spla sh bằng dấu \
  // let i10 = i9

  contentText = i10
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

      // console.log('allArticle[a]',allArticle[a]);
  
      allArticle[a] = RemoveNoOrder(allArticle[a])
      
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
  } else if (i10.match(/^(Phần|PHẦN)\s(THỨ|I|l|\d).*/i)) {
    //////////////////////////////////////////////////////////////////////////////////////////////  // nếu có phần thứ ...

    let sectionArray;

    if (i10.match(/^(Phần|PHẦN)\s(THỨ|I|l|\d).*/gim)) {
      sectionArray = i10.match(/^(Phần|PHẦN)\s(THỨ|I|l|\d).*/gim);
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

          articleArray= RemoveNoOrder(articleArray)
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

        articleArray = RemoveNoOrder(articleArray)
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
  } else if (i10.match(/^(Điều|Điều) */i)) {
    /////////////////////////////////////////  // nếu chỉ có Điều ...

    let articleArray = i10.match(/^(Điều|Điều) \d+(.*)$/gim);


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
  let yearSign = parseInt(lawInfo["lawDaySign"].getYear())+1900
  let lawNumberForPush =
    lawInfo["lawNumber"] +
    (!lawInfo["lawNumber"].match(/(?<=\d\W)\d{4}/gim)
      ? "(" + yearSign + ")"
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

function NaviNext() {
  let URI = window.location.href;
  if(!URI.match(/%26page%3D/)){
    URI = URI+'%26page%3D1'
  }
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
  document.querySelector("#lawNumber").focus();
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
  getInfo()
    .then((t) => {
      goToEndInput(), goToEndOutput(), convertContent(false);
    })
    .then((r) => {
      // console.log('lawInfo["unitPublish"].indexOf(undefined)',lawInfo["unitPublish"].indexOf(undefined));
      
      if (
        data.length &&
        lawInfo["lawDayActive"] &&
        lawInfo["unitPublish"][0] &&
        lawInfo["nameSign"][0]&&
        lawInfo["roleSign"][0] &&
        lawInfo["unitPublish"].indexOf(undefined) < 0
      ){
        
        if(lawInfo["lawDayActive"]>=lawInfo["lawDaySign"])
        {
          if(lawInfo["roleSign"][0].match(/\s/img).length<=8){
            setTimeout(() => {
              Push();
              NaviNext();
              
            }, 2000);

          }
         
      }else{
        console.log('ngày lớn hơn');
        beep();
        
      }
    
    }else{
      console.log('Thiếu trường thông tin');
      beep();

    }
    });
}
