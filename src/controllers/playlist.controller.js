import * as PlaylistService from "../services/playlist.service.js";
import AppError from "../middlewares/AppError.js";

// Le controller ne fait que recevoir la requête, appeler le service, et répondre
// Aucune logique métier, aucun accès direct à la base

export const getAll = async (req, res, next) => {
  const playlists = await PlaylistService.getAllPublic();
  res.json(playlists);
};

export const getOne = async (req, res, next) => {
  const playlist = await PlaylistService.getOneWithTracks(req.params.id);
  res.json(playlist);
};

export const createPlaylist = async (req, res, next) => {
  const user_id = 1; // simulé — sera remplacé par req.user.id en Phase 2
  const id = await PlaylistService.createOne({ ...req.body, user_id });
  res.status(201).json({ id, ...req.body });
};

export const updatePlaylist = async (req, res, next) => {
  await PlaylistService.updateOne(req.params.id, req.body);
  res.json({ message: "Playlist mise à jour" });
};

export const deletePlaylist = async (req, res, next) => {
  await PlaylistService.deleteOne(req.params.id);
  res.status(204).send();
};
