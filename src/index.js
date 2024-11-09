console.log("Typing Speed Test Begins!!");
// Global Variables
let totalCharacters = 0;
let correctCharacters = 0;
let startTime;
let timer=10; // Timer in seconds (adjustable as needed)
let timerInterval;


// Element Selectors
const playButton = document.getElementById("playbutton");
const sentenceDisplay = document.getElementById("sentenceDisplay");
const inputField = document.getElementById("inputField");
const results = document.querySelector(".resultsSection");
const timerDisplay = document.getElementById("timerDisplay");

// Sentence Fetching
async function getRandomSentence(wordCount) {
    try {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordCount}`);
        const data = await response.json();
        let sentence = data.join(' ');
        console.log(sentence); 
        return sentence;
    } catch (error) {
        console.log("Failed to fetch sentence:", error);
        return "Error Loading Sentence, please try again";
    }
}

async function displaySentence() {
    // Fetch sentence with 10 words
    const randomSentence = await getRandomSentence(10);
    // Display the words in the HTML content
    sentenceDisplay.textContent = randomSentence;
}

// Event Listeners
playButton.addEventListener('click', startGame);
inputField.addEventListener('input', trackTyping);

// Start the game
function startGame() {
    // Reset game variables and UI elements
    totalCharacters = 0;
    correctCharacters = 0;
    inputField.value = '';
    resultsSection.innerHTML = '';
    startTime = null;
    displaySentence();

    // Show necessary elements
    inputField.style.display = 'block';
    sentenceDisplay.style.display = 'block';
    timerDisplay.style.display = 'block';
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerDisplay.textContent = `Time left: ${timer}s`;
        } else {
            endGame();
        }
    }, 1000);
}

// Tracks the user's typing
function trackTyping(){
    // console.log(startTime);
    if (!startTime) {
        // Record start time on first input
        startTime = new Date();
        console.log("time set:", startTime); 
        startTimer();
    }

    const typedText = inputField.value;
    const sentence = sentenceDisplay.textContent;

    totalCharacters = typedText.length;
    correctCharacters = countCorrectCharacters(typedText, sentence);

    if (typedText === sentence) {
        // End the game if user finishes early
        endGame();
    }

    updateStats();
}

// Counts the number of correct characters
function countCorrectCharacters(typedText, sentence) {
    let correct = 0;
    const minLength = Math.min(typedText.length, sentence.length);

    for (let i = 0; i < minLength; i++) {
        if (typedText[i] === sentence[i]) {
            correct++;
        }
    }

    console.log(correct);
    return correct;
}

// Updates the game stats
function updateStats(){
    const wpm = calculateWPM();
    const accuracy = Math.floor(correctCharacters / totalCharacters) * 100;
    console.log("Accuracy:",accuracy);
    displayResults(wpm, accuracy);
}

// Displays the results
function displayResults(wpm, accuracy){
    resultsSection.innerHTML = `WPM: ${wpm} | Accuracy: ${accuracy}`;
}

// Calculates the words typed per minute
function calculateWPM(){
    // Time in seconds
    const timeElapsed = (new Date() - startTime) / 1000;

    // Return the correct words per minute
    wpm = Math.floor((correctCharacters / 5) / (timeElapsed / 60));
    console.log("Words Per min: ",wpm);
    return wpm;
}

// Ends the game
function endGame(){
    // Stop the timer
    clearInterval(timerInterval);

    // Calculate Final Stats
    const accuracy = Math.floor((correctCharacters / totalCharacters) * 100);

    // Hide input field to stop typing
    inputField.style.display = 'none';

    // Reset timer and game variables if you want to allow restarting
    timer = 10; // Reset to initial timer value
    timerDisplay.textContent = `Time left: ${timer}s`;

    // Display the results
    console.log("words per minute", wpm);
    resultsSection.innerHTML = `<p>Game Over! Your Final WPM: ${wpm} | Accuracy: ${accuracy}%</p>`;

}