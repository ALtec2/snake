// board
var blockSize = 25;
var rows = 25;
var cols = 25;
var board;
var context;

// snake head
var snakeX;
var snakeY;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];

// food
var foodX;
var foodY;
var foodList = [];

var foodImage = new Image();
foodImage.src = "Assets/Food.png";

var snakeHeadImg = new Image();
snakeHeadImg.src = "Assets/SnekHead.png";

var fallingtilesImage = new Image();
fallingtilesImage.src = "Assets/Trap.png";

var gameOver;
var startUp = false;
var spawnCount = 0;
var fallingObjects = []; 
var warningTiles = []; 
var score = 0;

var angle;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;  
    board.style.border = ".5px solid white"; 
    context = board.getContext("2d");
    onStart();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/7);
}
 
function onStart(){
    let boxWidth = 350;
    let boxHeight = 175; 

    let boxX = (board.width - boxWidth) / 2;
    let boxY = (board.height - boxHeight) / 2;

    context.fillStyle = "black";
    context.fillRect(boxX, boxY, boxWidth, boxHeight);
    context.strokeStyle = "lightblue";
    context.lineWidth = 1;
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);

    context.fillStyle = "white";
    context.font = "bold 24px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Snake Game", board.width / 2, board.height / 2);

    let btn = document.getElementById("restartBtn");
    btn.style.display = "block";
    btn.innerText = "Start Game";
} 

function startGame() {
    startUp = true;
    gameOver = false;
    score = 0;
    
    snakeX = Math.floor(Math.random() * cols) * blockSize;
    snakeY = Math.floor(Math.random() * rows) * blockSize;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    fallingObjects = [];
    warningTiles = [];
    spawnCount = 0;

    placeFood();

    let btn = document.getElementById("restartBtn");
    btn.style.display = "none";
    btn.innerText = "Play Again";
}

function update() {
    if (gameOver) {
        return;
    }
    if (startUp) {
        // Clear board background
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height); 

        // Draw Food Image
        context.drawImage(foodImage, foodX, foodY, blockSize, blockSize);

        // Handle Spawning and Drawing Warnings & Hazards
        spawnFallingObject();
        updateWarnings();

        // Draw Active Hazards (White)
        context.fillStyle = "white";
        for (let i = 0; i < fallingObjects.length; i++) {
            context.drawImage(fallingtilesImage, fallingObjects[i][0], fallingObjects[i][1], blockSize, blockSize);
            
            // Check Hazard Collision
            if (snakeX === fallingObjects[i][0] && snakeY === fallingObjects[i][1]) {
                gameOver = true;
                onEnd();
                return;
            }
        }

        // Check Food Collision
        if (snakeX == foodX && snakeY == foodY) {
        	score++;
            snakeBody.push([foodX, foodY]);
            placeFood();
        }

        // Move Snake Body
        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1]; 
        } 

        if (snakeBody.length) {
            snakeBody[0] = [snakeX, snakeY];
        } 

        // Move Snake Head
        snakeX += velocityX * blockSize;
        snakeY += velocityY * blockSize;

        // Draw Snake Head (using image) & Body (lime blocks)
        context.save();
        context.translate(snakeX + blockSize / 2, snakeY + blockSize / 2);
        context.rotate(angle);
        context.drawImage(snakeHeadImg, -blockSize / 2, -blockSize / 2, blockSize, blockSize); 
        context.restore();
        
        context.fillStyle = "lime";
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
        }

        // Check Wall Collision
        if (snakeX < 0 || snakeX > (cols - 1) * blockSize || snakeY < 0 || snakeY > (rows - 1) * blockSize) {
            gameOver = true; 
            onEnd();
            return;
        }

        // Check Self Collision
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
                gameOver = true;
                onEnd();
                return;
            }
        }
    }
}

function spawnFallingObject() {
    spawnCount++;
    if (spawnCount >= 12) {
        spawnCount = 0;
        let tileX = Math.floor(Math.random() * cols) * blockSize;
        let tileY = Math.floor(Math.random() * rows) * blockSize; 
        
        warningTiles.push({ x: tileX, y: tileY, timer: 6 });
    } 
}

function updateWarnings() {
    context.fillStyle = "grey";
    
    for (let i = warningTiles.length - 1; i >= 0; i--) {
        context.fillRect(warningTiles[i].x, warningTiles[i].y, blockSize, blockSize);
        warningTiles[i].timer--;

        if (warningTiles[i].timer <= 0) {
            fallingObjects.push([warningTiles[i].x, warningTiles[i].y]);
            warningTiles.splice(i, 1);
        }
    }
}

function onEnd(){
    let boxWidth = 350;
    let boxHeight = 175;

    let boxX = (board.width - boxWidth) / 2;
    let boxY = (board.height - boxHeight) / 2;

    context.fillStyle = "black";
    context.fillRect(boxX, boxY, boxWidth, boxHeight);
    context.strokeStyle = "lightblue";
    context.lineWidth = 1;
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);

    context.fillStyle = "white";
    context.font = "bold 24px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over", board.width / 2, board.height / 2 - 50);
    context.fillText("Total Score: "+ score, board.width / 2, board.height / 2 + 50);

    let btn = document.getElementById("restartBtn");
    btn.style.display = "block";
}

function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;

        validPosition = true;

        if (foodX === snakeX && foodY === snakeY) {
            validPosition = false;
            continue;
        }

        for (let i = 0; i < snakeBody.length; i++) {
            if (foodX === snakeBody[i][0] && foodY === snakeBody[i][1]) {
                validPosition = false;
                break;
            } 
        }
    }
}

function changeDirection(e){
    if ((e.code == "ArrowUp" || e.code == "KeyW" )&& velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        angle = Math.PI/2;
    }
    else if ((e.code == "ArrowDown" || e.code == "KeyS" ) && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
        angle = -Math.PI/2;
    }
    else if ((e.code == "ArrowLeft" || e.code == "KeyA" )&& velocityX != 1) { 
        velocityX = -1;
        velocityY = 0;
        angle = 0;
    }
    else if ((e.code == "ArrowRight" || e.code == "KeyD" )&& velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        angle = Math.PI;
    } 
}
