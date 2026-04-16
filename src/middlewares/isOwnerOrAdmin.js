import * as PlaylistService from "../services/playlist.service.js";
import AppError from "./AppError.js";

export const isOwnerOrAdmin = async (req, res, next) => {
  const playlist = await PlaylistService.getOneWithTracks(req.params.id);

  if (req.user.id !== playlist.user_id && req.user.role !== "admin") {
    return next(new AppError(403, "Action non autorisée"));
  }

  next();
};