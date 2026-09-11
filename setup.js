const playerName = document.getElementById("playerName");
const friendName = document.getElementById("friendName");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", function () {

    const player = playerName.value.trim();
    const friend = friendName.value.trim();

    if (player === "") {
        alert("Bro 😭 enter your name first!");
        playerName.focus();
        return;
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