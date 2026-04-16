import { Router } from "express";
// 🐛 BUG 7 : deletePlaylist n'est pas importé bug 1
import {
  getAll,
  getOne,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";
import {
  validatePlaylistBody,
  validatePlaylistId,
} from "../validators/playlist.validator.js";
import validate from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isOwnerOrAdmin } from "../middlewares/isOwnerOrAdmin.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", validatePlaylistId, validate, getOne);
router.post("/", authenticate, validatePlaylistBody, validate, createPlaylist);
router.put(
  "/:id",
  authenticate,
  isOwnerOrAdmin,
  validatePlaylistBody,
  validatePlaylistId,
  validate,
  updatePlaylist,
);
router.delete(
  "/:id",
  authenticate,
  isOwnerOrAdmin,
  validatePlaylistId,
  validate,
  deletePlaylist,
); // ← ReferenceError au démarrage

export default router;
