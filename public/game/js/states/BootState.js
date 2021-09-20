var BootState = {
    init: function() {
        // Responsive scaling
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Center the game
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        
    },
    
    preload: function() {
        game.load.atlasJSONHash(
            'preload',
            '/dist/game/starsbattle/images/preload_atlas.png',
            '/dist//game/starsbattle/images/preload_atlas.json'           
        );
    },
    
    create: function () {
        game.stage.backgroundColor = '#fff';
        
        // add orientation controller
        if (game.settings.lockOrientation) {
            game.orientation = new Orientation(game.settings.displayOrientation);   
            game.orientation.checkOrientation();
        }        
        
        // add storage controller
        game.storage = new Storage(game.settings.storagePrefix);
        
        // add audio controller
        game.audio = new AudioController();
        
        if (game.storage.getItem('levels', 'string') === null) initLevelData();

        // start preload state
        game.state.start('PreloadState')
    }
};

function initLevelData() {
    
    var levels = [];
    for (var i = 0; i < 30; i++) {
        var level = {unlocked: false, highscore: 0};
        levels.push(level);
    }
    levels[0].unlocked = true;

    game.storage.setItem('levels', JSON.stringify(levels));
}