import * as AuthService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  await AuthService.register(req.body);
  res.status(201).json({ message: "Compte créé" });
};

export const login = async (req, res, next) => {
  const token = await AuthService.login(req.body);
  res.json({ token });
};