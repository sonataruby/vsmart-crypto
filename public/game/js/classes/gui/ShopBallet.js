var ShopBallet = {
    Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY + 1000, 'control', 'gui/shop_bg');
    game.groups.shop.add(this);
    this.anchor.setTo(0.5);
}