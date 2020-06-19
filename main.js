let canvas = document.getElementById("my-canvas");
let ctx;
let gBoardArrayHeight = 20; //Tetris Height
let gBoardArrayWidth = 12; //Tetris width
let startX = 4; //Starting X position
let startY = 0; // Starting Y position
let score = 0;
let winOrLose = ""
let coordinateArray = [...Array(gBoardArrayHeight)].map(e => Array(gBoardArrayWidth).fill(0));
let curTetromino = [[1,0], [0,1], [1,1] [2,1]] //Basic Tetromino
let tetrominos = []; //All types of tetrominos
let tetrominoColors = ["purple", "cyan", "blue", "orange", "green", "red", "olive"] //Color of the Tetromino
let curTetrominoColor; //Current Tetromino color
let gameBoardArray = [...Array(gBoardArrayHeight)].map(e => Array(gBoardArrayWidth).fill(0)); //Gameboard, tracking where other squares are
var lines = 0;
//Stopped shapes array, It will hold a color when a shape stops and is added
let stoppedShapeArray = [...Array(gBoardArrayHeight)].map(e => Array(gBoardArrayWidth).fill(0));
let DIRECTION = {
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
}
let direction
var tetrisLogo = document.createElement("img");
tetrisLogo.src = "tetrislogo.png";
CreateTetrominos()
var randomNumber = Math.floor(Math.random() * tetrominos.length)
var nextTetromino = tetrominos[randomNumber]
var nextTetrominoColor = tetrominoColors[randomNumber]
var vol = document.getElementById("vol")
var levelvalue = document.getElementById("levelvalue")
levelvalue.textContent = vol.value
 //These help display the nextTetromino
var pixelArray = [...Array(4)].map(e => Array(7).fill(0));
var polohaX
var polohaY
class Coordinates {
  constructor(x,y) {
    this.x = x;
    this.y = y
    }
}

function ChangeValue() {
  levelvalue.textContent = vol.value
  level = vol.value;
}
let level = vol.value;

//Direction where the Tetr. is moving, to avoid collisions with walls


vol.addEventListener("change", ChangeValue)
document.getElementById("playbutton").addEventListener("click", SetupCanvas)


//Creates the array "coordinate Array"
// 20 columns 12 rows
//Each element is an Object called "Coordinates" like {x: 11, y: 9}, {x:34, y:9}, these values are representing pixels.
function CreateCoordArray() {
  let i = 0, j = 0;
  for (let y = 9; y <= 446; y += 23) {
    for (let x = 11; x <= 264; x += 23) {
      coordinateArray[i][j] = new Coordinates(x,y) //calls the constructor
      i++
    }
    j++
    i = 0;
  }
}

