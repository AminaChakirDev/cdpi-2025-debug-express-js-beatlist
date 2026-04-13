import * as PlaylistModel from "../models/playlist.model.js";
import db from "../config/db.js";
import AppError from "../middlewares/AppError.js";

// Le service contient la logique métier
// Il s'appuie sur le model pour accéder aux données

export const getAllPublic = async () => {
  // 🐛 BUG 5 : si on a un async, il faut ...
  return PlaylistModel.findAll();
};

export const getOneWithTracks = async (id) => {
  const rows = await PlaylistModel.findById(id);

  if (rows.length === 0) {
    throw new AppError(404, "Playlist introuvable");
  }

  // Restructuration : une playlist avec un tableau de tracks
  const playlist = {
    id: rows[0].id,
    title: rows[0].title,
    description: rows[0].description,
    is_public: rows[0].is_public,
    user_id: rows[0].user_id,
    tracks: rows
      .filter((r) => r.track_id !== null)
      .map((r) => ({
        id: r.track_id,
        title: r.track_title,
        artist: r.artist,
        duration_seconds: r.duration_seconds,
        genre: r.genre,
      })),
  };

  return playlist;
};

export const createOne = async (data) => {
  // 🐛 BUG 6 : requête SQL directement dans le service — ça appartient au model
  const [result] = await db.query(
    "INSERT INTO playlists (title, description, is_public, user_id) VALUES (?, ?, ?, ?)",
    [data.title, data.description, data.is_public ?? 1, data.user_id]
  );
  return result.insertId;
};

export const updateOne = async (id, data) => {
  const affected = await PlaylistModel.update(id, data);

  if (affected === 0) {
    throw new AppError(404, "Playlist introuvable");
  }
};

export const deleteOne = async (id) => {
  const affected = await PlaylistModel.remove(id);

  if (affected === 0) {
    throw new AppError(404, "Playlist introuvable");
  }
};
