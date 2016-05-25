var allGames = new Array();
var timeElapsed = 0;
var endGame = false;
function TetrisGame(outputName, playerName) {
  this.canvas  = document.getElementById(outputName);
  this.context = this.canvas.getContext('2d');
  this.tetris = new Tetris(playerName);

  this.tetris.output = new Output(this.context);
  this.tetris.initialize();
};


//Canvas stuff
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

function animate(allGames) {
    for(var i = 0; i < allGames.length; i++){
       var tetrisGame = allGames[i];

      if(tetrisGame.tetris.gameEnd){
        endGame = tetrisGame.tetris.gameEnd;
        alert("Score: "+ tetrisGame.tetris.points);
      }else{
        tetrisGame.context.clearRect(0, 0, tetrisGame.canvas.width, tetrisGame.canvas.height);
        tetrisGame.tetris.draw();
      }
    }

    if(!endGame){
      // request new frame
        requestAnimFrame(function() {
        smoothKeyHandle();  
          animate(allGames);
          timeElapsed++;
          if(timeElapsed % GO_DOWN_INTERVAL === 0){
             for(var i = 0; i < allGames.length; i++){
                var tetrisGame = allGames[i];
                tetrisGame.tetris.animatePiece();
            }
          }
      });  
    }
    
};

//END CANVAS

window.onload = function(){

  allGames.push(new TetrisGame('output', 'player1'));
  allGames.push(new TetrisGame('output2', 'player2'));
	
	animate(allGames);
}

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  LEFT_p2: 65,
  UP_p2: 87,
  RIGHT_p2: 68,
  DOWN_p2: 83,
  
  isDown: function(keyCode) {
     return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
     this._pressed[event.keyCode] = 1;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);


function smoothKeyHandle() {

  //P1
  if (Key.isDown(Key.UP) > 0){
  		if(Key._pressed[Key.UP] === 1){
  			allGames[0].tetris.move('TURN');	
  		}else if(Key._pressed[Key.UP] > 10){
  			allGames[0].tetris.move('TURN');
  			Key._pressed[Key.UP] = 1;
  		}
	Key._pressed[Key.UP]++;
  		
  }
  if (Key.isDown(Key.LEFT) > 0){
  		if(Key._pressed[Key.LEFT] === 1){
  			allGames[0].tetris.move('LEFT');	
  		}else if(Key._pressed[Key.LEFT] > 10){
  			allGames[0].tetris.move('LEFT');
  			Key._pressed[Key.LEFT] = 1;
  		}
	Key._pressed[Key.LEFT]++;
  		
  }
  if (Key.isDown(Key.DOWN) > 0){
  		if(Key._pressed[Key.DOWN] === 1){
  			allGames[0].tetris.move('DOWN');	
  		}else if(Key._pressed[Key.DOWN] > 3){
  			allGames[0].tetris.move('DOWN');
  			Key._pressed[Key.DOWN] = 1;
  		}
	Key._pressed[Key.DOWN]++;
  		
  }
  if (Key.isDown(Key.RIGHT) > 0){
  		if(Key._pressed[Key.RIGHT] === 1){
  			allGames[0].tetris.move('RIGHT');	
  		}else if(Key._pressed[Key.RIGHT] > 10){
  			allGames[0].tetris.move('RIGHT');
  			Key._pressed[Key.RIGHT] = 1;
  		}
	Key._pressed[Key.RIGHT]++;
  }

  //P2

if (Key.isDown(Key.UP_p2) > 0){
      if(Key._pressed[Key.UP_p2] === 1){
        allGames[1].tetris.move('TURN');  
      }else if(Key._pressed[Key.UP_p2] > 10){
        allGames[1].tetris.move('TURN');
        Key._pressed[Key.UP_p2] = 1;
      }
  Key._pressed[Key.UP_p2]++;
      
  }
  if (Key.isDown(Key.LEFT_p2) > 0){
      if(Key._pressed[Key.LEFT_p2] === 1){
        allGames[1].tetris.move('LEFT');  
      }else if(Key._pressed[Key.LEFT_p2] > 10){
        allGames[1].tetris.move('LEFT');
        Key._pressed[Key.LEFT_p2] = 1;
      }
  Key._pressed[Key.LEFT_p2]++;
      
  }
  if (Key.isDown(Key.DOWN_p2) > 0){
      if(Key._pressed[Key.DOWN_p2] === 1){
        allGames[1].tetris.move('DOWN');  
      }else if(Key._pressed[Key.DOWN_p2] > 3){
        allGames[1].tetris.move('DOWN');
        Key._pressed[Key.DOWN_p2] = 1;
      }
  Key._pressed[Key.DOWN_p2]++;
      
  }
  if (Key.isDown(Key.RIGHT_p2) > 0){
      if(Key._pressed[Key.RIGHT_p2] === 1){
        allGames[1].tetris.move('RIGHT'); 
      }else if(Key._pressed[Key.RIGHT_p2] > 10){
        allGames[1].tetris.move('RIGHT');
        Key._pressed[Key.RIGHT_p2] = 1;
      }
  Key._pressed[Key.RIGHT_p2]++;
  }

};
