var bodyParser = require('body-parser');
const express = require("express");
const socket = require("socket.io");
const config = require('./config');
const db = require('./server/db');
let Web3 = require('web3');
let fs = require('fs');
const cors = require('cors');
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
  await loadGame1().then(async (pool) => {
      await pool.paramsOf(tokenid).call().then(async (info) => {
        let nextLever = await pool.LeverOf(Number(info.Lever)+1).call();
        data = {
            tokenId : Number(tokenid),
            name : info.ClassName,
            Class : Number(info.Class),
            Lever: Number(info.Lever),
            Bullet: Number(info.Bullet),
            BulletClass: info.BulletClass,
            Speed: Number(info.Speed),
            Score: Number(info.Score),
            NextLeverScore : Number(nextLever.Score)
        }

        var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

        if(LoadDB != "" && LoadDB != undefined){
            data.Bullet = LoadDB.bulletCount;
            //data.Score = LoadDB.Score;
            //data.Lever = LoadDB.Lever;
        }

      });
  });

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
        }

        var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

        if(LoadDB != "" && LoadDB != undefined){
            player.Bullet = LoadDB.bulletCount;
            player.Score = LoadDB.Score;
            //player.Lever = LoadDB.Lever;

            
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
        db.dbQuery("UPDATE `game_stars` SET bulletCount='"+info.Bullet+"', Score='"+info.Score+"', Lever='"+info.Lever+"' WHERE tokenId='"+tokenid+"';");
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

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("sync", async (data) => {
      let tokenid = data.tokenId;
      await loadGame1().then(async (pool) => {
        await pool.paramsOf(tokenid).call().then(async (info) => {
          db.dbQuery("UPDATE `game_stars` SET bulletCount='"+info.Bullet+"', Score='"+info.Score+"', Lever='"+info.Lever+"' WHERE tokenId='"+tokenid+"';");
        });
      });
  });

  socket.on("update", async (data) => {
    
    let tokenid = data.tokenId;
    let bulletCount = data.bullet;
    let Score = data.score;
    let Lever = data.lever;
    let hash = data.hash;
    let record = data.record;

    var LoadDB = await db.dbQuery("SELECT * FROM game_stars WHERE tokenId='"+tokenid+"'",true);

    if(LoadDB == "" || LoadDB == undefined){
        db.dbQuery("INSERT INTO `game_stars` (`tokenId`, `bulletCount`, `Score`, `Lever`, `Record`) VALUES ('"+tokenid+"', '"+bulletCount+"', '"+Score+"', '"+Lever+"', '"+record+"');");
    }else{
      
      db.dbQuery("UPDATE `game_stars` SET bulletCount='"+bulletCount+"' WHERE tokenId='"+tokenid+"';");
    }

    io.emit("user update", socket.userId);

  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });
  
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});