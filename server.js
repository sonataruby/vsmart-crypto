const fs = require('fs');
const config = require('./config');
const db = require('./server/db');

const fsFile = require('./fsFile');
const path = require("path");
const _ = require("lodash");
//const io   = require('socket.io');


//const vhost = require('vhost');
const express = require("express");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const axios = require('axios').default;
const partials      = require('express-partials');
const EJSLayout = require('express-ejs-layouts');
const http=require('http');
const app = express(); // create express app
const server = http.createServer(app);
const ejs = require('ejs');
const session = require('express-session')
var router = express.Router();



app.set('views', path.join(__dirname, '/apps'))
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
//app.use(partials());
app.use(EJSLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);

const homeLayout = () => {
  return config.layout.dir + "/home";
}
const pageLayout = () => {
  return config.layout.dir + "/pages";
}

const noLayout = () => {
  return config.layout.dir + "/nolayout";
}

//app.use("/test", test);

//app.set('layout', pageLayout());


app.get("/", (req, res) => {
  if(config.redirect != ""){
    res.redirect(config.redirect);
  }
  
 app.set('layout', homeLayout())
 const dataMain = fsFile.readJSONFile('main.json');
 
  dataMain.showPresell = req.query.join;
  dataMain.loadJS = ["presell.js"];
  res.render("index",dataMain);
});

require("./modules/ido")("/ido",app);
require("./modules/farm")("/farm",app);
require("./modules/airdrop")("/airdrop",app);

const account = require("./modules/account").app;
const apps = require("./modules/apps").app;

app.use(account);
app.use(apps);

require("./modules/nftmarket")("/market",app);



app.get("/api/nft/:id", async (req, res) => {

    const nft = {
      "id": 0,
      "attributes": [],
      "description": "No Description",
      "external_url": "https://cryptocar.cc/api/nft/1",
      "image": "https://cryptocar.cc/nfts/1.gif",
      "name": "CFX 17",
      "animation_url": "",
      "youtube_url": "",
      "facebook_url": "",
      "tiwter_url": "",
      "smart_url": ""
    }

    var id = req.params.id;
    var item = {};
  	//res.setHeader('Content-Type', 'application/json');
    sql = "SELECT * FROM `nft_smart` WHERE tokenId='"+id+"' LIMIT 1";
    item = await db.dbQuery(sql, true);
    
    if(item == undefined || item.length == 0) {
      item = {};
      item.data = '{"error": "404 page not found", "err_code": 404}';
    }

    res.send(item.data);
    res.end(item.data);
    
});

app.get("/api/nft/", (req, res) => {
  var data = '{"error": "404 page not found", "err_code": 404}';
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.get("/token/", (req, res) => {
   var data = '{"error": "404 page not found", "err_code": 404}';
    res.header('Content-Type', 'application/json');
    res.send(data);
    res.end( data );
});




// start express server on port 5000
app.listen(config.db_config.port, () => {
  console.log("server started on  "+config.db_config.port);
  console.log("Layout  "+config.layout.dir);
  
});