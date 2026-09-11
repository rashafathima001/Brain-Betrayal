// Round 3 - Dynamic Category Intruder Trap with QuestionEngine
const qData = QuestionEngine.generateRound3();

const memory = document.getElementById("memory");
const timer = document.getElementById("timer");
const question = document.getElementById("question");
const questionText = document.getElementById("questionText");
const optionsContainer = document.querySelector(".options");

// Inject dynamic generated content
memory.textContent = qData.memoryDisplay;
if (questionText) {
    questionText.textContent = qData.questionText;
}

optionsContainer.innerHTML = "";
qData.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.dataset.answer = opt.value;
    btn.textContent = opt.text;
    optionsContainer.appendChild(btn);
});

// Timer countdown
let time = 5;
const countdown = setInterval(function () {
    time--;
    timer.textContent = time;

    if (time <= 0) {
        clearInterval(countdown);
        memory.style.display = "none";
        timer.style.display = "none";
        question.classList.remove("hidden");
    }
}, 1000);

// Answer selection triggers SUDDEN confidence popup
optionsContainer.addEventListener("click", function (e) {
    const button = e.target.closest("button");
    if (!button || button.disabled) return;

    optionsContainer.querySelectorAll("button").forEach(b => {
        b.disabled = true;
        b.classList.remove("selected");
    });
    button.classList.add("selected");

    const answer = button.dataset.answer;
    const isCorrect = (answer === qData.correctAnswer);

    // Sudden confidence popup
    QuestionEngine.showConfidencePopup(3, isCorrect, answer, qData.correctAnswer);
});