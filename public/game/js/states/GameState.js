var GameState = {
    create: function () {
        game.stage.backgroundColor = '#000';

        game.groups = {};
        var groups = ['bg', 'enemies', 'player', 'collectibles', 'shots', 'vfx', 'gui'];
        groups.forEach(function(item) {
            game.groups[item] = game.add.group();
        });

        game.playerShip = new PlayerShip();
        game.parallax = new Parallax();
        game.hud = new HUD();
        game.bulletBar = new BulletBars();
        game.spawner = new EnemySpawner();

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
    },
};