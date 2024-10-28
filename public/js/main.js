let lawInfo = {};
let dataLaw;



// function Push() {
//   let lawNumberForPush =
//     lawInfo["lawNumber"].replace(/\//gim, "\\") +
//     (lawInfo["lawNumber"].match(/VBHN/gim)
//       ? "(" + lawInfo["lawDaySign"].match(/\d+$/gim)[0] + ")"
//       : "");
//   fetch("http://localhost:5000/push", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       dataLaw: data,
//       lawInfo: lawInfo,
//       lawNumber: lawNumberForPush,
//     }),
//   })
//     .then((res) => {
//       res.text();
//       console.log("success");
//     })
//     .then((data) => console.log(123));
//   console.log(lawNumberForPush);
// }


var addendum = undefined;

async function convertInfo(kind) {
  // có thể bị lỗi:
  // nếu Lawname nhiều hơn 2 dòng
  // nếu dòng signRole có 2 dòng thì gộp 1 thôi
  // bỏ hàng cuối cùng nếu có sau tên
  // trong unitPublish chỉ cho phép cơ quan chứ không cho phép cá nhân
  // phải có chữ "ban hành"
  // đối với liên tịch phải có ./. ở cuối 

  // văn bản hợp nhất thì ghi VBHN chứ không phải NĐ hay Thông tư
  // đôi khi không nhận diện được lawKind thì cần tách Thông tư với nội dung miêu tả ra 1 dòng tách biệt

  let b = document.querySelector(".input").value;
  addendum = undefined;

  let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  let b2 = b1.replace(/\n(\S)/gim, " $1");
  if (kind == "plain") {
    b2 = b1;
  }
  b2 = b2.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  b2 = b2.replace(/\(đã ký\)/gim, "");
  
  let b3 = b2.replace(/\n+\s+$/gim, "");
  let b4 = b3.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
  let b5 = b4.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
  let b6 = b5.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
  let b7 = b6.replace(/^(nơi nhận|Nơi nhận).*/gim, "");
  let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
  let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
  b9 = b9.replace(/^(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|QUY ĐỊNH)\n(.*)/m,"$1 $2");   // biến LUẬT GÌ ĐÓ 2 DÒNG THÀNH 1 DÒNG

  let b10 = b9.replace(
    /(?<!^(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|Điều|Ðiều|Điều|Chương|CHƯƠNG|Phần thứ|PHẦN THỨ|MỤC|Mục|Mục).*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ|Mẫu số|BIỂU KHUNG).*(\n.*)*/gm,
    ""
  ); // bỏ Phụ lục,danh mục
  // b10 = b10.replace(
  //   /(?<!(Điều|Ðiều|Điều|chương|Phần thứ|Mục|Mục) (\d|II|V|X)+\:*)\n(PHỤ LỤC|PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ).*(\n.*)*/gim,
  //   ""
  // ); // bỏ Phụ lục,danh mục
  let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
  let b12 = b11.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN
  let b13 = b12.replace(/  +/gim, " "); // bỏ khoảng cách 2 space

  let lawNumberDemo = b13.match(/(?<=(.*số.*: *)).*(?=\s)/im)[0];
  let lawNumber = lawNumberDemo.replace(/ /gim, "");

  let lawKindDemo = b13.match(
    // /^(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp)$/im
    /^(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|QUY ĐỊNH)/m
  )[0];

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  let lawKind = capitalize(lawKindDemo);

  let lawDescriptionDemo = b13.match(
    /(?<=(.*(liên tịch)?(ban hành|ban hành)* .*))(luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*(?=\n(Chương|Phần|Điều))/im
  );

  if (!lawKind.match(/nghị quyết/i) && lawDescriptionDemo) {
  } else {
    lawDescriptionDemo = [
      b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
    ];
  }

  // if (lawKind.match(/nghị quyết/i)) {
  //   lawDescriptionDemo = [
  //     b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
  //   ];
  // } else if(lawNumber.match(/VBHN/igm)) {
  //   // lawDescriptionDemo = lawDescriptionDemo+`năm ${lawDaySign.match(/\d\d\d\d$/gim)[0]}`
  // }

  let lawDescription;
  let unitPublish = "";
  let roleSign = "";
  let nameSign = [];

  if (kind == "TTLT") {
    if (!lawDescriptionDemo && lawKind.match(/liên tịch/i)) {
      lawDescriptionDemo = b13.match(
        /(?<=(.* (liên tịch quy định) .*)).*(?=\n(Chương|Phần|Điều))/im
      );
    } else if (!lawKind.match(/nghị quyết/i) && lawDescriptionDemo) {
    } else {
      lawDescriptionDemo = [
        b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
      ];
    }

    lawDescription = lawDescriptionDemo
      ? lawDescriptionDemo[0].replace(/(.*)(\.\/\.|\.|\,|\;)$/im, "$1")
      : "";

    lawDescription =
      lawDescription.charAt(0).toUpperCase() + lawDescription.slice(1);
    lawDescription = lawDescription.replace(/ \(sau đây.*\)/gim, "");

    let unitPublishTrail = b13.match(
      /.*(?=( (ban hành|ban hành|ban hành) (luật|Luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*\n(Chương|Phần|Điều)))/i
    );
    if (!unitPublishTrail && lawKind.match(/liên tịch/i)) {
      unitPublishTrail = b13.match(
        /.*(?=( (liên tịch quy định).*\n(Chương|Phần|Điều)))/i
      );
    }

    if (unitPublishTrail[0].match(/ và bộ/gim)) {
      unitPublishTrail = [unitPublishTrail[0].replace(/ và bộ/gim, ", Bộ")];
    } else if (unitPublishTrail[0].match(/ và viện/gim)) {
      unitPublishTrail = [unitPublishTrail[0].replace(/ và viện/gim, ", Viện")];
    } else if (unitPublishTrail[0].match(/ và chánh/gim)) {
      unitPublishTrail = [
        unitPublishTrail[0].replace(/ và chánh/gim, ", Chánh"),
      ];
    } else if (unitPublishTrail[0].match(/ và văn/gim)) {
      unitPublishTrail = [unitPublishTrail[0].replace(/ và văn/gim, ", Văn")];
    } else if (unitPublishTrail[0].match(/ và thống/gim)) {
      unitPublishTrail = [
        unitPublishTrail[0].replace(/ và thống/gim, ", Thống"),
      ];
    }

    if (lawNumber.match(/.*VPQH$/gim)) {
      unitPublish = ["Văn phòng Quốc hội"];
    } else if (unitPublishTrail) {
      unitPublish = unitPublishTrail[0].replace(
        /(Bộ trưởng|Bộ trưởng|viện trưởng|chánh án) /gim,
        ""
      );

      unitPublish = unitPublish.replace(/ liên tịch/gim, "");
      unitPublish = unitPublish.replace(/ thống nhất/gim, "");
      unitPublish = unitPublish.split(/\, (?!Thể)/gim);
    } else if (lawNumber.match(/.*HĐTP$/gim)) {
      unitPublish = ["Hội đồng Thẩm phán Tòa án nhân dân tối cao"];
    }


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

    roleSign = roleSignDemo;

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

    lawDescription = lawDescriptionDemo
      ? lawDescriptionDemo[0].replace(/(.*)(\.\/\.|\.|\,|\;)$/im, "$1") // bỏ mấy dấu sau cùng
      : "";
    lawDescription = lawDescription.replace(/ \(sau đây.*\)/gim, "");

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

    let unitPublishTrail = b13.match(
      /.*(?=( (ban hành|ban hành|ban hành) (luật|Luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*\n(Chương|Phần|Điều)))/i
    );

    unitPublishTrail = unitPublishTrail
      ? unitPublishTrail[0].replace(/theo đề nghị[^;]+/gim, "")
      : "";
    unitPublishTrail = unitPublishTrail
      ? unitPublishTrail.replace(/Căn cứ Hiến pháp[^(;|\n)]+/gim, "")
      : "";
    unitPublishTrail = unitPublishTrail
      ? unitPublishTrail.replace(/; */gim, "")
      : "";

    let Role = roleSign.replace(/ +phó+ /gim, "");
    let replaceRole = `${Role} `;
    let reRole = new RegExp(replaceRole, "gim");
    let unitPublishTrail1 = unitPublishTrail
      ? unitPublishTrail.replace(reRole, "")
      : roleSign.match(/chánh án/i)
      ? "Tòa án nhân dân tối cao"
      : "";
    unitPublish = unitPublishTrail1.replace(/(Bộ trưởng|Bộ trưởng) /gim, "");
    if (lawNumber.match(/.*VPQH$/gim)) {
      // let Role = roleSign.replace(/ +phó+ /gim, "");
      // let replaceRole = `${Role} `;
      // let reRole = new RegExp(replaceRole, "gim");
      // let unitPublishTrail1 = unitPublishTrail?unitPublishTrail[0].replace(reRole, ""):roleSign.match(/chánh án/i)?'Tòa án nhân dân tối cao':'';
      // console.log('p',p);
      unitPublish = ["Văn phòng Quốc hội"];
    } else if (lawNumber.match(/.*HĐTP$/gim)) {
      unitPublish = ["Hội đồng Thẩm phán Tòa án nhân dân tối cao"];
    }else{
      unitPublish = [unitPublish]
    }

    nameSign = b13.match(/.*$/);
  }

  //   let nameSign = b13.match(/.*$/)[0];

  let lawDaySignDemo = b13.match(/ngày *(\d)* *tháng *(\d)* *năm *(\d)*$/im);
  let RemoveDay = lawDaySignDemo[0].replace(/ngày */im, "");
  let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
  let lawDaySign = RemoveMonth.replace(/ *năm */im, "/");

  let lawDayActive;
  if (b13.match(/(?<=^Điều \d.*\n.*có hiệu lực[^;]+)ngày *\d* *tháng *\d* *năm *\d*/im)) {
    let lawDayActiveDemo = b13.match(
      /(?<=^Điều \d.*\n.*có hiệu lực[^;]+)ngày *\d* *tháng *\d* *năm *\d*/im
    )[0];
    let RemoveDay = lawDayActiveDemo.replace(/ngày */im, "");
    let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
    lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
  } else if (b13.match(/(?<=^Điều \d.*\n.*có hiệu lực[^;]+)sau \d* ngày/im)) {
    lawDayActive = b13.match(/(?<=^Điều \d.*\n.*có hiệu lực[^;]+)sau \d* ngày[^.]+/im)[0];
  } else if (b13.match(/có hiệu lực.*từ ngày k/im)) {
    lawDayActive = lawDaySign;
  } else {
    lawDayActive = null;
  }
  
  // CHÍNH PHỦ -------
  // CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM Độc lập - Tự do - Hạnh phúc ---------------
  // Số: 44/2016/NĐ-CP
  // Hà Nội, ngày 15 tháng 5 năm 2016
  // NGHỊ ĐỊNH QUY ĐỊNH CHI TIẾT MỘT SỐ ĐIỀU CỦA LUẬT AN TOÀN, VỆ SINH LAO ĐỘNG VỀ HOẠT ĐỘNG KIỂM ĐỊNH KỸ THUẬT AN TOÀN LAO ĐỘNG, HUẤN LUYỆN AN TOÀN, VỆ SINH LAO ĐỘNG VÀ QUAN TRẮC MÔI TRƯỜNG LAO ĐỘNG
  // Căn cứ Luật tổ chức Chính phủ ngày 19 tháng 6 năm 2015;
  // Căn cứ Luật an toàn, vệ sinh lao động ngày 25 tháng 6 năm 2015;
  // Theo đề nghị của Bộ trưởng Bộ Lao động - Thương binh và Xã hội;
  // Chính phủ quy định chi tiết một số điều của Luật an toàn, vệ sinh lao động về hoạt động kiểm định kỹ thuật an toàn lao động, huấn luyện an toàn, vệ sinh lao động và quan trắc môi trường lao động.
  // Chương I
  // QUY ĐỊNH CHUNG
  // Điều 1. Phạm vi điều chỉnh
  // Nghị định này quy định chi tiết một số điều của Luật an toàn, vệ sinh lao động về hoạt động kiểm định kỹ thuật an toàn lao động; huấn luyện an toàn, vệ sinh lao động và quan trắc môi trường lao động.
  // Điều 2. Đối tượng áp dụng
  // 1. Người sử dụng lao động, người lao động theo quy định tại Điều 2 Luật an toàn, vệ sinh lao động.
  // 2. Đơn vị sự nghiệp, doanh nghiệp và các tổ chức, cá nhân khác có liên quan đến hoạt động kiểm định kỹ thuật an toàn lao động; huấn luyện an toàn, vệ sinh lao động và quan trắc môi trường lao động.
  // Điều 3. Giải thích từ ngữ
  // Trong Nghị định này, các từ ngữ dưới đây được hiểu như sau:
  // 1. Đối tượng kiểm định là máy, thiết bị, vật tư có yêu cầu nghiêm ngặt về an toàn lao động thuộc Danh mục do Bộ Lao động - Thương binh và Xã hội ban hành.
  // 2. Người huấn luyện cơ hữu là người huấn luyện an toàn, vệ sinh




  // if (b13.match(new RegExp(`(?<=${lawKind}.*có hiệu lực (.){0,30})ngày *\d* *tháng *\d* *năm *\d*`,'im'))) {
  //   let lawDayActiveDemo = b13.match(
  //     new RegExp(`(?<=${lawKind}.*có hiệu lực (.){0,30})ngày *\d* *tháng *\d* *năm *\d*`,'im')
  //   )[0];
  //   let RemoveDay = lawDayActiveDemo.replace(/ngày */im, "");
  //   let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
  //   lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
  //   console.log(1);
    
  // } else if (b13.match(new RegExp(`(?<=${lawKind}.*có hiệu lực (.){0,30})sau \d* ngày`,'im'))) {
  //   console.log(2);
  //   lawDayActive = b13.match(new RegExp(`(?<=${lawKind}.*có hiệu lực (.){0,30})sau \d* ngày[^.]+`,'im'))
  // } else if (b13.match(new RegExp(`(?<=${lawKind}.*có hiệu lực (.){0,30}).*từ ngày k`,'im'))) {
  //   console.log(3);
  //   lawDayActive = lawDaySign;
  // } else {
  //   console.log(4);
  //   lawDayActive = null;
  // }


  let lawNameDisplay;
  let lawNumberDisplay = lawNumber.replace(/\\/gim, "/");
  if (lawNumber.match(/VBHN/gim)) {
    lawNameDisplay =
      "Văn bản hợp nhất số " +
      lawNumberDisplay +
      " năm " +
      lawDaySign.match(/\d\d\d\d$/gim)[0];
  } else if (lawDescription.match(/^(luật|bộ luật).*/gim)) {
    lawNameDisplay = `${lawKind.toUpperCase()} ${
      b13.match(
        /(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|QUY ĐỊNH) )[^\n]+/
      )[0]
    } NĂM ${lawDaySign.match(/\d\d\d\d$/gim)[0]}`;

    lawNameDisplay = lawNameDisplay.toUpperCase()
    lawNameDisplay = lawNameDisplay.replace(/ số \d+[^( |,)]+/igm,'')
    lawNameDisplay = lawNameDisplay.replace(/ ngày \d+\/\d+\/\d+/igm,'')
    lawNameDisplay = lawNameDisplay.replace(/ ngày \d+ *\d+ *\d+/igm,'')
    lawNameDisplay = lawNameDisplay.replace(/ (ngày|ngày) *\d+ *(tháng|tháng) *\d+/igm,'')

  } else {
    lawNameDisplay = `${lawKind} số ${lawNumberDisplay}`;
  }

  let lawRelatedDemo = b13.match(
    /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\})]+/gi
  );
  let lawRelatedDemo2 = lawRelatedDemo
    ? lawRelatedDemo.map(function (item) {
        return item.replace(/ */g, "");
      })
    : [];
  // if (b13.match(/(?<=(căn cứ |; |và ))(luật|bộ luật)[^ số][^;]+năm \d+ (?=((và luật sửa đổi)|;))/gi)) {
  if (b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)) {
    for (
      let y = 0;
      y < b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi).length;
      y++
    ) {
      if (
        !b13
          .match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)
          [y].match(/(?<=năm \d+) và (?=luật sửa)/gi)
      ) {
        let lawRelatedString = b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)[y].replace(/ số \d+[^( |,)]+/igm,'')
        lawRelatedString = lawRelatedString.replace(/ ngày \d+\/\d+\/\d+/igm,'')
        lawRelatedString = lawRelatedString.replace(/ ngày \d+ *\d+ *\d+/igm,'')
        lawRelatedString = lawRelatedString.replace(/ (ngày|ngày) *\d+ *(tháng|tháng) *\d+/igm,'')

        lawRelatedDemo2 = [
          ...lawRelatedDemo2,
          lawRelatedString,
        ];
      } else {
        let lawRelatedString = b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^(;|\n)]+năm \d+/gi)[y].replace(/ số \d+[^( |,)]+/igm,'')
        lawRelatedString = lawRelatedString.replace(/ ngày \d+\/\d+\/\d+/igm,'')
        lawRelatedString = lawRelatedString.replace(/ ngày \d+ *\d+ *\d+/igm,'')
        lawRelatedString = lawRelatedString.replace(/ (ngày|ngày) *\d+ *(tháng|tháng) *\d+/igm,'')
        lawRelatedDemo2 = [
          ...lawRelatedDemo2,
          ...lawRelatedString.split(/(?<=năm \d+) và (?=luật sửa)/gi),
        ];
      }
    }
  }
  if (b13.match(/(?<=(căn cứ |; |vào ))(hiến pháp)[^(;|\n)]+/gi)) {
    // let lawRelatedString = b13.match(/(?<=(căn cứ |; |vào ))(hiến pháp)[^;]+/gi).replace(/ số \d+[^( |,)]+/igm,'')
    // lawRelatedString = lawRelatedString.replace(/ ngày \d+\/\d+\/\d+/igm,'')
    
lawRelatedDemo2 = [
      ...lawRelatedDemo2,
      ...b13.match(/(?<=(căn cứ |; |vào ))(hiến pháp)[^(;|\n)]+/gi),
    ];
  }
  lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
    return item.replace(/ ngày ?\d+ ?tháng ?\d+/gim, "");
  });

  function uniqueArray(orinalArray) {
    let noDuplicate = orinalArray.filter((elem, position, arr) => {
      
      return arr.indexOf(elem) == position && elem != lawNumber;
    });

    let removeDayMonth = noDuplicate.map((value, index) => {
      return value.replace(/ngày.*tháng.*(?=năm)/gim, "");
    });

    return removeDayMonth;
  }
  let lawRelated = uniqueArray(lawRelatedDemo2);

  // let nameSign = []
  // if(kind=='TTLT'){

  //   let representative= a0.match(/(?<=TM\. ?)\w+.*/gim);
  //   if(ppArray){
  //     for(let g=0;g<ppArray.length;g++){

  //       nameSign.push(a0.match(new RegExp(`.*(?=(\n.*){${(ppArray.length-1-g)*2}}$)`, "g"))[0])
  //     }
  //   }else if(representative){
  //     for(let g=0;g<representative.length;g++){

  //       nameSign.push(a0.match(new RegExp(`.*(?=(\n.*){${(representative.length-1-g)*2}}$)`, "g"))[0])
  //     }
  //   }else{
  //     nameSign = a0.match(/.*$/);
  //   }

  // }else{
  //   nameSign = b13.match(/.*$/)[0];

  // }

  let b14;
  if (lawKind.match(/nghị quyết/i)) {
    b14 = b13.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, ""); // bỏ phần đầu
  } else {
    b14 = b13.replace(
      /^(.*\n)*.*(ban hành|ban hành).*\n(?=(Chương (I|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
      ""
    ); // bỏ phần đầu
  }
  let b15 = b14;
  if (kind == "TTLT") {
    b15 = b14.replace(/(?<=.*\.\/\.)(\n.*)*/gim, ""); // bỏ tất cả sau ./.
  } else {
    if(b14.match(/(?<=.*\.\/\.)(\n.*)*/gim)){
      b15 = b14.replace(/(?<=.*\.\/\.)(\n.*)*/gim, ""); //  bỏ tất cả sau ./.
    }else{
      b15 = b14.match(/(.*\n)*(?=.*\n.*$)/gim)[0]; // bỏ 2 hàng cuối

    }
  }
  b15 = b15.replace(/\.+\/+\.*/gim,'')   // bỏ ./. ở sau cùng
  let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối

  lawInfo["lawDescription"] = lawDescription;
  lawInfo["lawNumber"] = lawNumber;
  lawInfo["unitPublish"] = unitPublish;
  lawInfo["lawKind"] = lawKind;
  lawInfo["lawDaySign"] = lawDaySign;
  lawInfo["lawDayActive"] = lawDayActive;
  lawInfo["lawNameDisplay"] = lawNameDisplay;
  lawInfo["lawRelated"] = lawRelated;
  lawInfo["nameSign"] = nameSign;

  if (kind == "TTLT") {
    lawInfo["roleSign"] = roleSign;
  } else {
    if (roleSign.match(/phó thủ tướng/gim)) {
      lawInfo["roleSign"] = ["Phó Thủ Tướng"];
    } else if (
      roleSign.match(/quyền thủ tướng/gim) ||
      roleSign.match(/q.* thủ tướng/gim)
    ) {
      lawInfo["roleSign"] = ["Quyền Thủ Tướng"];
    } else if (roleSign.match(/thủ tướng|thủ tướng|thủ tướng/gim)) {
      lawInfo["roleSign"] = ["Thủ Tướng"];
    } else {
      lawInfo["roleSign"] = [roleSign];
    }
  }

  // console.log(JSON.stringify(lawInfo))
  console.log('lawDescription',lawInfo['lawDescription']);
  console.log('lawNumber',lawInfo['lawNumber']);
  console.log('lawKind',lawInfo['lawKind']);
  console.log('lawDaySign',lawInfo['lawDaySign']);
  console.log('lawDayActive',lawInfo['lawDayActive']);
  console.log('lawNameDisplay',lawInfo['lawNameDisplay']);
  console.log('lawRelated',lawInfo['lawRelated']);
  console.log('unitPublish',lawInfo['unitPublish']);
  console.log('nameSign',lawInfo['nameSign']);
  console.log('roleSign',lawInfo['roleSign']);
  
  document.querySelector(".output").value = b16;
  return { lawInfo, addendum };
}



let data = [];
async function convertContent(addendumA) {
  data = [];

  function getByteLengthUTF8(section, str) {
    // Chuyển chuỗi thành một mảng các byte bằng mã hóa UTF-8
    const encoder = new TextEncoder();
    const encodedStr = encoder.encode(str);
    if (encodedStr.length > 300) {
      console.log("lớn hơn 300 bytes");
      console.log(encodedStr.length, str);
    }
  }

  let input = document.querySelector(".output").value;

  let i0 = input.replace(/^(Điều|Ðiều|Điều) (\d+\w?)\.(.*)/gim, "Điều $2:$3");
  // điều . thành điều:

  let i0a = i0.replace(/^(Điều|Ðiều|Điều) (\d+\w?)\.(.*)/gim, "Điều $2:$3");

  let i1 = i0a.replace(/^(Điều|Ðiều|Điều) (.*)\./gim, "Điều $2");
  // Bỏ . ở cuối hàng trong Điều

  let i2 = i1.replace(/^(\s)*(.*)/gm, "$2");
  // đề phòng có khoảng trống đầu hàng, cut it

  let i3 = i2.replace(/^\n+/gm, "");
  // bỏ khoảng trống giữa các row

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

  let i7;

  let i7a = [];

  for (let b = 0; b < initial; b++) {
    if (!b) {
      i7a[b] = i6.replace(
        /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
        ": "
      );
    } else {
      i7a[b] = i7a[b - 1].replace(
        /(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim,
        " "
      );
    }
  }

  i7 = i7a[initial - 1];

  let i8 = i7.replace(/^Chương (.*)\./gim, "Chương $1"); // bỏ dấu chấm sau chương

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

  let i10 = i9.replace(/(?<=\w)\/(?=\w)/gim, "\\"); // loại dấu division spla sh bằng dấu \

  document.querySelector(".output").value = i10;

  if (i10.match(/^CHƯƠNG.*/i)) {
    // nếu có chương ...

    let chapterArray; // lấy riêng lẻ từng chương thành 1 array
    if (i10.match(/^Chương (V|I|X|\d).*$/gim)) {
      chapterArray = i10.match(/^Chương (V|I|X|\d).*$/gim);
    } else {
      chapterArray = null;
    }
    // console.log('chapterArray',chapterArray);

    let articleArray; // lấy khoảng giữa các chương
    let allArticle = []; // lấy riêng lẻ các điều
    let point = [];
    let d = -1;
    for (var a = 0; a < chapterArray.length; a++) {
      articleArray = [];

      if (a < chapterArray.length - 1) {
        let chapterArrayA = chapterArray[a].replace(/\(/gim, "\\(");
        chapterArrayA = chapterArrayA.replace(/\)/gim, "\\)");
        chapterArrayA = chapterArrayA.replace(/\\/gim, "\\\\");

        let chapterArrayB = chapterArray[a + 1].replace(/\(/gim, "\\(");
        chapterArrayB = chapterArrayB.replace(/\)/gim, "\\)");
        chapterArrayB = chapterArrayB.replace(/\\/gim, "\\\\");

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

      // console.log('articleArray',articleArray);

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
          getByteLengthUTF8("điều", allArticle[a][b]);
          getByteLengthUTF8("chương", chapterArray[a]);
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

            if (c < articleArray.length - 1) {
              let TemRexgexArticleB = articleArray[c + 1];

              TemRexgexArticleB = articleArray[c + 1].replace(/\\/gm, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");

              let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
              let re = new RegExp(replace, "gim");
              point = ContentInEachChapter[0].match(re);
            } else {
              let TemRexgexArticleB = articleArray[c];

              TemRexgexArticleB = articleArray[c].replace(/\\/gm, "\\\\");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");

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
            getByteLengthUTF8("điều", articleArray[c]);
            getByteLengthUTF8("chương", chapterArray[b]);
            getByteLengthUTF8("phần", sectionArray[a]);
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

          if (b < articleArray.length - 1) {
            let TemRexgexArticleB = articleArray[b + 1];

            TemRexgexArticleB = articleArray[b + 1].replace(/\\/gm, "\\\\");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
            TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");

            let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
            let re = new RegExp(replace, "gim");
            point = ContentInEachSection[0].match(re);
          } else {
            let TemRexgexArticleB = articleArray[b];
            if (articleArray[b].match(/\(/gim)) {
              TemRexgexArticleB = articleArray[b].replace(/\(/, "\\(");
              TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
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

      if (c < articleArray.length - 1) {
        let TemRexgexArticleB = articleArray[c + 1];

        TemRexgexArticleB = articleArray[c + 1].replace(/\\/gm, "\\\\");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\(/gm, "\\(");
        TemRexgexArticleB = TemRexgexArticleB.replace(/\)/gm, "\\)");

        let replace = `(?<=${TemRexgexArticleA}\n)(.*\n)*(?=${TemRexgexArticleB})`;
        let re = new RegExp(replace, "gim");
        point = i10.match(re);
      } else {
        let TemRexgexArticleB = articleArray[c];

        if (articleArray[c].match(/\(/gim)) {
          // mới thêm sau này xem có chạy được không
          TemRexgexArticleB = articleArray[c].replace(/\(/, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");
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

  if (addendumA == null) {
    addendumA = addendum;
  }

  let u = {};
  if (addendumA) {
    addendumString = addendumA[0];
    let betweenAddendum;
    let addendumArray = addendumString.match(
      /^(PHỤ LỤC|PHỤ LỤC|Phụ lục) *(V|I|X|\d)*(.*)$/gm
    );
    // let addendumArray = addendumString.match(/^(PHỤ LỤC|Phụ lục|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ) *(V|I|X|\d)*(.*)$/gm);

    for (let a = 0; a < addendumArray.length; a++) {
      let TemRexgexAddendumA = addendumArray[a];
      TemRexgexAddendumA = addendumArray[a].replace(/\\/gm, "\\\\");
      TemRexgexAddendumA = TemRexgexAddendumA.replace(/\(/gm, "\\(");
      TemRexgexAddendumA = TemRexgexAddendumA.replace(/\)/gm, "\\)");

      if (a < addendumArray.length - 1) {
        let TemRexgexAddendumB = addendumArray[a + 1];

        TemRexgexAddendumB = addendumArray[a + 1].replace(/\\/gm, "\\\\");
        TemRexgexAddendumB = TemRexgexAddendumB.replace(/\(/gm, "\\(");
        TemRexgexAddendumB = TemRexgexAddendumB.replace(/\)/gm, "\\)");

        let replace = `(?<=${TemRexgexAddendumA}\n)(.*\n)*(?=${TemRexgexAddendumB})`;
        let re = new RegExp(replace, "gim");
        betweenAddendum = addendumString.match(re);

        let betweenAddendumArray = betweenAddendum[0].match(/.+/gi);

        u[addendumArray[a]] = betweenAddendumArray;
        data.push({ [addendumArray[a]]: betweenAddendumArray });
      } else {
        let TemRexgexAddendumB = addendumArray[a];

        if (addendumArray[a].match(/\(/gim)) {
          TemRexgexAddendumB = addendumArray[a].replace(/\(/, "\\(");
          TemRexgexAddendumB = TemRexgexAddendumB.replace(/\)/, "\\)");
        }
        let replace = `(?<=${TemRexgexAddendumB}\n)(.*\n)*.*$`;
        let re = new RegExp(replace, "gim");
        betweenAddendum = addendumString.match(re);

        let betweenAddendumArray = betweenAddendum[0].match(/.+/gi);

        u[addendumArray[a]] = betweenAddendumArray;
        data.push({ [addendumArray[a]]: betweenAddendumArray });
      }
    }
  }
  console.table("data", (data));
  return data

}

function Push() {
  let lawNumberForPush =
    lawInfo["lawNumber"].replace(/\//gim, "\\") +
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
    }),
  })
    .then((res) => {
      res.text();
      console.log("success");
    })
    .then((data) => console.log(123));
  console.log(lawNumberForPush);
}

async function Compare() {  // so sánh có law nào thiếu hay thừa ở LawContent và LawInfo không
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
              key1.replace(/(\,| và| tại| của)/img,'').match(
                new RegExp(`${keyValInfo[Object.keys(keyValInfo)[a]].replace(/(\,| và| tại| của)/img,'')}`, "img")
              )
            ) {
              infoLaw[key]["lawRelated"][i1] = Object.keys(keyValInfo)[a];
              lawHaved = Object.keys(keyValInfo)[a];
              // console.log(Object.keys(keyValInfo)[a]);

              break;
            } else {
              noLawHaved= `${key1}:${key}`
              // console.log('Luật chưa có',key1);
            }
          }

          if (lawHaved) {
            // console.log("lawHaved", lawHaved);
          } else {
            console.log('noLawHaved',noLawHaved);
          }
        } else {
          // console.log('VB chưa có',key1);
        }
      });
    }
  });

  console.log("infoLaw", infoLaw);

  // fetch("http://localhost:5000/push1", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     lawInfo: infoLaw,
  //   }),
  // })

}

async function findMissingField() {   // tìm các trường thông tin mà không có trong 1 bộ tiêu chuẩn
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

async function getLawNoExist() {    // các luật nào nếu đã có link (đã tồn tại) thì sẽ không xuất hiện dưới dạng chữ mà chỉ xuất hiện dưới dạng LawNumber 
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
            console.log('Luật chính có lawRelated thiếu',key);
            noExistLaw.push(key);
          // }
          // }
        }
      });
    }
  });

  console.log("noExistLaw", noExistLaw);
}


async function findError(pass) {      // tìm các trường bị sai thông tin VD như nhầm RoleSign thành các 1 dòng nào đó dài 
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
      if(Array.isArray(infoLaw[key][pass])){
      infoLaw[key][pass].map((key1, i1) => {
        console.log(key);
        
          if (key1.match(/ /gim).length> 8) {
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






function DeleteAddendum() {
  let b = document.querySelector(".output").value;

  b = b.replace(
    /^(PHỤ LỤC|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY|BIỂU THUẾ|ĐIỀU LỆ).*(\n.*)*/gim,
    ""
  );
  document.querySelector(".output").value = b;
}

function NaviNext() {
  let URI = window.location.href;
  if (URI.match(/(?<=AllURL\/).*(?=\?URL)/g)) {
    let currentIndex = parseInt(URI.match(/(?<=AllURL\/).*(?=\?URL)/g)[0]);
    let nextURI;
    if(URI.match(/%26sort%3D1%26lan%3D1%26scan%3D0%26org%3D0%26fields%3D%26page%3D/gim)){

    }else{
      URI = URI+'%26sort%3D1%26lan%3D1%26scan%3D0%26org%3D0%26fields%3D%26page%3D1'
    }
    if (currentIndex < 19) {
      nextURI = URI.replace(/(?<=AllURL\/).*(?=\?URL)/g, `${currentIndex + 1}`);
    } else {
      let nextPage = parseInt(URI.match(/(?<=\%26page\%3D).*/gim)[0]) + 1;
      nextURI = URI.replace(/(?<=\%26page\%3D).*/gim, nextPage);
      nextURI = nextURI.replace(
        /(?<=AllURL\/).*(?=\?URL)/g,
        // %26sort%3D1%26lan%3D1%26scan%3D0%26org%3D0%26fields%3D%26page%3D9
        0
      );
      
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
  document.querySelector(".input").focus();
  document.querySelector(".input").setSelectionRange(0, 0);
}

function goToEndInput() {
  document.querySelector(".input").focus();
  document
    .querySelector(".input")
    .setSelectionRange(
      document.querySelector(".input").value.length,
      document.querySelector(".input").value.length
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
  .then((t) =>{goToEndInput(),goToEndOutput(), convertContent(false)})
  .then(r=>{    Push(); NaviNext()
  })
}

// function convertPlainText() {
//   // có thể bị lỗi:
//   // nếu Lawname nhiều hơn 2 dòng
//   // nếu dòng signRole có 2 dòng thì gộp 1 thôi
//   // bỏ hàng cuối cùng nếu có sau tên
//   // trong unitPublish chỉ cho phép cơ quan chứ không cho phép cá nhân

//   // văn bản hợp nhất thì ghi VBHN chứ không phải NĐ hay Thông tư
//   // đôi khi không nhận diện được lawKind thì cần tách Thông tư với nội dung miêu tả ra 1 dòng tách biệt

//   let b = document.querySelector(".input").value;
//   addendum = undefined
//   let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
//   // let b2 = b1.replace(/\n(\S)/gim, " $1"); // nối các dòng lại vơi nhau (do TextContent tự xuống)
//   let b2 = b1; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// chỉ khách nhau ở điểm này thôi
//   b2 = b2.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
//   b2 = b2.replace(/\(đã ký\)/gim,""); // bỏ các space ở đầu mỗi dòng
//   let b3 = b2.replace(/^nơi nhận.*/gim, "");
//   let b4 = b3.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
//   let b5 = b4.replace(/\n(PHỤ LỤC|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY).*(\n.*)*/gm, ""); // bỏ Phụ lục
//   let b6 = b5.replace(/\n+\s+$/gim, "");
//   let b7 = b6.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
//   let b8 = b7.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
//   let b9 = b8.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
//   let b10 = b9.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ space, xuống dòng ở cuối
//   let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
//   let b12 = b11.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN
//   let b13 = b12.replace(/  +/gim," "); // bỏ khoảng cách 2 space

//   let lawKindDemo = b13.match(
//     /^(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp)$/im
//   )[0];

//   function capitalize(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   }
//   let lawKind = capitalize(lawKindDemo);

//   let lawDescriptionDemo = b13.match(
//     /(?<=(.* (ban hành|ban hành) .*))(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp).*(?=\n(Chương|Phần|Điều))/im
//   );

//   if (!lawKind.match(/nghị quyết/i) && lawDescriptionDemo) {
//   } else {
//     lawDescriptionDemo = [
//       b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
//     ];

//     // lawDescriptionDemo = b13.replace(
//     //   /(NGHỊ QUYẾT)\n(.*)/im,'$1 $2'
//     // )[0];
//   }

//   let lawDescription = lawDescriptionDemo
//     ? lawDescriptionDemo[0].replace(/(.*)(\.\/\.|\.|\,|\;)$/im, "$1")
//     : [];

//   let lawNumberDemo = b13.match(/(?<=(.*số.*: *)).*(?=\s)/im)[0]; // mới thêm
//   let lawNumber = lawNumberDemo.replace(/ /gim, "");

//   let roleSignDemo = b13.match(/.*(?=\n.*$)/)[0].toLowerCase();
//   roleSignDemo = roleSignDemo.charAt(0).toUpperCase() + roleSignDemo.slice(1);
//   let roleSign = roleSignDemo;
//   if (roleSign.match(/chính/gim)) {
//     roleSign = roleSignDemo.replace(/chính/gim, "Chính");
//   } else if (roleSign.match(/quốc/gim)) {
//     roleSign = roleSignDemo.replace(/quốc/gim, "Quốc");
//   } else if (roleSignDemo.match(/thủ/gim)) {
//     roleSign = roleSignDemo.replace(/thủ/gim, "Thủ");
//   } else if (roleSignDemo.match(/phó chánh án/gim)) {
//     roleSign = "Phó Chánh án Tòa án nhân dân tối cao";
//   } else if (roleSignDemo.match(/chánh án/gim)) {
//     roleSign = "Chánh án Tòa án nhân dân tối cao";
//   }

//   let unitPublishTrail = b13.match(
//     /.*(?=( (ban hành|ban hành) (luật|Luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp).*\n(Chương|Phần|Điều)))/i
//   );
//   let Role = roleSign.replace(/ +phó+ /gim, "");
//   let replaceRole = `${Role} `;
//   let reRole = new RegExp(replaceRole, "gim");
//   let unitPublishTrail1 = unitPublishTrail
//     ? unitPublishTrail[0].replace(reRole, "")
//     : roleSign.match(/chánh án/i)
//     ? "Tòa án nhân dân tối cao"
//     : "";
//   let unitPublish = unitPublishTrail1.replace(/(Bộ trưởng|Bộ trưởng) /gim, "");
//   // console.log(unitPublishTrail);

//   //   let nameSign = b13.match(/.*$/)[0];

//   let lawDaySignDemo = b13.match(/ngày *(\d)* *tháng *(\d)* *năm *(\d)*$/im);
//   let RemoveDay = lawDaySignDemo[0].replace(/ngày */im, "");
//   let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
//   let lawDaySign = RemoveMonth.replace(/ *năm */im, "/");

//   let lawDayActive;
//   if (b13.match(/(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im)) {
//     let lawDayActiveDemo = b13.match(
//       /(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im
//     )[0];
//     let RemoveDay = lawDayActiveDemo.replace(/ngày */im, "");
//     let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
//     lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
//   } else if (b13.match(/(?<=có hiệu lực.*)sau \d* ngày/im)) {
//     lawDayActive = b13.match(/(?<=có hiệu lực.*)sau \d* ngày[^.]+/im)[0];
//   } else if (b13.match(/có hiệu lực.*từ ngày k/im)) {
//     lawDayActive = lawDaySign;
//   } else {
//     lawDayActive = null;
//   }

//   let lawNameDisplay;
//   let lawNumberDisplay = lawNumber.replace(/\\/gim, "/");
//   if (lawNumber.match(/VBHN/gim)) {
//     lawNameDisplay = 'Văn bản hợp nhất số '+lawNumberDisplay+' năm '+lawDaySign.match(/\d\d\d\d$/gim)[0]
//   } else if(lawDescription.match(/^(luật|bộ luật).*/gim)){
//     lawNameDisplay = `${lawKind.toUpperCase()} ${b13.match(/(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|QUY ĐỊNH)\n).*/)[0]} NĂM ${
//       lawDaySign.match(/\d\d\d\d$/gim)[0]
//     }`;

//   }else {
//     lawNameDisplay = `${lawKind} số ${lawNumberDisplay}`;
//   }

//   let lawRelatedDemo = b13.match(
//     /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\})]+/gi
//   );
//   let lawRelatedDemo2 = lawRelatedDemo.map(function (item) {
//     return item.replace(/ */g, "");
//   });
//   if (b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)) {

//     for(let y=0;y<b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi).length;y++){

//       if(!b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y].match(/(?<=năm \d+) và (?=luật sửa)/gi)){
//         lawRelatedDemo2 = [
//           ...lawRelatedDemo2,
//           b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y],
//         ];
//       }else{
//         lawRelatedDemo2 = [
//           ...lawRelatedDemo2,
//           ...b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y].split(/(?<=năm \d+) và (?=luật sửa)/gi),
//         ];
//       }

//     }
// }
// if (b13.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]+năm \d+/gi)) {
//   lawRelatedDemo2 = [
//     ...lawRelatedDemo2,
//     ...b13.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]+năm \d+/gi),
//   ];
// }
// lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
//     return item.replace(/ ngày ?\d+ ?tháng ?\d+/gim, "");
//   });

//   function uniqueArray(orinalArray) {
//     return orinalArray.filter((elem, position, arr) => {
//       // console.log(elem == lawNumber);
//       // console.log('lawNumber',lawNumber);

//       return arr.indexOf(elem) == position && elem != lawNumber;
//     });
//   }
//   let lawRelated = uniqueArray(lawRelatedDemo2);

//   let nameSign = b13.match(/.*$/)[0];

//   let b14;
//   if (lawKind.match(/nghị quyết/i)) {
//     b14 = b13.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, ""); // bỏ phần đầu
//   } else {
//     b14 = b13.replace(
//       /^(.*\n)*.*(ban hành|ban hành).*\n(?=(Chương (I|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
//       ""
//     ); // bỏ phần đầu
//   }

//   let b15 = b14.match(/(.*\n)*(?=.*\n.*$)/gim)[0]; // bỏ 2 hàng cuối
//   let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối

//   lawInfo["lawDescription"] = lawDescription;
//   lawInfo["lawNumber"] = lawNumber;
//   lawInfo["unitPublish"] = [unitPublish];
//   lawInfo["lawKind"] = lawKind;
//   lawInfo["lawDaySign"] = lawDaySign;
//   lawInfo["lawDayActive"] = lawDayActive;
//   lawInfo["lawNameDisplay"] = lawNameDisplay;
//   lawInfo["lawRelated"] = lawRelated;

//   if (roleSign.match(/phó thủ tướng/gim)) {
//     lawInfo["roleSign"] = ["Phó Thủ Tướng"];
//   } else if (
//     roleSign.match(/quyền thủ tướng/gim) ||
//     roleSign.match(/q.* thủ tướng/gim)
//   ) {
//     lawInfo["roleSign"] = ["Quyền Thủ Tướng"];
//   } else if (roleSign.match(/thủ tướng/gim)) {
//     lawInfo["roleSign"] = ["Thủ Tướng"];
//   } else {
//     lawInfo["roleSign"] = [roleSign]
//   }

//   lawInfo["nameSign"] = [nameSign];

//   console.log(lawInfo);
//   document.querySelector(".output").value = b16;

// }

// function convertPlainText() {
//   // có thể bị lỗi:
//   // nếu Lawname nhiều hơn 2 dòng
//   // nếu dòng signRole có 2 dòng thì gộp 1 thôi
//   // bỏ hàng cuối cùng nếu có sau tên
//   // trong unitPublish chỉ cho phép cơ quan chứ không cho phép cá nhân

//   // văn bản hợp nhất thì ghi VBHN chứ không phải NĐ hay Thông tư
//   // đôi khi không nhận diện được lawKind thì cần tách Thông tư với nội dung miêu tả ra 1 dòng tách biệt

//   let b = document.querySelector(".input").value;
//   addendum = undefined

//   let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
//   // let b2 = b1.replace(/\n(\S)/gim, " $1"); // nối các dòng lại vơi nhau (do TextContent tự xuống)
//   let b2 = b1; // nối các dòng lại vơi nhau (do TextContent tự xuống)
//   b2 = b2.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
//   b2 = b2.replace(/\(đã ký\)/gim,"");
//   let b3 = b2.replace(/^nơi nhận.*/gim, "");

//   let b4 = b3.replace(/\n+\s+$/gim, "");
//   let b5 = b4.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
//   let b6 = b5.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
//   let b7 = b6.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
//   let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
//   let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
//   addendum = b9.match(/^(PHỤ LỤC|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY).*(\n.*)*/gm)
//   // console.log('addendum',addendum);
//   let b10 = b9.replace(/\n(PHỤ LỤC|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY).*(\n.*)*/gm, ""); // bỏ Phụ lục,danh mục
//   let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
//   let b12 = b11.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN
//   let b13 = b12.replace(/  +/gim," "); // bỏ khoảng cách 2 space

//   let lawNumberDemo = b13.match(/(?<=(.*số.*: *)).*(?=\s)/im)[0]; // mới thêm
//   let lawNumber = lawNumberDemo.replace(/ /gim, "");

//   let lawKindDemo = b13.match(
//     /^(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp)$/im
//   )[0];
//   function capitalize(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   }
//   let lawKind = capitalize(lawKindDemo);

//   let lawDescriptionDemo = b13.match(
//     /(?<=(.* (ban hành|ban hành|ban hành) .*))(luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp).*(?=\n(Chương|Phần|Điều))/im
//   );
//   if (!lawKind.match(/nghị quyết/i) && lawDescriptionDemo) {
//   } else {
//     lawDescriptionDemo = [
//       b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
//     ];
//   }

//   // if (lawKind.match(/nghị quyết/i)) {
//   //   lawDescriptionDemo = [
//   //     b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
//   //   ];
//   // } else if(lawNumber.match(/VBHN/igm)) {
//   //   // lawDescriptionDemo = lawDescriptionDemo+`năm ${lawDaySign.match(/\d\d\d\d$/gim)[0]}`
//   // }

//   let lawDescription = lawDescriptionDemo
//     ? lawDescriptionDemo[0].replace(/(.*)(\.\/\.|\.|\,|\;)$/im, "$1")   // bỏ mấy dấu sau cùng
//     : [];

//   let roleSignDemo = b13.match(/.*(?=\n.*$)/)[0].toLowerCase();
//   let roleSign = roleSignDemo;
//   if (roleSign.match(/chính/gim)) {
//     roleSign = roleSignDemo.replace(/chính/gim, "Chính");
//   } else if (roleSign.match(/quốc/gim)) {
//     roleSign = roleSignDemo.replace(/quốc/gim, "Quốc");
//   } else if (roleSignDemo.match(/thủ/gim)) {
//     roleSign = roleSignDemo.replace(/thủ/gim, "Thủ");
//   } else if (roleSignDemo.match(/phó chánh án/gim)) {
//     roleSign = "Phó Chánh án Tòa án nhân dân tối cao";
//   } else if (roleSignDemo.match(/chánh án/gim)) {
//     roleSign = "Chánh án Tòa án nhân dân tối cao";
//   }else if (roleSignDemo.match(/Chủ nhiệm/gim)) {
//     roleSign = roleSignDemo.match(/(phó )*Chủ nhiệm/gim)[0]
//   }
//   roleSign = roleSign.charAt(0).toUpperCase() + roleSign.slice(1);

//   let unitPublishTrail = b13.match(
//     /.*(?=( (ban hành|ban hành|ban hành) (luật|Luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*\n(Chương|Phần|Điều)))/i
//   );

//   let Role = roleSign.replace(/ +phó+ /gim, "");
//   let replaceRole = `${Role} `;
//   let reRole = new RegExp(replaceRole, "gim");
//   let unitPublishTrail1 = unitPublishTrail
//     ? unitPublishTrail[0].replace(reRole, "")
//     : roleSign.match(/chánh án/i)
//     ? "Tòa án nhân dân tối cao"
//     : "";
//   let unitPublish = unitPublishTrail1.replace(/(Bộ trưởng|Bộ trưởng) /gim, "");
//   if (lawNumber.match(/.*VPQH$/gim)) {
//     // let Role = roleSign.replace(/ +phó+ /gim, "");
//     // let replaceRole = `${Role} `;
//     // let reRole = new RegExp(replaceRole, "gim");
//     // let unitPublishTrail1 = unitPublishTrail?unitPublishTrail[0].replace(reRole, ""):roleSign.match(/chánh án/i)?'Tòa án nhân dân tối cao':'';
//     // console.log('p',p);
//     unitPublish = ["Văn phòng Quốc hội"];

//   }else if (lawNumber.match(/.*HĐTP$/gim)) {
//     unitPublish = ["Hội đồng Thẩm phán Tòa án nhân dân tối cao"];
//   }

//   //   let nameSign = b13.match(/.*$/)[0];

//   let lawDaySignDemo = b13.match(/ngày *(\d)* *tháng *(\d)* *năm *(\d)*$/im);
//   let RemoveDay = lawDaySignDemo[0].replace(/ngày */im, "");
//   let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
//   let lawDaySign = RemoveMonth.replace(/ *năm */im, "/");

//   let lawDayActive;
//   if (b13.match(/(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im)) {
//     let lawDayActiveDemo = b13.match(
//       /(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im
//     )[0];
//     let RemoveDay = lawDayActiveDemo.replace(/ngày */im, "");
//     let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
//     lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
//   } else if (b13.match(/(?<=có hiệu lực.*)sau \d* ngày/im)) {
//     lawDayActive = b13.match(/(?<=có hiệu lực.*)sau \d* ngày[^.]+/im)[0];
//   } else if (b13.match(/có hiệu lực.*từ ngày k/im)) {
//     lawDayActive = lawDaySign;
//   } else {
//     lawDayActive = null;
//   }

//   let lawNameDisplay;
//   let lawNumberDisplay = lawNumber.replace(/\\/gim, "/");
//   if (lawNumber.match(/VBHN/gim)) {
//     lawNameDisplay = 'Văn bản hợp nhất số '+lawNumberDisplay+' năm '+lawDaySign.match(/\d\d\d\d$/gim)[0]
//   } else if(lawDescription.match(/^(luật|bộ luật).*/gim)){
//     lawNameDisplay = `${lawKind.toUpperCase()} ${b13.match(/(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|QUY ĐỊNH)\n).*/)[0]} NĂM ${
//       lawDaySign.match(/\d\d\d\d$/gim)[0]
//     }`;

//   }else {
//     lawNameDisplay = `${lawKind} số ${lawNumberDisplay}`;
//   }

//   let lawRelatedDemo = b13.match(
//     /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\})]+/gi
//   );
//   let lawRelatedDemo2 = lawRelatedDemo.map(function (item) {
//     return item.replace(/ */g, "");
//   });
//   // if (b13.match(/(?<=(căn cứ |; |và ))(luật|bộ luật)[^ số][^;]+năm \d+ (?=((và luật sửa đổi)|;))/gi)) {
//     if (b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)) {

//       for(let y=0;y<b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi).length;y++){

//         if(!b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y].match(/(?<=năm \d+) và (?=luật sửa)/gi)){
//           lawRelatedDemo2 = [
//             ...lawRelatedDemo2,
//             b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y],
//           ];
//         }else{
//           lawRelatedDemo2 = [
//             ...lawRelatedDemo2,
//             ...b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y].split(/(?<=năm \d+) và (?=luật sửa)/gi),
//           ];
//         }

//       }
//   }
//   if (b13.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]+/gi)) {
//     lawRelatedDemo2 = [
//       ...lawRelatedDemo2,
//       ...b13.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]+/gi),
//     ];
//   }
//   lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
//     return item.replace(/ ngày ?\d+ ?tháng ?\d+/gim, "");
//   });

//   function uniqueArray(orinalArray) {
//     return orinalArray.filter((elem, position, arr) => {
//       // console.log(elem == lawNumber);
//       // console.log('lawNumber',lawNumber);

//       return arr.indexOf(elem) == position && elem != lawNumber;
//     });
//   }
//   let lawRelated = uniqueArray(lawRelatedDemo2);

//   let nameSign = b13.match(/.*$/)[0];

//   let b14;
//   if (lawKind.match(/nghị quyết/i)) {
//     b14 = b13.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, ""); // bỏ phần đầu
//   } else {
//     b14 = b13.replace(
//       /^(.*\n)*.*(ban hành|ban hành).*\n(?=(Chương (I|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
//       ""
//     ); // bỏ phần đầu
//   }

//   let b15 = b14.match(/(.*\n)*(?=.*\n.*$)/gim)[0]; // bỏ 2 hàng cuối
//   let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối

//   lawInfo["lawDescription"] = lawDescription;
//   lawInfo["lawNumber"] = lawNumber;
//   lawInfo["unitPublish"] = [unitPublish];
//   lawInfo["lawKind"] = lawKind;
//   lawInfo["lawDaySign"] = lawDaySign;
//   lawInfo["lawDayActive"] = lawDayActive;
//   lawInfo["lawNameDisplay"] = lawNameDisplay;
//   lawInfo["lawRelated"] = lawRelated;
//   lawInfo["nameSign"] = [nameSign];

//   if (roleSign.match(/phó thủ tướng/gim)) {
//     lawInfo["roleSign"] = ["Phó Thủ Tướng"];
//   } else if (
//     roleSign.match(/quyền thủ tướng/gim) ||
//     roleSign.match(/q.* thủ tướng/gim)
//   ) {
//     lawInfo["roleSign"] = ["Quyền Thủ Tướng"];
//   } else if (roleSign.match(/thủ tướng/gim)) {
//     lawInfo["roleSign"] = ["Thủ Tướng"];
//   } else {
//     lawInfo["roleSign"] = [roleSign];
//   }

//   console.log(lawInfo);
//   document.querySelector(".output").value = b16;
//   return {lawInfo,addendum}
// }

// function convertTTLT() {
//   // có thể bị lỗi:
//   // nếu Lawname nhiều hơn 2 dòng thì gộp 1 thôi
//   // nếu dòng signRole chỉ được cách nhau 1 dòng
//   // bỏ hàng cuối cùng nếu có sau tên
//   // thêm 'ban hành' vô
//   // phải có ./. ở sau

//   // văn bản hợp nhất thì ghi VBHN chứ không phải NĐ hay Thông tư
//   // đôi khi không nhận diện được lawKind thì cần tách Thông tư với nội dung miêu tả ra 1 dòng tách biệt

//   let b = document.querySelector(".input").value;
//   addendum = undefined

//   let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
//   // let b2 = b1.replace(/\n(\S)/gim, " $1"); // nối các dòng lại vơi nhau (do TextContent tự xuống)
//   let b2 = b1.replace(/\n(\S)/gim, " $1"); // nối các dòng lại vơi nhau (do TextContent tự xuống)
//   b2 = b2.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
//   b2 = b2.replace(/\(đã ký\)/gim,"");
//   let b3 = b2.replace(/^nơi nhận.*/gim, "");

//   let b4 = b3.replace(/\n+\s+$/gim, "");
//   let b5 = b4.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
//   let b6 = b5.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
//   let b7 = b6.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
//   let b8 = b7.replace(/(?<=\w)\n\[\d+\].*$(\n.*)*$/gim, ""); // bỏ mấy cái chỉ mục của VBHN đi
//   let b9 = b8.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
//   addendum = b9.match(/^(PHỤ LỤC|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY).*(\n.*)*/gm)
//   // console.log('addendum',addendum);
//   let b10 = b9.replace(/\n(PHỤ LỤC|DANH MỤC|QUY CHẾ|QUY CHUẨN|NỘI QUY).*(\n.*)*/gm, ""); // bỏ Phụ lục,danh mục
//   let b11 = b10.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
//   let b12 = b11.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN
//   let b13 = b12.replace(/  +/gim," "); // bỏ khoảng cách 2 space

//   let lawKindDemo = b13.match(
//     /^(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|THÔNG TƯ LIÊN TỊCH|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định)$/im
//   )[0];
//   function capitalize(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   }
//   let lawKind = capitalize(lawKindDemo);

//   let lawDescriptionDemo = b13.match(
//     /(?<=(.* (ban hành|ban hành|ban hành) .*))(luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*(?=\n(Chương|Phần|Điều))/im
//   )
//   if(!lawDescriptionDemo &&lawKind.match(/liên tịch/i)){
//     lawDescriptionDemo = b13.match(
//       /(?<=(.* (liên tịch quy định) .*)).*(?=\n(Chương|Phần|Điều))/im
//     )  }else if (!lawKind.match(/nghị quyết/i) && lawDescriptionDemo) {
//   } else {
//     lawDescriptionDemo = [
//       b13.match(/NGHỊ QUYẾT(\n).*/im)[0].replace(/\n/gim, " "),
//     ];

//     // lawDescriptionDemo = b13.replace(
//     //   /(NGHỊ QUYẾT)\n(.*)/im,'$1 $2'
//     // )[0];
//   }

//   let lawDescription = lawDescriptionDemo
//     ? lawDescriptionDemo[0].replace(/(.*)(\.\/\.|\.|\,|\;)$/im, "$1")
//     : '';
//     lawDescription = lawDescription.charAt(0).toUpperCase() + lawDescription.slice(1)

//   let lawNumberDemo = b13.match(/(?<=(.*số.*: *)).*(?=\s)/im)[0];
//   let lawNumber = lawNumberDemo.replace(/ /gim, "");

//   let unitPublish = "";
//   let unitPublishTrail = b13.match(
//     /.*(?=( (ban hành|ban hành|ban hành) (luật|Luật|bộ luật|nghị định|Nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*\n(Chương|Phần|Điều)))/i
//   );
//   if(!unitPublishTrail && lawKind.match(/liên tịch/i)){
//     unitPublishTrail = b13.match(
//       /.*(?=( (liên tịch quy định).*\n(Chương|Phần|Điều)))/i
//     )  }

//   if(unitPublishTrail[0].match(/ và bộ/igm)){
//     unitPublishTrail =[unitPublishTrail[0].replace(/ và bộ/gim,', Bộ')]
//   }else if(unitPublishTrail[0].match(/ và viện/igm)){
//     unitPublishTrail =[unitPublishTrail[0].replace(/ và viện/gim,', Viện')]
//   }else if(unitPublishTrail[0].match(/ và chánh/igm)){
//     unitPublishTrail =[unitPublishTrail[0].replace(/ và chánh/gim,', Chánh')]
//   }else if(unitPublishTrail[0].match(/ và văn/igm)){
//     unitPublishTrail =[unitPublishTrail[0].replace(/ và văn/gim,', Văn')]
//   }else if(unitPublishTrail[0].match(/ và thống/igm)){
//     unitPublishTrail =[unitPublishTrail[0].replace(/ và thống/gim,', Thống')]
//   }
//   // console.log('unitPublishTrail',unitPublishTrail);

//   if (lawNumber.match(/.*VPQH$/gim)) {
//     // let Role = roleSign.replace(/ +phó+ /gim, "");
//     // let replaceRole = `${Role} `;
//     // let reRole = new RegExp(replaceRole, "gim");
//     // let unitPublishTrail1 = unitPublishTrail?unitPublishTrail[0].replace(reRole, ""):roleSign.match(/chánh án/i)?'Tòa án nhân dân tối cao':'';
//     // console.log('p',p);
//     unitPublish = ["Văn phòng Quốc hội"];

//   } else if (unitPublishTrail) {
//     unitPublish = unitPublishTrail[0].replace(
//       /(Bộ trưởng|Bộ trưởng|viện trưởng|chánh án) /gim,
//       ""
//     );
//     unitPublish = unitPublish.replace(/ liên tịch/gim, "");
//     unitPublish = unitPublish.replace(/ thống nhất/gim, "");
//     unitPublish = unitPublish.split(/, (?=(bộ|viện|chánh|văn|thống))/igm);
// console.log('unitPublish',unitPublish);

//   }else if (lawNumber.match(/.*HĐTP$/gim)) {
//     unitPublish = ["Hội đồng Thẩm phán Tòa án nhân dân tối cao"];
//   }

//   //   let a0 = b13.match(/(?<=.*\.\/\.)(\n.*)*/gim)[0]
//   //   let units=a0.match(/(?<=KT\. ?)\w+.*/igm)
//   //   let unitPublish = []
//   //   if(units && !a0.match(/(?<=TM\. ?)\w+.*/igm)){         ////////////////////////////////////////////////////////// nếu có nhiều người ký
//   //     unitPublish = units.map(unit=>{
//   //       return  unit.replace(/( *CHÁNH ÁN *| *PHÓ CHÁNH ÁN *| *VIỆN TRƯỞNG *| *PHÓ VIỆN TRƯỞNG *| *bộ trưởng *| *thứ trưởng *| *chủ nhiệm *| *phó chủ nhiệm *)/img,"")

//   //     })
//   //   }else if(a0.match(/(?<=TM\. ?)\w+.*/igm)){ //*thủ tướng *| *phó thủ tướng *       // các thể loại TM nói chung
//   //     unitPublish = [a0.match(/(?<=TM\. ?)\w+.*/igm)[0].match(/.*(?= +KT)/img)[0]]

//   //   }else if(a0.match(/Chủ nhiệm/igm)){                         // chủ nhiệm VP
//   //     unitPublish =['Văn Phòng Quốc Hội']
//   //   }else{      // dành cho riêng 1 cơ quan k có TM, chủ nhiệm
//   //   let unitPublishTrail = b13.match(
//   //     /.*(?=( (ban hành|ban hành) (luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*\n(Chương|Phần|Điều)))/i
//   //   );
//   //   let Role = roleSign.replace(/ +phó+ /gim, "");
//   //   let replaceRole = `${Role} `;
//   //   let reRole = new RegExp(replaceRole, "gim");
//   //   let unitPublishTrail1 = unitPublishTrail?unitPublishTrail[0].replace(reRole, ""):roleSign.match(/chánh án/i)?'Tòa án nhân dân tối cao':'';
//   //   unitPublish = [unitPublishTrail1.replace(/(Bộ trưởng|Bộ trưởng) /img,'')]
//   // }

//   // console.log("unitPublish", unitPublish);

//   //   let unitPublishTrail = b13.match(
//   //     /.*(?=( (ban hành|ban hành) (luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp|quy định).*\n(Chương|Phần|Điều)))/i
//   //   );
//   // if(unitPublishTrail){

//   // }

//   // let roleSignDemo = b13.match(/.*(?=\n.*$)/)[0].toLowerCase();
//   // roleSignDemo = roleSignDemo.charAt(0).toUpperCase() + roleSignDemo.slice(1);
//   // let roleSign = roleSignDemo;
//   // if (roleSign.match(/chính/gim)) {
//   //   roleSign = roleSignDemo.replace(/chính/gim, "Chính");
//   // } else if (roleSign.match(/quốc/gim)) {
//   //   roleSign = roleSignDemo.replace(/quốc/gim, "Quốc");
//   // } else if (roleSignDemo.match(/thủ/gim)) {
//   //   roleSign = roleSignDemo.replace(/thủ/gim, "Thủ");
//   // }else if (roleSignDemo.match(/phó chánh án/gim)) {
//   //   roleSign = 'Phó Chánh án Tòa án nhân dân tối cao';
//   // }else if (roleSignDemo.match(/chánh án/gim)) {
//   //   roleSign = 'Chánh án Tòa án nhân dân tối cao';
//   // }

//   let a0 = b13.match(/(?<=.*\.\/\.)(\n.*)*/gim)[0];
//   let ppArray = a0.match(/(?<=KT\. ?)\w+.*/gim);
//   ppArray = ppArray && ppArray.map(pp=>pp.replace(/  /mg,' '))
//   let ppString;
//   let roleSignDemo = [];
//   let orderedUnitPublish =[]

//   if (ppArray) {
//     //nếu có ký thay (KT)
//       ppArray.map((unit) => {
//       for (let n = 0; n < unitPublish.length; n++) {
//         let y = new RegExp(unitPublish[n], "img");
//         let exist = ppArray.some((key) => {
//           return key.match(y);
//         });
//         if (exist) {
//           // nếu có chữ ban ngành trong đó

//           if (unit.match(new RegExp(`.*${unitPublish[n]} `, "img"))) {
//             ppString = unit
//               .replace(new RegExp(`.*${unitPublish[n]} `, "img"), "")
//               .toLowerCase();

//               // if (ppString.match(/^\S+\s+\S+\s+\S+$/)) {//nếu có 3 chữ
//               console.log('unitPublish[n]',unitPublish[n]);

//               orderedUnitPublish.push(unitPublish[n])

//               let ppSeparate = ppString.split(" ");
//               ppSeparate = ppSeparate.map((key, i) => {
//                 if (i <ppSeparate.length) {
//                   return key.charAt(0).toUpperCase() + key.slice(1);
//                 } else {
//                   return key;
//                 }
//               });
//               roleSignDemo.push(
//                 ppSeparate.join(' ')
//               );

//               break;
//             // } else {
//             //   // nếu có 2 chữ
//             //   // orderedUnitPublish.push(unitPublish[n])

//             //   roleSignDemo.push(
//             //     ppString.charAt(0).toUpperCase() + ppString.slice(1) + " " + unitPublish[n]
//             //   );
//             //   console.log(2);              console.log(roleSignDemo);

//             // }
//             // break;
//           }
//         } else {
//           // nếu k có chữ ban ngành nào trong đó VD:'Chính phủ
//           ppString = unit.match(/phó.*/gim)
//             ? unit.match(/phó.*/gim)[0].toLowerCase()
//             :  unit.match(/\S*\s+\S+$/gim)[0].toLowerCase();
//           let ppStringSeparate = ppString.split(" ");

//           ppStringSeparate = ppStringSeparate.map((key, i) => {
//             if (i < ppStringSeparate.length) {
//               return key.charAt(0).toUpperCase() + key.slice(1);
//             } else {
//               return key;
//             }
//           });
//           roleSignDemo = [ppStringSeparate.join(' ')];
//         }
//       }
//     });
//   } else {
//     //nếu không có KT vd:bộ trưởng
//     let noPP = a0.match(/(?<=\n).*(?=\n.*$)/gim)[0];

//     noPP = noPP.match(/\S*\s+\S+$/)[0].toLowerCase();
//     roleSignDemo = [noPP.charAt(0).toUpperCase() + noPP.slice(1)];
//   }

//   let roleSign = roleSignDemo;
//   unitPublish = orderedUnitPublish.length?orderedUnitPublish:unitPublish

//   let lawDaySignDemo = b13.match(/ngày *(\d)* *tháng *(\d)* *năm *(\d)*$/im);
//   let RemoveDay = lawDaySignDemo[0].replace(/ngày */im, "");
//   let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
//   let lawDaySign = RemoveMonth.replace(/ *năm */im, "/");

//   let lawDayActive;
//   if (b13.match(/(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im)) {
//     let lawDayActiveDemo = b13.match(
//       /(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im
//     )[0];
//     let RemoveDay = lawDayActiveDemo.replace(/ngày */im, "");
//     let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
//     lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
//   } else if (b13.match(/(?<=có hiệu lực.*)sau \d* ngày/im)) {
//     lawDayActive = b13.match(/(?<=có hiệu lực.*)sau \d* ngày[^.]+/im)[0];
//   } else if (b13.match(/có hiệu lực.*từ ngày k/im)) {
//     lawDayActive = lawDaySign;
//   } else {
//     lawDayActive = null;
//   }

//   let lawNameDisplay;
//   let lawNumberDisplay = lawNumber.replace(/\\/gim, "/");
//   if (lawNumber.match(/VBHN/gim)) {
//     lawNameDisplay = 'Văn bản hợp nhất số '+lawNumberDisplay+' năm '+lawDaySign.match(/\d\d\d\d$/gim)[0]
//   } else if(lawDescription.match(/^(luật|bộ luật).*/gim)){
//     lawNameDisplay = `${lawKind.toUpperCase()} ${b13.match(/(?<=(LUẬT|BỘ LUẬT|NGHỊ ĐỊNH|THÔNG TƯ|NGHỊ QUYẾT|THÔNG TƯ LIÊN TỊCH|QUYẾT ĐỊNH|PHÁP LỆNH|CHỈ THỊ|BÁO CÁO|HƯỚNG DẪN|HIẾN PHÁP|QUY ĐỊNH)\n).*/)[0]} NĂM ${
//       lawDaySign.match(/\d\d\d\d$/gim)[0]
//     }`;

//   }else {
//     lawNameDisplay = `${lawKind} số ${lawNumberDisplay}`;
//   }

//   let lawRelatedDemo = b13.match(
//     /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\})]+/gi
//   );
//   let lawRelatedDemo2 = lawRelatedDemo.map(function (item) {
//     return item.replace(/ */g, "");
//   });
//   if (b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)) {

//     for(let y=0;y<b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi).length;y++){

//       if(!b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y].match(/(?<=năm \d+) và (?=luật sửa)/gi)){
//         lawRelatedDemo2 = [
//           ...lawRelatedDemo2,
//           b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y],
//         ];
//       }else{
//         lawRelatedDemo2 = [
//           ...lawRelatedDemo2,
//           ...b13.match(/(?<=(căn cứ |; ))(luật|bộ luật)[^;]+năm \d+/gi)[y].split(/(?<=năm \d+) và (?=luật sửa)/gi),
//         ];
//       }

//     }
// }
// if (b13.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]/gi)) {
//   lawRelatedDemo2 = [
//     ...lawRelatedDemo2,
//     ...b13.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]/gi),
//   ];
// }
// lawRelatedDemo2 = lawRelatedDemo2.map((item) => {
//     return item.replace(/ ngày ?\d+ ?tháng ?\d+/gim, "");
//   });

//   function uniqueArray(orinalArray) {
//     return orinalArray.filter((elem, position, arr) => {
//       // console.log(elem == lawNumber);
//       // console.log('lawNumber',lawNumber);

//       return arr.indexOf(elem) == position && elem != lawNumber;
//     });
//   }
//   let lawRelated = uniqueArray(lawRelatedDemo2);

//   let nameSign = []
//   let representative= a0.match(/(?<=TM\. ?)\w+.*/gim);
//   if(ppArray){
//     for(let g=0;g<ppArray.length;g++){

//       nameSign.push(a0.match(new RegExp(`.*(?=(\n.*){${(ppArray.length-1-g)*2}}$)`, "g"))[0])
//     }
//   }else if(representative){
//     for(let g=0;g<representative.length;g++){

//       nameSign.push(a0.match(new RegExp(`.*(?=(\n.*){${(representative.length-1-g)*2}}$)`, "g"))[0])
//     }
//   }else{
//     nameSign = a0.match(/.*$/);

//   }
//   // if()

//   let b14;
//   if (lawKind.match(/nghị quyết/i)) {
//     b14 = b13.replace(/^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i, ""); // bỏ phần đầu
//   } else if(lawKind.match(/liên tịch/i)){
//     b14 = b13.replace(
//       /^(.*\n)*.*(ban hành|ban hành|quy định).*\n(?=(Chương (I|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
//       ""
//     ); // bỏ phần đầu
//   }else{
//     b14 = b13.replace(
//       /^(.*\n)*.*(ban hành|ban hành).*\n(?=(Chương (I|1)|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
//       ""
//     )
//   }

//   // let b13 = b13.match(/(.*\n)*(?=.*\n.*$)/gim)[0]; // bỏ 2 hàng cuối
//   let b15 = b14.replace(/(?<=.*\.\/\.)(\n.*)*/gim, ""); // bỏ sau KT
//   let b16 = b15.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối

//   lawInfo["lawDescription"] = lawDescription;
//   lawInfo["lawNumber"] = lawNumber;
//   lawInfo["unitPublish"] = unitPublish;
//   lawInfo["lawKind"] = lawKind;
//   lawInfo["lawDaySign"] = lawDaySign;
//   lawInfo["lawDayActive"] = lawDayActive;
//   lawInfo["lawNameDisplay"] = lawNameDisplay;
//   lawInfo["lawRelated"] = lawRelated;

//   // if (roleSign.match(/phó thủ tướng/gim)) {
//   //   lawInfo["roleSign"] = "Phó Thủ Tướng";
//   // } else if (
//   //   roleSign.match(/quyền thủ tướng/gim) ||
//   //   roleSign.match(/q.* thủ tướng/gim)
//   // ) {
//   //   lawInfo["roleSign"] = "Quyền Thủ Tướng";
//   // } else if (roleSign.match(/thủ tướng/gim)) {
//   //   lawInfo["roleSign"] = "Thủ Tướng";
//   // } else {
//   //   lawInfo["roleSign"] = roleSign;
//   // }

//   lawInfo["roleSign"] = roleSign;
//   lawInfo["nameSign"] = nameSign;

//   console.log(lawInfo);
//   document.querySelector(".output").value = b16;
// }
