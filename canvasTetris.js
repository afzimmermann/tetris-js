var canvas = null;
var context = null;
var tetris = null;
var tetris2 = null;
var canvas2 = null;
var context2 = null;


//Canvas stuff
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

function animate(canvas, context, canvas2, context2) {
    // clear
    if(tetris.gameEnd){
    	alert("Score: "+ tetris.points);
    }else{
 		context.clearRect(0, 0, canvas.width, canvas.height);
 		context2.clearRect(0, 0, canvas2.width, canvas2.height);
    	tetris.draw();
    	tetris2.draw();
	    // request new frame
	    requestAnimFrame(function() {
   		smoothKeyHandle();	
	      animate(canvas, context, canvas2, context2);
	      tetris.timeElapsed++;
	      if(tetris.timeElapsed % GO_DOWN_INTERVAL === 0){
	      	tetris.animatePiece();
	      	tetris2.animatePiece();
	      }
	    });   	
    }
    
};

//END CANVAS

window.onload = function(){
	canvas  = document.getElementById("output");
	context = canvas.getContext('2d');
	tetris = new Tetris();
	tetris.output = new Output(context);
	tetris.initialize();

	canvas2  = document.getElementById("output2");
	context2 = canvas2.getContext('2d');
	tetris2 = new Tetris();
	tetris2.output = new Output(context2);
	tetris2.initialize();


	animate(canvas, context, canvas2, context2, new Date().getTime());
}

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
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
  if (Key.isDown(Key.UP) > 0){
  		if(Key._pressed[Key.UP] === 1){
  			tetris.move('TURN');	
  		}else if(Key._pressed[Key.UP] > 10){
  			tetris.move('TURN');
  			Key._pressed[Key.UP] = 1;
  		}
	Key._pressed[Key.UP]++;
  		
  }
  if (Key.isDown(Key.LEFT) > 0){
  		if(Key._pressed[Key.LEFT] === 1){
  			tetris.move('LEFT');	
  		}else if(Key._pressed[Key.LEFT] > 10){
  			tetris.move('LEFT');
  			Key._pressed[Key.LEFT] = 1;
  		}
	Key._pressed[Key.LEFT]++;
  		
  }
  if (Key.isDown(Key.DOWN) > 0){
  		if(Key._pressed[Key.DOWN] === 1){
  			tetris.move('DOWN');	
  		}else if(Key._pressed[Key.DOWN] > 3){
  			tetris.move('DOWN');
  			Key._pressed[Key.DOWN] = 1;
  		}
	Key._pressed[Key.DOWN]++;
  		
  }
  if (Key.isDown(Key.RIGHT) > 0){
  		if(Key._pressed[Key.RIGHT] === 1){
  			tetris.move('RIGHT');	
  		}else if(Key._pressed[Key.RIGHT] > 10){
  			tetris.move('RIGHT');
  			Key._pressed[Key.RIGHT] = 1;
  		}
	Key._pressed[Key.RIGHT]++;
  		
  }
};

document.onkeydown = function(e){
	switch(e.keyCode){
		case 65 : 
			tetris.move('LEFT');
			break;
		case 68 : 
			tetris.move('RIGHT');
			break;
		case 87 : 
			tetris.move('TURN');
			break;
		case 83 : 
			tetris.move('DOWN');
			break;
		default:
			return;
	}
}