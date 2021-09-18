var HealthBar = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'gui/health_bar_bg');

    this.fill = game.add.image(30, 27, 'atlas', 'gui/health_bar_fill');

    game.groups.gui.add(this);
}

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.updateHealth = function() {
    var scale = game.playerShip.hp / game.playerShip.hpMax;
    game.add.tween(this.fill.scale).to({x: scale}, 250, 'Linear', true);
}