var BLOCK_SIZE = 25;
var GO_DOWN_INTERVAL = 35;

var canvas = null;
var context = null;


//Canvas stuff
window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
})();

function animate(canvas, context) {
    // clear
    if(tetris.gameEnd){
    	alert("Score: "+ tetris.points);
    }else{
 		context.clearRect(0, 0, canvas.width, canvas.height);
    	tetris.draw(tetris.grid);
	    // request new frame
	    requestAnimFrame(function() {
   		smoothKeyHandle();	
	      animate(canvas, context);
	      tetris.timeElapsed++;
	      if(tetris.timeElapsed % GO_DOWN_INTERVAL === 0){
	      	tetris.animatePiece();
	      }
	    });   	
    }
    
};

//END CANVAS
colorMap = ['', 'purple', 'yellow', '00FFFF', 'orange', 'blue', 'green', 'red'];
var shapes = {
   	t : {
   		position : [[4,0], [4,1], [3,1], [5,1]],
   		color : 1
   	},
   	o : {
   		position: [[4,0], [4,1], [5,0], [5,1]],
   		color: 2
   	},
   	i : {
   		position: [[4,0], [4,1], [4,2], [4,3]],
   		color: 3	
   	}, 
   	l : {
   		position: [[4,0], [4,1], [4,2], [5,2]],
   		color: 4
   	},
   	j : {
   		position: [[5,0], [5,1], [4,2], [5,2]],
   		color: 5	
   	}, 
   	s : {
   		position: [[4,0], [4,1], [5,1], [5,2]],
   		color: 6	
   	},
   	z : {
   		position: [[5,0], [4,1], [5,1], [4,2]],
   		color: 7	
   	} ,

   	getRandom: function(){
   		var allPieces = [shapes.t, shapes.o, shapes.i, shapes.l, shapes.j, shapes.s, shapes.z];
   		var randomNumber = Math.floor((Math.random() * 7));
   		//Workaround to clone piece.
   		return JSON.parse(JSON.stringify(allPieces[randomNumber]));
   	}
 };

var reverseMatrix = [[0, -1], [1, 0]];

var piece = {
	position : null,
	color: null,
	goDown: function(){
		var temp = new Array();
		for(var i = 0; i<4; i++){
		 	temp[i] = [piece.position[i][0], (piece.position[i][1] +1)];
		}
		if(!piece.detectColision(temp, 'DOWN')){
			for(var i = 0; i<4; i++){
				piece.position[i] = temp[i];
			}
		}
	},

	rotate: function(pivot, point){
		pivotVector = new Array();
		pivotVector[0] = point[0] - pivot [0];
		pivotVector[1] = point[1] - pivot [1];

		transformedVector = new Array();
		transformedVector[0] = (reverseMatrix[0][0] * pivotVector[0]) + (reverseMatrix[0][1] * pivotVector[1]);
		transformedVector[1] = (reverseMatrix[1][0] * pivotVector[0]) + (reverseMatrix[1][1] * pivotVector[1]);

		rotatedVector = new Array();
		rotatedVector[0] = pivot[0]+ transformedVector[0];
		rotatedVector[1] = pivot[1]+ transformedVector[1];
		return rotatedVector;
	},

	move : function(direction){
		var temp = new Array();
		for(var i = 0; i<4; i++){
			if(direction === 'DOWN'){
				temp[i] = [piece.position[i][0], (piece.position[i][1] +1)];
			}else if(direction === 'RIGHT'){
				temp[i] = [(piece.position[i][0] + 1), piece.position[i][1]];
			}else if (direction === 'LEFT'){
				temp[i] = [(piece.position[i][0] - 1), piece.position[i][1]];
			}else if (direction === 'TURN'){
				temp[i] = piece.rotate(piece.position[1], piece.position[i]);
			}
		}
		if(!piece.detectColision(temp)){
			for(var i = 0; i<4; i++){
				piece.position[i] = temp[i];
			}
		}
	},

	detectColision : function(p, direction){
	 	for(var i = 0; i<4; i++){
	 		if(piece.floorColision(p[i])){
	 			if(direction === 'DOWN'){
	 				tetris.drawFinalPieceAndCreateNewOne();
	 			}
	 			if(p[i][1] < 2){
	 				tetris.gameEnd = true;
	 			}
	 			return true;
	 			
	 		}
	 		if(piece.wallColision(p[i])){
	 			return true;
	 		}	
	 	}
	 	return false;
	 },

	 floorColision : function(p){
	 	colision = false;
	 	if(p[1] > 21){
	 		colision = true;
	 	}
	 	if(tetris.grid[p[0]] && tetris.grid[p[0]][p[1]] > 0){
	 		colision = true;
	 	}

	 	return colision;
	 },

	 wallColision : function(p){
	 	if(p[0] < 0 || p[0] > 9){
	 		return true;
	 	}
	 	return false;
	 },
};


