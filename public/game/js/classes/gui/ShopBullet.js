var ShopBullet = function() {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY + 1000, 'control', 'gui/shop_bg');
    game.groups.shop.add(this);
    this.anchor.setTo(0.5);
    game.add.tween(this).to({y: '-1000'}, 500, 'Bounce', true).onComplete.add(this.showButtons, this);
    this.childGroup = game.add.group();
}

ShopBullet.prototype = Object.create(Phaser.Sprite.prototype);
ShopBullet.prototype.constructor = GameOver;

ShopBullet.prototype.showButtons = async function() {
    await game.web3.getBulletMarket(5).then((value) => {
       
        for (var i = 0; i < value.length; i++) {
            
            var button = game.add.button((game.world.centerX - 150) + (i % 3) * 160,  (game.world.centerY - 80) + Math.floor(i / 3) * 210, 'control', async function(button){
                //game.add.tween(game.groups.shop).to({y: 1299}, 500, 'Bounce', true);
                this.remove();
                //game.tween.removeFrom(ShopBullet)
                //game.state.start('GameState');
                //await game.web3.buyBullet(game.tokenId, button.tokenItem);
                
            }, this, 'gui/bulletshop_bg', 'gui/bulletshop_bg');
            button.tokenItem = (i + 1);
            button.anchor.setTo(0.5);
            var PlayerImage = game.add.image(button.x + 50, button.y, 'nftplayer','player_'+(i+1));
            PlayerImage.anchor.setTo(0.9);

            var txt = game.add.text(button.x + 10, button.y + 25, value[i].price + " Stars");
            txt.font = 'square';
            txt.anchor.setTo(0.5);
            txt.align = 'right';
            txt.fontSize = 18;
            txt.fill = '#fff';
            txt.stroke = '#000';
            txt.strokeThickness = 4;

            var txtBullet = game.add.text(button.x + 10, button.y + 50, value[i].bullet);
            txtBullet.font = 'square';
            txtBullet.anchor.setTo(0.5);
            txtBullet.align = 'right';
            txtBullet.fontSize = 18;
            txtBullet.fill = '#fff';
            txtBullet.stroke = '#000';
            txtBullet.strokeThickness = 4;

            this.childGroup.add(button);
            this.childGroup.add(txt);
            this.childGroup.add(txtBullet);
            this.childGroup.add(PlayerImage);
        }
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