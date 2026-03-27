const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      fileName TEXT,
      description TEXT,
      image TEXT
    )
  `);
});

module.exports = db;
