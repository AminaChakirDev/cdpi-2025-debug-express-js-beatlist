import express from "express";
import cors from "cors";
import playlistRoutes from "./routes/playlist.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());

// 🐛 BUG 1 : errorHandler est branché AVANT les routes
// Express ne l'atteindra jamais depuis une route

app.use("/api/playlists", playlistRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
