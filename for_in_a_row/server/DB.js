let mysql = require('mysql');

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "connect4"
})
conn.connect((err)=>{
    if(err){
        console.log("Error connecting to Db" + err);
        return;
    }
    conn.query("select username, password from users", [], (err, result)=>{
        conn.destroy();
        if(err){
            return;
        }
        for (let i = 0; i < result.length; i++) {
            let username = result[i]["username"];
            let password = result[i]["password"];
            console.log(username + " " + password);
        }
    });
});