function SetupCanvas() { //Vytvoří plátno



  canvas = document.getElementById("my-canvas")
  canvas.classList.remove("displaynone")
  ctx = canvas.getContext("2d")
  canvas.width = 936;
  canvas.height = 956;
document.getElementById("start").style.display = "none"

if (window.innerHeight >= 937) {
  ctx.scale(1.95, 1.95) //Double the size of elements.
}
else if (window.innerHeight >= 808) {
  ctx.scale(1.7, 1.7)
}
else  {
  ctx.scale(1.5, 1.5)
}
  //canvas Background
  ctx.fillStyle = "#ffffff";


  //gameBoard background
  ctx.strokeStyle = "black"
  ctx.strokeRect(8, 8, 280, 462);

  ctx.fillStyle = "#fffff2"
  ctx.fillRect(8, 8, 280, 462);

 //Tetris logo
 tetrisLogo = new Image(161,54);
  tetrisLogo.onload = DrawTetrisLogo
  tetrisLogo.src = "tetrislogo.png";

  //Font for score lavel text
  ctx.fillStyle = 'black';
  ctx.font = '21px Arial'
  ctx.fillText("SCORE | LINES", 300, 98);

  //Score rectangle
  ctx.strokeRect(300,107,81,24)
//Lines
ctx.fillText(lines.toString(), 392, 127)
ctx.strokeRect(383,107,81,24)
  //Draw the actual Score
  ctx.fillText(score.toString(), 310, 127);

  ctx.fillText("Level", 300, 161)
  //Level rectangle
  ctx.strokeRect(300,171, 161,24)
  //Draw level
  ctx.fillText(level.toString(), 310, 190)
   //Some more Drawing
  ctx.fillText("Next Tetromino:", 300, 221)

  ctx.strokeRect(300,232,161,92);
  ctx.fillText("CONTROLS", 300, 354);
  ctx.strokeRect(300, 366, 161, 104);
  ctx.font = "19px Arial";
  ctx.fillText("A : Move Left", 310, 388)
  ctx.fillText("D : Move Right", 310, 413)
  ctx.fillText("S : Move Down", 310, 438)
  ctx.fillText("R : Rotate Right", 310, 463)




  document.addEventListener("keydown", HandleKeyPress);
  //Create the array of Tetromino arrays - all possible tetr.

  //Generate random Tetromino
  CreateTetromino();
  createPixelArray()
  //The look up table {x:11 y:34}...
  CreateCoordArray();
  //Draw the Created CreateTetromino
  DrawTetromino();
  DrawSecondTetromino()

  window.setInterval(function() { //Move Down In An Interval
    if(winOrLose != "Game Over") {
      MoveTetrominoDown()
    }
  }, 700 - level * 50)
}

function createPixelArray() {
  var j = -1;

for (let y = 0; y < 92; y += 23) {
  var l = -1;
j++
  for (let x = 0; x < 161; x += 23) {
    l++
    pixelArray[j][l] = ([x, y])
  }

}
}

function DrawSecondTetromino() {

for(let i = 0; i < nextTetromino.length; i++) {
if(JSON.stringify(nextTetromino) == "[[0,0],[1,0],[2,0],[3,0]]"){

  polohaX = nextTetromino[i][0] + 1
  polohaY = nextTetromino[i][1] + 2
}
else {
polohaX = nextTetromino[i][0] + 2
polohaY = nextTetromino[i][1] + 1
}
let coorX = pixelArray[polohaY][polohaX][0]
let coorY = pixelArray[polohaY][polohaX][1]

ctx.fillStyle = nextTetrominoColor


ctx.fillRect(coorX + 300, coorY + 232, 21, 21)
}

  }

function AllSquaresWhite() {


  for (let i = 0; i < 7; i++) {
          for (let v = 0; v < 4; v++) {

            ctx.fillStyle = "white"
             ctx.fillRect(23 * i + 300, 232 + 23 * v, 23,23)
             ctx.strokeRect(300,232,161,92);

          }
  }

}

function DrawTetrisLogo() { //Draws the Tetris Logo, obviously

  ctx.drawImage(tetrisLogo, 300, 8, 161, 54); //image, offset od levého kraje, offset od pravého kraje, šířka, výška
}

function DrawTetromino() {
  //All the places where a square should be drawn
 for(let i = 0; i < curTetromino.length; i++) {
   let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = curTetrominoColor;
    ctx.fillRect(coorX, coorY, 21, 21); //drawing the squares
   }
}

// The logic is this - when a Tetromino is "moved",
// it is deleted, the x or y are changed, and then a new shape is drawn.

function HandleKeyPress(key) { //When user presses w/a/s/d
  if(winOrLose != "Game Over") {
    if(key.keyCode === 65 || key.keyCode === 37) { //A
      direction = DIRECTION.LEFT;
      if(!HittingTheWall() && !CheckForHorizontalCollision())
      {DeleteTetromino();
      startX--;
      DrawTetromino()
    }
    }
    else if (key.keyCode === 68 || key.keyCode ===  39 ) { //D
      direction = DIRECTION.RIGHT
  if(!HittingTheWall() && !CheckForHorizontalCollision()) {
      DeleteTetromino()
      startX++
      DrawTetromino()
    }}
    else if (key.keyCode === 83 || key.keyCode === 40) { //S
      MoveTetrominoDown()
    }

  else if (key.keyCode === 87 || key.keyCode == 38) {
    RotateTetromino();
  }
}
}


