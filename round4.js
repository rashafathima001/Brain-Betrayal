// Round 4 - Dynamic Linguistic / Brain Trap with Audio & Polish
const qData = QuestionEngine.generateRound4();

const memory = document.getElementById("memory");
const timer = document.getElementById("timer");
const question = document.getElementById("question");
const questionText = document.getElementById("questionText");
const optionsContainer = document.querySelector(".options");
const cardTitle = document.querySelector(".game-card h1");
const cardDesc = document.getElementById("roundDesc") || document.querySelector(".game-card .description");

// Inject dynamic generated sentence and question
memory.textContent = qData.sentenceDisplay;
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

// Timer countdown with audio ticks
let time = 5;
const countdown = setInterval(function () {
    time--;
    timer.textContent = time;

    if (time <= 2 && time > 0) {
        timer.classList.add("urgent");
        if (typeof AudioManager !== "undefined") AudioManager.playUrgentTick();
    } else if (time > 0) {
        if (typeof AudioManager !== "undefined") AudioManager.playTick();
    }

    if (time <= 0) {
        clearInterval(countdown);
        if (typeof AudioManager !== "undefined") AudioManager.playWhoosh();

        memory.style.display = "none";
        timer.style.display = "none";

        if (cardTitle) cardTitle.textContent = "STROOP TRAP!";
        if (cardDesc) cardDesc.textContent = "Don't let the colors trick your brain!";

        question.classList.remove("hidden");
    }
}, 1000);

// Answer selection triggers SUDDEN confidence popup
optionsContainer.addEventListener("click", function (e) {
    const button = e.target.closest("button");
    if (!button || button.disabled) return;

    if (typeof AudioManager !== "undefined") AudioManager.playTick();

    optionsContainer.querySelectorAll("button").forEach(b => {
        b.disabled = true;
        b.classList.remove("selected");
    });
    button.classList.add("selected");

    const answer = button.dataset.answer;
    const isCorrect = (answer === qData.correctAnswer);

    // Sudden confidence popup
    QuestionEngine.showConfidencePopup(4, isCorrect, answer, qData.correctAnswer);
});