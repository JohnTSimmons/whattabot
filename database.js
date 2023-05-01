sql = require('sqlite3');
require('dotenv').config();

function openDB(){
    var db = new sql.Database(process.env.DATABASE_NAME, sql.SQLITE_OPEN_CREATE, (err) => {
        if (err){
            console.error(err);
        }
        console.log('Connected to the database file.');
    });
    return db;
}

db=openDB()
db.run("CREATE TABLE IF NOT EXISTS topics (ID INTEGER PRIMARY KEY, CONTENT CHAR NOT NULL, AUTHOR CHAR NOT NULL)");
db.close()

function write_topic(msg, auth){
    db = openDB();
    db.run('INSERT INTO topics (CONTENT, AUTHOR) VALUES(?,?)', [msg, auth]);
    db.close();
}

module.exports = {
    write_topic, 
}