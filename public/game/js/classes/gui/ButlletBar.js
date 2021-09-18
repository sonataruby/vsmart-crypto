var BulletBars = function() {
    //this.bulletBar = new BulletBars(20, 20);

    this.bulletCount = game.add.text(game.world.width - 100, 56, game.playerShip.score);
    this.bulletCount.anchor.setTo(0.5, 1);
    this.bulletCount.align = 'right';
    this.bulletCount.fill = '#fff';
    this.bulletCount.stroke = '#000';
    this.bulletCount.strokeThickness = 4;
    this.bulletCount.font = 'square';
    this.bulletCount.fontSize = 40;
}

BulletBars.prototype.update = function() {
    this.bulletCount.text = 100;
}

BulletBars.prototype.updateScore = function() {
    //this.score.text = game.playerShip.score;
}