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

        var CreateObjectID = "Object"+Math.floor(Math.random() * 9999999999999);
        $("body").append('<div id="LoaddingGame"><div class="preloader"><span class="spinner spinner-round"></span></div></div>');

        $('body').append('<div class="modal fade" id="'+CreateObjectID+'"  data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">'+
                '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">'+
                    '<div class="modal-content">'+
      
                    '<div class="modal-body">'+
                    '<div class="row"></div>'+
                '</div>'+
      
                '</div>'+
            '</div>'+
        '</div>');
        let batllat = await game.web3.getBalt();
        //await game.web3.mint(3);
        var html = '';
        for (var i = 0; i < batllat.length; i++) {
            
          var tokenId =  batllat[i].tokenId;
          var lever =  batllat[i].Lever;
          var img = batllat[i].Class;
          html += '<div class="col-sm-4 col-6 mb-4">';
          html += '          <div class="card">';
          html += '            <div class="card-body playItems" data-tokenid="'+tokenId+'" data-level="'+lever+'">';
          html += '              ID : '+tokenId+'<br>';
          html += '              <img src="/nfts/'+img+'.png" style="width:100%; height:120px;">';
          html += '              <b>'+batllat[i].name+'</b><br>';
          html += '              Lever : '+batllat[i].Lever+'<br>';
          html += '              Bullet : '+batllat[i].Bullet+'<br>';
          html += '            </div>';
          html += '          </div>';
          html += '</div>';
        
                

            //PlayerImage.alpha = 0.5;
        }
        $("#"+CreateObjectID+" .modal-body .row").html(html);

        //$('#BulletModal').attr("data-tokenid",game.playerShip.tokenId);
        $("#"+CreateObjectID).modal('show');

        $('.playItems').on("click", function(){
            var tokenPlay = $(this).data("tokenid");
            var currentLevel = $(this).data("level");
            game.tokenId = tokenPlay;
            game.currentLevel = Number(currentLevel);
           // console.log(game.currentLevel);
           // game.currentLevel = 
           $("#"+CreateObjectID).modal('hide');
            game.state.start('GameState');
        });

        $("body #LoaddingGame").remove();
        //game.state.start('GameState');
    },
    update : () => {
        //console.log(backgroundScreen);
        backgroundScreen.tilePosition.y +=2;
    }
}

