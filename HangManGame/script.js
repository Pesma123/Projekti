const words = ["javascript", "hangman", "developer", "function", "variable"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let wrongLetters = [];
let attemptsLeft = 6;

// Select elements
const wordDisplay = document.getElementById("word-display");
const wrongLettersEl = document.getElementById("wrong-letters");
const attemptsLeftEl = document.getElementById("attempts-left");
const keyboard = document.getElementById("keyboard");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");

//update game
const hangmanParts = document.querySelectorAll(".hangman-part");

function updateGame() {
    displayWord();
    wrongLettersEl.textContent = wrongLetters.join(", ");
    attemptsLeftEl.textContent = attemptsLeft;

    if (attemptsLeft <= 2) {
        attemptsLeftEl.classList.add("low");
    } else {
        attemptsLeftEl.classList.remove("low");
    }

    // Show hangman parts gradually
    hangmanParts.forEach((part, index) => {
        part.style.opacity = index < (6 - attemptsLeft) ? "1" : "0";
    });

    if (!wordDisplay.innerHTML.includes("_")) {
        messageEl.textContent = "You Won! 🎉";
        disableKeyboard();
        restartBtn.style.display = "block";
    } else if (attemptsLeft === 0) {
        messageEl.textContent = `Game Over! The word was "${selectedWord}".`;
        disableKeyboard();
        restartBtn.style.display = "block";
    }
}


// Display the word with underscores
function displayWord() {
    wordDisplay.innerHTML = selectedWord
        .split("")
        .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
}

// Handle user input
function handleGuess(letter) {
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) return;

    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
    } else {
        wrongLetters.push(letter);
        attemptsLeft--;
        
        // Add shake effect
        wrongLettersEl.classList.add("shake");
        setTimeout(() => wrongLettersEl.classList.remove("shake"), 500);
    }

    updateGame();
}


// Update the game state
function displayWord() {
    wordDisplay.innerHTML = selectedWord
        .split("")
        .map(letter => {
            if (guessedLetters.includes(letter)) {
                return `<span style="opacity:1; transform: scale(1); animation: fadeIn 0.5s ease;">${letter}</span>`;
            } else {
                return `<span>_</span>`;
            }
        })
        .join(" ");
}


// Disable the keyboard
function disableKeyboard() {
    document.querySelectorAll("#keyboard button").forEach(btn => btn.disabled = true);
}

// Create the keyboard buttons
function createKeyboard() {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    letters.forEach(letter => {
        const btn = document.createElement("button");
        btn.textContent = letter;
        btn.onclick = () => handleGuess(letter);
        keyboard.appendChild(btn);
    });
}

// Restart the game
restartBtn.addEventListener("click", () => {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongLetters = [];
    attemptsLeft = 6;
    messageEl.textContent = "";
    restartBtn.style.display = "none";
    keyboard.innerHTML = "";
    createKeyboard();
    updateGame();
});

// Initialize game
createKeyboard();
displayWord();
