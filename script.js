




var cont = document.querySelector('#container');

const boxes = document.querySelectorAll('.box');
var flag = 1;
var gameOver = false;
let moves = 0;

// Add sound effects
const enterSound = new Audio('entersound.mp3');
const clickSound = new Audio('tap.mp3');
const winningSound = new Audio('winning.mp3');
const bgsound = new Audio('bgmusic.mp3');





boxes.forEach(function(box) {
  box.addEventListener('click', function() {
    if (box.innerHTML === "" && !gameOver) {
      if (flag == 1) {
        box.innerHTML = "O";
        flag = 0;
      } else {
        box.innerHTML = "X";
        flag = 1;
      }
      moves++;
      checkWinner();
      clickSound.play();
    }
  });
});


var winner = document.querySelector("#winceleb h1");
var winCeleb = document.querySelector("#winceleb");
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (boxes[a].innerHTML === boxes[b].innerHTML && boxes[a].innerHTML === boxes[c].innerHTML && boxes[a].innerHTML !== "") {
      winningSound.play();
 
      winCeleb.style.width= "85vw";
      winCeleb.style.height= "45vh";
     winner.innerHTML="winner is " + boxes[a].innerHTML;
     winner.style.scale="1.5";
      
      boxes[a].style.color = "yellow";
      boxes[b].style.color = "yellow";
      boxes[c].style.color = "yellow";
      gameOver = true;
      setTimeout(function() {
      winCeleb.style.width= "0vw";
      winCeleb.style.height= "0vh";

      winner.innerHTML="";
     winner.style.scale="0";
        resetGame();
      }, 5000);
    }
  }
  if (moves === 9 && !gameOver) {
    setTimeout(function() {

      resetGame();
    }, 2000);
  }
}

function resetGame() {
  boxes.forEach(function(box) {
    box.innerHTML = "";
    box.style.color = "";
  });
  flag = 1;
  gameOver = false;
  moves = 0;
}

var herobtn = document.querySelector("#hero button");
herobtn.addEventListener("click", function() {
  const resetSound = new Audio('restart.mp3');
  resetSound.play();
  resetGame();
});



var a = document.querySelector("#start a");
var startpage = document.querySelector("#start");
var btnn = document.querySelector("#start button");

btnn.addEventListener("click", function() {
  startpage.style.opacity= "0";
cont.style.zIndex="5";
herobtn.style.zIndex="5";
bgsound.play();
bgsound.loop = true;
  enterSound.play();
  btnn.style.width="0";
  btnn.innerHTML="";
});

