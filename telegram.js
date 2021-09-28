const TelegramBot = require('node-telegram-bot-api');
var bodyParser = require('body-parser');
let fs = require('fs');
const config = require('./config');
var telegram = config.telegram;
const cors = require('cors');
const express = require("express");
let Web3 = require('web3');
let web3 = new Web3(config.blockChianURL);

const app = express();
let Address = JSON.parse(fs.readFileSync(__dirname + '/apps/abi/address.json', 'utf8'));
let MainConfig = JSON.parse(fs.readFileSync(__dirname + '/json/main.json', 'utf8')).social;

telegram.group = MainConfig.telegram;
telegram.channel = MainConfig.telegram_channel;

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json()) 


telegram.group = '@8gpyMdhoPHhiNGFl'; //<== Test
app.use(cors());
app.options('*', cors());

const bot = new TelegramBot(telegram.token, {polling: true});
const img_url = MainConfig.website+'/upload/banner.png';

/*
bot.onText(/\/start\/(.+)/, (msg,match) => {
    contractAddress = match[1];
    bot.sendPhoto(msg.chat.id,img_url,{
        caption : "Welcome to Smart Crypto Bot\n "}).then(() => {
        var option = {
            "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        };
        bot.sendMessage(msg.chat.id,contractAddress+"\n",option);
    })
});
*/
const getNumber = () => {
    let number = Math.floor(Math.random() * (15 - 1) ) + 1;
    return number;
}
bot.on("polling_error", console.log);
bot.onText(/\/start/, (msg,match) => {
    
    var option = {
            "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        };
        /*
    bot.sendMediaGroup(telegram.TelegramChannel,
        [{
            "type": "photo",
              "media": "https://cryptocar.cc/nfts/"+getNumber()+"/0.gif",
              "caption": "CAR NFT Class"
        },{
            "type": "photo",
              "media": "https://cryptocar.cc/nfts/"+getNumber()+"/1.gif",
              "caption": "CAR NFT Class"
        },{
            "type": "photo",
              "media": "https://cryptocar.cc/nfts/"+getNumber()+"/2.gif",
              "caption": "CAR NFT Class"
        }]);
    */
    bot.sendPhoto(msg.chat.id,img_url,{
        caption : MainConfig.title + " Airdrop<br>Total : "+MainConfig.token.airdrop_amount+"<br>Reward : "+MainConfig.token.airdrop_reward + MainConfig.airdrop.description,
        "reply_markup": {
                "keyboard": [["Join Start >>","Website"]]
                }
        });
});

const telegramJoin = async () => {
    var text = 'Join Telegram Group';
    var keyboardStr = JSON.stringify({
        inline_keyboard: [
          [
              {text:'Join Telegram Group',url:telegram.group},
              {text:'Join Telegram Channel',url:telegram.channel},
              {text:'Next Step 3'}
          ]
        ]
    });
    var keyboard = {reply_markup: JSON.parse(keyboardStr)};
    bot.sendMessage(msg.chat.id,text,keyboard);
};

var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
/*
bot.on('message', (msg) => {
    console.log(`${msg.from.username}:  ${msg.text} ${msg.location}`);
    var send_text = msg.text;
    var msg = "";
    if(send_text == "!contract"){
        msg = Address.AddressContractSmartToken;
    }
    if(msg != ""){
        
        bot.sendMessage(telegram.group,msg);
    }
    
});
*/


bot.on('message', (msg) => {
    
    var send_text = msg.text;
    var isGroup = msg.chat.type;
    var formUser = msg.from.username;
    var firstName = msg.from.username;
    var lastName = msg.from.username;
    var typeComand = msg.entities != undefined ? msg.entities[0].type : "text";
    var getRoomID = msg.chat.id;
    var replyID = msg.message_id;
    var msg = "";
    var photoMsg = "";

    if(send_text == "/contract"){
        photoMsg = 'Testnet Contract : <a href="https://testnet.bscscan.com/address/'+Address.AddressContractSmartToken+'">'+Address.AddressContractSmartToken+'</a>';
    }

    if(send_text == "/airdrop"){
        msg = '@'+formUser+' Check out : <a href="https://t.me/StarsBattleBot?token='+Address.AddressContractSmartToken+'">Airdrop Bot</a>';
    }

    if(send_text == "/game"){
        msg = Address.AddressContractSmartToken;
    }

    if(send_text == "/chart"){
        msg = Address.AddressContractSmartToken;
    }

    if(send_text == "/price"){
        msg = Address.AddressContractSmartToken;
    }

    if(send_text == "/doc"){
        photoMsg = 'View Full document <a href="https://doc.starsbattle.co/">https://doc.starsbattle.co/</a>';
    }

    if(msg != "" && typeComand == "bot_command"){
        
        bot.sendMessage(getRoomID,msg,{
            reply_to_message_id: replyID,
            parse_mode: 'HTML'
        });
    }
    
    if(photoMsg != "" && typeComand == "bot_command"){
        
        bot.sendPhoto(getRoomID,'https://starsbattle.co/upload/banner.png',{
        caption : photoMsg,
        reply_to_message_id : replyID,
        parse_mode: 'HTML'
        });
    }

});


app.get("/", (req, res) => {
  var data = '{"ok": "200"}';
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.post("/telegram", (req, res) => {
  var msg = req.body.text;
  bot.sendPhoto(getRoomID,'https://starsbattle.co/upload/banner.png',{
        caption : msg,
        parse_mode: 'HTML'
        });
  //bot.sendMessage(telegram.TelegramChannel,msg);
  var data = '{"ok": "200"}';
  res.header('Content-Type', 'application/json');
  res.send(data);
  res.end( data );
});

app.listen(8082, () =>
  console.log(`Example app listening on port 8082!`),
);