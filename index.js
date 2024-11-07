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

// mongoose.connect('mongodb+srv://gusteixeira25:JPwO1gvfCAjiuXKo@testdatabase.moky4.mongodb.net/', { useNewUrlParser: true })
const client = new MongoClient(
  "mongodb+srv://gusteixeira25:JPwO1gvfCAjiuXKo@testdatabase.moky4.mongodb.net/"
);

async function run(info, content, id,fullText) {
  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawContent");
    // Query for a movie that has the title 'Back to the Future'
    // const query = { name: "toan" };
    // const movie = await LawContent.findOne(query);
    // console.log(movie);

    await LawContent.insertOne({ _id: id, info, content,fullText });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function eachRun(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load" });

  // page.setDefaultNavigationTimeout(0)

  // let source = await page.content();
  // OR the faster method that doesn't wait for images to load:
  let source = await page.content({ waitUntil: "domcontentloaded" });

  const r = await page.evaluate(async () => {
    // let elementContent = document.querySelectorAll("#chidanthaydoind >.docitem-1, .docitem-2, .docitem-5, .docitem-11, .docitem-12");
    let elementContent = document.querySelectorAll(
      "#chidanthaydoind >.docitem-1:not(.docitem-9 ~ div), .docitem-2:not(.docitem-9 ~ div), .docitem-5:not(.docitem-9 ~ div), .docitem-11:not(.docitem-9 ~ div), .docitem-12:not(.docitem-9 ~ div)"
    );

    var content = "";
    for (let a = 0; a < elementContent.length; a++) {
      content = content + "\n" + elementContent[a].innerText;
    }
    content = content.replace(/\n+/g, "\n");

    let lawNumber = document.querySelector(
      ".div-table tr:nth-child(2) td:nth-child(2)"
    ).innerText;

    let unitPublish = document.querySelector(
      ".div-table tr:nth-child(1) td:nth-child(2)"
    ).innerText;

    let lawKind = document.querySelector(
      ".div-table tr:nth-child(3) td:nth-child(2)"
    ).innerText;

    let nameSign = document.querySelector(
      ".div-table tr:nth-child(3) td:nth-child(4)"
    ).innerText;

    let lawDaySign = document.querySelector(
      ".div-table tr:nth-child(4) td:nth-child(2)"
    ).innerText;

    let lawDescription = document.querySelector(
      ".the-document-summary"
    ).innerText;
    lawDescription = lawDescription.replace(/^ */, "");

    let lawRelated = document.querySelector(
      "#chidanthaydoind >.docitem-14"
    ).innerText;
    lawRelated =
      lawRelated +
      "\n" +
      document.querySelector("#chidanthaydoind >.docitem-15").innerText;
    lawRelated = lawRelated.replace(/\n+/g, "\n");

    let roleSign = document.querySelector(
      "#chidanthaydoind >.docitem-9"
    ).innerText;
    roleSign = roleSign.replace(/nơi nhận.*(\s{0,2}\S.*)*/gim, "");
    roleSign = roleSign.replace(/^\n(\s)*/gim, "");
    roleSign = roleSign.replace(/\n$/gim, "");

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
    };
  });

  await browser.close();
  return r;
}

async function allRun(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load" });

  // OR the faster method that doesn't wait for images to load:
  let source = await page.content({ waitUntil: "domcontentloaded" });

  const r = await page.evaluate(async () => {
    let a = [];
    let elements = document.querySelectorAll(".nqTitle");
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
  run();

  res.render("index");
});

app.get("/URL", async (req, res) => {
  console.log(req.query.URL);
  let content = "";
  content = await eachRun(req.query.URL);

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
  // console.log(req.query.URL);
  let arrayLink = await allRun(req.query.URL);

  let content = "";
  content = await eachRun(arrayLink[req.params.id]);
  console.log("Link:", arrayLink[req.params.id]);

  res.render("get", { content: content });
});

// const db = admin.database();

// const ref = db.ref(`/LawInfo/${req.body.lawNumber}`)

// ref.set(req.body.lawInfo,()=>{
//   console.log('pushed Info');

// })

// const ref2 = db.ref(`/LawContent/${req.body.lawNumber}`)
// ref2.set(req.body.dataLaw,()=>{
//   console.log('pushed Content');

// })

app.post("/push", async (req, res) => {
  run(req.body.lawInfo, req.body.dataLaw, req.body.lawNumber,req.body.contentText);
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
    const LawContent = database.collection("LawContent");
    LawContent.find({ "fullText": new RegExp(`${req.body.input}`, "i") }).collation({ locale: 'vi' })
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
  console.log(req.body.input);

  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawContent");
    // Query for a movie that has the title 'Back to the Future'

    a = await LawContent.findOne({ _id: req.body.input });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }

  // console.log(a);
  res.json(a)
  // res.write(a);
});

app.get("/stackscreen", async (req, res) => {
  // dành cho AppNavigator

  try {
    const database = client.db("LawMachine");
    const LawContent = database.collection("LawContent");
    // Query for a movie that has the title 'Back to the Future'

    LawContent.find({})
      .project({ info: 1, content: 1 })
      .toArray()
      .then((o) => res.send(o));
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
});

app.get("/forcreateindex", async (req, res) => {

  const database = client.db("LawMachine");
  const LawContent = database.collection("LawContent");
  LawContent.createIndex({
    "info.lawDescription": 1,
    "info.lawNameDisplay": 1,
    _id: 1,
  });

  res.send("success");
});






app.listen(5000, function () {
  console.log("Server is running on port " + 5000);
});
