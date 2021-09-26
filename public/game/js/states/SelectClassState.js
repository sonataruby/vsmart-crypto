var backgroundScreen;
var SelectClassState = {
    create: async function() {

        game.stage.backgroundColor = '#140c32';
        var backgroundScreenHome = game.add.tileSprite(0, 0,game._width, game._height, "backgroundgame");
        backgroundScreenHome.anchor.setTo(0, 0);
        backgroundScreenHome.scale.set(1.5, 1.6);
        backgroundScreenHome.fixedToCamera = true;
        

        backgroundScreen = game.add.tileSprite(0, 0,game._width, game._height, "skys");
        

        for (var i = 0; i < 10; i++) {
            var piece = game.add.image(irandom(game.world.width), irandom(game.world.height), 'atlas', 'parallax/'+choose('far_0','far_1','far_2', 'far_3', 'far_4'));
            piece.alpha = 0.5;
        }

        /*

        this.backgrounds = [];
        for (let i = 0; i < 5; i += 1) {
          const bg = new ScrollingBackground(this, 'sprBg0', i * 10);
          this.backgrounds.push(bg);
        }
        */
        
        let batllat = await game.web3.getBalt();
        //await game.web3.mint(3);

        for (var i = 0; i < batllat.length; i++) {
            
            var button = game.add.button((game.work.X + 55) + i % 3 * 156, 190 + Math.floor(i / 3) * 156, 'bgroup', function(button){
                game.currentLevel = button.lever;
                game.currentClass = button.class;
                game.tokenId      = button.tokenId;
                game.state.start('GameState');
            }, this, 'gui/level_bg', 'gui/level_bg');
            button.class = batllat[i].Class;
            button.lever = batllat[i].Lever;
            button.tokenId = batllat[i].tokenId;
            //button.anchor.setTo(0.5);

            var PlayerImage = game.add.image(button.x + 20, button.y + 15, 'nftplayer','player_'+batllat[i].Class);
            //PlayerImage.anchor.setTo(0.5);

            var txt = game.add.text(button.x + 41, button.y + 36, batllat[i].Lever);
                txt.font = 'square';
                txt.anchor.setTo(0.5);
                txt.align = 'center';
                txt.fontSize = 36;
                txt.fill = '#fff';
                txt.stroke = '#000';
                txt.strokeThickness = 4;
            

            var txtBulet = game.add.text(button.x + 41, button.y + 72, batllat[i].Bullet);
                txtBulet.font = 'square';
                txtBulet.anchor.setTo(0.5);
                txtBulet.align = 'center';
                txtBulet.fontSize = 12;
                txtBulet.fill = '#fff';
                txtBulet.stroke = '#000';
                txtBulet.strokeThickness = 4;
                

            //PlayerImage.alpha = 0.5;
        }



        //game.state.start('GameState');
    },
    update : () => {
        //console.log(backgroundScreen);
        backgroundScreen.tilePosition.y +=2;
    }
}

