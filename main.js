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
  instructionsHolder = document.querySelector(".instructions"),
  resultDiv = document.querySelector(".result"),
  leaderboardHolder = document.querySelector(".leaderboard");

updateLeaderboard();

const words = [
  "Acclimatize",
  "Merge",
  "Restore",
  "Deviate",
  "Manipulate",
  "Refine",
  "Transition",
  "Enlarge",
  "Diminish",
  "Eradicate",
  "Ecosystem",
  "Refuse",
  "Unspoiled",
  "Carnivore",
  "Predator",
  "Prey",
  "Longitude",
  "Latitude",
  "Tide",
  "Marine",
  "Transplant",
  "Vaccine",
  "Antibiotic",
  "Dose",
  "Remedy",
  "Syndrome",
  "Advocate",
  "Abstract",
  "Decay",
  "Audit",
];
const wordsLength = words.length;
const levels = {
  easy: 5,
  normal: 3,
  hard: 2,
};
let levelTime = levels[chosenLevel];

updateLevelTags();

function updateLevelVar() {
  chosenLevel = levelSelect.value;
  levelTime = levels[chosenLevel];
  updateLevelTags();
}
function updateLevelTags() {
  levelSpan.innerHTML = chosenLevel;
  timeSpan.innerHTML = levelTime;
}

let shuffledwordsArr = genWords(words);
// setting the total score
totalScoreSpan.innerHTML = wordsLength;

function startGame() {
  elementsVisiblity();

  displayWord();
}

let firstWord = true;
function displayWord() {
  gameInput.value = "";

  let duartion = levelTime;

  firstWord ? (duartion = levelTime * 2) : "";
  firstWord = false;

  getNextWord();

  updateUpcoming();

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
  scoreGot.innerHTML++;
}

function updateUpcoming() {
  upcomingHolder.innerHTML = "";
  let nextSixWords = shuffledwordsArr.slice(0, 7);

  nextSixWords.forEach((word) => {
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(word));
    upcomingHolder.appendChild(span);
  });
}

function checkAnswer() {
  let answer = gameInput.value.toLowerCase();
  let word = document.querySelector(".the-word").innerHTML.toLowerCase();

  if (answer == word) {
    updateScore();
    checkToEndGame();
  } else {
    endGame(false);
  }
}

function checkToEndGame() {
  shuffledwordsArr.length == 0 ? endGame(true) : displayWord();
}

function endGame(status) {
  let wordsPassed = wordsLength - shuffledwordsArr.length - 1;

  if (status) {
    resultSpan(resultDiv, `You Have Won In ${chosenLevel} Mode`, "good");
  } else {
    resultSpan(resultDiv, `You Have Passed ${wordsPassed} words`, "bad");
  }
  updateLocal(status ? "Win" : "Lose", wordsPassed);

  function updateLocal(status, wordsPassed) {
    let difficultySpan = document.querySelector(".level span");

    let gameObj = {
      game: status,
      difficulty: difficultySpan.innerHTML,
      progress: wordsPassed,
      dateCreated: new Date(),
    };

    let wordsArr = [];

    if (localStorage.getItem("Day1")) {
      wordsArr = JSON.parse(localStorage.getItem("Day1"));
    }

    wordsArr.push(gameObj);

    localStorage.setItem("Day1", JSON.stringify(wordsArr));

    updateLeaderboard();
  }

  function resultSpan(appender, message, className) {
    let span = document.createElement("span");
    span.className = className;
    span.appendChild(document.createTextNode(message));

    appender.appendChild(span);
  }
}

function updateLeaderboard() {
  if (!localStorage.getItem("Day1")) return;
  leaderboardHolder.innerHTML = "";

  let leaderboard = JSON.parse(localStorage.getItem("Day1"));

  leaderboard.forEach((gamePlayed) => {
    let { dateCreated, game: status, progress, difficulty } = gamePlayed;

    leaderBoardSpan();

    function leaderBoardSpan() {
      let message = `${status}, ${progress} words completed in ${difficulty} mode`;
      let span = document.createElement("span");
      span.appendChild(document.createTextNode(message));
      leaderboardHolder.append(span);
    }
  });
}

function getNextWord() {
  let word = shuffledwordsArr.shift();
  currentWord.innerHTML = word;
}

function genWords(wordsArray) {
  // shuffle wordsArray
  let currentIndex = wordsArray.length,
    random;

  while (currentIndex > 0) {
    random = Math.floor(Math.random() * currentIndex);

    currentIndex--;

    [wordsArray[random], wordsArray[currentIndex]] = [
      wordsArray[currentIndex],
      wordsArray[random],
    ];
  }

  return wordsArray;
}

function elementsVisiblity() {
  let hiddenElements = [upcomingHolder, controls];
  hiddenElements.forEach((e) => e.classList.remove("hidden"));

  let willBeRemoved = [levelSelect, startBtn, instructionsHolder];
  willBeRemoved.forEach((e) => e.remove());

  gameInput.focus();
}

levelSelect.addEventListener("change", updateLevelVar);
startBtn.addEventListener("click", startGame);
