// Round 5 - Dynamic 2-Second Chaos Blitz with Audio & Polish
const qData = QuestionEngine.generateRound5();

const memory = document.getElementById("memory");
const timer = document.getElementById("timer");
const question = document.getElementById("question");
const questionText = document.getElementById("questionText");
const optionsContainer = document.querySelector(".options");
const cardTitle = document.querySelector(".game-card h1");
const cardDesc = document.querySelector(".game-card .description");

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

// 2-Second fast countdown with urgent ticks
let time = 2;
if (typeof AudioManager !== "undefined") AudioManager.playUrgentTick();

const countdown = setInterval(function () {
    time--;
    timer.textContent = time;

    if (time > 0) {
        if (typeof AudioManager !== "undefined") AudioManager.playUrgentTick();
    }

    if (time <= 0) {
        clearInterval(countdown);
        if (typeof AudioManager !== "undefined") AudioManager.playWhoosh();

        memory.style.display = "none";
        timer.style.display = "none";

        if (cardTitle) cardTitle.textContent = "CHAOS RECALL!";
        if (cardDesc) cardDesc.textContent = "Did your brain catch any of those 10 items?!";

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
    QuestionEngine.showConfidencePopup(5, isCorrect, answer, qData.correctAnswer);
});