const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const livesBoard = document.getElementById('livesBoard');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartBtn = document.getElementById('restartBtn');

const jumpSound = document.getElementById('jumpSound');
const hitSound = document.getElementById('hitSound');
const gameOverSound = document.getElementById('gameOverSound');
const restartSound = document.getElementById('restartSound');

let score = 0;
let lives = 3;
let isGameOver = false;
let isInvincible = false;
let gameLoop;

let highScore = localStorage.getItem('marioHighScore') || 0;
highScore = Number(highScore);
highScoreElement.textContent = highScore;

function updateLivesDisplay() {
  livesBoard.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const heart = document.createElement('img');
    heart.src = 'img/heart.png';
    heart.alt = 'Vida';
    livesBoard.appendChild(heart);
  }
}

const jump = () => {
  if (isGameOver) return;
  mario.classList.add('jump');
  jumpSound.currentTime = 0;
  jumpSound.play();

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 500);
};

function updateScore() {
  score++;
  scoreElement.textContent = score;

  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
    localStorage.setItem('marioHighScore', highScore);
  }
}

function startGameLoop() {
  gameLoop = setInterval(() => {
    if (isGameOver) return;

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80 && !isInvincible) {
      lives--;
      updateLivesDisplay();
      hitSound.currentTime = 0;
      hitSound.play();
      isInvincible = true;

      if (lives <= 0) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;
        mario.src = "img/game-over.png";
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';

        gameOverScreen.style.display = 'block';
        isGameOver = true;
        clearInterval(gameLoop);
        gameOverSound.currentTime = 0;
        gameOverSound.play();
      } else {
        resetPositions();
        // Invencibilidade temporária (1 segundo)
        setTimeout(() => {
          isInvincible = false;
        }, 1000);
      }
    } else {
      updateScore();
    }
  }, 100);
}

function resetPositions() {
  mario.style.animation = '';
  mario.style.bottom = '0';
  mario.src = "img/mario.gif";
  mario.style.width = '150px';
  mario.style.marginLeft = '0';

  pipe.style.left = '';
  pipe.style.animation = 'pipe-animation 2s infinite linear';
}

function resetGame() {
  isGameOver = false;
  score = 0;
  lives = 3;
  isInvincible = false;

  scoreElement.textContent = score;
  updateLivesDisplay();
  gameOverScreen.style.display = 'none';

  resetPositions();

  restartSound.currentTime = 0;
  restartSound.play();

  startGameLoop();
}

document.addEventListener('keydown', jump);
restartBtn.addEventListener('click', resetGame);

updateLivesDisplay();
startGameLoop();

