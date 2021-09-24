var SSBullet = function(x, y, type, damage, moveData) {
    Shot.call(this, x, y, type, damage, 'shots/laser');
    this.moveX = this.x;
    this.moveY = this.y;
    this.vsp = 5;
    this.moveData = moveData;
}

SSBullet.prototype = Object.create(Shot.prototype);
SSBullet.prototype.constructor = SSBullet;    

SSBullet.prototype.update = function() {
    //var seed = (this.x + this.moveX) * 10;
    if(this.moveData == "left"){
        this.x += 1;
        this.y += this.vsp * this.direction;
        if (this.hsp) this.x += this.hsp;
    }
    
    if(this.moveData == "right"){
        this.x -= 1;
        this.y += this.vsp * this.direction;
        if (this.hsp) this.x += this.hsp;
    }
    // outside world bounds
    if (this.y < -50 || this.y > game.world.height + 50) return this.destroy();

    // collision w/enemies or player
    for (var i = 0; i < this.vsGroup.children.length; i++) {
        var object = this.vsGroup.children[i];
        if (!object.invincible && checkOverlap(this, object)) {
            object.getHit(this.damage);
            this.die();
            break;
        }
    }
}