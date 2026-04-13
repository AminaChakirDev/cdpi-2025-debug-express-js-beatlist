import { Router } from "express";
// 🐛 BUG 7 : la liste des imports est-elle complète ?
import {
  getAll,
  getOne,
  createPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist); // ← ReferenceError au démarrage

export default router;
