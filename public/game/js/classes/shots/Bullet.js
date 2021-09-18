var Bullet = function(x, y, type, damage) {
    Shot.call(this, x, y, type, damage, 'shots/bullet');

    this.vsp = 20;
}

Bullet.prototype = Object.create(Shot.prototype);
Bullet.prototype.constructor = Bullet;    
