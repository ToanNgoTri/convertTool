const express = require("express");
const app = express();
const puppeteer = require('puppeteer');
var cors = require('cors')
const bodyParer = require('body-parser')
var admin = require("firebase-admin");

var serviceAccount = require("./project2-197c0-firebase-adminsdk-wgo9a-4a0448ab63.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project2-197c0-default-rtdb.firebaseio.com"
});


app.use(bodyParer.json({limit: '50mb'}));
app.use(bodyParer.urlencoded({limit: '50mb', extended: true}));

app.use(cors())


app.use(express.static('./public'))

const ejs = require('ejs')
app.set('view engine','ejs')


async function eachRun(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url,{ waitUntil: 'load' })
    

    // page.setDefaultNavigationTimeout(0)
    
    // let source = await page.content();
    // OR the faster method that doesn't wait for images to load:
    let source = await page.content({"waitUntil": "domcontentloaded"});

   const r =  await page.evaluate(async () => {

      let elements = document.querySelector('.content1').textContent;
      return (elements)
  });


    await browser.close();
    return (r);
}


async function allRun(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url,{ waitUntil: 'load' })
  
  // OR the faster method that doesn't wait for images to load:
  let source = await page.content({"waitUntil": "domcontentloaded"});

 const r =  await page.evaluate(async () => {

  let a = []
    let elements = document.querySelectorAll('.nqTitle');
    elements.forEach(link => {
      a.push(link.querySelector('a').href); // In ra giá trị href của mỗi thẻ <a>
    });
    console.log('elements',elements);
    
return a
});

// console.log(r);

  await browser.close();
  // console.log(source.toString());
  return (r);
}
https://thuvienphapluat.vn/page/tim-van-ban.aspx?keyword=&area=0&match=True&type=11&status=0&signer=0&bdate=01/01/2014&edate=31/12/2015&sort=1&lan=1&scan=0&org=0&fields=&page=7

app.get("/", async (req, res) => {
    // let a = await run();


    res.render('index')
});

app.get("/URL", async (req, res) => {
  
  
  console.log(req.query.URL);
  let content = ''
   content = await eachRun(req.query.URL);

     res.render('get',{content:content})

});


async function openBrowser(URL) {
  // Khởi động trình duyệt
  const browser = await puppeteer.launch({
    headless: false,  // Chạy trình duyệt với giao diện (có cửa sổ trình duyệt)
    devtools: true, // Mở DevTools
  // defaultViewport: null,
  args: ['--window-size=2200,1500'],
  });

  // Mở tab mới
  const page = await browser.newPage();

  // URL với tham số query string
  const url = `http://localhost:5000/URL?URL=${URL}&auto=true`;

  
  await page.goto(url,{ waitUntil: 'domcontentloaded' });



}

let id =0
app.get(`/AllURL/:id`, async (req, res) => {
  
  
  // console.log(req.query.URL);
  let arrayLink = await allRun(req.query.URL);
  

  let content = ''
  content = await eachRun(arrayLink[req.params.id]);
console.log('Link:',arrayLink[req.params.id]);

    res.render('get',{content:content})

  


});



app.post("/push", async (req, res) => {
  
  // console.log(req.body);

  const db = admin.database();

  const ref = db.ref(`/LawInfo/${req.body.lawNumber}`)

  ref.set(req.body.lawInfo,()=>{
    console.log('pushed Info');
    
  })
  
  const ref2 = db.ref(`/LawContent/${req.body.lawNumber}`)
  ref2.set(req.body.dataLaw,()=>{
    console.log('pushed Content');
    
  })
});

app.post("/push1", async (req, res) => {
  
  // console.log(req.body);

  const db = admin.database();

  const ref = db.ref(`/LawInfo1/${req.body.lawNumber}`)

  ref.set(req.body.lawInfo,()=>{
    console.log('pushed Info');
    
  })
  
});




app.get("/retriveInfo", async (req, res) => {
  
  // console.log(req.body);

  const db = admin.database();

  const ref = db.ref(`/LawInfo`)

  ref.once("value", function(snapshot) {
    res.send(snapshot.val());
  });  

});


app.get("/retriveContent", async (req, res) => {
  
  // console.log(req.body);

  const db = admin.database();

  const ref = db.ref(`/LawContent`)

  ref.once("value", function(snapshot) {
    res.send(snapshot.val());
  });  

});


app.get("/delete", async (req, res) => {
  
  const db = admin.database();

  const ref = db.ref(`/LawInfo1`)

  ref.remove()

});





