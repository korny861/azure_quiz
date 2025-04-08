
const card = document.getElementById('card');
const questionText = document.getElementById('questionText');
const answerText = document.getElementById('answerText');
const optionsContainer = document.getElementById('optionsContainer');
const feedbackElement = document.getElementById('feedback');
const ratingContainer = document.getElementById('ratingContainer');

let currentQuestionIndex = 0;
let currentQuestion;
let allQuestions = []; // Array zum Speichern der geladenen Fragen
let shuffledQuestions = [] //Array für  zuällig sortierte Fragen

const counterBox = document.getElementsByClassName('counterBox')
let countRight = 0;
const rightBox = document.getElementById('right');
let countWrong = 0;
const wrongBox = document.getElementById('wrong');
let calcRightPercent = 0;
function setCounterBox (){
    rightBox.innerHTML = '---';
    wrongBox.innerHTML = '---';
}
setCounterBox();

// Funktion zum Mischen des Fragen-Arrays (Fisher-Yates Algorithmus)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Funktion zum Laden der Fragen aus der JSON-Datei
async function loadQuestionsFromJSON() {
    try {
        const response = await fetch('./questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allQuestions = await response.json();
        shuffledQuestions = shuffleArray([...allQuestions]); // Mischen und in neues Array kopieren
        loadQuestion(); // Erste Frage laden, nachdem die Daten geladen wurden
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
        questionText.textContent = 'Fehler beim Laden der Fragen.';
    }
}

function loadQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
        currentQuestion = shuffledQuestions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        answerText.textContent = currentQuestion.explanation;
        optionsContainer.innerHTML = ''; // Vorherige Optionen entfernen
        // Antwortoptionen erstellen
        currentQuestion.options.forEach(option => {
            const optionButton = document.createElement('div');
            optionButton.classList.add('option');
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => checkAnswer(option));
            optionsContainer.appendChild(optionButton);
        });

        feedbackElement.textContent = '';
        card.classList.remove('flipped'); // Karte zurückdrehen
    } else {
        questionText.textContent = "Alle Fragen beantwortet!";
        answerText.textContent = "";
        optionsContainer.innerHTML = '';
        feedbackElement.textContent = '';
        ratingContainer.style.display = 'none';
    }
}

function checkAnswer(selectedAnswer) {
    if (selectedAnswer === currentQuestion.correctAnswer) {
        feedbackElement.textContent = "Richtig!";
        feedbackElement.style.color = 'green';
        countRight++;
        console.log("Richtig: "+countRight);
        rightBox.innerHTML = `Richtig: ${countRight}`;
    } else {
        feedbackElement.textContent = `Falsch. Die richtige Antwort ist: ${currentQuestion.correctAnswer}`;
        feedbackElement.style.color = 'red';
        countWrong++;
        console.log("Falsch: "+countWrong);
        wrongBox.innerHTML = `Falsch: ${countWrong}`;
    }
    card.classList.add('flipped'); // Karte umdrehen, um die Antwort zu zeigen
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 5000); // Nächste Frage nach 5 Sekunden
}

// Karte umdrehen beim Klicken (alternative Möglichkeit, Antwort anzuzeigen)
card.addEventListener('click', () => {
    card.classList.toggle('flipped');
});

function rateQuestion(isCorrect) {
    // Hier könnte die Logik zur Speicherung der Bewertung implementiert werden
    if (isCorrect) {
        console.log("Frage als richtig bewertet.");
    } else {
        console.log("Frage als falsch bewertet.");
    }
    // Optional: Visuelles Feedback für die Bewertung
}

// Laden der Fragen beim Start
loadQuestionsFromJSON();