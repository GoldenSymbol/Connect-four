const api = "http://localhost:3000";
let code = "";
let turn = 1;
let winner = null;
let board = Array(6).fill().map(() => Array(7).fill(0));

const roomInput = document.getElementById("room");
const joinBtn = document.getElementById("join");
const coardEl = document.getElementById("board");
const gameEl = document.getElementById("game");
const turnDisplay = document.getElementById("turn");
const winnerDisplay = document.getElementById("winner");
const roomDisplay = document.getElementById("roomDisplay");

joinBtn.onclick = async () => {
    code = roomInput.value,trim();
    if (!code) return alert("Please enter a room code");
    await fetchGame('${api}/games', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({code})
    });
    
    gameEl.classList.remove("hidden");
    roomDisplay.textContent = "room: " + code;

    renderBoard();
    pollGame();
}