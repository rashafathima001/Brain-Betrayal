const playerName =
    localStorage.getItem("playerName")
    || "PLAYER";


const score =
    parseInt(
        localStorage.getItem("score")
    ) || 0;


const correctAnswers =
    parseInt(
        localStorage.getItem(
            "correctAnswers"
        )
    ) || 0;


const confidenceTotal =
    parseInt(
        localStorage.getItem(
            "confidenceTotal"
        )
    ) || 0;


// ---------------------------
// CALCULATIONS
// ---------------------------

const accuracy =
    Math.round(
        (correctAnswers / 5) * 100
    );


const averageConfidence =
    Math.round(
        confidenceTotal / 5
    );


// ---------------------------
// BRAIN TYPE
// ---------------------------

let brainType;
let message;


if (score >= 90) {

    brainType =
        "🧠 HUMAN HARD DRIVE";

    message =
        "Bro actually has functioning RAM. Respect. 🔥";

}
else if (score >= 70) {

    brainType =
        "📸 SCREENSHOT BRAIN";

    message =
        "Pretty good! Your brain remembered most things. 👀";

}
else if (score >= 50) {

    brainType =
        "🔄 BUFFERING BRAIN";

    message =
        "Your brain is still loading... please wait. 😭";

}
else if (score >= 30) {

    brainType =
        "🐟 GOLDEN FISH";

    message =
        "You remembered something. Just not enough. 💀";

}
else {

    brainType =
        "💀 RESTART REQUIRED";

    message =
        "Please restart your brain and try again. 😭";

}


// ---------------------------
// DISPLAY
// ---------------------------

document.getElementById(
    "playerResult"
).textContent =
    `${playerName}'S RESULT`;


document.getElementById(
    "score"
).textContent =
    score;


document.getElementById(
    "brainType"
).textContent =
    brainType;


document.getElementById(
    "accuracy"
).textContent =
    `${accuracy}%`;


document.getElementById(
    "confidence"
).textContent =
    `${averageConfidence}%`;


document.getElementById(
    "correct"
).textContent =
    `${correctAnswers}/5`;


document.getElementById(
    "message"
).textContent =
    message;