function MoveTetrominoDown() {
direction = DIRECTION.DOWN;
 if(!CheckForVetricalCollision()) {
   DeleteTetromino()
   startY++
   DrawTetromino()
 }
}

function DeleteTetromino() { //deletes the current tetromino by making the squares white
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX
    let y = curTetromino[i][1] + startY
    gameBoardArray[x][y] = 0;
    let coorX = coordinateArray[x][y].x
    let coorY = coordinateArray[x][y].y
    ctx.fillStyle = "white"
    ctx.fillRect(coorX, coorY, 21, 21)

  }
}

function CreateTetrominos() {
  // Push T
  tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
  // Push I
  tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
  // Push J
  tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
  // Push Square
  tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
  // Push L
  tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
  // Push S
  tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
  // Push Z
  tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino() { //Random Color, Random Shape
  let randomTetromino = Math.floor(Math.random() * tetrominos.length)
  curTetromino = tetrominos[randomTetromino]
  curTetrominoColor = tetrominoColors[randomTetromino]
}


function HittingTheWall() {
  for (let i = 0; i < curTetromino.length; i++) {
          let newX = curTetromino[i][0] + startX;
          if(newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
          } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
          }

        }
        return false
  } //Is it gonna hit a wall?

function CheckForVetricalCollision() {
  //Making a copy, so we can check for the collision berfore moving the real Tetr.
let tetrominoCopy = curTetromino;
let collision = false;
for(let i = 0; i < tetrominoCopy.length; i++) {
  let square = tetrominoCopy[i];
  let x = square[0] + startX;
  let y = square[1] + startY
  if (direction === DIRECTION.DOWN) {
    y++;
  }

    if(typeof stoppedShapeArray[x][y + 1] === "string"){
      DeleteTetromino();
      startY++;
      DrawTetromino()
      collision = true;
      break;
    }
    if (y >= 20) {
      collision = true;
      break;
    }
    }

    if (collision) {
      if(startY <= 2){
              AllSquaresWhite()
                  winOrLose = "Game Over";
                  ctx.fillStyle = 'white';
                  ctx.fillRect(310, 242, 140, 30);
                  ctx.fillStyle = 'black';

      }
      else {
        for (let i = 0; i < tetrominoCopy.length; i++) {
          let square = tetrominoCopy[i];
          let x = square[0] + startX;
          let y = square[1] + startY;
          stoppedShapeArray[x][y] = curTetrominoColor
        }
        CheckForCompletedRows(); //THIS

         curTetromino = nextTetromino
         curTetrominoColor = nextTetrominoColor
         randomNumber = Math.floor(Math.random() * tetrominos.length)
        nextTetromino = tetrominos[randomNumber]
         nextTetrominoColor = tetrominoColors[randomNumber]

        direction = DIRECTION.IDLE
        startX = 4;
        startY = 0;
        DrawTetromino()
      AllSquaresWhite()
       DrawSecondTetromino()

      }
    }
  }

function CheckForHorizontalCollision() {
  var tetrominoCopy = curTetromino;
  var collision = false;

  // Cycle through all Tetromino squares
  for(var i = 0; i < tetrominoCopy.length; i++)
  {
      // Get the square and move it into position using
      // the upper left hand coordinates
      var square = tetrominoCopy[i];
      var x = square[0] + startX;
      var y = square[1] + startY;

      // Move Tetromino clone square into position based
      // on direction moving
      if (direction == DIRECTION.LEFT){
          x--;
      }else if (direction == DIRECTION.RIGHT){
          x++;
      }

      // Get the potential stopped square that may exist
      var stoppedShapeVal = stoppedShapeArray[x][y];

      // If it is a string we know a stopped square is there
      if (typeof stoppedShapeVal === 'string')
      {
          collision=true;
          break;
      }
  }

  return collision;
}

