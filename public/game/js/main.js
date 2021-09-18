var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
var Phaser = Phaser || {};
var gameWidth = width > 500 ? width - 130 : width + 130;
var gameHeight = height;



var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS,'game');
game.settings = {
    'lockOrientation': true, // should we prevent a player from playing using incorrect orientation?
    'displayOrientation': 'portrait', // portrait, landscape
    'storagePrefix': 'o10_' // prefix for local storage items
}

game.state.add('BootState', BootState);
game.state.add('PreloadState', PreloadState);
game.state.add('MainMenuState', MainMenuState);
game.state.add('SelectLevelState', SelectLevelState);
game.state.add('GameState', GameState);