// board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

//snake head
var snakeX = Math.floor(Math.random()* cols)*blockSize;
var snakeY = Math.floor(Math.random()* rows)*blockSize;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];


//food
var foodX;
var foodY;

var gameOver;
var startUp = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;   
    board.style.border = ".5px solid white";
    context = board.getContext("2d");
    onStart();
    document.addEventListener("keyup", changeDirection)
	setInterval(update, 1000/7);
}

function onStart(){


	let boxWidth = 350;
	let boxHeight = 175; 

	let boxX = (board.width-boxWidth)/2;
	let boxY = (board.height-boxHeight)/2;

	context.fillStyle="black";
	context.fillRect(boxX,boxY, boxWidth, boxHeight);
	context.strokeStyle = "lightblue";
	context.lineWidth=1;         
	context.strokeRect(boxX,boxY, boxWidth, boxHeight);

	let btn = document.getElementById("restartBtn");
	btn.style.display = "block";
	btn.innerText = "Start Game";
}

function startGame() {
    startUp = true;
    gameOver = false;
    
    snakeX = Math.floor(Math.random() * cols) * blockSize;
    snakeY = Math.floor(Math.random() * rows) * blockSize;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    placeFood();

    let btn = document.getElementById("restartBtn");
    btn.style.display = "none";
    btn.innerText = "Play Again";
}

function update() {
	

	if(gameOver){
		return;
	}
	if(startUp){
		context.fillStyle = "black";
		context.fillRect(0, 0, board.width, board.height); 

		context.fillStyle = "red";
		context.fillRect(foodX, foodY, blockSize, blockSize);

		if(snakeX == foodX && snakeY == foodY){
			snakeBody.push([foodX+velocityX*blockSize,foodY+velocityY*blockSize])
			placeFood();
		}

		context.fillStyle = "lime";


		for(let i = snakeBody.length-1; i>0;i--){
			snakeBody[i] = snakeBody[i-1]; 
		} 
		if(snakeBody.length){
			snakeBody[0] = [snakeX,snakeY];
		} 

		snakeX+= velocityX*blockSize;
		snakeY+= velocityY*blockSize;

		context.fillRect(snakeX,snakeY, blockSize,blockSize); 

		for(let i = 0; i < snakeBody.length; i++){
			context.fillRect(snakeBody[i][0],snakeBody[i][1], blockSize,blockSize);
		}


		if(snakeX < 0 || snakeX > (cols-1) * blockSize|| snakeY < 0 || snakeY > (rows-1)*blockSize){
			gameOver = true; 
			onEnd();
		}
		for(let i = 0; i < snakeBody.length; i++){
			if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
				gameOver = true;
				onEnd();
			}
		}
	}
}

function onEnd(){
	let boxWidth = 350;
	let boxHeight = 175;

	let boxX = (board.width-boxWidth)/2;
	let boxY = (board.height-boxHeight)/2;

	context.fillStyle="black";
	context.fillRect(boxX,boxY, boxWidth, boxHeight);
	context.strokeStyle = "lightblue";
	context.lineWidth=1;         
	context.strokeRect(boxX,boxY, boxWidth, boxHeight);

	context.fillStyle="white";
	context.font = "bold 24px sans-serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText("Game Over", board.width/2, board.height/2 - 50);

	document.getElementById("restartBtn").style.display = "block";
}

function placeFood(){
	foodX = Math.floor(Math.random()* cols)*blockSize;
	foodY = Math.floor(Math.random()* rows)*blockSize; 
}

function changeDirection(e) {
	if(e.code == "ArrowUp"&& velocityY != 1){
		velocityX = 0;
		velocityY = -1;
	}
	else if(e.code == "ArrowDown"&& velocityY != -1){
		velocityX = 0;
		velocityY = 1;
	}
	else if(e.code == "ArrowLeft"&& velocityX != 1){ 
		velocityX = -1;
		velocityY = 0;
	}
	else if(e.code == "ArrowRight"&& velocityX != -1){
		velocityX = 1;
		velocityY = 0;
	} 
}
