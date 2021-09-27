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
    game.playerShip.alive = false;
   
    
    game.socket.emit("update",{
                tokenId:game.playerShip.tokenId,
                score : game.playerShip.score, 
                bullet : game.playerShip.bullet, 
                lever : game.currentLevel,
                record : 0,
                hash : game.hash});

    $('#BulletModal').attr("data-tokenid",game.playerShip.tokenId);
    $('#BulletModal').modal('show');
    $(".btnBuyBulletExe").on("click", async function(){
        $("body").append('<div id="LoaddingGame"><div class="preloader"><span class="spinner spinner-round"></span></div></div>');
        var tokenid = $("#BulletModal").data("tokenid");
        var itemid = $(this).data("itemid");
        
        await game.web3.buyBullet(tokenid,itemid,game.playerShip.bullet, true).then(async (value) => {
            game.socket.emit("sync",{tokenId:game.playerShip.tokenId});
            let DataNew = await game.web3.getPlayer(game.playerShip.tokenId);
            game.playerShip.bullet = DataNew.Bullet;
            $('#BulletModal').modal('hide');
            game.playerShip.alive = true;
            $("body #LoaddingGame").remove();
        });
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