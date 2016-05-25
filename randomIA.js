console.log ("This is random IA!");
var iaGame = null;
var RandomIA = function(){ 
	var actualPiece = clone(iaGame.piece);
	var nextPiece = clone(iaGame.nextPiece);

	var nextMove = true;
	var pieceCount = 0;
	var piecePosition = null;
	var rotation = null;
	this.play = function(){
		var hasMoved = false;
		if(piecePosition && piecePosition.position != iaGame.piece.position){
			//Lets rotate
			if(rotation && rotation >0)
			{
				iaGame.move('TURN');
				hasMoved = true;
				rotation--;
			}
			//First move piece on X AXIS.
			var xAxis = iaGame.piece.position[0][0] - piecePosition.position[0][0];
			if(xAxis > 0){
				iaGame.move('LEFT');
				hasMoved = true;
			}
			if(xAxis < 0){
				iaGame.move('RIGHT');
				hasMoved = true;
			}
			if(!hasMoved){
				iaGame.move('DOWN');
			}

			//	iaGame.move('LEFT');
			//	iaGame.move('DOWN');
		}
		if(actualPiece.id != iaGame.piece.id || pieceCount == 0){
			var pieceToMove = pieceCount == 0 ? actualPiece : nextPiece;
			pieceCount++;
			//Means the piece has changed... Time to get new Piece Position!
			var pieceWithRotation = this.findBestPiecePosition(pieceToMove);
			piecePosition = pieceWithRotation.piece;
			rotation = pieceWithRotation.rotation;
			actualPiece = clone(iaGame.piece);
			nextPiece = clone(iaGame.nextPiece);
		}
	};

	this.moveToYPosition = function(fakePiece, yPosition){
		fakePiece.position[0][1] = fakePiece.position[0][1] + yPosition; 
		fakePiece.position[1][1] = fakePiece.position[1][1] + yPosition;
		fakePiece.position[2][1] = fakePiece.position[2][1] + yPosition;
		fakePiece.position[3][1] = fakePiece.position[3][1] + yPosition;
		return fakePiece;
	}

	this.moveToXPosition = function(fakePiece, xPosition){
		fakePiece.position[0][0] = fakePiece.position[0][0] + xPosition; 
		fakePiece.position[1][0] = fakePiece.position[1][0] + xPosition;
		fakePiece.position[2][0] = fakePiece.position[2][0] + xPosition;
		fakePiece.position[3][0] = fakePiece.position[3][0] + xPosition;
		return fakePiece;
	}


	this.addPieceToGrid= function(grid, piece){
		grid[piece.position[0][0]][piece.position[0][1]] = 9;
		grid[piece.position[1][0]][piece.position[1][1]] = 9;
		grid[piece.position[2][0]][piece.position[2][1]] = 9;
		grid[piece.position[3][0]][piece.position[3][1]] = 9;
		return grid;
	}

	this.findBestPiecePosition = function(pieceToMove){
		var finalPiecePosition = null;
		var mostPoints = 0;
		var bestGrid = null;
		var rotate = 0;
		//Clone grid
		var grid = JSON.parse(JSON.stringify(iaGame.grid));
		var originalPiece = clone(pieceToMove);
		for(var r=0; r<4; r++){
		  console.log("rotation is r: "+r); 
			fakePiece = r == 0 ? clone(originalPiece) : clone(doRotate(originalPiece));
			fakePiece = this.moveToXPosition(fakePiece, -5);
			for (var xPosition =0; xPosition <=9; xPosition++){//TODO Why so much cloning?? 
				var totalPoints = 0;
				fakePiece = this.moveToXPosition(fakePiece, 1);
				var yPosition = 21;
				var piecePosition = this.moveToYPosition(clone(fakePiece), yPosition);
				while(this.detectColision(piecePosition.position, grid) && yPosition >0){
					yPosition--;
					piecePosition = this.moveToYPosition(clone(fakePiece), yPosition);
				}
				if(yPosition == 0){
					console.log("xPosition useless: "+xPosition);
					continue; //Useless to continue when I can't put the piece anywhere... let's go to next X
				}
				var gridWithPiece = clone(grid);
				gridWithPiece = this.addPieceToGrid(gridWithPiece, piecePosition);
				for (var x = 0; x <= 9; x++) {
					for (var y = 0; y <= 21; y++) {
						if(gridWithPiece[x][y] != 0){
							totalPoints = totalPoints + (y);
						};
					};
				};
				console.log('totalPoints: '+totalPoints);

				if(mostPoints < totalPoints){
					mostPoints = totalPoints;
					bestGrid = gridWithPiece;
					rotate = r;
					finalPiecePosition = clone(piecePosition);
					this.drawConsoleGrid(gridWithPiece);
				}
			}
		}

		//	this.drawConsoleGrid(bestGrid);
		var pieceWithRotation = {
			rotation: rotate,
			piece : finalPiecePosition
		};
		return pieceWithRotation;
	};

	this.drawConsoleGrid= function(grid){
		for (var y = 0; y <= 9; y++) {
			console.log(grid[y]);
			//		for (var x = 0; x <= 9; x++) {
			//			if(grid[x][y] != 0){
			//				totalPoints = totalPoints + (y);
			//			};
			//		};
		};
	};


	this.detectColision = function(p, grid){
		for(var i = 0; i<4; i++){
			if(this.floorColision(p[i], grid)){
				return true;

			}
			if(this.wallColision(p[i])){
				return true;
			}	
		}
		return false;
	};

	this.floorColision = function(p, grid){
		colision = false;
		if(p[1] > 21){
			colision = true;
		}
		if(grid[p[0]] && grid[p[0]][p[1]] > 0){
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


};
var randomIA = null;
//Wait 500 ms to start random ia...
setTimeout(function(){
	iaGame = allGames[0].tetris;
	randomIA = new RandomIA();
	playGame(); 
}, 500); 
function playGame(){
	setTimeout(function(){
		if(!endGame){
			randomIA.play();	
			playGame();
		}
	}, 100);}
