SmartApps = (function (SmartApps, $, window) {
        "use strict";
        
    
    var Game1;
    var GameFatory;
   
    var login_wallet;
    let GAS = 300000; 
    let blockchain = SmartApps.Blockchain;
    var ContractAddress = blockchain.address();
    var login_wallet;

    SmartApps.tokenGame1 = {};
    
    SmartApps.tokenGame1.getBalt = async () => {
        var objData = [];
        await Game1.getTokenOwner(login_wallet).call().then(async (value) => {
            for(var i=0;i<value.length;i++){
                await Game1.getOptions(value[i]).call().then((info) => {
                   
                    var obj = {
                        tokenId : value[i],
                        name : info.ClassName,
                        Class : info.Class,
                        Lever: info.Lever,
                        Bullet: info.Bullet,
                        BulletClass: info.BulletClass,
                        Speed: info.Speed,
                        Score: info.Score,
                        Groups: info.Groups
                    }

                    objData.push(obj);
                });
            }
        });
        return objData;
    };
    SmartApps.tokenGame1.getPlayer = async (tokenId) => {

        var obj = {};
        await axios.get("https://api.starsbattle.co/nft/"+tokenId).then((value) => {
            obj = value.data[0];
        });
        
        
       
        return obj;
    };
    
    SmartApps.tokenGame1.upLever = async (tokenId, _score, _bullet) => {
        let lever = 1;
        await axios.post("https://api.starsbattle.co/uplever",{
            tokenId : tokenId,
            score : _score,
            bullet : _bullet,
            wallet : login_wallet
        }).then(async (value) => {
            if(value.data.status == "update"){
                var hash = value.data.hash;
                await Game1.upLeverStart(tokenId,_score,hash).send({gas:130000, data: login_wallet}).then((data) => {
                    console.log(data);
                });
            }
        });
        
        return lever;
    };

    
    SmartApps.tokenGame1.getMarketPlate = async (number) => {
        //await Game1.setFactory('0xd6d488258cdb2a4b583575467bfcc8abe2afd965').send({gas:30000});
        
        var obj = [];
        await GameFatory.getMarketStars(number).call().then((value) => {

            for(var i=0;i<value.length;i++){
                var dataObj = {
                     name : value[i].name != "" ? value[i].name : "Stars CX 1",
                     price : value[i].price > 0 ? blockchain.fromWei(value[i].price) : 1000,
                     lever : value[i].lever > 0 ? value[i].lever : 1,
                     class : value[i].class > 0 ? value[i].class : 1,
                     bullet : value[i].bullet > 0 ? value[i].bullet : 1000,
                     bulletclass : value[i].bulletclass > 0 ? value[i].bulletclass : 1,
                     speed : value[i].speed > 0 ? value[i].speed : 7
                };
                
                obj.push(dataObj);
            }
            
        });
        
        return obj;
    };
    
    SmartApps.tokenGame1.keccak256 = (value) =>{
        return blockchain.keccak256(value);
    }
    SmartApps.tokenGame1.buyMarketPlate = async (itemID) => {
        
        let checkPrice = await GameFatory.MarketPlaceItemOf(itemID).call();
       
        let allow = checkPrice.price;
        if(allow == 0){
            blockchain.notify("Item not avalible");
            return false;
        }
        let appoveAmount = await SmartApps.tokenSmart.allowance(ContractAddress.AddressContractNFTFactory);
        
        if(appoveAmount < allow) await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        

        await GameFatory.buyStars(itemID).send({gas:500000}).then((value) => {
            console.log(value);
        });
    };


    SmartApps.tokenGame1.getBulletMarket = async (number) => {
        //await Game1.setFactory('0xd6d488258cdb2a4b583575467bfcc8abe2afd965').send({gas:30000});
        var obj = [];
        await GameFatory.getBulletMarket(number).call().then((value) => {

            for(var i=0;i<value.length;i++){
                var dataObj = {
                     id : i,
                     name : value[i].name,
                     price : value[i].price,
                     bullet : value[i].bullet
                };
                
                obj.push(dataObj);
            }
            
        });
        console.log(obj);
        return obj;
    };


    SmartApps.tokenGame1.buyBullet = async (_tokenId, itemID) => {
        let checkPrice = await GameFatory.MarketPlaceBulletOf(itemID).call();
        let allow = checkPrice.price;
        if(allow == 0){
            blockchain.notify("Item not avalible");
            return false;
        }
        let appoveAmount = await SmartApps.tokenSmart.allowance(ContractAddress.AddressContractNFTFactory);
         
        if(appoveAmount < allow) await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        await GameFatory.MarketPlaceBulletOf(itemID).call().then(async (value) => {
            if(value.price > 0){
                await GameFatory.buyBullet(_tokenId, itemID).send({gas:300000}).then((value) => {
                   blockchain.notify("Item Update");
                });
            }else{
                blockchain.notify("Item not support");
            }
        });

        
    };

     SmartApps.tokenGame1.buyVip = async (_tokenId, itemID) => {
        let checkPrice = await GameFatory.VipOf(itemID).call();
        let allow = checkPrice.price;
        if(allow == 0){
            blockchain.notify("Item not avalible");
            return false;
        }
        let appoveAmount = await SmartApps.tokenSmart.allowance(ContractAddress.AddressContractNFTFactory);
         
        if(appoveAmount < allow) await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        await GameFatory.VipOf(itemID).call().then(async (value) => {
            if(value.id > 0){
                await GameFatory.buyVip(_tokenId, itemID).send({gas:300000}).then((value) => {
                    blockchain.notify("VIP Update");
                });
            }else{
                blockchain.notify("VIP Item not support");
            }
            
        });

        
    };
    

    SmartApps.tokenGame1.Init = async () =>{
        await blockchain.init();
        Game1 = await blockchain.loadContractGame1();
        GameFatory = await blockchain.loadContractNFTFactory();
        login_wallet = await blockchain.getLoginWallet();
        
        //console.log(ContractAddress.AddressContractGame1);
    }

    SmartApps.components.docReady.push(SmartApps.tokenGame1.Init);
    return SmartApps;
})(SmartApps, jQuery, window);