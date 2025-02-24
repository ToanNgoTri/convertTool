// < Nghị định 05/2025/TT-BGTVT, Nghị định 12/2025/NĐ-CP chưa hoàn thiện xong vb

// "Điều.*[^\.]": ""
//     \},
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
let contentText = "";

let roleSign = [];

let lawDayActive;
let unitPublishString;
let unitPublish;
let lawDaySign;
let nameSignString;
let nameSignArrayDemo;
let nameSign;
let lawDescription;
let lawNumber;
let lawRelated;
let lawKind;
let lawNameDisplay;

function getValueinArea() {
  unitPublishString = document.querySelector("#unitPublish").value;
  unitPublish = unitPublishString.split("; ");
  lawDaySign = document.querySelector("#lawDaySign").value.replace(/\s/gim, "");

  nameSignString = document.querySelector("#nameSign").value;
  nameSignArrayDemo = nameSignString.split("; ");
  nameSign = [];

  lawDescription = document.querySelector("#lawDescription").value;

  lawNumber = document.querySelector("#lawNumber").value.replace(/\s/gim, "");

  lawRelated = [];

  lawKind = document
    .querySelector("#lawKind")
    .value.replace(/(^\s*|\s*$)/gim, "");

  lawNameDisplay = lawDescription;
  if (lawKind.match(/^(luật|bộ luật)/i)) {
    lawNameDisplay = lawDescription.replace(/,* của Quốc hội.*số.*/i, "");
    // lawNameDisplay = lawNameDisplay.replace(/,* số \d.*của Quốc hội.*/i, "");
    lawNameDisplay = lawNameDisplay.replace(/,* số \d.*(của Quốc hội)*.*/i, "");
    
    lawNameDisplay = lawNameDisplay + " năm " + lawDaySign.match(/\d+$/i)[0];
  } else {
    lawNameDisplay = lawKind + " số " + lawNumber;
  }

  contentText = document.querySelector("#content_input").value;
  contentText = contentText.replace(/(^\s*|\s*$)/gim, ""); // bỏ các khoảng trắng đầu và cuối nếu có
}

function addDaysToDate(dateStr, daysToAdd) {
  // Tách chuỗi dd/mm/yyyy thành các phần (ngày, tháng, năm)
  let parts = dateStr.split("/"); // parts[0] là ngày, parts[1] là tháng, parts[2] là năm

  // Tạo đối tượng Date từ ngày tháng năm (lưu ý tháng trong JavaScript bắt đầu từ 0)
  let date = new Date(parts[2], parts[1] - 1, parts[0]);

  // Cộng thêm số ngày vào đối tượng Date
  date.setDate(date.getDate() + daysToAdd);

  // Trả về ngày mới sau khi cộng thêm
  return date;
}

function getRoleSign(contentRoleSign, nameSign) {
  contentRoleSign = contentRoleSign.replace(/\n\(*đã k(ý|í)\)*/gim, "");
  contentRoleSign = contentRoleSign.replace(/\n\[daky\]/gim, "");

  let roleSign = [];
  for (let a = 0; a < nameSign.length; a++) {
    // console.log('nameSign',nameSign);
    // console.log('contentRoleSign',contentRoleSign);

    let roleSignString = contentRoleSign
      .match(new RegExp(`.*(?=\n.*${nameSign[a]})`, "img"))[0]
      .toLowerCase(); //key.charAt(0).toUpperCase() + key.slice(1);

    roleSignString =
      roleSignString.charAt(0).toUpperCase() + roleSignString.slice(1);
    if (roleSignString.match(/^phó/i)) {
      roleSignString =
        "Phó " +
        roleSignString.charAt(4).toUpperCase() +
        roleSignString.slice(5);
    } else if (roleSignString.match(/quốc hội/i)) {
      roleSignString = roleSignString.replace(/quốc hội/i, "Quốc hội");
    }
    roleSignString = roleSignString.replace(/\s/gm, " ");
    roleSign.push(roleSignString);
  }
  return roleSign;
}

