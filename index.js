const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
var cors = require("cors");
const bodyParer = require("body-parser");
const { MongoClient } = require("mongodb");

app.use(bodyParer.json({ limit: "50mb" }));
app.use(bodyParer.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use(express.static("./public"));

const ejs = require("ejs");
app.set("view engine", "ejs");

const client = new MongoClient(
  "mongodb+srv://gusteixeira25:JPwO1gvfCAjiuXKo@testdatabase.moky4.mongodb.net/"
);

async function pushLawContent(info, content, id) {
  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawContent");
    await LawContent.insertOne({ _id: id, info, content });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

async function pushLawSearch(info,id,fullText) {
  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawSearch");
    await LawContent.insertOne({ _id: id, 
      info:{
      lawNumber: info["lawNumber"],
      lawDescription: info["lawDescription"],
      lawNameDisplay: info["lawNameDisplay"],
    },fullText });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}


async function eachRun(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(50000);

  await page.goto(url, { waitUntil: "load" });

  let source = await page.content({ waitUntil: "domcontentloaded" });

  const r = await page.evaluate(async () => {
    let m = []

    
    let bg_phantich = document.querySelectorAll('.bg_phantich')  // loại bỏ phần tử khong cần thiết
    for(let f = 0 ; f<bg_phantich.length;f++){
      bg_phantich[f].remove()
    }

    let elementContent = document.querySelectorAll(
        ".noidungtracuu >.docitem-1:not(.docitem-9 ~ div), .docitem-2:not(.docitem-9 ~ div), .docitem-5:not(.docitem-9 ~ div), .docitem-11:not(.docitem-9 ~ div), .docitem-12:not(.docitem-9 ~ div)"
    );
    
    
    let lawRelated =''
    let roleSign =''

    if(Object.keys(elementContent).length == 0){
      elementContent = document.querySelectorAll(
        ".noidungtracuu"
      );
      lawRelated = ''
      roleSign = ''
    
    }else{
      lawRelated = (document.querySelector("#chidanthaydoind >.docitem-14")?document.querySelector("#chidanthaydoind >.docitem-14").innerText:'');
      lawRelated =
        lawRelated +
        "\n" +
        (document.querySelector("#chidanthaydoind >.docitem-15")?document.querySelector("#chidanthaydoind >.docitem-15").innerText:'')
        lawRelated = lawRelated.replace(/\_*/g, "");
        lawRelated = lawRelated.replace(/\n+/g, "\n");
  
      roleSign = document.querySelector("#chidanthaydoind >.docitem-9")?document.querySelector("#chidanthaydoind >.docitem-9").innerText:'';
      roleSign = roleSign.replace(/\u00A0/img,' ')
    }

    var content = "";
    for (let a = 0; a < elementContent.length; a++) {
      content = content + "\n" + elementContent[a].innerText;
    }
    content = content.replace(/\n+/g, "\n");
    content = content.replace(/  /gm, " ");

    let tableInfomation = document.querySelector(
      ".div-table"
    ).innerText;


    let lawNumber
    let unitPublish
    let lawKind
    let nameSign
    let lawDaySign
    let lawDescription = document.querySelector(
      ".the-document-summary"
    ).innerText;
    lawDescription = lawDescription.replace(/^ */, "");
    if(tableInfomation.match(/VBHN/)){
      lawNumber = document.querySelector(
        ".div-table tr:nth-child(1) td:nth-child(2)"
      ).innerText;
      lawNumber= lawNumber.replace(/(^ | $)/img,'')

      unitPublish = document.querySelector(
        ".div-table tr:nth-child(2) td:nth-child(4)"
      ).innerText;
  
      lawKind = document.querySelector(
        ".div-table tr:nth-child(2) td:nth-child(2)"
      ).innerText;
      
      nameSign = document.querySelector(
        ".div-table tr:nth-child(3) td:nth-child(4)"
      ).innerText;
  
      lawDaySign = document.querySelector(
        ".div-table tr:nth-child(1) td:nth-child(4)"
      ).innerText;
  
      
      }else{
      lawNumber = document.querySelector(
        ".div-table tr:nth-child(2) td:nth-child(2)"
      ).innerText;
      lawNumber= lawNumber.replace(/(^ | $)/img,'')

      unitPublish = document.querySelector(
        ".div-table tr:nth-child(1) td:nth-child(2)"
      ).innerText;
  
      lawKind = document.querySelector(
        ".div-table tr:nth-child(3) td:nth-child(2)"
      ).innerText;
  
      nameSign = document.querySelector(
        ".div-table tr:nth-child(3) td:nth-child(4)"
      ).innerText;
  
      lawDaySign = document.querySelector(
        ".div-table tr:nth-child(4) td:nth-child(2)"
      ).innerText;
  
      }



    // roleSign = roleSign.replace(/nơi nhận.*(\s{0,2}\S.*)*/gim, "");
    roleSign = roleSign.replace(/^\n(\s)*/gim, "");
    roleSign = roleSign.replace(/\(*đã ký[^\w]+/gim, "");
    roleSign = roleSign.replace(/\(*đã k(ý|í)\)*/gim, "");
    roleSign = roleSign.replace(/\n\[daky\]/gim, "");
    roleSign = roleSign.replace(/\s*$/gim, "");
    roleSign = roleSign.replace(/^\s*/gim, "");

    return {
      content,
      lawNumber,
      unitPublish,
      lawKind,
      nameSign,
      lawDaySign,
      lawDescription,
      lawRelated,
      roleSign,
      m
    };


    // return {
    //   content,
    //   lawNumber:'',
    //   unitPublish:'',
    //   lawKind:'',
    //   nameSign:'',
    //   lawDaySign:'',
    //   lawDescription:'',
    //   lawRelated:'',
    //   roleSign:'',
    //   elementContent:(elementContent)
    // };
  });

  await browser.close();
  return r;
}

async function allRun(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(70000);
  await page.goto(url );

  // OR the faster method that doesn't wait for images to load:
  let source = await page.content({ waitUntil: "domcontentloaded" });

  const r = await page.evaluate(async () => {
    let a = [];
    let elements = document.querySelectorAll(".doc-title");
    elements.forEach((link) => {
      a.push(link.querySelector("a").href); // In ra giá trị href của mỗi thẻ <a>
    });
    console.log("elements", elements);

    return a;
  });

  // console.log(r);

  await browser.close();
  // console.log(source.toString());
  return r;
}

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/URL", async (req, res) => {
  console.log('req.query.URL',req.query.URL);
  let content = "";
  content = await eachRun(req.query.URL);
  // console.log("content['elementContent']", (content['elementContent']) );

  //  res.render('get',{content:content['content'],UnitPublish:content['UnitPublish']})
  res.render("get", {
    content: content["content"],
    lawNumber: content["lawNumber"],
    unitPublish: content["unitPublish"],
    lawKind: content["lawKind"],
    nameSign: content["nameSign"],
    lawDaySign: content["lawDaySign"],
    lawDescription: content["lawDescription"],
    lawRelated: content["lawRelated"],
    roleSign: content["roleSign"],
  });
});


app.get(`/AllURL/:id`, async (req, res) => {
  let arrayLink = await allRun(req.query.URL);
  console.log(arrayLink[req.params.id]);

  let content = "";
  content = await eachRun(arrayLink[req.params.id]);

  res.render("get", {
    content: content["content"],
    lawNumber: content["lawNumber"],
    unitPublish: content["unitPublish"],
    lawKind: content["lawKind"],
    nameSign: content["nameSign"],
    lawDaySign: content["lawDaySign"],
    lawDescription: content["lawDescription"],
    lawRelated: content["lawRelated"],
    roleSign: content["roleSign"],
  });
});


app.post("/push", async (req, res) => {
  pushLawContent(req.body.lawInfo, req.body.dataLaw, req.body.lawNumber);
  pushLawSearch(req.body.lawInfo,req.body.lawNumber,req.body.contentText)
});

app.post("/searchlaw", async (req, res) => {
  // dành cho Detail2
  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawContent");

    LawContent.find({
      $or: [
        { _id: new RegExp(`${req.body.input}`, "i") },
        { "info.lawDescription": new RegExp(`${req.body.input}`, "i") },
        { "info.lawNameDisplay": new RegExp(`${req.body.input}`, "i") },
      ],
    })
      .project({ info: 1 })
      .sort({ "info.lawDaySign": -1 })
      .toArray()
      .then((o) => res.json(o));
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }

});


app.post("/searchcontent", async (req, res) => {
  // dành cho AppNavigator

  try {
    const database = client.db("LawMachine");
    const LawSearch = database.collection("LawSearch");
    LawSearch.find({ "fullText": new RegExp(`${req.body.input}`, "i") }).collation({ locale: 'vi' })
      .project({ info: 1 })
      .toArray()
      .then((o) => res.json(o));
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
});


app.post("/getonelaw", async (req, res) => {
  // dành cho Detail5
  let a;

  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawContent");
    // Query for a movie that has the title 'Back to the Future'

    a = await LawContent.findOne({ _id: req.body.screen });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }

  // console.log(a);
  res.json(a)
  // res.write(a);
});

app.post("/stackscreen", async (req, res) => {
  // dành cho AppNavigator

  try {
    const database = client.db("LawMachine");
    const LawSearch = database.collection("LawSearch");

    LawSearch.find({})
      .project({ info: 1 })
      .toArray()
      .then((o) => res.json(o));
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
});





app.listen(5000, function () {
  console.log("Server is running on port " + 5000);
});