function CheckForCompletedRows() {
  // 8. Track how many rows to delete and where to start deleting
      let rowsToDelete = 0;
      let startOfDeletion = 0;

      // Check every row to see if it has been completed
      for (let y = 0; y < gBoardArrayHeight; y++)
      {
          let completed = true;
          // Cycle through x values
          for(let x = 0; x < gBoardArrayWidth; x++)
          {
              // Get values stored in the stopped block array
              let square = stoppedShapeArray[x][y];

              // Check if nothing is there
              if (square === 0 || (typeof square === 'undefined'))
              {
                  // If there is nothing there once then jump out
                  // because the row isn't completed
                  completed=false;
                  break;
              }
          }




          // If a row has been completed
          if (completed)
          {
              // 8. Used to shift down the rows
              if(startOfDeletion === 0) startOfDeletion = y;
              rowsToDelete++;

              // Delete the line everywhere
              for(let i = 0; i < gBoardArrayWidth; i++)
              {
                  // Update the arrays by deleting previous squares
                  stoppedShapeArray[i][y] = 0;
                  gameBoardArray[i][y] = 0;
                  // Look for the x & y values in the lookup table
                  let coorX = coordinateArray[i][y].x;
                  let coorY = coordinateArray[i][y].y;
                  // Draw the square as white
                  ctx.fillStyle = 'white';
                  ctx.fillRect(coorX, coorY, 21, 21);

              }
          }
      }
      if(rowsToDelete > 0){

          if(rowsToDelete == 1) { score += 10; lines += 1}
          else if(rowsToDelete == 2) { score += 40; lines += 2}
          else if(rowsToDelete == 3) { score += 80; lines += 3}
          else if(rowsToDelete == 4) { score += 160; lines += 4}

          ctx.fillStyle ="white"
           ctx.fillRect(385, 109, 70, 19);
           ctx.fillStyle = "black"
           ctx.fillText(lines.toString(), 392, 127)

          ctx.fillStyle = 'white';
          ctx.fillRect(310, 109, 70, 19);
          ctx.fillStyle = 'black';
          ctx.fillText(score.toString(), 310, 127);
          MoveAllRowsDown(rowsToDelete, startOfDeletion);

  
      }

}

function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
  for (var i = startOfDeletion-1; i>= 0; i--) {
    for (var x = 0; x < gBoardArrayWidth; x++) {
      var y2 = i + rowsToDelete;
      var square = stoppedShapeArray[x][i];
      var nextSquare = stoppedShapeArray[x][y2];
      if(typeof square === 'string') {
        nextSquare = square;
        gameBoardArray[x][y2] = 1;
        stoppedShapeArray[x][y2] = square;
        let coorX = coordinateArray[x][y2].x;
        let coorY = coordinateArray[x][y2].y;
        ctx.fillStyle = nextSquare;
        ctx.fillRect(coorX, coorY, 21, 21)

        square = 0;
        gameBoardArray[x][i] = 0;
        stoppedShapeArray[x][i] = 0;
        coorX = coordinateArray[x][i].x;
       coorY = coordinateArray[x][i].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 21, 21)

      }
    }
  }
}
function RotateTetromino(){
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for(let i = 0; i < tetrominoCopy.length; i++)
    {

        curTetrominoBU = [...curTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try to draw the new Tetromino rotation
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }
    // If there is an error get the backup Tetromino and
    // draw it instead
    catch (e){
        if(e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

function GetLastSquareX() {
  let lastX = 0;
  for(let i = 0; i < curTetromino.length; i++) {
    let square = curTetromino[i];
    if (square[0] > lastX)
    lastX = square[0]
  }
  return lastX
}