function getArrangeUnitPublic(
  roleSignString,
  nameSignArrayDemo,
  lawKind,
  unitPublish
) {
  let nameSign = [];
  let unitPbDemo = [];
  // console.log('nameSignArrayDemo',nameSignArrayDemo);
  // console.log('roleSignString',roleSignString);
  // console.log('unitPublish',unitPublish);

  nameSignArrayDemo.map((nameSignDemo, i) => {
    let nameSignString = roleSignString.match(
      new RegExp(`.*${nameSignDemo}.*`, "img")
    )[0];

    nameSign.push(nameSignString);
    let nameSignStringEffectArea = roleSignString.match(
      new RegExp(`(\.*\\n){0,3}\.*${nameSignDemo}\.*`, "img")
    )[0];
    //    let nameSignStringEffectArea = roleSignString.match(new RegExp(`${roleSignString.match(new RegExp(`(\.*\\n){0,3}\.*${nameSignDemo}\.*`,'img'))[0]  }`,'img'))[0]
    nameSignStringEffectArea = nameSignStringEffectArea.replace(/\n/gim, " ");
    if (lawKind.match(/liên tịch/i)) {
      for (let b = 0; b < unitPublish.length; b++) {
        // console.log(unitPublish[b]);

        if (
          nameSignStringEffectArea.match(
            new RegExp(`${unitPublish[b].slice(0, 6)}`, "igm")
          ) &&
          nameSignStringEffectArea.match(
            new RegExp(
              `${unitPublish[b].slice(
                unitPublish[b].length - 6,
                unitPublish[b].length
              )}`,
              "igm"
            )
          )
        ) {
          unitPbDemo[i] = unitPublish[b];
          break;
        }
      }
    } else {
      unitPbDemo = unitPublish;
    }
  });
  return { unitPbDemo, nameSign };
}

function getLawDayActive(text, daySign) {
  let lawDayActive;
  if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*\n.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
    )
  ) {
    lawDayActive = text.match(
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^;]+)sau \d* ngày/im
    )[0];
    countDaysAfter = lawDayActive.match(/\d+/gim)[0];
    lawDayActive = addDaysToDate(daySign, parseInt(countDaysAfter));
    console.log(3);
  } else if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*(Hiệu lực|thi hành|thực hiện).*\n).*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực).* từ ngày k/im
      /(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực).{0,19}từ ngày (k|ban hành)/im
    )
  ) {
    console.log(1);

    lawDayActive = addDaysToDate(daySign, 0);
  } else if (
    text.match(
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Quy chuẩn kỹ thuật|Định mức)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19})(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/im
      // /(?<=^(Điều|Ðiều|Điều) \d.{0,15}(Hiệu lực|thi hành|thực hiện).*(\n.*)*.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]+)(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/im
    )
  ) {
    let lawDayActiveDemo = text.match(
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Quy chuẩn kỹ thuật|Định mức)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19})(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/gim
    )[
      text.match(
        /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Quy chuẩn kỹ thuật|Định mức)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19})(ngày|ngày)\s*\d*\s*(tháng|tháng)\s*\d*\s*năm\s*\d*/gim
      ).length - 1
    ];
    console.log(2);
    let RemoveDay = lawDayActiveDemo.replace(/(ngày|ngày) */im, "");
    let RemoveMonth = RemoveDay.replace(/ *(tháng|tháng) */im, "/");
    lawDayActive = addDaysToDate(RemoveMonth.replace(/ *năm */im, "/"), 0);
  } else if (
    text.match(
      // /(?<=^(Điều|Ðiều|Điều) \d.*(Hiệu lực|thi hành|thực hiện).*(\n.*)*.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]+)\d+\/\d+\/\d+/im
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19}ngày\s)\d+(\/|\-)\d+(\/|\-)\d+/im
    )
  ) {
    lawDayActive = text.match(
      /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|Nghị định|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP)(\s(này|này))?.*(có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực|có hiệu lực)[^\d]{0,19}ngày\s)\d+(\/|\-)\d+(\/|\-)\d+/im
    )[0];
    lawDayActive = lawDayActive.replace(/-/gim, "/");

    lawDayActive = addDaysToDate(lawDayActive, 0);
  } else {
    console.log(4);
    lawDayActive = null;
  }

  return lawDayActive;
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

  text = text.replace(/\s/gim, " ");
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
   if (
    text.match(
      /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
    )
  ) {
    for (
      let y = 0;
      y <
      text.match(
        /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
      ).length;
      y++
    ) {
      if (
        !text
          .match(
            /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
          )
          [y].match(/(?<=năm \d+) và (?=luật sửa)/gi)
      ) {

        if( !text.match(
          /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
        )
        [y].match(
          /(luật|Luật|bộ luật|pháp lệnh) số \d/gi
        )){

          if(
            text
            .match(
              /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
            )
            [y].match(/(?<=năm \d+) và (?=(NGHỊ ĐỊNH|Nghị định|THÔNG TƯ))/gi)
          ){
          
            let lawRelatedString = text
              .match(
                /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+(?= và (NGHỊ ĐỊNH|Nghị định|THÔNG TƯ))/gi
              )
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
          
          }else{
  
            let lawRelatedString = text
            .match(
              /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
            )
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
  
          }

          
        }


      } else{

        let lawRelatedString = text
          .match(
            /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+năm \d+/gi
          )
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
  } else if (
    text.match(
      /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi
    )
  ) {
    for (
      let y = 0;
      y <
      text.match(
        /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi
      ).length;
      y++
    ) {
      if (
        !text
          .match(
            /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi
          )
          [y].match(/(?<=ngày \d+\/+\d+\/\d+) và (?=luật sửa)/gi)
      ) {
        let lawRelatedString = text
          .match(
            /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi
          )
          [y].replace(/ số \d+[^( |,)]+/gim, "");
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+\/\d+\/(\d+)/gim,
          " năm $1"
        );

        lawRelatedDemo2 = [...lawRelatedDemo2, lawRelatedString];
      } else {
        let lawRelatedString = text
          .match(
            /(?<=(căn cứ |; ))(luật|Luật|bộ luật|pháp lệnh)[^(;|\n)]+ngày \d+\/+\d+\/\d+/gi
          )
          [y].replace(/ số \d+[^( |,)]+/gim, "");
        lawRelatedString = lawRelatedString.replace(
          / ngày \d+\/\d+\/(\d+)/gim,
          " năm $1"
        );
        lawRelatedDemo2 = [
          ...lawRelatedDemo2,
          ...lawRelatedString.split(
            /(?<=ngày \d+\/+\d+\/\d+) và (?=luật sửa)/gi
          ),
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
    return item.replace(/ (ngày|ngày) ?\d+ ?(tháng|tháng) ?\d+/gim, "");
  });

  lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
    return item.replace(/,?\s(?=năm)/gim, " ");
  });

  lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
    return item.replace(/\s+/gim, " ").replace(/^\s+/gim, "").replace(/\s+$/gim, "")
  });


  let lawRelated = uniqueArray(lawRelatedDemo2);

  lawRelated = lawRelated.filter((law) => !law.match(/^luật năm/i));

  let lawRelatedObject = {}
  lawRelated = lawRelated.map((law)=>{
    return lawRelatedObject[law]=0
  })

  return lawRelatedObject;
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

