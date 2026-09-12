const playerName =
    localStorage.getItem("playerName")
    || "PLAYER";

const friendName =
    localStorage.getItem("friendName")
    || "";

const score =
    parseInt(
        localStorage.getItem("score")
    ) || 0;

const correctAnswers =
    parseInt(
        localStorage.getItem("correctAnswers")
    ) || 0;

const confidenceTotal =
    parseInt(
        localStorage.getItem("confidenceTotal")
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
let trophyEmoji = "🏆";

if (score >= 90) {
    brainType = "🧠 HUMAN HARD DRIVE";
    message = "Bro actually has functioning RAM! True 100% brain power. Respect. 🔥";
    trophyEmoji = "👑";
}
else if (score >= 70) {
    brainType = "📸 SCREENSHOT BRAIN";
    message = "Pretty impressive! Your brain took high-res mental snapshots. 👀";
    trophyEmoji = "🏆";
}
else if (score >= 50) {
    brainType = "🔄 BUFFERING BRAIN";
    message = "Your brain was at 480p buffering most of the time... but survived! 😭";
    trophyEmoji = "🥈";
}
else if (score >= 30) {
    brainType = "🐟 GOLDEN FISH";
    message = "Memory span: 3 seconds. You remembered something, but chaos won. 💀";
    trophyEmoji = "🥉";
}
else {
    brainType = "💀 RESTART REQUIRED";
    message = "Fatal error 404: Brain not found. Please reboot and try again. 😭";
    trophyEmoji = "💀";
}


// ---------------------------
// DISPLAY
// ---------------------------

document.getElementById("playerResult").textContent =
    `${playerName}'S RESULT`;

document.getElementById("score").textContent = score;
document.getElementById("brainType").textContent = brainType;
document.getElementById("accuracy").textContent = `${accuracy}%`;
document.getElementById("confidence").textContent = `${averageConfidence}%`;
document.getElementById("correct").textContent = `${correctAnswers}/5`;
document.getElementById("message").textContent = message;

const trophyEl = document.getElementById("trophyIcon");
if (trophyEl) trophyEl.textContent = trophyEmoji;

// ---------------------------
// FRIEND CHALLENGE CARD
// ---------------------------
const friendCard = document.getElementById("friendChallengeBox");
const friendText = document.getElementById("friendChallengeText");
const friendTitle = document.getElementById("friendChallengeTitle");

if (friendCard && friendName.trim() !== "") {
    friendCard.classList.remove("hidden");
    if (friendTitle) friendTitle.textContent = `CHALLENGE ${friendName.toUpperCase()}! ⚔️`;
    if (friendText) {
        friendText.textContent =
            `You scored ${score}/100! Send ${friendName} this link and see if their brain can beat yours!`;
    }
}

// ---------------------------
// AUDIO & CONFETTI
// ---------------------------
if (typeof AudioManager !== "undefined") {
    if (score >= 70) {
        AudioManager.playSuccess();
    } else if (score < 40) {
        AudioManager.playFail();
    }
}

// Simple celebration confetti on good score
if (score >= 60) {
    launchConfetti();
}

function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#d66cff", "#ff4757", "#2ed573", "#ffa502", "#1e90ff", "#ffffff"];

    for (let i = 0; i < 90; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 4 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 6 - 3
        });
    }

    let frame = 0;
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });

        frame++;
        if (frame < 260) {
            requestAnimationFrame(update);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    update();
}