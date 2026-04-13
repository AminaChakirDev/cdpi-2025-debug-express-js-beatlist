import db from "../config/db.js";

// Le model ne fait QUE parler à la base de données
// Aucune logique métier ici

export const findAll = async () => {
  // 🐛 BUG 4 : est-ce que le nom des champs correspond existe ?
  const [rows] = await db.query(
    "SELECT id, name, description, is_public, user_id FROM playlists WHERE is_public = 1"
  );
  return rows;
};

export const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT p.*, t.id AS track_id, t.title AS track_title, t.artist, t.duration_seconds, t.genre
     FROM playlists p
     LEFT JOIN tracks t ON t.playlist_id = p.id
     WHERE p.id = ?`,
    [id]
  );
  return rows;
};

export const create = async ({ title, description, is_public, user_id }) => {
  const [result] = await db.query(
    "INSERT INTO playlists (title, description, is_public, user_id) VALUES (?, ?, ?, ?)",
    [title, description, is_public ?? 1, user_id]
  );
  return result.insertId;
};

export const update = async (id, { title, description, is_public }) => {
  const [result] = await db.query(
    "UPDATE playlists SET title = ?, description = ?, is_public = ? WHERE id = ?",
    [title, description, is_public, id]
  );
  return result.affectedRows;
};

export const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM playlists WHERE id = ?",
    [id]
  );
  return result.affectedRows;
};