async function getInfo() {
  try {
    getValueinArea();
    let result;
    if (
      document.querySelector("#roleSign").value &&
      document.querySelector("#lawRelated").value
    ) {
      result = await getNormalTextInfo();
    } else {
      result = await convertBareTextInfo();
    }
    return result;
  } catch (e) {
    beep();
    console.log(e);
  }
}

function convertPartOne() {
  let b = document.querySelector("#content_input").value;
  let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  let b2 = b1.replace(/\(*đã k(ý|í)\)*/gim, "");
  b2 = b2.replace(/\[daky\]/gim, "");
  let b3 = b2.replace(/^\s*nơi nhận.*\n([^\s].*\n)*/gim, "");
  let b4 = b3.replace(/\n+\s+$/gim, "");
  let b5 = b4.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
  let b6 = b5.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
  let b7 = b6.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
  let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
  let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng

  let b10 = b9;
  // let b10a = []; // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

  // for (let c = 0; c < 5; c++) {
  //   if (!c) {
  //     b10a[c] = b9.replace(
  //       /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
  //       ": "
  //     );
  //   } else {
  //     b10a[c] = b10a[c - 1].replace(
  //       /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
  //       " "
  //     );
  //   }
  // }
  // b10 = b10a[4];

  let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi

  let b12 = b11.replace(/(?<=^Chương (V|I|X|\d)*)\.?\s/gim, ": ");
  // b12 = b12.replace(/(?<=^Chương (V|I|X|\d)*) /gim, ":");
  b12 = b12.replace(/(?<=^Chương.{0,5})l/gim, "I");
  // let b12a = []

  // for (let c = 0; c < 5; c++) {
  //   if (!c) {
  //     b12a[c] = b11.replace(
  //       /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
  //       ": "
  //     );
  //   } else {
  //     b12a[c] = b12a[c - 1].replace(
  //       /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
  //       " "
  //     );
  //   }
  // }
  // b12 = b12a[4];

  let b13 = b12.replace(/  +/gim, " "); // bỏ khoảng cách 2 space

  return b13;
}

