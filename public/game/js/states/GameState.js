var backgroundScreen;
var backgroundScreenHome;
var GameState = {
    create: async function () {
        game.stage.backgroundColor = '#333';

        game.groups = {};
        backgroundScreenHome = game.add.tileSprite(0, 0,game._width, game._height, "backgroundgame");
        backgroundScreenHome.anchor.setTo(0, 0);
        backgroundScreenHome.scale.set(1.5, 1.6);
        backgroundScreenHome.fixedToCamera = true;

        backgroundScreen = game.add.tileSprite(0, 0,game._width, game._height, "skys");
        var groups = ['bg', 'enemies', 'player', 'collectibles', 'shots', 'vfx', 'gui',"shop"];
        groups.forEach(function(item) {
            game.groups[item] = game.add.group();
        });
        initLevelData();
        game.playerShip = new PlayerShip();
        game.parallax = new Parallax();
        game.hud = new HUD();
        game.bulletBar = new BulletBars();
        game.spawner = new EnemySpawner();
        
        game.hash = game.web3.keccak256("https://starsbattle.co");
        game.socket = SmartApps.Blockchain.Socket();

        new OptionsBar();
        /*
        new AudioSwitch({
            type: 'sound',
            group: game.groups.gui,
            x: 200,
            y: 37,
            atlas: 'atlas',
            spriteOff: 'gui/icon_sound_off',
            spriteOn: 'gui/icon_sound_on'
        });
        new AudioSwitch({
            type: 'music',
            group: game.groups.gui,
            x: 255,
            y: 37,
            atlas: 'atlas',
            spriteOff: 'gui/icon_music_off',
            spriteOn: 'gui/icon_music_on'
        });      
        */
        /*
        if (!game.device.desktop) {
            var left = game.add.image(0, game.world.height - 128, 'atlas', 'gui/touch_left');
            left.alpha = 0.2;
            var right = game.add.image(game.world.width - 128, game.world.height - 128, 'atlas', 'gui/touch_right');
            right.alpha = 0.2;
        }
        */

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
        //console.log(game.socket);
        $("body #header").remove();
    },
    update : () => {
        backgroundScreen.tilePosition.y -=2;
        backgroundScreenHome.tilePosition.y +=0.5;
        //backgroundScreenHome.tilePosition.x +=1;
    }
};
function initLevelData() {
    storage = new Storage(game.settings.storagePrefix);
    var levels = [];
    for (var i = 0; i < 30; i++) {
        var level = {unlocked: i < game.currentLevel ? true : false, highscore: 0};
        levels.push(level);
    }
    levels[0].unlocked = true;

    storage.setItem('levels', JSON.stringify(levels));
}