var Machinegun = function(parent) {
    this.parent = parent;
    this.reloading = false;
    this.reloadTime = 0.3
    this.shot = Bullet;
    this.damage = 1;

    this.level = 1;
    this.cannon = -1;

    this.active = true;
}

Machinegun.prototype.fire = function(repeat) {

    if (!this.active) return;
    if (this.reloading) return;
    this.reloading = true;
    //this.shot = SSBullet;
    if (this.parent instanceof PlayerShip) {
        if (this.level === 1) {
            new this.shot(this.parent.x * this.cannon, this.parent.y - 20, this.parent.type, this.damage);
            this.cannon *= -1;
        } else {
            new this.shot(this.parent.x - 24, this.parent.y - 20, this.parent.type, this.damage);
            new this.shot(this.parent.x + 24, this.parent.y - 20, this.parent.type, this.damage);

        }
        
        if (this.active) game.playerShip.addBullet(1);

    } else if (this.parent instanceof Scout) {
        new this.shot(this.parent.x - 24, this.parent.y + 20, this.parent.type, this.damage);
        new this.shot(this.parent.x + 24, this.parent.y + 20, this.parent.type, this.damage);
    }
    
    new SSBullet(this.parent.x * this.cannon, this.parent.y - 20, this.parent.type, this.damage, "left");
    new SSBullet(this.parent.x * this.cannon, this.parent.y - 20, this.parent.type, this.damage, "right");
    new Spit(this.parent.x * this.cannon, this.parent.y - 20, this.parent.type, this.damage);

    game.audio.playSound('sndPew');
    game.time.events.add(this.reloadTime * 1000, this.reload, this, repeat);
}

Machinegun.prototype.reload = function(repeat) {
    this.reloading = false;
    if (repeat) this.fire(true);
}

Machinegun.prototype.upgrade = function() {
    if (this.level === 4) return;
    this.level += 1;

    if (this.level === 3) {
        this.shot = BulletBig;
        //this.shot = SSBullet;
        this.damage = 2;
    }

    if (this.level === 4) {
        this.reloadTime = 0.25;
    }

}

Machinegun.prototype.destroy = function() {
    this.active = false;
}