function convertPartTwo(partOne) {
  let b14 = "";
  for (let t = 0; t <= 30; t++) {
    let clause;
    clause = partOne.match(`(?<=(\n.*){${t}}).*`, "im")[[0]];
    // console.log('clause',clause);

    // if(clause){
    //   clause = clause[0]
    // } else{

    //   if(partOne.match(/PHẦN\sTHỨ\s/img)){
    //     b14 = partOne.replace(
    //       /^(.*\n)*.+(?=(PHẦN\sTHỨ\s)(:|\.|\s))/i,
    //       ""
    //     );
    //   }else if(partOne.match(/Chương (I|l|1)[^I]/img)){
    //     b14 = partOne.replace(
    //       /^(.*\n)*.+(?=(Chương (I|l|1))[^I])/i,
    //       ""
    //     );
    //   }else if(partOne.match(/(Điều 1|Điều 1)/img)){
    //     b14 = partOne.replace(
    //       /^(.*\n)*.+(?=(Điều 1|Điều 1)(:|\.))/i,
    //       ""
    //     );
    //   }

    // break
    // }

    if (
      lawKind ? lawKind.match(/nghị quyết/i) : partOne.match(/^nghị quyết/i)
    ) {
      // bỏ phần đầu
      b14 = partOne.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, "");

      break;
    } else if (clause.match(/^(Phần|PHẦN)\s(THỨ|I|l|1)/gim)) {
      let firstSection = partOne.match(/^(Phần|PHẦN)\s(THỨ|I|l|1).*/im)[0];

      b14 = partOne.replace(
        new RegExp(`(.*\\n)*(?=${firstSection})\\b`, "img"),
        ""
      );
      break;
    } else if (clause.match(/^(Chương|CHƯƠNG)\s(I|l|1)/gim)) {
      let firstChapter = partOne.match(/^(Chương|CHƯƠNG)\s(I|l|1).*/im)[0];

      b14 = partOne.replace(
        new RegExp(`(.*\\n)*(?=${firstChapter})`, "img"),
        ""
      );
      break;
    } else if (clause.match(/^(Điều|Ðiều|Điều)\s(I|l|1)/gim)) {
      let firstArticle = partOne.match(
        /^(Điều|Ðiều|Điều)\s(I|l|1).{0,10}/im
      )[0]; // lấy 10 ký tự thôi cho chắc
      b14 = partOne.replace(
        new RegExp(`(.*\\n)*(?=${firstArticle})`, "img"),
        ""
      );
      break;
    }
  }

  // if(!b14){
  //     b14 = partOne.replace(
  //       /^(.*\n)*.+(ban hành|ban hành|quy định|hướng dẫn|công bố)[^\n]+\n(?=(Chương (I|l|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
  //       ""
  //     );
  //   }

  let b15 = b14;
  if (b14.match(/(?<=.*\.\/\.)(\n.*)*/gim)) {
    b15 = b14.replace(/(?<=.*\.\/\.)(\n.*)*/gim, ""); //  bỏ tất cả sau ./.
  }

    if(b14.match(/^TM\s?\./m)){
    b15 = b15.replace(/^TM\s?.*(\n.*)*/m,'');

  }else if(b15.match(/^KT\s?\./m)){

    b15 = b15.replace(/^KT\s?.*(\n.*)*/m,'');
  } else if(b15.match(new RegExp(nameSign[0]),'img')) {

    for(let k = 0;k<nameSign.length;k++){
      
      if(b15.match(new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`,'img'))[0].match(/(THỨ|PHÓ)/img) &&
      !b15.match(new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`,'img'))[0].match(/(THỨ|PHÓ)/img).length){
        b15 = b15.replace(new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`,'img'),''); // tất cả hàng cuối

      }else{
        b15 = b15.replace(new RegExp(`\n.*\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`,'img'),''); // tất cả hàng cuối
      }

    }
  }

  // if (nameSign) {
  //   for (let k = 0; k < nameSign.length; k++) {
  //     if (
  //       b15.match(new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`, "img")) &&
  //       !b15
  //         .match(new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`, "img"))[0]
  //         .match(/(THỨ|PHÓ)/gim)
  //     ) {
  //       b15 = b15.replace(
  //         new RegExp(`\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`, "img"),
  //         ""
  //       ); // tất cả hàng cuối
  //     } else {
  //       b15 = b15.replace(
  //         new RegExp(`\n.*\n.*\n${nameSign[k]}(\n(.*\n.*)*)*`, "img"),
  //         ""
  //       ); // tất cả hàng cuối
  //     }
  //   }
  // }

  let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối

  return b16;
}

