var Bullet = function(x, y, type, damage) {
    Shot.call(this, x, y, type, damage, 'shots/spit');

    this.vsp = 25;
}

Bullet.prototype = Object.create(Shot.prototype);
Bullet.prototype.constructor = Bullet;    