var tetris = {
	 points: 0,
	 gameEnd : false,
	 timeElapsed : 0,
	 grid :  new Array(),
	 activePiecePosition : null,

	 addPoints: function(lines){
	 	if(!!lines){
	 		if(lines.length === 1){
	 			tetris.points+=100;
	 		}else if(lines.length === 2){
	 			tetris.points+=300;
	 		}else if(lines.length === 3){
	 			tetris.points+=600;
	 		}else if(lines.length === 4){
	 			tetris.points+=1000;
	 		}
	 	}else{
	 		tetris.points+=0.25;
	 	}
	 	console.log(tetris.points);
	 },

	 initialize : function(grid){
	 	var currentShape = shapes.getRandom();
		piece.position = currentShape.position;
		piece.color = currentShape.color;
	 	for (var x = 0; x <= 9; x++) {
	 		grid[x] = new Array();
	 		for (var y = 0; y <= 21; y++) {
	 			grid[x][y] = 0;
	 		};
	 	};
	 },

	 drawFinalPieceAndCreateNewOne: function(){
	 	tetris.grid[piece.position[0][0]][piece.position[0][1]] = piece.color;
	 	tetris.grid[piece.position[1][0]][piece.position[1][1]] = piece.color;
		tetris.grid[piece.position[2][0]][piece.position[2][1]] = piece.color;
		tetris.grid[piece.position[3][0]][piece.position[3][1]] = piece.color;

		var linesToDelete = new Array();
		for (var y = 0; y <= 21; y++) {
			deleteLine = true;
			for (var x = 0; x <= 9; x++) {	 		
	 			var currentLine = tetris.grid[x][y] > 0 ? true : false;
	 			deleteLine = deleteLine && currentLine;
	 		}
	 		if(deleteLine){
	 			linesToDelete.push(y);
	 		}
	 	};
	 	tetris.addPoints(linesToDelete);
	 	for(var i = 0; i< linesToDelete.length; i++){
	 		var lineToDelete = linesToDelete[i];
	 		for (var x = 0; x <= 9; x++) {
	 			tetris.grid[x].splice(lineToDelete, 1);
	 			tetris.grid[x].splice(0, 0, 0);
	 		}	 		
	 	}
	 	var newShape = shapes.getRandom();
		piece.position = newShape.position;
		piece.color = newShape.color;
	 },

	 animatePiece : function(){
		piece.goDown();
	 },

	 draw : function(grid){
	 	for (var x = 0; x <= 9; x++) {
	 		for (var y = 0; y <= 21; y++) {
	 			output.draw(x, y, grid[x][y]);
	 		}
	 	}
	 	output.draw(piece.position[0][0], piece.position[0][1], piece.color);
	 	output.draw(piece.position[1][0], piece.position[1][1], piece.color);
	 	output.draw(piece.position[2][0], piece.position[2][1], piece.color);
	 	output.draw(piece.position[3][0], piece.position[3][1], piece.color);
	 }
};

var output = {
	draw : function(x, y, color){
		var realx = x * BLOCK_SIZE;
		var realy = y * BLOCK_SIZE;
		context.beginPath();
		context.rect(realx, realy, BLOCK_SIZE, BLOCK_SIZE);
		if(color > 0){
			context.fillStyle = colorMap[color];
			context.lineWidth = 2;
		}else{
			context.fillStyle = 'white';
			context.lineWidth = 0.001;
		}
	    context.fill();
	    context.strokeStyle = 'black';
	    context.stroke();
	}
};


window.onload = function(){
	canvas  = document.getElementById("output");
	context = canvas.getContext('2d');
	tetris.initialize(tetris.grid);
	animate(canvas, context, new Date().getTime());
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
  			piece.move('TURN');	
  		}else if(Key._pressed[Key.UP] > 10){
  			piece.move('TURN');
  			Key._pressed[Key.UP] = 1;
  		}
	Key._pressed[Key.UP]++;
  		
  }
  if (Key.isDown(Key.LEFT) > 0){
  		if(Key._pressed[Key.LEFT] === 1){
  			piece.move('LEFT');	
  		}else if(Key._pressed[Key.LEFT] > 10){
  			piece.move('LEFT');
  			Key._pressed[Key.LEFT] = 1;
  		}
	Key._pressed[Key.LEFT]++;
  		
  }
  if (Key.isDown(Key.DOWN) > 0){
  		if(Key._pressed[Key.DOWN] === 1){
  			piece.move('DOWN');	
  		}else if(Key._pressed[Key.DOWN] > 3){
  			piece.move('DOWN');
  			Key._pressed[Key.DOWN] = 1;
  		}
	Key._pressed[Key.DOWN]++;
  		
  }
  if (Key.isDown(Key.RIGHT) > 0){
  		if(Key._pressed[Key.RIGHT] === 1){
  			piece.move('RIGHT');	
  		}else if(Key._pressed[Key.RIGHT] > 10){
  			piece.move('RIGHT');
  			Key._pressed[Key.RIGHT] = 1;
  		}
	Key._pressed[Key.RIGHT]++;
  		
  }
};

document.onkeydown = function(e){
	switch(e.keyCode){
		case 65 : 
			piece.move('LEFT');
			break;
		case 68 : 
			piece.move('RIGHT');
			break;
		case 87 : 
			piece.move('TURN');
			break;
		case 83 : 
			piece.move('DOWN');
			break;
		default:
			return;
	}
}