async function convertBareTextInfo() {
  console.log("convertBareTextInfo");

  // let b = document.querySelector("#content_input").value;
  // let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  // let b2 = b1.replace(/\(*đã k(ý|í)\)*/gim, "");
  // b2 = b2.replace(/\[daky\]/gim, "");
  // let b3 = b2.replace(/^\s*nơi nhận.*\n([^\s].*\n)*/img,'')
  // let b4 = b3.replace(/\n+\s+$/gim, "");
  // let b5 = b4.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
  // let b6 = b5.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
  // let b7 = b6.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
  // let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
  // let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng

  // let b10;
  // let b10a = []; // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

  // for (let c = 0; c < 5; c++) {
  //   if (!c) {
  //     b10a[c] = b9.replace(
  //       /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
  //       ": "
  //     );
  //   } else {
  //     b10a[c] = b10a[c - 1].replace(
  //       /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
  //       " "
  //     );
  //   }
  // }
  // b10 = b10a[4];

  // let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
  // let b12 = b11.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,' ')
  // let b13 = b12.replace(/  +/gim, " "); // bỏ khoảng cách 2 space

  nameSign = nameSignArrayDemo;

  let partOne = convertPartOne();

  let partTwo = convertPartTwo(partOne);

  // document.querySelector(".output").value = b9;

  nameSign = nameSignArrayDemo;
  roleSign = getRoleSign(partOne, nameSign);

  nameSign = getArrangeUnitPublic(
    partOne,
    nameSignArrayDemo,
    lawKind,
    unitPublish
  )["nameSign"];
  unitPublish = getArrangeUnitPublic(
    partOne,
    nameSignArrayDemo,
    lawKind,
    unitPublish
  )["unitPbDemo"];

  lawDayActive = getLawDayActive(partOne, lawDaySign);

  if (document.querySelector("#lawRelated").value) {
    lawRelated = getLawRelated(document.querySelector("#lawRelated").value);
  } else {
    lawRelated = getLawRelated(partOne);
  }

  // document.querySelector(".output").value = b13;

  lawDaySign = addDaysToDate(lawDaySign, 0);

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

  document.querySelector(".output").value = partTwo;
  return { lawInfo };
}

