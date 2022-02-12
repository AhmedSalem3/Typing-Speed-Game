let levelSelect = document.querySelector("select"),
  chosenLevel = levelSelect.value,
  levelSpan = document.querySelector(".level span"),
  timeSpan = document.querySelector(".level-time span"),
  startBtn = document.querySelector("button.start-game"),
  currentWord = document.querySelector(".the-word"),
  gameInput = document.querySelector("input.game-input"),
  timeLeftSpan = document.querySelector(".time-left span"),
  controls = document.querySelector(".controls"),
  scoreGot = document.querySelector(".score .got"),
  totalScoreSpan = document.querySelector(".score .final"),
  upcomingHolder = document.querySelector(".upcoming-words"),
  resultDiv = document.querySelector(".result");

const words = [
  "Hello",
  "Programming",
  "Code",
  "Javascript",
  "Town",
  "Country",
  "Testing",
  "Youtube",
  "Linkedin",
  "Twitter",
  "Github",
  "Leetcode",
  "Internet",
  "Python",
  "Scala",
  "Destructuring",
  "Paradigm",
  "Styling",
  "Cascade",
  "Documentation",
  "Coding",
  "Funny",
  "Working",
  "Dependencies",
  "Task",
  "Runner",
  "Roles",
  "Test",
  "Rust",
  "Playing",
];
const wordsLength = words.length;
const levels = {
  easy: 5,
  normal: 3,
  hard: 2,
};
let levelTime = levels[chosenLevel];

updateLevelDetails();

function updateLevelVar() {
  chosenLevel = levelSelect.value;
  levelTime = levels[chosenLevel];
  updateLevelDetails();
}
function updateLevelDetails() {
  levelSpan.innerHTML = chosenLevel;
  timeSpan.innerHTML = levelTime;
}

let shuffledArr = genWords(words);
// setting the total score
totalScoreSpan.innerHTML = wordsLength;

function startGame() {
  elementsVisiblity();

  displayWord();
}

function displayWord() {
  gameInput.value = "";

  let duartion = levelTime;

  getNextWord();

  updateUpcoming();

  updateScore();

  let timeLeft = setInterval(() => {
    //
    if (duartion == -1) {
      clearInterval(timeLeft);
      checkAnswer();
      duartion = 0;
    }

    timeLeftSpan.innerHTML = duartion;

    duartion--;
  }, 1000);
}

function updateScore() {
  scoreGot.innerHTML = wordsLength - shuffledArr.length - 1;
}

function updateUpcoming() {
  upcomingHolder.innerHTML = "";
  shuffledArr.forEach((word) => {
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(word));
    upcomingHolder.appendChild(span);
  });
}

function checkAnswer() {
  let answer = gameInput.value.toLowerCase();
  let word = document.querySelector(".the-word").innerHTML.toLowerCase();

  if (answer == word) {
    checkToEndGame();
  } else {
    endGame(false);
  }
}

function checkToEndGame() {
  shuffledArr.length == 0 ? endGame(true) : displayWord();
}

function endGame(status) {
  if (status) {
    resultSpan(
      resultDiv,
      `Congrats!! You Have Completed The Game In ${chosenLevel}`,
      "good"
    );
  } else {
    resultSpan(
      resultDiv,
      `You Have Passed ${wordsLength - shuffledArr.length - 1} words`,
      "bad"
    );
  }

  function resultSpan(appender, message, className) {
    let span = document.createElement("span");
    span.className = className;
    span.appendChild(document.createTextNode(message));

    appender.appendChild(span);
  }
}

function getNextWord() {
  let word = shuffledArr.shift();
  currentWord.innerHTML = word;
}

function genWords(array) {
  // shuffle array
  let currentIndex = array.length,
    random;

  while (currentIndex > 0) {
    random = Math.floor(Math.random() * currentIndex);

    currentIndex--;

    [array[random], array[currentIndex]] = [array[currentIndex], array[random]];
  }

  return array;
}

function elementsVisiblity() {
  let hiddenElements = [upcomingHolder, controls];
  hiddenElements.forEach((e) => e.classList.remove("hidden"));

  let willBeRemoved = [levelSelect, startBtn];
  willBeRemoved.forEach((e) => e.remove());

  gameInput.focus();
}

levelSelect.addEventListener("change", updateLevelVar);
startBtn.addEventListener("click", startGame);

// user clicks the start btn
// we generate the random array
// we display the first word in the array with a function with the index
// then we will start immediately the countdown
// after the countdown finishes we will check with a function whether the word he entered is identical to the given
// if so we will shift that word from the array
// if so we will generate the next word and so on else we wll end game
// everytime we will check to endgame according to the length of the array
// if the length is 0 then we will end game
