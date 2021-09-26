var PlayerShip =   function() {

    
    this.getInfo().then((web3Player) => {
       
    
        Phaser.Sprite.call(this, game, game.world.centerX, game.world.height - 100, 'nftplayer', 'player_'+web3Player.Class);
        this.anchor.setTo(0.5);

        this.type = 'player';
        this.hp = 10;
        this.hpMax = this.hp;
        this.invincible = false;
        this.weapon = new Machinegun(this);
        this.weapon.fire(true);
        this.alive = true;
        this.score = 0;
        this.bullet = web3Player.Bullet;
        this.moveSpeed = web3Player.Speed > 2 ? web3Player.Speed : 7;
        this.tokenId = web3Player.tokenId;
        this.validateScore = web3Player.NextLeverScore;

        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

        this.shield = game.add.sprite(this.x, this.y, 'nftplayer', 'shield');
        this.shield.alpha = 0;
        this.shield.anchor.setTo(0.5);

        this.touchLeft = false;
        this.touchRight = false;
        this.showShop == false;

        game.input.onDown.add(this.onBeginTouch, this);
        game.input.onUp.add(this.onEndTouch, this)
        if (!game.device.desktop) {
            this.activePointer = game.input.activePointer;
        }
        game.groups.player.add(this);
        
        

        //console.log(pointer);
        
    });
}

PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
PlayerShip.prototype.constructor = PlayerShip;
PlayerShip.prototype.getInfo = async function() {
    let data = await game.web3.getPlayer(game.tokenId);
    return data;
}

PlayerShip.prototype.onBeginTouch = function(pointer) {
    

    if (!this.touchLeft && pointer.x < gameWidth / 2) {
        this.touchLeft = pointer;
    } else if (!this.touchRight && pointer.x >= gameWidth / 2) {
        this.touchRight = pointer;
    }

}

PlayerShip.prototype.onEndTouch = function(pointer) {
    //console.log(pointer);
    if (pointer === this.touchLeft) {
        this.touchLeft = false;
    } else if (pointer === this.touchRight) {
        this.touchRight = false;
    }
    
    game.backgrounds.drawBackground(this);// Set 3d
}


PlayerShip.prototype.update = function() {

    if(this.showShop == true && this.bullet > 0 && this.alive == false) {
        this.showShop == false;
        this.alive = true;
    }

    if(!this.alive) return;
    if(this.bullet < 1) {
        this.weapon.destroy();
        this.bullet = 0;
        this.alive = false;
        //if(this.showShop == false) {
            new ShopBullet();
        //}
        this.showShop == true;
    }


    // movement
    var left = this.leftKey.isDown ? -1 : 0;
    var right = this.rightKey.isDown? 1 : 0;
    var up = this.upKey.isDown ? -1 : 0;
    var down = this.downKey.isDown? 1 : 0;
    
    
    
   
    
    //console.log(pointer.isDown);
    
    var hsp = (left + right) * this.moveSpeed;
    var hsp2 = (up + down) * this.moveSpeed;


    

    if (!game.device.desktop) {
        var left = this.touchLeft ? -1 : 0;
        var right = this.touchRight.isDown? 1 : 0;
        if (this.activePointer.isDown) {
            left = this.activePointer.isDown && this.activePointer.x < this.x ? -1 : 0;
            right = this.activePointer.isDown && this.activePointer.x > this.x ? 1 : 0;
            up = this.activePointer.isDown && this.activePointer.y < this.y ? -1 : 0;
            down = this.activePointer.isDown && this.activePointer.y > this.y? 1 : 0;
            
        }
        var hsp = (left + right) * this.moveSpeed;
        var hsp2 = (up + down) * this.moveSpeed;
    }

    this.x += hsp;
    this.x = Phaser.Math.clamp(this.x, this.width/2, game.world.width - this.width/2);
    this.y += hsp2;
    this.y = Phaser.Math.clamp(this.y, this.height/2, game.world.height - this.height/2);

    this.shield.x = this.x;
    this.shield.y = this.y;

    // check for collision vs enemies
    if(!this.invincible) {
        for (var i = 0; i < game.groups.enemies.children.length; i++) {
            var enemy = game.groups.enemies.children[i];
            if (checkOverlap(this, enemy)) {
                this.getHit(1);
                break;
            }
        }
    }

    // check for collision vs collectibles
    for (var i = 0; i < game.groups.collectibles.children.length; i++) {
        var item = game.groups.collectibles.children[i];
        if (!item.toKill && checkOverlap(this, item)) {
            if (item instanceof Powerup) {
                item.toKill = true;
                game.audio.playSound('sndPowerup');
                if (item.type === 'weapon') {
                    this.weapon.upgrade();
                } else if (item.type === 'health') {
                    this.addHealth(5);
                } else if (item.type === 'shield') {
                    if (this.shield.alpha === 0) {
                        this.addShield();
                    }
                }
            }
        }
    };
}

PlayerShip.prototype.getHit = function(damage) {
    if(!this.alive) return;

    this.hp -= damage;
    this.hp = Math.max(this.hp, 0);

    game.hud.update();

    if (this.hp > 0) {
        this.invincible = true;
        this.alpha = 0;
        game.add.tween(this).to({alpha: 1}, 200, 'Linear', true, 0, 6, true).onComplete.add(this.resetInvincible, this);
    }
    game.audio.playSound('sndHit');
    if (this.hp <= 0) return this.die();
}

PlayerShip.prototype.resetInvincible = function() {
    this.alpha = 1;
    if (this.shield.alpha === 0) this.invincible = false;
}

PlayerShip.prototype.die = function() {
    game.audio.playSound('sndExplosion');
    this.alive = false;
    this.alpha = 0;
    this.weapon.destroy();
    new Explosion(this.x, this.y);
    new GameOver();
}

PlayerShip.prototype.addHealth = function(value) {
    this.hp += value;
    this.hp = Math.min(this.hpMax, this.hp);
    game.hud.update();
}

PlayerShip.prototype.addShield = function() {
    this.invincible = true;
    this.shield.alpha = 1;
    game.time.events.add(10000, this.removeShield, this);
}

PlayerShip.prototype.removeShield = function() {
    this.invincible = false;
    this.shield.alpha = 0;
}

PlayerShip.prototype.addScore = function(value) {
    this.score += value;
    game.hud.updateScore();
}
PlayerShip.prototype.addBullet = function(value) {
    this.bullet -= Number(value);
    game.bulletBar.updateBullet();
}