import mysql from "mysql2/promise";

// 🐛 BUG 2 : createConnection crée une connexion unique, non réutilisable
// Pour une API avec plusieurs requêtes simultanées, il faut createPool
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "beatlist",
});

export default db;
