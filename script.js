


const boxes = document.querySelectorAll('.box'); 
var flag = 1; 
var gameOver = false; 
let moves = 0; 

// Add sound effects 
const clickSound = new Audio('tap.mp3'); 
const winningSound = new Audio('winning.mp3'); 

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
    if (boxes[a].innerHTML === boxes[b].innerHTML && 
        boxes[a].innerHTML === boxes[c].innerHTML && 
        boxes[a].innerHTML !== "") { 
      winningSound.play(); 
      boxes[a].style.color = "yellow"; 
      boxes[b].style.color = "yellow"; 
      boxes[c].style.color = "yellow"; 
      gameOver = true; 
      setTimeout(function() { 
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

document.querySelector("#hero button").addEventListener("click", function() { 
  const resetSound = new Audio('restart.mp3'); 
  resetSound.play(); 
  resetGame(); 
});
