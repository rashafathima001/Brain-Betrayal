// Reaction Screen - Dramatic Answer Reveal with Unique GIFs
const correct = localStorage.getItem("lastCorrect") === "true";
const confidence = parseInt(localStorage.getItem("lastConfidence")) || 50;
const round = parseInt(localStorage.getItem("currentRound")) || 1;

const verdictEyebrow = document.getElementById("verdictEyebrow");
const reactionEmoji = document.getElementById("reactionEmoji");
const reactionTitle = document.getElementById("reactionTitle");
const confidenceLocked = document.getElementById("confidenceLocked");
const scoreDeltaBadge = document.getElementById("scoreDeltaBadge");
const reactionGif = document.getElementById("reactionGif");
const gifFallback = document.getElementById("gifFallback");
const reactionText = document.getElementById("reactionText");
const continueButton = document.getElementById("continueButton");

// ---------------------------
// REACTION GIF SETS
// ---------------------------
const reactionGifs = {
    correct: [
        "./reactions/correct/hype1.gif",
        "./reactions/correct/hype2.gif",
        "./reactions/correct/hype3.gif"
    ],
    wrong: [
        "./reactions/wrong/troll1.gif",
        "./reactions/wrong/troll2.gif",
        "./reactions/wrong/troll3.gif"
    ],
    confidentWrong: [
        "./reactions/confident-wrong/savage1.gif",
        "./reactions/confident-wrong/savage2.gif",
        "./reactions/confident-wrong/savage3.gif"
    ]
};

// Unique GIF Selection Tracker
function getUsedGifs() {
    try {
        return JSON.parse(localStorage.getItem("usedGifs") || "[]");
    } catch (e) {
        return [];
    }
}

function markGifUsed(gifPath) {
    const used = getUsedGifs();
    used.push(gifPath);
    localStorage.setItem("usedGifs", JSON.stringify(used));
}

function getUniqueGif(category) {
    const pool = reactionGifs[category] || [];
    const used = getUsedGifs();

    // Filter out GIFs already shown in this game
    const available = pool.filter(gif => !used.includes(gif));

    let chosen;
    if (available.length > 0) {
        chosen = available[Math.floor(Math.random() * available.length)];
    } else {
        // If all GIFs in this pool were shown, avoid repeating the very last one
        const lastUsed = used[used.length - 1];
        const nonRepeated = pool.filter(g => g !== lastUsed);
        chosen = (nonRepeated.length > 0)
            ? nonRepeated[Math.floor(Math.random() * nonRepeated.length)]
            : pool[Math.floor(Math.random() * pool.length)];
    }

    markGifUsed(chosen);
    return chosen;
}

// Fallback handling if image fails to load
if (reactionGif) {
    reactionGif.addEventListener("error", function () {
        reactionGif.style.display = "none";
        if (gifFallback) gifFallback.style.display = "block";
    });

    reactionGif.addEventListener("load", function () {
        reactionGif.style.display = "block";
        if (gifFallback) gifFallback.style.display = "none";
    });
}

// ---------------------------
// POPULATE DRAMATIC REVEAL
// ---------------------------
if (verdictEyebrow) {
    verdictEyebrow.textContent = `ROUND ${round} / 5 VERDICT`;
}

if (confidenceLocked) {
    confidenceLocked.textContent = `${confidence}%`;
}

let category = "wrong";

if (correct) {
    category = "correct";
    reactionEmoji.textContent = "🔥";
    reactionTitle.textContent = "ITHAANU SAMBHAVAM! 🔥";
    reactionText.textContent = "BRAIN WORKED FOR ONCE! Absolute respect! 😂🔥";

    scoreDeltaBadge.textContent = "+20 POINTS";
    scoreDeltaBadge.className = "score-delta-badge score-delta-plus";
    gifFallback.textContent = "🔥";
}
else if (confidence >= 80) {
    category = "confidentWrong";
    reactionEmoji.textContent = "💀";
    reactionTitle.textContent = "CONFIDENTLY WRONG 💀";
    reactionText.textContent = `ITHRA CONFIDENCE ENGANE KITTI? 😭😂 You were ${confidence}% sure and completely wrong!`;

    scoreDeltaBadge.textContent = "-5 PTS PENALTY";
    scoreDeltaBadge.className = "score-delta-badge score-delta-minus";
    gifFallback.textContent = "💀";
}
else {
    category = "wrong";
    reactionEmoji.textContent = "😭";
    reactionTitle.textContent = "BRAIN.EXE HAS STOPPED 💀";
    reactionText.textContent = "Your brain completely betrayed you. Better luck next round!";

    scoreDeltaBadge.textContent = "+0 POINTS";
    scoreDeltaBadge.className = "score-delta-badge score-delta-minus";
    gifFallback.textContent = "😂";
}

// Set Unique GIF
const gifSrc = getUniqueGif(category);
if (reactionGif && gifSrc) {
    reactionGif.src = gifSrc;
}

// ---------------------------
// CONTINUE BUTTON
// ---------------------------
if (round < 5) {
    continueButton.textContent = `CONTINUE TO ROUND ${round + 1} →`;
} else {
    continueButton.textContent = "SEE FINAL RESULTS 🏆";
}

continueButton.addEventListener("click", function () {
    continueButton.disabled = true;
    continueButton.textContent = "LOADING...";

    if (round < 5) {
        location.href = `round${round + 1}.html`;
    } else {
        location.href = "result.html";
    }
});