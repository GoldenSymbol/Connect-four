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

// הצטרפות לחדר קיים או יצירת חדר חדש
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

// קבלת מצב המשחק מהשרת כל 2 שניות
async function pollGame() {
    setInterval(async () => {
        const res = await fetch(`${api}/games/${code}`);
        if (res.ok) {
            const data = await res.json();
            board = JSON.parse(data.board);
            turn = data.turn;
            winner = data.winner;
            renderBoard();
        }
    }, 2000);
}

// הצגת הלוח ומצב המשחק
function renderBoard() {
    boardEl.innerHTML = "";
    turnDisplay.textContent = winner
        ? "Game Over"
        : 'Player turn ${turn}';
    winnerDisplay.textContent = winner
        ? 'The winner is ${winner}!'
        : "";
    for (let r = 0; r < 6; r++) {
        const rowEl = document.createElement("div");
        rowEl.className = "row";
        for (let c = 0; c < 7; c++) {
            const cellEl = document.createElement("div");
            cellEl.className = 'cell p${board[r][c]'};
            cellEl.onclick = () => makeMove(c);
            rowEl.appendChild(cellEl);
        }
        boardEl.appendChild(rowEl);
    }

// ביצוע מהלך ושמירתו בשרת
async function makeMove(col) {
    if (winner) return;
    for (let r = 5; r >= 0; r--) {
        if (board[r][col] === 0) {
            board[r][col] = turn;
            break;
        }
    }

    const newWinner = checkWinner(board);
    const nextTurn = turn === 1 ? 2 : 1;

// עדכון מצב המשחק בשרת
    await fetch(`${api}/games/${code}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            board,
            turn: nextTurn,
            winner: newWinner
        })
    });
    turn = nextTurn;
    winner = newWinner;
    renderBoard();
}

// בדיקת שורות, עמודות ואלכסונים לזיהוי מנצח
function checkWinner(board) {
    const directions = [[0,1],[1,0],[1,1],[1,-1]];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 7; c++) {
            const player = board[r][c];
            if (player) continue;
            for (const [dr, dc] of directions) {
                let count = 1;
                for (let k = 1; k < 4; k++) {
                    const nr = r + dr * k;
                    const nc = c + dc * k;
                    if (nr < 0 || nr >= 6 || nc < 0 || nc >= 7 || board[nr][nc] !== player) break;
                    count++;
                }
                if (count === 4) return player;
            }
        }
    }
    return null;
}