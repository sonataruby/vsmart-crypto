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
                        BulletCount: info.BulletCount,
                        Speed: info.Speed,
                        Score: info.Score,
                    }

                    objData.push(obj);
                });
            }
        });
        return objData;
    };
    SmartApps.tokenGame1.getPlayer = async (tokenId) => {
        var obj = {};
        await Game1.getOptions(tokenId).call().then((info) => {
            obj = {
                tokenId : tokenId,
                name : info.ClassName,
                Class : info.Class,
                Lever: info.Lever,
                Bullet: info.Bullet,
                BulletCount: info.BulletCount,
                Speed: info.Speed,
                Score: info.Score,
            }
        });
        return obj;
    };
    
    SmartApps.tokenGame1.upLever = async (tokenId) => {
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

    SmartApps.tokenGame1.buyMarketPlate = async (itemID) => {
        
        let checkPrice = await GameFatory.MarketPlaceItemOf(itemID).call();
       
        let allow = checkPrice.price;
        if(allow == 0){
            blockchain.notify("Item not avalible");
            return false;
        }
        let appoveAmount = await SmartApps.tokenSmart.allowance(ContractAddress.AddressContractNFTFactory);
        
        if(appoveAmount < allow) await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        

        await GameFatory.buyStars(itemID).send({gas:1000000}).then((value) => {
            console.log(value);
        });
    };


    SmartApps.tokenGame1.getBulletMarket = async () => {
        //await Game1.setFactory('0xd6d488258cdb2a4b583575467bfcc8abe2afd965').send({gas:30000});
        var obj = [];
        await GameFatory.getBulletMarket(4).call().then((value) => {

            for(var i=0;i<value.length;i++){
                var dataObj = {
                     name : value[i].name,
                     price : value[i].price,
                     lever : value[i].lever,
                     class : value[i].class,
                     bullet : value[i].bullet
                };
                
                obj.push(dataObj);
            }
            
        });
        console.log(obj);
        return obj;
    };


    SmartApps.tokenGame1.buyBullet = async (_tokenId, itemID) => {
        let allow = blockchain.toWei(500);
        let appoveAmount = await SmartApps.tokenSmart.allowance(ContractAddress.AddressContractNFTFactory);
         console.log(appoveAmount);
        if(appoveAmount < allow) await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        await GameFatory.MarketPlaceBulletOf(itemID).call().then((value) => {
            console.log(value);
        });

        await GameFatory.buyBullet(_tokenId, itemID).send({gas:300000}).then((value) => {
            console.log(value);
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