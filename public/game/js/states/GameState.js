var GameState = {
    create: async function () {
        game.stage.backgroundColor = '#c20ed7';

        game.groups = {};
        var backgroundScreen = game.add.tileSprite(0, 0,game.gameWidth, game.gameWidth, "backgroundgame");
        backgroundScreen.anchor.setTo(0, 0);
        backgroundScreen.scale.set(1.5, 1.6);
        backgroundScreen.fixedToCamera = true;
        var groups = ['bg', 'enemies', 'player', 'collectibles', 'shots', 'vfx', 'gui'];
        groups.forEach(function(item) {
            game.groups[item] = game.add.group();
        });

        game.playerShip = new PlayerShip();
        game.parallax = new Parallax();
        game.hud = new HUD();
        game.bulletBar = new BulletBars();
        game.spawner = new EnemySpawner();
        //await game.web3.mint();
        //console.log(game.web3.getBalt());
        new AudioSwitch({
            type: 'sound',
            group: game.groups.gui,
            x: 160,
            y: 37,
            atlas: 'atlas',
            spriteOff: 'gui/icon_sound_off',
            spriteOn: 'gui/icon_sound_on'
        });
        new AudioSwitch({
            type: 'music',
            group: game.groups.gui,
            x: 215,
            y: 37,
            atlas: 'atlas',
            spriteOff: 'gui/icon_music_off',
            spriteOn: 'gui/icon_music_on'
        });      

        if (!game.device.desktop) {
            var left = game.add.image(0, game.world.height - 128, 'atlas', 'gui/touch_left');
            left.alpha = 0.2;
            var right = game.add.image(game.world.width - 128, game.world.height - 128, 'atlas', 'gui/touch_right');
            right.alpha = 0.2;
        }

        var canvas = document.querySelector('canvas');
        
        if(canvas.getContext) {
            var ctx = canvas.getContext('2d', {
            alpha: false,
            });
            game.gameWidth = canvas.width;
            game.gameHeight = canvas.height;
            game.backgrounds = new Backgroun3d({
                width   : canvas.width,
                height  : canvas.height,
                ctx     : ctx
            });
            game.backgrounds.initStars();
        }
    }
};