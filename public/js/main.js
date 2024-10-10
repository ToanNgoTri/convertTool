let lawInfo = {};
let dataLaw;
function convertInfo() {
  // có thể bị lỗi:
  // nếu Lawname nhiều hơn 2 dòng
  // nếu dòng signRole có 2 dòng thì gộp 1 thôi
  // bỏ hàng cuối cùng nếu có sau tên
  // trong unitPublish chỉ cho phép cơ quan chứ không cho phép cá nhân
  
  // văn bản hợp nhất thì ghi VBHN chứ không phải NĐ hay Thông tư

  let b = document.querySelector(".input").value;

  let b1 = b.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  let b2 = b1.replace(/\n(\S)/gim, " $1"); // nối các dòng lại vơi nhau (do TextContent tự xuống)
  b2 = b2.replace(/^ */gim, ""); // bỏ các space ở đầu mỗi dòng
  let b3 = b2.replace(/^nơi nhận.*/gim, "");
  let b4 = b3.replace(/\n+/gim, "\n"); // biến nhiều xuống dòng thành 1 xuống dòng
  let b5 = b4.replace(/^(PHỤ LỤC|Phụ lục).*(\n.*)*/gim, ""); // bỏ Phụ lục
  let b6 = b5.replace(/\n+\s+$/gim, "");
  let b7 = b6.replace(/\n*$/gim, ""); //bỏ xuống dòng ở cuối
  let b8 = b7.replace(/^\s*/gim, ""); // bỏ space, xuống dòng ở đầu
  let b9 = b8.replace(/\s*$/gim, ""); // bỏ space, xuống dòng ở cuối
  let b10 = b9.replace(/(\[|\()\d*(\]|\))/gim, ""); // bỏ chỉ mục số đi
  let b11 = b10.replace(/\n.*ĐÍNH KÈM.*$/gi, ""); // bỏ FILE ĐƯỢC ĐÍNH KÈM THEO VĂN BẢN


    let lawKindDemo = b11.match(
    /^(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp)$/im
  )[0];
  function capitalize(str) { 
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
} 
  let lawKind =capitalize(lawKindDemo);
  


  let lawDescriptionDemo = b11.match(
    /(?<=(.* ban hành .*))(luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp).*(?=\n(Chương|Phần|Điều))/im
  );
  if(!lawKind.match(/nghị quyết/i)&&lawDescriptionDemo){
  }else{
    lawDescriptionDemo = [b11.match(
      /NGHỊ QUYẾT(\n).*/im,
    )[0].replace(/\n/igm,' ')]

    // lawDescriptionDemo = b11.replace(
    //   /(NGHỊ QUYẾT)\n(.*)/im,'$1 $2'
    // )[0];
    }
    
  let lawDescription = lawDescriptionDemo?lawDescriptionDemo[0].replace(
    /(.*)(\.\/\.|\.|\,|\;)$/im,
    "$1"
  ):[]

  
  
  let lawNumberDemo = b11.match(/(?<=(.*số.*: *)).*/im)[0];
  let lawNumber = lawNumberDemo.replace(/ /gim, "");

  let roleSignDemo = b11.match(/.*(?=\n.*$)/)[0].toLowerCase();
  roleSignDemo = roleSignDemo.charAt(0).toUpperCase() + roleSignDemo.slice(1);
  let roleSign = roleSignDemo;
  if (roleSign.match(/chính/gim)) {
    roleSign = roleSignDemo.replace(/chính/gim, "Chính");
  } else if (roleSign.match(/quốc/gim)) {
    roleSign = roleSignDemo.replace(/quốc/gim, "Quốc");
  } else if (roleSignDemo.match(/thủ/gim)) {
    roleSign = roleSignDemo.replace(/thủ/gim, "Thủ");
  }else if (roleSignDemo.match(/phó chánh án/gim)) {
    roleSign = 'Phó Chánh án Tòa án nhân dân tối cao';
  }else if (roleSignDemo.match(/chánh án/gim)) {
    roleSign = 'Chánh án Tòa án nhân dân tối cao';
  }


  let unitPublish = b11.match(
    /.*(?=( ban hành (luật|bộ luật|nghị định|thông tư|nghị quyết|thông tư liên tịch|quyết định|pháp lệnh|chỉ thị|báo cáo|hướng dẫn|hiến pháp).*\n(Chương|Phần|Điều)))/i
  );
  let Role = roleSign.replace(/ +phó+ /gim, "");
  let replaceRole = `${Role} `;
  let reRole = new RegExp(replaceRole, "gim");
  let unitPublishTrail = unitPublish?unitPublish[0].replace(reRole, ""):roleSign.match(/chánh án/i)?'Tòa án nhân dân tối cao':'';
  // console.log(unitPublishTrail);

//   let nameSign = b11.match(/.*$/)[0];


  let lawDaySignDemo = b11.match(/ngày *(\d)* *tháng *(\d)* *năm *(\d)*$/im);
  let RemoveDay = lawDaySignDemo[0].replace(/ngày */im, "");
  let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
  let lawDaySign = RemoveMonth.replace(/ *năm */im, "/");

  let lawDayActive;
  if (b11.match(/(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im)) {
    let lawDayActiveDemo = b11.match(
      /(?<=có hiệu lực.*)ngày *\d* *tháng *\d* *năm *\d*/im
    )[0];
    let RemoveDay = lawDayActiveDemo.replace(/ngày */im, "");
    let RemoveMonth = RemoveDay.replace(/ *tháng */im, "/");
    lawDayActive = RemoveMonth.replace(/ *năm */im, "/");
  } else if (b11.match(/(?<=có hiệu lực.*)sau \d* ngày/im)) {
    lawDayActive = b11.match(/(?<=có hiệu lực.*)sau \d* ngày[^.]+/im)[0];
  } else if (b11.match(/có hiệu lực.*từ ngày k/im)) {
    lawDayActive = lawDaySign;
  } else {
    lawDayActive = null;
  }

  let lawNameDisplay;
  let lawNumberDisplay = lawNumber.replace(/\\/gim, "/");
  if (lawDescription.match(/^(luật|bộ luật).*/gim)) {
    lawNameDisplay = `${lawDescription} năm ${
      lawDaySign.match(/\d\d\d\d$/gim)[0]
    }`;
  } else {
    lawNameDisplay = `${lawKind} số ${lawNumberDisplay}`;
  }

  let lawRelatedDemo = b11.match(
    /(?<!(mẫu( số)?|ví dụ.*)) \d+\/?\d*\/\D[^(\s|,|.| |\:|\"|\'|\;|\{|\})]+/gi
  );
  let lawRelatedDemo2 = lawRelatedDemo.map(function (item) {
    return item.replace(/ */g, "");
  });
  if(b11.match(
    /(?<=(căn cứ |; ))(luật|bộ luật)[^;]+/gi
  )){
  lawRelatedDemo2 = [...lawRelatedDemo2,...b11.match(
    /(?<=(căn cứ |; ))(luật|bộ luật)[^;]+/gi
  )]
}
if(b11.match(/(?<=(căn cứ |; ))(hiến pháp)[^;]+/gi)){
  lawRelatedDemo2 = [...lawRelatedDemo2,...b11.match(
    /(?<=(căn cứ |; ))(hiến pháp)[^;]+/gi
  )]

}
  lawRelatedDemo2=lawRelatedDemo2.map((item)=>{
     return item.replace(/ ngày ?\d+ ?tháng ?\d+/igm,'')
  })


  function uniqueArray(orinalArray) {
    return orinalArray.filter((elem, position, arr) => {
      // console.log(elem == lawNumber);
      // console.log('lawNumber',lawNumber);

      return arr.indexOf(elem) == position && elem != lawNumber;
    });
  }
  let lawRelated = uniqueArray(lawRelatedDemo2);


  let nameSign = b11.match(/.*$/)[0];

  let b12
  if(lawKind.match(/nghị quyết/i)){
      b12 = b11.replace(
    /^(.*\n)*QUYẾT NGHỊ(:|\.|\s|)\n/i,
    ""
  ); // bỏ phần đầu

  }else{
    b12 = b11.replace(
      /^(.*\n)*.*ban hành.*\n(?=(Chương I|phần thứ|Điều 1|Điều 1)(:|\.|\s))/i,
      ""
    ); // bỏ phần đầu
    }

  let b13 = b12.match(/(.*\n)*(?=.*\n.*$)/gim)[0]; // bỏ 2 hàng cuối
  let b14 = b13.replace(/\n$/gim, ""); // bỏ hàng dư trống ở cuối

  lawInfo["lawDescription"] = lawDescription;
  lawInfo["lawNumber"] = lawNumber;
  lawInfo["unitPublish"] = unitPublishTrail;
  lawInfo["lawKind"] = lawKind;
  lawInfo["lawDaySign"] = lawDaySign;
  lawInfo["lawDayActive"] = lawDayActive;
  lawInfo["lawNameDisplay"] = lawNameDisplay;
  lawInfo["lawRelated"] = lawRelated;

  if (roleSign.match(/phó thủ tướng/gim)) {
    lawInfo["roleSign"] = "Phó Thủ Tướng";
  } else if (
    roleSign.match(/quyền thủ tướng/gim) ||
    roleSign.match(/q.* thủ tướng/gim)
  ) {
    lawInfo["roleSign"] = "Quyền Thủ Tướng";
  } else if (roleSign.match(/thủ tướng/gim)) {
    lawInfo["roleSign"] = "Thủ Tướng";
  } else {
    lawInfo["roleSign"] = roleSign;
  }

  
  lawInfo["nameSign"] = nameSign;

  console.log(lawInfo);
  document.querySelector(".output").value = b14;
}


let data = [];
function convertContent() {
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
      i4a[b] = i4a[b - 1].replace(/(?<=^Mục .*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim, " ");

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
      i7a[b] = i6.replace(/(?<=^Chương (V|I|X|\d).*)\n(?!(Điều|Ðiều|Điều) \d.*)/gim, ": ");
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
    let articleArray; // lấy khoảng giữa các chương
    let allArticle = []; // lấy riêng lẻ các điều
    let point = [];
    let d = -1;
    for (var a = 0; a < chapterArray.length; a++) {
      articleArray = [];
      if (a < chapterArray.length - 1) {
        let replace = `(?<=${chapterArray[a]}\n)(.*\n)*(?=${
          chapterArray[a + 1]
        })`;
        let re = new RegExp(replace, "gim");
        articleArray = i10.match(re);
      } else {
        let replace = `((?<=${chapterArray[a]}))((\n.*)*)$`;
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

        if (b < countArticle - 1) {
          let TemRexgexArticleB = allArticle[a][b + 1];

          TemRexgexArticleB = allArticle[a][b + 1].replace(/\\/gm, "\\\\");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\(/, "\\(");
          TemRexgexArticleB = TemRexgexArticleB.replace(/\)/, "\\)");

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
            let replace = `(?<=${chapterArray[b]}\n)(.*\n)*(?=${
              chapterArray[b + 1]
            })`;
            let re = new RegExp(replace, "gim");
            ContentInEachChapter = ContentInEachSection[0].match(re);
          } else {
            let replace = `((?<=${chapterArray[b]}))((\n.*)*)$`;
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

  console.log("data", data);

}

function Push() {
  let lawNumberForPush = lawInfo['lawNumber'].replace(/\//igm,'\\')
   fetch('http://localhost:5000/push',{
    method:'POST',
    headers:{'Content-Type':'application/json'}
  ,
  body:JSON.stringify({dataLaw:data,lawInfo:lawInfo,lawNumber:lawNumberForPush})
  })
  .then(res=>{(res.text());
  })
  .then(data=>console.log(123))
}
