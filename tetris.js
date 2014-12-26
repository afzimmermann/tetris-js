var BLOCK_SIZE = 25;
var GO_DOWN_INTERVAL = 35;
var reverseMatrix = [[0, -1], [1, 0]];
var colorMap = ['', 'purple', 'yellow', '00FFFF', 'orange', 'blue', 'green', 'red', 'brown'];

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
   		//Workaround to clone tetris.piece.
   		return JSON.parse(JSON.stringify(allPieces[randomNumber]));
   	}
 };

function Piece() {
	this.position = null;
	this.color = null;

	this.rotate = function(pivot, point){
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
	};
	
};


function Tetris(playerName) {
	 this.points= 0;
	 this.gameEnd = false;
	 this.grid =  new Array();
	 this.activePiecePosition = null;
	 this.piece = null;
	 this.output = null;
	 this.player = playerName;

	 this.move = function(direction){
		var temp = new Array();
		for(var i = 0; i<4; i++){
			if(direction === 'DOWN'){
				temp[i] = [this.piece.position[i][0], (this.piece.position[i][1] +1)];
			}else if(direction === 'RIGHT'){
				temp[i] = [(this.piece.position[i][0] + 1), this.piece.position[i][1]];
			}else if (direction === 'LEFT'){
				temp[i] = [(this.piece.position[i][0] - 1), this.piece.position[i][1]];
			}else if (direction === 'TURN'){
				temp[i] = this.piece.rotate(this.piece.position[1], this.piece.position[i]);
			}
		}
		if(!this.detectColision(temp, direction)){
			for(var i = 0; i<4; i++){
				this.piece.position[i] = temp[i];
			}
		}
	};

	this.detectColision = function(p, direction){
	 	for(var i = 0; i<4; i++){
	 		if(this.floorColision(p[i])){
	 			if(direction === 'DOWN'){
	 				this.drawFinalPieceAndCreateNewOne();
	 			}
	 			if(p[i][1] < 2){
	 				this.gameEnd = true;
	 			}
	 			return true;
	 			
	 		}
	 		if(this.wallColision(p[i])){
	 			return true;
	 		}	
	 	}
	 	return false;
	 };

	 this.floorColision = function(p){
	 	colision = false;
	 	if(p[1] > 21){
	 		colision = true;
	 	}
	 	if(this.grid[p[0]] && this.grid[p[0]][p[1]] > 0){
	 		colision = true;
	 	}

	 	return colision;
	 };

	 this.wallColision = function(p){
	 	if(p[0] < 0 || p[0] > 9){
	 		return true;
	 	}
	 	return false;
	 };

	 this.addPoints =  function(lines){
	 	if(!!lines){
	 		if(lines.length === 1){
	 			this.points+=100;
	 		}else if(lines.length === 2){
	 			this.points+=300;
	 		}else if(lines.length === 3){
	 			this.points+=600;
	 		}else if(lines.length === 4){
	 			this.points+=1000;
	 		}
	 	}else{
	 		this.points+=0.25;
	 	}
	 	console.log(this.points);
	 };

 	this.goDown = function(){
		var temp = new Array();
		for(var i = 0; i<4; i++){
		 	temp[i] = [this.piece.position[i][0], (this.piece.position[i][1] +1)];
		}
		if(!this.detectColision(temp, 'DOWN')){
			for(var i = 0; i<4; i++){
				this.piece.position[i] = temp[i];
			}
		}
	};

	 this.initialize = function(){
	 	var currentShape = shapes.getRandom();
	 	this.piece = new Piece();
		this.piece.position = currentShape.position;
		this.piece.color = currentShape.color;
	 	for (var x = 0; x <= 9; x++) {
	 		this.grid[x] = new Array();
	 		for (var y = 0; y <= 21; y++) {
	 			this.grid[x][y] = 0;
	 		};
	 	};
	 };

	 this.sendLineOtherPlayers = function(fullLines){
	 	if(fullLines > 1){
	 		var playerGrid = null;
	 		if(this.player === 'player1'){
	 			playerGrid = allGames[1].tetris.grid;
	 		}else{
	 			playerGrid = allGames[0].tetris.grid;
	 		}
	 		var randomEmptyLine = Math.floor((Math.random() * 10));
	 		var linesToInsert = (fullLines == 4 ? fullLines: fullLines-1);
	 		for (var x = 0; x <= 9; x++) {
	 			for(var add = 0; add < linesToInsert; add++){
	 				playerGrid[x].shift();
	 				if(randomEmptyLine === x){
				 		playerGrid[x].splice(21, 0, 0);
	 				}else{
	 					playerGrid[x].splice(21, 0, 8);	
	 				}
	 			}
	 		}
	 	}
	 };

	 this.drawFinalPieceAndCreateNewOne = function(){
	 	this.grid[this.piece.position[0][0]][this.piece.position[0][1]] = this.piece.color;
	 	this.grid[this.piece.position[1][0]][this.piece.position[1][1]] = this.piece.color;
		this.grid[this.piece.position[2][0]][this.piece.position[2][1]] = this.piece.color;
		this.grid[this.piece.position[3][0]][this.piece.position[3][1]] = this.piece.color;

		var linesToDelete = new Array();
		for (var y = 0; y <= 21; y++) {
			deleteLine = true;
			for (var x = 0; x <= 9; x++) {	 		
	 			var currentLine = this.grid[x][y] > 0 ? true : false;
	 			deleteLine = deleteLine && currentLine;
	 		}
	 		if(deleteLine){
	 			linesToDelete.push(y);
	 		}
	 	};
	 	this.sendLineOtherPlayers(linesToDelete.length);
	 	this.addPoints(linesToDelete);
	 	for(var i = 0; i< linesToDelete.length; i++){
	 		var lineToDelete = linesToDelete[i];
	 		for (var x = 0; x <= 9; x++) {
	 			this.grid[x].splice(lineToDelete, 1);
	 			this.grid[x].splice(0, 0, 0);
	 		}	 		
	 	}
	 	var newShape = shapes.getRandom();
		this.piece.position = newShape.position;
		this.piece.color = newShape.color;
	 };

	 this.animatePiece = function(){
	 	this.goDown();
	 };

	 this.draw = function(){
	 	for (var x = 0; x <= 9; x++) {
	 		for (var y = 0; y <= 21; y++) {
	 			this.output.draw(x, y, this.grid[x][y]);
	 		}
	 	}
	 	this.output.draw(this.piece.position[0][0], this.piece.position[0][1], this.piece.color);
	 	this.output.draw(this.piece.position[1][0], this.piece.position[1][1], this.piece.color);
	 	this.output.draw(this.piece.position[2][0], this.piece.position[2][1], this.piece.color);
	 	this.output.draw(this.piece.position[3][0], this.piece.position[3][1], this.piece.color);
	 }
};

function Output(context){
	this.draw = function(x, y, color){
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

