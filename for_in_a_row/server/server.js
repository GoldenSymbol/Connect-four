require('dotnev').config();
const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());

//יצירת משחק חדש
app.post('/games', async (req, res) => {
    const {code} = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO games (code, board, turn) VALUES (?, ?, ?)", [code, JSON.stringify(Array(6).fill().map(()=>Array(7),fill(0))), 1]);
        res.status(201).json({message: "Game created", code});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//קבלת מצב המשחק
app.get('/games/:code', async (req, res) => {
    const {code} = req.params;
    try {
        const [rows] = await db.execute("SELECT * FROM games WHERE code = ?", [code]);
        if (rows.length === 0) return res.status(404).json({error: "Game not found"});
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//עדכון המשחק
app.put('/games/:code/move', async (req, res) => {
    const {code} = req.params;
    const {board, turn, winner} = req.body;
    try {
        await db.execute(
            "UPDATE games SET board = ?, turn = ?, winner = ? WHERE code = ?",
            [JSON.stringify(board), turn, winner || null, code]
        );
        res.json({message: "Game updated"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("server is running on port " + PORT));
