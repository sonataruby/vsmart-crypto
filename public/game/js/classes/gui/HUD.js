var HUD = function() {
    this.healthBar = new HealthBar(20, 20);

    this.score = game.add.text(game.world.width - 50, 56, game.playerShip.score);
    this.score.anchor.setTo(0.5, 1);
    this.score.align = 'right';
    this.score.fill = '#fff';
    this.score.stroke = '#000';
    this.score.strokeThickness = 4;
    this.score.font = 'square';
    this.score.fontSize = 20;
}

HUD.prototype.update = function() {
    this.healthBar.updateHealth();
}

HUD.prototype.updateScore = function() {
    this.score.text = "Score : " + game.playerShip.score;
}