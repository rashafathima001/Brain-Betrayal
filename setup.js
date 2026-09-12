const playerName = document.getElementById("playerName");
const friendName = document.getElementById("friendName");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function () {

    const player = playerName.value.trim();
    const friend = friendName.value.trim();

    if (player === "") {
        if (typeof AudioManager !== "undefined") AudioManager.playFail();
        alert("Bro 😭 enter your name first!");
        playerName.focus();
        return;
    }

    if (typeof AudioManager !== "undefined") {
        AudioManager.playTick();
        AudioManager.startBgm();
    }

    // Store player information
    localStorage.setItem("playerName", player);
    localStorage.setItem("friendName", friend);

    // Reset game & session tracking
    localStorage.setItem("score", "0");
    localStorage.setItem("correctAnswers", "0");
    localStorage.setItem("confidenceTotal", "0");
    localStorage.setItem("usedGifs", "[]");

    location.href = "round1.html";
});

[playerName, friendName].forEach(input => {
    if (input) {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                startButton.click();
            }
        });
    }
});