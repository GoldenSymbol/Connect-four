let mysql = require('mysql');

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "connect4_db"
});

conn.connect((err) => {
    if (err) {
        console.error("Error connecting to Db: " + err);
        return;
    }
    conn.query("SELECT username, password FROM users", [], (err, result) => {
        if (err) {
            console.error("Query error: " + err);
            conn.destroy();
            return;
        }
        for (let i = 0; i < result.length; i++) {
            let username = result[i]["username"];
            let password = result[i]["password"];
            console.log(username + " " + password);
        }
        conn.destroy();
    });
});

