SmartApps = (function (SmartApps, $, window) {
        "use strict";
        
    
    var Game1;
   
   
    var login_wallet;
    let GAS = 300000; 
    let blockchain = SmartApps.Blockchain;
    var ContractAddress = blockchain.address();
    var login_wallet;

    SmartApps.tokenGame1 = {};
    SmartApps.tokenGame1.mint = async (className) => {
        await Game1.mintStars(login_wallet,"BAT 1",className,1,100,0,7).send({gas:50000}).then((value) => {
            console.log(value);
        });
    };
    SmartApps.tokenGame1.getBalt = async () => {
        var objData = [];
        await Game1.getTokenOwner(login_wallet).call().then(async (value) => {
            for(var i=0;i<value.length;i++){
                await Game1.getOptions(value[i]).call().then((info) => {
                   
                    var obj = {
                        tokenId : value[i],
                        ClassName : info.ClassName,
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
                ClassName : info.ClassName,
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
    
    SmartApps.tokenGame1.Init = async () =>{
        await blockchain.init();
        Game1 = await blockchain.loadContractGame1();
        login_wallet = await blockchain.getLoginWallet();
        
        //console.log(ContractAddress.AddressContractGame1);
    }

    SmartApps.components.docReady.push(SmartApps.tokenGame1.Init);
    return SmartApps;
})(SmartApps, jQuery, window);