app.post("/searchLaw", async (req, res) => {
  
  const db = admin.database();

  let LawInfo 
  let LawContent = {}
  const ref = await db.ref(`/LawInfo`).once("value", function(snapshot) {
    // console.log(snapshot.val());
    LawInfo = snapshot.val()
    // LawContent = snapshot.val()['LawContent']
    
  })

let input = req.body.input
// console.log(LawInfo);

let lawFilterName  
// if(Object.keys(LawInfo).length){
//   lawFilter= Object.values(LawInfo).filter( (key)=>{
    
// return key['lawDescription'].match(new RegExp(`${input}`, "gim"))   || key['lawNumber'].match(new RegExp(`${input}`, "gim")) || key['lawNameDisplay'].match(new RegExp(`${input}`, "gim"))
// // console.log("key['lawDescription']",key['lawDescription']);

// })
// }

let LawFilterFull = {}
if(Object.keys(LawInfo).length){
  lawFilterName= Object.keys(LawInfo).filter( (key)=>{
    
return LawInfo[key]['lawDescription'].match(new RegExp(`${input}`, "gim"))   || LawInfo[key]['lawNumber'].match(new RegExp(`${input}`, "gim")) || LawInfo[key]['lawNameDisplay'].match(new RegExp(`${input}`, "gim"))
// console.log("key['lawDescription']",key['lawDescription']);

})

lawFilterName.map( key =>{
  LawFilterFull[key] = LawInfo[key]
})

}


// console.log('LawFilterFull',LawFilterFull);

res.send(LawFilterFull)
});


function Search(data,input) {
  let searchArray = {};

  if (input) {
    if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {

      function a(key, key1) {
        // key ở đây là tên luật, key1 là Object 1 chương

        Object.values(key1)[0].map((key2, i1) => {
          // chọn từng điều

          let replace = `(.*)${input}(.*)`;
          let re = new RegExp(replace, 'gmi');
          let article = Object.keys(key2)[0].replace(/(?<=\w*)\\(?=\w*)/gim, '/')
          let point = Object.values(key2)[0].replace(/(?<=\w*)\\(?=\w*)/gim, '/')

          if (Object.keys(key2)[0].match(re)) {
            searchArray[key].push({
              [article]: point,
            });
          } else if (point != '') {
            if (point.match(re)) {
              searchArray[key].push({
                [article]: point,
              });
            }
          }
        });

        
      }

      Object.keys(data).map(
        (key, i) => {
          // key là tên luật
          //key là tên của luật
          // tham nhap luat (array chuong)

          searchArray[key] = [];
            data[key].map(
              (key1, i1) => {
                // ra Object Chuong hoặc (array phần thứ...)
                if (Object.keys(key1)[0].match(/^phần thứ .*/gim)) {
                  // nếu có 'phần thứ
                  // console.log('phần thứ');
                  // console.log('Object.keys(key1)[0]',Object.keys(key1)[0]);
                  if (
                    Object.keys(Object.values(key1)[0][0])[0].match(
                      /^Chương .*/gim,
                    )
                  ) {
                    //nếu có chương trong phần thứ

                    Object.values(key1)[0].map((key2, i) => {
                      a(key, key2);
                    });
                  } else {
                    //nếu không có chương trong phần thứ
                    a(key, key1);
                  }
                } else if (Object.keys(key1)[0].match(/^chương .*/gim)) {
                  a(key, key1);
                } else {
                  //nếu chỉ có điều
                  if(i1==0){ //  đảm bảo chỉ chạy 1 lần
                    a(key, {
                      'chương Giả định':
                        data[key],
                    });

                  }
                }
              },
            );
        },
      );

      let searchResult = {};

      Object.keys(searchArray).map((key, i) => {
        searchArray[key].map((key1, i) => {
          searchResult[key] = searchArray[key];
        });
      });
return searchResult
      // console.log('searchResult',searchResult);
    } else {
    }
  } else {
  }
}

app.post("/searchContent", async (req, res) => {
  
  const db = admin.database();

  let LawContent = {}
  const ref = await db.ref(`/LawContent`).once("value", function(snapshot) {
    LawContent = snapshot.val()
  })

  let LawInfo = {}
  const inf = await db.ref(`/LawInfo`).once("value", function(snapshot) {
    LawInfo = snapshot.val()
  })


let input = req.body.input

let result = Search(LawContent,input)

// console.log('result',result);

res.send({'LawContent':result,'LawInfo':LawInfo})
});


app.listen(5000, () => {
  console.log("Backend server is running on port 5000");
});
