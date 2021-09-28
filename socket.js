var bodyParser = require('body-parser');
const express = require("express");
const socket = require("socket.io");
const config = require('./config');
const db = require('./server/db');
let Web3 = require('web3');
let fs = require('fs');
const cors = require('cors');
const axios = require('axios'); 
//let web3 = new Web3("https://bsc-dataseed.binance.org");
let web3 = new Web3(config.blockChianURL);

// App setup
const PORT = 7000;
const app = express();

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 


app.use(cors());
app.options('*', cors());

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`${config.server.api}`);
});
console.log(config.server.api);

// Static files
//app.use(express.static("public"));
let Address = JSON.parse(fs.readFileSync(__dirname + '/apps/abi/address.json', 'utf8'));

let loadNftFatory =  async () => {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/apps/abi/nftfactory.json', 'utf8'));
    let contract = await new web3.eth.Contract(farmArtifact, Address.AddressContractNFTFactory)
    return contract.methods;
};

let loadGame1 =  async () => {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/apps/abi/game1.json', 'utf8'));
    let contract = await new web3.eth.Contract(farmArtifact, Address.AddressContractGame1,{gas:150000})
    return contract.methods;
};

let loadMarkets =  async () => {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/apps/abi/nftmarket.json', 'utf8'));
    let contract = await new web3.eth.Contract(farmArtifact, Address.AddressContractNFTMarket)
    return contract.methods;
};
let loadTokens =  async () => {
    var farmArtifact = JSON.parse(fs.readFileSync(__dirname + '/apps/abi/smarttoken.json', 'utf8'));
    let contract = await new web3.eth.Contract(farmArtifact, Address.AddressContractSmartToken)
    return contract.methods;
};

app.get("/", (req, res) => {
  var data = '{"ok": "200"}';
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});


