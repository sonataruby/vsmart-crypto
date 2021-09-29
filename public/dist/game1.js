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
    
    SmartApps.tokenGame1.getTest =async (id) =>{
        var check = await Game1.LeverHistory('0x4bcf94e14907989227d683f8d3efce3a82ae5402',2).call();
         console.log(check);
    }
    SmartApps.tokenGame1.getBalt = async (returnAuto) => {
        
       

        var objData = [];
        
        await Game1.getTokenOwner(login_wallet).call().then(async (value) => {

            for(var i=0;i<value.length;i++){
               
                await axios.get("https://api.starsbattle.co/layer/"+value[i]).then((value2) => {
                    var info = value2.data;
                    
                    var obj = {
                        tokenId : value[i],
                        name : info.name,
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
        if(objData.length == 0 && returnAuto == undefined){
            window.location.href="/app/marketplace";
        }
        return objData;
    };
    SmartApps.tokenGame1.getPlayer = async (tokenId) => {

        var obj = {};
        await axios.get("https://api.starsbattle.co/layer/"+tokenId).then((value) => {
            obj = value.data;
        });
       
        return obj;
    };
    
    SmartApps.tokenGame1.upLever = async (tokenId, _score, _bullet) => {
        let lever = 0;


        await axios.post("https://api.starsbattle.co/uplever",{
            tokenid : tokenId,
            score : _score,
            bullet : _bullet,
            wallet : login_wallet
        }).then(async (value) => {
            
            if(value.data.status == "update"){
                var hash = value.data.hash;
                await Game1.upLeverStart(hash).send({gas:300000, data: login_wallet}).then((data) => {
                   
                    if(data.transactionHash){
                        lever = 1;
                    }
                });
            }
        });
        
        return lever;
    };

    
    SmartApps.tokenGame1.getMarketPlate = async (number) => {
        //await Game1.setFactory('0xd6d488258cdb2a4b583575467bfcc8abe2afd965').send({gas:30000});
        //blockchain.notifyWait();
        var obj = [];
        await GameFatory.getMarketStars(number+1).call().then((value) => {
           
            for(var i=0;i<value.length;i++){
                
                if(i > 0){

                    var dataObj = {
                         id : i,
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
        
        var obj = [];
        await GameFatory.getBulletMarket(number).call().then((value) => {

            for(var i=0;i<value.length;i++){
                   
                    var dataObj = {
                         id : i+1,
                         name : value[i].name,
                         price : blockchain.fromWei(value[i].price),
                         bullet : value[i].bullet
                    };

                
                    obj.push(dataObj);
                
            }
            
        });
        
        return obj;
    };


    SmartApps.tokenGame1.buyBullet = async (_tokenId, itemID, gamebullet, returndata) => {

        let checkPrice = await GameFatory.MarketPlaceBulletOf(itemID).call();

        let allow = checkPrice.price;
        if(allow == 0){
            blockchain.notify("Item not avalible");
            return false;
        }
        //let appoveAmount = await SmartApps.tokenSmart.allowance(ContractAddress.AddressContractNFTFactory);

        gamebullet = Number(gamebullet) < 0 ? 0 : gamebullet;
        var returnValue = 0;
        let checkAllow = await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        console.log(checkAllow);
        if(checkAllow == true){
            try {
                await GameFatory.buyBullet(_tokenId, itemID, gamebullet).send({gas:300000}).then(async (value) => {
                       blockchain.notify("Item Update");
                       if(returndata == true){

                            returnValue = 1;
                       }else{
                            await SmartApps.Blockchain.Socket().emit("buybulet",{tokenId : _tokenId}, function(value){
                                //console.log(value);
                                window.location.href="/app/my";
                            });
                            //await axios.post("https://api.starsbattle.co/nft",{tokenid : _tokenId});
                            
                       }
                      
                });
            
            } catch(e) {
                return false;
            }
        }
        return returnValue;
        
    };

     SmartApps.tokenGame1.buyVip = async (_tokenId, itemID) => {
        let checkPrice = await GameFatory.VipOf(itemID).call();
       
        let allow = checkPrice.price;
        if(allow == 0){
            blockchain.notify("Item not avalible");
            return false;
        }
        
        
        let checkAllow =  await SmartApps.tokenSmart.approve(ContractAddress.AddressContractNFTFactory,allow);
        if(checkAllow == true){
            await GameFatory.buyVip(_tokenId, itemID).send({gas:300000}).then(async (value) => {
                blockchain.notify("VIP Update");
                await SmartApps.Blockchain.Socket().emit("buyvip",{tokenId : _tokenId}, function(value){
                    //console.log(value);
                    window.location.href="/app/my";
                });
            });
        }
        
    };
    

    SmartApps.tokenGame1.Init = async () =>{
        await blockchain.init();
        Game1 = await blockchain.loadContractGame1();
        GameFatory = await blockchain.loadContractNFTFactory();
        login_wallet = await blockchain.getLoginWallet();
       

        
    }


    SmartApps.components.docReady.push(SmartApps.tokenGame1.Init);
    return SmartApps;
})(SmartApps, jQuery, window);