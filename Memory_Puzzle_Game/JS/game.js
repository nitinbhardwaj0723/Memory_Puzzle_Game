import { levels } from './levels.js';
import { updateUI, showMessage, toggleTheme } from './ui.js';
import { saveData } from './storage.js';

window.toggleTheme = toggleTheme;
window.startGame = startGame;

let currentLevel = 0;
let board = document.getElementById("gameBoard");

let firstCard = null;
let secondCard = null;
let lock = false;

let combo = 0;
let coins = 0;
let timeLeft = 0;
let timer;

function startGame() {
  currentLevel = 0;
  coins = 0;
  startLevel(currentLevel);
}

function startLevel(levelIndex) {
  let level = levels[levelIndex];
  timeLeft = level.time;

  createBoard(level.grid);
  startTimer();
}

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    updateUI(timeLeft, coins, combo);

    if (timeLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

function createBoard(size) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${size}, 80px)`;

  let total = size * size;
  let values = [];

  for (let i = 1; i <= total / 2; i++) {
    values.push(i, i);
  }

  values.sort(() => Math.random() - 0.5);

  values.forEach(val => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = val;

    // ✅ NEW STRUCTURE
    card.innerHTML = `
      <div class="inner">
        <div class="front">?</div>
        <div class="back">${val}</div>
      </div>
    `;

    card.onclick = () => flipCard(card);
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (lock || card === firstCard) return;

  card.classList.add("open");

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lock = true;

    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  if (firstCard.dataset.value === secondCard.dataset.value) {
    combo++;
    coins += 10 + combo * 5;
  } else {
    combo = 0;

    firstCard.classList.remove("open");
    secondCard.classList.remove("open");
  }

  firstCard = null;
  secondCard = null;
  lock = false;

  updateUI(timeLeft, coins, combo);
  checkWin();
}

function checkWin() {
  let all = document.querySelectorAll(".card");
  let open = document.querySelectorAll(".card.open");

  if (all.length === open.length) {
    clearInterval(timer);

    coins += timeLeft * 2;
    saveData("coins", coins);

    showMessage("🎉 Level Complete!");

    currentLevel++;

    if (currentLevel < levels.length) {
      startLevel(currentLevel);
    } else {
      showMessage("🏆 You completed all levels!");
    }
  }
}

function gameOver() {
  clearInterval(timer);
  showMessage("❌ Time Over!");
}