app.get("/layer/:tokenid", async (req, res) => {
  var tokenid = req.params.tokenid;
  
  var data = {};

  var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

  if(LoadDB != "" && LoadDB != undefined){
    var jsonData = JSON.parse(LoadDB.data);

    var data = {
        tokenId : Number(tokenid),
        name : jsonData.name,
        Class : Number(jsonData.Class),
        Lever: Number(jsonData.Lever),
        Bullet: Number(jsonData.Bullet),
        BulletClass: jsonData.BulletClass,
        Speed: Number(jsonData.Speed),
        Score: Number(jsonData.Score),
        Groups: Number(jsonData.Groups),
        NextLeverScore : 500
    }
    
  }else{
    await loadGame1().then(async (pool) => {

         await pool.paramsOf(tokenid).call().then(async (info) => {
          let nextLever = await pool.LeverOf(Number(info.Lever)+1).call();
          var data = {
              tokenId : Number(tokenid),
              name : info.ClassName,
              Class : Number(info.Class),
              Lever: Number(info.Lever),
              Bullet: Number(info.Bullet),
              BulletClass: info.BulletClass,
              Speed: Number(info.Speed),
              Score: Number(info.Score),
              Groups: Number(info.Groups),
              NextLeverScore : Number(nextLever.Score)
          }
           await db.dbQuery("INSERT INTO `game_stars` SET tokenId='"+tokenid+"', contracts='"+Address.AddressContractGame1+"', bulletCount='"+Number(info.Bullet)+"', Score='"+Number(info.Score)+"', Lever='"+Number(info.Lever)+"', data='"+JSON.stringify(data)+"';");
        });
      });
  }

  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.post("/uplever", async (req, res) => {
  var tokenid = req.body.tokenid;
  var score = req.body.score;
  var bullet = req.body.bullet;
  var wallet = req.body.wallet;

  var data = {};
  if(Number(tokenid) > 0 ){
    await loadGame1().then(async (pool) => {
        await pool.paramsOf(tokenid).call().then(async (info) => {
          
          //var timeNow = "Singal";
          //var hash_code = web3.utils.padRight(web3.utils.asciiToHex("SingalsData"),64);
          const bl = await web3.eth.getBlock('latest'); 
          var timeNow = bl.timestamp;

          var hash_code = web3.eth.abi.encodeParameters(['uint256'],[Number(info.Lever) + Number(tokenid) + Number(score) + Number(bullet)]);
          var hash_x = web3.eth.abi.encodeParameters(['uint256','uint256','uint256','bytes32','address','uint256'],[tokenid,score,bullet,hash_code,wallet,timeNow]);

          if(info.Score < score){
            var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

            if(LoadDB != "" && LoadDB != undefined){
              data.status = "update";
              data.hash = hash_x;
              
            }
            if((Number(info.Lever) + 1)%5 == 0){
              axios.post("http://127.0.0.1:8082/telegram",{
                  text : wallet + "\nUp lever : "+ tokenid+" to "+(Number(info.Lever) + 1)+"\nGet Reward STARTS Token"
              },{headers:{"Content-Type" : "application/json"}});
            }
          }else{
            data.status = 'error';
          }

        });

    });
  }
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.get("/nft/:tokenid", async (req, res) => {
  var tokenid = req.params.tokenid;
 
  var data = [];
  

  await loadGame1().then(async (pool) => {
      await pool.paramsOf(tokenid).call().then(async (info) => {
        
        var player = {
            tokenId : tokenid,
            name : info.ClassName,
            Class : info.Class,
            Lever: info.Lever,
            Bullet: info.Bullet,
            BulletClass: info.BulletClass,
            Speed: info.Speed,
            Score: info.Score,
            Groups: Number(info.Groups),
        }

        var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

        if(LoadDB != "" && LoadDB != undefined){
            player.Bullet = LoadDB.bulletCount;
            player.Score = LoadDB.Score;
            //player.Lever = LoadDB.Lever;
        }else{
          db.dbQuery("INSERT INTO `game_stars` (`tokenId`, `bulletCount`, `Score`, `Lever`, `Record`) VALUES ('"+tokenid+"', '"+Number(info.Bullet)+"', '"+Number(info.Score)+"', '"+Number(info.Lever)+"', '0);");
        }
        player.status = "200";
        data.push(player);
      });
  });

 
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});


app.post("/nft", async (req, res) => {
  var tokenid = req.body.tokenid;
   await loadGame1().then(async (pool) => {
      await pool.paramsOf(tokenid).call().then(async (info) => {
        db.dbQuery("UPDATE `game_stars` SET bulletCount='"+Number(info.Bullet)+"', Score='"+info.Score+"', Lever='"+info.Lever+"' WHERE tokenId='"+tokenid+"';");
      });
    });
  var data = {};
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

// Socket setup
const io = socket(server, {
  cors: {
    origin: '*',
  }
});

const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("join", async function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("join", [...activeUsers]);

    
    var tokenid = data.tokenId;
    var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);
    
    if(LoadDB == "" || LoadDB == undefined){
      await loadGame1().then(async (pool) => {

         await pool.paramsOf(tokenid).call().then(async (info) => {
          let nextLever = await pool.LeverOf(Number(info.Lever)+1).call();
          var data = {
              tokenId : Number(tokenid),
              name : info.ClassName,
              Class : Number(info.Class),
              Lever: Number(info.Lever),
              Bullet: Number(info.Bullet),
              BulletClass: info.BulletClass,
              Speed: Number(info.Speed),
              Score: Number(info.Score),
              Groups: Number(info.Groups),
              NextLeverScore : Number(nextLever.Score)
          }
           await db.dbQuery("INSERT INTO `game_stars` SET tokenId='"+tokenid+"', contracts='"+Address.AddressContractGame1+"', bulletCount='"+Number(info.Bullet)+"', Score='"+Number(info.Score)+"', Lever='"+Number(info.Lever)+"', data='"+JSON.stringify(data)+"';");
        });
      });
    }
    /*
    axios.post("http://127.0.0.1:8082/telegram",{
        text : "<b>"+data.wallet + "</b>\nPlay Game Token ID : "+ data.tokenId
    },{headers:{"Content-Type" : "application/json"}});
    */
  });
  socket.on("sign", function (data) {
    socket.userId = data;
    //console.log(activeUsers);
  }); 
  
  socket.on("uplever", async (data, callback) => {
      let tokenid = data.tokenId;
      let nowLever = data.lever;
      let score = data.score;
      let wallet = data.wallet;
     
      var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"' AND Lever='"+nowLever+"'",true);


      if(LoadDB != "" && LoadDB != undefined){

        var jsonData = JSON.parse(LoadDB.data);

        var data = {
            tokenId : Number(tokenid),
            name : jsonData.name,
            Class : Number(jsonData.Class),
            Lever: Number(jsonData.Lever) + 1,
            Bullet: Number(LoadDB.bulletCount),
            BulletClass: jsonData.BulletClass,
            Speed: Number(jsonData.Speed),
            Score: Number(score),
            Groups: Number(jsonData.Groups),
            NextLeverScore : 500
        }
        
        const bl = await web3.eth.getBlock('latest'); 
        var timeNow = bl.timestamp;
        var hash_code = web3.eth.abi.encodeParameters(['uint256'],[Number(jsonData.Lever) + 1 + Number(tokenid) + Number(score) + Number(jsonData.Bullet)]);
        var hash_x = web3.eth.abi.encodeParameters(['uint256','uint256','uint256','bytes32','address','uint256'],[tokenid,score,jsonData.Bullet,hash_code,wallet,timeNow]);


        await db.dbQuery("UPDATE `game_stars` SET Lever='"+(Number(jsonData.Lever) + 1)+"', hash='"+hash_x+"', data='"+JSON.stringify(data)+"' WHERE tokenId='"+tokenid+"';");
        callback(data);
      }else{
        callback({reply : true});
      }

  });

  socket.on("buybulet", async (data,callback) => {
    let tokenid = data.tokenId;
    await loadGame1().then(async (pool) => {

         await pool.paramsOf(tokenid).call().then(async (info) => {

              var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);
              if(LoadDB != "" && LoadDB != undefined){

                var jsonData = JSON.parse(LoadDB.data);

                var data = {
                    tokenId : Number(tokenid),
                    name : jsonData.name,
                    Class : Number(jsonData.Class),
                    Lever: Number(jsonData.Lever),
                    Bullet: Number(info.Bullet),
                    BulletClass: jsonData.BulletClass,
                    Speed: Number(jsonData.Speed),
                    Score: Number(jsonData.Score),
                    Groups: Number(jsonData.Groups),
                    NextLeverScore : Number(jsonData.NextLeverScore)
                }
                
                await db.dbQuery("UPDATE `game_stars` SET bulletCount='"+Number(info.Bullet)+"', data='"+JSON.stringify(data)+"' WHERE tokenId='"+tokenid+"';");
                callback(data);
              }else{
                 callback({Bullet : 0});
              }
         });
    });

  });

  socket.on("sync", async (data,callback) => {

      let tokenid = data.tokenId;
      let score  = data.score;
      var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

      if(LoadDB != "" && LoadDB != undefined){
        var jsonData = JSON.parse(LoadDB.data);

        var data = {
            tokenId : Number(tokenid),
            name : jsonData.name,
            Class : Number(jsonData.Class),
            Lever: Number(jsonData.Lever),
            Bullet: Number(jsonData.Bullet),
            BulletClass: jsonData.BulletClass,
            Speed: Number(jsonData.Speed),
            Score: Number(jsonData.Score),
            Groups: Number(jsonData.Groups),
            NextLeverScore : 500
        }
        
      }

      callback(data);
      
  });

  socket.on("update", async (data) => {
    
    let tokenid = data.tokenId;
    let bulletCount = data.bullet;
    let Score = data.score;
    let Lever = data.lever;
    let hash = data.hash;
    let record = data.record;

    var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

    if(LoadDB != "" && LoadDB != undefined){
      var jsonData = JSON.parse(LoadDB.data);

        var data = {
            tokenId : Number(tokenid),
            name : jsonData.name,
            Class : Number(jsonData.Class),
            Lever: Number(jsonData.Lever),
            Bullet: Number(bulletCount),
            BulletClass: jsonData.BulletClass,
            Speed: Number(jsonData.Speed),
            Score: Number(jsonData.Score),
            Groups: Number(jsonData.Groups),
            NextLeverScore : 500
        }
      db.dbQuery("UPDATE `game_stars` SET bulletCount='"+Number(bulletCount)+"', data='"+JSON.stringify(data)+"' WHERE tokenId='"+tokenid+"';");
    }

    //io.emit("user update", socket.userId);

  });

  socket.on("disconnect", async () => {
    if(socket.userId != undefined ){
      var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+socket.userId.tokenId+"'",true);

      if(LoadDB != "" && LoadDB != undefined){
        var jsonData = JSON.parse(LoadDB.data);

          var data = {
              tokenId : Number(socket.userId.tokenId),
              name : jsonData.name,
              Class : Number(jsonData.Class),
              Lever: Number(jsonData.Lever),
              Bullet: Number(socket.userId.bullet),
              BulletClass: jsonData.BulletClass,
              Speed: Number(jsonData.Speed),
              Score: Number(jsonData.Score),
              Groups: Number(jsonData.Groups),
              NextLeverScore : 500
          }
        db.dbQuery("UPDATE `game_stars` SET bulletCount='"+Number(socket.userId.bullet)+"', data='"+JSON.stringify(data)+"' WHERE tokenId='"+tokenid+"';");
      }
      
    }
    
    activeUsers.delete(socket.userId);
    console.log(socket.userId," Disconnect");

    io.emit("disconnected", socket.userId);
  });

  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });
  
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});