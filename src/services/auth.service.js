import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/user.model.js";
import AppError from "../middlewares/AppError.js";

export const register = async ({ username, email, password }) => {
  const existing = await UserModel.findByEmail(email);
  if (existing) {
    throw new AppError(409, "Cet email est déjà utilisé");
  }

  const hashed = await bcrypt.hash(password, 10);
  await UserModel.create({ username, email, password: hashed });
};

export const login = async ({ email, password }) => {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError(401, "Email ou mot de passe incorrect");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError(401, "Email ou mot de passe incorrect");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return token;
};
