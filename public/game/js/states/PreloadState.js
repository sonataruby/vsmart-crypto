var PreloadState = {
    preload: function() {
        // show logo and progress bar
        game.preloadLogo = game.add.image(game.world.width/2, game.world.height/2-100, 'preload', 'logo');
        game.preloadLogo.anchor.setTo(0.5);
        
        game.preloadBar = game.add.sprite(game.world.width/2, game.world.height/2+100, 'preload', 'progress');
        game.preloadBar.x -= game.preloadBar.width/2;
        game.load.setPreloadSprite(game.preloadBar);
        
        // load assets 
        game.load.atlasJSONHash('atlas', 'game/assets/images/atlas.png', 'game/assets/images/atlas.json');
        game.load.atlasJSONHash('nftplayer', 'game/assets/images/player.png', 'game/assets/images/player.json');
        game.load.atlasJSONHash('npc', 'game/assets/images/npc.png', 'game/assets/images/npc.json');
        game.load.atlasJSONHash('scene', 'game/assets/images/scene.png', 'game/assets/images/scene.json');
        

        // audio
        game.load.audio('sndPew', 'game/assets/audio/pew.mp3', 'game/assets/audio/pew.ogg');
        game.load.audio('sndPistol', 'game/assets/audio/pistol.mp3', 'game/assets/audio/pistol.ogg');
        game.load.audio('sndGeneric', 'game/assets/audio/generic.mp3', 'game/assets/audio/generic.ogg');
        game.load.audio('sndPowerup', 'game/assets/audio/powerup.mp3', 'game/assets/audio/powerup.ogg');
        game.load.audio('sndExplosion', 'game/assets/audio/explosion.mp3', 'game/assets/audio/explosion.ogg');
        game.load.audio('sndHit', 'game/assets/audio/hit.mp3', 'game/assets/audio/hit.ogg');
        game.load.audio('musicOst', 'game/assets/audio/ost.mp3', 'game/assets/audio/ost.ogg');
    },
    
    create: function() {
        game.audio.addSound('sndPew', true);
        game.audio.addSound('sndPistol', true);
        game.audio.addSound('sndGeneric', true);
        game.audio.addSound('sndPowerup', true);
        game.audio.addSound('sndExplosion', true);
        game.audio.addSound('sndHit', true);

        game.audio.addMusic('musicOst');
        game.audio.playMusic('musicOst');
        // start game
        game.state.start('MainMenuState');
    }
};