async function getNormalTextInfo() {
  console.log("getNormalTextInfo");

  let roleSignString = document.querySelector("#roleSign").value;

  nameSign = getArrangeUnitPublic(
    roleSignString,
    nameSignArrayDemo,
    lawKind,
    unitPublish
  )["nameSign"];
  unitPublish = getArrangeUnitPublic(
    roleSignString,
    nameSignArrayDemo,
    lawKind,
    unitPublish
  )["unitPbDemo"];

  let contentRoleSign = document.querySelector("#roleSign").value;
  roleSign = getRoleSign(contentRoleSign, nameSign);

  lawDayActive = getLawDayActive(contentText, lawDaySign);

  let introduceString = document.querySelector("#lawRelated").value;
  lawRelated = getLawRelated(introduceString);

  document.querySelector(".output").value = contentText;

  lawDaySign = addDaysToDate(lawDaySign, 0);

  lawInfo = {
    unitPublish,
    lawDaySign,
    nameSign,
    roleSign,
    lawDayActive,
    lawDescription,
    lawNumber,
    lawRelated,
    lawKind,
    lawNameDisplay,
  };

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

  let i0 = input.replace(
    /^(Điều|Ðiều|Điều)( |\u00A0)+(\d+\w?)\.(.*)/gim,
    "Điều $3:$4"
  );
  // điều . thành điều:

  let i1 = i0.replace(
    /^(Điều|Ðiều|Điều)( |\u00A0)+(\d+\w?)\.(.*)/gim,
    "Điều $3:$4"
  );

  let i2 = i1.replace(/­/gm, "");
  // let i2 = i1
  // Bỏ . ở cuối hàng trong Điều

  // let i2 = i1.replace(/^(\s)*(.*)/gm, "$2");
  // đề phòng có khoảng trống đầu hàng, cut it

  // let i3 = i2.replace(/^\n+/gm, "");
  // // bỏ khoảng trống giữa các row

  let i3 = i2.replace(/(?<=^Chương (V|I|X|\d)*)\./gim, "");

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

  let i7 = i6.replace(/\u00A0/gim, " ");

  // let i8 =i7.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,' ')

  let i8;
  let i8a = []; // kết nối "Phần thứ với nội dung "phần thứ ...", trường hợp bị tách 2 hàng

  for (let c = 0; c < 5; c++) {
    if (!c) {
      i8a[c] = i7.replace(
        /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        ": "
      );
    } else {
      i8a[c] = i8a[c - 1].replace(
        /(?<=^(Phần|PHẦN)\s(THỨ|I|l|1).*)\n(?!(((Điều|Ðiều|Điều) \d.*)|(chương (V|I|X|\d).*$.*)))/gim,
        " "
      );
    }
  }
  i8 = i8a[4];

  let i9 = i8.replace(/(?<=^(Phần|PHẦN)\s(THỨ|I|l|\d)+[^\.]*)\./im, ""); // bỏ dấu chấm cuối chữ phần thứ ...

  let i10;
  let i10a = []; // kết nối "chương với nội dung "chương ...", trường hợp bị tách 2 hàng

  for (let c = 0; c < initial; c++) {
    if (!c) {
      i10a[c] = i9.replace(
        /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
        ": "
      );
    } else {
      i10a[c] = i10a[c - 1].replace(
        /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
        " "
      );
    }
  }

  i10 = i10a[initial - 1];
  i10 = i10.replace(/(?<=^Chương (V|I|X|\d)*) /gim, ": ");

  // let i10 = i9.replace(/(?<=\w)\/(?=\w)/gim, "\\"); // loại dấu division spla sh bằng dấu \
  // let i10 = i9

  contentText = i10;
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

      allArticle[a] = RemoveNoOrder(allArticle[a]);

      let countArticle = allArticle[a].length;

      for (let b = 0; b < countArticle; b++) {
        let TemRexgexArticleA = allArticle[a][b];

        TemRexgexArticleA = allArticle[a][b].replace(/\\/gm, "\\\\");
        TemRexgexArticleA = TemRexgexArticleA.replace(/\(/gim, "\\(");
        TemRexgexArticleA = TemRexgexArticleA.replace(/\)/gim, "\\)");
        TemRexgexArticleA = TemRexgexArticleA.replace(/\./gim, "\\.");

        if (b < countArticle - 1) {
          let TemRexgexArticleB = allArticle[a][b + 1];

          TemRexgexArticleB = allArticle[a][b + 1].replace(/\\/gm, "\\\\");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");

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
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");

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

          articleArray = RemoveNoOrder(articleArray);
          
          for (let c = 0; c < articleArray.length; c++) {
            let TemRexgexArticleA = articleArray[c];

            TemRexgexArticleA = articleArray[c].replace(/\\/gim, "\\\\");
            TemRexgexArticleA = TemRexgexArticleA.replace(/\(/gim, "\\(");
            TemRexgexArticleA = TemRexgexArticleA.replace(/\)/gim, "\\)");
            TemRexgexArticleA = TemRexgexArticleA.replace(/\./gim, "\\.");
            if (c < articleArray.length - 1) {
              let TemRexgexArticleB = articleArray[c + 1];

              TemRexgexArticleB = articleArray[c + 1].replace(/\\/gim, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");
              let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
              let re = new RegExp(replace, "gim");
              point = ContentInEachChapter[0].match(re);
            } else {
              let TemRexgexArticleB = articleArray[c];

              TemRexgexArticleB = articleArray[c].replace(/\\/gim, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");
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

        articleArray = RemoveNoOrder(articleArray);
        for (let b = 0; b < articleArray.length; b++) {
          // lỡ mà trong 'Điều ...' có dấu ngoặc ),( thì phải thêm \),\(
          // nếu không vì khi lấy nội dung của khoản sẽ bị lỗi

          let TemRexgexArticleA = articleArray[b];

          TemRexgexArticleA = articleArray[b].replace(/\\/gim, "\\\\");
          TemRexgexArticleA = TemRexgexArticleA.replace(/\(/gim, "\\(");
          TemRexgexArticleA = TemRexgexArticleA.replace(/\)/gim, "\\)");
          TemRexgexArticleA = TemRexgexArticleA.replace(/\./gim, "\\.");
          if (b < articleArray.length - 1) {
            let TemRexgexArticleB = articleArray[b + 1];

            TemRexgexArticleB = articleArray[b + 1].replace(/\\/gim, "\\\\");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");

            let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
            let re = new RegExp(replace, "gim");
            point = ContentInEachSection[0].match(re);
          } else {
            let TemRexgexArticleB = articleArray[b];
            if (articleArray[b].match(/\(/gim)) {
              TemRexgexArticleB = articleArray[b].replace(/\\/gim, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");
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
      TemRexgexArticleA = articleArray[c].replace(/\\/gim, "\\\\");
      TemRexgexArticleA = TemRexgexArticleA.replace(/\(/gim, "\\(");
      TemRexgexArticleA = TemRexgexArticleA.replace(/\)/gim, "\\)");
      TemRexgexArticleA = TemRexgexArticleA.replace(/\./gim, "\\.");

      if (c < articleArray.length - 1) {
        let TemRexgexArticleB = articleArray[c + 1];

        TemRexgexArticleB = articleArray[c + 1].replace(/\\/gim, "\\\\");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");

        let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
        let re = new RegExp(replace, "gim");
        point = i10.match(re);
      } else {
        let TemRexgexArticleB = articleArray[c];

        if (articleArray[c].match(/\(/gim)) {
          // mới thêm sau này xem có chạy được không
          TemRexgexArticleB = articleArray[c].replace(/\\/gim, "\\\\");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gim, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gim, "\\)");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\./gim, "\\.");
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
  let yearSign = parseInt(lawInfo["lawDaySign"].getYear()) + 1900;
  let lawNumberForPush =
    lawInfo["lawNumber"] +
    (!lawInfo["lawNumber"].match(/(?<=\d\W)\d{4}/gim)
      ? "(" + yearSign + ")"
      : "");
  fetch("http://localhost:9000/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataLaw: data,
      lawInfo: lawInfo,
      lawNumber: lawNumberForPush,
      contentText,
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
  if (!URI.match(/%26page%3D/)) {
    URI = URI + "%26page%3D1";
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

    // if (currentIndex > 0) {
    //   nextURI = URI.replace(/(?<=AllURL\/).*(?=\?URL)/g, `${currentIndex - 1}`);
    // } else {
    //   let nextPage = parseInt(URI.match(/(?<=\%26page\%3D).*/gim)[0]) - 1;
    //   nextURI = URI.replace(/(?<=\%26page\%3D).*/gim, nextPage);
    //   nextURI = nextURI.replace(/(?<=AllURL\/).*(?=\?URL)/g, 19);
    // }

    window.location.href = nextURI;
  } else {
    console.log('none URI "AllURL"');
  }
}

function NaviHome() {
  window.location.href = "http://localhost:9000";
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
        lawInfo["nameSign"][0] &&
        lawInfo["roleSign"][0] &&
        lawInfo["unitPublish"].indexOf(undefined) < 0
      ) {
        if (lawInfo["lawDayActive"] >= lawInfo["lawDaySign"]) {
          if (lawInfo["roleSign"][0].match(/\s/gim).length <= 8) {
            setTimeout(() => {
              // Push();
              // NaviNext();
            }, 500);
          }
        } else {
          console.log("ngày lớn hơn");
          beep();
        }
      } else {
        console.log("Thiếu trường thông tin");
        beep();
      }
    });
}

async function findMissingYear() {
  let allLawSearchId = [];

  await fetch("../asset/lawSearch.json")
    .then((response) => response.json()) // Chuyển đổi response thành JSON
    .then((data) => {
      allLawSearchId = data;
    })
    .catch((error) => console.log("Error:", error));

  let lawIdSpecified;

  lawIdSpecified = allLawSearchId.filter((item) => item.match(/TT-BQP$/gim));

  // console.log('lawIdSpecified',lawIdSpecified);

  let b = 0;
  let lawIdSpecifiedEachYear = [];
  let yearStart = 2000;
  let yearEnd = 2024;
  let missingLaw = [];
  for (let a = yearStart; a <= yearEnd; a++) {
    lawIdSpecifiedEachYear[b] = lawIdSpecified.filter((item) =>
      item.match(new RegExp(`${a}\/TT\-BQP$`, "img"))
    );
    let maxIndex = 0;

    for (let c = 0; c < lawIdSpecifiedEachYear[b].length; c++) {
      if (
        maxIndex < parseInt(lawIdSpecifiedEachYear[b][c].match(/^\d+/gim)[0])
      ) {
        maxIndex = parseInt(lawIdSpecifiedEachYear[b][c].match(/^\d+/gim)[0]);
      }
    }
    // console.log('maxIndex',maxIndex);

    for (let c = 1; c <= maxIndex; c++) {
      let exist = false;
      for (let d = 0; d < lawIdSpecifiedEachYear[b].length; d++) {
        if (parseInt(lawIdSpecifiedEachYear[b][d].match(/^\d+/gim)[0]) == c) {
          exist = true;
          // console.log(exist);
        } else {
          //
        }
      }

      if (!exist) {
        missingLaw.push(`${c}/${a}/TT-BQP`);
      }
    }

    b++;
  }

  console.log(missingLaw);
}

///////////////////////////////////////////// for find different lawID

async function compareLaw() {
  let a = []
  let b =[]
  let c = []

  await fetch("../asset/allLawID copy.JSON")
  .then((response) => response.json()) // Chuyển đổi response thành JSON
  .then((data) => {
      a = data
  })
  .catch((error) => console.log("Error:", error));

  await fetch("../asset/allLawID.JSON")
  .then((response) => response.json()) // Chuyển đổi response thành JSON
  .then((data) => {
    for (let a = 0; a < data.length; a++) {
      b = data
    }
  })
  .catch((error) => console.log("Error:", error));

  c = b.filter(item => !a.includes(item));

  console.log(c)  
}


let allLawSearchId = [];
async function getAllLawId() {
  await fetch("../asset/LawMachine.LawSearch.json")
    .then((response) => response.json()) // Chuyển đổi response thành JSON
    .then((data) => {
      for (let a = 0; a < data.length; a++) {
        allLawSearchId[a] = data[a]["_id"];
      }
    })
    .catch((error) => console.log("Error:", error));

  console.log(allLawSearchId);
}

///////////////////////////////////////////// for Object _id : lawNameDisplay

let allLawObjectPair = {};
async function getAllLawObjectPair() {
  await fetch("../asset/LawMachine.LawContent.json")
    .then((response) => response.json()) // Chuyển đổi response thành JSON
    .then((data) => {
      for (let a = 0; a < data.length; a++) {
        if (data[a].info["lawNameDisplay"].match(/Luật/gim)) {
          allLawObjectPair[data[a].info["lawNameDisplay"].toLowerCase().replace(/( và| của|,|&)/img,'')] = data[a]._id;
          allLawObjectPair[data[a]._id.toLowerCase()] = data[a].info["lawNameDisplay"]
          // allLawObjectPair[data[a]._id] = data[a].info["lawNameDisplay"]

        } else {
          allLawObjectPair[data[a]._id.toLowerCase()] = data[a]._id;
        }

        // allLawObjectPair[data[a].info['lawNameDisplay']] =   data[a]._id
      }
    })
    .catch((error) => console.log("Error:", error));

  console.log(allLawObjectPair);
}

// let newLawObject = [];
let lawMissing = {}
async function getMissingLaw() {
  await fetch("../asset/LawMachine.LawContent.json")
    .then((response) => response.json()) // Chuyển đổi response thành JSON
    .then(async (data) => {
      await fetch("../asset/ObjectLawPair.json")
        .then((response) => response.json()) // Chuyển đổi response thành JSON
        .then((ObjectLawPair) => {
          for (let a = 0; a < data.length; a++) {
            // let newLawRelated = {};
            // newLawObject[a] = data[a];

            for (let b = 0; b < Object.keys(data[a].info["lawRelated"]).length; b++) {
              if (ObjectLawPair[Object.keys(data[a].info["lawRelated"])[b].toLowerCase().replace(/( và| của|,|&)/img,'')]) {
                // newLawRelated[Object.keys(data[a].info["lawRelated"])[b]] =
                //   ObjectLawPair[Object.keys(data[a].info["lawRelated"])[b].toLowerCase().replace(/( và| của|,|&)/img,'')];
              } else {
                // newLawRelated[Object.keys(data[a].info["lawRelated"])[b]] = 0;

if(Object.keys(data[a].info["lawRelated"])[b].match(/20(10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25)/img)
 && !Object.keys(data[a].info["lawRelated"])[b].match(/QĐ/img)
){
  if(lawMissing[data[a]._id]){
    lawMissing[data[a]._id].push(Object.keys(data[a].info["lawRelated"])[b].replace(/( và| của|,|&)/img,''))
  }else{
    lawMissing[data[a]._id] = [Object.keys(data[a].info["lawRelated"])[b].replace(/( và| của|,|&)/img,'')]
  }
}
                
              }
            }
            // newLawObject[a].info["lawRelated"] = newLawRelated;
          }
        });
    });
  
  // console.log(newLawObject);
  console.log(lawMissing);
  
}

// keytool -genkeypair -v -storetype PKCS12 -keystore android.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
