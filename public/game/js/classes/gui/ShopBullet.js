var ShopBullet = function() {
    //Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY + 1000, 'control', 'gui/shop_bg');
    //game.groups.shop.add(this);
    //this.anchor.setTo(0.5);
    this.showButtons();
    this.childGroup = game.add.group();
}

ShopBullet.prototype = Object.create(Phaser.Sprite.prototype);
ShopBullet.prototype.constructor = GameOver;

ShopBullet.prototype.showButtons = async function() {
    game.pause = true;
   
    
    game.socket.emit("update",{
                tokenId:game.playerShip.tokenId,
                score : game.playerShip.score, 
                bullet : game.playerShip.bullet, 
                lever : game.currentLevel,
                record : 0,
                hash : game.hash});

    var dataBullet = await game.web3.getBulletMarket(6);
    var CreateObjectID = "Object"+Math.floor(Math.random() * 9999999999999);


    var html = '';
    for(var i =0;i<dataBullet.length;i++){
        var id = Number(dataBullet[i].id);
        html += '<div class="col-4 btnBuyBulletExe" data-itemid="'+id+'"><img src="/nfts/bullet/'+id+'.gif" style="width:100%"><b>'+dataBullet[i].name+'</b><br>'+dataBullet[i].price+' STARTS<br>Bullet : '+dataBullet[i].bullet+'</div>';
    }
    $("#BulletModal .modal-body .row").html(html);

    $('#BulletModal').attr("data-tokenid",game.playerShip.tokenId);
    $('#BulletModal').modal('show');

    $(".btnBuyBulletExe").on("click", async function(){
        $("body").append('<div id="LoaddingGame"><div class="preloader"><span class="spinner spinner-round"></span></div></div>');
        var tokenid = $("#BulletModal").data("tokenid");
        var itemid = $(this).data("itemid");
        
        await game.web3.buyBullet(tokenid,itemid,game.playerShip.bullet, true).then(async (value) => {
            await game.socket.emit("sync",{tokenId:game.playerShip.tokenId}, function(data){
                console.log(data.Bullet);
                game.playerShip.bullet = data.Bullet;
                game.currentLevel = data.Lever;
                //game.playerShip.start();

            });
            
            
            $('#BulletModal').modal('hide');
            $("body #LoaddingGame").remove();
        });
    });

    $("#BulletModal").on("hidden.bs.modal", function () {
        game.pause = false;
        game.playerShip.weapon.fire(true);
        game.spawner.spawn();
    });

    
    
}
ShopBullet.prototype.update = function() {
    //console.log(this.x);
    //this.destroy();
}
ShopBullet.prototype.remove = function() {
    //console.log(this.x);
    this.destroy();
    this.childGroup.destroy();
}