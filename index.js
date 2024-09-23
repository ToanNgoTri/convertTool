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


app.use(express.static('public'))

const ejs = require('ejs')
app.set('view engine','ejs')


async function run(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url,{ waitUntil: 'load' })
    
    // await page.goto(url,{ waitUntil: 'load' });

    // page.setDefaultNavigationTimeout(0)
    
    // let source = await page.content();
    // OR the faster method that doesn't wait for images to load:
    let source = await page.content({"waitUntil": "domcontentloaded"});

   const r =  await page.evaluate(async () => {
      let elements = document.querySelector('.content1').textContent;
      return (elements)
  });

// console.log(r);

    await browser.close();
    // console.log(source.toString());
    return (r);
}


app.get("/", async (req, res) => {
    // let a = await run();


    res.render('index')
});

app.get("/URL", async (req, res) => {
  
  
  console.log(req.query.URL);
  let a = await run(req.query.URL);
  res.render('get',{a:a})

  // console.log('a',a);

  // res.render('get')
});

app.post("/push", async (req, res) => {
  
  // console.log(req.body);

  const db = admin.database();

  const ref = db.ref(`/LawInfo/${req.body.lawNumber}`)

  ref.set(req.body.lawInfo,()=>{
    console.log('pushed Info');
    
  })
  // console.log(req.body.lawInfo);
  
  const ref2 = db.ref(`/LawContent/${req.body.lawNumber}`)
  ref2.set(req.body.dataLaw,()=>{
    console.log('pushed Content');
    
  })
});



app.listen(5000, () => {
  console.log("Backend server is running on port 5000");
});
